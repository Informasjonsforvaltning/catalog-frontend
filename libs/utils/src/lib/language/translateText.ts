import _ from 'lodash';
import { localization } from './localization';

export const getTranslateText = (textObj: any, language?: string): string => {
  const selectedLanguage = language || localization.getLanguage();
  if (typeof textObj === 'string') {
    return textObj;
  }

  if (textObj === null || typeof textObj !== 'object') {
    return '';
  }

  return (
    textObj[selectedLanguage] ||
    _.get(textObj, selectedLanguage) ||
    _.get(textObj, 'nb') ||
    _.get(textObj, 'no') ||
    _.get(textObj, 'nn') ||
    _.get(textObj, 'en') ||
    ''
  );
};
