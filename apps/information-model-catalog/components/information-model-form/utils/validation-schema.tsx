import {
  httpsRegex,
  localization,
  telephoneNumberRegex,
} from "@catalog-frontend/utils";
import * as Yup from "yup";
import { nb } from "yup-locales";

Yup.setLocale(nb);

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

const contactPointFieldsSchema = () =>
  Yup.object().shape({
    email: Yup.string()
      .email(localization.validation.invalidEmail)
      .notRequired(),
    telephone: Yup.string()
      .matches(telephoneNumberRegex, localization.validation.invalidPhone)
      .notRequired(),
    url: Yup.string()
      .matches(httpsRegex, localization.validation.invalidProtocol)
      .url(localization.validation.invalidUrl)
      .notRequired(),
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
          .email(localization.validation.invalidEmail)
          .notRequired(),
        telephone: Yup.string()
          .matches(telephoneNumberRegex, localization.validation.invalidPhone)
          .notRequired(),
        url: Yup.string()
          .matches(httpsRegex, localization.validation.invalidProtocol)
          .url(localization.validation.invalidUrl)
          .notRequired(),
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

export const draftInformationModelValidationSchema = () =>
  Yup.object().shape({
    title: titleValidationSchema(),
    description: descriptionValidationSchema(),
    contactPoints: contactPointDraftValidationSchema(),
    status: Yup.string().nullable().notRequired(),
    version: versionValidationSchema(),
  });

export const informationModelValidationSchema = () =>
  Yup.object().shape({
    title: titleValidationSchema(),
    description: descriptionValidationSchema(),
    contactPoints: contactPointConfirmValidationSchema(),
    status: Yup.string().nullable().notRequired(),
    version: versionValidationSchema(),
  });
