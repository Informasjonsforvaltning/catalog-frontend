import { httpsRegex, localization } from "@catalog-frontend/utils";
import * as Yup from "yup";
import { prefLabelSchema } from "../uri-with-label/uri-with-label-validation-schema";

export const standardSchema = Yup.object().shape({
  prefLabel: prefLabelSchema,
  seeAlso: Yup.array().of(
    Yup.string()
      .matches(httpsRegex, {
        message: localization.validation.invalidProtocol,
        excludeEmptyString: true,
      })
      .url(localization.validation.invalidUrl),
  ),
});
