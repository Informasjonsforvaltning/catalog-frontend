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

  return (
    <InfoCard>
      {!_.isEmpty(dataset?.description) && (
        <InfoCard.Item title={localization.description}>
          <Paragraph size='sm'>{getTranslateText(dataset?.description, language)} </Paragraph>
        </InfoCard.Item>
      )}
      {dataset?.accessRights && !_.isEmpty(dataset?.accessRights) && (
        <InfoCard.Item
          title={localization.access}
          className={styles.access}
        >
          <AccessRightsDetails dataset={dataset} />
        </InfoCard.Item>
      )}

      {dataset?.euDataTheme && !_.isEmpty(dataset?.euDataTheme) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.euDataTheme}>
          <li className={styles.list}>
            {dataset.euDataTheme?.map((item) => {
              const matchedTheme = referenceData.dataThemes.find((los) => los.uri === item);
              return matchedTheme ? (
                <Tag
                  size='sm'
                  color='info'
                  key={`datatheme-${item}`}
                >
                  {getTranslateText(matchedTheme?.label, language)}
                </Tag>
              ) : null;
            })}
          </li>
        </InfoCard.Item>
      )}

      {dataset?.losTheme && !_.isEmpty(dataset.losTheme) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.losTheme}>
          <li className={styles.list}>
            {dataset.losTheme?.map((item) => {
              const matchedTheme = referenceData.losThemes.find((los) => los.uri === item);
              return matchedTheme ? (
                <Tag
                  size='sm'
                  color='info'
                  key={item}
                >
                  {getTranslateText(matchedTheme?.name, language)}
                </Tag>
              ) : null;
            })}
          </li>
        </InfoCard.Item>
      )}

      {dataset?.distribution && !_.isEmpty(dataset?.distribution) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.distributions}>
          <div className={styles.infoCardItems}>
            {dataset.distribution.map((dist, index) => (
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

      {dataset?.sample && !_.isEmpty(dataset.sample) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.sample}>
          <div className={styles.infoCardItems}>
            {dataset.sample.map((dist, index) => (
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

      {dataset?.language && !_.isEmpty(dataset?.language) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.language}>
          {dataset.language
            .map((lang) => {
              const matchedLang = referenceData?.languages?.find((item) => item.uri === lang.uri);
              return matchedLang ? getTranslateText(matchedLang.label, language) : null;
            })
            .filter(Boolean)
            .join(', ')}
        </InfoCard.Item>
      )}
      {dataset?.spatial && !_.isEmpty(dataset?.spatial) && (
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

      {Array.isArray(dataset.temporal) && dataset.temporal.length > 0 && !_.isEmpty(dataset?.temporal[0]) && (
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

      {dataset?.provenance && !_.isEmpty(dataset.provenance) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.provenance}>
          <ReferenceDataTags
            values={dataset?.provenance?.uri}
            data={referenceData.provenanceStatements}
          />
        </InfoCard.Item>
      )}

      {(!_.isEmpty(dataset?.accrualPeriodicity) || !_.isEmpty(dataset?.hasCurrentnessAnnotation?.hasBody)) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.accrualPeriodicity}>
          <div className={styles.infoCardItems}>
            <ReferenceDataTags
              values={dataset.accrualPeriodicity?.uri}
              data={referenceData.frequencies}
            />

            {!_.isEmpty(dataset?.hasAccuracyAnnotation?.hasBody) && (
              <div>
                <Label size='sm'>{`${localization.datasetForm.fieldLabel.hasCurrentnessAnnotation}`}</Label>
                <Paragraph size='sm'>
                  {getTranslateText(dataset?.hasCurrentnessAnnotation?.hasBody, language)}{' '}
                </Paragraph>
              </div>
            )}
          </div>
        </InfoCard.Item>
      )}

      {dataset?.conformsTo && !_.isEmpty(dataset?.conformsTo) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.conformsTo}>
          <UriWithLabelTable
            values={dataset?.conformsTo}
            language={language}
          />
        </InfoCard.Item>
      )}

      {!_.isEmpty(dataset?.hasRelevanceAnnotation?.hasBody) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.hasRelevanceAnnotation}>
          <Paragraph size='sm'>{getTranslateText(dataset?.hasRelevanceAnnotation?.hasBody, language)} </Paragraph>
        </InfoCard.Item>
      )}

      {!_.isEmpty(dataset?.hasCompletenessAnnotation?.hasBody) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.hasCompletenessAnnotation}>
          <Paragraph size='sm'>{getTranslateText(dataset?.hasCompletenessAnnotation?.hasBody, language)} </Paragraph>
        </InfoCard.Item>
      )}

      {!_.isEmpty(dataset?.hasAccuracyAnnotation?.hasBody) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.hasAccuracyAnnotation}>
          <Paragraph size='sm'>{getTranslateText(dataset?.hasAccuracyAnnotation?.hasBody, language)} </Paragraph>
        </InfoCard.Item>
      )}

      {!_.isEmpty(dataset?.hasAvailabilityAnnotation?.hasBody) && (
        <InfoCard.Item title={localization.datasetForm.fieldLabel.hasAvailabilityAnnotation}>
          <Paragraph size='sm'>{getTranslateText(dataset?.hasAvailabilityAnnotation?.hasBody, language)} </Paragraph>
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
                    {getTranslateText(match?.navn, language) ?? org}
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
                    !_.isEmpty(dataset.references) &&
                    dataset?.references.map((ref, index) => (
                      <Table.Row key={`references-${index}`}>
                        <Table.Cell>
                          {getTranslateText(
                            relations.find((rel) => rel.code === ref?.referenceType?.code)?.label,
                            language,
                          ) ?? ref?.referenceType?.code}
                        </Table.Cell>
                        <Table.Cell>
                          {getTranslateText(
                            references?.find((item) => item.uri === ref?.source?.uri)?.title,
                            language,
                          ) ?? ref?.source?.uri}
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
              !_.isEmpty(dataset.relations[0].uri) &&
              !_.isEmpty(dataset.relations[0].prefLabel) && (
                <div>
                  <Label size='sm'>{localization.datasetForm.fieldLabel.relations}</Label>
                  <UriWithLabelTable
                    values={dataset?.relations}
                    language={language}
                  />
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

              return (
                <Tag
                  size='sm'
                  color='info'
                  key={item.uri}
                >
                  {match ? capitalizeFirstLetter(getTranslateText(match?.title, language).toString()) : item.uri}
                </Tag>
              );
            })}
          </li>
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
                  {capitalizeFirstLetter(getTranslateText(match?.title, language).toString()) ?? item}
                </Tag>
              ) : null;
            })}
          </li>
        </InfoCard.Item>
      )}

      {dataset?.informationModel && !_.isEmpty(dataset?.informationModel[0]?.prefLabel) && (
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
