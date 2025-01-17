import { InfoCard } from '@catalog-frontend/ui';
import { localization, getTranslateText, capitalizeFirstLetter } from '@catalog-frontend/utils';
import { Label, Paragraph, Table, Tag } from '@digdir/designsystemet-react';
import _ from 'lodash';
import { Dataset, DatasetSeries, ReferenceData } from '@catalog-frontend/types';
import styles from './details-columns.module.css';
import { useSearchAdministrativeUnitsByUri } from '../../hooks/useReferenceDataSearch';
import { useSearchEnheterByOrgNmbs } from '../../hooks/useEnhetsregister';
import {
  useSearchConceptsByUri,
  useSearchDatasetsByUri,
  useSearchInformationModelsByUri,
} from '../../hooks/useSearchService';
import relations from '../dataset-form/utils/relations.json';
import { ReferenceDataTags } from '../reference-data-tags';
import { UriWithLabelTable } from '../uri-with-label-table';
import { DistributionDetailsCard } from './components/distribution-details';
import { AccessRightsDetails } from './components/access-rights-details';
import { TemporalDetails } from './components/temporal-details';

type Props = {
  dataset: Dataset;
  referenceDataEnv: string;
  searchEnv: string;
  referenceData: ReferenceData;
  datasetSeries: DatasetSeries[];
};

export const LeftColumn = ({ dataset, referenceDataEnv, searchEnv, referenceData, datasetSeries }: Props) => {
  const getAllSpatialUris = dataset?.spatial?.reduce((acc, item) => {
    return acc.concat(item?.uri ?? []);
  }, [] as string[]);

  const { data: spatial } = useSearchAdministrativeUnitsByUri(getAllSpatialUris, referenceDataEnv);

  const { data: qualifiedAttributions } = useSearchEnheterByOrgNmbs(dataset?.qualifiedAttributions);

  const allReferenceUris =
    dataset.references?.reduce((acc, ref) => {
      if (ref?.source?.uri) acc.push(ref.source.uri);
      return acc;
    }, [] as string[]) ?? [];

  const { data: references } = useSearchDatasetsByUri(searchEnv, allReferenceUris);

  const allConceptUris = dataset.concepts?.map((item) => item.uri) ?? [];
  const { data: concepts } = useSearchConceptsByUri(searchEnv, allConceptUris);

  const { data: informationModels } = useSearchInformationModelsByUri(
    searchEnv,
    dataset?.informationModelsFromFDK ?? [],
  );

  return (
    <InfoCard>
      {!_.isEmpty(dataset?.description) && (
        <InfoCard.Item title={localization.description}>
          <Paragraph size='sm'>{getTranslateText(dataset?.description)} </Paragraph>
        </InfoCard.Item>
      )}
      {dataset?.accessRights && (
        <InfoCard.Item
          title={localization.access}
          className={styles.access}
        >
          <AccessRightsDetails dataset={dataset} />
        </InfoCard.Item>
      )}

      {dataset.theme && (
        <>
          <InfoCard.Item title={localization.datasetForm.fieldLabel.euTheme}>
            <li className={styles.list}>
              {dataset.theme?.map((item) => {
                const matchedTheme = referenceData.dataThemes.find((los) => los.uri === item.uri);
                return matchedTheme ? (
                  <Tag
                    size='sm'
                    color='info'
                    key={`datatheme-${item.uri}`}
                  >
                    {getTranslateText(matchedTheme?.label)}
                  </Tag>
                ) : null;
              })}
            </li>
          </InfoCard.Item>
          <InfoCard.Item title={localization.datasetForm.fieldLabel.theme}>
            <li className={styles.list}>
              {dataset.theme?.map((item) => {
                const matchedTheme = referenceData.losThemes.find((los) => los.uri === item.uri);
                return matchedTheme ? (
                  <Tag
                    size='sm'
                    color='info'
                    key={item.uri}
                  >
                    {getTranslateText(matchedTheme?.name)}
                  </Tag>
                ) : null;
              })}
            </li>
          </InfoCard.Item>
        </>
      )}

      {dataset?.distribution && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.distributions}>
          {dataset.distribution.map((dist, index) => (
            <DistributionDetailsCard
              key={`distribution-${index}`}
              distribution={dist}
              searchEnv={searchEnv}
              referenceDataEnv={referenceDataEnv}
              openLicenses={referenceData.openLicenses}
            />
          ))}
        </InfoCard.Item>
      )}

      {dataset?.sample && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.sample}>
          {dataset.sample.map((dist, index) => (
            <DistributionDetailsCard
              key={`sample-${index}`}
              distribution={dist}
              searchEnv={searchEnv}
              referenceDataEnv={referenceDataEnv}
              openLicenses={referenceData.openLicenses}
            />
          ))}
        </InfoCard.Item>
      )}

      {dataset?.language && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.language}>
          {dataset.language
            .map((lang) => {
              const matchedLang = referenceData?.languages?.find((item) => item.uri === lang.uri);
              return matchedLang ? getTranslateText(matchedLang.label) : null;
            })
            .filter(Boolean)
            .join(', ')}
        </InfoCard.Item>
      )}
      {dataset?.spatial && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.spatial}>
          {getTranslateText(dataset?.spatial?.map((area) => spatial?.find((item) => item.uri === area.uri)?.label))}
          {
            <ReferenceDataTags
              values={dataset?.spatial}
              data={spatial}
            />
          }
        </InfoCard.Item>
      )}

      {dataset?.landingPage && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.landingPage}>
          <div className={styles.infoCardItems}>
            {dataset?.landingPage.map((item) => <Paragraph key={item}>{item}</Paragraph>)}
          </div>
        </InfoCard.Item>
      )}

      {Array.isArray(dataset.temporal) && dataset.temporal.length > 0 && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.temporal}>
          <TemporalDetails temporal={dataset?.temporal} />
        </InfoCard.Item>
      )}

      {dataset?.type && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.type}>
          <ReferenceDataTags
            values={dataset?.type}
            data={referenceData.datasetTypes}
          />
        </InfoCard.Item>
      )}

      {dataset?.provenance && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.provenance}>
          <ReferenceDataTags
            values={dataset?.provenance?.uri}
            data={referenceData.provenanceStatements}
          />
        </InfoCard.Item>
      )}

      {(!_.isEmpty(dataset?.accrualPeriodicity) || !_.isEmpty(dataset?.hasCurrentnessAnnotation)) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.accrualPeriodicity}>
          <div className={styles.infoCardItems}>
            <ReferenceDataTags
              values={dataset.accrualPeriodicity?.uri}
              data={referenceData.frequencies}
            />

            {!_.isEmpty(dataset?.hasAccuracyAnnotation) && (
              <div>
                <Label size='sm'>{`${localization.datasetForm.fieldLabel.hasCurrentnessAnnotation}`}</Label>
                <Paragraph size='sm'>{getTranslateText(dataset?.hasCurrentnessAnnotation?.hasBody)} </Paragraph>
              </div>
            )}
          </div>
        </InfoCard.Item>
      )}

      {dataset?.conformsTo && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.conformsTo}>
          <UriWithLabelTable values={dataset?.conformsTo} />
        </InfoCard.Item>
      )}

      {!_.isEmpty(dataset?.hasRelevanceAnnotation) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.hasRelevanceAnnotation}>
          <Paragraph size='sm'>{getTranslateText(dataset?.hasRelevanceAnnotation?.hasBody)} </Paragraph>
        </InfoCard.Item>
      )}

      {!_.isEmpty(dataset?.hasCompletenessAnnotation) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.hasCompletenessAnnotation}>
          <Paragraph size='sm'>{getTranslateText(dataset?.hasCompletenessAnnotation?.hasBody)} </Paragraph>
        </InfoCard.Item>
      )}

      {!_.isEmpty(dataset?.hasAccuracyAnnotation) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.hasAccuracyAnnotation}>
          <Paragraph size='sm'>{getTranslateText(dataset?.hasAccuracyAnnotation?.hasBody)} </Paragraph>
        </InfoCard.Item>
      )}

      {!_.isEmpty(dataset?.hasAvailabilityAnnotation) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.hasAvailabilityAnnotation}>
          <Paragraph size='sm'>{getTranslateText(dataset?.hasAvailabilityAnnotation?.hasBody)} </Paragraph>
        </InfoCard.Item>
      )}
      {dataset?.qualifiedAttributions &&
        dataset?.qualifiedAttributions.length > 0 &&
        !_.isEmpty(dataset?.qualifiedAttributions) && (
          <InfoCard.Item title={localization.datasetForm.fieldLabel.qualifiedAttributions}>
            <li className={styles.list}>
              {dataset?.qualifiedAttributions?.map((org) => {
                const match =
                  qualifiedAttributions &&
                  qualifiedAttributions.find((attribution) => attribution.organisasjonsnummer === org);
                return match ? (
                  <Tag
                    size='sm'
                    color='info'
                    key={`organization-tag-${org}`}
                  >
                    {getTranslateText(match?.navn) ?? org}
                  </Tag>
                ) : null;
              })}
            </li>
          </InfoCard.Item>
        )}
      {(!_.isEmpty(dataset.references) || !_.isEmpty(dataset.relations)) && (
        <InfoCard.Item title={localization.relations}>
          <div className={styles.infoCardItems}>
            {dataset?.references && _.compact(dataset?.references).length > 0 && (
              <Table size='sm'>
                <Table.Head>
                  <Table.Row>
                    <Table.HeaderCell>{localization.datasetForm.fieldLabel.relationType}</Table.HeaderCell>
                    <Table.HeaderCell>{localization.datasetForm.fieldLabel.dataset}</Table.HeaderCell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {dataset?.references &&
                    dataset?.references.map((ref, index) => (
                      <Table.Row key={`references-${index}`}>
                        <Table.Cell>
                          {getTranslateText(relations.find((rel) => rel.code === ref?.referenceType?.code)?.label) ??
                            ref?.referenceType?.code}
                        </Table.Cell>
                        <Table.Cell>
                          {getTranslateText(references?.find((item) => item.uri === ref?.source?.uri)?.title) ??
                            ref?.source?.uri}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table>
            )}

            {dataset?.inSeries && (
              <div>
                <Label size='sm'> {localization.datasetForm.fieldLabel.inSeries}</Label>
                {(() => {
                  const matchedType = datasetSeries.find((item) => item.id === dataset.inSeries);
                  return matchedType ? (
                    <>
                      <Tag
                        size='sm'
                        color='info'
                      >
                        {capitalizeFirstLetter(getTranslateText(matchedType.title).toString())}
                      </Tag>
                    </>
                  ) : (
                    <Paragraph size='sm'>{dataset.inSeries}</Paragraph>
                  );
                })()}
              </div>
            )}

            {dataset?.relations && (
              <div>
                <Label size='sm'>{localization.datasetForm.fieldLabel.relations}</Label>

                <UriWithLabelTable values={dataset?.relations} />
              </div>
            )}
          </div>
        </InfoCard.Item>
      )}
      {!_.isEmpty(dataset.concepts) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.concept}>
          <li className={styles.list}>
            {dataset.concepts?.map((item) => {
              const match = concepts && concepts.find((concept) => concept.uri === item.uri);
              return match ? (
                <Tag
                  size='sm'
                  color='info'
                  key={item.uri}
                >
                  {capitalizeFirstLetter(getTranslateText(match?.title).toString()) ?? item.uri}
                </Tag>
              ) : null;
            })}
          </li>
        </InfoCard.Item>
      )}
      {!_.isEmpty(dataset?.keyword) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.keyword}>
          <li className={styles.list}>
            {dataset.keyword?.map((item, index) => {
              return item ? (
                <Tag
                  size='sm'
                  color='info'
                  key={`keyword-tag-${index}`}
                >
                  {capitalizeFirstLetter(getTranslateText(item).toString()) ?? item.uri}
                </Tag>
              ) : null;
            })}
          </li>
        </InfoCard.Item>
      )}

      {!_.isEmpty(dataset?.informationModelsFromFDK) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.informationModelsFromFDK}>
          <li className={styles.list}>
            {dataset.informationModelsFromFDK?.map((item) => {
              const match = informationModels && informationModels.find((model) => model.uri === item);
              return match ? (
                <Tag
                  size='sm'
                  color='info'
                  key={item}
                >
                  {capitalizeFirstLetter(getTranslateText(match?.title).toString()) ?? item}
                </Tag>
              ) : null;
            })}
          </li>
        </InfoCard.Item>
      )}

      {!_.isEmpty(dataset?.informationModel) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.informationModel}>
          <UriWithLabelTable values={dataset?.informationModel} />
        </InfoCard.Item>
      )}
    </InfoCard>
  );
};
