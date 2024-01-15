import { Concept, Definisjon } from '@catalog-frontend/types';

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
