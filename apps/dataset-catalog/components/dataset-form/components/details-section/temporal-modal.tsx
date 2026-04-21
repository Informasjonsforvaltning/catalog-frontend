import { Dataset, DateRange } from "@catalog-frontend/types";
import {
  AddButton,
  DeleteButton,
  EditButton,
  FormHeading,
  DialogActions,
  HelpMarkdown,
} from "@catalog-frontend/ui";
import {
  formatFlexibleDate,
  localization,
  toCanonicalFlexibleISO,
  trimObjectWhitespace,
} from "@catalog-frontend/utils";
import { Button, Dialog, Heading, Table } from "@digdir/designsystemet-react";
import { FieldArray, Formik, useFormikContext } from "formik";
import styles from "../../dataset-form.module.css";
import { ReactNode, useRef, useState } from "react";
import { get, isEmpty } from "lodash";
import { dateSchema } from "../../utils/validation-schema";
import cn from "classnames";
import { MinusIcon } from "@navikt/aksel-icons";
import { DateFieldWithPicker } from "./date-field-with-picker";

interface Props {
  label?: string | ReactNode;
  errors?: any;
}

interface ModalProps {
  type: "new" | "edit";
  onSuccess: (values: DateRange) => void;
  onCancel: () => void;
  template: DateRange;
}

const hasNoFieldValues = (values: DateRange) => {
  if (!values) return true;
  return isEmpty(values.startDate) && isEmpty(values.endDate);
};

export const TemporalModal = ({ label }: Props) => {
  const { values, errors, setFieldValue } = useFormikContext<Dataset>();
  const [snapshot, setSnapshot] = useState<DateRange[]>(values?.temporal ?? []);

  return (
    <div className={styles.fieldContainer}>
      {typeof label === "string" ? <FormHeading>{label}</FormHeading> : label}
      <FieldArray
        name="temporal"
        render={(arrayHelpers) => (
          <div
            className={get(errors, "temporal") ? styles.errorBorder : undefined}
          >
            {values?.temporal && values?.temporal?.length > 0 && (
              <Table data-size="sm" className={styles.table}>
                <Table.Head>
                  <Table.Row>
                    <Table.HeaderCell>{localization.from}</Table.HeaderCell>
                    <Table.HeaderCell>{localization.to}</Table.HeaderCell>
                    <Table.HeaderCell aria-label="Actions" />
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {values?.temporal?.map((item, index) => (
                    <Table.Row key={`temporal-tableRow-${index}`}>
                      <Table.Cell>
                        {item?.startDate
                          ? formatFlexibleDate(item.startDate)
                          : "-"}
                      </Table.Cell>
                      <Table.Cell>
                        {item?.endDate ? formatFlexibleDate(item.endDate) : "-"}
                      </Table.Cell>
                      <Table.Cell>
                        <span className={styles.set}>
                          <FieldModal
                            template={item}
                            type="edit"
                            onSuccess={(updatedItem: DateRange) => {
                              arrayHelpers.replace(index, updatedItem);
                              setSnapshot((prev) => {
                                const next = [...prev];
                                next[index] = updatedItem;
                                return next;
                              });
                            }}
                            onCancel={() => setFieldValue("temporal", snapshot)}
                          />
                          <DeleteButton
                            onClick={() => {
                              const newArray = [...(values.temporal ?? [])];
                              newArray.splice(index, 1);
                              setFieldValue("temporal", newArray);
                              setSnapshot([...newArray]);
                            }}
                          />
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            )}
            <div>
              <FieldModal
                template={{ startDate: "", endDate: "" }}
                type="new"
                onSuccess={(newItem: DateRange) => {
                  if (snapshot.length === (values.temporal?.length ?? 0)) {
                    arrayHelpers.push(newItem);
                  } else {
                    arrayHelpers.replace(snapshot.length, newItem);
                  }
                  setSnapshot((prev) => [...prev, newItem]);
                }}
                onCancel={() => setFieldValue("temporal", snapshot)}
              />
            </div>
          </div>
        )}
      />
    </div>
  );
};

const canonicalIsoRegex = /^\d{4}(-\d{2}(-\d{2})?)?$/;

const toDisplayForm = (value: string | undefined): string => {
  if (!value) {
    return "";
  }

  if (canonicalIsoRegex.test(value)) {
    return formatFlexibleDate(value) ?? value;
  }

  return value;
};

const normalizeToCanonical = (value: string | undefined): string => {
  if (!value) return "";
  return toCanonicalFlexibleISO(value) ?? value;
};

const FieldModal = ({ template, type, onSuccess, onCancel }: ModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const displayTemplate: DateRange = {
    startDate: toDisplayForm(template.startDate),
    endDate: toDisplayForm(template.endDate),
  };

  return (
    <>
      <Dialog.TriggerContext>
        <Dialog.Trigger asChild>
          {type === "edit" ? (
            <EditButton />
          ) : (
            <AddButton>{localization.datasetForm.button.addDate}</AddButton>
          )}
        </Dialog.Trigger>
        <Dialog ref={modalRef}>
          <Formik
            initialValues={displayTemplate}
            enableReinitialize={true}
            validateOnChange={false}
            validateOnBlur={false}
            validationSchema={dateSchema}
            onSubmit={(formValues, { setSubmitting, resetForm }) => {
              const trimmedValues = trimObjectWhitespace(formValues);
              const normalized: DateRange = {
                startDate: normalizeToCanonical(trimmedValues.startDate),
                endDate: normalizeToCanonical(trimmedValues.endDate),
              };
              onSuccess(normalized);
              setSubmitting(false);
              resetForm();
              modalRef.current?.close();
            }}
          >
            {({ isSubmitting, submitForm, values, dirty, errors }) => {
              return (
                <>
                  <Heading data-size="xs">
                    {type === "edit"
                      ? `${localization.edit} `
                      : `${localization.add} `}
                  </Heading>

                  <div className={cn(styles.modalContent, styles.calendar)}>
                    <DateFieldWithPicker
                      name="startDate"
                      label={localization.from}
                      helpText={
                        <HelpMarkdown
                          aria-label={localization.helpWithCompleting}
                          placement="top-end"
                        >
                          {localization.datasetForm.helptext.temporalDateFormat}
                        </HelpMarkdown>
                      }
                      error={errors.startDate}
                    />

                    <MinusIcon title="minus-icon" fontSize="1rem" />

                    <DateFieldWithPicker
                      name="endDate"
                      label={localization.to}
                      helpText={
                        <HelpMarkdown
                          aria-label={localization.helpWithCompleting}
                          placement="top-end"
                        >
                          {localization.datasetForm.helptext.temporalDateFormat}
                        </HelpMarkdown>
                      }
                      error={errors.endDate}
                    />
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
                        onCancel();
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
