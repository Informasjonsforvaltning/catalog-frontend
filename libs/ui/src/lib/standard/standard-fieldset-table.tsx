"use client";

import { Standard } from "@catalog-frontend/types";
import {
  getTranslateText,
  localization,
  trimObjectWhitespace,
} from "@catalog-frontend/utils";
import {
  Button,
  Dialog,
  Fieldset,
  Heading,
  Paragraph,
  Table,
  Textfield,
} from "@digdir/designsystemet-react";
import { FastField, FieldArray, Formik, getIn, useFormikContext } from "formik";
import { ReactNode, useRef, useState } from "react";
import { trim, isEmpty, pickBy, identity } from "lodash";
import { AddButton, DeleteButton, EditButton } from "../button";
import { DialogActions } from "../dialog-actions";
import { FieldsetDivider } from "../fieldset-divider";
import { FormHeading } from "../form-heading";
import { FormikLanguageFieldset } from "../formik-language-fieldset";
import { standardSchema } from "./standard-validation-schema";
import styles from "../uri-with-label/uri-with-label.module.css";

interface Props {
  fieldName: string;
  itemLabel: string;
  errors: string | undefined;
  showDivider?: boolean;
  label?: string | ReactNode;
  hideHeadWhenEmpty?: boolean;
}

interface ModalProps {
  itemLabel: string;
  type: "new" | "edit";
  onSuccess: (values: Standard) => void;
  template: Standard;
}

const hasNoFieldValues = (values: Standard) => {
  if (!values) return true;
  return (
    !values.seeAlso?.some((url) => !isEmpty(trim(url))) &&
    isEmpty(pickBy(values.prefLabel, identity))
  );
};

export const StandardFieldsetTable = ({
  fieldName,
  itemLabel,
  label,
  errors,
  hideHeadWhenEmpty = false,
  showDivider,
}: Props) => {
  const { values, setFieldValue } = useFormikContext<Record<string, unknown>>();
  const fieldValues = values[fieldName] as Standard[] | undefined;

  const showHead = !hideHeadWhenEmpty || !isEmpty(fieldValues);

  return (
    <div className={styles.fieldContainer}>
      {typeof label === "string" ? <FormHeading>{label}</FormHeading> : label}
      <FieldArray
        name={fieldName}
        render={(arrayHelpers) => (
          <div className={errors ? styles.errorBorder : undefined}>
            <Table data-size="sm" className={styles.table}>
              {showHead && (
                <Table.Head>
                  <Table.Row>
                    <Table.HeaderCell>{localization.title}</Table.HeaderCell>
                    <Table.HeaderCell>{localization.link}</Table.HeaderCell>
                    <Table.HeaderCell aria-label="Actions" />
                  </Table.Row>
                </Table.Head>
              )}
              <Table.Body>
                {fieldValues?.map((item, index) => (
                  <Table.Row key={`${fieldName}-tableRow-${index}`}>
                    <Table.Cell>{getTranslateText(item?.prefLabel)}</Table.Cell>
                    <Table.Cell>
                      {item?.seeAlso?.map((url, urlIndex) => (
                        <Paragraph
                          data-size="sm"
                          key={`${fieldName}-${index}-link-${urlIndex}`}
                        >
                          {url}
                        </Paragraph>
                      ))}
                    </Table.Cell>
                    <Table.Cell>
                      <span className={styles.set}>
                        <FieldModal
                          itemLabel={itemLabel}
                          template={item}
                          type="edit"
                          onSuccess={(updatedItem: Standard) =>
                            arrayHelpers.replace(index, updatedItem)
                          }
                        />
                        <DeleteButton
                          onClick={() => {
                            const newArray = [...(fieldValues ?? [])];
                            newArray.splice(index, 1);
                            setFieldValue(fieldName, newArray);
                          }}
                        />
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <div>
              <FieldModal
                itemLabel={itemLabel}
                template={{ prefLabel: {}, seeAlso: [""] }}
                type="new"
                onSuccess={(values: Standard) => arrayHelpers.push(values)}
              />
            </div>
          </div>
        )}
      />
      {showDivider && <FieldsetDivider />}
    </div>
  );
};

const FieldModal = ({ itemLabel, template, type, onSuccess }: ModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Dialog.TriggerContext>
        <Dialog.Trigger asChild>
          {type === "edit" ? (
            <EditButton />
          ) : (
            <AddButton>
              {localization.add} {itemLabel.toLowerCase()}
            </AddButton>
          )}
        </Dialog.Trigger>
        <Dialog ref={modalRef}>
          <Formik
            initialValues={template}
            enableReinitialize={true}
            validateOnChange={submitted}
            validateOnBlur={submitted}
            validationSchema={standardSchema}
            onSubmit={(formValues, { setSubmitting, resetForm }) => {
              const trimmedValues: Standard = trimObjectWhitespace(formValues);
              onSuccess({
                ...trimmedValues,
                seeAlso: trimmedValues.seeAlso?.filter((url) => !isEmpty(url)),
              });
              setSubmitting(false);
              setSubmitted(true);
              resetForm();
              modalRef.current?.close();
            }}
          >
            {({
              errors,
              isSubmitting,
              submitForm,
              values,
              dirty,
              resetForm,
            }) => {
              return (
                <>
                  <Heading data-size="xs">
                    {type === "edit" ? localization.edit : localization.add}{" "}
                    {itemLabel.toLowerCase()}
                  </Heading>

                  <div className={styles.modalContent}>
                    <FormikLanguageFieldset
                      as={Textfield}
                      name="prefLabel"
                      legend={localization.title}
                    />
                    <FieldsetDivider />
                    <Fieldset data-size="sm">
                      <Fieldset.Legend>{localization.link}</Fieldset.Legend>
                      <FieldArray
                        name="seeAlso"
                        render={(linkHelpers) => (
                          <>
                            {values.seeAlso?.map((_, linkIndex) => (
                              <div
                                className={styles.set}
                                key={`seeAlso-${linkIndex}`}
                              >
                                <FastField
                                  name={`seeAlso[${linkIndex}]`}
                                  as={Textfield}
                                  aria-label={`${localization.link} ${linkIndex + 1}`}
                                  error={getIn(errors, `seeAlso[${linkIndex}]`)}
                                  data-size="sm"
                                />
                                <DeleteButton
                                  onClick={() => linkHelpers.remove(linkIndex)}
                                />
                              </div>
                            ))}
                            <AddButton onClick={() => linkHelpers.push("")}>
                              {`${localization.add} ${localization.link.toLowerCase()}`}
                            </AddButton>
                          </>
                        )}
                      />
                    </Fieldset>
                  </div>

                  <DialogActions>
                    <Button
                      type="button"
                      disabled={
                        isSubmitting || !dirty || hasNoFieldValues(values)
                      }
                      onClick={() => submitForm()}
                      data-size="sm"
                    >
                      {type === "new" ? localization.add : localization.update}
                    </Button>
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => {
                        resetForm();
                        modalRef.current?.close();
                      }}
                      disabled={isSubmitting}
                      data-size="sm"
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
