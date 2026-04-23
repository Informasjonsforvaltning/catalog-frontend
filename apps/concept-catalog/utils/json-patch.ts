import type { Concept } from "@catalog-frontend/types";
import { omit, pick } from "lodash";
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

const archivedConceptFieldsToKeep: (keyof Concept)[] = [
  "interneFelt",
  "assignedUser",
  "merkelapp",
  "abbreviatedLabel",
];

export const archivedConceptJsonPatchOperations = (
  original: Concept,
  updated: Concept,
): Operation[] => {
  return compare(
    pick(original, archivedConceptFieldsToKeep),
    pick(
      {
        ...original,
        ...updated,
      },
      archivedConceptFieldsToKeep,
    ),
  );
};
