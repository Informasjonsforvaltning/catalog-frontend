'use client';

import { Distribution, ReferenceDataCode } from '@catalog-frontend/types';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Heading, Paragraph, Table, TableBody, Tag } from '@digdir/designsystemet-react';
import styles from './distributions.module.scss';
import { useSearchDataServiceByUri } from '../../../../hooks/useSearchService';
import { useSearchMediaTypeByUri } from '../../../../hooks/useReferenceDataSearch';
import { isEmpty } from 'lodash';
import { FieldsetDivider, Link } from '@catalog-frontend/ui';

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

  return (
    <div>
      {distribution && (
        <div>
          <FieldsetDivider />
          {!isEmpty(distribution?.description) && (
            <div className={styles.field}>
              <Heading
                level={5}
                size='2xs'
              >{`${localization.description}:`}</Heading>
              <Paragraph size='sm'>{getTranslateText(distribution?.description, language)}</Paragraph>
            </div>
          )}

          {distribution?.downloadURL && (
            <div className={styles.field}>
              <Heading
                level={5}
                size='2xs'
              >{`${localization.datasetForm.fieldLabel.downloadURL}:`}</Heading>
              {distribution.downloadURL.map((url: string, index: number) => {
                return (
                  <Paragraph
                    size='sm'
                    key={`downloadURL-${index}`}
                  >
                    {url}
                  </Paragraph>
                );
              })}
            </div>
          )}

          {distribution.mediaType && distribution.mediaType.length > 0 && (
            <div className={styles.field}>
              <Heading
                level={5}
                size='2xs'
              >{`${localization.datasetForm.fieldLabel.mediaType}:`}</Heading>
              <ul className={styles.list}>
                {distribution?.mediaType?.map((uri) => (
                  <li key={`mediatype-${uri}`}>
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
                level={5}
                size='2xs'
              >{`${localization.datasetForm.fieldLabel.accessServiceUris}:`}</Heading>
              {
                <Table
                  size='sm'
                  className={styles.table}
                >
                  <Table.Head>
                    <Table.Row>
                      <Table.HeaderCell>{localization.datasetForm.fieldLabel.accessServiceUris}</Table.HeaderCell>
                      <Table.HeaderCell>{localization.publisher}</Table.HeaderCell>
                    </Table.Row>
                  </Table.Head>

                  <TableBody>
                    {distribution.accessServiceUris.map((uri, i) => {
                      const match = selectedDataServices?.find((service) => service.uri === uri);
                      return (
                        <Table.Row key={`service-${uri}-${i}`}>
                          <Table.Cell>
                            {
                              <Link
                                href={uri}
                                target='_blank'
                                rel='noopener noreferrer'
                              >
                                {match ? getTranslateText(match?.title) : uri}
                              </Link>
                            }
                          </Table.Cell>

                          <Table.Cell>{getTranslateText(match?.organization?.prefLabel, language)}</Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </TableBody>
                </Table>
              }
            </div>
          )}

          {distribution.license?.uri && (
            <>
              <Heading
                level={5}
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

          {distribution?.conformsTo && !isEmpty(distribution.conformsTo[0]?.uri) && (
            <div className={styles.field}>
              <Heading
                level={5}
                size='2xs'
              >{`${localization.datasetForm.fieldLabel.standard}:`}</Heading>

              <Table
                size='sm'
                className={styles.table}
              >
                <Table.Head>
                  <Table.Row>
                    <Table.HeaderCell>{localization.title}</Table.HeaderCell>
                    <Table.HeaderCell>{localization.link}</Table.HeaderCell>
                  </Table.Row>
                </Table.Head>
                <TableBody>
                  {distribution?.conformsTo.map((conform) => (
                    <Table.Row key={`conformsTo-${conform.uri}`}>
                      <Table.Cell>{getTranslateText(conform.prefLabel, language)}</Table.Cell>
                      <Table.Cell>{conform.uri}</Table.Cell>
                    </Table.Row>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {distribution?.page && !isEmpty(distribution.page) && (
            <div className={styles.field}>
              <Heading
                level={5}
                size='2xs'
              >{`${localization.datasetForm.fieldLabel.page}:`}</Heading>
              {distribution.page.map((page: { uri: string }, index: number) => {
                return (
                  <Paragraph
                    key={`page-${index}`}
                    size='sm'
                  >
                    {page.uri}
                  </Paragraph>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
