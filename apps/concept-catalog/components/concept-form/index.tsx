'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Formik, Form, FormikProps } from 'formik';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Alert, Checkbox, Paragraph, Spinner } from '@digdir/designsystemet-react';
import { DataStorage, formatISO, getTranslateText, localization } from '@catalog-frontend/utils';
import { CodeListsResult, Concept, FieldsResult, ReferenceDataCode, UsersResult } from '@catalog-frontend/types';
import {
  Button,
  StorageData,
  FormLayout,
  FormikAutoSaver,
  FormikAutoSaverRef,
  NotificationCarousel,
  HelpMarkdown,
  ConfirmModal,
  Snackbar,
} from '@catalog-frontend/ui';
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
import { isEqual } from 'lodash';

type Props = {
  afterSubmit?: () => void;
  autoSave?: boolean;  
  autoSaveId?: string;
  autoSaveStorage?: DataStorage<StorageData>;
  catalogId: string;
  concept?: Concept;
  conceptStatuses: ReferenceDataCode[];
  codeListsResult: CodeListsResult;
  customFooterBar?: ReactNode;
  fieldsResult: FieldsResult;
  initialConcept: Concept;
  markDirty?: boolean;
  onCancel?: () => void;
  onSubmit?: (values: Concept) => Promise<Concept | undefined>;
  readOnly?: boolean;
  showSnackbarSuccessOnInit?: boolean;
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
          {localization.validation.formError}
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
          {localization.validation.unsavedChanges}
        </Alert>,
      ]
    : []),
];

const ConceptForm = ({
  afterSubmit,
  autoSave = true,
  autoSaveId,
  autoSaveStorage,
  catalogId,
  concept,
  conceptStatuses,
  codeListsResult,
  customFooterBar,
  fieldsResult,
  initialConcept,
  markDirty,
  onCancel,
  onSubmit,
  readOnly,
  showSnackbarSuccessOnInit,
  usersResult,
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const formikRef = useRef<FormikProps<Concept>>(null);
  const autoSaveRef = useRef<FormikAutoSaverRef>(null);

  const restoreOnRender = Boolean(searchParams.get('restore'));
  const validateOnRender = Boolean(searchParams.get('validate'));
  const [validateOnChange, setValidateOnChange] = useState(validateOnRender);
  const [isCanceled, setIsCanceled] = useState(false);
  const [ignoreRequired, setIgnoreRequired] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'danger'>('success');
  const [snackbarFadeIn, setSnackbarFadeIn] = useState(true);

  const showSnackbarMessage = ({ message, severity, fadeIn = true }) => {
    setShowSnackbar(true);
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarFadeIn(fadeIn);
  };

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

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelConfirm(false);

    autoSaveRef.current?.discard();
    setIsCanceled(true);

    if (onCancel) {
      try {        
        onCancel();
      } catch {
        // Nothing...
      }
    }
  };

  const handleCloseConfirmCancel = () => {
    setShowCancelConfirm(false);
  };

  const restoreConfirmMessage = ({ values, lastChanged }: StorageData) => {
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
        <Paragraph size='sm'>{localization.alert.youHaveUnsavedChanges}</Paragraph>
        <Paragraph size='sm'>
          <span className={styles.bold}>{name}</span> ({lastChangedFormatted})
        </Paragraph>
        <Paragraph
          size='sm'
          className={styles.topMargin2}
        >
          {localization.alert.wantToRestoreChanges}
        </Paragraph>
      </>
    );
  };

  useEffect(() => {
    if (validateOnRender) {
      formikRef.current?.validateForm();
    }
  }, [validateOnRender]);

  useEffect(() => {
    if (showSnackbarSuccessOnInit) {
      showSnackbarMessage({ message: localization.snackbar.saveSuccessfull, severity: 'success', fadeIn: false });
    }
  }, [showSnackbarSuccessOnInit]);

  return (
    <>
      {showCancelConfirm && (
        <ConfirmModal
          title={localization.confirm.cancelForm.title}
          content={localization.confirm.cancelForm.message}
          onSuccess={handleConfirmCancel}
          onCancel={handleCloseConfirmCancel}
        />
      )}
      <Formik
        innerRef={formikRef}
        initialValues={mapPropsToValues(initialConcept)}
        validationSchema={conceptSchema({ required: !ignoreRequired, baseUri: '' })}
        validateOnChange={validateOnChange}
        validateOnBlur={validateOnChange}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          if (readOnly) {
            return;
          }

          if (onSubmit) {
            try {
              const newValues = await onSubmit(values);

              showSnackbarMessage({ message: localization.snackbar.saveSuccessfull, severity: 'success' });
              if (newValues) {
                resetForm({ values: newValues });
              } else {
                resetForm();
              }

              // Discard stored data
              autoSaveRef.current?.discard();
                            
              if (afterSubmit) {
                afterSubmit();
              }              
            } catch {              
              showSnackbarMessage({ message: localization.snackbar.saveFailed, severity: 'danger' });
            } finally {
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, dirty, isValid, isSubmitting, isValidating, submitForm, setValues }) => {
          const notifications = getNotifications({ isValid, hasUnsavedChanges: false });
          const hasError = (fields: (keyof Concept)[]) => fields.some((field) => Object.keys(errors).includes(field));

          const handleRestoreConcept = (data: StorageData) => {
            const entityType = pathname.includes('change-requests') ? 'change-requests' : 'concepts';

            if (data?.id !== autoSaveId) {
              if (!data?.id) {
                return window.location.replace(`/catalogs/${catalogId}/${entityType}/new?restore=1`);
              }
              return window.location.replace(`/catalogs/${catalogId}/${entityType}/${data.id}/edit?restore=1`);
            }

            setValues(data.values);
            showSnackbarMessage({ message: localization.snackbar.restoreSuccessfull, severity: 'success' });
          };

          if (concept && !isEqual(initialConcept, concept) && !dirty) {
            setValues(concept);
          }

          return (
            <>
              <div className='container'>
                <Form>
                  {autoSave && autoSaveStorage && (
                    <FormikAutoSaver
                      ref={autoSaveRef}
                      id={autoSaveId}
                      storage={autoSaveStorage}
                      restoreOnRender={restoreOnRender}
                      onRestore={handleRestoreConcept}
                      confirmMessage={restoreConfirmMessage}
                    />
                  )}

                  <FormLayout>
                    <FormLayout.Section
                      id='term'
                      title={localization.conceptForm.section.termTitle}
                      subtitle={localization.conceptForm.section.termSubtitle}
                      required
                      error={hasError(['anbefaltTerm', 'tillattTerm', 'frarådetTerm'])}
                    >
                      <TermSection
                        markDirty={markDirty}
                        readOnly={readOnly}
                      />
                    </FormLayout.Section>
                    <FormLayout.Section
                      id='definition'
                      title={localization.conceptForm.section.definitionTitle}
                      subtitle={localization.conceptForm.section.definitionSubtitle}
                      required
                      error={hasError(['definisjon', 'definisjonForAllmennheten', 'definisjonForSpesialister'])}
                    >
                      <DefinitionSection
                        markDirty={markDirty}
                        readOnly={readOnly}
                      />
                    </FormLayout.Section>
                    <FormLayout.Section
                      id='remark'
                      title={localization.conceptForm.section.remarkTitle}
                      subtitle={localization.conceptForm.section.remarkSubtitle}
                      error={hasError(['merknad'])}
                    >
                      <RemarkSection
                        markDirty={markDirty}
                        readOnly={readOnly}
                      />
                    </FormLayout.Section>
                    <FormLayout.Section
                      id='subject'
                      title={localization.conceptForm.section.subjectTitle}
                      subtitle={localization.conceptForm.section.subjectSubtitle}
                      error={hasError(['fagområdeKoder'])}
                    >
                      <SubjectSection
                        codes={subjectCodeList?.codes}
                        markDirty={markDirty}
                        readOnly={readOnly}
                      />
                    </FormLayout.Section>
                    <FormLayout.Section
                      id='example'
                      title={localization.conceptForm.section.exampleTitle}
                      subtitle={localization.conceptForm.section.exampleSubtitle}
                      error={hasError(['eksempel'])}
                    >
                      <ExampleSection
                        markDirty={markDirty}
                        readOnly={readOnly}
                      />
                    </FormLayout.Section>
                    <FormLayout.Section
                      id='valueRange'
                      title={localization.conceptForm.section.valueRangeTitle}
                      subtitle={localization.conceptForm.section.valueRangeSubtitle}
                      error={hasError(['omfang'])}
                    >
                      <ValueRangeSection
                        markDirty={markDirty}
                        readOnly={readOnly}
                      />
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
                      <RelationSection
                        catalogId={catalogId}
                        markDirty={markDirty}
                        readOnly={readOnly}
                      />
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
                        markDirty={markDirty}
                        readOnly={readOnly}
                      />
                    </FormLayout.Section>
                    <FormLayout.Section
                      id='status'
                      title={localization.conceptForm.section.conceptStatusTitle}
                      subtitle={localization.conceptForm.section.conceptStatusSubtitle}
                      error={hasError(['statusURI'])}
                    >
                      <StatusSection
                        conceptStatuses={conceptStatuses}
                        markDirty={markDirty}
                        readOnly={readOnly}
                      />
                    </FormLayout.Section>
                    <FormLayout.Section
                      id='version'
                      title={localization.conceptForm.section.versionTitle}
                      subtitle={localization.conceptForm.section.versionSubtitle}
                      error={hasError(['versjonsnr'])}
                    >
                      <VersionSection
                        markDirty={markDirty}
                        readOnly={readOnly}
                      />
                    </FormLayout.Section>
                    <FormLayout.Section
                      id='period'
                      title={localization.conceptForm.section.periodTitle}
                      subtitle={localization.conceptForm.section.periodSubtitle}
                      error={hasError(['gyldigFom', 'gyldigTom'])}
                    >
                      <PeriodSection
                        markDirty={markDirty}
                        readOnly={readOnly}
                      />
                    </FormLayout.Section>
                    <FormLayout.Section
                      id='contact'
                      title={localization.conceptForm.section.contactTitle}
                      subtitle={localization.conceptForm.section.contactSubtitle}
                      required
                      error={hasError(['kontaktpunkt'])}
                    >
                      <ContactSection
                        markDirty={markDirty}
                        readOnly={readOnly}
                      />
                    </FormLayout.Section>
                  </FormLayout>
                </Form>
              </div>

              {showSnackbar && (
                <Snackbar>
                  <Snackbar.Item
                    severity={snackbarSeverity}
                    fadeIn={snackbarFadeIn}
                    onClose={() => {
                      setShowSnackbar(false);
                    }}
                  >
                    {snackbarMessage}
                  </Snackbar.Item>
                </Snackbar>
              )}
              <div className={styles.stickyFooterBar}>
                <div className={classNames('container', styles.stickyFooterContent)}>
                  {customFooterBar ? (
                    <>{customFooterBar}</>
                  ) : (
                    <>
                      <div>
                        <div className={classNames(styles.flex, styles.gap4)}>
                          <Button
                            size='sm'
                            type='button'
                            disabled={readOnly || isSubmitting || isValidating || isCanceled || !dirty}
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
                            disabled={readOnly || isSubmitting || isValidating || isCanceled}
                            onClick={handleCancel}
                            variant='secondary'
                          >
                            Avbryt
                          </Button>
                          <div className={classNames(styles.flex, styles.gap2, styles.noWrap)}>
                            <Checkbox
                              size='sm'
                              value='ignoreRequired'
                              checked={ignoreRequired}
                              onChange={(e) => setIgnoreRequired(e.target.checked)}
                            >
                              {localization.conceptForm.fieldLabel.ignoreRequired}
                            </Checkbox>
                            <HelpMarkdown aria-label={`Help ${localization.conceptForm.fieldLabel.ignoreRequired}`}>
                              {localization.conceptForm.alert.ignoreRequired}
                            </HelpMarkdown>
                          </div>
                        </div>
                      </div>
                      {notifications.length > 0 && <NotificationCarousel notifications={notifications} />}
                    </>
                  )}
                </div>
              </div>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default ConceptForm;
