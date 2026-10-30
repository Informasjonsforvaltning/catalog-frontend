import {
  Dataset,
  LocalizedStrings,
  QualityDimension,
} from "@catalog-frontend/types";
import { localization } from "@catalog-frontend/utils";
import {
  getQualityDimensionLabel,
  LEGACY_QUALITY_DIMENSIONS,
  LegacyQualityField,
} from "../../../utils/quality-annotations";

export type QualityAnnotationDisplayItem = {
  hasBody: LocalizedStrings;
  dimensionLabels: string[];
};

const hasBodyContent = (hasBody?: LocalizedStrings): boolean => {
  if (!hasBody) {
    return false;
  }
  return Object.values(hasBody).some(
    (value) => typeof value === "string" && value.trim().length > 0,
  );
};

const getLegacyFieldLabel = (field: LegacyQualityField): string =>
  localization.datasetForm.fieldLabel[field];

/**
 * @deprecated Legacy field values will be missing dimension URIs
 * and field labels are used as dimension stand-ins.
 */
const getLegacyQualityAnnotations = (
  dataset: Pick<Dataset, LegacyQualityField>,
): QualityAnnotationDisplayItem[] =>
  LEGACY_QUALITY_DIMENSIONS.flatMap((field) => {
    const hasBody = dataset[field]?.hasBody;
    if (!hasBodyContent(hasBody)) {
      return [];
    }
    return [
      {
        hasBody: hasBody ?? {},
        dimensionLabels: [getLegacyFieldLabel(field)],
      },
    ];
  });

export const getQualityAnnotationsForDisplay = (
  dataset: Pick<Dataset, "qualityAnnotations" | LegacyQualityField>,
  qualityDimensions?: QualityDimension[],
  language?: string,
): QualityAnnotationDisplayItem[] => {
  const fromNew = (dataset.qualityAnnotations ?? [])
    .filter((annotation) => hasBodyContent(annotation.hasBody))
    .map((annotation) => ({
      hasBody: annotation.hasBody ?? {},
      dimensionLabels: (annotation.inDimension ?? [])
        .map((uri) =>
          getQualityDimensionLabel(uri, qualityDimensions, language),
        )
        .filter(Boolean),
    }));

  // Integrate all quality annotations into the same list
  return [...fromNew, ...getLegacyQualityAnnotations(dataset)];
};
