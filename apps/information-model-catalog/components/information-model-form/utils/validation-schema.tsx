import {
  httpsRegex,
  localization,
  parseDateTime,
  telephoneNumberRegex,
} from "@catalog-frontend/utils";
import * as Yup from "yup";
import { nb } from "yup-locales";
import relations from "./relations.json";

Yup.setLocale(nb);

const relationTypeUris = relations.map((relation) => relation.uri);

const titleValidationSchema = () =>
  Yup.object()
    .shape({
      nb: Yup.string()
        .label(
          `${localization.informationModelForm.fieldLabel.title} (${localization.language.nb})`,
        )
        .notRequired(),
      nn: Yup.string()
        .label(
          `${localization.informationModelForm.fieldLabel.title} (${localization.language.nn})`,
        )
        .notRequired(),
      en: Yup.string()
        .label(
          `${localization.informationModelForm.fieldLabel.title} (${localization.language.en})`,
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
    );

const descriptionValidationSchema = () =>
  Yup.object().shape({
    nb: Yup.string()
      .label(
        `${localization.informationModelForm.fieldLabel.description} (${localization.language.nb})`,
      )
      .min(5, localization.informationModelForm.validation.description)
      .notRequired(),
    nn: Yup.string()
      .label(
        `${localization.informationModelForm.fieldLabel.description} (${localization.language.nn})`,
      )
      .min(5, localization.informationModelForm.validation.description)
      .notRequired(),
    en: Yup.string()
      .label(
        `${localization.informationModelForm.fieldLabel.description} (${localization.language.en})`,
      )
      .min(5, localization.informationModelForm.validation.description)
      .notRequired(),
  });

const emptyStringToNull = (value: unknown) => (value === "" ? null : value);

const optionalHttpsUrlSchema = () =>
  Yup.string()
    .transform(emptyStringToNull)
    .matches(httpsRegex, localization.validation.invalidProtocol)
    .url(localization.validation.invalidUrl)
    .nullable()
    .notRequired();

const contactPointFieldsSchema = () =>
  Yup.object().shape({
    email: Yup.string()
      .transform(emptyStringToNull)
      .email(localization.validation.invalidEmail)
      .nullable()
      .notRequired(),
    telephone: Yup.string()
      .transform(emptyStringToNull)
      .matches(telephoneNumberRegex, localization.validation.invalidPhone)
      .nullable()
      .notRequired(),
    url: optionalHttpsUrlSchema(),
  });

const contactPointDraftValidationSchema = () =>
  Yup.array().of(contactPointFieldsSchema());

const contactPointConfirmValidationSchema = () =>
  Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.object()
          .shape({
            nb: Yup.string()
              .label(
                `${localization.informationModelForm.fieldLabel.contactName} (${localization.language.nb})`,
              )
              .notRequired(),
            nn: Yup.string()
              .label(
                `${localization.informationModelForm.fieldLabel.contactName} (${localization.language.nn})`,
              )
              .notRequired(),
            en: Yup.string()
              .label(
                `${localization.informationModelForm.fieldLabel.contactName} (${localization.language.en})`,
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
          .transform(emptyStringToNull)
          .email(localization.validation.invalidEmail)
          .nullable()
          .notRequired(),
        telephone: Yup.string()
          .transform(emptyStringToNull)
          .matches(telephoneNumberRegex, localization.validation.invalidPhone)
          .nullable()
          .notRequired(),
        url: optionalHttpsUrlSchema(),
      }),
    )
    .test(
      "contact-has-email-or-url",
      localization.informationModelForm.validation.contactPoints,
      (contactPoints) => {
        if (!contactPoints || contactPoints.length === 0) {
          return false;
        }
        const firstContactPoint = contactPoints[0];
        return !!(firstContactPoint.email || firstContactPoint.url);
      },
    );

const homepageValidationSchema = () =>
  optionalHttpsUrlSchema().label(
    localization.informationModelForm.fieldLabel.homepage,
  );

const isEmptyVersionPart = (value: unknown) =>
  value === undefined || value === null || value === "";

const versionPartSchema = () =>
  Yup.number()
    .transform((_value, originalValue) =>
      isEmptyVersionPart(originalValue) ? undefined : Number(originalValue),
    )
    .integer()
    .min(0)
    .nullable()
    .notRequired();

const versionValidationSchema = () =>
  Yup.object()
    .nullable()
    .notRequired()
    .shape({
      major: versionPartSchema(),
      minor: versionPartSchema(),
      patch: versionPartSchema(),
    })
    .test(
      "version-complete-or-empty",
      localization.informationModelForm.validation.version,
      (value) => {
        if (!value) {
          return true;
        }
        const parts = [value.major, value.minor, value.patch];
        const filledCount = parts.filter(
          (part) => !isEmptyVersionPart(part),
        ).length;
        return filledCount === 0 || filledCount === 3;
      },
    );

const dateValidationSchema = () =>
  Yup.mixed()
    .nullable()
    .test({
      test(value) {
        if (!value) {
          return true;
        }

        if (parseDateTime(value)?.isValid) {
          return true;
        }

        return this.createError({
          message: localization.informationModelForm.validation.date,
          path: this.path,
        });
      },
    });

export const resourceRelationSchema = Yup.object().shape({
  type: Yup.string()
    .oneOf(
      relationTypeUris,
      localization.informationModelForm.validation.relation,
    )
    .required(localization.informationModelForm.validation.relation),
  source: Yup.string().required(
    localization.informationModelForm.validation.relation,
  ),
});

const seeAlsoValidationSchema = () =>
  optionalHttpsUrlSchema().label(
    localization.informationModelForm.fieldLabel.hasFormatSeeAlso,
  );

// https-only for seeAlso is intentional for both draft and confirm (behov#1061).
// Existing http:// values are rejected until the user updates them.
export const modelDocumentSchema = Yup.object().shape({
  title: Yup.object()
    .shape({
      nb: Yup.string().notRequired(),
      nn: Yup.string().notRequired(),
      en: Yup.string().notRequired(),
    })
    .nullable()
    .notRequired(),
  language: Yup.string().nullable().notRequired(),
  format: Yup.string().nullable().notRequired(),
  seeAlso: seeAlsoValidationSchema(),
});

export const draftInformationModelValidationSchema = () =>
  Yup.object().shape({
    title: titleValidationSchema(),
    description: descriptionValidationSchema(),
    contactPoints: contactPointDraftValidationSchema(),
    status: Yup.string().nullable().notRequired(),
    homepage: homepageValidationSchema(),
    version: versionValidationSchema(),
    relations: Yup.array().of(resourceRelationSchema),
    hasFormat: Yup.array().of(modelDocumentSchema),
    issued: dateValidationSchema(),
    modified: dateValidationSchema(),
  });

export const informationModelValidationSchema = () =>
  Yup.object().shape({
    title: titleValidationSchema(),
    description: descriptionValidationSchema(),
    contactPoints: contactPointConfirmValidationSchema(),
    status: Yup.string().nullable().notRequired(),
    homepage: homepageValidationSchema(),
    version: versionValidationSchema(),
    relations: Yup.array().of(resourceRelationSchema),
    hasFormat: Yup.array().of(modelDocumentSchema),
    issued: dateValidationSchema(),
    modified: dateValidationSchema(),
  });
