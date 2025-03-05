'use client';

import { DataService, DataServiceReferenceData } from '@catalog-frontend/types';
import { DeleteButton, DetailsPageLayout, LinkButton } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import React, { useState } from 'react';
import { deleteDataService } from '../../../../actions/actions';
import styles from './data-service-details-page.module.css';
import StatusTag from '../../../../../components/status-tag';
import { LeftColumn } from '../../../../../components/details-page-columns/details-page-left-column';
import { RightColumn } from '../../../../../components/details-page-columns/details-page-right-column';

interface dataServiceDetailsPageProps {
  dataService: DataService;
  catalogId: string;
  dataServiceId: string;
  hasWritePermission: boolean;
  isValid: boolean;
  referenceData: DataServiceReferenceData;
  referenceDataEnv: string;
  searchEnv: string;
}

const DataServiceDetailsPageClient = ({
  dataService,
  catalogId,
  dataServiceId,
  hasWritePermission,
  isValid,
  referenceData,
  referenceDataEnv,
  searchEnv,
}: dataServiceDetailsPageProps) => {
  const [language, setLanguage] = useState('nb');

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const handleDeleteDataService = async () => {
    if (dataService) {
      if (window.confirm(localization.serviceCatalog.form.confirmDelete)) {
        try {
          await deleteDataService(catalogId, dataService?.id);
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
      headingTitle={getTranslateText(dataService?.title, language)}
      headingTag={
        <StatusTag
          dataServiceStatus={dataService?.status}
          distributionStatuses={referenceData.distributionStatuses}
          language={language}
        />
      }
      loading={false}
    >
      <DetailsPageLayout.Buttons>
        {hasWritePermission && (
          <div className={styles.set}>
            <LinkButton href={`/catalogs/${catalogId}/data-services/${dataServiceId}/edit`}>
              {localization.button.edit}
            </LinkButton>

            <DeleteButton
              disabled={dataService?.published}
              variant='secondary'
              onClick={() => handleDeleteDataService()}
            />
          </div>
        )}
      </DetailsPageLayout.Buttons>
      <DetailsPageLayout.Left>
        <LeftColumn
          dataService={dataService}
          referenceData={referenceData}
          language={language}
          referenceDataEnv={referenceDataEnv}
          searchEnv={searchEnv}
        />
      </DetailsPageLayout.Left>
      <DetailsPageLayout.Right>
        <RightColumn
          catalogId={catalogId}
          dataService={dataService}
          referenceData={referenceData}
          language={language}
          hasWritePermission={hasWritePermission}
          isValid={isValid}
        />
      </DetailsPageLayout.Right>
    </DetailsPageLayout>
  );
};

export default DataServiceDetailsPageClient;
