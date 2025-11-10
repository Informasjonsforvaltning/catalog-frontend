import {
  httpsRegex,
  localization,
  parseDateTime,
  telephoneNumberRegex,
} from "@catalog-frontend/utils";
import * as Yup from "yup";

export const uriWithLabelSchema = Yup.object().shape({
  prefLabel: Yup.object()
    .shape({
      nb: Yup.string()
        .min(3, localization.datasetForm.validation.title)
        .label(
          `${localization.datasetForm.fieldLabel.title} (${localization.language.nb})`,
        )
        .notRequired(),
      nn: Yup.string()
        .min(3, localization.datasetForm.validation.title)
        .label(
          `${localization.datasetForm.fieldLabel.title} (${localization.language.nn})`,
        )
        .notRequired(),
      en: Yup.string()
        .min(3, localization.datasetForm.validation.title)
        .label(
          `${localization.datasetForm.fieldLabel.title} (${localization.language.en})`,
        )
        .notRequired(),
    })
    .test(
      "preflabel-test",
      localization.validation.oneLanguageRequired,
      (prefLabel) => {
        if (!prefLabel) {
          return false;
        }
        return !!(prefLabel.nb || prefLabel.nn || prefLabel.en);
      },
    ),
  uri: Yup.string()
    .matches(httpsRegex, localization.validation.invalidProtocol)
    .url(localization.validation.invalidUrl),
});

const contactPointDraftValidationSchema = Yup.array().of(
  Yup.object().shape({
    email: Yup.string()
      .email(localization.validation.invalidEmail)
      .notRequired(),
    phone: Yup.string()
      .matches(telephoneNumberRegex, localization.validation.invalidPhone)
      .notRequired(),
    url: Yup.string()
      .matches(httpsRegex, localization.validation.invalidProtocol)
      .url(localization.validation.invalidUrl)
      .notRequired(),
  }),
);

const contactPointConfirmValidationSchema = Yup.array()
  .of(
    Yup.object().shape({
      name: Yup.object()
        .shape({
          nb: Yup.string()
            .label(
              `${localization.datasetForm.fieldLabel.contactName} (${localization.language.nb})`,
            )
            .notRequired(),
          nn: Yup.string()
            .label(
              `${localization.datasetForm.fieldLabel.contactName} (${localization.language.nn})`,
            )
            .notRequired(),
          en: Yup.string()
            .label(
              `${localization.datasetForm.fieldLabel.contactName} (${localization.language.en})`,
            )
            .notRequired(),
        })
        .test(
          "contact-name-test",
          localization.validation.oneLanguageRequired,
          (name) => {
            if (!name) {
              return false;
            }
            return !!(name.nb || name.nn || name.en);
          },
        ),
      email: Yup.string()
        .email(localization.validation.invalidEmail)
        .notRequired(),
      phone: Yup.string()
        .matches(telephoneNumberRegex, localization.validation.invalidPhone)
        .notRequired(),
      url: Yup.string()
        .matches(httpsRegex, localization.validation.invalidProtocol)
        .url(localization.validation.invalidUrl)
        .notRequired(),
    }),
  )
  .test(
    "contact-has-at-least-one-value-field",
    localization.datasetForm.validation.contactPoints,
    (contactPoints) => {
      if (!contactPoints || contactPoints.length === 0) {
        return false;
      }
      const firstContactPoint = contactPoints[0];
      return !!(
        firstContactPoint.email ||
        firstContactPoint.phone ||
        firstContactPoint.url
      );
    },
  );

export const distributionSectionSchema = Yup.object().shape({
  accessURL: Yup.array()
    .of(
      Yup.string()
        .required(localization.datasetForm.validation.accessUrlRequired)
        .matches(httpsRegex, localization.validation.invalidProtocol)
        .url(localization.validation.invalidUrl),
    )
    .min(1, localization.datasetForm.validation.accessUrlRequired),
  downloadURL: Yup.array()
    .nullable()
    .of(
      Yup.string()
        .nullable()
        .matches(httpsRegex, localization.validation.invalidProtocol)
        .url(localization.validation.invalidUrl),
    ),
  conformsTo: Yup.array().of(uriWithLabelSchema),
  page: Yup.array().of(
    Yup.string()
      .matches(httpsRegex, localization.validation.invalidProtocol)
      .url(localization.validation.invalidUrl),
  ),
});

export const rightsSchema = Yup.object().shape({
  type: Yup.string().required(
    localization.datasetForm.validation.mobilityRights,
  ),
})

export const mobilityDistributionSectionSchema = Yup.object().shape({
  accessURL: Yup.array()
    .of(
      Yup.string()
        .required(localization.datasetForm.validation.accessUrlRequired)
        .matches(httpsRegex, localization.validation.invalidProtocol)
        .url(localization.validation.invalidUrl),
    )
    .min(1, localization.datasetForm.validation.accessUrlRequired),
  mobilityDataStandard: Yup.string().required(
    localization.datasetForm.validation.mobilityDataStandard,
  ),
  rights: rightsSchema,
  format: Yup.array()
    .min(1, localization.datasetForm.validation.format)
    .required(localization.datasetForm.validation.format),
  downloadURL: Yup.array()
    .nullable()
    .of(
      Yup.string()
        .nullable()
        .matches(httpsRegex, localization.validation.invalidProtocol)
        .url(localization.validation.invalidUrl),
    ),
  conformsTo: Yup.array().of(uriWithLabelSchema),
  page: Yup.array().of(
    Yup.string()
      .matches(httpsRegex, localization.validation.invalidProtocol)
      .url(localization.validation.invalidUrl),
  ),
});

export const referenceSchema = Yup.object().shape({
  referenceType: Yup.string().required(
    localization.datasetForm.validation.relation,
  ),
  source: Yup.string().required(localization.datasetForm.validation.relation),
});

export const dateSchema = Yup.object().shape({
  startDate: Yup.mixed()
    .nullable()
    .test({
      test(value) {
        if (!value) {
          return true;
        }

        const startDateTime = parseDateTime(value);
        if (startDateTime?.isValid) {
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
        if (!value && this.parent.startDate) {
          return true;
        }

        const endDateTime = parseDateTime(value);
        if (endDateTime?.isValid) {
          const startDateTime = parseDateTime(this.parent.startDate);
          if (!startDateTime?.isValid) {
            return true;
          }
          if (endDateTime.toJSDate() >= startDateTime?.toJSDate()) {
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

export const draftDatasetSchema = Yup.object().shape({
  title: Yup.object()
    .shape({
      nb: Yup.string()
        .min(3, localization.datasetForm.validation.title)
        .label(
          `${localization.datasetForm.fieldLabel.title} (${localization.language.nb})`,
        )
        .notRequired(),
      nn: Yup.string()
        .min(3, localization.datasetForm.validation.title)
        .label(
          `${localization.datasetForm.fieldLabel.title} (${localization.language.nn})`,
        )
        .notRequired(),
      en: Yup.string()
        .min(3, localization.datasetForm.validation.title)
        .label(
          `${localization.datasetForm.fieldLabel.title} (${localization.language.en})`,
        )
        .notRequired(),
    })
    .test(
      "title-test",
      localization.validation.oneLanguageRequired,
      (title) => {
        if (!title) {
          return false;
        }
        return !!(title.nb || title.nn || title.en);
      },
    ),
  contactPoints: contactPointDraftValidationSchema,
});

export const confirmedDatasetSchema = draftDatasetSchema.shape({
  title: Yup.object()
    .shape({
      nb: Yup.string()
        .min(3, localization.datasetForm.validation.title)
        .label(
          `${localization.datasetForm.fieldLabel.title} (${localization.language.nb})`,
        )
        .notRequired(),
      nn: Yup.string()
        .min(3, localization.datasetForm.validation.title)
        .label(
          `${localization.datasetForm.fieldLabel.title} (${localization.language.nn})`,
        )
        .notRequired(),
      en: Yup.string()
        .min(3, localization.datasetForm.validation.title)
        .label(
          `${localization.datasetForm.fieldLabel.title} (${localization.language.en})`,
        )
        .notRequired(),
    })
    .test(
      "title-test",
      localization.validation.oneLanguageRequired,
      (title) => {
        if (!title) {
          return false;
        }
        return !!(title.nb || title.nn || title.en);
      },
    ),
  description: Yup.object()
    .shape({
      nb: Yup.string()
        .label(
          `${localization.datasetForm.fieldLabel.description} (${localization.language.nb})`,
        )
        .min(5, localization.datasetForm.validation.description)
        .notRequired(),
      nn: Yup.string()
        .label(
          `${localization.datasetForm.fieldLabel.description} (${localization.language.nn})`,
        )
        .min(5, localization.datasetForm.validation.description)
        .notRequired(),
      en: Yup.string()
        .label(
          `${localization.datasetForm.fieldLabel.description} (${localization.language.en})`,
        )
        .min(5, localization.datasetForm.validation.description)
        .notRequired(),
    })
    .test(
      "description-test",
      localization.validation.oneLanguageRequired,
      (description) => {
        if (!description) {
          return false;
        }
        return !!(description.nb || description.nn || description.en);
      },
    ),
  temporal: Yup.array().of(dateSchema),
  euDataTheme: Yup.array()
    .min(1, localization.datasetForm.validation.euDataTheme)
    .required(localization.datasetForm.validation.euDataTheme),
  distribution: Yup.array().of(distributionSectionSchema),
  sample: Yup.array().of(distributionSectionSchema),
  landingPage: Yup.array()
    .nullable()
    .of(
      Yup.string()
        .nonNullable(localization.validation.deleteFieldIfEmpty)
        .matches(httpsRegex, localization.validation.invalidProtocol)
        .url(localization.validation.invalidUrl),
    ),
  legalBasisForRestriction: Yup.array().of(uriWithLabelSchema),
  legalBasisForProcessing: Yup.array().of(uriWithLabelSchema),
  legalBasisForAccess: Yup.array().of(uriWithLabelSchema),
  conformsTo: Yup.array().of(uriWithLabelSchema),
  informationModelsFromOtherSources: Yup.array().of(uriWithLabelSchema),
  references: Yup.array().of(referenceSchema),
  relations: Yup.array().of(uriWithLabelSchema),
  contactPoints: contactPointConfirmValidationSchema,
});

export const confirmedMobilityDatasetSchema = draftDatasetSchema.shape({
  title: Yup.object()
    .shape({
      nb: Yup.string()
        .min(3, localization.datasetForm.validation.title)
        .label(
          `${localization.datasetForm.fieldLabel.title} (${localization.language.nb})`,
        )
        .notRequired(),
      nn: Yup.string()
        .min(3, localization.datasetForm.validation.title)
        .label(
          `${localization.datasetForm.fieldLabel.title} (${localization.language.nn})`,
        )
        .notRequired(),
      en: Yup.string()
        .min(3, localization.datasetForm.validation.title)
        .label(
          `${localization.datasetForm.fieldLabel.title} (${localization.language.en})`,
        )
        .notRequired(),
    })
    .test(
      "title-test",
      localization.validation.oneLanguageRequired,
      (title) => {
        if (!title) {
          return false;
        }
        return !!(title.nb || title.nn || title.en);
      },
    ),
  description: Yup.object()
    .shape({
      nb: Yup.string()
        .label(
          `${localization.datasetForm.fieldLabel.description} (${localization.language.nb})`,
        )
        .min(5, localization.datasetForm.validation.description)
        .notRequired(),
      nn: Yup.string()
        .label(
          `${localization.datasetForm.fieldLabel.description} (${localization.language.nn})`,
        )
        .min(5, localization.datasetForm.validation.description)
        .notRequired(),
      en: Yup.string()
        .label(
          `${localization.datasetForm.fieldLabel.description} (${localization.language.en})`,
        )
        .min(5, localization.datasetForm.validation.description)
        .notRequired(),
    })
    .test(
      "description-test",
      localization.validation.oneLanguageRequired,
      (description) => {
        if (!description) {
          return false;
        }
        return !!(description.nb || description.nn || description.en);
      },
    ),
  spatial: Yup.array()
    .min(1, localization.datasetForm.validation.spatial)
    .required(localization.datasetForm.validation.spatial),
  frequency: Yup.string().required(
    localization.datasetForm.validation.frequency,
  ),
  euDataTheme: Yup.array()
    .min(1, localization.datasetForm.validation.euDataTheme)
    .required(localization.datasetForm.validation.euDataTheme),
  mobilityTheme: Yup.array()
    .min(1, localization.datasetForm.validation.mobilityTheme)
    .required(localization.datasetForm.validation.mobilityTheme),
  distribution: Yup.array()
    .of(distributionSectionSchema)
    .min(1, localization.datasetForm.validation.distribution)
    .required(localization.datasetForm.validation.distribution),
  landingPage: Yup.array()
    .nullable()
    .of(
      Yup.string()
        .nonNullable(localization.validation.deleteFieldIfEmpty)
        .matches(httpsRegex, localization.validation.invalidProtocol)
        .url(localization.validation.invalidUrl),
    ),
  conformsTo: Yup.array().of(uriWithLabelSchema),
  informationModelsFromOtherSources: Yup.array().of(uriWithLabelSchema),
  references: Yup.array().of(referenceSchema),
  relations: Yup.array().of(uriWithLabelSchema),
  contactPoints: contactPointConfirmValidationSchema,
});
