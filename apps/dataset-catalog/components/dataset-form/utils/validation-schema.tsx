import { httpsRegex, localization } from '@catalog-frontend/utils';
import * as Yup from 'yup';

export const datasetValidationSchema = Yup.object().shape({
  title: Yup.object().shape({
    nb: Yup.string()
      .min(3, localization.datasetForm.validation.title)
      .required(localization.datasetForm.validation.titleRequired),
  }),
  description: Yup.object().shape({
    nb: Yup.string()
      .min(5, localization.datasetForm.validation.description)
      .required(localization.datasetForm.validation.descriptionRequired),
  }),
  landingPage: Yup.array().of(
    Yup.string().matches(httpsRegex, localization.validation.invalidProtocol).url(localization.validation.invalidUrl),
  ),

  legalBasisForRestriction: Yup.array().of(
    Yup.object().shape({
      uri: Yup.string()
        .matches(httpsRegex, localization.validation.invalidProtocol)
        .url(localization.validation.invalidUrl),
    }),
  ),

  legalBasisForProcessing: Yup.array().of(
    Yup.object().shape({
      uri: Yup.string()
        .matches(httpsRegex, localization.validation.invalidProtocol)
        .url(localization.validation.invalidUrl),
    }),
  ),

  legalBasisForAccess: Yup.array().of(
    Yup.object().shape({
      uri: Yup.string()
        .matches(httpsRegex, localization.validation.invalidProtocol)
        .url(localization.validation.invalidUrl),
    }),
  ),
  euThemeList: Yup.array()
    .min(1, localization.datasetForm.validation.euTheme)
    .required(localization.datasetForm.validation.euTheme),

  conformsTo: Yup.array().of(
    Yup.object().shape({
      uri: Yup.string()
        .matches(httpsRegex, localization.validation.invalidProtocol)
        .url(localization.validation.invalidUrl),
    }),
  ),
  informationModel: Yup.array().of(
    Yup.object().shape({
      uri: Yup.string()
        .matches(httpsRegex, localization.validation.invalidProtocol)
        .url(localization.validation.invalidUrl),
    }),
  ),
  relations: Yup.array().of(
    Yup.object().shape({
      uri: Yup.string()
        .matches(httpsRegex, localization.validation.invalidProtocol)
        .url(localization.validation.invalidUrl),
    }),
  ),
});
