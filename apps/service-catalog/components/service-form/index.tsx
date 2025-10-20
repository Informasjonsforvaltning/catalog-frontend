'use client';

import { Alert, Box, Checkbox, Paragraph, Spinner, Textfield } from '@digdir/designsystemet-react';
import {
  Button,
  ConfirmModal,
  FieldsetDivider,
  FormikAutoSaver,
  FormikLanguageFieldset,
  FormLayout,
  HelpMarkdown,
  NotificationCarousel,
  Select,
  Snackbar,
  SnackbarSeverity,
  StickyFooterBar,
  TextareaWithPrefix,
  TitleWithHelpTextAndTag,
} from '@catalog-frontend/ui';
import { localization, getTranslateText, trimObjectWhitespace, DataStorage, formatISO } from '@catalog-frontend/utils';
import { ReferenceDataCode, Service, ServiceToBeCreated, StorageData } from '@catalog-frontend/types';
import cn from 'classnames';
import styles from './service-form.module.css';
import { useParams, useSearchParams } from 'next/navigation';
import { FastField, Field, Form, Formik, FormikProps } from 'formik';
import { serviceTemplate } from '../basic-service-form/service-template';
import { confirmedServiceSchema, draftServiceSchema } from '../basic-service-form/validation-schema';
import { useEffect, useRef, useState } from 'react';
import { ProducesField } from './components/produces-field';
import { ContactPointSection } from './components/contact-point-section';

interface ServiceFormProps {
  afterSubmit?: () => void;
  autoSaveStorage: DataStorage<StorageData>;
  initialValues: ServiceToBeCreated;
  onCancel?: () => void;
  onSubmit?: (values: Service) => Promise<Service | undefined>;
  showSnackbarSuccessOnInit?: boolean;
  statuses: ReferenceDataCode[];
  type: 'public-services' | 'services';
}

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
      <Paragraph size='sm'>{localization.alert.youHaveUnsavedChanges}</Paragraph>
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

export const ServiceForm = (props: ServiceFormProps) => {
  const { afterSubmit, autoSaveStorage, initialValues, onCancel, onSubmit, showSnackbarSuccessOnInit, statuses, type } =
    props;
  const searchParams = useSearchParams();
  const formikRef = useRef<FormikProps<ServiceToBeCreated>>(null);
  const { catalogId, serviceId } = useParams<{ catalogId: string; serviceId: string }>();
  const restoreOnRender = Boolean(searchParams.get('restore'));

  const [isCanceled, setIsCanceled] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [ignoreRequired, setIgnoreRequired] = useState(true);
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<SnackbarSeverity>('success');
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

  const handleIgnoreRequiredChange = (newValue: boolean) => {
    if (newValue && 'published' in initialValues && initialValues?.published === true) {
      showSnackbarMessage({
        message: localization.serviceForm.alert.unpublishBeforeIgnoreRequired,
        severity: 'danger',
      });
      // } else if (newValue && formApprovedStatus === true) {
      //   setShowUnapproveModal(true);
    } else {
      setIgnoreRequired(newValue);
    }
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
        initialValues={initialValues}
        validationSchema={ignoreRequired ? draftServiceSchema : confirmedServiceSchema}
        validateOnChange={validateOnChange}
        validateOnBlur={validateOnChange}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          if (onSubmit) {
            try {
              // set produces identifiers
              values.produces?.map((produce, index) => ({
                ...produce,
                identifier: index,
              }));

              const newValues = await onSubmit(trimObjectWhitespace(values));

              showSnackbarMessage({ message: localization.snackbar.saveSuccessful, severity: 'success' });
              if (newValues) {
                resetForm({ values: serviceTemplate(newValues) });
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
        {({ dirty, isValid, isSubmitting, isValidating, submitForm, errors, setValues }) => {
          const notifications = getNotifications({ isValid, hasUnsavedChanges: false });
          const hasError = (fields: (keyof Service)[]) => fields.some((field) => Object.keys(errors).includes(field));
          const handleRestoreDataset = (data: StorageData) => {
            if (data?.id !== serviceId) {
              if (!data?.id) {
                window.location.replace(`/catalogs/${catalogId}/services/new?restore=1`);
                return false;
              }
              window.location.replace(`/catalogs/${catalogId}/services/${data.id}/edit?restore=1`);
              return false;
            }
            const restoreValues = serviceTemplate(data.values);
            setValues(restoreValues);

            showSnackbarMessage({ message: localization.snackbar.restoreSuccessful, severity: 'success' });
            return true;
          };
          return (
            <>
              <Form className='container'>
                <FormikAutoSaver
                  id={serviceId}
                  storage={autoSaveStorage}
                  restoreOnRender={restoreOnRender}
                  onRestore={handleRestoreDataset}
                  confirmMessage={restoreConfirmMessage}
                />
                <FormLayout>
                  <FormLayout.Section
                    id='about-section'
                    title={localization.serviceForm.section.about.title}
                    subtitle={localization.serviceForm.section.about.subtitle}
                    required
                    error={hasError(['title', 'description'])}
                  >
                    <Box>
                      <FormikLanguageFieldset
                        name='title'
                        as={Textfield}
                        legend={
                          <TitleWithHelpTextAndTag
                            helpText={localization.serviceForm.helptext.title}
                            tagTitle={localization.tag.required}
                          >
                            {localization.serviceForm.fieldLabel.title}
                          </TitleWithHelpTextAndTag>
                        }
                      />
                      <FieldsetDivider />
                      <FormikLanguageFieldset
                        as={TextareaWithPrefix}
                        name='description'
                        legend={
                          <TitleWithHelpTextAndTag
                            helpText={localization.serviceForm.helptext.description}
                            tagTitle={localization.tag.required}
                          >
                            {localization.serviceForm.fieldLabel.description}
                          </TitleWithHelpTextAndTag>
                        }
                      />
                      <FieldsetDivider />

                      <FastField
                        as={Textfield}
                        name='homepage'
                        label={
                          <TitleWithHelpTextAndTag
                            helpText={localization.serviceForm.helptext.homepage}
                            tagTitle={localization.tag.required}
                          >
                            {localization.serviceForm.fieldLabel.homepage}
                          </TitleWithHelpTextAndTag>
                        }
                        error={errors?.homepage}
                        size='sm'
                      />
                      <FieldsetDivider />
                      <Field
                        as={Select}
                        label={
                          <TitleWithHelpTextAndTag
                            helpText={localization.serviceForm.helptext.status}
                            tagTitle={localization.tag.required}
                          >
                            {localization.serviceForm.fieldLabel.status}
                          </TitleWithHelpTextAndTag>
                        }
                        name='status'
                      >
                        <option value={undefined}>Ingen status</option>
                        {statuses.map((status) => (
                          <option
                            key={status.code}
                            value={status.uri}
                          >
                            {getTranslateText(status.label)}
                          </option>
                        ))}
                      </Field>
                    </Box>
                  </FormLayout.Section>

                  <FormLayout.Section
                    id='produces-section'
                    title={localization.serviceForm.section.produces.title}
                    subtitle={localization.serviceForm.section.produces.subtitle}
                    required
                    error={hasError(['produces'])}
                  >
                    <ProducesField
                      error={errors.produces}
                      ignoreRequired={ignoreRequired}
                    />
                  </FormLayout.Section>

                  <FormLayout.Section
                    id='contact-point-section'
                    title={localization.serviceForm.section.contactPoint.title}
                    subtitle={localization.serviceForm.section.contactPoint.subtitle}
                    required
                    // changed={markDirty && dirtyFields.some((field) => ['contactPoint'].includes(field))}
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
                  <div className={cn(styles.flex, styles.gap2, styles.noWrap)}>
                    <Checkbox
                      size='sm'
                      value='ignoreRequired'
                      checked={ignoreRequired}
                      onChange={(e) => handleIgnoreRequiredChange(e.target.checked)}
                    >
                      {localization.serviceForm.fieldLabel.ignoreRequired}
                    </Checkbox>
                    <HelpMarkdown aria-label={localization.serviceForm.helptext.ignoreRequired}>
                      {localization.serviceForm.helptext.ignoreRequired}
                    </HelpMarkdown>
                  </div>
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

export default ServiceForm;
