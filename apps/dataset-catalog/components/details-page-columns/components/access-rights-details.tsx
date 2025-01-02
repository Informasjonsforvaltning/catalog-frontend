import { AccessRights, Dataset, UriWithLabel } from '@catalog-frontend/types';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Card, Label, Table, Tag } from '@digdir/designsystemet-react';
import { useMemo } from 'react';
import styles from '../details-columns.module.css';
import _ from 'lodash';

type Props = {
  dataset: Dataset;
};

export const AccessRightsDetails = ({ dataset }: Props) => {
  const allLegalBases = useMemo(
    () => [
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
    ],
    [dataset.legalBasisForRestriction, dataset.legalBasisForProcessing, dataset.legalBasisForAccess],
  );

  const accessRightsOptions = useMemo(
    () => [
      { value: AccessRights.PUBLIC, label: localization.datasetForm.accessRight.public },
      { value: AccessRights.RESTRICTED, label: localization.datasetForm.accessRight.restricted },
      { value: AccessRights.NON_PUBLIC, label: localization.datasetForm.accessRight.nonPublic },
    ],
    [],
  );

  const hasNoFieldValues = (values: UriWithLabel) => {
    if (!values) return true;
    return _.isEmpty(_.trim(values.uri)) && _.isEmpty(_.pickBy(values.prefLabel, _.identity));
  };

  return (
    <>
      {dataset?.accessRights && (
        <div className={styles.infoCardItems}>
          <Tag
            size='sm'
            color='info'
          >
            {dataset.accessRights?.uri &&
              accessRightsOptions.find((option) => option.value === dataset.accessRights?.uri)?.label}
          </Tag>
          {dataset?.accessRights.uri !== AccessRights.PUBLIC && allLegalBases.length > 0 && (
            <Card>
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
            </Card>
          )}
        </div>
      )}
    </>
  );
};
