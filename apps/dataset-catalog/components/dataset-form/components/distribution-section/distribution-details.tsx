'use client';

import { Distribution, ReferenceDataCode } from '@catalog-frontend/types';
import { getTranslateText, localization, validUUID } from '@catalog-frontend/utils';
import { Paragraph, Tag, Table, TableBody, Heading, Link } from '@digdir/designsystemet-react';
import styles from './distributions.module.css';
import { useSearchDataServiceByUri } from '../../../../hooks/useSearchService';
import { useSearchMediaTypeByUri } from '../../../../hooks/useReferenceDataSearch';
import _ from 'lodash';
import { FieldsetDivider } from '@catalog-frontend/ui';

interface Props {
  searchEnv: string;
  referenceDataEnv: string;
  openLicenses: ReferenceDataCode[];
  distribution: Distribution;
  language?: string;
}

export const DistributionDetails = ({ distribution, searchEnv, referenceDataEnv, openLicenses, language }: Props) => {
  const { data: selectedDataServices } = useSearchDataServiceByUri(searchEnv, distribution?.accessServiceUris ?? []);
  const { data: selectedMediaTypes } = useSearchMediaTypeByUri(distribution?.mediaType ?? [], referenceDataEnv);

  type ResourceType = 'datasets' | 'information-models' | 'data-services' | 'concepts';
  const getDataNorgeUri = (id: string | undefined, resourceType: ResourceType) => {
    return validUUID(id) ? `${referenceDataEnv}/${resourceType}/${id}` : '/not-found';
  };

  return (
    <div>
      {distribution && (
        <div>
          <FieldsetDivider />
          {distribution?.description && (
            <div className={styles.field}>
              <Heading
                level={4}
                size='2xs'
              >{`${localization.description}:`}</Heading>
              <Paragraph size='sm'>{getTranslateText(distribution?.description, language)}</Paragraph>
            </div>
          )}

          {distribution?.downloadURL && distribution?.downloadURL[0] && (
            <div className={styles.field}>
              <Heading
                level={4}
                size='2xs'
              >{`${localization.datasetForm.fieldLabel.downloadURL}:`}</Heading>
              <Paragraph size='sm'>{distribution?.downloadURL?.[0] ?? ''}</Paragraph>
            </div>
          )}

          {distribution.mediaType && distribution.mediaType.length > 0 && (
            <div className={styles.field}>
              <Heading
                level={4}
                size='2xs'
              >{`${localization.datasetForm.fieldLabel.mediaType}:`}</Heading>
              <ul className={styles.list}>
                {distribution?.mediaType?.map((uri, index) => (
                  <li key={`mediatype-${uri}-${index}`}>
                    <Tag
                      size='sm'
                      color='info'
                    >
                      {(selectedMediaTypes?.find((type) => type.uri === uri) ?? {}).code ?? uri}
                    </Tag>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {distribution?.accessServiceUris && distribution.accessServiceUris.length > 0 && (
            <div className={styles.field}>
              <Heading
                level={4}
                size='2xs'
              >{`${localization.datasetForm.fieldLabel.accessService}:`}</Heading>

              <Table size='sm'>
                <Table.Head>
                  <Table.Row>
                    <Table.HeaderCell>{localization.resourceType.dataService}</Table.HeaderCell>
                    <Table.HeaderCell>{localization.publisher}</Table.HeaderCell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {distribution.accessServiceUris &&
                    distribution.accessServiceUris.map((uri, i) => {
                      const match = selectedDataServices?.find((type) => type.uri === uri);
                      return match ? (
                        <Table.Row key={`accessSerivce-row-${i}`}>
                          <Table.Cell>
                            <Link href={getDataNorgeUri(match.id, 'data-services')}>
                              {getTranslateText(match?.title, language) || localization.noTitleAvailable}
                            </Link>
                          </Table.Cell>
                          <Table.Cell>{getTranslateText(match?.organization?.prefLabel)}</Table.Cell>
                        </Table.Row>
                      ) : (
                        <></>
                      );
                    })}
                </Table.Body>
              </Table>
            </div>
          )}

          {distribution.license?.uri && (
            <>
              <Heading
                level={4}
                size='2xs'
              >{`${localization.datasetForm.fieldLabel.license}:`}</Heading>
              <div className={styles.field}>
                <Paragraph size='sm'>
                  {getTranslateText(
                    openLicenses.find((license) => license.uri === distribution.license?.uri)?.label,
                    language,
                  )}
                </Paragraph>
              </div>
            </>
          )}

          {distribution?.conformsTo && !_.isEmpty(distribution.conformsTo[0]?.prefLabel) && (
            <div className={styles.field}>
              <Heading
                level={4}
                size='2xs'
              >{`${localization.datasetForm.fieldLabel.standard}:`}</Heading>

              <Table size='sm'>
                <Table.Head>
                  <Table.Row>
                    <Table.HeaderCell>{localization.title}</Table.HeaderCell>
                    <Table.HeaderCell>{localization.link}</Table.HeaderCell>
                  </Table.Row>
                </Table.Head>
                <TableBody>
                  {distribution?.conformsTo.map((conform, index) => (
                    <Table.Row key={`conformsTo-${index}-${conform.uri}`}>
                      <Table.Cell>{getTranslateText(conform.prefLabel, language)}</Table.Cell>
                      <Table.Cell>{conform.uri}</Table.Cell>
                    </Table.Row>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {distribution.page && distribution.page?.[0].uri && (
            <div className={styles.field}>
              <Heading
                level={4}
                size='2xs'
              >{`${localization.datasetForm.fieldLabel.distributionLink}:`}</Heading>
              <Paragraph size='sm'>{distribution?.page?.[0].uri}</Paragraph>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
