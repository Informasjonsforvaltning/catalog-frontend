import LocalizedStrings, { LocalizedStringsMethods } from 'react-localization';
import { nb } from './nb';
import { conceptHelptextsNb } from './helptexts.concept.nb';

interface LocaleStrings extends LocalizedStringsMethods {
  [key: string]: any;
}

export const localization: LocaleStrings = new LocalizedStrings({
  nb: { ...nb, conceptHelptexts: { ...conceptHelptextsNb } },
});

localization.setLanguage('nb');
