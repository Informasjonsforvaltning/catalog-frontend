import { ReactNode, useRef, useState, useEffect } from "react";
import { Formik } from "formik";
import { Button, Dialog, Heading } from "@digdir/designsystemet-react";
import {
  DialogActions,
  FieldsetDivider,
  FormikLanguageFieldset,
  TextareaWithPrefix,
  TitleWithHelpTextAndTag,
} from "@catalog-frontend/ui-v2";
import { Definisjon } from "@catalog-frontend/types";
import { localization } from "@catalog-frontend/utils";
import { SourceDescriptionFieldset } from "../source-description-fieldset";
import { definitionSchema } from "../../validation-schema";
import styles from "./definition-modal.module.scss";

export type DefinitionModalProps = {
  trigger: ReactNode;
  header: string;
  definitionHelpText?: string;
  initialDefinition?: Definisjon;
  onSucces: (def: Definisjon) => void;
  onChange?: (def: Definisjon) => void;
  onClose?: () => void;
};

const defaultDefinition: Definisjon = {
  tekst: {},
  kildebeskrivelse: { forholdTilKilde: "egendefinert", kilde: [] },
};

export const DefinitionModal = ({
  initialDefinition,
  header,
  definitionHelpText,
  trigger,
  onSucces,
  onChange,
  onClose,
}: DefinitionModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [submitted, setSubmitted] = useState(false);

  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog
        ref={modalRef}
        className={styles.dialog}
        style={{
          overflow: "visible",
        }}
        closeButton={false}
      >
        <Formik
          initialValues={initialDefinition || defaultDefinition}
          validationSchema={definitionSchema}
          validateOnChange={submitted}
          validateOnBlur={submitted}
          onSubmit={(values, { setSubmitting }) => {
            onSucces(values);
            setSubmitting(false);
            setSubmitted(true);
            modalRef.current?.close();
          }}
        >
          {({ errors, isValid, isSubmitting, submitForm, dirty, values }) => {
            useEffect(() => {
              if (dirty && onChange) {
                onChange(values);
              }
            }, [dirty, values]);

            return (
              <>
                <Heading
                  data-size="2xs"
                  style={{ marginBottom: "var(--ds-size-4)" }}
                >
                  {header}
                </Heading>
                <div className={styles.content}>
                  <FormikLanguageFieldset
                    name="tekst"
                    as={TextareaWithPrefix}
                    legend={
                      <TitleWithHelpTextAndTag
                        helpText={definitionHelpText}
                        tagTitle={localization.tag.required}
                        tagColor="warning"
                      >
                        {localization.conceptForm.fieldLabel.definition}
                      </TitleWithHelpTextAndTag>
                    }
                  />
                  <FieldsetDivider />
                  <SourceDescriptionFieldset name="kildebeskrivelse" />
                </div>
                <DialogActions>
                  <Button
                    type="button"
                    data-size="sm"
                    disabled={isSubmitting}
                    onClick={() => {
                      submitForm();
                    }}
                  >
                    {initialDefinition ? "Oppdater" : "Legg til"} definisjon
                  </Button>
                  <Button
                    variant="secondary"
                    type="button"
                    data-size="sm"
                    onClick={() => {
                      onClose?.();
                      modalRef.current?.close();
                    }}
                    disabled={isSubmitting}
                  >
                    Avbryt
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
