'use client';

import { Button, FormFieldCard } from '@catalog-frontend/ui';
import { localization as loc } from '@catalog-frontend/utils';

import { FC, useState } from 'react';
import { Concept, ISOLanguage } from '@catalog-frontend/types';
import { Form, Formik } from 'formik';
import { TextAreaField } from '../form-fields/text-area-field';

import styles from './change-request-page.module.css';
import { SourceSection } from '../form-fields/source-section';

interface Props {
  changeRequestAsConcept: Concept;
  originalConcept: Concept;
  readOnly: boolean;
  submitHandler: (values: Concept) => void;
}

export const ChangeRequestForm: FC<Props> = ({ changeRequestAsConcept, originalConcept, readOnly, submitHandler }) => {
  const selectedLanguages: ISOLanguage[] = ['nb', 'nn', 'en'];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (values: Concept) => {
    setIsSubmitting(true);
    submitHandler(values);
    setIsSubmitting(false);
  };

  const showOriginal = false;

  const numRowsTextField = 4;

  return (
    <>
      <div className='container'>
        <div className={styles.pageContainer}>
          <Formik
            initialValues={changeRequestAsConcept}
            onSubmit={(values) => {
              handleSubmit(values);
            }}
          >
            {({ values }) => (
              <Form>
                <div className={styles.formContainer}>
                  <FormFieldCard
                    title={loc.conceptHelptexts.anbefaltTermTitle}
                    subtitle={loc.conceptHelptexts.anbefaltTermDescription}
                  >
                    {selectedLanguages.map((language) => (
                      <TextAreaField
                        key={language}
                        fieldName={`anbefaltTerm.navn.${language}`}
                        fieldType={loc.concept.preferredTerm.toLowerCase()}
                        originalText={originalConcept?.anbefaltTerm?.navn[language]}
                        language={language}
                        showOriginal={showOriginal}
                      />
                    ))}
                  </FormFieldCard>
                  <FormFieldCard
                    title={loc.conceptHelptexts.definisjonTitle}
                    subtitle={loc.conceptHelptexts.definisjonDescription}
                  >
                    {selectedLanguages.map((language) => (
                      <TextAreaField
                        key={language}
                        fieldName={`definisjon.tekst.${language}`}
                        fieldType={loc.concept.definition.toLowerCase()}
                        originalText={originalConcept.definisjon?.tekst[language]}
                        language={language}
                        rows={numRowsTextField}
                        showOriginal={showOriginal}
                      />
                    ))}
                  </FormFieldCard>
                  <FormFieldCard
                    title={loc.conceptHelptexts.kildeTilDefinisjonTitle}
                    subtitle={loc.conceptHelptexts.kildeTilDefinisjonDescription}
                  >
                    <SourceSection
                      fieldName='definisjon.kildebeskrivelse'
                      definisjon={values.definisjon}
                      originalSources={originalConcept?.definisjon?.kildebeskrivelse}
                      showOriginal={showOriginal}
                    />
                  </FormFieldCard>
                  <FormFieldCard
                    title={loc.conceptHelptexts.folkeligForklaringTitle}
                    subtitle={loc.conceptHelptexts.folkeligForklaringDescription}
                  >
                    {selectedLanguages.map((language) => (
                      <TextAreaField
                        key={language}
                        fieldName={`definisjonForAllmennheten.tekst.${language}`}
                        fieldType={loc.concept.publicDefinition.toLowerCase()}
                        originalText={originalConcept?.definisjonForAllmennheten?.tekst[language]}
                        language={language}
                        rows={numRowsTextField}
                        showOriginal={showOriginal}
                      />
                    ))}
                  </FormFieldCard>
                  <FormFieldCard
                    title={loc.conceptHelptexts.folkeligForklaringKildeTitle}
                    subtitle={loc.conceptHelptexts.folkeligForklaringKildeDescription}
                  >
                    <SourceSection
                      fieldName='definisjonForAllmennheten.kildebeskrivelse'
                      definisjon={values.definisjonForAllmennheten}
                      originalSources={originalConcept?.definisjonForAllmennheten?.kildebeskrivelse}
                      showOriginal={showOriginal}
                    />
                  </FormFieldCard>
                  <FormFieldCard
                    title={loc.conceptHelptexts.rettsligForklaringTitle}
                    subtitle={loc.conceptHelptexts.rettsligForklaringDescription}
                  >
                    {selectedLanguages.map((language) => (
                      <TextAreaField
                        key={language}
                        fieldName={`definisjonForSpesialister.tekst.${language}`}
                        fieldType={loc.concept.publicDefinition.toLowerCase()}
                        originalText={originalConcept?.definisjonForSpesialister?.tekst[language]}
                        language={language}
                        rows={numRowsTextField}
                        showOriginal={showOriginal}
                      />
                    ))}
                  </FormFieldCard>
                  <FormFieldCard
                    title={loc.conceptHelptexts.rettsligForklaringKildeTitle}
                    subtitle={loc.conceptHelptexts.rettsligForklaringKildeDescription}
                  >
                    <SourceSection
                      fieldName='definisjonForSpesialister.kildebeskrivelse'
                      definisjon={values.definisjonForSpesialister}
                      originalSources={originalConcept?.definisjonForSpesialister?.kildebeskrivelse}
                      showOriginal={showOriginal}
                    />
                  </FormFieldCard>
                  <FormFieldCard
                    title={loc.conceptHelptexts.merknadTitle}
                    subtitle={loc.conceptHelptexts.merknadDescription}
                  >
                    {selectedLanguages.map((language) => (
                      <TextAreaField
                        key={language}
                        fieldName={`merknad.tekst.${language}`}
                        fieldType={loc.concept.note.toLowerCase()}
                        originalText={originalConcept?.merknad && originalConcept?.merknad[language]}
                        language={language}
                        rows={numRowsTextField}
                        showOriginal={showOriginal}
                      />
                    ))}
                  </FormFieldCard>
                </div>

                <div className={styles.bottomlineContainer}>
                  <Button
                    color='primary'
                    className={styles.button}
                    type='submit'
                    disabled={isSubmitting}
                  >
                    {loc.button.send}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default ChangeRequestForm;
