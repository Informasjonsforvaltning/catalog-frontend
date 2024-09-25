'use client';
import { localization, trimObjectWhitespace } from '@catalog-frontend/utils';
import { Button, Heading, Radio } from '@digdir/designsystemet-react';
import { AccessRights, Dataset, DatasetToBeCreated } from '@catalog-frontend/types';
import { FormLayout, FormContainer, TitleWithTag, useWarnIfUnsavedChanges } from '@catalog-frontend/ui';
import { Formik, Form, Field } from 'formik';
import { useParams } from 'next/navigation';
import { createDataset, deleteDataset, updateDataset } from '../../app/actions/actions';
import { datasetTemplate } from './dataset-initial-values';
import { useState } from 'react';
import { datasetValidationSchema } from './validation-schema';
import { TitleSection } from './dataset-from-title-section';

type Props = {
  initialValues: DatasetToBeCreated | Dataset;
  submitType: 'create' | 'update';
};

export const DatasetForm = ({ initialValues, submitType }: Props) => {
  const { catalogId, datasetId } = useParams();
  const [isDirty, setIsDirty] = useState(false);

  useWarnIfUnsavedChanges({ unsavedChanges: isDirty });

  const handleCreate = (values: DatasetToBeCreated) => {
    createDataset(values, catalogId.toString());
  };

  const handleUpdate = async (values: Dataset) => {
    if ('id' in initialValues) {
      try {
        await updateDataset(catalogId.toString(), initialValues, values);
      } catch (error) {
        window.alert(`${localization.alert.updateFailed} ${error}`);
      }
    } else {
      handleCreate(values);
    }
  };

  const handleDelete = () => {
    if (window.confirm(localization.datasetForm.alert.confirmDelete)) {
      try {
        deleteDataset(catalogId.toString(), datasetId.toString());
      } catch (error) {
        window.alert(localization.alert.deleteFailed);
      }
    }
  };

  return (
    <Formik
      initialValues={datasetTemplate(initialValues as Dataset)}
      validationSchema={datasetValidationSchema}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={(values, { setSubmitting }) => {
        const trimmedValues = trimObjectWhitespace(values);
        submitType === 'create' ? handleCreate(trimmedValues) : handleUpdate(trimmedValues as Dataset);
        setSubmitting(false);
      }}
    >
      {({ errors, values, dirty, handleSubmit, isValid }) => {
        setTimeout(() => setIsDirty(dirty), 0);

        return (
          <Form
            onSubmit={(e) => {
              if (!isValid) {
                e.preventDefault();
                window.alert(localization.datasetForm.alert.formError);
              } else {
                handleSubmit(e);
              }
            }}
          >
            <FormLayout>
              <FormLayout.ButtonsRow>
                <Button type='submit'>{localization.button.save}</Button>
                <Button
                  variant='secondary'
                  color='danger'
                  onClick={handleDelete}
                >
                  {localization.button.delete}
                </Button>
              </FormLayout.ButtonsRow>
              <div>
                <TitleSection errors={errors} />
                <div>
                  <Heading size='sm'>Tilgangsnivå</Heading>
                  <FormContainer>
                    <FormContainer.Header
                      title={localization.datasetForm.accessRights}
                      subtitle={localization.datasetForm.helptext.accessRights}
                    />
                    <Field
                      as={Radio.Group}
                      name='accessRights.uri'
                      size='md'
                      legend={
                        <TitleWithTag
                          title={localization.datasetForm.accessRights}
                          tagColor='third'
                          tagTitle={localization.tag.recommended}
                        />
                      }
                    >
                      <Radio value={AccessRights.PUBLIC}>{localization.datasetForm.accessRight.public}</Radio>
                      <Radio value={AccessRights.RESTRICTED}>{localization.datasetForm.accessRight.restricted}</Radio>
                      <Radio value={AccessRights.NON_PUBLIC}>{localization.datasetForm.accessRight.nonPublic}</Radio>
                    </Field>
                  </FormContainer>
                </div>
              </div>
            </FormLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default DatasetForm;
