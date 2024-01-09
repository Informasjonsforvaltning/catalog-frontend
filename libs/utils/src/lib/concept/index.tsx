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
