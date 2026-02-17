import { DataServiceCost, ReferenceDataCode } from "@catalog-frontend/types";
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
import { FieldArray, Formik } from "formik";
import {
  AddButton,
  EditButton,
  FieldsetDivider,
  FormikLanguageFieldset,
  TitleWithHelpTextAndTag,
  TextareaWithPrefix,
  DeleteButton,
  FastFieldWithRef,
  DialogActions,
} from "@catalog-frontend/ui-v2";
import React, { useState, useRef, useEffect } from "react";
import { isEmpty, isNumber } from "lodash";
import FieldsetWithDelete from "../../../fieldset-with-delete";
import { costValidationSchema } from "../../utils/validation-schema";
import styles from "./costs-modal.module.scss";

const DEFAULT_CURRENCY =
  "http://publications.europa.eu/resource/authority/currency/NOK";

type CostsModalProps = {
  type: "new" | "edit";
  onSuccess: (values: DataServiceCost) => void;
  template: DataServiceCost;
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

  const rmCurrencyIfNoValue = (formValues: DataServiceCost) => {
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
    <>
      <Dialog.TriggerContext>
        <Dialog.Trigger asChild>
          {type === "new" ? (
            <AddButton>{`${localization.add} ${localization.dataServiceForm.fieldLabel.costs.toLowerCase()}`}</AddButton>
          ) : (
            <EditButton />
          )}
        </Dialog.Trigger>
        <Dialog ref={modalRef}>
          <Formik
            initialValues={template}
            validateOnChange={validateOnChange}
            validateOnBlur={validateOnChange}
            validationSchema={costValidationSchema}
            onSubmit={(formValues: DataServiceCost, { setSubmitting }) => {
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
              const showValueError = () => {
                return validateOnChange && !isEmpty(errors?.value);
              };

              return (
                <>
                  <Heading>
                    {type === "edit"
                      ? `${localization.edit} ${localization.dataServiceForm.fieldLabel.costs.toLowerCase()}`
                      : `${localization.add} ${localization.dataServiceForm.fieldLabel.costs.toLowerCase()}`}
                  </Heading>

                  <div className={styles.modalContent}>
                    <Fieldset>
                      <Fieldset.Legend>
                        <TitleWithHelpTextAndTag
                          tagTitle={localization.tag.recommended}
                          helpText={
                            localization.dataServiceForm.helptext.costValue
                          }
                        >
                          {localization.dataServiceForm.fieldLabel.costValue}
                        </TitleWithHelpTextAndTag>
                      </Fieldset.Legend>
                      {showValueField || isNumber(values?.value) ? (
                        <div className={styles.valueCurrencyFieldset}>
                          <FastFieldWithRef
                            name="value"
                            as={Textfield}
                            size="sm"
                            ref={valueRef}
                            type="number"
                          />
                          <Combobox
                            value={[values?.currency ?? DEFAULT_CURRENCY]}
                            portal={false}
                            onValueChange={(selectedValues) =>
                              setFieldValue(
                                "currency",
                                selectedValues.toString(),
                              )
                            }
                            size="sm"
                            disabled={!isNumber(values?.value)}
                          >
                            {currencies &&
                              currencies.map((currencyRef, i) => (
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
                          {`${localization.dataServiceForm.fieldLabel.costValue}`}
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
                          helpText={
                            localization.dataServiceForm.helptext
                              .costDocumentation
                          }
                        >
                          {
                            localization.dataServiceForm.fieldLabel
                              .costDocumentation
                          }
                        </TitleWithHelpTextAndTag>
                      </Fieldset.Legend>
                      <FieldArray name="documentation">
                        {(arrayHelpers) => (
                          <>
                            {arrayHelpers.form.values.documentation &&
                              arrayHelpers.form.values.documentation.map(
                                (_, index: number) => (
                                  <div
                                    key={`documentation-${index}`}
                                    className={styles.padding}
                                  >
                                    <FieldsetWithDelete
                                      onDelete={() =>
                                        arrayHelpers.remove(index)
                                      }
                                    >
                                      <FastFieldWithRef
                                        name={`documentation[${index}]`}
                                        as={Textfield}
                                        size="sm"
                                        ref={docRef}
                                        error={errors?.documentation?.[index]}
                                      />
                                    </FieldsetWithDelete>
                                  </div>
                                ),
                              )}

                            <AddButton
                              onClick={() => {
                                arrayHelpers.push("");
                                setFocus("documentation");
                              }}
                            >
                              {`${localization.dataServiceForm.fieldLabel.costDocumentation}`}
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
                          helpText={
                            localization.dataServiceForm.helptext
                              .costDescription
                          }
                        >
                          {
                            localization.dataServiceForm.fieldLabel
                              .costDescription
                          }
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
                      {type === "new"
                        ? localization.add
                        : localization.dataServiceForm.button.update}
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
    </>
  );
};
