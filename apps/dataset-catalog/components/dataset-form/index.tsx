'use client';
import { localization, trimObjectWhitespace } from '@catalog-frontend/utils';
import { Button } from '@digdir/designsystemet-react';
import { Dataset, DatasetToBeCreated, ReferenceData } from '@catalog-frontend/types';
import { FormLayout, useWarnIfUnsavedChanges } from '@catalog-frontend/ui';
import { Formik, Form } from 'formik';
import { useParams } from 'next/navigation';
import { createDataset, deleteDataset, updateDataset } from '../../app/actions/actions';
import { datasetTemplate } from './utils/dataset-initial-values';
import { useState } from 'react';
import { datasetValidationSchema } from './utils/validation-schema';
import { TitleSection } from './components/dataset-from-title-section';
import { AccessRightsSection } from './components/dataset-form-access-rights-section';
import ThemeSection from './components/dataset-form-theme-section';
import { TypeSection } from './components/dataset-form-type-section';
import { ConceptSection } from './components/dataset-form-concept-section';
import { ProvenanceSection } from './components/dataset-form-provenance-section';
import { ContentSection } from './components/dataset-form-content-section';
import { GeographySection } from './components/dataset-form-geography-section';
import { InformationModelSection } from './components/dataset-form-information-model-section';

type Props = {
  initialValues: DatasetToBeCreated | Dataset;
  submitType: 'create' | 'update';
  searchEnv: string; // Environment variable to search service
  referenceDataEnv: string; // Environment variable to reference data
  referenceData: ReferenceData;
};

export const DatasetForm = ({ initialValues, submitType, referenceData, searchEnv, referenceDataEnv }: Props) => {
  const { catalogId, datasetId } = useParams();
  const [isDirty, setIsDirty] = useState(false);
  const { losThemes, dataThemes, provenanceStatements, datasetTypes, frequencies, languages } = referenceData;

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
                <AccessRightsSection
                  values={values}
                  errors={errors}
                />
                <ThemeSection
                  losThemes={losThemes}
                  dataThemes={dataThemes}
                />
                <TypeSection datasetTypes={datasetTypes} />
                <ConceptSection searchEnv={searchEnv} />
                <GeographySection
                  envVariable={referenceDataEnv}
                  languages={languages}
                />
                <ProvenanceSection data={{ provenanceStatements, frequencies }} />
                <ContentSection />
                <InformationModelSection searchEnv={searchEnv} />
              </div>
            </FormLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default DatasetForm;
