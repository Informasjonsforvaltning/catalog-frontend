'use client';
import { localization, trimObjectWhitespace } from '@catalog-frontend/utils';
import { Alert, Button, Switch } from '@digdir/designsystemet-react';
import { Dataset, DatasetSeries, DatasetToBeCreated, ReferenceData, PublicationStatus } from '@catalog-frontend/types';
import {
  FormLayout,
  HelpMarkdown,
  NotificationCarousel,
  StickyFooterBar,
  useWarnIfUnsavedChanges,
} from '@catalog-frontend/ui';
import { Formik, Form } from 'formik';
import { useParams } from 'next/navigation';
import { createDataset, updateDataset } from './../../app/actions/actions';
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
import { RelationsSection } from './components/dataset-form-relations-section';
import { DistributionSection } from './components/dataset-from-distribution/dataset-form-distribution-section';
import styles from './dataset-form.module.css';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';

type Props = {
  initialValues: DatasetToBeCreated | Dataset;
  submitType: 'create' | 'update';
  searchEnv: string; // Environment variable to search service
  referenceDataEnv: string; // Environment variable to reference data
  referenceData: ReferenceData;
  datasetSeries: DatasetSeries[];
};

export const DatasetForm = ({
  initialValues,
  submitType,
  referenceData,
  searchEnv,
  referenceDataEnv,
  datasetSeries,
}: Props) => {
  const { catalogId, datasetId } = useParams();
  const [isDirty, setIsDirty] = useState(false);
  const { losThemes, dataThemes, provenanceStatements, datasetTypes, frequencies, languages, openLicenses } =
    referenceData;

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

  const router = useRouter();

  const handleCancel = () => {
    router.push(datasetId ? `/catalogs/${catalogId}/datasets/${datasetId}` : `/catalogs/${catalogId}/datasets`);
  };

  const notifications = [
    <Alert
      key={1}
      size='sm'
      severity='warning'
    >
      Du har ulagrede endringer
    </Alert>,
    <Alert
      key={2}
      size='sm'
      severity='info'
    >
      Du har en annen info melding
    </Alert>,
  ];

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
      {({ errors, values, dirty, handleSubmit, isValid, setFieldValue }) => {
        setTimeout(() => setIsDirty(dirty), 0);

        return (
          <>
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
                <FormLayout.Section
                  id='relation-section'
                  title={localization.datasetForm.heading.relations}
                >
                  <RelationsSection
                    searchEnv={searchEnv}
                    datasetSeries={datasetSeries}
                  />
                </FormLayout.Section>
                <FormLayout.Section
                  id='distribution-section'
                  title={localization.datasetForm.heading.distribution}
                >
                  <DistributionSection
                    referenceDataEnv={referenceDataEnv}
                    searchEnv={searchEnv}
                    openLicenses={openLicenses}
                  />
                </FormLayout.Section>
              </FormLayout>
            </Form>

            <StickyFooterBar>
              <div className={classNames(styles.StickyFooterBar, styles.footerContainer)}>
                <NotificationCarousel notifications={notifications} />

                <div className={styles.buttonContainer}>
                  <Switch
                    position='left'
                    size='sm'
                    checked={values.registrationStatus === PublicationStatus.APPROVE}
                    onChange={(event) => {
                      const isChecked = event.target.checked;
                      const status = isChecked ? PublicationStatus.APPROVE : PublicationStatus.DRAFT;
                      setFieldValue('registrationStatus', status);
                    }}
                  >
                    <div className={styles.buttonContainer}>
                      Godkjent
                      <HelpMarkdown
                        size='sm'
                        title={'Registeringsstatus'}
                      >
                        Toggelen bestemmer om begrepsbeskrivelsen blir lagret med status “Godkjent” eller som et
                        “Utkast”. Husk å lagre skjemaet for å oppdatere status.
                      </HelpMarkdown>
                    </div>
                  </Switch>
                  <Button
                    type='submit'
                    size='sm'
                    disabled={!isDirty}
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    {localization.save}
                  </Button>

                  <Button
                    type='button'
                    size='sm'
                    variant='secondary'
                    onClick={() => {
                      setIsDirty(false);
                      handleCancel();
                    }}
                  >
                    Avbryt
                  </Button>
                </div>
              </div>
            </StickyFooterBar>
          </>
        );
      }}
    </Formik>
  );
};

export default DatasetForm;
