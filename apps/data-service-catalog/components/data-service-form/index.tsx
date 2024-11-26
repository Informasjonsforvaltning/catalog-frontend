'use client';
import { localization } from '@catalog-frontend/utils';
import { Button } from '@digdir/designsystemet-react';
import { DataService } from '@catalog-frontend/types';
import { FormLayout, useWarnIfUnsavedChanges } from '@catalog-frontend/ui';
import { Formik, Form } from 'formik';
import { useState } from 'react';
import { TitleSection } from './components/data-service-form-title-section';
import { useParams } from 'next/navigation';
import { deleteDataService } from '../../app/actions/actions';

type Props = {
  initialValues: DataService;
};

export const DataServiceForm = ({ initialValues }: Props) => {
  const { catalogId, dataServiceId } = useParams();
  const [isDirty, setIsDirty] = useState(false);

  useWarnIfUnsavedChanges({ unsavedChanges: isDirty });

  const handleDelete = () => {
    if (window.confirm(localization.dataServiceForm.alert.confirmDelete)) {
      try {
        deleteDataService(catalogId.toString(), dataServiceId.toString());
      } catch (error) {
        window.alert(localization.alert.deleteFailed);
      }
    }
  };

  return (
    <Formik
      initialValues={initialValues as DataService}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false);
      }}
    >
      {({ errors, dirty, handleSubmit }) => {
        setTimeout(() => setIsDirty(dirty), 0);
        return (
          <Form onSubmit={handleSubmit}>
            <FormLayout>
              {/* <FormLayout.ButtonsRow>
                <Button type='submit'>{localization.button.save}</Button>
                <Button
                  variant='secondary'
                  color='danger'
                  onClick={handleDelete}
                >
                  {localization.button.delete}
                </Button>
              </FormLayout.ButtonsRow> */}
              <div>
                <TitleSection errors={errors} />
              </div>
            </FormLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default DataServiceForm;
