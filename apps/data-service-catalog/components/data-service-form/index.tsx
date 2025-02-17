'use client';
import { localization, trimObjectWhitespace } from '@catalog-frontend/utils';
import { DataService, DataServiceReferenceData, DataServiceToBeCreated } from '@catalog-frontend/types';
import { FormLayout, StickyFooterBar, useWarnIfUnsavedChanges } from '@catalog-frontend/ui';
import { Formik, Form } from 'formik';
import { useState } from 'react';
import { AboutSection } from './components/about-section';
import { useParams, useRouter } from 'next/navigation';
import { createDataService, updateDataService } from '../../app/actions/actions';
import { Button } from '@digdir/designsystemet-react';
import styles from './data-service-form.module.css';
import { EndpointSection } from './components/endpoint-section';
import { ContactPointSection } from './components/contact-point-section';
import { FormatSection } from './components/format-section';
import { DocumentationSection } from './components/documentation-section';
import { AccessSection } from './components/access-section';
import { DatasetSection } from './components/dataset-section';
import { StatusSection } from './components/status-section';
import { dataServiceValidationSchema } from './utils/validation-schema';

type Props = {
  initialValues: DataService | DataServiceToBeCreated;
  submitType: 'create' | 'update';
  searchEnv: string; // Environment variable to search service
  referenceData: DataServiceReferenceData;
  referenceDataEnv: string; // Environment variable to reference data
};

const DataServiceForm = ({ initialValues, submitType, searchEnv, referenceData, referenceDataEnv }: Props) => {
  const { catalogId, dataServiceId } = useParams();
  const [isDirty, setIsDirty] = useState(false);
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const router = useRouter();

  useWarnIfUnsavedChanges({ unsavedChanges: isDirty });

  const handleCreate = async (values: DataService) => {
    await createDataService(catalogId.toString(), values);
  };

  const handleUpdate = async (values: DataService) => {
    try {
      if ('id' in initialValues) {
        await updateDataService(catalogId.toString(), initialValues, values);
      } else {
        window.alert(`${localization.alert.updateFailed}`);
      }
    } catch (error) {
      window.alert(`${localization.alert.updateFailed} ${error}`);
    }
  };

  const handleCancel = () => {
    setIsCanceled(true);
    router.push(
      dataServiceId ? `/catalogs/${catalogId}/data-services/${dataServiceId}` : `/catalogs/${catalogId}/data-services`,
    );
  };

  const handleSubmit = async (values: DataService) => {
    if (submitType === 'create') {
      await handleCreate(values);
    } else {
      await handleUpdate(values);
    }
  };

  return (
    <Formik
      initialValues={initialValues as DataService}
      validationSchema={dataServiceValidationSchema}
      validateOnChange={validateOnChange}
      validateOnBlur={validateOnChange}
      onSubmit={async (values: DataService, { setSubmitting }) => {
        await handleSubmit(trimObjectWhitespace(values) as DataService);
        setSubmitting(false);
      }}
    >
      {({ errors, dirty, isSubmitting, isValidating, submitForm }) => {
        setTimeout(() => setIsDirty(dirty), 0);
        const hasError = (fields: (keyof DataService)[]) => fields.some((field) => Object.keys(errors).includes(field));

        return (
          <>
            <Form className='container'>
              <FormLayout>
                <FormLayout.Section
                  id='about-section'
                  title={localization.dataServiceForm.heading.about}
                  required
                  error={hasError(['title'])}
                >
                  <AboutSection />
                </FormLayout.Section>

                <FormLayout.Section
                  id='endpoint-section'
                  title={localization.dataServiceForm.heading.endpoint}
                  required
                  error={hasError(['endpointUrl', 'endpointDescriptions'])}
                >
                  <EndpointSection />
                </FormLayout.Section>

                <FormLayout.Section
                  id='documentation-section'
                  title={localization.dataServiceForm.heading.documentation}
                  error={hasError(['landingPage', 'pages'])}
                >
                  <DocumentationSection />
                </FormLayout.Section>

                <FormLayout.Section
                  id='access-section'
                  title={localization.dataServiceForm.heading.access}
                >
                  <AccessSection
                    openLicenses={referenceData.openLicenses}
                    currencies={referenceData.currencies}
                  />
                </FormLayout.Section>

                <FormLayout.Section
                  id='status-section'
                  title={localization.dataServiceForm.heading.status}
                >
                  <StatusSection
                    statuses={referenceData.distributionStatuses}
                    availabilities={referenceData.plannedAvailabilities}
                  />
                </FormLayout.Section>

                <FormLayout.Section
                  id='format-section'
                  title={localization.dataServiceForm.heading.format}
                >
                  <FormatSection referenceDataEnv={referenceDataEnv} />
                </FormLayout.Section>

                <FormLayout.Section
                  id='dataset-section'
                  title={localization.dataServiceForm.heading.dataset}
                >
                  <DatasetSection searchEnv={searchEnv} />
                </FormLayout.Section>

                <FormLayout.Section
                  id='contact-point-section'
                  title={localization.dataServiceForm.heading.contactPoint}
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
                    setValidateOnChange(true);
                    submitForm();
                  }}
                >
                  {localization.save}
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
              </div>
            </StickyFooterBar>
          </>
        );
      }}
    </Formik>
  );
};

export default DataServiceForm;
