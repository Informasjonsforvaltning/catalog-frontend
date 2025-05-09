import { InfoCard } from '@catalog-frontend/ui';
import { localization, getTranslateText, capitalizeFirstLetter, validUUID } from '@catalog-frontend/utils';
import { Heading, Link, Paragraph, Table, Tag } from '@digdir/designsystemet-react';
import { Dataset, DatasetSeries, ReferenceData, Search } from '@catalog-frontend/types';
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
import TagList from '../tag-list';
import _ from 'lodash';
import Markdown from "react-markdown";

type Props = {
  dataset: Dataset;
  referenceDataEnv: string;
  searchEnv: string;
  referenceData: ReferenceData;
  datasetSeries: DatasetSeries[];
  language: string;
};

export const LeftColumn = ({ dataset, referenceDataEnv, searchEnv, referenceData, datasetSeries, language }: Props) => {
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

  const hasValues = (values: any | any[] | undefined | null): boolean => {
    return values && !_.isEmpty(values);
  };

  const getDataNorgeUri = (id: string | undefined, resourceType: Search.ResourceType) => {
    return validUUID(id) ? `${referenceDataEnv}/${resourceType}/${id}` : '/not-found';
  };

  return (
    <InfoCard>
      {hasValues(dataset?.description) && (
        <InfoCard.Item title={localization.description}>
          <Markdown>{getTranslateText(dataset?.description, language) as string}</Markdown>
        </InfoCard.Item>
      )}
      {hasValues(dataset?.accessRights) && (
        <InfoCard.Item
          title={localization.access}
          className={styles.access}
        >
          <AccessRightsDetails dataset={dataset} />
        </InfoCard.Item>
      )}

      {hasValues(dataset?.euDataTheme) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.euDataTheme}>
          {
            <TagList
              values={dataset.euDataTheme}
              getTagText={(item) => {
                const match = referenceData.dataThemes && referenceData.dataThemes.find((theme) => theme?.uri === item);
                return match ? getTranslateText(match?.label, language) : item;
              }}
            />
          }
        </InfoCard.Item>
      )}

      {hasValues(dataset?.losTheme) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.losTheme}>
          {
            <TagList
              values={dataset.losTheme}
              getTagText={(item) => {
                const match = referenceData.losThemes && referenceData.losThemes.find((theme) => theme?.uri === item);
                return match ? getTranslateText(match?.name, language) : item;
              }}
            />
          }
        </InfoCard.Item>
      )}

      {hasValues(dataset?.distribution) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.distributions}>
          <div className={styles.infoCardItems}>
            {dataset?.distribution &&
              dataset?.distribution.map((dist, index) => (
                <DistributionDetailsCard
                  key={`distribution-${index}`}
                  distribution={dist}
                  searchEnv={searchEnv}
                  referenceDataEnv={referenceDataEnv}
                  openLicenses={referenceData.openLicenses}
                  language={language}
                />
              ))}
          </div>
        </InfoCard.Item>
      )}

      {hasValues(dataset?.sample) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.sample}>
          <div className={styles.infoCardItems}>
            {dataset?.sample &&
              dataset.sample.map((dist, index) => (
                <DistributionDetailsCard
                  key={`sample-${index}`}
                  distribution={dist}
                  searchEnv={searchEnv}
                  referenceDataEnv={referenceDataEnv}
                  openLicenses={referenceData.openLicenses}
                  language={language}
                />
              ))}
          </div>
        </InfoCard.Item>
      )}

      {hasValues(dataset?.language) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.language}>
          {dataset?.language &&
            dataset.language
              .map((lang) => {
                const matchedLang = referenceData?.languages?.find((item) => item?.uri === lang?.uri);
                return matchedLang ? getTranslateText(matchedLang.label, language) : null;
              })
              .filter(Boolean)
              .join(', ')}
        </InfoCard.Item>
      )}

      {hasValues(dataset?.spatial) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.spatial}>
          <ReferenceDataTags
            values={dataset?.spatial}
            data={spatial}
          />
        </InfoCard.Item>
      )}

      {dataset?.landingPage && !_.isEmpty(dataset?.landingPage[0]) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.landingPage}>
          <div className={styles.infoCardItems}>
            {dataset?.landingPage.map((item) => <Paragraph key={item}>{item}</Paragraph>)}
          </div>
        </InfoCard.Item>
      )}

      {dataset?.temporal && !_.isEmpty(dataset?.temporal[0]) && (
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

      {hasValues(dataset?.provenance) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.provenance}>
          <ReferenceDataTags
            values={dataset?.provenance?.uri}
            data={referenceData.provenanceStatements}
          />
        </InfoCard.Item>
      )}

      {(hasValues(dataset?.accrualPeriodicity) || hasValues(dataset?.hasCurrentnessAnnotation?.hasBody)) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.accrualPeriodicity}>
          <div className={styles.infoCardItems}>
            <ReferenceDataTags
              values={dataset.accrualPeriodicity?.uri}
              data={referenceData.frequencies}
            />

            {hasValues(dataset?.hasCurrentnessAnnotation?.hasBody) && (
              <div>
                <Heading
                  level={3}
                  size='2xs'
                >{`${localization.datasetForm.fieldLabel.hasCurrentnessAnnotation}`}</Heading>
                <Paragraph size='sm'>
                  {getTranslateText(dataset?.hasCurrentnessAnnotation?.hasBody, language)}
                </Paragraph>
              </div>
            )}
          </div>
        </InfoCard.Item>
      )}

      {dataset?.conformsTo && dataset?.conformsTo[0]?.uri && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.conformsTo}>
          <UriWithLabelTable
            values={dataset?.conformsTo}
            language={language}
          />
        </InfoCard.Item>
      )}

      {hasValues(dataset?.hasRelevanceAnnotation?.hasBody) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.hasRelevanceAnnotation}>
          <Paragraph size='sm'>{getTranslateText(dataset?.hasRelevanceAnnotation?.hasBody, language)} </Paragraph>
        </InfoCard.Item>
      )}

      {hasValues(dataset?.hasCompletenessAnnotation?.hasBody) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.hasCompletenessAnnotation}>
          <Paragraph size='sm'>{getTranslateText(dataset?.hasCompletenessAnnotation?.hasBody, language)} </Paragraph>
        </InfoCard.Item>
      )}

      {hasValues(dataset?.hasAccuracyAnnotation?.hasBody) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.hasAccuracyAnnotation}>
          <Paragraph size='sm'>{getTranslateText(dataset?.hasAccuracyAnnotation?.hasBody, language)} </Paragraph>
        </InfoCard.Item>
      )}

      {hasValues(dataset?.hasAvailabilityAnnotation?.hasBody) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.hasAvailabilityAnnotation}>
          <Paragraph size='sm'>{getTranslateText(dataset?.hasAvailabilityAnnotation?.hasBody, language)} </Paragraph>
        </InfoCard.Item>
      )}
      {hasValues(dataset?.qualifiedAttributions) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.qualifiedAttributions}>
          <TagList
            values={dataset.qualifiedAttributions}
            getTagText={(org) => {
              const match =
                qualifiedAttributions &&
                qualifiedAttributions.find((attribution) => attribution.organisasjonsnummer === org);
              return match ? getTranslateText(match?.navn, language) : org;
            }}
          />
        </InfoCard.Item>
      )}
      {(hasValues(dataset.references) || hasValues(dataset.relations)) && (
        <InfoCard.Item title={localization.relations}>
          <div className={styles.infoCardItems}>
            {dataset?.references && _.compact(dataset?.references).length > 0 && (
              <Table
                size='sm'
                className={styles.table}
              >
                <Table.Head>
                  <Table.Row>
                    <Table.HeaderCell>{localization.datasetForm.fieldLabel.relationType}</Table.HeaderCell>
                    <Table.HeaderCell>{localization.datasetForm.fieldLabel.dataset}</Table.HeaderCell>
                    <Table.HeaderCell>{localization.publisher}</Table.HeaderCell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {dataset?.references &&
                    hasValues(dataset.references) &&
                    dataset?.references.map((ref, index) => {
                      const match = references?.find((item) => item?.uri === ref?.source?.uri);
                      return (
                        <Table.Row key={`references-${index}`}>
                          <Table.Cell>
                            {getTranslateText(
                              relations.find((rel) => rel.code === ref?.referenceType?.code)?.label,
                              language,
                            ) ?? ref?.referenceType?.code}
                          </Table.Cell>
                          <Table.Cell>
                            {
                              <Link href={`${referenceDataEnv}/datasets/${match?.id}`}>
                                {getTranslateText(match?.title, language) ?? ref?.source?.uri}
                              </Link>
                            }
                          </Table.Cell>
                          <Table.Cell>{getTranslateText(match?.organization?.prefLabel, language)}</Table.Cell>
                        </Table.Row>
                      );
                    })}
                </Table.Body>
              </Table>
            )}

            {hasValues(dataset?.inSeries) && (
              <div>
                <Heading
                  level={3}
                  size='2xs'
                >
                  {localization.datasetForm.fieldLabel.inSeries}
                </Heading>
                {(() => {
                  const matchedType = datasetSeries.find((item) => item.id === dataset.inSeries);
                  return matchedType ? (
                    <>
                      <Tag
                        size='sm'
                        color='info'
                      >
                        {capitalizeFirstLetter(getTranslateText(matchedType.title, language).toString())}
                      </Tag>
                    </>
                  ) : (
                    <Paragraph size='sm'>{dataset.inSeries}</Paragraph>
                  );
                })()}
              </div>
            )}

            {dataset?.relations &&
              hasValues(dataset.relations[0]?.uri) &&
              hasValues(dataset.relations[0].prefLabel) && (
                <div>
                  <Heading
                    level={3}
                    size='2xs'
                  >
                    {localization.datasetForm.fieldLabel.relations}
                  </Heading>
                  <UriWithLabelTable
                    values={dataset?.relations}
                    language={language}
                  />
                </div>
              )}
          </div>
        </InfoCard.Item>
      )}
      {hasValues(dataset.concepts) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.concept}>
          <Table
            size='sm'
            className={styles.table}
          >
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell>{localization.datasetForm.fieldLabel.concept}</Table.HeaderCell>
                <Table.HeaderCell>{localization.publisher}</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {dataset?.concepts &&
                dataset?.concepts.map((concept, index) => {
                  const match = concepts?.find((item) => item?.uri === concept?.uri);
                  return (
                    <Table.Row key={`references-${index}`}>
                      <Table.Cell>
                        {
                          <Link href={`${referenceDataEnv}/concepts/${match?.id}`}>
                            {capitalizeFirstLetter(getTranslateText(match?.title, language).toString()) ?? concept?.uri}
                          </Link>
                        }
                      </Table.Cell>
                      <Table.Cell>{getTranslateText(match?.organization?.prefLabel, language)}</Table.Cell>
                    </Table.Row>
                  );
                })}
            </Table.Body>
          </Table>
        </InfoCard.Item>
      )}
      {dataset?.keyword && !_.isEmpty(dataset?.keyword[0]) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.keyword}>
          <li className={styles.list}>
            {dataset.keyword?.map((item, index) => {
              return item[language] ? (
                <Tag
                  size='sm'
                  color='info'
                  key={`keyword-tag-${index}`}
                >
                  {item[language]}
                </Tag>
              ) : null;
            })}
          </li>
        </InfoCard.Item>
      )}

      {hasValues(dataset?.informationModelsFromFDK) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.informationModelsFromFDK}>
          <Table size='sm'>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell>{localization.resourceType.informationModel}</Table.HeaderCell>
                <Table.HeaderCell>{localization.publisher}</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {dataset?.informationModelsFromFDK &&
                dataset?.informationModelsFromFDK.map((item, index) => {
                  const match = informationModels?.find((model) => model?.uri === item);
                  return match ? (
                    <Table.Row key={`uri-with-label-table-${index}`}>
                      <Table.Cell>
                        <Link href={getDataNorgeUri(match.id, 'information-models')}>
                          {getTranslateText(match?.title, language) || localization.noTitleAvailable}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>{getTranslateText(match?.organization?.prefLabel)}</Table.Cell>
                    </Table.Row>
                  ) : (
                    <Table.Row key={`missing-item-${index}`}>
                      <Table.Cell>{localization.noInformationModelFound}</Table.Cell>
                      <Table.Cell>{item}</Table.Cell>
                    </Table.Row>
                  );
                })}
            </Table.Body>
          </Table>
        </InfoCard.Item>
      )}

      {dataset?.informationModel && !_.isEmpty(dataset?.informationModel[0]?.uri) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.informationModel}>
          <UriWithLabelTable
            values={dataset?.informationModel}
            language={language}
          />
        </InfoCard.Item>
      )}
    </InfoCard>
  );
};
