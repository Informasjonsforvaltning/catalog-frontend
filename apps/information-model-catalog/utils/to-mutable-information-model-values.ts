import {
  InformationModel,
  InformationModelContactPoint,
  InformationModelToBeCreated,
  LocalizedStrings,
  ModelDocument,
} from "@catalog-frontend/types";
import { normalizeVersion, removeEmptyValues } from "@catalog-frontend/utils";
import { isEmpty, pick } from "lodash";

/** Fields accepted by catalog-backend InformationModelValues (mutable via JSON Patch). */
const MUTABLE_INFORMATION_MODEL_FIELDS = [
  "title",
  "description",
  "contactPoints",
  "status",
  "homepage",
  "version",
  "creator",
  "subjects",
  "relations",
  "hasFormat",
  "issued",
  "modified",
] as const;

const emptyToNull = <T>(value: T | null | undefined): T | null =>
  value == null || isEmpty(value) ? null : value;

const emptyStringToUndefined = (
  value: string | null | undefined,
): string | undefined => (value == null || value === "" ? undefined : value);

const emptyLocalizedToNull = (
  value: LocalizedStrings | null | undefined,
): LocalizedStrings | null => {
  if (value == null) {
    return null;
  }
  const cleaned = Object.fromEntries(
    Object.entries(value).filter(([, text]) => text != null && text !== ""),
  ) as LocalizedStrings;
  return isEmpty(cleaned) ? null : cleaned;
};

const isBlankContactPoint = (contactPoint: InformationModelContactPoint) =>
  emptyLocalizedToNull(contactPoint.name) == null &&
  !contactPoint.email &&
  !contactPoint.telephone &&
  !contactPoint.url;

const emptyContactPointsToNull = (
  contactPoints: InformationModelContactPoint[] | null | undefined,
): InformationModelContactPoint[] | null => {
  if (contactPoints == null || contactPoints.length === 0) {
    return null;
  }
  const meaningful = contactPoints
    .filter((contactPoint) => !isBlankContactPoint(contactPoint))
    .map((contactPoint) => ({
      ...contactPoint,
      name: emptyLocalizedToNull(contactPoint.name) ?? undefined,
    }));
  return meaningful.length > 0 ? meaningful : null;
};

const isBlankModelDocument = (document: ModelDocument) =>
  emptyLocalizedToNull(document.title) == null &&
  !document.language &&
  !document.format &&
  !document.seeAlso;

const emptyHasFormatToNull = (
  documents: ModelDocument[] | null | undefined,
): ModelDocument[] | null => {
  if (documents == null || documents.length === 0) {
    return null;
  }
  const meaningful = documents
    .filter((document) => !isBlankModelDocument(document))
    .map((document) => ({
      title: emptyLocalizedToNull(document.title) ?? undefined,
      language: emptyStringToUndefined(document.language),
      format: emptyStringToUndefined(document.format),
      seeAlso: emptyStringToUndefined(document.seeAlso),
    }));
  return meaningful.length > 0 ? meaningful : null;
};

export const toMutableInformationModelValues = (
  model: InformationModel | InformationModelToBeCreated,
) => {
  const mutable = removeEmptyValues(
    pick(model, MUTABLE_INFORMATION_MODEL_FIELDS),
  );

  return {
    ...mutable,
    title: emptyLocalizedToNull(model.title),
    description: emptyLocalizedToNull(model.description),
    contactPoints: emptyContactPointsToNull(model.contactPoints),
    version: normalizeVersion(model.version),
    subjects: emptyToNull(model.subjects),
    relations: emptyToNull(model.relations),
    hasFormat: emptyHasFormatToNull(model.hasFormat),
  };
};
