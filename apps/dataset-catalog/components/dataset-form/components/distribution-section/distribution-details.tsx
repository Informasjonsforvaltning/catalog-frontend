"use client";

import { Distribution, ReferenceDataCode } from "@catalog-frontend/types";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import {
  Heading,
  Paragraph,
  Table,
  TableBody,
  Tag,
} from "@digdir/designsystemet-react";
import styles from "./distributions.module.scss";
import { isEmpty } from "lodash";
import { FieldsetDivider } from "@catalog-frontend/ui";
import { SearchObject } from "../../../../../../libs/types/src/lib/search";

interface Props {
  selectedDataServices: SearchObject[];
  selectedMediaTypes: ReferenceDataCode[];
  openLicenses: ReferenceDataCode[];
  distributionStatuses: ReferenceDataCode[];
  distribution: Distribution;
  language?: string;
}

export const DistributionDetails = ({
  selectedDataServices,
  selectedMediaTypes,
  distribution,
  openLicenses,
  distributionStatuses,
  language,
}: Props) => {
  return (
    <div>
      {distribution && (
        <div>
          <FieldsetDivider />
          {!isEmpty(distribution?.description) && (
            <div className={styles.field}>
              <Heading
                level={5}
                data-size="2xs"
              >{`${localization.description}:`}</Heading>
              <Paragraph data-size="sm">
                {getTranslateText(distribution?.description, language)}
              </Paragraph>
            </div>
          )}

          {!isEmpty(distribution?.downloadURL) && (
            <div className={styles.field}>
              <Heading
                level={5}
                data-size="2xs"
              >{`${localization.datasetForm.fieldLabel.downloadURL}:`}</Heading>
              {distribution.downloadURL?.map((url: string, index: number) => {
                return (
                  <Paragraph data-size="sm" key={`downloadURL-${index}`}>
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
                data-size="2xs"
              >{`${localization.datasetForm.fieldLabel.mediaType}:`}</Heading>
              <ul className={styles.list}>
                {distribution?.mediaType?.map((uri) => (
                  <li key={`mediatype-${uri}`}>
                    <Tag data-size="sm" data-color="info">
                      {(
                        selectedMediaTypes?.find((type) => type.uri === uri) ??
                        {}
                      ).code ?? uri}
                    </Tag>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {distribution?.accessServices &&
            distribution.accessServices.length > 0 && (
              <div className={styles.field}>
                <Heading
                  level={5}
                  data-size="2xs"
                >{`${localization.datasetForm.fieldLabel.accessServices}:`}</Heading>
                {
                  <Table data-size="sm" className={styles.table}>
                    <Table.Head>
                      <Table.Row>
                        <Table.HeaderCell>
                          {localization.datasetForm.fieldLabel.accessServices}
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                          {localization.publisher}
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Head>

                    <TableBody>
                      {distribution.accessServices.map((uri, i) => {
                        const match = selectedDataServices?.find(
                          (service) => service.uri === uri,
                        );
                        return (
                          <Table.Row key={`service-${uri}-${i}`}>
                            <Table.Cell>
                              {match ? getTranslateText(match?.title) : uri}
                            </Table.Cell>
                            <Table.Cell>
                              {getTranslateText(
                                match?.organization?.prefLabel,
                                language,
                              )}
                            </Table.Cell>
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
                data-size="2xs"
              >{`${localization.datasetForm.fieldLabel.license}:`}</Heading>
              <div className={styles.field}>
                <Paragraph data-size="sm">
                  {getTranslateText(
                    openLicenses.find(
                      (license) => license.uri === distribution.license,
                    )?.label,
                    language,
                  )}
                </Paragraph>
              </div>
            </>
          )}

          {distribution.status && (
            <div className={styles.field}>
              <Heading
                level={5}
                data-size="2xs"
              >{`${localization.datasetForm.fieldLabel.distributionStatus}:`}</Heading>
              <Paragraph data-size="sm">
                {getTranslateText(
                  distributionStatuses.find(
                    (status) => status.uri === distribution.status,
                  )?.label,
                  language,
                ) || distribution.status}
              </Paragraph>
            </div>
          )}

          {!isEmpty(distribution?.conformsTo) && (
            <div className={styles.field}>
              <Heading
                level={5}
                data-size="2xs"
              >{`${localization.datasetForm.fieldLabel.standard}:`}</Heading>

              <Table data-size="sm" className={styles.table}>
                <Table.Head>
                  <Table.Row>
                    <Table.HeaderCell>{localization.title}</Table.HeaderCell>
                    <Table.HeaderCell>{localization.link}</Table.HeaderCell>
                  </Table.Row>
                </Table.Head>
                <TableBody>
                  {distribution.conformsTo?.map((conform) => (
                    <Table.Row key={`conformsTo-${conform.uri}`}>
                      <Table.Cell>
                        {getTranslateText(conform.prefLabel, language)}
                      </Table.Cell>
                      <Table.Cell>{conform.uri}</Table.Cell>
                    </Table.Row>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!isEmpty(distribution.rights?.reuserGuidelines) && (
            <div className={styles.field}>
              <Heading
                level={5}
                data-size="2xs"
              >{`${localization.datasetForm.fieldLabel.reuserGuidelines}:`}</Heading>
              {distribution.rights?.reuserGuidelines?.map(
                (url: string, index: number) => (
                  <Paragraph key={`reuserGuidelines-${index}`} data-size="sm">
                    {url}
                  </Paragraph>
                ),
              )}
            </div>
          )}

          {distribution?.page && !isEmpty(distribution.page) && (
            <div className={styles.field}>
              <Heading
                level={5}
                data-size="2xs"
              >{`${localization.datasetForm.fieldLabel.page}:`}</Heading>
              {distribution.page.map((page: string, index: number) => {
                return (
                  <Paragraph key={`page-${index}`} data-size="sm">
                    {page}
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
