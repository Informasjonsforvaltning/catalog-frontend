import { ReferenceDataCode } from "@catalog-frontend/types";
import {
  capitalizeFirstLetter,
  getTranslateText,
} from "@catalog-frontend/utils";

export const LANGUAGE_CODE_SORT_ORDER: string[] = [
  "NOR",
  "NOB",
  "NNO",
  "SMI",
  "SME",
  "SMJ",
  "SMA",
  "ENG",
  "SWE",
  "DAN",
  "POL",
  "ARA",
  "SOM",
  "UKR",
  "LIT",
  "FIN",
  "DEU",
  "FRA",
  "SPA",
];

const languageCodeSortIndex = new Map(
  LANGUAGE_CODE_SORT_ORDER.map((code, index) => [code, index]),
);

export const getTranslatedLabel = (item: ReferenceDataCode) =>
  item.label
    ? capitalizeFirstLetter(getTranslateText(item.label), false)
    : (item.uri ?? "");

export const compareLanguages = (
  a: ReferenceDataCode,
  b: ReferenceDataCode,
) => {
  const indexA = a.code ? languageCodeSortIndex.get(a.code) : undefined;
  const indexB = b.code ? languageCodeSortIndex.get(b.code) : undefined;

  if (indexA !== undefined && indexB !== undefined) {
    return indexA - indexB;
  }
  if (indexA !== undefined) return -1;
  if (indexB !== undefined) return 1;

  return getTranslatedLabel(a).localeCompare(getTranslatedLabel(b), "nb");
};
