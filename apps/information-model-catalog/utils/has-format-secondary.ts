import { ModelDocument } from "@catalog-frontend/types";

export type FormatSecondaryValues = {
  document: ModelDocument;
  index: number;
};

export const isFormatSecondaryValues = (
  values: unknown,
): values is FormatSecondaryValues => {
  if (values == null || typeof values !== "object") {
    return false;
  }

  const candidate = values as Record<string, unknown>;
  return (
    typeof candidate.index === "number" &&
    Number.isInteger(candidate.index) &&
    candidate.index >= 0 &&
    candidate.document != null &&
    typeof candidate.document === "object"
  );
};
