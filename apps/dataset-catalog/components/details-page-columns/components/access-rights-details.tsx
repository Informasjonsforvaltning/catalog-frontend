import { Dataset, UriWithLabel } from "@catalog-frontend/types";
import {
  accessRights,
  getTranslateText,
  localization,
} from "@catalog-frontend/utils";
import { Card, Link, Table, Tag } from "@digdir/designsystemet-react";
import { useMemo } from "react";
import styles from "../details-columns.module.css";
import { identity, isEmpty, pickBy, trim } from "lodash";

type Props = {
  dataset: Dataset;
  language?: string;
};

const hasNoFieldValues = (values: UriWithLabel) => {
  if (!values) return true;
  return (
    isEmpty(trim(values.uri)) &&
    (isEmpty(values.prefLabel) || isEmpty(pickBy(values.prefLabel, identity)))
  );
};

export const AccessRightsDetails = ({ dataset, language }: Props) => {
  const allLegalBases = useMemo(
    () => [
      ...(dataset.legalBasisForRestriction ?? [])
        .filter((item) => !hasNoFieldValues(item))
        .map((item, index) => ({
          uriWithLabel: item,
          type: "legalBasisForRestriction",
          index,
        })),
      ...(dataset.legalBasisForProcessing ?? [])
        .filter((item) => !hasNoFieldValues(item))
        .map((item, index) => ({
          uriWithLabel: item,
          type: "legalBasisForProcessing",
          index,
        })),
      ...(dataset.legalBasisForAccess ?? [])
        .filter((item) => !hasNoFieldValues(item))
        .map((item, index) => ({
          uriWithLabel: item,
          type: "legalBasisForAccess",
          index,
        })),
    ],
    [
      dataset.legalBasisForRestriction,
      dataset.legalBasisForProcessing,
      dataset.legalBasisForAccess,
    ],
  );

  const accessRightsOptions = useMemo(
    () =>
      accessRights.map((accessRight) => {
        return {
          value: accessRight.uri,
          label: getTranslateText(accessRight.label, language),
        };
      }),
    [],
  );

  return (
    <>
      {(dataset?.accessRight ||
        dataset?.applicableLegislation ||
        allLegalBases.length > 0) && (
        <div className={styles.infoCardItems}>
          {!isEmpty(dataset.accessRight) && (
            <Tag data-size="sm" data-color="info">
              {
                accessRightsOptions.find(
                  (option) => option.value === dataset.accessRight,
                )?.label
              }
            </Tag>
          )}
          {(dataset.applicableLegislation || allLegalBases.length > 0) && (
            <div className={styles.infoCardItems}>
              <h4>{localization.applicableLegislation.fieldLabel}</h4>
              <Table data-size="sm" className={styles.table}>
                <Table.Head>
                  <Table.Row>
                    <Table.HeaderCell>{localization.title}</Table.HeaderCell>
                    <Table.HeaderCell>
                      {`${localization.applicableLegislation.description}/${localization.datasetForm.fieldLabel.type}`}
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      {`${localization.applicableLegislation.references.fieldLabel}/${localization.link}`}
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {dataset.applicableLegislation &&
                    dataset.applicableLegislation.map(
                      (item, i) =>
                        item.title &&
                        item.description && (
                          <Table.Row key={`applicable-legislation-${i}`}>
                            <Table.Cell>
                              {getTranslateText(item?.title, language)}
                            </Table.Cell>
                            <Table.Cell>
                              {getTranslateText(item?.description, language)}
                            </Table.Cell>
                            <Table.Cell>
                              {item.references &&
                                item.references.map((reference, index) => (
                                  <Link
                                    key={`applicable-legislation-reference-${index}`}
                                    href={reference}
                                  >
                                    {reference}
                                  </Link>
                                ))}
                            </Table.Cell>
                          </Table.Row>
                        ),
                    )}
                  {allLegalBases.map(
                    (item, i) =>
                      item?.uriWithLabel && (
                        <Table.Row key={`${item.type}-tableRow-${i}`}>
                          <Table.Cell>
                            {getTranslateText(
                              item?.uriWithLabel.prefLabel,
                              language,
                            )}
                          </Table.Cell>

                          <Table.Cell>
                            {
                              localization.datasetForm.fieldLabel[
                                item?.type as keyof typeof localization.datasetForm.fieldLabel
                              ]
                            }
                            {` (${localization.deprecated})`}
                          </Table.Cell>
                          <Table.Cell>
                            <Link href={item?.uriWithLabel.uri}>
                              {item?.uriWithLabel.uri}
                            </Link>
                          </Table.Cell>
                        </Table.Row>
                      ),
                  )}
                </Table.Body>
              </Table>
            </div>
          )}
        </div>
      )}
    </>
  );
};
