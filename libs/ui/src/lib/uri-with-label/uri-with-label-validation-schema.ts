import { httpsRegex, localization } from "@catalog-frontend/utils";
import * as Yup from "yup";

export const uriWithLabelSchema = Yup.object().shape({
  prefLabel: Yup.object()
    .shape({
      nb: Yup.string()
        .min(3, localization.uriWithLabel.validation.title)
        .label(`${localization.title} (${localization.language.nb})`)
        .notRequired(),
      nn: Yup.string()
        .min(3, localization.uriWithLabel.validation.title)
        .label(`${localization.title} (${localization.language.nn})`)
        .notRequired(),
      en: Yup.string()
        .min(3, localization.uriWithLabel.validation.title)
        .label(`${localization.title} (${localization.language.en})`)
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
