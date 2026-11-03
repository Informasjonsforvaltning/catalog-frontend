import {
  httpsRegex,
  localization,
  localizedStringsSchema,
} from "@catalog-frontend/utils";
import * as Yup from "yup";

export const uriWithLabelSchema = Yup.object().shape({
  prefLabel: localizedStringsSchema,
  uri: Yup.string()
    .matches(httpsRegex, localization.validation.invalidProtocol)
    .url(localization.validation.invalidUrl),
});
