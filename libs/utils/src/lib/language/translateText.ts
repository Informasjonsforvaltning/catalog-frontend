import { localization } from "./localization";
import { LocalizedStrings } from "@catalog-frontend/types";
import { getString } from "../text/text";

export const getTranslateText = (
  textObj: LocalizedStrings | string | null | undefined,
  language?: string,
): string => {
  const selectedLanguage = language || localization.getLanguage();

  if (!textObj) {
    return "";
  }

  if (typeof textObj === "string") {
    return textObj;
  }

  const value =
    textObj[selectedLanguage] ||
    textObj["nb"] ||
    textObj["no"] ||
    textObj["nn"] ||
    textObj["en"];

  return value ? getString(value) : "";
};
