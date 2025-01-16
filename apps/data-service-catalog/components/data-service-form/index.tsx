'use client';
import { localization, trimObjectWhitespace } from '@catalog-frontend/utils';
import { DataService, DataServiceToBeCreated } from '@catalog-frontend/types';
import { FormLayout, StickyFooterBar, useWarnIfUnsavedChanges } from '@catalog-frontend/ui';
import { Formik, Form } from 'formik';
import { useState } from 'react';
import { TitleSection } from './components/title-section';
import { useParams, useRouter } from 'next/navigation';
import { createDataService, updateDataService } from '../../app/actions/actions';
import { Button } from '@digdir/designsystemet-react';
import styles from './data-service-form.module.css';
import { EndpointSection } from './components/endpoint-section';

type Props = {
  initialValues: DataService | DataServiceToBeCreated;
  submitType: 'create' | 'update';
};

export const DataServiceForm = ({ initialValues, submitType }: Props) => {
  const { catalogId, dataServiceId } = useParams();
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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
      onSubmit={async (values, { setSubmitting }) => {
        await handleSubmit(trimObjectWhitespace(values) as DataService);
        setSubmitting(false);
        setIsSubmitted(true);
      }}
    >
      {({ dirty, isSubmitting, isValidating, submitForm }) => {
        setTimeout(() => setIsDirty(dirty), 0);
        return (
          <>
            <Form className='container'>
              <FormLayout>
                <FormLayout.Section
                  id='title-section'
                  title={localization.dataServiceForm.heading.titleAndDescription}
                  required
                >
                  <TitleSection />
                </FormLayout.Section>
                <FormLayout.Section
                  id='endpoint-section'
                  title={localization.dataServiceForm.heading.endpoint}
                  required
                >
                  <EndpointSection />
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
