'use client';

import { Button, FormFieldCard, LanguageIndicator } from '@catalog-frontend/ui';
import { localization as loc } from '@catalog-frontend/utils';

import { FC, useState } from 'react';
import { Concept, ISOLanguage } from '@catalog-frontend/types';
import { Field, Form, Formik } from 'formik';

import styles from './change-request-page.module.css';
import { SourceSection } from '../form-fields/source-section';
import { Textarea } from '@digdir/design-system-react';

interface Props {
  changeRequestAsConcept: Concept;
  readOnly: boolean;
  submitHandler: (values: Concept) => void;
}

const NUM_ROWS_TEXT_FIELD = 4;
const NUM_COLS_TEXT_FIELD = 90;

export const ChangeRequestForm: FC<Props> = ({ changeRequestAsConcept, readOnly, submitHandler }) => {
  const selectedLanguages: ISOLanguage[] = ['nb', 'nn', 'en'];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (values: Concept) => {
    setIsSubmitting(true);
    submitHandler(values);
    setIsSubmitting(false);
  };

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
                      <div
                        className={styles.inputFieldRow}
                        key={language}
                      >
                        <Field
                          name={`anbefaltTerm.navn.${language}`}
                          as={Textarea}
                          label={loc.formatString(loc.concept.formFieldLabel, {
                            fieldType: loc.concept.preferredTerm,
                            lang: loc.language[language]?.toLowerCase(),
                          })}
                          cols={NUM_COLS_TEXT_FIELD}
                          rows={NUM_ROWS_TEXT_FIELD}
                          readOnly={readOnly}
                        />
                      </div>
                    ))}
                  </FormFieldCard>
                  <FormFieldCard
                    title={loc.conceptHelptexts.definisjonTitle}
                    subtitle={loc.conceptHelptexts.definisjonDescription}
                  >
                    {selectedLanguages.map((language) => (
                      <div
                        key={language}
                        className={styles.inputFieldRow}
                      >
                        <Field
                          name={`definisjon.tekst.${language}`}
                          as={Textarea}
                          label={loc.formatString(loc.concept.formFieldLabel, {
                            fieldType: loc.concept.definition,
                            lang: loc.language[language]?.toLowerCase(),
                          })}
                          cols={NUM_COLS_TEXT_FIELD}
                          rows={NUM_ROWS_TEXT_FIELD}
                          readOnly={readOnly}
                        />
                      </div>
                    ))}
                  </FormFieldCard>
                  <FormFieldCard
                    title={loc.conceptHelptexts.kildeTilDefinisjonTitle}
                    subtitle={loc.conceptHelptexts.kildeTilDefinisjonDescription}
                  >
                    <SourceSection
                      fieldName='definisjon.kildebeskrivelse'
                      definisjon={values.definisjon}
                      readOnly={readOnly}
                    />
                  </FormFieldCard>
                  <FormFieldCard
                    title={loc.conceptHelptexts.definisjonForAllmennhetenTitle}
                    subtitle={loc.conceptHelptexts.definisjonForAllmennhetenDescription}
                  >
                    {selectedLanguages.map((language) => (
                      <div
                        key={language}
                        className={styles.inputFieldRow}
                      >
                        <Field
                          name={`definisjonForAllmennheten.tekst.${language}`}
                          as={Textarea}
                          label={loc.formatString(loc.concept.formFieldLabel, {
                            fieldType: loc.concept.publicDefinition,
                            lang: loc.language[language]?.toLowerCase(),
                          })}
                          cols={NUM_COLS_TEXT_FIELD}
                          rows={NUM_ROWS_TEXT_FIELD}
                          readOnly={readOnly}
                        />
                      </div>
                    ))}
                  </FormFieldCard>
                  <FormFieldCard
                    title={loc.conceptHelptexts.definisjonForAllmennhetenKildeTitle}
                    subtitle={loc.conceptHelptexts.definisjonForAllmennhetenKildeDescription}
                  >
                    <SourceSection
                      fieldName='definisjonForAllmennheten.kildebeskrivelse'
                      definisjon={values.definisjonForAllmennheten}
                      readOnly={readOnly}
                    />
                  </FormFieldCard>
                  <FormFieldCard
                    title={loc.conceptHelptexts.definisjonForSpesialisterTitle}
                    subtitle={loc.conceptHelptexts.definisjonForSpesialisterDescription}
                  >
                    {selectedLanguages.map((language) => (
                      <Field
                        name={`definisjonForSpesialister.tekst.${language}`}
                        as={Textarea}
                        label={loc.formatString(loc.concept.formFieldLabel, {
                          fieldType: loc.concept.specialistDefinition,
                          lang: loc.language[language]?.toLowerCase(),
                        })}
                        cols={NUM_COLS_TEXT_FIELD}
                        rows={NUM_ROWS_TEXT_FIELD}
                        readOnly={readOnly}
                      />
                    ))}
                  </FormFieldCard>
                  <FormFieldCard
                    title={loc.conceptHelptexts.definisjonForSpesialisterKildeTitle}
                    subtitle={loc.conceptHelptexts.definisjonForSpesialisterKildeDescription}
                  >
                    <SourceSection
                      fieldName='definisjonForSpesialister.kildebeskrivelse'
                      definisjon={values.definisjonForSpesialister}
                      readOnly={readOnly}
                    />
                  </FormFieldCard>
                  <FormFieldCard
                    title={loc.conceptHelptexts.merknadTitle}
                    subtitle={loc.conceptHelptexts.merknadDescription}
                  >
                    {selectedLanguages.map((language) => (
                      <>
                        <Field
                          name={`merknad.tekst.${language}`}
                          as={Textarea}
                          label={loc.formatString(loc.concept.formFieldLabel, {
                            fieldType: loc.concept.note,
                            lang: loc.language[language]?.toLowerCase(),
                          })}
                          cols={NUM_COLS_TEXT_FIELD}
                          rows={NUM_ROWS_TEXT_FIELD}
                          readOnly={readOnly}
                        />
                      </>
                    ))}
                  </FormFieldCard>
                </div>

                <div className={styles.bottomlineContainer}>
                  <Button
                    color='first'
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
