"use client";

import { ModelDocument } from "@catalog-frontend/types";
import { localization, trimObjectWhitespace } from "@catalog-frontend/utils";
import { Button, Dialog, Heading } from "@digdir/designsystemet-react";
import { Formik, FormikErrors } from "formik";
import { AddButton, DialogActions, EditButton } from "@catalog-frontend/ui";
import { useEffect, useRef, useState, type RefObject } from "react";
import { modelDocumentSchema } from "../../utils/validation-schema";
import { modelDocumentTemplate } from "../../utils/information-model-initial-values";
import styles from "../../information-model-form.module.css";
import cn from "classnames";
import { HasFormatFormFields } from "./has-format-form-fields";
import { hasNoFieldValues } from "./has-format-helpers";

type ModalProps = {
  referenceDataEnv: string;
  type: "new" | "edit";
  onSuccess: (values: ModelDocument) => void;
  onCancel: () => void;
  onChange: (values: ModelDocument) => void;
  template: ModelDocument;
};

type HasFormatModalContentProps = {
  type: "new" | "edit";
  errors: FormikErrors<ModelDocument>;
  isSubmitting: boolean;
  submitForm: () => Promise<void>;
  values: ModelDocument;
  dirty: boolean;
  setFieldValue: (
    field: string,
    value: ModelDocument[keyof ModelDocument],
  ) => void;
  onChange: (values: ModelDocument) => void;
  modalRef: RefObject<HTMLDialogElement | null>;
  referenceDataEnv: string;
};

const HasFormatModalContent = ({
  type,
  errors,
  isSubmitting,
  submitForm,
  values,
  dirty,
  setFieldValue,
  onChange,
  modalRef,
  referenceDataEnv,
}: HasFormatModalContentProps) => {
  useEffect(() => {
    if (dirty && modalRef.current?.open) {
      onChange({ ...values });
    }
  }, [values, dirty, onChange, modalRef]);

  return (
    <>
      <Heading data-size="xs">
        {type === "edit"
          ? `${localization.edit} ${localization.informationModelForm.fieldLabel.document.toLowerCase()}`
          : `${localization.add} ${localization.informationModelForm.fieldLabel.document.toLowerCase()}`}
      </Heading>

      <div className={cn(styles.modalContent, styles.fieldContainer)}>
        <HasFormatFormFields
          errors={errors}
          setFieldValue={setFieldValue}
          values={values}
          referenceDataEnv={referenceDataEnv}
        />
      </div>

      <DialogActions>
        <Button
          type="button"
          disabled={isSubmitting || !dirty || hasNoFieldValues(values)}
          onClick={() => submitForm()}
          data-size="sm"
        >
          {type === "new" ? localization.add : localization.update}
        </Button>
        <Button
          variant="secondary"
          type="button"
          onClick={() => modalRef.current?.close()}
          disabled={isSubmitting}
          data-size="sm"
        >
          {localization.button.cancel}
        </Button>
      </DialogActions>
    </>
  );
};

export const HasFormatFieldModal = ({
  template,
  type,
  onSuccess,
  onCancel,
  onChange,
  referenceDataEnv,
}: ModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  const resetLocalState = () => {
    setSubmitted(false);
  };

  const handleClose = () => {
    onCancel();
    resetLocalState();
  };

  return (
    <>
      <Dialog.TriggerContext>
        <Dialog.Trigger asChild>
          {type === "new" ? (
            <AddButton>{`${localization.add} ${localization.informationModelForm.fieldLabel.document.toLowerCase()}`}</AddButton>
          ) : (
            <EditButton />
          )}
        </Dialog.Trigger>
        <Dialog ref={modalRef} onClose={handleClose}>
          <Formik
            initialValues={modelDocumentTemplate(template)}
            enableReinitialize={true}
            validateOnChange={submitted}
            validateOnBlur={submitted}
            validationSchema={modelDocumentSchema}
            onSubmit={(formValues, { setSubmitting, resetForm }) => {
              const trimmedValues = trimObjectWhitespace(formValues);
              onSuccess(trimmedValues);
              setSubmitting(false);
              resetForm();
              resetLocalState();
              modalRef.current?.close();
            }}
          >
            {(formikProps) => (
              <HasFormatModalContent
                type={type}
                errors={formikProps.errors}
                isSubmitting={formikProps.isSubmitting}
                submitForm={formikProps.submitForm}
                values={formikProps.values}
                dirty={formikProps.dirty}
                setFieldValue={formikProps.setFieldValue}
                onChange={onChange}
                modalRef={modalRef}
                referenceDataEnv={referenceDataEnv}
              />
            )}
          </Formik>
        </Dialog>
      </Dialog.TriggerContext>
    </>
  );
};
