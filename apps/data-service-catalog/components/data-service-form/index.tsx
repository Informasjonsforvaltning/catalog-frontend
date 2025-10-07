'use client';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { localization, trimObjectWhitespace, deepMergeWithUndefinedHandling, formatISO, getTranslateText } from '@catalog-frontend/utils';
import { DataService, DataServiceReferenceData, DataServiceToBeCreated, StorageData } from '@catalog-frontend/types';
import { FormLayout, StickyFooterBar, useWarnIfUnsavedChanges, FormikAutoSaver, Snackbar, NotificationCarousel, HelpMarkdown } from '@catalog-frontend/ui';
import { Formik, Form } from 'formik';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button, Checkbox, Spinner, Alert, Paragraph } from '@digdir/designsystemet-react';
import styles from './data-service-form.module.css';
import { AboutSection } from './components/about-section';
import { EndpointSection } from './components/endpoint-section';
import { ContactPointSection } from './components/contact-point-section';
import { FormatSection } from './components/format-section';
import { DocumentationSection } from './components/documentation-section';
import { AccessSection } from './components/access-section';
import { DatasetSection } from './components/dataset-section';
import { StatusSection } from './components/status-section';
import { dataServiceValidationSchema } from './utils/validation-schema';
import { DataStorage } from '@catalog-frontend/utils';
import { get, isEmpty, isEqual } from 'lodash';
import classNames from 'classnames';
import { VersionSection } from './components/version-section';

type Props = {
  initialValues: DataService | DataServiceToBeCreated;
  searchEnv: string; // Environment variable to search service
  referenceData: DataServiceReferenceData;
  referenceDataEnv: string; // Environment variable to reference data
  autoSaveStorage?: DataStorage<StorageData>;
  autoSave?: boolean;
  autoSaveId?: string;
  onCancel?: () => void;
  afterSubmit?: () => void;
  onSubmit?: (values: DataService) => Promise<DataService | undefined>;
  readOnly?: boolean;
  showSnackbarSuccessOnInit?: boolean;
  markDirty?: boolean;
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

const DataServiceForm = ({
  initialValues,
  searchEnv,
  referenceData,
  referenceDataEnv,
  autoSaveStorage,
  autoSave = true,
  autoSaveId,
  onCancel,
  afterSubmit,
  onSubmit,
  readOnly = false,
  showSnackbarSuccessOnInit = false,
  markDirty = false,
}: Props) => {
  const searchParams = useSearchParams();
  const restoreOnRender = Boolean(searchParams.get('restore'));
  const { catalogId, dataServiceId } = useParams();
  const [isDirty, setIsDirty] = useState(false);
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'danger' | 'warning' | 'info'>('success');
  const [snackbarFadeIn, setSnackbarFadeIn] = useState(true);
  const router = useRouter();
  const formikRef = useRef(null);

  //useWarnIfUnsavedChanges({ unsavedChanges: isDirty });

  const showSnackbarMessage = ({ message, severity, fadeIn = true }) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarFadeIn(fadeIn);
    setShowSnackbar(true);
  };

  const handleCancel = () => {
    setIsCanceled(true);
    if (onCancel) {
      onCancel();
    } else {
      router.push(
        dataServiceId ? `/catalogs/${catalogId}/data-services/${dataServiceId}` : `/catalogs/${catalogId}/data-services`,
      );
    }
  };

  const restoreConfirmMessage = ({ values, lastChanged }: StorageData) => {
    const name = getTranslateText(values?.title) || localization.dataServiceForm.alert.titleNotDefined;
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
    if (showSnackbarSuccessOnInit) {
      showSnackbarMessage({ message: localization.snackbar.saveSuccessfull, severity: 'success', fadeIn: false });
    }
  }, [showSnackbarSuccessOnInit]);

  return (
    <>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues as DataService}
        validationSchema={dataServiceValidationSchema}
        validateOnChange={validateOnChange}
        validateOnBlur={validateOnChange}
        onSubmit={async (values: DataService, { setSubmitting, resetForm }) => {
          if (readOnly) {
            return;
          }

          if (onSubmit) {
            try {
              const newValues = await onSubmit(trimObjectWhitespace(values) as DataService);

              showSnackbarMessage({ message: localization.snackbar.saveSuccessfull, severity: 'success' });
              if (newValues) {
                resetForm({ values: newValues });
              } else {
                resetForm();
              }

              // Discard stored data
              autoSaveStorage?.delete();

              if (afterSubmit) {
                afterSubmit();
              }
            } catch (error) {
              showSnackbarMessage({ message: localization.snackbar.saveFailed, severity: 'danger' });
            } finally {
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, dirty, isSubmitting, isValidating, submitForm, setValues, setFieldValue, values, initialValues: formInitialValues }) => {
          setTimeout(() => setIsDirty(dirty), 0);
          const notifications = getNotifications({ isValid: Object.keys(errors).length === 0, hasUnsavedChanges: false });
          const hasError = (fields: (keyof DataService)[]) => fields.some((field) => Object.keys(errors).includes(field));

          const handleRestoreDataService = (data: StorageData) => {
            if (data?.id !== autoSaveId) {
              if (!data?.id) {
                window.location.replace(`/catalogs/${catalogId}/data-services/new?restore=1`);
                return false;
              }
              window.location.replace(`/catalogs/${catalogId}/data-services/${data.id}/edit?restore=1`);
              return false;
            }

            const restoreValues: DataService = deepMergeWithUndefinedHandling({ ...initialValues }, data.values);
            setValues(restoreValues);

            showSnackbarMessage({ message: localization.snackbar.restoreSuccessfull, severity: 'success' });
            return true;
          };

          const dirtyFields = ((): string[] => {
            const dirtyFields: string[] = [];

            const isDirty = (name) => {
              const a = get(formInitialValues, name);
              const b = get(values, name);

              if (isEmpty(a) && isEmpty(b)) {
                return false;
              }

              return !isEqual(a, b);
            };

            [
              ...Object.keys({ ...formInitialValues, ...values }),
              'title',
              'description',
              'endpointUrl',
              'endpointDescriptions',
              'landingPage',
              'pages',
              'contactPoint',
              'formats',
              'license',
              'accessRights',
              'servesDataset',
              'status',
              'availability',
            ].forEach((name) => {
              if (isDirty(name)) {
                dirtyFields.push(name);
              }
            });

            return dirtyFields;
          })();

          return (
            <>
              {autoSave && autoSaveStorage && (
                <FormikAutoSaver
                  id={autoSaveId}
                  storage={autoSaveStorage}
                  restoreOnRender={restoreOnRender}
                  onRestore={handleRestoreDataService}
                  confirmMessage={restoreConfirmMessage}
                />
              )}
              <div className='container'>
                <Form>
                  <FormLayout>
                    <FormLayout.Section
                      id='about-section'
                      title={localization.dataServiceForm.heading.about}
                      subtitle={localization.dataServiceForm.subtitle.about}
                      required
                      changed={markDirty && dirtyFields.some((field) => ['title', 'description'].includes(field))}
                      error={hasError(['title'])}
                    >
                      <AboutSection />
                    </FormLayout.Section>

                    <FormLayout.Section
                      id='endpoint-section'
                      title={localization.dataServiceForm.heading.endpoint}
                      subtitle={localization.dataServiceForm.subtitle.endpoint}
                      required
                      changed={markDirty && dirtyFields.some((field) => ['endpointUrl', 'endpointDescriptions'].includes(field))}
                      error={hasError(['endpointUrl', 'endpointDescriptions'])}
                    >
                      <EndpointSection />
                    </FormLayout.Section>

                    <FormLayout.Section
                      id='documentation-section'
                      title={localization.dataServiceForm.heading.documentation}
                      subtitle={localization.dataServiceForm.subtitle.documentation}
                      changed={markDirty && dirtyFields.some((field) => ['landingPage', 'pages'].includes(field))}
                      error={hasError(['landingPage', 'pages'])}
                    >
                      <DocumentationSection />
                    </FormLayout.Section>

                    <FormLayout.Section
                      id='format-section'
                      title={localization.dataServiceForm.heading.format}
                      subtitle={localization.dataServiceForm.subtitle.format}
                      changed={markDirty && dirtyFields.some((field) => ['formats'].includes(field))}
                      error={hasError(['formats'])}
                    >
                      <FormatSection referenceDataEnv={referenceDataEnv} />
                    </FormLayout.Section>

                    <FormLayout.Section
                      id='access-section'
                      title={localization.dataServiceForm.heading.access}
                      subtitle={localization.dataServiceForm.subtitle.access}
                      changed={markDirty && dirtyFields.some((field) => ['license', 'accessRights'].includes(field))}
                      error={hasError(['license', 'accessRights'])}
                    >
                      <AccessSection
                        openLicenses={referenceData.openLicenses}
                        currencies={referenceData.currencies}
                      />
                    </FormLayout.Section>

                    <FormLayout.Section
                      id='dataset-section'
                      title={localization.dataServiceForm.heading.dataset}
                      subtitle={localization.dataServiceForm.subtitle.dataset}
                      changed={markDirty && dirtyFields.some((field) => ['servesDataset'].includes(field))}
                      error={hasError(['servesDataset'])}
                    >
                      <DatasetSection searchEnv={searchEnv} />
                    </FormLayout.Section>

                    <FormLayout.Section
                      id='status-section'
                      title={localization.dataServiceForm.heading.status}
                      subtitle={localization.dataServiceForm.subtitle.status}
                      changed={markDirty && dirtyFields.some((field) => ['status', 'availability'].includes(field))}
                      error={hasError(['status'])}
                    >
                      <StatusSection
                        statuses={referenceData.distributionStatuses}
                        availabilities={referenceData.plannedAvailabilities}
                      />
                    </FormLayout.Section>

                    <FormLayout.Section
                      id='data-service-version-section'
                      title={localization.dataServiceForm.heading.version}
                      subtitle={localization.dataServiceForm.subtitle.version}
                      changed={markDirty && dirtyFields.some((field) => ['versionInfo'].includes(field))}
                      error={hasError(['versionInfo'])}
                    >
                      <VersionSection />
                    </FormLayout.Section>

                    <FormLayout.Section
                      id='contact-point-section'
                      title={localization.dataServiceForm.heading.contactPoint}
                      subtitle={localization.dataServiceForm.subtitle.contactPoint}
                      required
                      changed={markDirty && dirtyFields.some((field) => ['contactPoint'].includes(field))}
                      error={hasError(['contactPoint'])}
                    >
                      <ContactPointSection />
                    </FormLayout.Section>
                  </FormLayout>
                </Form>
              </div>

              {showSnackbar && (
                <Snackbar fadeIn={snackbarFadeIn}>
                  <Snackbar.Item
                    severity={snackbarSeverity}
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
                        data-testid='save-data-service-button'
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
                        data-testid='cancel-data-service-button'
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
    </>
  );
};

export default DataServiceForm;
