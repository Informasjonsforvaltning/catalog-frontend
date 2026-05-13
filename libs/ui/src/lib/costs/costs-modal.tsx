"use client";

import { Cost, ReferenceDataCode } from "@catalog-frontend/types";
import {
  capitalizeFirstLetter,
  getTranslateText,
  localization,
  trimObjectWhitespace,
} from "@catalog-frontend/utils";
import {
  Button,
  Combobox,
  Dialog,
  ErrorSummary,
  Fieldset,
  Heading,
  Textfield,
} from "@digdir/designsystemet-react";
import { FieldArray, Formik, FormikProps } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { isEmpty, isNumber } from "lodash";
import { AddButton, DeleteButton, EditButton } from "../button";
import { DialogActions } from "../dialog-actions";
import { FieldsetDivider } from "../fieldset-divider";
import { FastFieldWithRef } from "../formik-fast-field-with-ref";
import { FormikLanguageFieldset } from "../formik-language-fieldset";
import { TextareaWithPrefix } from "../textarea-with-prefix";
import { TitleWithHelpTextAndTag } from "../title-with-help-text-and-tag";
import { costValidationSchema } from "./cost-validation-schema";
import styles from "./costs.module.scss";

const DEFAULT_CURRENCY =
  "http://publications.europa.eu/resource/authority/currency/NOK";

type CostsModalProps = {
  type: "new" | "edit";
  onSuccess: (values: Cost) => void;
  template: Cost;
  currencies?: ReferenceDataCode[];
};

export const CostsModal = ({
  template,
  type,
  onSuccess,
  currencies,
}: CostsModalProps) => {
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [showValueField, setShowValueField] = useState(false);
  const [focus, setFocus] = useState<string | null>();
  const modalRef = useRef<HTMLDialogElement>(null);
  const formikRef = useRef<FormikProps<Cost>>(null);
  const valueRef = React.createRef<HTMLInputElement | HTMLTextAreaElement>();
  const docRef = React.createRef<HTMLInputElement | HTMLTextAreaElement>();

  useEffect(() => {
    if (focus === "value") {
      valueRef?.current?.focus();
      setFocus(null);
    }
    if (focus === "documentation") {
      docRef?.current?.focus();
      setFocus(null);
    }
  }, [focus, valueRef, docRef]);

  useEffect(() => {
    if (type !== "new") return;
    const dialog = modalRef.current;
    if (!dialog) return;

    const handleClose = () => {
      formikRef.current?.resetForm({ values: template });
      setShowValueField(false);
      setValidateOnChange(false);
    };

    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [type, template]);

  const rmCurrencyIfNoValue = (formValues: Cost): Cost => {
    if (isNumber(formValues?.value)) {
      return formValues;
    }

    return {
      currency: undefined,
      value: undefined,
      documentation: formValues.documentation,
      description: formValues.description,
    };
  };

  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger asChild>
        {type === "new" ? (
          <AddButton>{`${localization.add} ${localization.cost.fieldLabel.costs.toLowerCase()}`}</AddButton>
        ) : (
          <EditButton />
        )}
      </Dialog.Trigger>
      <Dialog ref={modalRef}>
        <Formik
          innerRef={formikRef}
          initialValues={template}
          validateOnChange={validateOnChange}
          validateOnBlur={validateOnChange}
          validationSchema={costValidationSchema}
          onSubmit={(formValues: Cost, { setSubmitting }) => {
            const trimmedValues = trimObjectWhitespace(
              rmCurrencyIfNoValue(formValues),
            );
            onSuccess(trimmedValues);
            setSubmitting(false);
            modalRef.current?.close();
          }}
        >
          {({
            errors,
            isSubmitting,
            submitForm,
            values,
            dirty,
            setFieldValue,
            validateForm,
          }) => {
            const showValueError = () =>
              validateOnChange && !isEmpty(errors?.value);

            return (
              <>
                <Heading>
                  {type === "edit"
                    ? `${localization.edit} ${localization.cost.fieldLabel.costs.toLowerCase()}`
                    : `${localization.add} ${localization.cost.fieldLabel.costs.toLowerCase()}`}
                </Heading>

                <div className={styles.modalContent}>
                  <Fieldset>
                    <Fieldset.Legend>
                      <TitleWithHelpTextAndTag
                        tagTitle={localization.tag.recommended}
                        helpText={localization.cost.helptext.costValue}
                        tagColor="info"
                      >
                        {localization.cost.fieldLabel.costValue}
                      </TitleWithHelpTextAndTag>
                    </Fieldset.Legend>
                    {showValueField || isNumber(values?.value) ? (
                      <div className={styles.valueCurrencyFieldset}>
                        <FastFieldWithRef
                          name="value"
                          as={Textfield}
                          data-size="sm"
                          ref={valueRef}
                          type="number"
                        />
                        <Combobox
                          value={[values?.currency ?? DEFAULT_CURRENCY]}
                          portal={false}
                          onValueChange={(selectedValues) => {
                            if (selectedValues.length === 0) return;
                            setFieldValue("currency", selectedValues[0]);
                          }}
                          data-size="sm"
                          disabled={!isNumber(values?.value)}
                          hideClearButton
                        >
                          {currencies?.map((currencyRef, i) => (
                            <Combobox.Option
                              key={`currency-${currencyRef.uri}-${i}`}
                              value={currencyRef.uri}
                            >
                              {currencyRef.code} (
                              {capitalizeFirstLetter(
                                getTranslateText(currencyRef.label),
                              )}
                              )
                            </Combobox.Option>
                          ))}
                        </Combobox>
                        <DeleteButton
                          onClick={() => {
                            setFieldValue("value", undefined);
                            setFieldValue("currency", undefined);
                            setShowValueField(false);
                          }}
                        />
                      </div>
                    ) : (
                      <AddButton
                        onClick={() => {
                          setFieldValue("value", "");
                          setFieldValue("currency", DEFAULT_CURRENCY);
                          setFocus("value");
                          setShowValueField(true);
                        }}
                      >
                        {localization.cost.fieldLabel.costValue}
                      </AddButton>
                    )}
                    {showValueError() && (
                      <ErrorSummary>{errors.value}</ErrorSummary>
                    )}
                  </Fieldset>

                  <FieldsetDivider />

                  <Fieldset>
                    <Fieldset.Legend>
                      <TitleWithHelpTextAndTag
                        tagTitle={localization.tag.recommended}
                        helpText={localization.cost.helptext.costDocumentation}
                        tagColor="info"
                      >
                        {localization.cost.fieldLabel.costDocumentation}
                      </TitleWithHelpTextAndTag>
                    </Fieldset.Legend>
                    <FieldArray name="documentation">
                      {(arrayHelpers) => (
                        <>
                          {arrayHelpers.form.values.documentation?.map(
                            (_: string, index: number) => (
                              <div
                                key={`documentation-${index}`}
                                className={styles.documentationRow}
                              >
                                <div className={styles.documentationField}>
                                  <FastFieldWithRef
                                    name={`documentation[${index}]`}
                                    as={Textfield}
                                    data-size="sm"
                                    ref={docRef}
                                    error={errors?.documentation?.[index]}
                                  />
                                </div>
                                <DeleteButton
                                  onClick={() => arrayHelpers.remove(index)}
                                />
                              </div>
                            ),
                          )}

                          <AddButton
                            onClick={() => {
                              arrayHelpers.push("");
                              setFocus("documentation");
                            }}
                          >
                            {localization.cost.fieldLabel.costDocumentation}
                          </AddButton>
                        </>
                      )}
                    </FieldArray>
                  </Fieldset>

                  <FieldsetDivider />

                  <FormikLanguageFieldset
                    name="description"
                    as={TextareaWithPrefix}
                    legend={
                      <TitleWithHelpTextAndTag
                        tagTitle={localization.tag.recommended}
                        helpText={localization.cost.helptext.costDescription}
                        tagColor="info"
                      >
                        {localization.cost.fieldLabel.costDescription}
                      </TitleWithHelpTextAndTag>
                    }
                  />
                </div>

                <DialogActions>
                  <Button
                    type="button"
                    disabled={isSubmitting || !dirty}
                    onClick={() => {
                      validateForm().then((result) => {
                        if (isEmpty(result)) {
                          setValidateOnChange(false);
                          submitForm();
                        } else {
                          setValidateOnChange(true);
                        }
                      });
                    }}
                  >
                    {type === "new" ? localization.add : localization.update}
                  </Button>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      setValidateOnChange(false);
                      modalRef.current?.close();
                    }}
                    disabled={isSubmitting}
                  >
                    {localization.button.cancel}
                  </Button>
                </DialogActions>
              </>
            );
          }}
        </Formik>
      </Dialog>
    </Dialog.TriggerContext>
  );
};
