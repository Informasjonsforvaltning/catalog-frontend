'use client';

import { localization, trimObjectWhitespace } from '@catalog-frontend/utils';
import { CodeListsResult, Concept, FieldsResult, ReferenceDataCode, UsersResult } from '@catalog-frontend/types';
import { Button, FormLayout } from '@catalog-frontend/ui';
import { Formik, Form } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { createConcept, updateConcept } from '../../app/actions/concept/actions';
import { useState } from 'react';
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
import classNames from 'classnames';
import NotificationCarousel from './components/notification-carousel';
import { Alert } from '@digdir/designsystemet-react';
import styles from './concept-form.module.scss';

type Props = {
  catalogId: string;
  concept: Concept;
  conceptStatuses: ReferenceDataCode[];
  codeListsResult: CodeListsResult;
  fieldsResult: FieldsResult;
  usersResult: UsersResult;
};

const notifications = [
  <Alert
    key={1}
    size='sm'
    severity='warning'
  >
    Du har ulagrede endringer
  </Alert>,
  <Alert
    key={2}
    size='sm'
    severity='info'
  >
    Du har en annen info melding
  </Alert>,
];

const mapPropsToValues = (concept: Concept) => {
  return concept;
};

const ConceptForm = ({ concept, conceptStatuses, codeListsResult, fieldsResult, usersResult }: Props) => {
  const { catalogId, conceptId } = useParams();
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();

  const subjectCodeList = codeListsResult?.codeLists?.find(
    (codeList) => codeList.id === fieldsResult?.editable?.domainCodeListId,
  );

  const handleCreate = (values: Concept) => {
    createConcept(values, catalogId.toString());
  };

  const handleUpdate = async (values: Concept) => {
    if ('id' in concept) {
      try {
        await updateConcept(catalogId.toString(), concept, values);
      } catch (error) {
        window.alert(`${localization.alert.updateFailed} ${error}`);
      }
    } else {
      handleCreate(values);
    }
  };

  const handleCancel = () => {
    router.push(concept.id ? `/catalogs/${catalogId}/concepts/${concept.id}` : `/catalogs/${catalogId}/concepts`);
  };

  return (
    <Formik
      initialValues={mapPropsToValues(concept)}
      validationSchema={conceptSchema}
      validateOnChange={submitted}
      validateOnBlur={submitted}
      onSubmit={(values, { setSubmitting }) => {
        const trimmedValues = trimObjectWhitespace(values);

        console.log('submit', trimmedValues);

        conceptId === null ? handleCreate(trimmedValues) : handleUpdate(trimmedValues as Concept);
        setSubmitting(false);
        setSubmitted(true);
      }}
    >
      {({ errors, values, isValid, isSubmitting, isValidating, submitForm }) => {
        if (!isValid) {
          notifications.push(
            <Alert
              size='sm'
              severity='danger'
            >
              Skjema inneholder valideringsfeil
            </Alert>,
          );
        }

        return (
          <>
            <div className='container'>
              <Form>
                <FormLayout>
                  <FormLayout.Section
                    id='term'
                    title='Term'
                    subtitle='Termen blir sett på som best egnet for begrepet. '
                    required
                  >
                    <TermSection />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='definition'
                    title='Definisjon'
                    subtitle='En definisjon skal være en kort forklaring som tydelig avgrenser til andre, nærliggende begrep, evt. tydeliggjør forskjellen mellom dette begrepet og andre nærliggende begrep.'
                    required
                  >
                    <DefinitionSection />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='remark'
                    title='Merknad'
                    subtitle='Tillegsopplysninger som begrepets betydning som ikke hører hjemme i definisjonsfeltet.'
                  >
                    <RemarkSection />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='subject'
                    title='Fagområde'
                    subtitle='Et fagområde er et spesialisert kunnskapsområde som begrepet tilhører.'
                  >
                    <SubjectSection codes={subjectCodeList?.codes} />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='example'
                    title='Eksempel'
                    subtitle='Konkrete tilfeller av begrepet.'
                  >
                    <ExampleSection />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='application'
                    title='Verdiområde'
                    subtitle='Lovlig verdiområde for begrepet.'
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
                      disabled={isSubmitting || isValidating}
                      onClick={() => {
                        submitForm();
                        console.log('valid', isValid, 'errors', errors, 'values', values);
                      }}
                    >
                      Lagre
                    </Button>
                    <Button
                      size='sm'
                      onClick={handleCancel}
                      variant='secondary'
                    >
                      Avbryt
                    </Button>
                  </div>
                </div>
                <NotificationCarousel notifications={notifications} />
              </div>
            </div>
          </>
        );
      }}
    </Formik>
  );
};

export default ConceptForm;
