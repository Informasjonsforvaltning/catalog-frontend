import { TitleWithTag } from '@catalog-frontend/ui';
import { Button, Fieldset, HelpText, Modal, Radio } from '@digdir/designsystemet-react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import styles from './relation-modal.module.scss';
import { LanguageFieldset } from '../language-fieldset';
import { TextareaWithPrefix } from '../texarea';
import { localization } from '@catalog-frontend/utils';
import { FieldsetDivider } from '../fieldset-divider';
import { SourceDescriptionFieldset } from '../source-description-fieldset';
import { Form, Formik } from 'formik';
import { UnionRelation, UnionRelationTypeEnum,  } from '@catalog-frontend/types';
import { unionRelationSchema } from '../../validation-schema';
import { RelationFieldset } from '../relation-fieldset';

export type RelationModalProps = {
  catalogId: string;
  trigger: ReactNode;
  header: string;
  initialRelation?: UnionRelation;
  onSucces: (rel: UnionRelation) => void;
};

const defaultRelation: UnionRelation = { relasjon: UnionRelationTypeEnum.ASSOSIATIV };

export const RelationModal = ({ catalogId, initialRelation, header, trigger, onSucces }: RelationModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [submitted, setSubmitted] = useState(false);
  
  return (
    <Modal.Root>
      <Modal.Trigger asChild>{trigger}</Modal.Trigger>
      <Modal.Dialog
        ref={modalRef}
        className={styles.dialog}
      >
        <Formik
          initialValues={
            initialRelation || defaultRelation
          }
          validationSchema={unionRelationSchema}
          validateOnChange={submitted}
          validateOnBlur={submitted}
          onSubmit={(values, { setSubmitting }) => {
            onSucces(values);
            setSubmitting(false);
            setSubmitted(true);
            modalRef.current?.close();
          }}
        >
          {({ errors, handleSubmit, isValid, isSubmitting, submitForm }) => {
            return (
              <>
                <Modal.Header>{header}</Modal.Header>
                <Modal.Content className={styles.content}>
                  <RelationFieldset catalogId={catalogId} />
                </Modal.Content>
                <Modal.Footer>
                  <Button
                    type='button'
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
