import type { Concept } from "@catalog-frontend/types";
import { omit } from "lodash";
import { compare } from "fast-json-patch";
import { Operation } from "fast-json-patch";

const conceptMetaDataFieldsToOmit = [
  "endringslogelement",
  "ansvarligVirksomhet",
  "revisjonAvSistPublisert",
  "erSistPublisert",
  "sistPublisertId",
  "gjeldendeRevisjon",
  "originaltBegrep",
  "id",
  "revisjonAv",
  "erPublisert",
  "isArchived",
  "publiseringsTidspunkt",
];

export const conceptJsonPatchOperations = (
  original: Concept,
  updated: Concept,
): Operation[] => {
  return compare(
    omit(original, conceptMetaDataFieldsToOmit),
    omit(
      {
        ...original,
        ...updated,
      },
      conceptMetaDataFieldsToOmit,
    ),
  );
};
