'use client';

import { Button, FormFieldCard } from '@catalog-frontend/ui';
import { localization as loc, removeEmptyValues } from '@catalog-frontend/utils';

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
  submitHandler?: (values: Concept) => void;
}

const NUM_ROWS_TEXT_FIELD = 3;
const NUM_COLS_TEXT_FIELD = 90;

export const ChangeRequestForm: FC<Props> = ({ changeRequestAsConcept, originalConcept, readOnly, submitHandler }) => {
  const selectedLanguages: ISOLanguage[] = ['nb', 'nn', 'en'];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (values: Concept) => {
    setIsSubmitting(true);
    submitHandler && submitHandler(values);
    setIsSubmitting(false);
  };

  const checkForChanges = (values: any, original: any): { color: 'second' | undefined; changed: boolean } => {
    if (!originalConcept) {
      return { color: undefined, changed: false };
    }

    if (values === undefined && original === undefined) {
      return { color: undefined, changed: false };
    }

    const valuesEmpty = values && Object.keys(removeEmptyValues(values)).length === 0;

    if (valuesEmpty && original === undefined) {
      return { color: undefined, changed: false };
    }

    if (values && !_.isEqual(values, original)) {
      return { color: 'second', changed: true };
    }

    return { color: undefined, changed: false };
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
                title={
                  checkForChanges(values.anbefaltTerm, originalConcept?.anbefaltTerm).changed
                    ? `${loc.conceptHelptexts.anbefaltTermTitle} (${loc.changed})`
                    : loc.conceptHelptexts.anbefaltTermTitle
                }
                subtitle={loc.conceptHelptexts.anbefaltTermDescription}
                variant={checkForChanges(values.anbefaltTerm, originalConcept?.anbefaltTerm).color}
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
                title={
                  checkForChanges(values.definisjon?.tekst, originalConcept?.definisjon?.tekst).changed
                    ? `${loc.conceptHelptexts.definisjonTitle} (${loc.changed})`
                    : loc.conceptHelptexts.definisjonTitle
                }
                subtitle={loc.conceptHelptexts.definisjonDescription}
                variant={checkForChanges(values.definisjon?.tekst, originalConcept?.definisjon?.tekst).color}
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
                title={
                  checkForChanges(values.definisjon?.kildebeskrivelse, originalConcept?.definisjon?.kildebeskrivelse)
                    .changed
                    ? `${loc.conceptHelptexts.kildeTilDefinisjonTitle} (${loc.changed})`
                    : loc.conceptHelptexts.kildeTilDefinisjonTitle
                }
                subtitle={loc.conceptHelptexts.kildeTilDefinisjonDescription}
                variant={
                  checkForChanges(values.definisjon?.kildebeskrivelse, originalConcept?.definisjon?.kildebeskrivelse)
                    .color
                }
              >
                <SourceSection
                  fieldName='definisjon.kildebeskrivelse'
                  definisjon={values.definisjon}
                  readOnly={readOnly}
                />
              </FormFieldCard>
              <FormFieldCard
                title={
                  checkForChanges(
                    values.definisjonForAllmennheten?.tekst,
                    originalConcept?.definisjonForAllmennheten?.tekst,
                  ).changed
                    ? `${loc.conceptHelptexts.definisjonForAllmennhetenTitle} (${loc.changed})`
                    : loc.conceptHelptexts.definisjonForAllmennhetenTitle
                }
                subtitle={loc.conceptHelptexts.definisjonForAllmennhetenDescription}
                variant={
                  checkForChanges(
                    values.definisjonForAllmennheten?.tekst,
                    originalConcept?.definisjonForAllmennheten?.tekst,
                  ).color
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
                title={
                  checkForChanges(
                    values.definisjonForAllmennheten?.kildebeskrivelse,
                    originalConcept?.definisjonForAllmennheten?.kildebeskrivelse,
                  ).changed
                    ? `${loc.conceptHelptexts.definisjonForAllmennhetenKildeTitle} (${loc.changed})`
                    : loc.conceptHelptexts.definisjonForAllmennhetenKildeTitle
                }
                subtitle={loc.conceptHelptexts.definisjonForAllmennhetenKildeDescription}
                variant={
                  checkForChanges(
                    values.definisjonForAllmennheten?.kildebeskrivelse,
                    originalConcept?.definisjonForAllmennheten?.kildebeskrivelse,
                  ).color
                }
              >
                <SourceSection
                  fieldName='definisjonForAllmennheten.kildebeskrivelse'
                  definisjon={values.definisjonForAllmennheten}
                  readOnly={readOnly}
                />
              </FormFieldCard>
              <FormFieldCard
                title={
                  checkForChanges(
                    values.definisjonForSpesialister?.tekst,
                    originalConcept?.definisjonForSpesialister?.tekst,
                  ).changed
                    ? `${loc.conceptHelptexts.definisjonForSpesialisterTitle} (${loc.changed})`
                    : loc.conceptHelptexts.definisjonForSpesialisterTitle
                }
                subtitle={loc.conceptHelptexts.definisjonForSpesialisterDescription}
                variant={
                  checkForChanges(
                    values.definisjonForSpesialister?.tekst,
                    originalConcept?.definisjonForSpesialister?.tekst,
                  ).color
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
                title={
                  checkForChanges(
                    values.definisjonForSpesialister?.kildebeskrivelse,
                    originalConcept?.definisjonForSpesialister?.kildebeskrivelse,
                  ).changed
                    ? `${loc.conceptHelptexts.definisjonForSpesialisterKildeTitle} (${loc.changed})`
                    : loc.conceptHelptexts.definisjonForSpesialisterKildeTitle
                }
                subtitle={loc.conceptHelptexts.definisjonForSpesialisterKildeDescription}
                variant={
                  checkForChanges(
                    values.definisjonForSpesialister?.kildebeskrivelse,
                    originalConcept?.definisjonForSpesialister?.kildebeskrivelse,
                  ).color
                }
              >
                <SourceSection
                  fieldName='definisjonForSpesialister.kildebeskrivelse'
                  definisjon={values.definisjonForSpesialister}
                  readOnly={readOnly}
                />
              </FormFieldCard>
              <FormFieldCard
                title={
                  checkForChanges(values.merknad?.tekst, originalConcept?.merknad?.tekst).changed
                    ? `${loc.conceptHelptexts.merknadTitle} (${loc.changed})`
                    : loc.conceptHelptexts.merknadTitle
                }
                subtitle={loc.conceptHelptexts.merknadDescription}
                variant={checkForChanges(values.merknad?.tekst, originalConcept?.merknad?.tekst).color}
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

            {!readOnly && (
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
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ChangeRequestForm;
