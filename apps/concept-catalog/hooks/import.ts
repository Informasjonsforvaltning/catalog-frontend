import { readString } from 'react-papaparse';
import type { ParseResult } from 'papaparse';
import { Concept } from '@catalog-frontend/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { validOrganizationNumber } from '@catalog-frontend/utils';

const mapToSingleValue = (csvMap: Record<string, string[]>, key: string) => {
  const value = csvMap[key];
  if (value && value.length !== 1) {
    throw new Error(`Forventet bare en verdi med kolonnenavn: ${key}, men det var ${value.length}`);
  }

  return value ? value[0] : undefined;
};

const mapRowToLanguageValue = (csvMap: Record<string, string[]>, columnName: string): Record<string, string> => {
  return Object.entries(csvMap).reduce((prev, [key, [value]]) => {
    if (value && key.startsWith(`${columnName}:`)) {
      const [field, language] = key.split(':');

      return { ...prev, ...(field && { [language ?? 'nb']: value }) };
    }

    return prev;
  }, {});
};

const mapRowToLanguageValueList = (csvMap: Record<string, string[]>, columnName: string): Record<string, string[]> => {
  return Object.entries(csvMap).reduce((prev, [key, [value]]) => {
    if (value && key.startsWith(`${columnName}:`)) {
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
  type: 'definisjon' | 'definisjon_for_allmennheten' | 'definisjon_for_spesialister',
) => {
  const forholdTilKilde = mapToSingleValue(csvMap, `${type}:forhold_til_kilde`);
  if (forholdTilKilde && forholdTilKilde?.toLowerCase() === 'egendefinert') {
    return {
      forholdTilKilde,
      kilde: [],
    };
  }

  const formatterteKilder = csvMap[`${type}:kilde`]?.map((kilde) => {
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
  const version = mapToSingleValue(csvMap, 'versjon') || '0.1.0';

  return {
    originaltBegrep: mapToSingleValue(csvMap, 'originalt_begrep') ?? '',
    versjonsnr: {
      major: parseInt(version.split('.')?.[0] ?? '0', 10),
      minor: parseInt(version.split('.')?.[1] ?? '0', 10),
      patch: parseInt(version.split('.')?.[2] ?? '0', 10),
    },
    revisjonAv: mapToSingleValue(csvMap, 'revisjonAv') ?? '',
    anbefaltTerm: { navn: mapRowToLanguageValue(csvMap, 'anbefalt_term') },
    tillattTerm: mapRowToLanguageValueList(csvMap, 'tillatt_term'),
    frarådetTerm: mapRowToLanguageValueList(csvMap, 'frarådet_term'),
    definisjon: {
      tekst: mapRowToLanguageValue(csvMap, 'definisjon'),
      kildebeskrivelse: mapKilde(csvMap, 'definisjon'),
    },
    definisjonForAllmennheten: {
      tekst: mapRowToLanguageValue(csvMap, 'definisjon_for_allmennheten'),
      kildebeskrivelse: mapKilde(csvMap, 'definisjon_for_allmennheten'),
    },
    definisjonForSpesialister: {
      tekst: mapRowToLanguageValue(csvMap, 'definisjon_for_spesialister'),
      kildebeskrivelse: mapKilde(csvMap, 'definisjon_for_spesialister'),
    },
    merknad: mapRowToLanguageValue(csvMap, 'merknad'),
    eksempel: mapRowToLanguageValue(csvMap, 'eksempel'),
    fagområde: mapRowToLanguageValueList(csvMap, 'fagområde'),
    gyldigFom: mapToSingleValue(csvMap, 'gyldig_fom'),
    gyldigTom: mapToSingleValue(csvMap, 'gyldig_tom'),

    omfang: {
      uri: mapToSingleValue(csvMap, 'verdiområde:uri'),
      tekst: mapToSingleValue(csvMap, 'verdiområde:tekst'),
    },
    seOgså: mapToSingleValue(csvMap, 'se_også')?.split('|') ?? [],
    kontaktpunkt: {
      harEpost: mapToSingleValue(csvMap, 'kontaktpunkt:epost'),
      harTelefon: mapToSingleValue(csvMap, 'kontaktpunkt:telefon'),
    },
    assignedUser: mapToSingleValue(csvMap, 'tildelt_bruker_id') ?? '',
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
    mutationFn: async (file: File) => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject('Invalid catalog id');
      }

      const content = await file.text();
      let parsedText = [];
      if (file.type === 'application/json') {
        parsedText = await attemptToParseJsonFile(content);
      } else if (file.type === 'text/csv') {
        parsedText = await attemptToParseCsvFile(content);
      } else {
        Promise.reject('Invalid file type');
      }

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
          return Promise.reject('Unauthorized');
        }

        if (response.status > 399) {
          const errorMessage = await response.text();
          return Promise.reject(errorMessage);
        }

        return Promise.resolve();
      }

      return Promise.reject('Canceled');
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['searchConcepts'] });
    },
  });
};
