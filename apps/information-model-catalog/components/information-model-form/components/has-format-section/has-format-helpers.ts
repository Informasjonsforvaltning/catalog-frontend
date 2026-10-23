import { ModelDocument, ReferenceDataCode } from "@catalog-frontend/types";
import { getTranslatedLabel } from "@catalog-frontend/ui";
import { isEmpty } from "lodash";

export const omitEmptyLocalized = (title: ModelDocument["title"]) => {
  if (!title) return {};
  return Object.fromEntries(
    Object.entries(title).filter(([, text]) => text != null && text !== ""),
  );
};

export const hasNoFieldValues = (values: ModelDocument) => {
  if (!values) return true;
  return (
    isEmpty(omitEmptyLocalized(values.title)) &&
    isEmpty(values.language) &&
    isEmpty(values.format) &&
    isEmpty(values.seeAlso)
  );
};

export const resolveLabel = (
  uri: string | null | undefined,
  items: ReferenceDataCode[] | undefined,
) => {
  if (!uri) return "";
  const match = items?.find((item) => item.uri === uri);
  return match ? getTranslatedLabel(match) : uri;
};
