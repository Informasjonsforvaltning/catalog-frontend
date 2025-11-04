import { get } from "lodash";
import { localization } from "./localization";

export const getTranslateText = (
  textObj: any,
  language?: string,
): string | string[] => {
  const selectedLanguage = language || localization.getLanguage();
  if (typeof textObj === "string") {
    return textObj;
  }

  if (textObj === null || typeof textObj !== "object") {
    return "";
  }

  return (
    textObj[selectedLanguage] ||
    get(textObj, selectedLanguage) ||
    get(textObj, "nb") ||
    get(textObj, "no") ||
    get(textObj, "nn") ||
    get(textObj, "en") ||
    ""
  );
};
