'use client';

import { Dataset, PublicationStatus, Reference, UriWithLabel } from '@catalog-frontend/types';
import { DeleteButton, DetailsPageLayout, InfoCard, LinkButton } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import _ from 'lodash';
import { useState } from 'react';
import { Label, Paragraph, Switch, Table } from '@digdir/designsystemet-react';
import styles from './dataset-details-page.module.css';
import { DistributionDetails } from '../../../../../components/dataset-form/components/distribution-section/distribution-details';
import PublishSwitch from 'apps/dataset-catalog/components/publish-switch';

interface datasetDetailsPageProps {
  dataset: Dataset;
  catalogId: string;
  datasetId: string;
  hasWritePermission: boolean;
  searchEnv: string;
  referenceDataEnv: string;
  //statuses: ReferenceDataCode[];
}

const DatasetDetailsPageClient = ({
  dataset,
  catalogId,
  datasetId,
  hasWritePermission,
  searchEnv,
  referenceDataEnv,
  //statuses,
}: datasetDetailsPageProps) => {
  const [language, setLanguage] = useState('nb');

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  //const finddatasetStatus = () => statuses.find((s) => s.uri === dataset?.status);

  const published: boolean = dataset.registrationStatus === PublicationStatus.PUBLISH ? true : false;

  const allLegalBases = [
    ...(dataset.legalBasisForRestriction ?? []).map((item, index) => ({
      uriWithLabel: item,
      type: 'legalBasisForRestriction',
      index: index,
    })),
    ...(dataset.legalBasisForProcessing ?? []).map((item, index) => ({
      uriWithLabel: item,
      type: 'legalBasisForProcessing',
      index: index,
    })),
    ...(dataset.legalBasisForAccess ?? []).map((item, index) => ({
      uriWithLabel: item,
      type: 'legalBasisForAccess',
      index: index,
    })),
  ];

  const hasNoFieldValues = (values: UriWithLabel) => {
    if (!values) return true;
    return _.isEmpty(_.trim(values.uri)) && _.isEmpty(_.pickBy(values.prefLabel, _.identity));
  };

  const RightColumn = () => (
    <div>
      <InfoCard>
        <InfoCard.Item
          key={`info-data-${localization.id}`}
          label={localization.datasetForm.fieldLabel.datasetID}
          labelColor='light'
        >
          {dataset?.id}
        </InfoCard.Item>

        <InfoCard.Item
          key={`info-data-${localization.publicationState.state}`}
          label={localization.publicationState.state}
          labelColor='light'
        >
          <PublishSwitch
            catalogId={catalogId}
            dataset={dataset}
            disabled={!hasWritePermission}
          />

          <div>
            {published ? localization.publicationState.publishedInFDK : localization.publicationState.unpublished}
          </div>
        </InfoCard.Item>
      </InfoCard>
    </div>
  );

  return (
    <DetailsPageLayout
      handleLanguageChange={handleLanguageChange}
      language={language}
      headingTitle={getTranslateText(dataset?.title ?? '', language)}
      headingTag={
        'hei'
        // <Tag.datasetStatus
        //   statusKey={finddatasetStatus()?.code as datasetStatusTagProps['statusKey']}
        //   statusLabel={getTranslateText(finddatasetStatus()?.label) as string}
        // />
      }
      loading={false}
    >
      <DetailsPageLayout.Left>
        <InfoCard>
          <InfoCard.Item>
            <Label size='sm'>{`${localization.description}:`}</Label>
            <Paragraph size='sm'>{getTranslateText(dataset?.description)} </Paragraph>
          </InfoCard.Item>

          <InfoCard.Item>
            <Label size='sm'>{`Tilgang:`}</Label>
            <Paragraph size='sm'>{getTranslateText(dataset?.accessRights?.uri)} </Paragraph>

            <Label size='sm'>{localization.datasetForm.fieldLabel.legalBasis}</Label>

            {allLegalBases && allLegalBases?.length > 0 && !hasNoFieldValues(allLegalBases[0].uriWithLabel) && (
              <Table size='sm'>
                <Table.Head>
                  <Table.Row>
                    <Table.HeaderCell>{localization.title}</Table.HeaderCell>
                    <Table.HeaderCell>{localization.link}</Table.HeaderCell>
                    <Table.HeaderCell>{localization.type}</Table.HeaderCell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {allLegalBases.map(
                    (item, i) =>
                      item?.uriWithLabel && (
                        <Table.Row key={`${item.type}-tableRow-${i}`}>
                          <Table.Cell>{getTranslateText(item?.uriWithLabel.prefLabel)}</Table.Cell>
                          <Table.Cell>{item?.uriWithLabel.uri}</Table.Cell>
                          <Table.Cell>{localization.datasetForm.fieldLabel[item?.type]}</Table.Cell>
                        </Table.Row>
                      ),
                  )}
                </Table.Body>
              </Table>
            )}
          </InfoCard.Item>

          <InfoCard.Item>
            <Label size='sm'>{`${localization.datasetForm.fieldLabel.releaseDate}:`}</Label>
            <Paragraph size='sm'>{dataset?.issued} </Paragraph>
          </InfoCard.Item>

          <InfoCard.Item>
            <Label size='sm'>{`${localization.datasetForm.fieldLabel.theme}, ${localization.datasetForm.fieldLabel.euTheme}:`}</Label>
            <Paragraph size='sm'>{dataset?.theme && dataset?.theme.map((theme) => theme.uri)} </Paragraph>
          </InfoCard.Item>

          <InfoCard.Item>
            {dataset?.distribution &&
              dataset.distribution.map((dist) => (
                <>
                  <Label size='sm'>{`${localization.datasetForm.fieldLabel.distribution}:`}</Label>
                  <DistributionDetails
                    searchEnv={searchEnv}
                    referenceDataEnv={referenceDataEnv}
                    openLicenses={[]}
                    distribution={dist}
                  ></DistributionDetails>
                </>
              ))}
          </InfoCard.Item>

          <InfoCard.Item>
            {dataset?.sample &&
              dataset.sample.map((dist) => (
                <>
                  <Label size='sm'>{`${localization.datasetForm.fieldLabel.sample}:`}</Label>
                  <DistributionDetails
                    searchEnv={searchEnv}
                    referenceDataEnv={referenceDataEnv}
                    openLicenses={[]}
                    distribution={dist}
                  ></DistributionDetails>
                </>
              ))}
          </InfoCard.Item>

          <InfoCard.Item>
            <Label size='sm'>{`${localization.datasetForm.fieldLabel.language}:`}</Label>
            <Paragraph size='sm'>{dataset?.language?.map((lang) => getTranslateText(lang.label))} </Paragraph>
          </InfoCard.Item>

          <InfoCard.Item>
            <Label size='sm'>{`${localization.datasetForm.fieldLabel.spatial}:`}</Label>
            <Paragraph size='sm'>{dataset?.spatial?.map((area) => getTranslateText(area.label))} </Paragraph>
          </InfoCard.Item>

          <InfoCard.Item>
            <Label size='sm'>{`${localization.datasetForm.fieldLabel.temporal}:`}</Label>
            <Paragraph size='sm'>
              {dataset?.temporal?.map(
                (area) =>
                  `${localization.from} ${getTranslateText(area.startDate)} ${localization.to} ${getTranslateText(area.endDate)}`,
              )}
            </Paragraph>
          </InfoCard.Item>

          <InfoCard.Item>
            <Label size='sm'>{`${localization.datasetForm.fieldLabel.landingPage}:`}</Label>
            <Paragraph size='sm'>{dataset?.landingPage?.map((item) => getTranslateText(item))} </Paragraph>
          </InfoCard.Item>

          <InfoCard.Item>
            <Label size='sm'>{`${localization.datasetForm.fieldLabel.type}:`}</Label>
            <Paragraph size='sm'>{dataset?.type} </Paragraph>
          </InfoCard.Item>

          <InfoCard.Item>
            <Label size='sm'>{`${localization.datasetForm.fieldLabel.provenance}:`}</Label>
            <Paragraph size='sm'>{dataset?.provenance?.uri} </Paragraph>
          </InfoCard.Item>

          <InfoCard.Item>
            <Label size='sm'>{`${localization.datasetForm.fieldLabel.modified}:`}</Label>
            <Paragraph size='sm'>{dataset?.modified} </Paragraph>
          </InfoCard.Item>

          <InfoCard.Item>
            <Label size='sm'>{`${localization.datasetForm.fieldLabel.accrualPeriodicity}:`}</Label>
            <Paragraph size='sm'>{dataset?.accrualPeriodicity?.uri} </Paragraph>
            <Label size='sm'>{`${localization.datasetForm.fieldLabel.hasCurrentnessAnnotation}:`}</Label>
            <Paragraph size='sm'>{getTranslateText(dataset?.hasCurrentnessAnnotation?.hasBody)} </Paragraph>
          </InfoCard.Item>

          <InfoCard.Item>
            <Label size='sm'>{`${localization.datasetForm.fieldLabel.hasCompletenessAnnotation}:`}</Label>
            <Paragraph size='sm'>{getTranslateText(dataset?.hasCompletenessAnnotation?.hasBody)} </Paragraph>
          </InfoCard.Item>

          <InfoCard.Item>
            <Label size='sm'>{`${localization.datasetForm.fieldLabel.hasAccuracyAnnotation}:`}</Label>
            <Paragraph size='sm'>{getTranslateText(dataset?.hasAccuracyAnnotation?.hasBody)} </Paragraph>
          </InfoCard.Item>

          <InfoCard.Item>
            <Label size='sm'>{`${localization.datasetForm.fieldLabel.hasAvailabilityAnnotation}:`}</Label>
            <Paragraph size='sm'>{getTranslateText(dataset?.hasAvailabilityAnnotation?.hasBody)} </Paragraph>
          </InfoCard.Item>

          <InfoCard.Item>
            <Label size='sm'>{`${localization.datasetForm.fieldLabel.hasRelevanceAnnotation}:`}</Label>
            <Paragraph size='sm'>{getTranslateText(dataset?.hasRelevanceAnnotation?.hasBody)} </Paragraph>
          </InfoCard.Item>

          <InfoCard.Item>
            <Label size='sm'>{`${localization.datasetForm.fieldLabel.qualifiedAttributions}:`}</Label>
            <Paragraph size='sm'>{dataset?.qualifiedAttributions?.map((item) => item)} </Paragraph>
          </InfoCard.Item>

          <InfoCard.Item>
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
                    dataset?.references.map((ref: Reference, index) => (
                      <Table.Row key={`references-${index}`}>
                        <Table.Cell>
                          {/* {getTranslateText(relations.find((rel) => rel.code === ref?.referenceType?.code)?.label) ??
                      ref?.referenceType?.code} */}
                        </Table.Cell>
                        <Table.Cell>
                          {/* {getTranslateText(selectedValues?.find((item) => item.uri === ref?.source?.uri)?.title) ??
                      ref?.source?.uri} */}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table>
            )}

            <Label size='sm'> {localization.datasetForm.fieldLabel.inSeries}</Label>
            <Paragraph size='sm'>{dataset.inSeries}</Paragraph>

            {dataset?.relations && (
              <>
                <Label size='sm'>{localization.datasetForm.fieldLabel.relations}</Label>
                <Table
                  size='sm'
                  className={styles.fullWidth}
                >
                  <Table.Head>
                    <Table.Row>
                      <Table.HeaderCell>{localization.title}</Table.HeaderCell>
                      <Table.HeaderCell>{localization.link}</Table.HeaderCell>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {dataset.relations?.map((item, index) => (
                      <Table.Row key={`relations-tableRow-${index}`}>
                        <Table.Cell>{getTranslateText(item?.prefLabel)}</Table.Cell>
                        <Table.Cell>{item?.uri}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </>
            )}
          </InfoCard.Item>

          <InfoCard.Item>
            <Label size='sm'>{`${localization.datasetForm.fieldLabel.concept}:`}</Label>
            <Paragraph size='sm'>{dataset.concepts?.map((item) => item.uri)} </Paragraph>

            <Label size='sm'>{`${localization.datasetForm.fieldLabel.keyword}:`}</Label>
            <Paragraph size='sm'>{dataset.keyword?.map((item) => getTranslateText(item))} </Paragraph>
          </InfoCard.Item>

          <InfoCard.Item>
            <Label size='sm'>{`${localization.datasetForm.fieldLabel.informationModelsFromFDK}:`}</Label>
            <Paragraph size='sm'>{dataset?.informationModelsFromFDK?.map((item) => item)}</Paragraph>

            <Label size='sm'>{`${localization.datasetForm.fieldLabel.informationModel}:`}</Label>
            <Table
              size='sm'
              className={styles.fullWidth}
            >
              <Table.Head>
                <Table.Row>
                  <Table.HeaderCell>{localization.title}</Table.HeaderCell>
                  <Table.HeaderCell>{localization.link}</Table.HeaderCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {dataset.informationModel?.map((item, index) => (
                  <Table.Row key={`relations-tableRow-${index}`}>
                    <Table.Cell>{getTranslateText(item?.prefLabel)}</Table.Cell>
                    <Table.Cell>{item?.uri}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </InfoCard.Item>

          <InfoCard.Item>
            <Label size='sm'>{localization.datasetForm.heading.contactPoint}</Label>
            <Paragraph>{dataset.contactPoint[0].email}</Paragraph>
            <Paragraph>{dataset.contactPoint[0].hasTelephone}</Paragraph>
            <Paragraph>{dataset.contactPoint[0].hasURL}</Paragraph>
            <Paragraph>{dataset.contactPoint[0].organizationUnit}</Paragraph>
          </InfoCard.Item>
        </InfoCard>
      </DetailsPageLayout.Left>
      <DetailsPageLayout.Right>
        <RightColumn />
      </DetailsPageLayout.Right>
      <DetailsPageLayout.Buttons>
        {hasWritePermission && (
          <div className={styles.set}>
            <LinkButton href={`/catalogs/${catalogId}/datasets/${datasetId}/edit`}>
              {localization.button.edit}
            </LinkButton>

            <DeleteButton
              variant='secondary'
              onClick={() => console.log('delete')}
            />
          </div>
        )}
      </DetailsPageLayout.Buttons>
    </DetailsPageLayout>
  );
};

export default DatasetDetailsPageClient;
