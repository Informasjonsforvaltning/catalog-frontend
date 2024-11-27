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
import { QualifiedAttributionsSection } from './components/dataset-form-qualified-attributions-section';
import { ExampleDataSection } from './components/dataset-form-example-data-section';

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
              <FormLayout.Section
                title='save'
                id='save'
              >
                <Button type='submit'>{localization.button.save}</Button>
                <Button
                  variant='secondary'
                  color='danger'
                  onClick={handleDelete}
                >
                  {localization.button.delete}
                </Button>
              </FormLayout.Section>

              <FormLayout.Section
                id='title-section'
                title={localization.datasetForm.heading.titleAndDescription}
                required
              >
                <TitleSection />
              </FormLayout.Section>

              <FormLayout.Section
                id='access-right-section'
                title={localization.datasetForm.heading.accessRights}
              >
                <AccessRightsSection
                  values={values}
                  errors={errors}
                />
              </FormLayout.Section>

              <FormLayout.Section
                id='tema-section'
                title={localization.datasetForm.heading.losTheme}
                subtitle=''
                required
              >
                <ThemeSection
                  losThemes={losThemes}
                  dataThemes={dataThemes}
                />
              </FormLayout.Section>

              <FormLayout.Section
                id='type-section'
                title={localization.datasetForm.heading.type}
              >
                <TypeSection datasetTypes={datasetTypes} />
              </FormLayout.Section>

              <FormLayout.Section
                id='concept-section'
                title={localization.datasetForm.heading.concept}
                subtitle=''
              >
                <ConceptSection searchEnv={searchEnv} />
              </FormLayout.Section>

              <FormLayout.Section
                id='geography-section'
                title={localization.datasetForm.heading.geography}
                subtitle=''
              >
                <GeographySection
                  envVariable={referenceDataEnv}
                  languages={languages}
                />
              </FormLayout.Section>
              <FormLayout.Section
                id='provenance-section'
                title={localization.datasetForm.heading.provenanceAndFrequency}
                subtitle=''
              >
                <ProvenanceSection data={{ provenanceStatements, frequencies }} />
              </FormLayout.Section>

              <FormLayout.Section
                id='content-section'
                title={localization.datasetForm.heading.content}
                subtitle=''
              >
                <ContentSection />
              </FormLayout.Section>

              <FormLayout.Section
                id='information-model-section'
                title={localization.datasetForm.heading.informationModel}
                subtitle=''
              >
                <InformationModelSection searchEnv={searchEnv} />
              </FormLayout.Section>

              <FormLayout.Section
                id='qualified-attributions-section'
                title={localization.datasetForm.heading.qualifiedAttributions}
                subtitle=''
              >
                <QualifiedAttributionsSection />
              </FormLayout.Section>

              <FormLayout.Section
                id='example-data-section'
                title={localization.datasetForm.heading.exampleData}
              >
                <ExampleDataSection referenceDataEnv={referenceDataEnv} />
              </FormLayout.Section>
            </FormLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default DatasetForm;
