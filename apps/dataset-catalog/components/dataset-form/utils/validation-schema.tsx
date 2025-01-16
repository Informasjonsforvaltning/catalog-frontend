import { httpsRegex, localization, telephoneNumberRegex } from '@catalog-frontend/utils';
import * as Yup from 'yup';

const contactPointDraftValidationSchema = Yup.array().of(
  Yup.object().shape({
    email: Yup.string().email(localization.validation.invalidEmail).notRequired(),
    hasTelephone: Yup.string().matches(telephoneNumberRegex, localization.validation.invalidPhone).notRequired(),
    hasURL: Yup.string()
      .matches(httpsRegex, localization.validation.invalidProtocol)
      .url(localization.validation.invalidUrl)
      .notRequired(),
    organizationUnit: Yup.string().notRequired(),
  }),
);

const contactPointConfirmValidationSchema = Yup.array()
  .of(
    Yup.object().shape({
      email: Yup.string().email(localization.validation.invalidEmail).notRequired(),
      hasTelephone: Yup.string().matches(telephoneNumberRegex, localization.validation.invalidPhone).notRequired(),
      hasURL: Yup.string()
        .matches(httpsRegex, localization.validation.invalidProtocol)
        .url(localization.validation.invalidUrl)
        .notRequired(),
      organizationUnit: Yup.string().notRequired(),
    }),
  )
  .test('has-at-least-one-field', localization.datasetForm.validation.contactPoint, (contactPoints) => {
    if (!contactPoints || contactPoints.length === 0) {
      return false;
    }
    const firstContactPoint = contactPoints[0];
    return !!(
      firstContactPoint.email ||
      firstContactPoint.hasTelephone ||
      firstContactPoint.hasURL ||
      firstContactPoint.organizationUnit
    );
  });

export const draftDatasetSchema = Yup.object().shape({
  landingPage: Yup.array().of(
    Yup.string()
      .nullable()
      .matches(httpsRegex, localization.validation.invalidProtocol)
      .url(localization.validation.invalidUrl),
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
  contactPoint: contactPointDraftValidationSchema,
});

export const confirmedDatasetSchema = draftDatasetSchema.shape({
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
  euDataTheme: Yup.array()
    .min(1, localization.datasetForm.validation.euDataTheme)
    .required(localization.datasetForm.validation.euDataTheme),
  contactPoint: contactPointConfirmValidationSchema,
});

export const distributionSectionSchema = Yup.object().shape({
  accessURL: Yup.array()
    .of(
      Yup.string()
        .required(localization.datasetForm.validation.accessURLrequired)
        .matches(httpsRegex, localization.validation.invalidProtocol)
        .url(localization.validation.invalidUrl),
    )
    .min(1, localization.datasetForm.validation.accessURLrequired),
  downloadURL: Yup.array()
    .nullable()
    .of(
      Yup.string()
        .nullable()
        .matches(httpsRegex, localization.validation.invalidProtocol)
        .url(localization.validation.invalidUrl),
    ),
  conformsTo: Yup.array().of(
    Yup.object().shape({
      uri: Yup.string()
        .matches(httpsRegex, localization.validation.invalidProtocol)
        .url(localization.validation.invalidUrl),
    }),
  ),
  page: Yup.array().of(
    Yup.object().shape({
      uri: Yup.string()
        .matches(httpsRegex, localization.validation.invalidProtocol)
        .url(localization.validation.invalidUrl),
    }),
  ),
});

export const uriWithLabelSchema = Yup.object().shape({
  uri: Yup.string()
    .matches(httpsRegex, localization.validation.invalidProtocol)
    .url(localization.validation.invalidUrl),
});

export const referenceSchema = Yup.object().shape({
  referenceType: Yup.object().shape({
    code: Yup.string().required(localization.datasetForm.validation.relation),
  }),
  source: Yup.object().shape({
    uri: Yup.string().required(localization.datasetForm.validation.relation),
  }),
});
