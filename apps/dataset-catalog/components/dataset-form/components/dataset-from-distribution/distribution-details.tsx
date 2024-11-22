'use client';

import { Dataset, ReferenceDataCode } from '@catalog-frontend/types';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Paragraph, Label, Tag, Divider, Table, TableBody } from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';
import styles from './distributions.module.css';
import { useSearchDataServiceByUri } from '../../../../hooks/useSearchService';
import { useSearchMediaTypeByUri } from '../../../../hooks/useReferenceDataSearch';
import _ from 'lodash';

interface Props {
  index: number;
  searchEnv: string;
  referenceDataEnv: string;
  openLicenses: ReferenceDataCode[];
}

export const DistributionDetails = ({ index, searchEnv, referenceDataEnv, openLicenses }: Props) => {
  const { values } = useFormikContext<Dataset>();
  const distribution = values?.distribution?.[index];

  const { data: selectedDataServices, isLoading: isLoadingSelectedDataServices } = useSearchDataServiceByUri(
    searchEnv,
    distribution?.accessServiceList ?? [],
  );

  const { data: selectedMediaTypes, isLoading: loadingSelectedMediaTypes } = useSearchMediaTypeByUri(
    distribution?.mediaType ?? [],
    referenceDataEnv,
  );

  const hasConformsToValues = _.some(distribution?.conformsTo, (item) => {
    return _.trim(item.uri) || _.trim(_.get(item, 'prefLabel.nb'));
  });

  return (
    <div>
      {distribution && (
        <div>
          <Divider />
          {distribution.description?.nb && (
            <div className={styles.field}>
              <Label>{`${localization.description}:`}</Label>
              <Paragraph>{distribution.description.nb}</Paragraph>
            </div>
          )}

          {distribution.downloadURL && distribution.downloadURL.length > 0 && (
            <div className={styles.field}>
              <Label>{`${localization.datasetForm.fieldLabel.downloadUrl}:`}</Label>
              <Paragraph>{distribution?.downloadURL?.[0] ?? ''}</Paragraph>
            </div>
          )}

          {distribution.mediaType && distribution.mediaType.length > 0 && (
            <div className={styles.field}>
              <Label>{`${localization.datasetForm.fieldLabel.mediaTypes}:`}</Label>
              <ul className={styles.list}>
                {distribution?.mediaType?.map((uri) => (
                  <li key={uri}>
                    <Tag color='third'>{(selectedMediaTypes?.find((type) => type.uri === uri) ?? {}).code ?? uri}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {distribution.accessServiceList && distribution.accessServiceList.length > 0 && (
            <div className={styles.field}>
              <Label>{`${localization.datasetForm.fieldLabel.accessService}:`}</Label>

              <ul className={styles.list}>
                {distribution.accessServiceList?.map((uri) => (
                  <li key={uri}>
                    <Tag
                      key={uri}
                      color='third'
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
              <Label>
                <Label>{`${localization.datasetForm.fieldLabel.license}:`}</Label>
              </Label>
              <div className={styles.field}>
                <Paragraph>
                  {getTranslateText(openLicenses.find((license) => license.uri === distribution.license?.uri)?.label)}
                </Paragraph>
              </div>
            </>
          )}

          {distribution.conformsTo && hasConformsToValues && (
            <div className={styles.field}>
              <Label>{`${localization.datasetForm.fieldLabel.standard}:`}</Label>

              <Table size='sm'>
                <Table.Head>
                  <Table.Row>
                    <Table.HeaderCell>{localization.title}</Table.HeaderCell>
                    <Table.HeaderCell>{localization.link}</Table.HeaderCell>
                  </Table.Row>
                </Table.Head>
                <TableBody>
                  {distribution.conformsTo.map((conform, index) => (
                    <Table.Row key={index}>
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
              <Label>{`${localization.datasetForm.fieldLabel.distributionLink}:`}</Label>
              <Paragraph>{distribution?.page?.[0].uri}</Paragraph>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
