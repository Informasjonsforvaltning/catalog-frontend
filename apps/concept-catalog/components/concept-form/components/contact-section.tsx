import { FastField, useFormikContext } from "formik";
import {
  Textfield,
  Fieldset,
  Checkbox,
  ValidationMessage,
  useCheckboxGroup,
} from "@digdir/designsystemet-react";
import { Concept } from "@catalog-frontend/types";
import { TitleWithHelpTextAndTag } from "@catalog-frontend/ui-v2";
import { localization } from "@catalog-frontend/utils";
import styles from "../concept-form.module.scss";
import { isNil } from "lodash";

type ContactSectionProps = {
  changed?: string[];
  readOnly?: boolean;
};

export const ContactSection = ({
  changed,
  readOnly = false,
}: ContactSectionProps) => {
  const { errors, values, setFieldValue } = useFormikContext<Concept>();
  const contactOptions = [
    {
      label: localization.conceptForm.fieldLabel.emailAddress,
      value: "harEpost",
    },
    {
      label: localization.conceptForm.fieldLabel.phoneNumber,
      value: "harTelefon",
    },
  ];

  const selectedFields = [
    ...(!isNil(values.kontaktpunkt?.harEpost) ? ["harEpost"] : []),
    ...(!isNil(values.kontaktpunkt?.harTelefon) ? ["harTelefon"] : []),
  ];

  const handleContactChange = (value: string[]) => {
    contactOptions.forEach((option) => {
      if (!value.includes(option.value)) {
        setFieldValue(`kontaktpunkt.${option.value}`, null);
      } else if (isNil(values.kontaktpunkt?.[option.value])) {
        setFieldValue(`kontaktpunkt.${option.value}`, "");
      }
    });
  };

  const { getCheckboxProps } = useCheckboxGroup({
    value: selectedFields,
    onChange: handleContactChange,
    readOnly,
  });

  return (
    <div className={styles.contactSection}>
      <Fieldset data-size="sm">
        <Fieldset.Legend>
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.contactInfo}
            tagTitle={localization.tag.required}
            changed={[
              "kontaktpunkt.harEpost",
              "kontaktpunkt.harTelefon",
              "kontaktpunkt.harSkjema",
            ].some((field) => changed?.includes(field))}
          >
            {localization.conceptForm.fieldLabel.contactInfo}
          </TitleWithHelpTextAndTag>
        </Fieldset.Legend>
        {contactOptions.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            {...getCheckboxProps(option.value)}
          />
        ))}
      </Fieldset>
      {selectedFields.includes("harEpost") && (
        <FastField
          as={Textfield}
          name="kontaktpunkt.harEpost"
          data-size="sm"
          label={
            <TitleWithHelpTextAndTag>
              {localization.conceptForm.fieldLabel.emailAddress}
            </TitleWithHelpTextAndTag>
          }
          error={errors?.kontaktpunkt?.["harEpost"]}
          readOnly={readOnly}
        />
      )}
      {selectedFields.includes("harTelefon") && (
        <FastField
          as={Textfield}
          name="kontaktpunkt.harTelefon"
          data-size="sm"
          label={
            <TitleWithHelpTextAndTag>
              {localization.conceptForm.fieldLabel.phoneNumber}
            </TitleWithHelpTextAndTag>
          }
          error={errors?.kontaktpunkt?.["harTelefon"]}
          readOnly={readOnly}
        />
      )}
      {selectedFields.includes("harSkjema") && (
        <FastField
          as={Textfield}
          name="kontaktpunkt.harSkjema"
          data-size="sm"
          label={
            <TitleWithHelpTextAndTag>
              {localization.conceptForm.fieldLabel.contactForm}
            </TitleWithHelpTextAndTag>
          }
          error={errors?.kontaktpunkt?.["harSkjema"]}
          readOnly={readOnly}
        />
      )}
      {typeof errors?.kontaktpunkt === "string" ? (
        <ValidationMessage data-size="sm">
          {errors?.kontaktpunkt}
        </ValidationMessage>
      ) : undefined}
    </div>
  );
};
