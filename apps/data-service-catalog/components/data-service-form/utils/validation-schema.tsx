import { localization } from '@catalog-frontend/utils';
import * as Yup from 'yup';
import { nb } from 'yup-locales';

Yup.setLocale(nb);

export const dataServiceSchema = ({ required }) =>
  Yup.object().shape({
    title: Yup.object()
      .test('title-test', 'Tittel må fylles ut for minst ett språk.', (value: any) => {
        if (!required) return true;
        return value !== null;
      })
      .shape({
      navn: Yup.object().shape({
        nb: Yup.string()
          .nullable()
          .label(`${localization.dataServiceForm.title.prefLabel} (${localization.language.nb})`),
        nn: Yup.string()
          .nullable()
          .label(`${localization.dataServiceForm.title.prefLabel} (${localization.language.nn})`),
        en: Yup.string()
          .nullable()
          .label(`${localization.dataServiceForm.title.prefLabel} (${localization.language.en})`),
      }),
    }),
  });
