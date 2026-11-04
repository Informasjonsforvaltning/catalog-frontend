import {
  InformationModelContactPoint,
  InformationModelToBeCreated,
  LocalizedStrings,
  ModelDocument,
  ResourceRelation,
  Version,
} from "@catalog-frontend/types";

type UnknownRecord = Record<string, unknown>;

class InvalidShapeError extends Error {}

const invalid = (field: string): never => {
  throw new InvalidShapeError(field);
};

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === "string";

const isNonNegativeInteger = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value) && value >= 0;

const isAbsent = (value: unknown): value is null | undefined =>
  value === undefined || value === null;

const toRecord = (value: unknown, field: string): UnknownRecord =>
  isRecord(value) ? value : invalid(field);

const toArray = (value: unknown, field: string): unknown[] =>
  Array.isArray(value) ? value : invalid(field);

const toOptionalString = (
  value: unknown,
  field: string,
): string | null | undefined =>
  isAbsent(value) || isString(value) ? value : invalid(field);

const toOptionalStringOrUndefined = (
  value: unknown,
  field: string,
): string | undefined => toOptionalString(value, field) ?? undefined;

const toLocalizedStrings = (
  value: unknown,
  field: string,
): LocalizedStrings => {
  const result: LocalizedStrings = {};
  for (const [language, text] of Object.entries(toRecord(value, field))) {
    if (text === undefined) {
      continue;
    }
    if (isString(text) || (Array.isArray(text) && text.every(isString))) {
      result[language] = text;
    } else {
      invalid(`${field}.${language}`);
    }
  }
  return result;
};

const toOptionalLocalizedStrings = (
  value: unknown,
  field: string,
): LocalizedStrings | null | undefined =>
  isAbsent(value) ? value : toLocalizedStrings(value, field);

const toOptionalArray = <T>(
  value: unknown,
  field: string,
  toItem: (item: unknown, field: string) => T,
): T[] | null | undefined =>
  isAbsent(value)
    ? value
    : toArray(value, field).map((item, index) =>
        toItem(item, `${field}[${index}]`),
      );

const toContactPoint = (
  value: unknown,
  field: string,
): InformationModelContactPoint => {
  const record = toRecord(value, field);
  return {
    name: toOptionalLocalizedStrings(record.name, `${field}.name`) ?? undefined,
    email: toOptionalStringOrUndefined(record.email, `${field}.email`),
    telephone: toOptionalStringOrUndefined(
      record.telephone,
      `${field}.telephone`,
    ),
    url: toOptionalStringOrUndefined(record.url, `${field}.url`),
  };
};

const toResourceRelation = (
  value: unknown,
  field: string,
): ResourceRelation => {
  const record = toRecord(value, field);
  return {
    type: toOptionalStringOrUndefined(record.type, `${field}.type`),
    source: toOptionalStringOrUndefined(record.source, `${field}.source`),
  };
};

const toModelDocument = (value: unknown, field: string): ModelDocument => {
  const record = toRecord(value, field);
  return {
    title:
      toOptionalLocalizedStrings(record.title, `${field}.title`) ?? undefined,
    language: toOptionalString(record.language, `${field}.language`),
    format: toOptionalString(record.format, `${field}.format`),
    seeAlso: toOptionalString(record.seeAlso, `${field}.seeAlso`),
  };
};

const toOptionalVersion = (
  value: unknown,
  field: string,
): Version | null | undefined => {
  if (isAbsent(value)) {
    return value;
  }
  const { major, minor, patch } = toRecord(value, field);
  if (
    !isNonNegativeInteger(major) ||
    !isNonNegativeInteger(minor) ||
    !isNonNegativeInteger(patch)
  ) {
    return invalid(field);
  }
  return { major, minor, patch };
};

const hasText = (strings: LocalizedStrings) =>
  Object.values(strings).some((text) =>
    Array.isArray(text) ? text.some(Boolean) : Boolean(text),
  );

/**
 * Parses an untrusted request body into an `InformationModelToBeCreated`.
 *
 * Only known fields are kept. Returns `null` if any field has the wrong type,
 * or if the title has no text in any language (the same rule the form applies).
 */
export const parseInformationModelToBeCreated = (
  value: unknown,
): InformationModelToBeCreated | null => {
  try {
    const body = toRecord(value, "body");
    const title = toLocalizedStrings(body.title, "title");
    if (!hasText(title)) {
      return null;
    }
    return {
      title,
      description: toOptionalLocalizedStrings(body.description, "description"),
      contactPoints: toOptionalArray(
        body.contactPoints,
        "contactPoints",
        toContactPoint,
      ),
      status: toOptionalString(body.status, "status"),
      homepage: toOptionalString(body.homepage, "homepage"),
      version: toOptionalVersion(body.version, "version"),
      creator: toOptionalString(body.creator, "creator"),
      subjects: toOptionalArray(body.subjects, "subjects", (item, field) =>
        isString(item) ? item : invalid(field),
      ),
      relations: toOptionalArray(
        body.relations,
        "relations",
        toResourceRelation,
      ),
      hasFormat: toOptionalArray(body.hasFormat, "hasFormat", toModelDocument),
      issued: toOptionalString(body.issued, "issued"),
      modified: toOptionalString(body.modified, "modified"),
    };
  } catch (error) {
    if (error instanceof InvalidShapeError) {
      return null;
    }
    throw error;
  }
};
