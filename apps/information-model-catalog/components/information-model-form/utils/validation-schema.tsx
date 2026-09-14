import { localization } from "@catalog-frontend/utils";
import * as Yup from "yup";
import { nb } from "yup-locales";

Yup.setLocale(nb);

export const draftInformationModelValidationSchema = () =>
  Yup.object().shape({
    title: Yup.object().shape({
      nb: Yup.string().notRequired(),
      nn: Yup.string().notRequired(),
      en: Yup.string().notRequired(),
    }),
  });

export const informationModelValidationSchema = () =>
  Yup.object().shape({
    title: Yup.object()
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
      ),
  });
