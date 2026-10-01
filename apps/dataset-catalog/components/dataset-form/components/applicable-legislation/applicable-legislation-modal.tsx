"use client";

import { ApplicableLegislation } from "@catalog-frontend/types";
import {
  AddButton,
  DialogActions,
  EditButton,
  FieldsetDivider,
  FormikLanguageFieldset,
  FormikMultivalueTextfield,
  TitleWithHelpTextAndTag,
} from "@catalog-frontend/ui";
import {
  Button,
  Dialog,
  Heading,
  Textfield,
} from "@digdir/designsystemet-react";
import { localization, trimObjectWhitespace } from "@catalog-frontend/utils";
import { useEffect, useRef, useState } from "react";
import { Formik, FormikProps } from "formik";
import { isEmpty } from "lodash";
import styles from "../../dataset-form.module.css";
import { applicableLegislationSchema } from "../../utils/validation-schema";

type ApplicableLegislationModalProps = {
  type: "new" | "edit";
  onSuccess: (values: ApplicableLegislation) => void;
  onCancel: () => void;
  template: ApplicableLegislation;
};

export const ApplicableLegislationModal = ({
  type,
  onSuccess,
  onCancel,
  template,
}: ApplicableLegislationModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const formikRef = useRef<FormikProps<ApplicableLegislation>>(null);
  const [validateOnChange, setValidateOnChange] = useState(false);

  useEffect(() => {
    const dialog = modalRef.current;
    if (!dialog) return;

    const handleClose = () => {
      formikRef.current?.resetForm({ values: template });
      setValidateOnChange(false);
    };
    const handleCancel = () => {
      formikRef.current?.resetForm();
      setValidateOnChange(false);
    };

    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("cancel", handleCancel);
    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("cancel", handleCancel);
    };
  }, [type, template]);
  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger asChild>
        {type === "new" ? (
          <AddButton>{`${localization.add} ${localization.applicableLegislation.fieldLabel.toLowerCase()}`}</AddButton>
        ) : (
          <EditButton />
        )}
      </Dialog.Trigger>
      <Dialog ref={modalRef}>
        <Formik
          innerRef={formikRef}
          initialValues={template}
          onSubmit={(formValues: ApplicableLegislation, { setSubmitting }) => {
            const trimmedValues = trimObjectWhitespace(formValues);
            onSuccess(trimmedValues);
            setSubmitting(false);
            modalRef.current?.close();
          }}
          validationSchema={applicableLegislationSchema}
          validateOnChange={validateOnChange}
        >
          {({ isSubmitting, submitForm, dirty, validateForm, errors }) => {
            return (
              <>
                <Heading>
                  {type === "edit"
                    ? `${localization.edit} ${localization.applicableLegislation.fieldLabel.toLowerCase()}`
                    : `${localization.add} ${localization.applicableLegislation.fieldLabel.toLowerCase()}`}
                </Heading>
                <div className={styles.modalContent}>
                  <FormikLanguageFieldset
                    name="title"
                    as={Textfield}
                    legend={
                      <TitleWithHelpTextAndTag
                        tagTitle={localization.tag.required}
                      >
                        {localization.applicableLegislation.title}
                      </TitleWithHelpTextAndTag>
                    }
                    showError
                  />
                  <FieldsetDivider />
                  <FormikLanguageFieldset
                    name="description"
                    as={Textfield}
                    legend={
                      <TitleWithHelpTextAndTag
                        tagTitle={localization.tag.recommended}
                        tagColor="info"
                      >
                        {localization.applicableLegislation.description}
                      </TitleWithHelpTextAndTag>
                    }
                  />
                  <FieldsetDivider />
                  <FormikMultivalueTextfield
                    label={
                      <TitleWithHelpTextAndTag
                        helpText={
                          localization.applicableLegislation.references.helpText
                        }
                      >
                        {
                          localization.applicableLegislation.references
                            .fieldLabel
                        }
                      </TitleWithHelpTextAndTag>
                    }
                    name="references"
                    error={errors.references}
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
                      onCancel();
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
