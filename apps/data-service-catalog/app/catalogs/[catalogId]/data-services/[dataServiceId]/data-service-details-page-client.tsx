'use client';

import { DataService, DataServiceReferenceData } from '@catalog-frontend/types';
import { DataServiceStatusTagProps, DeleteButton, DetailsPageLayout, LinkButton, Tag } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import React, { useState } from 'react';
import { deleteDataService } from '../../../../actions/actions';
import styles from './data-service-details-page.module.css';

interface dataServiceDetailsPageProps {
  dataService: DataService;
  catalogId: string;
  dataServiceId: string;
  referenceData: DataServiceReferenceData;
}

const DataServiceDetailsPageClient = ({
  dataService,
  catalogId,
  dataServiceId,
  referenceData,
}: dataServiceDetailsPageProps) => {
  const [language, setLanguage] = useState('nb');

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const handleDeleteDataService = async () => {
    if (dataService) {
      if (window.confirm(localization.serviceCatalog.form.confirmDelete)) {
        try {
          await deleteDataService(catalogId, dataService.id);
        } catch (error) {
          window.alert(error);
        }
      }
    }
  };

  const findDistributionStatus = (statusURI) => referenceData.distributionStatuses?.find((s) => s.uri === statusURI);

  return (
    <DetailsPageLayout
      handleLanguageChange={handleLanguageChange}
      language={language}
      headingTitle={getTranslateText(dataService?.title, language)}
      headingTag={
        dataService.status && (
          <Tag.DataServiceStatus
            statusKey={findDistributionStatus(dataService.status)?.code as DataServiceStatusTagProps['statusKey']}
            statusLabel={getTranslateText(findDistributionStatus(dataService.status)?.label, language) as string}
          />
        )
      }
      loading={false}
    >
      <DetailsPageLayout.Buttons>
        <div className={styles.set}>
          <LinkButton href={`/catalogs/${catalogId}/data-services/${dataServiceId}/edit`}>
            {localization.button.edit}
          </LinkButton>

          <DeleteButton
            disabled={dataService.published}
            variant='secondary'
            onClick={() => handleDeleteDataService()}
          />
        </div>
      </DetailsPageLayout.Buttons>
    </DetailsPageLayout>
  );
};

export default DataServiceDetailsPageClient;
