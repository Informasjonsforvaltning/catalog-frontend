import { httpsRegex, localization } from "@catalog-frontend/utils";
import { isEmpty, isNumber } from "lodash";
import * as Yup from "yup";

export const costValidationSchema = () =>
  Yup.object().shape(
    {
      value: Yup.number()
        .label(localization.cost.fieldLabel.costValue)
        .when("documentation", {
          is: (documentation: unknown) => isEmpty(documentation),
          then: (valueSchema) =>
            valueSchema
              .required(
                localization.cost.validation.costValueRequiredWhenMissingDoc,
              )
              .nonNullable(),
          otherwise: (valueSchema) => valueSchema.notRequired().nullable(),
        }),
      documentation: Yup.array()
        .label(localization.cost.fieldLabel.costDocumentation)
        .of(
          Yup.string()
            .required(localization.validation.deleteFieldIfEmpty)
            .matches(httpsRegex, localization.validation.invalidProtocol)
            .url(localization.validation.invalidUrl),
        )
        .when("value", {
          is: (value: unknown) => !isNumber(value),
          then: (docSchema) => docSchema.required().nonNullable(),
          otherwise: (docSchema) => docSchema.notRequired().nullable(),
        }),
    },
    [["value", "documentation"]],
  );
