import { get } from "lodash";
import { localization } from "./localization";
import { LocalizedStrings } from "@catalog-frontend/types";
import { getString } from "../text/text";

export const getTranslateText = (
  textObj: LocalizedStrings | null | undefined,
  language?: string,
): string => {
  const selectedLanguage = language || localization.getLanguage();

  if (!textObj) {
    return "";
  }

  const value =
    textObj[selectedLanguage] ||
    get(textObj, selectedLanguage) ||
    get(textObj, "nb") ||
    get(textObj, "no") ||
    get(textObj, "nn") ||
    get(textObj, "en");

  return value ? getString(value) : "";
};
