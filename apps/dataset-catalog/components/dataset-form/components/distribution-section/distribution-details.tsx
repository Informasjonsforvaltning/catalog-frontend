'use client';

import { Distribution, ReferenceDataCode } from '@catalog-frontend/types';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Paragraph, Tag, Table, TableBody, Heading } from '@digdir/designsystemet-react';
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
}

export const DistributionDetails = ({ distribution, searchEnv, referenceDataEnv, openLicenses }: Props) => {
  const { data: selectedDataServices } = useSearchDataServiceByUri(searchEnv, distribution?.accessServiceUris ?? []);

  const { data: selectedMediaTypes } = useSearchMediaTypeByUri(distribution?.mediaType ?? [], referenceDataEnv);

  const hasConformsToValues = _.some(distribution?.conformsTo, (item) => {
    const uri = item.uri || '';

    const prefLabelNb = _.get(item, 'prefLabel.nb');
    const prefLabelNbString = Array.isArray(prefLabelNb) ? prefLabelNb.join(' ') : prefLabelNb || '';

    return _.trim(uri) || _.trim(prefLabelNbString);
  });

  return (
    <div>
      {distribution && (
        <div>
          <FieldsetDivider />
          {distribution.description?.nb && (
            <div className={styles.field}>
              <Heading
                level={5}
                size='2xs'
              >{`${localization.description}:`}</Heading>
              <Paragraph size='sm'>{distribution.description.nb}</Paragraph>
            </div>
          )}

          {distribution?.downloadURL && distribution?.downloadURL[0] && (
            <div className={styles.field}>
              <Heading
                level={5}
                size='2xs'
              >{`${localization.datasetForm.fieldLabel.downloadURL}:`}</Heading>
              <Paragraph size='sm'>{distribution?.downloadURL?.[0] ?? ''}</Paragraph>
            </div>
          )}

          {distribution.mediaType && distribution.mediaType.length > 0 && (
            <div className={styles.field}>
              <Heading
                level={5}
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
                level={5}
                size='2xs'
              >{`${localization.datasetForm.fieldLabel.accessService}:`}</Heading>
              <ul className={styles.list}>
                {distribution.accessServiceUris.map((uri, i) => {
                  const match = selectedDataServices?.find((type) => type.uri === uri);
                  return (
                    <li key={`service-${uri}-${i}`}>
                      <Tag
                        color='info'
                        size='sm'
                      >
                        {match ? getTranslateText(match?.title) : uri}
                      </Tag>
                    </li>
                  );
                })}
              </ul>
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
                  {getTranslateText(openLicenses.find((license) => license.uri === distribution.license?.uri)?.label)}
                </Paragraph>
              </div>
            </>
          )}

          {distribution.conformsTo && hasConformsToValues && (
            <div className={styles.field}>
              <Heading
                level={5}
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
                  {distribution.conformsTo.map((conform, index) => (
                    <Table.Row key={`conformsTo-${index}-${conform.uri}`}>
                      <Table.Cell>{getTranslateText(conform.prefLabel)}</Table.Cell>
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
                level={5}
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
