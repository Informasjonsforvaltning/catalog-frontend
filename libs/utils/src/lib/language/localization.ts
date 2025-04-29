import LocalizedStrings, { LocalizedStringsMethods } from 'react-localization';
import { nb } from './nb';
import { conceptHelptextsNb } from './helptexts.concept.nb';
import { dataServiceFormNb } from './data.service.form.nb';
import { datasetFormNb } from './dataset.form.nb';
import { conceptFormNb } from './concept.form.nb';

interface LocaleStrings extends LocalizedStringsMethods {
  [key: string]: any;
}

export const localization: LocaleStrings = new LocalizedStrings({
  nb: {
    ...nb,
    conceptHelptexts: { ...conceptHelptextsNb },
    conceptForm: { ...conceptFormNb },
    datasetForm: { ...datasetFormNb },
    dataServiceForm: { ...dataServiceFormNb },
  },
});

localization.setLanguage('nb');
