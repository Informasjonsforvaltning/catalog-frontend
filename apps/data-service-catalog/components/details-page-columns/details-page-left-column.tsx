import { DataService, DataServiceReferenceData } from '@catalog-frontend/types';
import styles from './details-columns.module.css';
import { InfoCard } from '@catalog-frontend/ui';
import { isEmpty } from 'lodash';
import { accessRights, getTranslateText, localization } from '@catalog-frontend/utils';
import { Paragraph, Tag } from '@digdir/designsystemet-react';
import { DetailsUrlList } from './components/details-url-list';
import { ReferenceDataTag } from './components/reference-data-tag';
import { FormatList } from './components/format-list';
import { DatasetList } from './components/dataset-list';
import { CostList } from './components/cost-list';

type Props = {
  dataService: DataService;
  referenceData: DataServiceReferenceData;
  language: string;
  referenceDataEnv: string;
  searchEnv: string;
};

export const LeftColumn = ({ dataService, referenceData, language, referenceDataEnv, searchEnv }: Props) => {
  return (
    <InfoCard>
      {!isEmpty(dataService?.description) && (
        <InfoCard.Item title={localization.dataServiceForm.fieldLabel.description}>
          <Paragraph size='sm'>{getTranslateText(dataService?.description, language)}</Paragraph>
        </InfoCard.Item>
      )}

      {!isEmpty(dataService?.formats) && (
        <InfoCard.Item title={localization.dataServiceForm.fieldLabel.format}>
          <FormatList
            formatURIs={dataService.formats}
            referenceDataEnv={referenceDataEnv}
            language={language}
          />
        </InfoCard.Item>
      )}

      {!isEmpty(dataService?.endpointUrl) && (
        <InfoCard.Item title={localization.dataServiceForm.fieldLabel.endpoint}>
          {dataService?.endpointUrl}
        </InfoCard.Item>
      )}

      {!isEmpty(dataService?.endpointDescriptions) && (
        <InfoCard.Item title={localization.dataServiceForm.fieldLabel.endpointDescriptions}>
          <DetailsUrlList urls={dataService.endpointDescriptions} />
        </InfoCard.Item>
      )}

      {!isEmpty(dataService?.landingPage) && (
        <InfoCard.Item title={localization.dataServiceForm.fieldLabel.landingPage}>
          {dataService?.landingPage}
        </InfoCard.Item>
      )}

      {!isEmpty(dataService?.pages) && (
        <InfoCard.Item title={localization.dataServiceForm.fieldLabel.pages}>
          <DetailsUrlList urls={dataService.pages} />
        </InfoCard.Item>
      )}

      {!isEmpty(dataService?.license) && (
        <InfoCard.Item title={localization.dataServiceForm.fieldLabel.license}>
          <ReferenceDataTag
            referenceDataURI={dataService.license}
            referenceDataCodes={referenceData.openLicenses}
            language={language}
          />
        </InfoCard.Item>
      )}

      {!isEmpty(dataService?.costs) && (
        <InfoCard.Item title={localization.dataServiceForm.fieldLabel.costs}>
          <CostList
            costs={dataService.costs}
            language={language}
          />
        </InfoCard.Item>
      )}

      {!isEmpty(dataService?.keywords) && (
        <InfoCard.Item title={localization.dataServiceForm.fieldLabel.keywords}>
          <li className={styles.list}>
            {(getTranslateText(dataService?.keywords, language) as string[])?.map((item, index) => {
              return item ? (
                <Tag
                  size='sm'
                  color='info'
                  key={`keyword-tag-${index}`}
                >
                  {item}
                </Tag>
              ) : null;
            })}
          </li>
        </InfoCard.Item>
      )}

      {!isEmpty(dataService?.servesDataset) && (
        <InfoCard.Item title={localization.dataServiceForm.fieldLabel.servesDataset}>
          <DatasetList
            datasetURIs={dataService.servesDataset}
            searchEnv={searchEnv}
            language={language}
          />
        </InfoCard.Item>
      )}
    </InfoCard>
  );
};
