'use client';

import { Dataset, DatasetSeries, PublicationStatus, ReferenceData } from '@catalog-frontend/types';
import { DeleteButton, DetailsPageLayout, LinkButton } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { useState } from 'react';
import styles from './dataset-details-page.module.css';
import { RightColumn } from '../../../../../components/details-page-columns/details-page-right-column';
import { LeftColumn } from '../../../../../components/details-page-columns/details-page-left-column';
import { deleteDataset } from '../../../../actions/actions';
import StatusTag from '../../../../../components/status-tag/index';
import { useRouter } from 'next/navigation';
import { Alert } from '@digdir/designsystemet-react';

interface datasetDetailsPageProps {
  dataset: Dataset;
  catalogId: string;
  datasetId: string;
  hasWritePermission: boolean;
  searchEnv: string;
  referenceDataEnv: string;
  referenceData: ReferenceData;
  datasetSeries: DatasetSeries[];
}

const DatasetDetailsPageClient = ({
  dataset,
  catalogId,
  datasetId,
  hasWritePermission,
  searchEnv,
  referenceDataEnv,
  referenceData,
  datasetSeries,
}: datasetDetailsPageProps) => {
  const [language, setLanguage] = useState('nb');
  const router = useRouter();

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const handleDeleteDataset = async () => {
    if (dataset) {
      if (window.confirm(localization.serviceCatalog.form.confirmDelete)) {
        try {
          await deleteDataset(catalogId, dataset.id);
          window.location.replace(`/catalogs/${catalogId}/datasets`);
        } catch (error) {
          window.alert(error);
        }
      }
    }
  };

  return (
    <DetailsPageLayout
      handleLanguageChange={handleLanguageChange}
      language={language}
      headingTitle={getTranslateText(dataset?.title ?? '', language)}
      headingTag={<StatusTag datasetStatus={dataset.registrationStatus} />}
      loading={false}
    >
      {dataset.specializedType === 'SERIES' ? (
        <DetailsPageLayout.Left>
          <Alert severity={'warning'}>Datasettserier har ikke blitt implementert enda.</Alert>
        </DetailsPageLayout.Left>
      ) : (
        <DetailsPageLayout.Left>
          <LeftColumn
            dataset={dataset}
            referenceDataEnv={referenceDataEnv}
            searchEnv={searchEnv}
            referenceData={referenceData}
            datasetSeries={datasetSeries}
            language={language}
          />
        </DetailsPageLayout.Left>
      )}
      <DetailsPageLayout.Right>
        <RightColumn
          dataset={dataset}
          hasWritePermission={hasWritePermission}
        />
      </DetailsPageLayout.Right>
      <DetailsPageLayout.Buttons>
        {hasWritePermission && (
          <div className={styles.set}>
            {dataset.specializedType !== 'SERIES' && (
              <LinkButton href={`/catalogs/${catalogId}/datasets/${datasetId}/edit`}>
                {localization.button.edit}
              </LinkButton>
            )}

            <DeleteButton
              disabled={dataset.registrationStatus === PublicationStatus.PUBLISH}
              variant='secondary'
              onClick={() => handleDeleteDataset()}
            />
          </div>
        )}
      </DetailsPageLayout.Buttons>
    </DetailsPageLayout>
  );
};

export default DatasetDetailsPageClient;
