'use client';

import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Formik, Form, FormikProps } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation';
import { Alert, Checkbox, Paragraph, Spinner } from '@digdir/designsystemet-react';
import { CatalogLocalStorage, formatISO, getTranslateText, localization } from '@catalog-frontend/utils';
import { CodeListsResult, Concept, FieldsResult, ReferenceDataCode, UsersResult } from '@catalog-frontend/types';
import {
  Button,
  ConceptStorageData,
  FormLayout,
  FormikAutoSaver,
  FormikAutoSaverRef,
  NotificationCarousel,
} from '@catalog-frontend/ui';
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const formikRef = useRef<FormikProps<Concept>>(null);
  const autoSaveRef = useRef<FormikAutoSaverRef>(null);

  const restoreOnRender = Boolean(searchParams.get('restore'));
  const validateOnRender = Boolean(searchParams.get('validate'));
  const [validateOnChange, setValidateOnChange] = useState(validateOnRender);
  const [isCanceled, setIsCanceled] = useState(false);
  const [ignoreRequired, setIgnoreRequired] = useState(false);

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
    // Discard stored data
    autoSaveRef.current?.discard();

    setIsCanceled(true);
    router.push(concept.id ? `/catalogs/${catalogId}/concepts/${concept.id}` : `/catalogs/${catalogId}/concepts`);
  };

  const restoreConfirmMessage = ({ values, lastChanged }: ConceptStorageData) => {
    const name = getTranslateText(values?.anbefaltTerm?.navn) || localization.conceptForm.alert.termNotDefined;
    const lastChangedFormatted = formatISO(lastChanged, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    return (
      <>
        <Paragraph size='sm'>{localization.conceptForm.alert.youHaveUnsavedChanges}</Paragraph>
        <Paragraph size='sm'>
          <span className={styles.bold}>{name}</span> ({lastChangedFormatted})
        </Paragraph>
        <Paragraph
          size='sm'
          className={styles.topMargin2}
        >
          {localization.conceptForm.alert.wantToRestoreChanges}
        </Paragraph>
      </>
    );
  };

  useEffect(() => {
    if (validateOnRender) {
      formikRef.current?.validateForm();
    }
  }, []);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={mapPropsToValues(concept)}
      validationSchema={conceptSchema({ required: !ignoreRequired, baseUri: '' })}
      validateOnChange={validateOnChange}
      validateOnBlur={validateOnChange}
      onSubmit={async (values, { setSubmitting }) => {
        concept.id === null ? await handleCreate(values as Concept) : await handleUpdate(values as Concept);
        setSubmitting(false);
        // Discard stored data
        autoSaveRef.current?.discard();
      }}
    >
      {({ errors, dirty, isValid, isSubmitting, isValidating, submitForm, setValues }) => {
        const notifications = getNotifications({ isValid, hasUnsavedChanges: false });
        const hasError = (fields: (keyof Concept)[]) => fields.some((field) => Object.keys(errors).includes(field));

        const handleRestoreConcept = (data: ConceptStorageData) => {
          if (data?.values?.id !== concept.id) {
            if (!data?.values?.id) {
              return router.push(`/catalogs/${catalogId}/concepts/new?restore=1`);
            }
            return router.push(`/catalogs/${catalogId}/concepts/${data.values.id}/edit?restore=1`);
          }
          setValues(data.values);
        };

        return (
          <>
            <div className='container'>
              <Form>
                <FormikAutoSaver
                  ref={autoSaveRef}
                  storage={new CatalogLocalStorage<ConceptStorageData>({ key: 'conceptForm' })}
                  restoreOnRender={restoreOnRender}
                  onRestore={handleRestoreConcept}
                  confirmMessage={restoreConfirmMessage}
                />
                <FormLayout>
                  <FormLayout.Options>
                    <Paragraph>{localization.conceptForm.alert.ignoreRequired}</Paragraph>
                    <Checkbox
                      size='sm'
                      value='ignoreRequired'
                      checked={ignoreRequired}
                      onChange={(e) => setIgnoreRequired(e.target.checked)}
                    >
                      {localization.conceptForm.fieldLabel.ignoreRequired}
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
                    subtitle={localization.conceptForm.section.exampleSubtitle}
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
                    title={localization.conceptForm.section.relationTitle}
                    subtitle={localization.conceptForm.section.relationSubtitle}
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
                    title={localization.conceptForm.section.internalTitle}
                    subtitle={localization.conceptForm.section.internalSubtitle}
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
                    title={localization.conceptForm.section.conceptStatusTitle}
                    subtitle={localization.conceptForm.section.conceptStatusSubtitle}
                    error={hasError(['statusURI'])}
                  >
                    <StatusSection conceptStatuses={conceptStatuses} />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='version'
                    title={localization.conceptForm.section.versionTitle}
                    subtitle={localization.conceptForm.section.versionSubtitle}
                    error={hasError(['versjonsnr'])}
                  >
                    <VersionSection />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='period'
                    title={localization.conceptForm.section.periodTitle}
                    subtitle={localization.conceptForm.section.periodSubtitle}
                    error={hasError(['gyldigFom', 'gyldigTom'])}
                  >
                    <PeriodSection />
                  </FormLayout.Section>
                  <FormLayout.Section
                    id='contact'
                    title={localization.conceptForm.section.contactTitle}
                    subtitle={localization.conceptForm.section.contactSubtitle}
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
                        setValidateOnChange(true);
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
