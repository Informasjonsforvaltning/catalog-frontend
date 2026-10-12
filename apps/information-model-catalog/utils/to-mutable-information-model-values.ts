import {
  InformationModel,
  InformationModelContactPoint,
  InformationModelToBeCreated,
  LocalizedStrings,
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
  "modified",
] as const;

const emptyToNull = <T>(value: T | null | undefined): T | null =>
  value == null || isEmpty(value) ? null : value;

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
  };
};
