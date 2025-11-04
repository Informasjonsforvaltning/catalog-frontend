'use client';
import { DataStorage, formatISO, getTranslateText, localization, trimObjectWhitespace } from '@catalog-frontend/utils';
import { Alert, Button, Checkbox, Paragraph, Spinner, Switch } from '@digdir/designsystemet-react';
import {
  Dataset,
  DatasetToBeCreated,
  ReferenceData,
  StorageData,
  Distribution,
  Reference,
} from '@catalog-frontend/types';
import {
  ConfirmModal,
  FormikAutoSaver,
  FormLayout,
  HelpMarkdown,
  NotificationCarousel,
  Snackbar,
  StickyFooterBar,
} from '@catalog-frontend/ui';
import { Formik, Form, FormikProps } from 'formik';
import { useParams, useSearchParams } from 'next/navigation';
import { datasetTemplate } from './utils/dataset-initial-values';
import { useEffect, useRef, useState } from 'react';
import { confirmedDatasetSchema, draftDatasetSchema } from './utils/validation-schema';
import { AboutSection } from './components/about-section';
import ThemeSection from './components/theme-section';
import { ConceptSection } from './components/concept-section';
import { InformationModelSection } from './components/information-model-section';
import { RelationsSection } from './components/relations-section/relations-section';
import { DistributionSection } from './components/distribution-section/distribution-section';
import { ContactPointSection } from './components/contact-point-section';
import styles from './dataset-form.module.css';
import { DetailsSection } from './components/details-section/details-section';
import classNames from 'classnames';

type Props = {
  afterSubmit?: () => void;
  initialValues: DatasetToBeCreated | Dataset;
  autoSaveStorage: DataStorage<StorageData>;
  submitType: 'create' | 'update';
  searchEnv: string; // Environment variable to search service
  referenceDataEnv: string; // Environment variable to reference data
  referenceData: ReferenceData;
  onCancel?: () => void;
  onSubmit?: (values: Dataset) => Promise<Dataset | undefined>;
  showSnackbarSuccessOnInit?: boolean;
};

const restoreConfirmMessage = ({ values, lastChanged }: StorageData) => {
  const lastChangedFormatted = formatISO(lastChanged, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return (
    <>
      <Paragraph size='sm'>{localization.datasetForm.alert.youHaveUnsavedChanges}</Paragraph>
      <Paragraph size='sm'>
        <span className={styles.bold}>{getTranslateText(values?.title)}</span> ({lastChangedFormatted})
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

export const DatasetForm = ({
  initialValues,
  autoSaveStorage,
  referenceData,
  searchEnv,
  referenceDataEnv,
  showSnackbarSuccessOnInit,
  afterSubmit,
  onSubmit,
  onCancel,
}: Props) => {
  const { catalogId, datasetId } = useParams();
  const searchParams = useSearchParams();
  const formikRef = useRef<FormikProps<Dataset>>(null);
  const restoreOnRender = Boolean(searchParams.get('restore'));
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const [ignoreRequired, setIgnoreRequired] = useState(true);
  const [showUnapproveModal, setShowUnapproveModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const { losThemes, dataThemes, openLicenses } = referenceData;

  const [formApprovedStatus, setFormApprovedStatus] = useState(initialValues?.approved);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'danger'>('success');
  const [snackbarFadeIn, setSnackbarFadeIn] = useState(true);

  const showSnackbarMessage = ({ message, severity, fadeIn = true }: any) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarFadeIn(fadeIn);
    if (fadeIn) {
      setShowSnackbar(false);
      setTimeout(() => setShowSnackbar(true), 10);
    } else {
      setShowSnackbar(true);
    }
  };

  const handleSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (fieldName: string, value: boolean) => void,
  ) => {
    const isChecked = event.target.checked;
    if (!isChecked && 'published' in initialValues && initialValues?.published === true) {
      showSnackbarMessage({ message: localization.datasetForm.alert.unpublishBeforeUnapprove, severity: 'danger' });
    } else {
      setFormApprovedStatus(isChecked);
      setFieldValue('approved', isChecked);
    }
  };

  const handleIgnoreRequiredChange = (newValue: boolean) => {
    if (newValue && 'published' in initialValues && initialValues?.published === true) {
      showSnackbarMessage({
        message: localization.datasetForm.alert.unpublishBeforeIgnoreRequired,
        severity: 'danger',
      });
    } else if (newValue && formApprovedStatus === true) {
      setShowUnapproveModal(true);
    } else {
      setIgnoreRequired(newValue);
    }
  };

  const handleUnapproveConfirm = (setFieldValue: (fieldName: string, value: boolean) => void) => {
    setFormApprovedStatus(false);
    setFieldValue('approved', false);
    setIgnoreRequired(true);
    setShowUnapproveModal(false);
  };

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelConfirm(false);

    autoSaveStorage.delete();
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

  type Notifications = {
    isValid: boolean;
    hasUnsavedChanges: boolean;
  };

  const getNotifications = ({ isValid, hasUnsavedChanges }: Notifications) => [
    ...(isValid
      ? []
      : [
          <Alert
            key={1}
            size='sm'
            severity='danger'
            className={styles.notification}
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
            className={styles.notification}
          >
            {localization.validation.unsavedChanges}
          </Alert>,
        ]
      : []),
  ];

  useEffect(() => {
    if (formApprovedStatus === true) {
      setIgnoreRequired(false);
    }
  }, [setIgnoreRequired, formApprovedStatus]);

  useEffect(() => {
    if (showSnackbarSuccessOnInit) {
      showSnackbarMessage({ message: localization.snackbar.saveSuccessful, severity: 'success', fadeIn: false });
    }
  }, [showSnackbarSuccessOnInit]);

  return (
    <>
      {showCancelConfirm && (
        <ConfirmModal
          title={localization.confirm.exitForm.title}
          content={localization.confirm.exitForm.message}
          onSuccess={handleConfirmCancel}
          onCancel={handleCloseConfirmCancel}
        />
      )}
      <Formik
        innerRef={formikRef}
        initialValues={datasetTemplate(initialValues as Dataset)}
        validationSchema={ignoreRequired ? draftDatasetSchema : confirmedDatasetSchema}
        validateOnChange={validateOnChange}
        validateOnBlur={validateOnChange}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          if (onSubmit) {
            try {
              const newValues = await onSubmit(trimObjectWhitespace(values));

              showSnackbarMessage({ message: localization.snackbar.saveSuccessful, severity: 'success' });
              if (newValues) {
                resetForm({ values: datasetTemplate(newValues) });
              } else {
                resetForm();
              }

              // Discard stored data
              autoSaveStorage.delete();

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
        {({ setFieldValue, values, dirty, isValid, isSubmitting, isValidating, submitForm, errors, setValues }) => {
          const notifications = getNotifications({ isValid, hasUnsavedChanges: false });
          const hasError = (fields: (keyof Dataset)[]) => fields.some((field) => Object.keys(errors).includes(field));
          const handleRestoreDataset = (data: StorageData) => {
            if (data?.id !== datasetId) {
              if (!data?.id) {
                window.location.replace(`/catalogs/${catalogId}/datasets/new?restore=1`);
                return false;
              }
              window.location.replace(`/catalogs/${catalogId}/datasets/${data.id}/edit?restore=1`);
              return false;
            }
            const restoreValues = datasetTemplate(data.values);
            setValues(restoreValues);

            // Handle distribution data from secondary storage
            const restoreDistributionData = autoSaveStorage?.getSecondary('distribution');
            if (restoreDistributionData && restoreDistributionData?.id === datasetId) {
              const distributionValues: {
                distribution: Distribution;
                distributionType: 'distribution' | 'sample';
                index: number;
              } = restoreDistributionData.values;
              setFieldValue(
                `${distributionValues.distributionType}[${distributionValues.index}]`,
                distributionValues.distribution,
              );
              // Delete distribution data from secondary storage since it is merged with the main data
              autoSaveStorage?.deleteSecondary('distribution');
            }

            // Handle reference data from secondary storage
            const restoreReferenceData = autoSaveStorage?.getSecondary('reference');
            if (restoreReferenceData && restoreReferenceData?.id === datasetId) {
              const referenceValues: { reference: Reference; index: number } = restoreReferenceData.values;
              setFieldValue(`references[${referenceValues.index}]`, referenceValues.reference);
              // Delete reference data from secondary storage since it is merged with the main data
              autoSaveStorage?.deleteSecondary('reference');
            }

            showSnackbarMessage({ message: localization.snackbar.restoreSuccessful, severity: 'success' });
            return true;
          };

          return (
            <>
              <Form className='container'>
                <FormikAutoSaver
                  id={datasetId?.toString()}
                  storage={autoSaveStorage}
                  restoreOnRender={restoreOnRender}
                  onRestore={handleRestoreDataset}
                  confirmMessage={restoreConfirmMessage}
                />
                <FormLayout>
                  <FormLayout.Section
                    id='about-section'
                    title={localization.datasetForm.heading.about}
                    subtitle={localization.datasetForm.subtitle.about}
                    required
                    error={hasError([
                      'title',
                      'description',
                      'issued',
                      'legalBasisForRestriction',
                      'legalBasisForProcessing',
                      'legalBasisForAccess',
                    ])}
                  >
                    <AboutSection />
                  </FormLayout.Section>

                  <FormLayout.Section
                    id='tema-section'
                    title={localization.datasetForm.heading.theme}
                    subtitle={localization.datasetForm.subtitle.theme}
                    required
                    error={hasError(['euDataTheme', 'losTheme'])}
                  >
                    <ThemeSection
                      losThemes={losThemes}
                      euDataThemes={dataThemes}
                    />
                  </FormLayout.Section>

                  <FormLayout.Section
                    id='distribution-section'
                    title={localization.datasetForm.heading.distributions}
                    subtitle={localization.datasetForm.subtitle.distributions}
                    error={hasError(['distribution', 'sample'])}
                  >
                    <DistributionSection
                      referenceDataEnv={referenceDataEnv}
                      searchEnv={searchEnv}
                      openLicenses={openLicenses}
                      autoSaveId={datasetId?.toString()}
                      autoSaveStorage={autoSaveStorage}
                    />
                  </FormLayout.Section>

                  <FormLayout.Section
                    id='details-section'
                    title={localization.datasetForm.heading.details}
                    subtitle={localization.datasetForm.subtitle.details}
                    error={hasError(['landingPage', 'conformsTo'])}
                  >
                    <DetailsSection
                      referenceDataEnv={referenceDataEnv}
                      referenceData={referenceData}
                    />
                  </FormLayout.Section>

                  <FormLayout.Section
                    id='relation-section'
                    title={localization.datasetForm.heading.relations}
                    subtitle={localization.datasetForm.subtitle.relations}
                    error={hasError(['references', 'relatedResources'])}
                  >
                    <RelationsSection
                      searchEnv={searchEnv}
                      autoSaveId={datasetId?.toString()}
                      autoSaveStorage={autoSaveStorage}
                    />
                  </FormLayout.Section>

                  <FormLayout.Section
                    id='concept-section'
                    title={localization.datasetForm.heading.concept}
                    subtitle={localization.datasetForm.subtitle.concept}
                    error={hasError(['concepts', 'keywords'])}
                  >
                    <ConceptSection searchEnv={searchEnv} />
                  </FormLayout.Section>

                  <FormLayout.Section
                    id='information-model-section'
                    title={localization.datasetForm.heading.informationModels}
                    subtitle={localization.datasetForm.subtitle.informationModels}
                    error={hasError(['informationModelsFromFDK', 'informationModelsFromOtherSources'])}
                  >
                    <InformationModelSection searchEnv={searchEnv} />
                  </FormLayout.Section>

                  <FormLayout.Section
                    id='contact-point-section'
                    title={localization.datasetForm.heading.contactPoint}
                    subtitle={localization.datasetForm.subtitle.contactPoint}
                    required
                    error={hasError(['contactPoints'])}
                  >
                    <ContactPointSection />
                  </FormLayout.Section>
                </FormLayout>
              </Form>
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
              <StickyFooterBar>
                <div className={styles.footerContent}>
                  <Button
                    type='button'
                    size='sm'
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
                      localization.save
                    )}
                  </Button>

                  <Button
                    type='button'
                    size='sm'
                    variant='secondary'
                    disabled={isSubmitting || isValidating || isCanceled}
                    onClick={handleCancel}
                  >
                    {localization.button.cancel}
                  </Button>
                  <div className={styles.verticalLine}></div>
                  <Switch
                    position='left'
                    size='sm'
                    checked={values.approved}
                    onChange={(event) => handleSwitchChange(event, setFieldValue)}
                  >
                    <div className={styles.footerContent}>
                      {localization.tag.approve}
                      <HelpMarkdown
                        title={localization.datasetForm.fieldLabel.registrationStatus}
                        aria-label={'statusSwitch'}
                      >
                        {localization.datasetForm.helptext.statusSwitch}
                      </HelpMarkdown>
                    </div>
                  </Switch>
                  <div className={styles.verticalLine}></div>
                  <div className={classNames(styles.flex, styles.gap2, styles.noWrap)}>
                    <Checkbox
                      size='sm'
                      value='ignoreRequired'
                      checked={ignoreRequired}
                      onChange={(e) => handleIgnoreRequiredChange(e.target.checked)}
                    >
                      {localization.datasetForm.fieldLabel.ignoreRequired}
                    </Checkbox>
                    <HelpMarkdown aria-label={`Help ${localization.datasetForm.fieldLabel.ignoreRequired}`}>
                      {localization.datasetForm.alert.ignoreRequired}
                    </HelpMarkdown>
                  </div>
                </div>
                {notifications.length > 0 && <NotificationCarousel notifications={notifications} />}
              </StickyFooterBar>
              {showUnapproveModal && (
                <ConfirmModal
                  title={localization.datasetForm.unapproveModal.title}
                  content={localization.datasetForm.unapproveModal.message}
                  onSuccess={() => handleUnapproveConfirm(setFieldValue)}
                  onCancel={() => setShowUnapproveModal(false)}
                />
              )}
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default DatasetForm;
