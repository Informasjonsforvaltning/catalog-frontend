import { ReactNode, useRef, useState } from 'react';
import { Formik } from 'formik';
import { Button, Modal } from '@digdir/designsystemet-react';
import { RelatedConcept, UnionRelation, RelationTypeEnum } from '@catalog-frontend/types';
import { relationSchema } from '../../validation-schema';
import { RelationFieldset } from '../relation-fieldset';
import styles from './relation-modal.module.scss';

export type RelationModalProps = {
  catalogId: string;
  trigger: ReactNode;
  header: string;
  initialRelation?: UnionRelation;
  initialRelatedConcept?: RelatedConcept;
  onSuccess: (rel: UnionRelation) => void;
};

const defaultRelation: UnionRelation = { relasjon: undefined, internal: true };

export const RelationModal = ({
  catalogId,
  initialRelation,
  initialRelatedConcept,
  header,
  trigger,
  onSuccess,
}: RelationModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [submitted, setSubmitted] = useState(false);

  return (
    <Modal.Root>
      <Modal.Trigger asChild>{trigger}</Modal.Trigger>
      <Modal.Dialog
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
          {({ isSubmitting, submitForm }) => {
            return (
              <>
                <Modal.Header closeButton={false}>{header}</Modal.Header>
                <Modal.Content className={styles.content}>
                  <RelationFieldset
                    catalogId={catalogId}
                    initialRelatedConcept={initialRelatedConcept}
                  />
                </Modal.Content>
                <Modal.Footer>
                  <Button
                    type='button'
                    size='sm'
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
                    size='sm'
                    onClick={() => modalRef.current?.close()}
                    disabled={isSubmitting}
                  >
                    Avbryt
                  </Button>
                </Modal.Footer>
              </>
            );
          }}
        </Formik>
      </Modal.Dialog>
    </Modal.Root>
  );
};
