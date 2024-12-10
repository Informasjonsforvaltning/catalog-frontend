'use client';

import { useState } from 'react';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/navigation';
import { Alert, Spinner } from '@digdir/designsystemet-react';
import { localization, replaceNulls, trimObjectWhitespace } from '@catalog-frontend/utils';
import { CodeListsResult, Concept, FieldsResult, ReferenceDataCode, UsersResult } from '@catalog-frontend/types';
import { Button, FormLayout, NotificationCarousel } from '@catalog-frontend/ui';
import { createConcept, updateConcept } from '../../app/actions/concept/actions';
import { conceptSchema } from './validation-schema';
import { TermSection } from './components/term-section';
import { DefinitionSection } from './components/definition-section';
import { RemarkSection } from './components/remark-section';
import { SubjectSection } from './components/subject-section';
import { ExampleSection } from './components/example-section';
import { RelationSection } from './components/relation-section';
import { ApplicationSection } from './components/application-section';
import { StatusSection } from './components/status-section';
import { VersionSection } from './components/version-section';
import { PeriodSection } from './components/period-section';
import { InternalSection } from './components/internal-section';
import { ContactSection } from './components/contact-section';
import styles from './concept-form.module.scss';

type Props = {
  catalogId: string;
  concept: Concept;
  conceptStatuses: ReferenceDataCode[];
  codeListsResult: CodeListsResult;
  fieldsResult: FieldsResult;
  usersResult: UsersResult;
};

const getNotifications = ({ isValid, hasUnsavedChanges }) => [
  ...(isValid
    ? []
    : [
        <Alert
          key={1}
          size='sm'
          severity='danger'
        >
          Skjemaet inneholder feil eller manglende informasjon. Vennligst kontroller feltene markert med rød tekst og
          prøv igjen.
        </Alert>,
      ]),
  ...(hasUnsavedChanges
    ? [
        <Alert
          key={1}
          size='sm'
          severity='warning'
        >
          Du har ulagrede endringer
        </Alert>,
      ]
    : []),
];

const pruneEmptyProperties = (obj: any, reduceAsArray = false) => {
  if (!obj) {
    return null;
  }
  const filteredKeys = Object.keys(obj).filter(
    (key) => obj[key] != null && obj[key] !== '' && (Array.isArray(obj[key]) ? obj[key].length !== 0 : true),
  );

  return reduceAsArray
    ? filteredKeys.reduce((acc, key) => {
        if (typeof obj[key] === 'object') {
          const prunedObject = pruneEmptyProperties(obj[key]);
          return Object.keys(prunedObject).length === 0 ? acc : [...acc, prunedObject];
        }
        return [...acc, obj[key]];
      }, [] as any[])
    : filteredKeys.reduce((acc, key) => {
        if (typeof obj[key] === 'object') {
          const isArray = Array.isArray(obj[key]);
          const prunedObject = pruneEmptyProperties(obj[key], isArray);
          return Object.keys(prunedObject).length === 0 ? acc : { ...acc, [key]: prunedObject };
        }
        return { ...acc, [key]: obj[key] };
      }, {});
};

export const preProcessValues = (orgId: string, values: any): Concept => {
  const { ansvarligVirksomhet, kontaktpunkt, omfang, ...rest } = values;

  return trimObjectWhitespace({
    ...rest,
    gyldigFom: values.gyldigFom?.length ? values.gyldigFom : null,
    gyldigTom: values.gyldigTom?.length ? values.gyldigTom : null,
    omfang: pruneEmptyProperties(omfang),
    kontaktpunkt: pruneEmptyProperties(kontaktpunkt),
    ansvarligVirksomhet: ansvarligVirksomhet || { id: orgId },
  });
};

const ConceptForm = ({ catalogId, concept, conceptStatuses, codeListsResult, fieldsResult, usersResult }: Props) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);

  const router = useRouter();

  const mapPropsToValues = (concept: Concept) => {
    return ({
      ...concept,
      abbreviatedLabel: concept.abbreviatedLabel ?? '',
      anbefaltTerm: concept.anbefaltTerm ?? { navn: null },
      assignedUser: concept.assignedUser ?? '',
      gyldigFom: concept.gyldigFom ?? '',
      gyldigTom: concept.gyldigTom ?? '',
      interneFelt: fieldsResult.internal.reduce((acc, field) => {
        acc[field.id] = { value: concept.interneFelt?.[field.id] ?? '' };
        return acc;
      }, {}),
      omfang: concept.omfang ?? { uri: '', tekst: '' },
      versjonsnr: {
        major: concept.versjonsnr?.major ?? '',
        minor: concept.versjonsnr?.minor ?? '',
        patch: concept.versjonsnr?.patch ?? '',
      }
    });
  };

  const subjectCodeList = codeListsResult?.codeLists?.find(
    (codeList) => codeList.id === fieldsResult?.editable?.domainCodeListId,
  );

  const handleCreate = async (values: Concept) => {
    await createConcept(values, catalogId.toString());
  };

  const handleUpdate = async (values: Concept) => {
    if ('id' in concept) {
      try {
        await updateConcept(catalogId.toString(), concept, values);
      } catch (error) {
        window.alert(`${localization.alert.updateFailed} ${error}`);
      }
    } else {
      await handleCreate(values);
    }
  };

  const handleCancel = () => {
    setIsCanceled(true);
    router.push(concept.id ? `/catalogs/${catalogId}/concepts/${concept.id}` : `/catalogs/${catalogId}/concepts`);
  };

  return (
    <Formik
      initialValues={mapPropsToValues(concept)}
      validationSchema={conceptSchema}
      validateOnChange={isSubmitted}
      validateOnBlur={isSubmitted}
      onSubmit={async (values, { setSubmitting }) => {
        const preProcessed = preProcessValues(catalogId, values);
        concept.id === null ? await handleCreate(preProcessed) : await handleUpdate(preProcessed);
        setSubmitting(false);
        setIsSubmitted(true);
      }}
    >
      {({ errors, values, isValid, isSubmitting, isValidating, submitForm }) => {
        const notifications = getNotifications({ isValid, hasUnsavedChanges: false });
        return (
          <>
            <div className='container'>
              <Form>
                <FormLayout>
                  <FormLayout.Section
                    id='term'
                    title={localization.conceptForm.section.termTitle}
                    subtitle={localization.conceptForm.section.termSubtitle}
                    required
                  >
                    <TermSection />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='definition'
                    title={localization.conceptForm.section.definitionTitle}
                    subtitle={localization.conceptForm.section.definitionSubtitle}
                    required
                  >
                    <DefinitionSection />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='remark'
                    title={localization.conceptForm.section.remarkTitle}
                    subtitle={localization.conceptForm.section.remarkSubtitle}
                  >
                    <RemarkSection />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='subject'
                    title={localization.conceptForm.section.subjectTitle}
                    subtitle={localization.conceptForm.section.subjectSubtitle}
                  >
                    <SubjectSection codes={subjectCodeList?.codes} />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='example'
                    title={localization.conceptForm.section.exampleTitle}
                    subtitle={localization.conceptForm.section.exampleTitle}
                  >
                    <ExampleSection />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='application'
                    title={localization.conceptForm.section.applicationTitle}
                    subtitle={localization.conceptForm.section.applicationSubtitle}
                  >
                    <ApplicationSection />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='relation'
                    title='Relasjoner'
                    subtitle='Relasjoner til begrepet.'
                  >
                    <RelationSection catalogId={catalogId} />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='internal'
                    title='Interne opplysninger'
                    subtitle='Opplysningene under er til intern bruk og vil ikke publiseres ut i Felles datakatalog.'
                  >
                    <InternalSection
                      codeLists={codeListsResult.codeLists}
                      internalFields={fieldsResult.internal}
                      userList={usersResult.users}
                    />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='status'
                    title='Begrepsstatus'
                    subtitle='Status for begrepet. Undersøk hvilke statuser som skal brukes i din virksomhet.'
                  >
                    <StatusSection conceptStatuses={conceptStatuses} />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='version'
                    title='Versjonsnummer'
                    subtitle='Versjonsnummer består av tall i tre ledd: major.minor.patch. Eks: 1.0.0'
                  >
                    <VersionSection />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='period'
                    title='Gyldighetsperiode'
                    subtitle='Her registrerer du datoen som begrepet skal gjelde fra og med og til og med.'
                  >
                    <PeriodSection />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='contact'
                    title='Kontaktinformasjon'
                    subtitle='Her registrerer du datoen som begrepet skal gjelde fra og med og til og med.'
                    required
                  >
                    <ContactSection />
                  </FormLayout.Section>
                </FormLayout>
              </Form>
            </div>
            <div className={styles.stickyFooterBar}>
              <div className={classNames('container', styles.stickyFooterContent)}>
                <div>
                  <div className={styles.actionButtons}>
                    <Button
                      size='sm'
                      type='button'
                      disabled={isSubmitting || isValidating || isCanceled}
                      onClick={() => {
                        submitForm();
                      }}
                    >
                      {isSubmitting ? <Spinner title='Lagrer' size='sm' /> : 'Lagre'}
                    </Button>
                    <Button
                      size='sm'
                      disabled={isSubmitting || isValidating || isCanceled}
                      onClick={handleCancel}
                      variant='secondary'
                    >
                      Avbryt
                    </Button>
                  </div>
                </div>
                {notifications.length > 0 && <NotificationCarousel notifications={notifications} />}
              </div>
            </div>
          </>
        );
      }}
    </Formik>
  );
};

export default ConceptForm;
