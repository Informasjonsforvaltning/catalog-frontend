import { Dataset, UriWithLabel } from '@catalog-frontend/types';
import { accessRightPublic, accessRights, getTranslateText, localization } from '@catalog-frontend/utils';
import { Card, Table, Tag } from '@digdir/designsystemet-react';
import { useMemo } from 'react';
import styles from '../details-columns.module.css';
import _ from 'lodash';

type Props = {
  dataset: Dataset;
};

const hasNoFieldValues = (values: UriWithLabel) => {
  if (!values) return true;
  return (
    _.isEmpty(_.trim(values.uri)) && (_.isEmpty(values.prefLabel) || _.isEmpty(_.pickBy(values.prefLabel, _.identity)))
  );
};

export const AccessRightsDetails = ({ dataset }: Props) => {
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
        return { value: accessRight.uri, label: getTranslateText(accessRight.label) };
      }),
    [],
  );

  return (
    <>
      {dataset?.accessRight && (
        <div className={styles.infoCardItems}>
          <Tag
            size='sm'
            color='info'
          >
            {dataset.accessRight && accessRightsOptions.find((option) => option.value === dataset.accessRight)?.label}
          </Tag>
          {dataset?.accessRight !== accessRightPublic.uri && allLegalBases.length > 0 && (
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
                          <Table.Cell>{getTranslateText(item?.uriWithLabel.prefLabel)}</Table.Cell>
                          <Table.Cell>{item?.uriWithLabel.uri}</Table.Cell>
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
