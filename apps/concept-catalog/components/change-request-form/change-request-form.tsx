'use client';

import { Button, FormFieldCard, useWarnIfUnsavedChanges } from '@catalog-frontend/ui';
import { localization as loc, removeEmptyValues } from '@catalog-frontend/utils';

import { FC, useState } from 'react';
import { Concept, ISOLanguage } from '@catalog-frontend/types';
import { Field, Form, Formik, FormikHelpers } from 'formik';

import styles from './change-request-page.module.css';
import { SourceSection } from '../source-section';
import { Textarea } from '@digdir/design-system-react';

import _ from 'lodash';

interface Props {
  changeRequestAsConcept: Concept;
  originalConcept?: Concept;
  readOnly: boolean;
  isSubmitting?: boolean;
  submitHandler?: ({ values, formikHelpers }: { values: Concept; formikHelpers: FormikHelpers<Concept> }) => void;
}

const NUM_ROWS_TEXT_FIELD = 3;
const NUM_COLS_TEXT_FIELD = 90;

export const ChangeRequestForm: FC<Props> = ({
  changeRequestAsConcept,
  originalConcept,
  readOnly,
  submitHandler,
  isSubmitting,
}) => {
  const [isDirty, setIsDirty] = useState(false);
  useWarnIfUnsavedChanges(isDirty);

  const selectedLanguages: ISOLanguage[] = ['nb', 'nn', 'en'];

  const checkForChanges = (values: any, original: any): { color: 'second' | undefined; changed: boolean } => {
    if (originalConcept && values && Object.keys(removeEmptyValues(values)).length && !_.isEqual(values, original)) {
      return { color: 'second', changed: true };
    } else {
      return { color: undefined, changed: false };
    }
  };

  return (
    <>
      <Formik
        initialValues={changeRequestAsConcept}
        onSubmit={(values, formikHelpers) => {
          submitHandler && submitHandler({ values, formikHelpers });
        }}
      >
        {({ values, dirty: formikDirty }) => {
          setTimeout(() => setIsDirty(formikDirty), 0);

          return (
            <Form>
              <div className={styles.formContainer}>
                <FormFieldCard
                  title={
                    checkForChanges(values.anbefaltTerm, originalConcept?.anbefaltTerm).changed
                      ? `${loc.conceptHelptexts.anbefaltTermTitle} (${loc.changeRequest.changed})`
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
                      ? `${loc.conceptHelptexts.definisjonTitle} (${loc.changeRequest.changed})`
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
                      ? `${loc.conceptHelptexts.kildeTilDefinisjonTitle} (${loc.changeRequest.changed})`
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
                      ? `${loc.conceptHelptexts.definisjonForAllmennhetenTitle} (${loc.changeRequest.changed})`
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
                      ? `${loc.conceptHelptexts.definisjonForAllmennhetenKildeTitle} (${loc.changeRequest.changed})`
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
                      ? `${loc.conceptHelptexts.definisjonForSpesialisterTitle} (${loc.changeRequest.changed})`
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
                      ? `${loc.conceptHelptexts.definisjonForSpesialisterKildeTitle} (${loc.changeRequest.changed})`
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
                    checkForChanges(values.merknad, originalConcept?.merknad).changed
                      ? `${loc.conceptHelptexts.merknadTitle} (${loc.changeRequest.changed})`
                      : loc.conceptHelptexts.merknadTitle
                  }
                  subtitle={loc.conceptHelptexts.merknadDescription}
                  variant={checkForChanges(values.merknad, originalConcept?.merknad).color}
                >
                  {selectedLanguages.map((language) => (
                    <div
                      key={language}
                      className={styles.inputFieldRow}
                    >
                      <Field
                        name={`merknad.${language}`}
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
          );
        }}
      </Formik>
    </>
  );
};

export default ChangeRequestForm;
