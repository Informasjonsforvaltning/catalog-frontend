import { Distribution, ReferenceDataCode, Search } from '@catalog-frontend/types';
import { localization, getTranslateText, validUUID } from '@catalog-frontend/utils';
import { Card, Heading, Link, Paragraph, Table, TableBody, Tag } from '@digdir/designsystemet-react';
import styles from '../details-columns.module.css';
import { useSearchFileTypeByUri, useSearchMediaTypeByUri } from '../../../hooks/useReferenceDataSearch';
import { isEmpty } from 'lodash';
import { FieldsetDivider } from '@catalog-frontend/ui';
import { useSearchDataServiceByUri } from '@dataset-catalog/hooks/useSearchService';

type Props = {
  distribution: Partial<Distribution>;
  searchEnv: string;
  referenceDataEnv: string;
  openLicenses: ReferenceDataCode[];
  language?: string;
};

export const DistributionDetailsCard = ({
  distribution,
  searchEnv,
  referenceDataEnv,
  openLicenses,
  language,
}: Props) => {
  const { data: formats } = useSearchFileTypeByUri(distribution.format, referenceDataEnv);
  const { data: selectedDataServices } = useSearchDataServiceByUri(searchEnv, distribution?.accessServices ?? []);
  const { data: selectedMediaTypes } = useSearchMediaTypeByUri(distribution?.mediaType ?? [], referenceDataEnv);

  const getDataNorgeUri = (id: string | undefined, resourceType: Search.ResourceType) => {
    return validUUID(id) ? `${referenceDataEnv}/${resourceType}/${id}` : '/not-found';
  };

  return (
    <Card>
      <div className={styles.infoCardItems}>
        {distribution?.title && !isEmpty(distribution?.title) && (
          <div>
            <Heading
              level={4}
              size='2xs'
            >
              {localization.title}
            </Heading>
            <p>{getTranslateText(distribution?.title, language)}</p>
          </div>
        )}

        {distribution?.accessURL && (
          <div>
            <Heading
              level={4}
              size='2xs'
            >
              {localization.datasetForm.fieldLabel.accessURL}
            </Heading>
            {distribution.accessURL.map((url: string, index: number) => {
              return (
                <Paragraph
                  size={'sm'}
                  key={`accessURL-${index}`}
                >
                  <Link href={url}>{url}</Link>
                </Paragraph>
              );
            })}
          </div>
        )}

        {distribution?.format && !isEmpty(distribution.format) && (
          <div>
            <Heading
              level={4}
              size='2xs'
            >
              {localization.datasetForm.fieldLabel.format}
            </Heading>
            <li className={styles.list}>
              {distribution.format?.map((item: string, index) => {
                const match = formats && formats.find((format: any) => format?.uri === item);
                return (
                  <Tag
                    size='sm'
                    color='info'
                    key={`distributionformat-${index}`}
                  >
                    {match ? getTranslateText(match?.label, language) : item}
                  </Tag>
                );
              })}
            </li>
          </div>
        )}
      </div>
      <div>
        {distribution && (
          <div>
            <FieldsetDivider />
            {!isEmpty(distribution?.description) && (
              <div className={styles.distributionField}>
                <Heading
                  level={5}
                  size='2xs'
                >{`${localization.description}:`}</Heading>
                <Paragraph size='sm'>{getTranslateText(distribution?.description, language)}</Paragraph>
              </div>
            )}

            {!isEmpty(distribution?.downloadURL) && (
              <div className={styles.distributionField}>
                <Heading
                  level={5}
                  size='2xs'
                >{`${localization.datasetForm.fieldLabel.downloadURL}:`}</Heading>
                {distribution.downloadURL?.map((url: string, index: number) => {
                  return (
                    <Paragraph
                      size={'sm'}
                      key={`downloadURL-${index}`}
                    >
                      <Link href={url}>{url}</Link>
                    </Paragraph>
                  );
                })}
              </div>
            )}

            {distribution.mediaType && distribution.mediaType.length > 0 && (
              <div className={styles.distributionField}>
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

            {distribution?.accessServices && distribution.accessServices.length > 0 && (
              <div className={styles.distributionField}>
                <Heading
                  level={5}
                  size='2xs'
                >{`${localization.datasetForm.fieldLabel.accessServices}:`}</Heading>
                {
                  <Table
                    size='sm'
                    className={styles.distributionTable}
                  >
                    <Table.Head>
                      <Table.Row>
                        <Table.HeaderCell>{localization.datasetForm.fieldLabel.accessServices}</Table.HeaderCell>
                        <Table.HeaderCell>{localization.publisher}</Table.HeaderCell>
                      </Table.Row>
                    </Table.Head>

                    <TableBody>
                      {distribution.accessServices.map((uri, i) => {
                        const match = selectedDataServices?.find((service) => service.uri === uri);
                        return (
                          <Table.Row key={`service-${uri}-${i}`}>
                            <Table.Cell>
                              {match ? (
                                <Link
                                  href={getDataNorgeUri(match.id, 'data-services')}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                >
                                  {getTranslateText(match.title)}
                                </Link>
                              ) : (
                                <Link
                                  href={uri}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                >
                                  {uri}
                                </Link>
                              )}
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

            {distribution.license && (
              <>
                <Heading
                  level={5}
                  size='2xs'
                >{`${localization.datasetForm.fieldLabel.license}:`}</Heading>
                <div className={styles.distributionField}>
                  <Paragraph size='sm'>
                    {getTranslateText(
                      openLicenses.find((license) => license.uri === distribution.license)?.label,
                      language,
                    )}
                  </Paragraph>
                </div>
              </>
            )}

            {!isEmpty(distribution?.conformsTo) && (
              <div className={styles.distributionField}>
                <Heading
                  level={5}
                  size='2xs'
                >{`${localization.datasetForm.fieldLabel.standard}:`}</Heading>

                <Table
                  size='sm'
                  className={styles.distributionTable}
                >
                  <Table.Head>
                    <Table.Row>
                      <Table.HeaderCell>{localization.title}</Table.HeaderCell>
                      <Table.HeaderCell>{localization.link}</Table.HeaderCell>
                    </Table.Row>
                  </Table.Head>
                  <TableBody>
                    {distribution.conformsTo?.map((conform) => (
                      <Table.Row key={`conformsTo-${conform.uri}`}>
                        <Table.Cell>{getTranslateText(conform.prefLabel, language)}</Table.Cell>
                        <Table.Cell>
                          <Link href={conform.uri}>{conform.uri}</Link>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {distribution?.page && !isEmpty(distribution.page) && (
              <div className={styles.distributionField}>
                <Heading
                  level={5}
                  size='2xs'
                >{`${localization.datasetForm.fieldLabel.page}:`}</Heading>
                {distribution.page.map((page, index: number) => {
                  return (
                    <Paragraph
                      size={'sm'}
                      key={`page-${index}`}
                    >
                      <Link href={page}>{page}</Link>
                    </Paragraph>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
