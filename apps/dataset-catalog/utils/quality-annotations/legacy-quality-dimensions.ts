export const LEGACY_QUALITY_DIMENSIONS = [
  "accuracy",
  "availability",
  "completeness",
  "currentness",
  "relevance",
] as const;

export type LegacyQualityField = (typeof LEGACY_QUALITY_DIMENSIONS)[number];

export const LEGACY_QUALITY_FIELD_NAMES = new Set(
  LEGACY_QUALITY_DIMENSIONS.map((field) => `${field}.hasBody`),
);
