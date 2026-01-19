import { InfoCard } from '@catalog-frontend/ui';
import {
  localization,
  getTranslateText,
  capitalizeFirstLetter,
  validUUID,
  formatDateToDDMMYYYY,
} from '@catalog-frontend/utils';
import { Heading, Link, Paragraph, Table, Tag } from '@digdir/designsystemet-react';
import { Dataset, DatasetSeries, ISOLanguage, ReferenceData, Search } from '@catalog-frontend/types';
import styles from './details-columns.module.css';
import { useSearchAdministrativeUnitsByUri } from '@catalog-frontend/ui';
import { useSearchEnheterByOrgNmbs } from '../../hooks/useEnhetsregister';
import {
  useSearchConceptsByUri,
  useSearchDatasetsByUri,
  useSearchInformationModelsByUri,
} from '@catalog-frontend/ui';
import relations from '../dataset-form/utils/relations.json';
import { ReferenceDataTags } from '../reference-data-tags';
import { UriWithLabelTable } from '../uri-with-label-table';
import { DistributionDetailsCard } from './components/distribution-details';
import { AccessRightsDetails } from './components/access-rights-details';
import { TemporalDetails } from './components/temporal-details';
import TagList from '../tag-list';
import { compact, get, isEmpty } from 'lodash';
import { MarkdownComponent } from '@catalog-frontend/ui';

type Props = {
  dataset: Dataset;
  referenceDataEnv: string;
  searchEnv: string;
  referenceData: ReferenceData;
  datasetSeries: DatasetSeries[];
  language: string;
};

export const LeftColumn = ({ dataset, referenceDataEnv, searchEnv, referenceData, datasetSeries, language }: Props) => {
  const keywordLanguages: ISOLanguage[] = ['nb', 'nn', 'en'];
  const { data: spatial } = useSearchAdministrativeUnitsByUri(dataset?.spatial, referenceDataEnv);
  const { data: qualifiedAttributions } = useSearchEnheterByOrgNmbs(dataset?.qualifiedAttributions);

  const allReferenceUris =
    dataset.references?.reduce((acc, ref) => {
      if (ref?.source) acc.push(ref.source);
      return acc;
    }, [] as string[]) ?? [];

  const { data: references } = useSearchDatasetsByUri(searchEnv, allReferenceUris);

  const { data: concepts } = useSearchConceptsByUri(searchEnv, dataset?.concepts ?? []);

  const { data: informationModels } = useSearchInformationModelsByUri(
    searchEnv,
    dataset?.informationModelsFromFDK ?? [],
  );

  const hasValues = (values: any | any[] | undefined | null): boolean => {
    return values && !isEmpty(values);
  };

  const getDataNorgeUri = (id: string | undefined, resourceType: Search.ResourceType) => {
    return validUUID(id) ? `${referenceDataEnv}/${resourceType}/${id}` : '/not-found';
  };

  return (
    <InfoCard>
      {hasValues(dataset?.description) ?
        <InfoCard.Item title={localization.description}>
          <MarkdownComponent>{getTranslateText(dataset?.description, language) as string}</MarkdownComponent>
        </InfoCard.Item> :
        <InfoCard.Item title={localization.description}>
          Mangler beskrivelse
        </InfoCard.Item>
      }
      {(hasValues(dataset?.accessRight) ||
        hasValues(dataset?.legalBasisForAccess) ||
        hasValues(dataset?.legalBasisForRestriction) ||
        hasValues(dataset?.legalBasisForProcessing)) && (
        <InfoCard.Item
          title={localization.access}
          className={styles.access}
        >
          <AccessRightsDetails
            dataset={dataset}
            language={language}
          />
        </InfoCard.Item>
      )}

      {dataset?.issued && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.issued}>
          {formatDateToDDMMYYYY(dataset.issued)}
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
                const matchedLang = referenceData?.languages?.find((item) => item?.uri === lang);
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

      {dataset?.landingPage && !isEmpty(dataset?.landingPage[0]) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.landingPage}>
          {dataset?.landingPage.map((page: string, index: number) => (
            <Paragraph
              key={`landing-page-${index}`}
            >
              <Link href={page}>{page}</Link>
            </Paragraph>
          ))}
        </InfoCard.Item>
      )}

      {dataset?.temporal && (
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
            values={dataset?.provenance}
            data={referenceData.provenanceStatements}
          />
        </InfoCard.Item>
      )}

      {dataset?.modified && (
        <InfoCard.Item title={localization.datasetForm.helptext.modified.slice(0, -1)}>
          {formatDateToDDMMYYYY(dataset.modified)}
        </InfoCard.Item>
      )}

      {(hasValues(dataset?.frequency) || hasValues(dataset?.currentness?.hasBody)) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.frequency}>
          <div className={styles.infoCardItems}>
            <ReferenceDataTags
              values={dataset.frequency}
              data={referenceData.frequencies}
            />

            {hasValues(dataset?.currentness?.hasBody) && (
              <div>
                <Heading
                  level={3}
                  size='2xs'
                >{`${localization.datasetForm.fieldLabel.currentness}`}</Heading>
                <Paragraph size='sm'>{getTranslateText(dataset?.currentness?.hasBody, language)}</Paragraph>
              </div>
            )}
          </div>
        </InfoCard.Item>
      )}

      {dataset?.conformsTo && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.conformsTo}>
          <UriWithLabelTable
            values={dataset?.conformsTo}
            language={language}
          />
        </InfoCard.Item>
      )}

      {hasValues(dataset?.relevance?.hasBody) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.relevance}>
          <Paragraph size='sm'>{getTranslateText(dataset?.relevance?.hasBody, language)} </Paragraph>
        </InfoCard.Item>
      )}

      {hasValues(dataset?.completeness?.hasBody) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.completeness}>
          <Paragraph size='sm'>{getTranslateText(dataset?.completeness?.hasBody, language)} </Paragraph>
        </InfoCard.Item>
      )}

      {hasValues(dataset?.accuracy?.hasBody) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.accuracy}>
          <Paragraph size='sm'>{getTranslateText(dataset?.accuracy?.hasBody, language)} </Paragraph>
        </InfoCard.Item>
      )}

      {hasValues(dataset?.availability?.hasBody) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.availability}>
          <Paragraph size='sm'>{getTranslateText(dataset?.availability?.hasBody, language)} </Paragraph>
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
      {(hasValues(dataset.references) || hasValues(dataset.relatedResources)) && (
        <InfoCard.Item title={localization.relations}>
          <div className={styles.infoCardItems}>
            {dataset?.references && compact(dataset?.references).length > 0 && (
              <Table
                data-size='sm'
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
                      const match = references?.find((item) => item?.uri === ref?.source);
                      return (
                        <Table.Row key={`references-${index}`}>
                          <Table.Cell>
                            {getTranslateText(
                              relations.find((rel) => rel.code === ref?.referenceType)?.label,
                              language,
                            ) ?? ref?.referenceType}
                          </Table.Cell>
                          <Table.Cell>
                            {
                              <Link href={`${referenceDataEnv}/datasets/${match?.id}`}>
                                {getTranslateText(match?.title, language) ?? ref?.source}
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
                        data-size='sm'
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

            {dataset?.relatedResources &&
              hasValues(dataset.relatedResources[0]?.uri) &&
              hasValues(dataset.relatedResources[0].prefLabel) && (
                <div>
                  <Heading
                    level={3}
                    size='2xs'
                  >
                    {localization.datasetForm.fieldLabel.relations}
                  </Heading>
                  <UriWithLabelTable
                    values={dataset?.relatedResources}
                    language={language}
                  />
                </div>
              )}
          </div>
        </InfoCard.Item>
      )}
      {hasValues(dataset.concepts) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.concepts}>
          <Table
            data-size='sm'
            className={styles.table}
          >
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell>{localization.datasetForm.fieldLabel.concepts}</Table.HeaderCell>
                <Table.HeaderCell>{localization.publisher}</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {dataset?.concepts &&
                dataset?.concepts.map((concept, index) => {
                  const match = concepts?.find((item) => item?.uri === concept);
                  return (
                    <Table.Row key={`references-${index}`}>
                      <Table.Cell>
                        {
                          <Link href={`${referenceDataEnv}/concepts/${match?.id}`}>
                            {getTranslateText(match?.title, language).toString() ?? concept}
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
      {dataset?.keywords && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.keywords}>
          <li className={styles.list}>
            {keywordLanguages.map((lang) => {
              const langValues = get(dataset.keywords, lang);
              return langValues && typeof langValues !== 'string'
                ? langValues.map((item, index) =>
                    item ? (
                      <Tag
                        data-size='sm'
                        color='info'
                        key={`keyword-tag-${index}`}
                      >
                        {item}
                      </Tag>
                    ) : null,
                  )
                : null;
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
                      <Table.Cell>{getTranslateText(match?.organization?.prefLabel, language)}</Table.Cell>
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

      {!isEmpty(dataset?.informationModelsFromOtherSources) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.informationModelsFromOtherSources}>
          <UriWithLabelTable
            values={dataset?.informationModelsFromOtherSources}
            language={language}
          />
        </InfoCard.Item>
      )}
    </InfoCard>
  );
};
