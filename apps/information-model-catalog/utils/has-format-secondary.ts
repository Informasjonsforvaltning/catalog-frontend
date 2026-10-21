import { ModelDocument } from "@catalog-frontend/types";

export type HasFormatSecondaryValues = {
  document: ModelDocument;
  index: number;
};

export const isHasFormatSecondaryValues = (
  values: unknown,
): values is HasFormatSecondaryValues => {
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
