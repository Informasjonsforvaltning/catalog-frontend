import {
  httpsRegex,
  localization,
  localizedStringsSchema,
} from "@catalog-frontend/utils";
import * as Yup from "yup";

export const standardSchema = Yup.object().shape({
  prefLabel: localizedStringsSchema,
  seeAlso: Yup.array().of(
    Yup.string()
      .matches(httpsRegex, {
        message: localization.validation.invalidProtocol,
        excludeEmptyString: true,
      })
      .url(localization.validation.invalidUrl),
  ),
});
