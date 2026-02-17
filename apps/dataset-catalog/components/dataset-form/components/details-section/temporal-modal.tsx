import { Dataset, DateRange } from "@catalog-frontend/types";
import {
  AddButton,
  DeleteButton,
  EditButton,
  FormHeading,
} from "@catalog-frontend/ui-v2";
import {
  formatDateToDDMMYYYY,
  localization,
  trimObjectWhitespace,
} from "@catalog-frontend/utils";
import { Button, Modal, Table, Textfield } from "@digdir/designsystemet-react";
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
              <Table size="sm" className={styles.table}>
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
      <Modal.Root>
        <Modal.Trigger asChild>
          {type === "edit" ? (
            <EditButton />
          ) : (
            <AddButton>{localization.datasetForm.button.addDate}</AddButton>
          )}
        </Modal.Trigger>
        <Modal.Dialog ref={modalRef}>
          <Formik
            initialValues={template}
            validateOnChange={submitted}
            validateOnBlur={submitted}
            validationSchema={dateSchema}
            onSubmit={(formValues, { setSubmitting }) => {
              const trimmedValues = trimObjectWhitespace(formValues);
              onSuccess(trimmedValues);
              setSubmitting(false);
              setSubmitted(true);
              modalRef.current?.close();
            }}
          >
            {({ isSubmitting, submitForm, values, dirty, errors }) => {
              useEffect(() => {
                if (dirty) {
                  onChange({ ...values });
                }
              }, [values, dirty]);

              return (
                <>
                  <Modal.Header closeButton={false}>
                    {type === "edit"
                      ? `${localization.edit} `
                      : `${localization.add} `}
                  </Modal.Header>

                  <Modal.Content
                    className={cn(styles.modalContent, styles.calendar)}
                  >
                    <FastField
                      as={Textfield}
                      size="sm"
                      label={localization.from}
                      type="date"
                      name="startDate"
                      error={errors.startDate}
                    />

                    <MinusIcon title="minus-icon" fontSize="1rem" />

                    <FastField
                      as={Textfield}
                      size="sm"
                      label={localization.to}
                      type="date"
                      name="endDate"
                      error={errors.endDate}
                      min={values.startDate}
                    />
                  </Modal.Content>

                  <Modal.Footer>
                    <Button
                      type="button"
                      disabled={
                        isSubmitting || !dirty || hasNoFieldValues(values)
                      }
                      onClick={() => submitForm()}
                      size="sm"
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
                      size="sm"
                    >
                      {localization.button.cancel}
                    </Button>
                  </Modal.Footer>
                </>
              );
            }}
          </Formik>
        </Modal.Dialog>
      </Modal.Root>
    </>
  );
};
