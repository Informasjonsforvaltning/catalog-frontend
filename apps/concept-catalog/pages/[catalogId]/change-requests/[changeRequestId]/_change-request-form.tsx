import { Checkbox, Heading, Textfield } from '@digdir/design-system-react';
import { Button } from '@catalog-frontend/ui';
import { localization as loc } from '@catalog-frontend/utils';
import styles from './change-request-page.module.css';
import { useState } from 'react';
import { Concept, ISOLanguage } from '@catalog-frontend/types';
import { Form, Formik } from 'formik';
import { ConceptFormField } from '../../../../components/form-field-container';
import { TextAreaField } from '../../../../components/form-fields/text-area-field';

import { SourceSection } from '../../../../components/form-fields/source-section';

const languageOptions = [
  { value: 'nb', label: 'Norsk bokmål' },
  { value: 'nn', label: 'Norsk nynorsk' },
  { value: 'en', label: 'English' },
];

export const ChangeRequestForm = ({
  changeRequest,
  changeRequestAsConcept,
  originalConcept,
  showOriginal = false,
  submitHandler,
}) => {
  const [changeRequestTitle, setChangeRequestTitle] = useState<string>(changeRequest.title ?? '');

  const [selectedLanguages, setSelectedLanguages] = useState<ISOLanguage[]>(['nb', 'nn', 'en']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (values: Concept) => {
    setIsSubmitting(true);
    submitHandler(values, changeRequestTitle);
    setIsSubmitting(false);
  };

  const handleLanguageChange = (toggleLangs: string[]) => {
    // Ensures language fields are always shown in the same order
    const sortKey = languageOptions.map((obj) => obj.value);
    const newSelectedLangs = [...toggleLangs];
    newSelectedLangs.sort((a, b) => sortKey.indexOf(a) - sortKey.indexOf(b));
    setSelectedLanguages(newSelectedLangs as ISOLanguage[]);
  };

  return (
    <>
      <div className='container'>
        <div className={styles.pageContainer}>
          <div className={styles.languages}>
            <Checkbox.Group
              legend={loc.chooseLanguage}
              value={selectedLanguages}
              onChange={(toggleValue) => handleLanguageChange(toggleValue)}
              size='small'
            >
              {languageOptions.map(({ value, label }) => (
                <Checkbox
                  key={value}
                  value={value}
                >
                  {label}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </div>
          <Heading
            level={2}
            size='xsmall'
            className={styles.pageTitle}
          >
            {changeRequestTitle}
          </Heading>
          <Textfield
            className={styles.pageTitle}
            type='text'
            value={changeRequestTitle}
            label={loc.title}
            onChange={(e) => setChangeRequestTitle(e.target.value)}
          />
          <Formik
            initialValues={changeRequestAsConcept}
            onSubmit={(values) => {
              handleSubmit(values);
            }}
          >
            {({ values }) => (
              <Form>
                <div className={styles.formContainer}>
                  <ConceptFormField
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
                  </ConceptFormField>
                  <ConceptFormField
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
                        rows={6}
                        showOriginal={showOriginal}
                      />
                    ))}
                  </ConceptFormField>
                  <ConceptFormField
                    title={loc.conceptHelptexts.kildeTilDefinisjonTitle}
                    subtitle={loc.conceptHelptexts.kildeTilDefinisjonDescription}
                  >
                    <SourceSection
                      fieldName='definisjon.kildebeskrivelse'
                      definisjon={values.definisjon}
                      originalSources={originalConcept?.definisjon?.kildebeskrivelse}
                      showOriginal={showOriginal}
                    />
                  </ConceptFormField>
                  <ConceptFormField
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
                        rows={6}
                        showOriginal={showOriginal}
                      />
                    ))}
                  </ConceptFormField>
                  <ConceptFormField
                    title={loc.conceptHelptexts.folkeligForklaringKildeTitle}
                    subtitle={loc.conceptHelptexts.folkeligForklaringKildeDescription}
                  >
                    <SourceSection
                      fieldName='definisjonForAllmennheten.kildebeskrivelse'
                      definisjon={values.definisjonForAllmennheten}
                      originalSources={originalConcept?.definisjonForAllmennheten?.kildebeskrivelse}
                      showOriginal={showOriginal}
                    />
                  </ConceptFormField>
                  <ConceptFormField
                    title={loc.conceptHelptexts.rettsligForklaringTitle}
                    subtitle={loc.conceptHelptexts.rettsligForklaringDescription}
                  >
                    {selectedLanguages.map((language) => (
                      <TextAreaField
                        key={language}
                        fieldName={`rettsligForklaring.tekst.${language}`}
                        fieldType={loc.concept.publicDefinition.toLowerCase()}
                        originalText={originalConcept?.rettsligForklaring?.tekst[language]}
                        language={language}
                        rows={6}
                        showOriginal={showOriginal}
                      />
                    ))}
                  </ConceptFormField>
                  <ConceptFormField
                    title={loc.conceptHelptexts.rettsligForklaringKildeTitle}
                    subtitle={loc.conceptHelptexts.rettsligForklaringKildeDescription}
                  >
                    <SourceSection
                      fieldName='definisjonForSpesialister.kildebeskrivelse'
                      definisjon={values.definisjonForSpesialister}
                      originalSources={originalConcept?.definisjonForSpesialister?.kildebeskrivelse}
                      showOriginal={showOriginal}
                    />
                  </ConceptFormField>
                  <ConceptFormField
                    title={loc.conceptHelptexts.merknadTitle}
                    subtitle={loc.conceptHelptexts.merknadDescription}
                  >
                    {selectedLanguages.map((language) => (
                      <TextAreaField
                        key={language}
                        fieldName={`merknad.tekst.${language}`}
                        fieldType={loc.concept.note.toLowerCase()}
                        originalText={originalConcept?.merknad?.get(language)?.at(0)}
                        language={language}
                        rows={6}
                        showOriginal={showOriginal}
                      />
                    ))}
                  </ConceptFormField>
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
