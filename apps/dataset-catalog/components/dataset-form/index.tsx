'use client';

import { localization } from '@catalog-frontend/utils';
import { Button, Radio, Textarea, Textfield } from '@digdir/designsystemet-react';
import { AccessRights, Dataset, DatasetToBeCreated } from '@catalog-frontend/types';
import { FormLayout, FormContainer, TitleWithTag } from '@catalog-frontend/ui';
import { Formik, Form, Field } from 'formik';
import { useParams } from 'next/navigation';
import { createDataset, deleteDataset, updateDataset } from '../../app/actions/actions';
import { datasetTemplate } from './dataset-initial-values';

type Props = {
  initialValues: DatasetToBeCreated | Dataset;
  submitType: 'create' | 'update';
};

export const DatasetForm = ({ initialValues, submitType }: Props) => {
  const { catalogId, datasetId } = useParams();

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
    if (window.confirm(localization.datasetFormNb.alert.confirmDelete)) {
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
      onSubmit={
        submitType === 'create' ? (values) => handleCreate(values) : (values) => handleUpdate(values as Dataset)
      }
    >
      {({ errors, values, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
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

            <FormContainer>
              <FormContainer.Header
                title={localization.title}
                subtitle={localization.datasetFormNb.helptext.title}
              />

              <Field
                as={Textfield}
                name='title.nb'
                label={
                  <TitleWithTag
                    title={localization.datasetFormNb.fieldLabel.title}
                    tagTitle={localization.tag.required}
                  />
                }
              />
              <FormContainer.Header
                title={localization.datasetFormNb.heading.description}
                subtitle={localization.datasetFormNb.helptext.description}
              />
              <Field
                as={Textarea}
                name='description.nb'
                label={
                  <TitleWithTag
                    title={localization.datasetFormNb.fieldLabel.description}
                    tagTitle={localization.tag.required}
                  />
                }
              />

              <FormContainer.Header
                title={localization.datasetFormNb.accessRights}
                subtitle={localization.datasetFormNb.helptext.accessRights}
              />
              <Field
                as={Radio.Group}
                name='accessRights.uri'
                size='md'
                legend={
                  <TitleWithTag
                    title={localization.datasetFormNb.accessRights}
                    tagColor='third'
                    tagTitle={localization.tag.recommended}
                  />
                }
              >
                <Radio value={AccessRights.PUBLIC}>{localization.datasetFormNb.accessRight.public}</Radio>
                <Radio value={AccessRights.RESTRICTED}>{localization.datasetFormNb.accessRight.restricted}</Radio>
                <Radio value={AccessRights.NON_PUBLIC}>{localization.datasetFormNb.accessRight.nonPublic}</Radio>
              </Field>
            </FormContainer>
          </FormLayout>
        </Form>
      )}
    </Formik>
  );
};

export default DatasetForm;
