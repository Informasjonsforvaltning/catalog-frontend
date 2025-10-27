import { Dataset, UriWithLabel } from '@catalog-frontend/types';
import { accessRights, getTranslateText, localization } from '@catalog-frontend/utils';
import { Card, Link, Table, Tag } from '@digdir/designsystemet-react';
import { useMemo } from 'react';
import styles from '../details-columns.module.css';
import { identity, isEmpty, pickBy, trim } from 'lodash';

type Props = {
  dataset: Dataset;
  language?: string;
};

const hasNoFieldValues = (values: UriWithLabel) => {
  if (!values) return true;
  return isEmpty(trim(values.uri)) && (isEmpty(values.prefLabel) || isEmpty(pickBy(values.prefLabel, identity)));
};

export const AccessRightsDetails = ({ dataset, language }: Props) => {
  const allLegalBases = useMemo(
    () => [
      ...(dataset.legalBasisForRestriction ?? [])
        .filter((item) => !hasNoFieldValues(item))
        .map((item, index) => ({
          uriWithLabel: item,
          type: 'legalBasisForRestriction',
          index,
        })),
      ...(dataset.legalBasisForProcessing ?? [])
        .filter((item) => !hasNoFieldValues(item))
        .map((item, index) => ({
          uriWithLabel: item,
          type: 'legalBasisForProcessing',
          index,
        })),
      ...(dataset.legalBasisForAccess ?? [])
        .filter((item) => !hasNoFieldValues(item))
        .map((item, index) => ({
          uriWithLabel: item,
          type: 'legalBasisForAccess',
          index,
        })),
    ],
    [dataset.legalBasisForRestriction, dataset.legalBasisForProcessing, dataset.legalBasisForAccess],
  );

  const accessRightsOptions = useMemo(
    () =>
      accessRights.map((accessRight) => {
        return { value: accessRight.uri, label: getTranslateText(accessRight.label, language) };
      }),
    [],
  );

  return (
    <>
      {(dataset?.accessRight || allLegalBases.length > 0) && (
        <div className={styles.infoCardItems}>
          {!isEmpty(dataset.accessRight) && (
            <Tag
              size='sm'
              color='info'
            >
              {accessRightsOptions.find((option) => option.value === dataset.accessRight)?.label}
            </Tag>
          )}
          {allLegalBases.length > 0 && (
            <Card>
              <h4>{localization.datasetForm.fieldLabel.legalBasis}</h4>
              <Table
                size='sm'
                className={styles.table}
              >
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
                          <Table.Cell>{getTranslateText(item?.uriWithLabel.prefLabel, language)}</Table.Cell>
                          <Table.Cell>
                            <Link href={item?.uriWithLabel.uri}>{item?.uriWithLabel.uri}</Link>
                          </Table.Cell>
                          <Table.Cell>{localization.datasetForm.fieldLabel[item?.type]}</Table.Cell>
                        </Table.Row>
                      ),
                  )}
                </Table.Body>
              </Table>
            </Card>
          )}
        </div>
      )}
    </>
  );
};
