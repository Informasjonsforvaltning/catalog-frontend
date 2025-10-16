import { httpsRegex, localization, telephoneNumberRegex } from '@catalog-frontend/utils';
import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  title: Yup.object().shape({
    nb: Yup.string().required(localization.validation.nameRequired),
  }),
  produces: Yup.array().of(
    Yup.object().shape({
      title: Yup.object().shape({
        nb: Yup.string().required(localization.validation.nameRequired),
      }),
      description: Yup.object().shape({
        nb: Yup.string(),
      }),
    }),
  ),
  contactPoints: Yup.array().of(
    Yup.object().shape({
      category: Yup.object().shape({
        nb: Yup.string(),
      }),
      email: Yup.string().email(localization.validation.invalidEmail),
      telephone: Yup.string().matches(telephoneNumberRegex, localization.validation.invalidPhone),
      contactPage: Yup.string()
        .matches(httpsRegex, localization.validation.invalidProtocol)
        .url(localization.validation.invalidUrl),
    }),
  ),
  status: Yup.string(),
  homepage: Yup.string()
    .matches(httpsRegex, localization.validation.invalidProtocol)
    .url(localization.validation.invalidUrl),
});

export const producesSchema = Yup.object().shape({
  title: Yup.object()
    .shape({
      nb: Yup.string()
        .min(3, localization.datasetForm.validation.title)
        .label(`${localization.datasetForm.fieldLabel.title} (${localization.language.nb})`)
        .notRequired(),
      nn: Yup.string()
        .min(3, localization.datasetForm.validation.title)
        .label(`${localization.datasetForm.fieldLabel.title} (${localization.language.nn})`)
        .notRequired(),
      en: Yup.string()
        .min(3, localization.datasetForm.validation.title)
        .label(`${localization.datasetForm.fieldLabel.title} (${localization.language.en})`)
        .notRequired(),
    })
    .test('title-test', localization.validation.oneLanguageRequired, (title) => {
      if (!title) {
        return false;
      }
      return !!(title.nb || title.nn || title.en);
    }),
  description: Yup.object().shape({
    nb: Yup.string(),
    nn: Yup.string(),
    en: Yup.string(),
  }),
});
