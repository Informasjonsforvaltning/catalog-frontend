import { LocalizedStrings, Output, Service } from "@catalog-frontend/types";
import {
  AddButton,
  DeleteButton,
  DialogActions,
  EditButton,
  FieldsetDivider,
  FormikLanguageFieldset,
} from "@catalog-frontend/ui-v2";
import cn from "classnames";
import {
  getTranslateText,
  localization,
  trimObjectWhitespace,
} from "@catalog-frontend/utils";
import {
  Button,
  Card,
  Heading,
  Paragraph,
  Textfield,
  ValidationMessage,
  Dialog,
} from "@digdir/designsystemet-react";
import { FieldArray, Formik, useFormikContext } from "formik";
import styles from "../service-form.module.css";
import { useEffect, useRef, useState } from "react";
import { trim, isEmpty, pickBy, identity } from "lodash";
import {
  confirmedProducesSchema,
  draftProducesSchema,
} from "../validation-schema";

interface Props {
  errors?:
    | string
    | Array<{ title: LocalizedStrings; description: LocalizedStrings }>;
  validationSchema: typeof confirmedProducesSchema | typeof draftProducesSchema;
}

interface ModalProps {
  validationSchema: typeof confirmedProducesSchema | typeof draftProducesSchema;
  onCancel: () => void;
  onChange: (values: Output) => void;
  onSuccess: (values: Output) => void;
  template: Output;
  type: "new" | "edit";
}

const hasNoFieldValues = (values: Output) => {
  if (!values) return true;
  return (
    isEmpty(trim(values.identifier)) && isEmpty(pickBy(values.title, identity))
  );
};

export const ProducesField = (props: Props) => {
  const { errors, validationSchema } = props;
  const { values, setFieldValue } = useFormikContext<Service>();
  const [snapshot, setSnapshot] = useState<Output[]>(values.produces ?? []);

  return (
    <FieldArray
      name="produces"
      render={(arrayHelpers) => (
        <div className={cn(styles.fieldSet, errors && styles.errorBorder)}>
          {values.produces?.map((item, index) => (
            <Card key={`${index}-${item.identifier}`}>
              <div className={styles.heading}>
                <div>
                  <Heading data-size="2xs" level={3}>
                    {localization.serviceForm.fieldLabel.title}
                  </Heading>
                  <Paragraph data-size="sm">
                    {getTranslateText(item.title)}
                  </Paragraph>
                  {Array.isArray(errors) && errors?.[index]?.title && (
                    <ValidationMessage data-color="danger" data-size="sm">
                      {getTranslateText(errors[index].title)}
                    </ValidationMessage>
                  )}
                </div>

                <div className={styles.buttons}>
                  <FieldModal
                    validationSchema={validationSchema}
                    template={item}
                    type="edit"
                    onSuccess={(updatedItem: Output) => {
                      arrayHelpers.replace(index, updatedItem);
                      setSnapshot([...(values.produces ?? [])]);
                    }}
                    onCancel={() => setFieldValue("produces", snapshot)}
                    onChange={(updatedItem: Output) =>
                      arrayHelpers.replace(index, updatedItem)
                    }
                  />
                  <DeleteButton
                    onClick={() => {
                      const newArray = [...(values.produces ?? [])];
                      newArray.splice(index, 1);
                      setFieldValue("produces", newArray);
                      setSnapshot([...newArray]);
                    }}
                  />
                </div>
              </div>
              <div>
                <Heading data-size="2xs" level={3}>
                  {localization.serviceForm.fieldLabel.description}
                </Heading>
                <Paragraph data-size="sm">
                  {getTranslateText(item.description)}
                </Paragraph>
                {Array.isArray(errors) && errors?.[index]?.description && (
                  <ValidationMessage data-color="danger" data-size="sm">
                    {getTranslateText(errors[index].description)}
                  </ValidationMessage>
                )}
              </div>
            </Card>
          ))}

          <FieldModal
            validationSchema={validationSchema}
            template={{ title: {}, description: {}, identifier: "" }}
            type="new"
            onSuccess={() => setSnapshot([...(values.produces ?? [])])}
            onCancel={() => setFieldValue("produces", snapshot)}
            onChange={(updatedItem: Output) => {
              if (snapshot.length === (values.produces?.length ?? 0)) {
                arrayHelpers.push(updatedItem);
              } else {
                arrayHelpers.replace(snapshot.length, updatedItem);
              }
            }}
          />

          {typeof errors === "string" && (
            <ValidationMessage data-color="danger" data-size="sm">
              {errors}
            </ValidationMessage>
          )}
        </div>
      )}
    />
  );
};

const FieldModal = (props: ModalProps) => {
  const { template, type, onSuccess, onCancel, onChange, validationSchema } =
    props;
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger asChild>
        {type === "edit" ? (
          <EditButton />
        ) : (
          <AddButton>
            {localization.add}{" "}
            {localization.serviceForm.fieldLabel.produces.toLowerCase()}
          </AddButton>
        )}
      </Dialog.Trigger>
      <Dialog closeButton={false} ref={modalRef}>
        <Formik
          initialValues={template}
          enableReinitialize={true}
          validateOnChange={submitted}
          validateOnBlur={submitted}
          validationSchema={validationSchema}
          onSubmit={(formValues, { setSubmitting, resetForm }) => {
            const trimmedValues = trimObjectWhitespace(formValues);
            onSuccess(trimmedValues);
            setSubmitting(false);
            setSubmitted(true);
            resetForm();
            modalRef.current?.close();
          }}
        >
          {({ isSubmitting, submitForm, values, dirty, resetForm }) => {
            useEffect(() => {
              if (dirty) {
                onChange({ ...values });
              }
            }, [values, dirty]);

            return (
              <>
                <Heading>
                  {type === "edit" ? localization.edit : localization.add}{" "}
                  {localization.serviceForm.fieldLabel.produces.toLowerCase()}
                </Heading>
                <div className={styles.modalContent}>
                  <FormikLanguageFieldset
                    as={Textfield}
                    name="title"
                    legend={localization.serviceForm.fieldLabel.title}
                  />

                  <FieldsetDivider />
                  <FormikLanguageFieldset
                    as={Textfield}
                    name="description"
                    legend={localization.serviceForm.fieldLabel.description}
                  />
                </div>
                <DialogActions>
                  <Button
                    type="button"
                    disabled={isSubmitting || hasNoFieldValues(values)}
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
  );
};
