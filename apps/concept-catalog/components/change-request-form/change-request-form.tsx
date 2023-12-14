'use client';

import { Button, FormFieldCard } from '@catalog-frontend/ui';
import { localization as loc } from '@catalog-frontend/utils';

import { FC, useState } from 'react';
import { Concept, ISOLanguage } from '@catalog-frontend/types';
import { Field, Form, Formik } from 'formik';

import styles from './change-request-page.module.css';
import { SourceSection } from '../source-section';
import { Textarea } from '@digdir/design-system-react';

import _ from 'lodash';

interface Props {
  changeRequestAsConcept: Concept;
  originalConcept?: Concept;
  readOnly: boolean;
  submitHandler: (values: Concept) => void;
}

const NUM_ROWS_TEXT_FIELD = 3;
const NUM_COLS_TEXT_FIELD = 90;

export const ChangeRequestForm: FC<Props> = ({ changeRequestAsConcept, originalConcept, readOnly, submitHandler }) => {
  const selectedLanguages: ISOLanguage[] = ['nb', 'nn', 'en'];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (values: Concept) => {
    setIsSubmitting(true);
    submitHandler(values);
    setIsSubmitting(false);
  };

  return (
    <>
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
                variant={
                  originalConcept && _.isEqual(values.anbefaltTerm, originalConcept.anbefaltTerm) ? 'second' : undefined
                }
              >
                {selectedLanguages.map((language) => (
                  <div
                    key={language}
                    className={styles.inputFieldRow}
                  >
                    <Field
                      name={`anbefaltTerm.navn.${language}`}
                      as={Textarea}
                      label={loc.formatString(loc.concept.formFieldLabel, {
                        fieldType: loc.concept.preferredTerm,
                        lang: loc.language[language]?.toLowerCase(),
                      })}
                      cols={NUM_COLS_TEXT_FIELD}
                      rows={1}
                      readOnly={readOnly}
                    />
                  </div>
                ))}
              </FormFieldCard>
              <FormFieldCard
                title={loc.conceptHelptexts.definisjonTitle}
                subtitle={loc.conceptHelptexts.definisjonDescription}
                variant={
                  originalConcept &&
                  (_.isEqual(values.definisjon?.tekst, originalConcept.definisjon?.tekst) ? 'second' : undefined)
                }
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
                variant={
                  originalConcept &&
                  (_.isEqual(values.definisjon?.kildebeskrivelse, originalConcept.definisjon?.kildebeskrivelse)
                    ? 'second'
                    : undefined)
                }
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
                variant={
                  originalConcept &&
                  (_.isEqual(values.definisjonForAllmennheten?.tekst, originalConcept.definisjonForAllmennheten?.tekst)
                    ? 'second'
                    : undefined)
                }
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
                variant={
                  originalConcept &&
                  (_.isEqual(
                    values.definisjonForAllmennheten?.kildebeskrivelse,
                    originalConcept.definisjonForAllmennheten?.kildebeskrivelse,
                  )
                    ? 'second'
                    : undefined)
                }
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
                variant={
                  originalConcept &&
                  (_.isEqual(values.definisjonForSpesialister?.tekst, originalConcept.definisjonForSpesialister?.tekst)
                    ? 'second'
                    : undefined)
                }
              >
                {selectedLanguages.map((language) => (
                  <div
                    key={language}
                    className={styles.inputFieldRow}
                  >
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
                  </div>
                ))}
              </FormFieldCard>
              <FormFieldCard
                title={loc.conceptHelptexts.definisjonForSpesialisterKildeTitle}
                subtitle={loc.conceptHelptexts.definisjonForSpesialisterKildeDescription}
                variant={
                  originalConcept &&
                  (_.isEqual(
                    values.definisjonForSpesialister?.kildebeskrivelse,
                    originalConcept.definisjonForSpesialister?.kildebeskrivelse,
                  )
                    ? 'second'
                    : undefined)
                }
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
                variant={
                  originalConcept &&
                  (_.isEqual(values.merknad?.tekst, originalConcept.merknad?.tekst) ? 'second' : undefined)
                }
              >
                {selectedLanguages.map((language) => (
                  <div
                    key={language}
                    className={styles.inputFieldRow}
                  >
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
                  </div>
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
    </>
  );
};

export default ChangeRequestForm;
