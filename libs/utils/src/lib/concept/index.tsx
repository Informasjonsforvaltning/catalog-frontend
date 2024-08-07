import { CodeList, Concept, Definisjon } from '@catalog-frontend/types';
import { conceptIdFromUriRegex } from '../regex/regex';
import { ensureStringArray } from '../text/text';
import { getTranslateText } from '../language/translateText';
import { convertCodeListToTreeNodes, getPath } from '../code-list';

export const removeSourceIfEgendefinert = (def?: Definisjon): Definisjon | undefined => {
  if (!def) {
    return undefined;
  }
  return {
    ...def,
    kildebeskrivelse: def.kildebeskrivelse && {
      forholdTilKilde: def.kildebeskrivelse.forholdTilKilde,
      kilde: def.kildebeskrivelse.forholdTilKilde === 'egendefinert' ? [] : def.kildebeskrivelse.kilde,
    },
  };
};

export const updateDefinitionsIfEgendefinert = (cr: Concept): Concept => {
  return {
    ...cr,
    definisjon: removeSourceIfEgendefinert(cr.definisjon),
    definisjonForAllmennheten: removeSourceIfEgendefinert(cr.definisjonForAllmennheten),
    definisjonForSpesialister: removeSourceIfEgendefinert(cr.definisjonForSpesialister),
  };
};

export const pruneEmptyProperties = (obj: any, reduceAsArray = false): any => {
  if (!obj) {
    return null;
  }
  const filteredKeys = Object.keys(obj).filter(
    (key) => obj[key] != null && obj[key] !== '' && (Array.isArray(obj[key]) ? obj[key].length !== 0 : true),
  );

  return reduceAsArray
    ? filteredKeys.reduce((acc, key) => {
        if (typeof obj[key] === 'object') {
          const prunedObject = pruneEmptyProperties(obj[key]);
          return Object.keys(prunedObject).length === 0 ? acc : [...acc, prunedObject];
        }
        return [...acc, obj[key]];
      }, [] as any[])
    : filteredKeys.reduce((acc, key) => {
        if (typeof obj[key] === 'object') {
          const isArray = Array.isArray(obj[key]);
          const prunedObject = pruneEmptyProperties(obj[key], isArray);
          return Object.keys(prunedObject).length === 0 ? acc : { ...acc, [key]: prunedObject };
        }
        return { ...acc, [key]: obj[key] };
      }, {});
};

export const getConceptIdFromRdfUri = (baseUri: string | undefined, uri: string | undefined): string | undefined => {
  return baseUri && uri?.startsWith(baseUri) ? uri?.split('/').pop() : undefined;
};

export const getUniqueConceptIdsFromUris = (uris: string[]): string[] => {
  const ids = uris.map((uri) => uri.match(conceptIdFromUriRegex)?.[1]).filter((id): id is string => !!id);
  return [...new Set(ids)];
};

export const getConceptSubject = (concept: Concept, subjectCodeList?: CodeList): string => {
  if (subjectCodeList && concept?.fagområdeKoder?.[0]) {
    const path = getPath(convertCodeListToTreeNodes(subjectCodeList?.codes), concept.fagområdeKoder[0]);
    return path.map((item) => item.label).join(' - ');
  }

  return ensureStringArray(getTranslateText(concept.fagområde)).join(' ');
};
