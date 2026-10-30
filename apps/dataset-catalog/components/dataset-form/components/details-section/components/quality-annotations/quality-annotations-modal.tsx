"use client";

import {
  AddButton,
  DialogActions,
  EditButton,
  FieldsetDivider,
  FormikLanguageFieldset,
  MultiSuggestionSelect,
  TextareaWithPrefix,
  TitleWithHelpTextAndTag,
} from "@catalog-frontend/ui";
import { QualityAnnotation, QualityDimension } from "@catalog-frontend/types";
import { localization, trimObjectWhitespace } from "@catalog-frontend/utils";
import { Button, Dialog, Heading } from "@digdir/designsystemet-react";
import { Formik, FormikProps } from "formik";
import { isEmpty } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildQualityDimensionOptions,
  emptyQualityAnnotation,
} from "@dataset-catalog/utils/quality-annotations";
import { qualityAnnotationValidationSchema } from "./quality-annotations-validation-schema";
import styles from "./quality-annotations.module.css";

type QualityAnnotationsModalProps = {
  type: "new" | "edit";
  onSuccess: (values: QualityAnnotation) => void;
  template: QualityAnnotation;
  qualityDimensions?: QualityDimension[];
};

export const QualityAnnotationsModal = ({
  template,
  type,
  onSuccess,
  qualityDimensions,
}: QualityAnnotationsModalProps) => {
  const [validateOnChange, setValidateOnChange] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  const formikRef = useRef<FormikProps<QualityAnnotation>>(null);

  const dimensionOptions = useMemo(
    () => buildQualityDimensionOptions(qualityDimensions ?? []),
    [qualityDimensions],
  );

  useEffect(() => {
    if (type !== "new") return;
    const dialog = modalRef.current;
    if (!dialog) return;

    const handleClose = () => {
      formikRef.current?.resetForm({
        values: template ?? emptyQualityAnnotation(),
      });
      setValidateOnChange(false);
    };

    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [type, template]);

  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger asChild>
        {type === "new" ? (
          <AddButton>
            {localization.datasetForm.button.addQualityAnnotation}
          </AddButton>
        ) : (
          <EditButton />
        )}
      </Dialog.Trigger>
      <Dialog ref={modalRef}>
        <Formik
          innerRef={formikRef}
          initialValues={template}
          enableReinitialize
          validateOnChange={validateOnChange}
          validateOnBlur={validateOnChange}
          validationSchema={qualityAnnotationValidationSchema}
          onSubmit={(formValues, { setSubmitting }) => {
            const trimmedValues = trimObjectWhitespace(formValues);
            onSuccess(trimmedValues);
            setSubmitting(false);
            modalRef.current?.close();
          }}
        >
          {({
            isSubmitting,
            submitForm,
            values,
            dirty,
            setFieldValue,
            validateForm,
          }) => (
            <>
              <Heading>
                {`${type === "edit" ? localization.edit : localization.add} ${localization.datasetForm.fieldLabel.qualityAnnotations.toLowerCase()}`}
              </Heading>

              <div className={styles.modalContent}>
                <MultiSuggestionSelect
                  emptyMessage={localization.search.noHits}
                  fieldsetLegend={
                    <TitleWithHelpTextAndTag
                      helpText={localization.datasetForm.helptext.inDimension}
                    >
                      {localization.datasetForm.fieldLabel.inDimension}
                    </TitleWithHelpTextAndTag>
                  }
                  onSelectedChange={(selectedValues) =>
                    setFieldValue("inDimension", selectedValues)
                  }
                  options={dimensionOptions}
                  placeholder={`${localization.search.search}...`}
                  selectedValues={values.inDimension}
                />

                <FieldsetDivider />

                <FormikLanguageFieldset
                  as={TextareaWithPrefix}
                  name="hasBody"
                  legend={
                    <TitleWithHelpTextAndTag
                      helpText={
                        localization.datasetForm.helptext.qualityAnnotationBody
                      }
                    >
                      {
                        localization.datasetForm.fieldLabel
                          .qualityAnnotationBody
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
          )}
        </Formik>
      </Dialog>
    </Dialog.TriggerContext>
  );
};
