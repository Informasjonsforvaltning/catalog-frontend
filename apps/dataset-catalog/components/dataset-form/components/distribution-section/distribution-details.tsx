'use client';

import { Distribution, ReferenceDataCode } from '@catalog-frontend/types';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Paragraph, Label, Tag, Table, TableBody } from '@digdir/designsystemet-react';
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
  const { data: selectedDataServices } = useSearchDataServiceByUri(searchEnv, distribution?.accessServiceList ?? []);

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
              <Label size='sm'>{`${localization.description}:`}</Label>
              <Paragraph size='sm'>{distribution.description.nb}</Paragraph>
            </div>
          )}

          {distribution.downloadURL && distribution.downloadURL.length > 0 && (
            <div className={styles.field}>
              <Label size='sm'>{`${localization.datasetForm.fieldLabel.downloadURL}:`}</Label>
              <Paragraph size='sm'>{distribution?.downloadURL?.[0] ?? ''}</Paragraph>
            </div>
          )}

          {distribution.mediaType && distribution.mediaType.length > 0 && (
            <div className={styles.field}>
              <Label size='sm'>{`${localization.datasetForm.fieldLabel.mediaType}:`}</Label>
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

          {distribution.accessServiceList && distribution.accessServiceList.length > 0 && (
            <div className={styles.field}>
              <Label size='sm'>{`${localization.datasetForm.fieldLabel.accessService}:`}</Label>

              <ul className={styles.list}>
                {distribution.accessServiceList?.map((uri, i) => (
                  <li key={`service-${uri}-${i}`}>
                    <Tag
                      key={uri}
                      color='third'
                      size='sm'
                    >
                      {getTranslateText(selectedDataServices?.find((type) => type.uri === uri)?.title) ?? uri}
                    </Tag>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {distribution.license?.uri && (
            <>
              <Label size='sm'>{`${localization.datasetForm.fieldLabel.license}:`}</Label>
              <div className={styles.field}>
                <Paragraph size='sm'>
                  {getTranslateText(openLicenses.find((license) => license.uri === distribution.license?.uri)?.label)}
                </Paragraph>
              </div>
            </>
          )}

          {distribution.conformsTo && hasConformsToValues && (
            <div className={styles.field}>
              <Label size='sm'>{`${localization.datasetForm.fieldLabel.standard}:`}</Label>

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
              <Label size='sm'>{`${localization.datasetForm.fieldLabel.distributionLink}:`}</Label>
              <Paragraph size='sm'>{distribution?.page?.[0].uri}</Paragraph>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
