import {
  httpsRegex,
  localization,
  telephoneNumberRegex,
} from "@catalog-frontend/utils";
import * as Yup from "yup";
import { nb } from "yup-locales";
import { isEmpty, isNumber } from "lodash";

Yup.setLocale(nb);

export const dataServiceValidationSchema = () =>
  Yup.object().shape({
    title: Yup.object()
      .shape({
        nb: Yup.string()
          .label(
            `${localization.dataServiceForm.fieldLabel.title} (${localization.language.nb})`,
          )
          .notRequired(),
        nn: Yup.string()
          .label(
            `${localization.dataServiceForm.fieldLabel.title} (${localization.language.nn})`,
          )
          .notRequired(),
        en: Yup.string()
          .label(
            `${localization.dataServiceForm.fieldLabel.title} (${localization.language.en})`,
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
    endpointUrl: Yup.string()
      .label(localization.dataServiceForm.fieldLabel.endpoint)
      .required(localization.validation.endpointURLRequired)
      .matches(httpsRegex, localization.validation.invalidProtocol)
      .url(localization.validation.invalidUrl),
    endpointDescriptions: Yup.array()
      .label(localization.dataServiceForm.fieldLabel.endpointDescriptions)
      .notRequired()
      .of(
        Yup.string()
          .required(localization.validation.deleteFieldIfEmpty)
          .matches(httpsRegex, localization.validation.invalidProtocol)
          .url(localization.validation.invalidUrl),
      ),
    landingPage: Yup.string()
      .label(localization.dataServiceForm.fieldLabel.landingPage)
      .notRequired()
      .matches(httpsRegex, localization.validation.invalidProtocol)
      .url(localization.validation.invalidUrl),
    pages: Yup.array()
      .label(localization.dataServiceForm.fieldLabel.pages)
      .notRequired()
      .of(
        Yup.string()
          .required(localization.validation.deleteFieldIfEmpty)
          .matches(httpsRegex, localization.validation.invalidProtocol)
          .url(localization.validation.invalidUrl),
      ),
    contactPoint: Yup.object()
      .shape({
        name: Yup.object()
          .shape({
            nb: Yup.string()
              .label(
                `${localization.dataServiceForm.fieldLabel.contactName} (${localization.language.nb})`,
              )
              .notRequired(),
            nn: Yup.string()
              .label(
                `${localization.dataServiceForm.fieldLabel.contactName} (${localization.language.nn})`,
              )
              .notRequired(),
            en: Yup.string()
              .label(
                `${localization.dataServiceForm.fieldLabel.contactName} (${localization.language.en})`,
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
      })
      .test(
        "contact-has-at-least-one-field",
        localization.validation.minOneField,
        (contactPoint) => {
          if (!contactPoint) {
            return false;
          }
          return !!(
            contactPoint.email ||
            contactPoint.phone ||
            contactPoint.url
          );
        },
      ),
  });

export const costValidationSchema = () =>
  Yup.object().shape(
    {
      value: Yup.number()
        .label(localization.dataServiceForm.fieldLabel.costValue)
        .when("documentation", {
          is: (documentation: any) => {
            return isEmpty(documentation);
          },
          then: (valueSchema) =>
            valueSchema
              .required(
                localization.dataServiceForm.validation
                  .costValueRequiredWhenMissingDoc,
              )
              .nonNullable(),
          otherwise: (valueSchema) => valueSchema.notRequired().nullable(),
        }),
      documentation: Yup.array()
        .label(localization.dataServiceForm.fieldLabel.costDocumentation)
        .of(
          Yup.string()
            .required(localization.validation.deleteFieldIfEmpty)
            .matches(httpsRegex, localization.validation.invalidProtocol)
            .url(localization.validation.invalidUrl),
        )
        .when("value", {
          is: (value: any) => {
            return !isNumber(value);
          },
          then: (docSchema) => docSchema.required().nonNullable(),
          otherwise: (docSchema) => docSchema.notRequired().nullable(),
        }),
    },
    [["value", "documentation"]],
  );
