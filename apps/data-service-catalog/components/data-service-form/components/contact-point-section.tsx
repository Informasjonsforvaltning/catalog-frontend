"use client";
import { DataService } from "@catalog-frontend/types";
import {
  FormikLanguageFieldset,
  FormikOptionalFieldsFieldset,
  TitleWithHelpTextAndTag,
} from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";
import { useFormikContext } from "formik";
import { get as lodashGet } from "lodash";
import { Box, ErrorMessage, Textfield } from "@digdir/designsystemet-react";
import styles from "../data-service-form.module.css";

export const ContactPointSection = () => {
  const { errors } = useFormikContext<DataService>();

  const contactPointOptions = [
    {
      valuePath: "contactPoint.email",
      label: localization.email,
      legend: (
        <TitleWithHelpTextAndTag>{localization.email}</TitleWithHelpTextAndTag>
      ),
    },
    {
      valuePath: "contactPoint.phone",
      label: localization.telephone,
      legend: (
        <TitleWithHelpTextAndTag>
          {localization.telephone}
        </TitleWithHelpTextAndTag>
      ),
    },
    {
      valuePath: "contactPoint.url",
      label: localization.contactPoint.form,
      legend: (
        <TitleWithHelpTextAndTag>
          {localization.contactPoint.form}
        </TitleWithHelpTextAndTag>
      ),
    },
  ];

  const getErrors = () => {
    return lodashGet(errors, "contactPoint");
  };

  const hasMainLevelError = () => {
    const contactErrors: any = getErrors();
    return typeof contactErrors === "string" || contactErrors instanceof String;
  };

  return (
    <Box>
      <div className={styles.padding}>
        <FormikLanguageFieldset
          name={"contactPoint.name"}
          as={Textfield}
          legend={
            <TitleWithHelpTextAndTag
              tagTitle={localization.tag.required}
              helpText={localization.dataServiceForm.helptext.contactName}
            >
              {localization.dataServiceForm.fieldLabel.contactName}
            </TitleWithHelpTextAndTag>
          }
        />
      </div>

      <FormikOptionalFieldsFieldset
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.dataServiceForm.helptext.contactFields}
            tagTitle={localization.tag.required}
          >
            {localization.dataServiceForm.fieldLabel.contactFields}
          </TitleWithHelpTextAndTag>
        }
        availableFields={contactPointOptions}
      />
      {hasMainLevelError() && (
        <ErrorMessage size="sm" error>
          {getErrors()}
        </ErrorMessage>
      )}
    </Box>
  );
};
