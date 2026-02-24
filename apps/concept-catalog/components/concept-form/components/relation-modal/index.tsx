"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import { Button, Dialog, Heading } from "@digdir/designsystemet-react";
import { DialogActions } from "@catalog-frontend/ui-v2";
import { RelatedConcept, UnionRelation } from "@catalog-frontend/types";
import { relationSchema } from "../../validation-schema";
import { RelationFieldset } from "../relation-fieldset";
import styles from "./relation-modal.module.scss";

export type RelationModalProps = {
  catalogId: string;
  conceptId: string;
  trigger: ReactNode;
  header: string;
  initialRelation?: UnionRelation;
  initialRelatedConcept?: RelatedConcept;
  onSuccess: (rel: UnionRelation) => void;
  onChange: (rel: UnionRelation) => void;
  onClose: () => void;
};

const defaultRelation: UnionRelation = { relasjon: undefined, internal: true };

export const RelationModal = ({
  catalogId,
  conceptId,
  initialRelation,
  initialRelatedConcept,
  header,
  trigger,
  onSuccess,
  onChange,
  onClose,
}: RelationModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [submitted, setSubmitted] = useState(false);

  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog ref={modalRef} className={styles.dialog} closeButton={false}>
        <Formik
          initialValues={initialRelation || defaultRelation}
          validationSchema={relationSchema}
          validateOnChange={submitted}
          validateOnBlur={submitted}
          onSubmit={(values, { setSubmitting }) => {
            onSuccess(values);
            setSubmitting(false);
            setSubmitted(true);
            modalRef.current?.close();
          }}
        >
          {({ isSubmitting, dirty, submitForm, values }) => {
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
                  <RelationFieldset
                    catalogId={catalogId}
                    conceptId={conceptId}
                    initialRelatedConcept={initialRelatedConcept}
                  />
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
                    {initialRelation ? "Oppdater" : "Legg til"} relasjon
                  </Button>
                  <Button
                    variant="secondary"
                    type="button"
                    data-size="sm"
                    onClick={() => {
                      onClose();
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
