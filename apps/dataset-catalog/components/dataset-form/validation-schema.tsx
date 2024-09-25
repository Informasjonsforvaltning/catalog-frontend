import { localization, urlRegex } from '@catalog-frontend/utils';
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
  landingPage: Yup.array().of(Yup.string().matches(urlRegex, localization.datasetForm.validation.url)),
});
