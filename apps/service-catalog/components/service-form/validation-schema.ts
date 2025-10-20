import { httpsRegex, localization, telephoneNumberRegex } from '@catalog-frontend/utils';
import * as Yup from 'yup';

export const draftProducesSchema = Yup.object().shape({
  title: Yup.object().shape({
    nb: Yup.string()
      .min(3, localization.serviceForm.validation.title)
      .label(`${localization.serviceForm.fieldLabel.title} (${localization.language.nb})`)
      .notRequired(),
    nn: Yup.string()
      .min(3, localization.serviceForm.validation.title)
      .label(`${localization.serviceForm.fieldLabel.title} (${localization.language.nn})`)
      .notRequired(),
    en: Yup.string()
      .min(3, localization.serviceForm.validation.title)
      .label(`${localization.serviceForm.fieldLabel.title} (${localization.language.en})`)
      .notRequired(),
  }),
  description: Yup.object().shape({
    nb: Yup.string(),
    nn: Yup.string(),
    en: Yup.string(),
  }),
});

export const confirmedProducesSchema = Yup.object()
  .shape({
    title: Yup.object().shape({
      nb: Yup.string()
        .min(3, localization.serviceForm.validation.title)
        .label(`${localization.serviceForm.fieldLabel.title} (${localization.language.nb})`)
        .notRequired(),
      nn: Yup.string()
        .min(3, localization.serviceForm.validation.title)
        .label(`${localization.serviceForm.fieldLabel.title} (${localization.language.nn})`)
        .notRequired(),
      en: Yup.string()
        .min(3, localization.serviceForm.validation.title)
        .label(`${localization.serviceForm.fieldLabel.title} (${localization.language.en})`)
        .notRequired(),
    }),
    description: Yup.object().shape({
      nb: Yup.string()
        .min(3, localization.serviceForm.validation.description)
        .label(`${localization.serviceForm.fieldLabel.description} (${localization.language.nb})`)
        .notRequired(),
      nn: Yup.string()
        .min(3, localization.serviceForm.validation.description)
        .label(`${localization.serviceForm.fieldLabel.description} (${localization.language.nn})`)
        .notRequired(),
      en: Yup.string()
        .min(3, localization.serviceForm.validation.description)
        .label(`${localization.serviceForm.fieldLabel.description} (${localization.language.en})`)
        .notRequired(),
    }),
  })
  .test('produces-test', localization.serviceForm.validation.produces, ({ description, title }) => {
    const hasTitle = Boolean(title.nb || title.nn || title.en);
    const hasDescription = Boolean(description.nb || description.nn || description.en);
    return hasTitle && hasDescription;
  });

const titleSchema = Yup.object()
  .shape({
    nb: Yup.string()
      .min(3, localization.serviceForm.validation.title)
      .label(`${localization.serviceForm.fieldLabel.title} (${localization.language.nb})`)
      .notRequired(),
    nn: Yup.string()
      .min(3, localization.serviceForm.validation.title)
      .label(`${localization.serviceForm.fieldLabel.title} (${localization.language.nn})`)
      .notRequired(),
    en: Yup.string()
      .min(3, localization.serviceForm.validation.title)
      .label(`${localization.serviceForm.fieldLabel.title} (${localization.language.en})`)
      .notRequired(),
  })
  .test('title-test', localization.validation.oneLanguageRequired, (title) => {
    if (!title) {
      return false;
    }
    return Boolean(title.nb || title.nn || title.en);
  });

export const draftServiceSchema = Yup.object().shape({
  title: titleSchema,
  description: Yup.object().shape({
    nb: Yup.string(),
    nn: Yup.string(),
    en: Yup.string(),
  }),
  produces: Yup.array().of(draftProducesSchema),
  homepage: Yup.string()
    .matches(httpsRegex, localization.validation.invalidProtocol)
    .url(localization.validation.invalidUrl)
    .notRequired(),
  status: Yup.string(),
  contactPoints: Yup.array().of(
    Yup.object().shape({
      category: Yup.object().shape({
        nb: Yup.string(),
        nn: Yup.string(),
        en: Yup.string(),
      }),
      email: Yup.string().email(localization.validation.invalidEmail).notRequired(),
      telephone: Yup.string().matches(telephoneNumberRegex, localization.validation.invalidPhone).notRequired(),
      contactPage: Yup.string()
        .matches(httpsRegex, localization.validation.invalidProtocol)
        .url(localization.validation.invalidUrl)
        .notRequired(),
    }),
  ),
});

export const confirmedServiceSchema = Yup.object().shape({
  title: titleSchema,
  description: Yup.object()
    .shape({
      nb: Yup.string()
        .label(`${localization.serviceForm.fieldLabel.description} (${localization.language.nb})`)
        .min(5, localization.serviceForm.validation.description)
        .notRequired(),
      nn: Yup.string()
        .label(`${localization.serviceForm.fieldLabel.description} (${localization.language.nn})`)
        .min(5, localization.serviceForm.validation.description)
        .notRequired(),
      en: Yup.string()
        .label(`${localization.serviceForm.fieldLabel.description} (${localization.language.en})`)
        .min(5, localization.serviceForm.validation.description)
        .notRequired(),
    })
    .test('description-test', localization.validation.oneLanguageRequired, (description) => {
      return Boolean(description.nb || description.nn || description.en);
    }),
  produces: Yup.array().of(confirmedProducesSchema).min(1, localization.validation.minOneField),
  homepage: Yup.string()
    .matches(httpsRegex, localization.validation.invalidProtocol)
    .url(localization.validation.invalidUrl),
  status: Yup.string(),
  contactPoints: Yup.array()
    .of(
      Yup.object().shape({
        category: Yup.object()
          .shape({
            nb: Yup.string()
              .label(`${localization.serviceForm.fieldLabel.category} (${localization.language.nb})`)
              .notRequired(),
            nn: Yup.string()
              .label(`${localization.serviceForm.fieldLabel.category} (${localization.language.nn})`)
              .notRequired(),
            en: Yup.string()
              .label(`${localization.serviceForm.fieldLabel.category} (${localization.language.en})`)
              .notRequired(),
          })
          .test('contact-name-test', localization.validation.oneLanguageRequired, (name) => {
            return Boolean(name.nb || name.nn || name.en);
          }),
        email: Yup.string().email(localization.validation.invalidEmail).notRequired(),
        phone: Yup.string().matches(telephoneNumberRegex, localization.validation.invalidPhone).notRequired(),
        url: Yup.string()
          .matches(httpsRegex, localization.validation.invalidProtocol)
          .url(localization.validation.invalidUrl)
          .notRequired(),
      }),
    )
    .test(
      'contact-has-at-least-one-value-field',
      localization.serviceForm.validation.contactPoints,
      (contactPoints) => {
        if (!contactPoints || contactPoints.length === 0) {
          return false;
        }
        const firstContactPoint = contactPoints[0];
        return Boolean(firstContactPoint.email || firstContactPoint.phone || firstContactPoint.url);
      },
    ),
});
