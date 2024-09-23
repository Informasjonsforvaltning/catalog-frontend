import LocalizedStrings, { LocalizedStringsMethods } from 'react-localization';
import { nb } from './nb';
import { conceptHelptextsNb } from './helptexts.concept.nb';
import { datasetFormNb } from './dataset.form.nb';

interface LocaleStrings extends LocalizedStringsMethods {
  [key: string]: any;
}

export const localization: LocaleStrings = new LocalizedStrings({
  nb: { ...nb, conceptHelptexts: { ...conceptHelptextsNb }, datasetForm: { ...datasetFormNb } },
});

localization.setLanguage('nb');
