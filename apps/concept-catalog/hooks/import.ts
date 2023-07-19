import { readString } from 'react-papaparse';
import type { ParseResult } from 'papaparse';

import { Concept, Status } from '@catalog-frontend/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { validOrganizationNumber } from '@catalog-frontend/utils';
import { signIn } from 'next-auth/react';

const mapToSingleValue = (csvMap: Record<string, string[]>, key: string) => {
  const value = csvMap[key];
  if (value && value.length !== 1) {
    throw new Error(`Forventet bare en verdi med kolonnenavn: ${key}, men det var ${value.length}`);
  }

  return value ? value[0] : undefined;
};

const mapRowToLanguageValue = (csvMap: Record<string, string[]>, columnName: string): Record<string, string> => {
  return Object.entries(csvMap).reduce((prev, [key, [value]]) => {
    if (value && key.startsWith(columnName)) {
      const [field, language] = key.split(':');

      return { ...prev, ...(field && { [language ?? 'nb']: value }) };
    }

    return prev;
  }, {});
};

const mapRowToLanguageValueList = (csvMap: Record<string, string[]>, columnName: string): Record<string, string[]> => {
  return Object.entries(csvMap).reduce((prev, [key, [value]]) => {
    if (value && key.startsWith(columnName)) {
      const [field, language] = key.split(':');

      return {
        ...prev,
        ...(field && { [language ?? 'nb']: value.split('|') }),
      };
    }

    return prev;
  }, {});
};

const createCsvMap = (header: string[], data: string[]) => {
  const csvMap: Record<string, string[]> = {};
  header.forEach((colHeader, index) => {
    const colHeaderLC = colHeader.toLowerCase().replace(/\s/g, '');
    if (data[index]) {
      if (csvMap[colHeaderLC]) {
        csvMap[colHeaderLC] = [...csvMap[colHeaderLC], data[index]];
      } else {
        csvMap[colHeaderLC] = [data[index]];
      }
    }
  });
  return csvMap;
};

const mapKilde = (
  csvMap: Record<string, string[]>,
  type: 'definisjon' | 'folkeligForklaring' | 'rettsligForklaring',
) => {
  const forholdTilKilde = mapToSingleValue(csvMap, `${type}Forholdtilkilde`);
  if (forholdTilKilde && forholdTilKilde?.toLowerCase() === 'egendefinert') {
    return {
      forholdTilKilde,
      kilde: [],
    };
  }

  const formatterteKilder = csvMap[`${type}Kilde`]?.map((kilde) => {
    const [tekst, uri] = kilde.split('|');
    if (!tekst && !uri) {
      throw new Error(`Kilder skal være på følgende format "kilde|uri", men var følgende:  ${kilde}`);
    }
    return { tekst, uri };
  });
  return forholdTilKilde && formatterteKilder
    ? {
        forholdTilKilde,
        kilde: formatterteKilder,
      }
    : undefined;
};

const mapCsvTextToConcept = (columnHeaders: string[], data: string[]): Omit<Concept, 'id' | 'ansvarligVirksomhet'> => {
  const csvMap = createCsvMap(columnHeaders, data);
  return {
    originaltBegrep: mapToSingleValue(csvMap, 'originaltBegrep') ?? '',
    versjonsnr: {
      major: parseInt(mapToSingleValue(csvMap, 'major') ?? '0', 10),
      minor: parseInt(mapToSingleValue(csvMap, 'minor') ?? '0', 10),
      patch: parseInt(mapToSingleValue(csvMap, 'patch') ?? '0', 10),
    },
    revisjonAv: mapToSingleValue(csvMap, 'revisjonAv') ?? '',
    anbefaltTerm: { navn: mapRowToLanguageValue(csvMap, 'anbefaltterm') },
    tillattTerm: mapRowToLanguageValueList(csvMap, 'tillattterm'),
    frarådetTerm: mapRowToLanguageValueList(csvMap, 'frarådetterm'),
    definisjon: {
      tekst: mapRowToLanguageValue(csvMap, 'definisjon'),
      kildebeskrivelse: mapKilde(csvMap, 'definisjon'),
    },
    folkeligForklaring: {
      tekst: mapRowToLanguageValue(csvMap, 'folkeligForklaring'),
      kildebeskrivelse: mapKilde(csvMap, 'folkeligForklaring'),
    },
    rettsligForklaring: {
      tekst: mapRowToLanguageValue(csvMap, 'rettsligForklaring'),
      kildebeskrivelse: mapKilde(csvMap, 'rettsligForklaring'),
    },
    merknad: mapRowToLanguageValueList(csvMap, 'merknad'),
    eksempel: mapRowToLanguageValueList(csvMap, 'eksempel'),
    fagområde: mapRowToLanguageValue(csvMap, 'fagområde'),
    bruksområde: mapRowToLanguageValueList(csvMap, 'bruksområde'),
    gyldigFom: mapToSingleValue(csvMap, 'gyldigfom'),
    gyldigTom: mapToSingleValue(csvMap, 'gyldigtom'),

    omfang: {
      uri: mapToSingleValue(csvMap, 'omfang_uri'),
      tekst: mapToSingleValue(csvMap, 'omfang_tekst'),
    },
    seOgså: csvMap?.seogså?.[0]?.split('|') ?? [],
    kontaktpunkt: {
      harEpost: mapToSingleValue(csvMap, 'kontaktpunkt_epost'),
      harTelefon: mapToSingleValue(csvMap, 'kontaktpunkt_telefon'),
    },
    status: (mapToSingleValue(csvMap, 'status') ?? 'utkast') as Status,
    tildeltBruker: {
      id: mapToSingleValue(csvMap, 'tildeltBruker_id') ?? '',
    },
  };
};

const attemptToParseJsonFile = (text: string): Promise<Omit<Concept, 'id' | 'ansvarligVirksomhet'>[]> => {
  return new Promise((resolve, reject) => {
    try {
      const json = JSON.parse(text);

      resolve(Array.isArray(json) ? json : []);
    } catch (error: any) {
      reject(error);
    }
  });
};

const attemptToParseCsvFile = (text: string): Promise<Omit<Concept, 'id' | 'ansvarligVirksomhet'>[]> => {
  return new Promise((resolve, reject) => {
    try {
      readString(text, {
        worker: true,
        skipEmptyLines: true,
        complete: ({ data: [columnHeaders, ...rows], errors }: ParseResult<any>) => {
          if (errors.length > 0) {
            reject(errors[0]);
          }

          resolve(rows.map((row: any) => mapCsvTextToConcept(columnHeaders as string[], row as string[])));
        },
      });
    } catch (error: any) {
      reject(error);
    }
  });
};

export const useImportConcepts = (catalogId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['importConcepts'],
    mutationFn: async (content: string) => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid catalog id');
      }

      const parsedText =
        (await attemptToParseJsonFile(content)) ??
        (await attemptToParseCsvFile(content)) ??
        (await Promise.resolve([]));
      const concepts = parsedText?.map(
        (concept) =>
          ({
            ...concept,
            ansvarligVirksomhet: { id: catalogId },
          } as Concept),
      );

      if (
        window.confirm(
          `Du er i ferd med å importere ${concepts.length} begreper. Dette vil opprette nye begreper i katalogen. Fortsette?`,
        )
      ) {
        const response = await fetch('/api/concepts/import', { method: 'POST', body: JSON.stringify(concepts) });

        if (response.status === 401) {
          signIn('keycloak');
          return;
        }

        return response;
      }

      return Promise.reject('Canceled');
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['searchConcepts'] });
    },
  });
};
