import { Checkbox } from '@digdir/design-system-react';
import { BreadcrumbType, Breadcrumbs, Button, PageBanner } from '@catalog-frontend/ui';
import { useCatalogDesign } from '../../../../context/catalog-design';
import { localization as loc, getTranslateText as translate } from '@catalog-frontend/utils';
import styles from './change-request-page.module.css';
import { useState } from 'react';
import {
  ChangeRequest,
  ChangeRequestUpdateBody,
  Concept,
  ISOLanguage,
  JsonPatchOperation,
} from '@catalog-frontend/types';
import { FieldArray, Form, Formik } from 'formik';
import { ConceptFormField } from '../../../../components/form-field-container';
import { TextAreaField } from '../../../../components/form-fields/text-area-field';
import { RelationToSource } from '../../../../components/form-fields/relation-to-source';
import { SourceForDefinitionField } from '../../../../components/form-fields/source-for-definition';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import jsonpatch from 'fast-json-patch';

const languageOptions = [
  { value: 'nb', label: 'Norsk bokmål' },
  { value: 'nn', label: 'Norsk nynorsk' },
  { value: 'en', label: 'English' },
];

export const ChangeRequestPage = ({
  FDK_REGISTRATION_BASE_URI,
  organization,
  changeRequest,
  changeRequestAsConcept,
  originalConcept,
  showOriginal = false,
  changeRequestMutateHook,
}) => {
  const changeRequestId = changeRequest.id;
  const catalogId = organization?.organizationId;
  const pageSubtitle = organization?.name ?? organization.id;

  const [selectedLanguages, setSelectedLanguages] = useState<ISOLanguage[]>(['nb', 'nn', 'en']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (values: Concept) => {
    setIsSubmitting(true);
    const changeRequestFromConcept: ChangeRequestUpdateBody = {
      conceptId: changeRequest.conceptId,
      operations: jsonpatch.compare(originalConcept, values) as JsonPatchOperation[],
      title: '',
    };

    changeRequestMutateHook.mutateAsync(changeRequestFromConcept).catch((error) => {
      alert('Fail');
    });

    setIsSubmitting(false);
  };

  const handleLanguageChange = (toggleLangs: string[]) => {
    // Ensures language fields are always shown in the same order
    const sortKey = languageOptions.map((obj) => obj.value);
    const newSelectedLangs = [...toggleLangs];
    newSelectedLangs.sort((a, b) => sortKey.indexOf(a) - sortKey.indexOf(b));
    setSelectedLanguages(newSelectedLangs as ISOLanguage[]);
  };

  const getTitle = (text: string | string[]) => (text ? text : loc.concept.noName);
  let changeRequestTitle = '';
  if (changeRequestId) {
    changeRequestTitle = changeRequestAsConcept?.anbefaltTerm?.navn
      ? getTitle(translate(changeRequestAsConcept?.anbefaltTerm?.navn))
      : changeRequestId;
  } else {
    changeRequestTitle = loc.suggestionForNewConcept;
  }

  const breadcrumbList = changeRequestId
    ? ([
        {
          href: `/${catalogId}`,
          text: loc.concept.concept,
        },
        {
          href: `/${catalogId}/change-requests`,
          text: loc.changeRequest.changeRequest,
        },
        {
          href: `/${catalogId}/change-requests/${changeRequestId}`,
          text: changeRequestTitle,
        },
      ] as BreadcrumbType[])
    : [];

  const design = useCatalogDesign();

  return (
    <>
      <Breadcrumbs
        baseURI={FDK_REGISTRATION_BASE_URI}
        breadcrumbList={breadcrumbList}
      />
      <PageBanner
        title={loc.catalogType.concept}
        subtitle={pageSubtitle}
        fontColor={design?.fontColor}
        backgroundColor={design?.backgroundColor}
        logo={design?.hasLogo && `/api/catalog-admin/${catalogId}/design/logo`}
        logoDescription={design?.logoDescription}
      />
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
          <h1 className={styles.pageTitle}>{changeRequestTitle}</h1>
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
                    <RelationToSource fieldName={'definisjon.kildebeskrivelse.forholdTilKilde'} />
                    <FieldArray name='definisjon.kildebeskrivelse.kilde'>
                      {(arrayHelpers) => (
                        <>
                          <div className={styles.listContainer}>
                            {values.definisjon?.kildebeskrivelse?.kilde?.map((_, index) => (
                              <SourceForDefinitionField
                                key={`${index}`}
                                sourceTitleFieldName={`definisjon.kildebeskrivelse.kilde[${index}].tekst`}
                                sourceUriFieldName={`definisjon.kildebeskrivelse.kilde[${index}].uri`}
                                deleteClickHandler={() => arrayHelpers.remove(index)}
                              />
                            ))}
                          </div>
                          <div>
                            <Button
                              icon={<PlusCircleIcon />}
                              color='secondary'
                              variant='filled'
                              size='small'
                              onClick={() => arrayHelpers.push({ uri: '', tekst: '' })}
                            >
                              {loc.formatString(loc.button.addWithFormat, { text: loc.concept.source.toLowerCase() })}
                            </Button>
                          </div>
                        </>
                      )}
                    </FieldArray>
                  </ConceptFormField>
                  <ConceptFormField
                    title={loc.conceptHelptexts.folkeligForklaringTitle}
                    subtitle={loc.conceptHelptexts.folkeligForklaringDescription}
                  >
                    {selectedLanguages.map((language) => (
                      <TextAreaField
                        key={language}
                        fieldName={`folkeligForklaring.tekst.${language}`}
                        fieldType={loc.concept.publicDefinition.toLowerCase()}
                        originalText={originalConcept.folkeligForklaring?.tekst[language]}
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
                    <RelationToSource fieldName={'folkeligForklaring.kildebeskrivelse.forholdTilKilde'} />
                    <FieldArray name='folkeligForklaring.kildebeskrivelse.kilde'>
                      {(arrayHelpers) => (
                        <>
                          <div className={styles.listContainer}>
                            {values?.folkeligForklaring?.kildebeskrivelse?.kilde?.map((_, index) => (
                              <SourceForDefinitionField
                                key={`${index}`}
                                sourceTitleFieldName={`folkeligForklaring.kildebeskrivelse.kilde[${index}].tekst`}
                                sourceUriFieldName={`folkeligForklaring.kildebeskrivelse.kilde[${index}].uri`}
                                deleteClickHandler={() => arrayHelpers.remove(index)}
                              />
                            ))}
                          </div>
                          <div>
                            <Button
                              icon={<PlusCircleIcon />}
                              color='secondary'
                              variant='filled'
                              size='small'
                              onClick={() => arrayHelpers.push({ uri: '', tekst: '' })}
                            >
                              {loc.formatString(loc.button.addWithFormat, { text: loc.concept.source.toLowerCase() })}
                            </Button>
                          </div>
                        </>
                      )}
                    </FieldArray>
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
                        originalText={originalConcept.rettsligForklaring?.tekst[language]}
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
                    <RelationToSource fieldName={'rettsligForklaring.kildebeskrivelse.forholdTilKilde'} />
                    <FieldArray name='rettsligForklaring.kildebeskrivelse.kilde'>
                      {(arrayHelpers) => (
                        <>
                          <div className={styles.listContainer}>
                            {values.rettsligForklaring?.kildebeskrivelse?.kilde?.map((_, index) => (
                              <SourceForDefinitionField
                                key={`${index}`}
                                sourceTitleFieldName={`rettsligForklaring.kildebeskrivelse.kilde[${index}].tekst`}
                                sourceUriFieldName={`rettsligForklaring.kildebeskrivelse.kilde[${index}].uri`}
                                deleteClickHandler={() => arrayHelpers.remove(index)}
                              />
                            ))}
                          </div>
                          <div>
                            <Button
                              icon={<PlusCircleIcon />}
                              color='secondary'
                              variant='filled'
                              size='small'
                              onClick={() => arrayHelpers.push({ uri: '', tekst: '' })}
                            >
                              {loc.formatString(loc.button.addWithFormat, { text: loc.concept.source.toLowerCase() })}
                            </Button>
                          </div>
                        </>
                      )}
                    </FieldArray>
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

export default ChangeRequestPage;
