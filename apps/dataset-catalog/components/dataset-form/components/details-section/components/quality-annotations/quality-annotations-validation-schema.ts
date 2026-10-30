import { localization } from "@catalog-frontend/utils";
import * as Yup from "yup";

export const qualityAnnotationValidationSchema = Yup.object().shape({
  inDimension: Yup.array().of(Yup.string()).nullable(),
  hasBody: Yup.object()
    .shape({
      nb: Yup.string().notRequired(),
      nn: Yup.string().notRequired(),
      en: Yup.string().notRequired(),
    })
    .test(
      "hasBody-test",
      localization.validation.oneLanguageRequired,
      (hasBody) => {
        if (!hasBody) {
          return false;
        }
        return !!(hasBody.nb || hasBody.nn || hasBody.en);
      },
    ),
});
