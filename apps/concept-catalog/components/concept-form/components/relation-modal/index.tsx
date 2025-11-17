'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { Formik } from 'formik';
import { Button, Dialog } from '@digdir/designsystemet-react';
import { RelatedConcept, UnionRelation, RelationTypeEnum, Concept } from '@catalog-frontend/types';
import { relationSchema } from '../../validation-schema';
import { RelationFieldset } from '../relation-fieldset';
import styles from './relation-modal.module.scss';

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
      <Dialog
        ref={modalRef}
        className={styles.dialog}
        style={{
          overflow: 'visible',
        }}
      >
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
                <Dialog.Block>{header}</Dialog.Block>
                <Dialog.Block className={styles.content}>
                  <RelationFieldset
                    catalogId={catalogId}
                    conceptId={conceptId}
                    initialRelatedConcept={initialRelatedConcept}
                  />
                </Dialog.Block>
                <Dialog.Block>
                  <Button
                    type='button'
                    data-size='sm'
                    disabled={isSubmitting}
                    onClick={() => {
                      submitForm();
                    }}
                  >
                    {initialRelation ? 'Oppdater' : 'Legg til'} relasjon
                  </Button>
                  <Button
                    variant='secondary'
                    type='button'
                    data-size='sm'
                    onClick={() => {
                      onClose();
                      modalRef.current?.close();
                    }}
                    disabled={isSubmitting}
                  >
                    Avbryt
                  </Button>
                </Dialog.Block>
              </>
            );
          }}
        </Formik>
      </Dialog>
    </Dialog.TriggerContext>
  );
};
