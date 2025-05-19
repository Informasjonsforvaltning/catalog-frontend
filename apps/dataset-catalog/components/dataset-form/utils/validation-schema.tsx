import { httpsRegex, localization, parseDateTime, telephoneNumberRegex } from '@catalog-frontend/utils';
import * as Yup from 'yup';

export const uriWithLabelSchema = Yup.object().shape({
  prefLabel: Yup.object()
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
    .test('preflabel-test', localization.validation.oneLanguageRequired, (prefLabel) => {
      if (!prefLabel) {
        return false;
      }
      return !!(prefLabel.nb || prefLabel.nn || prefLabel.en);
    }),
  uri: Yup.string()
    .matches(httpsRegex, localization.validation.invalidProtocol)
    .url(localization.validation.invalidUrl),
});

const contactPointDraftValidationSchema = Yup.array().of(
  Yup.object().shape({
    email: Yup.string().email(localization.validation.invalidEmail).notRequired(),
    hasTelephone: Yup.string().matches(telephoneNumberRegex, localization.validation.invalidPhone).notRequired(),
    hasURL: Yup.string()
      .matches(httpsRegex, localization.validation.invalidProtocol)
      .url(localization.validation.invalidUrl)
      .notRequired(),
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
    }),
  )
  .test('has-at-least-one-field', localization.datasetForm.validation.contactPoint, (contactPoints) => {
    if (!contactPoints || contactPoints.length === 0) {
      return false;
    }
    const firstContactPoint = contactPoints[0];
    return !!(firstContactPoint.email || firstContactPoint.hasTelephone || firstContactPoint.hasURL);
  });

export const draftDatasetSchema = Yup.object().shape({
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
    uriWithLabelSchema,
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
  description: Yup.object()
    .shape({
      nb: Yup.string()
        .label(`${localization.datasetForm.fieldLabel.description} (${localization.language.nb})`)
        .min(5, localization.datasetForm.validation.description)
        .notRequired(),
      nn: Yup.string()
        .label(`${localization.datasetForm.fieldLabel.description} (${localization.language.nn})`)
        .min(5, localization.datasetForm.validation.description)
        .notRequired(),
      en: Yup.string()
        .label(`${localization.datasetForm.fieldLabel.description} (${localization.language.en})`)
        .min(5, localization.datasetForm.validation.description)
        .notRequired(),
    })
    .test('title-test', localization.validation.oneLanguageRequired, (title) => {
      if (!title) {
        return false;
      }
      return !!(title.nb || title.nn || title.en);
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
    uriWithLabelSchema
  ),
  page: Yup.array().of(
    Yup.object().shape({
      uri: Yup.string()
        .matches(httpsRegex, localization.validation.invalidProtocol)
        .url(localization.validation.invalidUrl),
    }),
  ),
});

export const referenceSchema = Yup.object().shape({
  referenceType: Yup.object().shape({
    code: Yup.string().required(localization.datasetForm.validation.relation),
  }),
  source: Yup.object().shape({
    uri: Yup.string().required(localization.datasetForm.validation.relation),
  }),
});

export const dateSchema = Yup.object().shape({
  startDate: Yup.mixed()
    .nullable()
    .test({
      test(value) {
        if (!value) {
          return true;
        }

        const fomDateTime = parseDateTime(value);
        if (fomDateTime?.isValid) {
          return true;
        }

        return this.createError({
          message: localization.conceptForm.validation.date,
          path: this.path,
        });
      },
    }),
  endDate: Yup.mixed()
    .nullable()
    .test({
      test(value) {
        if (!value) {
          return true;
        }

        const tomDateTime = parseDateTime(value);
        if (tomDateTime?.isValid) {
          if (this.parent.startDate === null) {
            return true;
          }
          const fomDateTime = parseDateTime(this.parent.startDate);
          if (fomDateTime && tomDateTime.toJSDate() >= fomDateTime?.toJSDate()) {
            return true;
          }
        }

        return this.createError({
          message: localization.conceptForm.validation.date,
          path: this.path,
        });
      },
    }),
});
