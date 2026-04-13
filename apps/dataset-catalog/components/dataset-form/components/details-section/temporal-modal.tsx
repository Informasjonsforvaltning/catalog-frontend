import { Dataset, DateRange } from "@catalog-frontend/types";
import {
  AddButton,
  DeleteButton,
  EditButton,
  FormHeading,
  DialogActions,
  DatePickerPasteWrapper,
} from "@catalog-frontend/ui";
import {
  formatDateToDDMMYYYY,
  localization,
  trimObjectWhitespace,
} from "@catalog-frontend/utils";
import {
  Button,
  Dialog,
  Heading,
  Table,
  Textfield,
} from "@digdir/designsystemet-react";
import { FastField, FieldArray, Formik, useFormikContext } from "formik";
import styles from "../../dataset-form.module.css";
import { ReactNode, useEffect, useRef, useState } from "react";
import { get, isEmpty } from "lodash";
import { dateSchema } from "../../utils/validation-schema";
import cn from "classnames";
import { MinusIcon } from "@navikt/aksel-icons";

interface Props {
  label?: string | ReactNode;
  errors?: any;
}

interface ModalProps {
  type: "new" | "edit";
  onSuccess: (values: DateRange) => void;
  onCancel: () => void;
  onChange: (values: DateRange) => void;
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
                          ? formatDateToDDMMYYYY(item.startDate)
                          : "-"}
                      </Table.Cell>
                      <Table.Cell>
                        {item?.endDate
                          ? formatDateToDDMMYYYY(item.endDate)
                          : "-"}
                      </Table.Cell>
                      <Table.Cell>
                        <span className={styles.set}>
                          <FieldModal
                            template={item}
                            type="edit"
                            onSuccess={(updatedItem: DateRange) => {
                              arrayHelpers.replace(index, updatedItem);
                              setSnapshot([...(values.temporal ?? [])]);
                            }}
                            onCancel={() => setFieldValue("temporal", snapshot)}
                            onChange={(updatedItem: DateRange) =>
                              arrayHelpers.replace(index, updatedItem)
                            }
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
                onSuccess={() => setSnapshot([...(values.temporal ?? [])])}
                onCancel={() => setFieldValue("temporal", snapshot)}
                onChange={(updatedItem: DateRange) => {
                  if (snapshot.length === (values.temporal?.length ?? 0)) {
                    arrayHelpers.push(updatedItem);
                  } else {
                    arrayHelpers.replace(snapshot.length, updatedItem);
                  }
                }}
              />
            </div>
          </div>
        )}
      />
    </div>
  );
};

const FieldModal = ({
  template,
  type,
  onSuccess,
  onCancel,
  onChange,
}: ModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

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
            initialValues={template}
            enableReinitialize={true}
            validateOnChange={submitted}
            validateOnBlur={submitted}
            validationSchema={dateSchema}
            onSubmit={(formValues, { setSubmitting, resetForm }) => {
              const trimmedValues = trimObjectWhitespace(formValues);
              onSuccess(trimmedValues);
              setSubmitting(false);
              setSubmitted(true);
              resetForm();
              modalRef.current?.close();
            }}
          >
            {({ isSubmitting, submitForm, values, dirty, errors }) => {
              useEffect(() => {
                //if (dirty && modalRef.current?.open) {
                if (dirty && modalRef.current?.open) {
                  onChange({ ...values });
                }
              }, [values, dirty]);

              const setStartDate = (
                event: React.ChangeEvent<HTMLInputElement>, // TODO: can this be typed better? This is the type for the onChange event from the DatePickerPasteWrapper, but it could also be a synthetic event that we create when a date is pasted, which has the same shape as a normal onChange event from an input field, but with the value already formatted to ISO string.
              ) => {
                dirty = true;
                values.startDate = event.target.value;
                console.log(
                  "Formik values after setting start date: ",
                  values.startDate,
                );
                //focusNextElement();
                // TODO: trigger re-render. Is triggered when focus changes, but inconsistent
              };

              const setEndDate = (
                event: React.ChangeEvent<HTMLInputElement>, // TODO: can this be typed better? This is the type for the onChange event from the DatePickerPasteWrapper, but it could also be a synthetic event that we create when a date is pasted, which has the same shape as a normal onChange event from an input field, but with the value already formatted to ISO string.
              ) => {
                dirty = true;
                values.endDate = event.target.value;
                //focusNextElement();
                console.log("End date: ", values.endDate);
              };

              return (
                <>
                  <Heading data-size="xs">
                    {type === "edit"
                      ? `${localization.edit} `
                      : `${localization.add} `}
                  </Heading>
                  <div className={cn(styles.modalContent, styles.calendar)}>
                    <DatePickerPasteWrapper setValue={setStartDate}>
                      <FastField
                        as={Textfield}
                        data-size="sm"
                        label={localization.from}
                        type="date"
                        name="startDate"
                        error={errors.startDate}
                      />
                    </DatePickerPasteWrapper>

                    <MinusIcon title="minus-icon" fontSize="1rem" />
                    <DatePickerPasteWrapper setValue={setEndDate}>
                      <FastField
                        as={Textfield}
                        data-size="sm"
                        label={localization.to}
                        type="date"
                        name="endDate"
                        error={errors.endDate}
                        min={values?.startDate}
                      />
                    </DatePickerPasteWrapper>
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

// experimental: generated method to focus next element in the DOM, used in modal
const focusNextElement = () => {
  const FOCUSABLE_SELECTORS = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable]:not([contenteditable="false"])',
  ].join(", ");
  // Get all focusable elements in the document
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
  ).filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0); // Ensure elements are visible

  const currentIndex = elements.indexOf(document.activeElement as HTMLElement);

  // Move to the next element, or wrap around to the first
  const nextIndex = (currentIndex + 1) % elements.length;
  elements[nextIndex]?.focus();
};
