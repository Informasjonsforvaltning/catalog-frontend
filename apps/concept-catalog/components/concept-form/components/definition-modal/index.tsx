import { TitleWithTag } from '@catalog-frontend/ui';
import { Button, HelpText, Modal, Paragraph } from '@digdir/designsystemet-react';
import { ReactNode, useRef, useState } from 'react';
import styles from './definition-modal.module.scss';
import { LanguageFieldset } from '../language-fieldset';
import { TextareaWithPrefix } from '../texarea';
import { localization } from '@catalog-frontend/utils';
import { FieldsetDivider } from '../fieldset-divider';
import { SourceDescriptionFieldset } from '../source-description-fieldset';
import { Formik } from 'formik';
import { Definisjon } from '@catalog-frontend/types';
import { definitionSchema } from '../../validation-schema';

export type DefinitionModalProps = {
  trigger: ReactNode;
  header: string;
  initialDefinition?: Definisjon;
  onSucces: (def: Definisjon) => void;
};

const defaultDefinition: Definisjon = { tekst: {}, kildebeskrivelse: { forholdTilKilde: 'egendefinert', kilde: [] } };

export const DefinitionModal = ({ initialDefinition, header, trigger, onSucces }: DefinitionModalProps) => {
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
          {({ errors, handleSubmit, isValid, isSubmitting, submitForm }) => {
            return (
              <>
                <Modal.Header>{header}</Modal.Header>
                <Modal.Content className={styles.content}>
                  <LanguageFieldset
                    name='tekst'
                    as={TextareaWithPrefix}
                    requiredLanguages={['nb']}
                    legend={
                      <TitleWithTag
                        title={
                          <>
                            Definisjon
                            <HelpText
                              title={'Hjelpetekst definisjon'}
                              type='button'
                              size='sm'
                              placement='right-end'
                            >
                              <Paragraph size='sm'>
                                Gi en kort og presis forklaring av begrepet. Definisjonen skal tydelig beskrive hva
                                begrepet betyr, slik at leseren raskt kan forstå innholdet. Unngå forkortelser og
                                fagspesifikke uttrykk hvis definisjonen er ment for en generell målgruppe.
                              </Paragraph>
                            </HelpText>
                          </>
                        }
                        tagTitle={localization.tag.required}
                        tagColor='warning'
                      />
                    }
                  />
                  <FieldsetDivider />
                  <SourceDescriptionFieldset name={'kildebeskrivelse'} />
                </Modal.Content>
                <Modal.Footer>
                  <Button
                    type='button'
                    disabled={isSubmitting}
                    onClick={() => {
                      console.log('submit form', isValid, errors);
                      submitForm();
                    }}
                  >
                    {initialDefinition ? 'Oppdater' : 'Legg til'} definisjon
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
