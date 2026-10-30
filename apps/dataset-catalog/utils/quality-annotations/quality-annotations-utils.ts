import { QualityAnnotation, QualityDimension } from "@catalog-frontend/types";
import {
  capitalizeFirstLetter,
  getTranslateText,
} from "@catalog-frontend/utils";

export const emptyQualityAnnotation = (): QualityAnnotation => ({
  inDimension: [],
  hasBody: { nb: "", nn: "" },
});

export const buildQualityDimensionOptions = (
  qualityDimensions: QualityDimension[],
) => {
  const byUri = new Map(
    qualityDimensions.map((dimension) => [dimension.uri, dimension]),
  );
  const options: {
    value: string;
    label: string;
    indentLevel?: number;
  }[] = [];
  const addedUris = new Set<string>();

  const addOption = (dimension: QualityDimension, isChild: boolean) => {
    if (addedUris.has(dimension.uri)) {
      return;
    }
    options.push({
      value: dimension.uri,
      label: capitalizeFirstLetter(getTranslateText(dimension.label)),
      indentLevel: isChild ? 1 : undefined,
    });
    addedUris.add(dimension.uri);
  };

  const addTopLevelWithChildren = () => {
    const topLevel = qualityDimensions.filter(
      (dimension) => !dimension.isPartOf,
    );
    topLevel.forEach((parent) => {
      addOption(parent, false);
      (parent.hasParts ?? []).forEach((childUri) => {
        const child = byUri.get(childUri);
        if (child) {
          addOption(child, true);
        }
      });
    });
  };

  const addOrphansNotYetAdded = () => {
    qualityDimensions.forEach((dimension) => {
      addOption(dimension, Boolean(dimension.isPartOf));
    });
  };

  addTopLevelWithChildren();
  addOrphansNotYetAdded();

  return options;
};

export const getQualityDimensionLabel = (
  uri: string,
  qualityDimensions?: QualityDimension[],
  language?: string,
) => {
  const dimension = qualityDimensions?.find((item) => item.uri === uri);
  const translatedLabel = getTranslateText(dimension?.label, language);
  if (translatedLabel) {
    return capitalizeFirstLetter(translatedLabel);
  }

  return uri;
};
