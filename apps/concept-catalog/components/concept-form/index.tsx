'use client';

import { useState } from 'react';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/navigation';
import { Alert, Checkbox, Paragraph, Spinner } from '@digdir/designsystemet-react';
import { localization } from '@catalog-frontend/utils';
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
import { ValueRangeSection } from './components/value-range-section';
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
          style={{ background: 'none', border: 'none', padding: 0 }}
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
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          Du har ulagrede endringer
        </Alert>,
      ]
    : []),
];

const ConceptForm = ({ catalogId, concept, conceptStatuses, codeListsResult, fieldsResult, usersResult }: Props) => {
  const [isSaveButtonClicked, setIsSaveButtonClicked] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const [ignoreRequired, setIgnoreRequired] = useState(false);

  const router = useRouter();

  const mapPropsToValues = ({
    id,
    anbefaltTerm = { navn: {} },
    definisjon = undefined,
    definisjonForAllmennheten = undefined,
    definisjonForSpesialister = undefined,
    merknad = {},
    merkelapp = [],
    tillattTerm = {},
    frarådetTerm = {},
    eksempel = {},
    fagområde = {},
    fagområdeKoder = [],
    statusURI = 'http://publications.europa.eu/resource/authority/concept-status/DRAFT',
    omfang = undefined,
    kontaktpunkt = undefined,
    gyldigFom = undefined,
    gyldigTom = undefined,
    seOgså = [],
    internSeOgså = [],
    erstattesAv = [],
    internErstattesAv = [],
    assignedUser = '',
    abbreviatedLabel = undefined,
    begrepsRelasjon = [],
    internBegrepsRelasjon = [],
    versjonsnr = { major: 0, minor: 1, patch: 0 },
    interneFelt = {},
    ...rest
  }: Concept) => {
    return {
      id,
      anbefaltTerm,
      definisjon,
      definisjonForAllmennheten,
      definisjonForSpesialister,
      merknad,
      merkelapp,
      tillattTerm,
      frarådetTerm,
      eksempel,
      fagområde,
      fagområdeKoder,
      statusURI,
      omfang,
      kontaktpunkt,
      gyldigFom,
      gyldigTom,
      seOgså,
      internSeOgså,
      erstattesAv,
      internErstattesAv,
      assignedUser,
      abbreviatedLabel,
      begrepsRelasjon,
      internBegrepsRelasjon,
      versjonsnr,
      interneFelt,
      ...rest,
    };
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
      validationSchema={conceptSchema({ required: !ignoreRequired, baseUri: '' })}
      validateOnChange={isSaveButtonClicked}
      validateOnBlur={isSaveButtonClicked}
      onSubmit={async (values, { setSubmitting }) => {
        concept.id === null ? await handleCreate(values as Concept) : await handleUpdate(values as Concept);
        setSubmitting(false);
      }}
    >
      {({ errors, dirty, isValid, isSubmitting, isValidating, submitForm }) => {
        const notifications = getNotifications({ isValid, hasUnsavedChanges: false });
        const hasError = (fields: (keyof Concept)[]) => fields.some((field) => Object.keys(errors).includes(field));

        return (
          <>
            <div className='container'>
              <Form>
                <FormLayout>
                  <FormLayout.Options>
                    <Paragraph>
                      Som standard blir alle obligatoriske felt validert. For å kunne lagre uten å fylle ut
                      obligatoriske felt, må du huke av i avkrysningsboksen nedenfor.
                    </Paragraph>
                    <Checkbox
                      size='sm'
                      value='ignoreRequired'
                      checked={ignoreRequired}
                      onChange={(e) => setIgnoreRequired(e.target.checked)}
                    >
                      Ignorer obligatoriske felt
                    </Checkbox>
                  </FormLayout.Options>
                  <FormLayout.Section
                    id='term'
                    title={localization.conceptForm.section.termTitle}
                    subtitle={localization.conceptForm.section.termSubtitle}
                    required
                    error={hasError(['anbefaltTerm', 'tillattTerm', 'frarådetTerm'])}
                  >
                    <TermSection />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='definition'
                    title={localization.conceptForm.section.definitionTitle}
                    subtitle={localization.conceptForm.section.definitionSubtitle}
                    required
                    error={hasError(['definisjon', 'definisjonForAllmennheten', 'definisjonForSpesialister'])}
                  >
                    <DefinitionSection />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='remark'
                    title={localization.conceptForm.section.remarkTitle}
                    subtitle={localization.conceptForm.section.remarkSubtitle}
                    error={hasError(['merknad'])}
                  >
                    <RemarkSection />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='subject'
                    title={localization.conceptForm.section.subjectTitle}
                    subtitle={localization.conceptForm.section.subjectSubtitle}
                    error={hasError(['fagområdeKoder'])}
                  >
                    <SubjectSection codes={subjectCodeList?.codes} />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='example'
                    title={localization.conceptForm.section.exampleTitle}
                    subtitle={localization.conceptForm.section.exampleTitle}
                    error={hasError(['eksempel'])}
                  >
                    <ExampleSection />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='valueRange'
                    title={localization.conceptForm.section.valueRangeTitle}
                    subtitle={localization.conceptForm.section.valueRangeSubtitle}
                    error={hasError(['omfang'])}
                  >
                    <ValueRangeSection />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='relation'
                    title='Relasjoner'
                    subtitle='Relasjoner til begrepet.'
                    error={hasError([
                      'begrepsRelasjon',
                      'erstattesAv',
                      'seOgså',                      
                      'internBegrepsRelasjon',
                      'internErstattesAv',
                      'internSeOgså',
                    ])}
                  >
                    <RelationSection catalogId={catalogId} />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='internal'
                    title='Interne opplysninger'
                    subtitle='Opplysningene under er til intern bruk og vil ikke publiseres ut i Felles datakatalog.'
                    error={hasError(['interneFelt'])}
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
                    error={hasError(['statusURI'])}
                  >
                    <StatusSection conceptStatuses={conceptStatuses} />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='version'
                    title='Versjon'
                    subtitle='En versjon representerer en spesifikk utgave eller oppdatering av et begrep, som reflekterer eventuelle endringer i definisjon, kontekst eller bruk over tid.'
                    error={hasError(['versjonsnr'])}
                  >
                    <VersionSection />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='period'
                    title='Gyldighetsperiode'
                    subtitle='Her registrerer du datoen som begrepet skal gjelde fra og med og til og med.'
                    error={hasError(['gyldigFom', 'gyldigTom'])}
                  >
                    <PeriodSection />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='contact'
                    title='Kontaktinformasjon'
                    subtitle='Her registrerer du datoen som begrepet skal gjelde fra og med og til og med.'
                    required
                    error={hasError(['kontaktpunkt'])}
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
                      disabled={isSubmitting || isValidating || isCanceled || !dirty}
                      onClick={() => {
                        setIsSaveButtonClicked(true);
                        submitForm();
                      }}
                    >
                      {isSubmitting ? (
                        <Spinner
                          title='Lagrer'
                          size='sm'
                        />
                      ) : (
                        'Lagre'
                      )}
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
