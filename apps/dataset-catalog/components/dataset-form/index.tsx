'use client';
import {
  CatalogLocalStorage,
  formatISO,
  getTranslateText,
  localization,
  trimObjectWhitespace,
} from '@catalog-frontend/utils';
import { Alert, Button, Paragraph, Spinner, Switch } from '@digdir/designsystemet-react';
import { Dataset, DatasetToBeCreated, ReferenceData, PublicationStatus } from '@catalog-frontend/types';
import {
  FormikAutoSaver,
  FormikAutoSaverRef,
  FormLayout,
  HelpMarkdown,
  NotificationCarousel,
  StickyFooterBar,
  StorageData,
  useWarnIfUnsavedChanges,
} from '@catalog-frontend/ui';
import { Formik, Form, FormikProps } from 'formik';
import { useParams, useSearchParams } from 'next/navigation';
import { createDataset, updateDataset } from '../../app/actions/actions';
import { datasetTemplate } from './utils/dataset-initial-values';
import { useRef, useState } from 'react';
import { confirmedDatasetSchema, draftDatasetSchema } from './utils/validation-schema';
import { AboutSection } from './components/about-section';
import ThemeSection from './components/theme-section';
import { ConceptSection } from './components/concept-section';
import { InformationModelSection } from './components/information-model-section';
import { RelationsSection } from './components/relations-section/relations-section';
import { DistributionSection } from './components/distribution-section/distribution-section';
import { ContactPointSection } from './components/contact-point-section';
import styles from './dataset-form.module.css';
import { useRouter } from 'next/navigation';
import { DetailsSection } from './components/details-section/details-section';

type Props = {
  initialValues: DatasetToBeCreated | Dataset;
  submitType: 'create' | 'update';
  searchEnv: string; // Environment variable to search service
  referenceDataEnv: string; // Environment variable to reference data
  referenceData: ReferenceData;
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
        {localization.conceptForm.alert.wantToRestoreChanges}
      </Paragraph>
    </>
  );
};

export const DatasetForm = ({ initialValues, referenceData, searchEnv, referenceDataEnv }: Props) => {
  const { catalogId, datasetId } = useParams();

  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const { losThemes, dataThemes, openLicenses } = referenceData;
  const router = useRouter();
  const [formStatus, setFormStatus] = useState(initialValues?.registrationStatus);

  const searchParams = useSearchParams();
  const formikRef = useRef<FormikProps<Dataset>>(null);
  const autoSaveRef = useRef<FormikAutoSaverRef>(null);
  const restoreOnRender = Boolean(searchParams.get('restore'));

  useWarnIfUnsavedChanges({ unsavedChanges: isDirty });

  const handleCreate = async (values: DatasetToBeCreated) => {
    if (!catalogId) return;
    try {
      const datasetId = await createDataset(values, catalogId.toString());

      if (datasetId) {
        router.push(`/catalogs/${catalogId}/datasets/${datasetId}`);
      } else {
        window.alert(`${localization.alert.fail}`);
      }
    } catch (error) {
      window.alert(`${localization.alert.fail} ${error}`);
    }
  };

  const handleUpdate = async (values: Dataset) => {
    if (catalogId && 'id' in initialValues) {
      try {
        await updateDataset(catalogId.toString(), initialValues, values);
        router.push(`/catalogs/${catalogId}/datasets/${initialValues.id}`);
      } catch (error) {
        window.alert(`${localization.alert.updateFailed} ${error}`);
      }
    } else {
      handleCreate(values);
    }
  };

  const handleSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (fieldName: string, value: string) => void,
  ) => {
    const isChecked = event.target.checked;
    const status = isChecked ? PublicationStatus.APPROVE : PublicationStatus.DRAFT;
    setFormStatus(status);
    setFieldValue('registrationStatus', status);
  };

  const handleCancel = () => {
    // Discard autostored data
    autoSaveRef.current?.discard();

    setIsCanceled(true);
    router.push(datasetId ? `/catalogs/${catalogId}/datasets/${datasetId}` : `/catalogs/${catalogId}/datasets`);
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

  return (
    <>
      <Formik
        innerRef={formikRef}
        initialValues={datasetTemplate(initialValues as Dataset)}
        validationSchema={formStatus !== PublicationStatus.DRAFT ? confirmedDatasetSchema : draftDatasetSchema}
        validateOnChange={isSubmitted}
        validateOnBlur={isSubmitted}
        onSubmit={async (values, { setSubmitting }) => {
          const trimmedValues = trimObjectWhitespace(values);
          datasetId === null ? handleCreate(trimmedValues as Dataset) : await handleUpdate(trimmedValues as Dataset);
          setSubmitting(false);
          setIsSubmitted(true);
          autoSaveRef.current?.discard();
        }}
      >
        {({ setFieldValue, values, dirty, isValid, isSubmitting, isValidating, submitForm, errors, setValues }) => {
          setTimeout(() => setIsDirty(dirty), 0);
          const notifications = getNotifications({ isValid, hasUnsavedChanges: false });
          const hasError = (fields: (keyof Dataset)[]) => fields.some((field) => Object.keys(errors).includes(field));
          const handleRestoreDataset = (data: StorageData) => {
            if (data?.values?.id !== datasetId) {
              if (!data?.values?.id) {
                return router.push(`/catalogs/${catalogId}/datasets/new?restore=1`);
              }
              return router.push(`/catalogs/${catalogId}/datasets/${data.values.id}/edit?restore=1`);
            }
            setValues(data.values);
          };

          return (
            <>
              <Form
                className='container'
                onSubmit={(e) => {
                  if (!isValid) {
                    e.preventDefault();
                    window.alert(localization.datasetForm.alert.formError);
                  } else {
                    submitForm();
                    autoSaveRef.current?.discard();
                  }
                }}
              >
                <FormikAutoSaver
                  ref={autoSaveRef}
                  storage={new CatalogLocalStorage<StorageData>({ key: 'datasetForm' })}
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
                    error={hasError(['title'])}
                  >
                    <AboutSection />
                  </FormLayout.Section>

                  <FormLayout.Section
                    id='tema-section'
                    title={localization.datasetForm.heading.theme}
                    subtitle={localization.datasetForm.subtitle.theme}
                    required
                    error={hasError(['euDataTheme'])}
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
                  >
                    <DistributionSection
                      referenceDataEnv={referenceDataEnv}
                      searchEnv={searchEnv}
                      openLicenses={openLicenses}
                    />
                  </FormLayout.Section>

                  <FormLayout.Section
                    id='details-section'
                    title={localization.datasetForm.heading.details}
                    subtitle={localization.datasetForm.subtitle.details}
                    error={hasError(['landingPage'])}
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
                  >
                    <RelationsSection searchEnv={searchEnv} />
                  </FormLayout.Section>

                  <FormLayout.Section
                    id='concept-section'
                    title={localization.datasetForm.heading.concept}
                    subtitle={localization.datasetForm.subtitle.concept}
                  >
                    <ConceptSection searchEnv={searchEnv} />
                  </FormLayout.Section>

                  <FormLayout.Section
                    id='information-model-section'
                    title={localization.datasetForm.heading.informationModel}
                    subtitle={localization.datasetForm.subtitle.informationModel}
                  >
                    <InformationModelSection searchEnv={searchEnv} />
                  </FormLayout.Section>

                  <FormLayout.Section
                    id='contact-point-section'
                    title={localization.datasetForm.heading.contactPoint}
                    subtitle={localization.datasetForm.subtitle.contactPoint}
                    required
                    error={hasError(['contactPoint'])}
                  >
                    <ContactPointSection />
                  </FormLayout.Section>
                </FormLayout>
              </Form>

              <StickyFooterBar>
                <div className={styles.footerContent}>
                  <Button
                    type='submit'
                    size='sm'
                    disabled={isSubmitting || isValidating || isCanceled || !dirty}
                    onClick={() => {
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
                    onClick={() => handleCancel()}
                  >
                    {localization.button.cancel}
                  </Button>
                  <div className={styles.verticalLine}></div>
                  <Switch
                    position='left'
                    size='sm'
                    checked={values.registrationStatus !== PublicationStatus.DRAFT}
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
                </div>
                {notifications.length > 0 && <NotificationCarousel notifications={notifications} />}
              </StickyFooterBar>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default DatasetForm;
