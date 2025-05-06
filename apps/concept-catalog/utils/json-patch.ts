import type { Concept } from '@catalog-frontend/types';
import { isNull, omit, omitBy } from 'lodash';
import { compare } from 'fast-json-patch';
import { Operation } from 'fast-json-patch';

const conceptMetaDataFieldsToOmit = [
  'endringslogelement',
  'ansvarligVirksomhet',
  'revisjonAvSistPublisert',
  'erSistPublisert',
  'sistPublisertId',
  'gjeldendeRevisjon',
  'originaltBegrep',
  'id',
  'revisjonAv',
];

export const conceptJsonPatchOperations = (original: Concept, updated: Concept): Operation[] => {
  return compare(
    omitBy(omit(original, conceptMetaDataFieldsToOmit), isNull),
    omit(({
      ...original,
      ...updated,
    }), conceptMetaDataFieldsToOmit),
  );
};
