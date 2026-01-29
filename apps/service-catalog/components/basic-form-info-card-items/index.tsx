import { isEmpty } from "lodash";
import { Service } from "@catalog-frontend/types";
import { Heading, Link, Paragraph, Table } from "@digdir/designsystemet-react";
import {
  DividerLine,
  InfoCard,
  ReferenceDataTags,
  useSearchAdministrativeUnitsByUri,
  useSearchConceptsByUri,
} from "@catalog-frontend/ui";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import styles from "./basic-form-info-card-items.module.css";

type Props = {
  language: string;
  referenceDataEnv: string;
  searchEnv: string;
  service: Service;
};

export const BasicServiceFormInfoCardItems = (props: Props) => {
  const { language, referenceDataEnv, searchEnv, service } = props;

  const { data: spatial } = useSearchAdministrativeUnitsByUri(
    service.spatial,
    referenceDataEnv,
  );

  const { data: concepts } = useSearchConceptsByUri(
    searchEnv,
    service?.subject ?? [],
  );

  return (
    <InfoCard>
      <InfoCard.Item title={`${localization.description}:`}>
        {getTranslateText(service.description, language)}
      </InfoCard.Item>

      <InfoCard.Item title={`${localization.serviceCatalog.produces}:`}>
        {!service.produces?.length && (
          <Paragraph size="small" className={styles.content}>
            {localization.none}
          </Paragraph>
        )}
        {service.produces?.map((produce) => (
          <div key={produce.identifier}>
            <Heading size="2xs" level={4} className={styles.heading}>
              {getTranslateText(produce.title, language) || localization.noName}
            </Heading>

            <DividerLine />

            <Paragraph size="small" className={styles.content}>
              <span className={styles.bold}>{localization.description}:</span>
              {getTranslateText(produce.description, language)}
            </Paragraph>
          </div>
        ))}
      </InfoCard.Item>

      {service.homepage && (
        <InfoCard.Item title={`${localization.homepage}:`}>
          {service.homepage}
        </InfoCard.Item>
      )}

      {!isEmpty(service.spatial) && (
        <InfoCard.Item title={localization.serviceForm.fieldLabel.spatial}>
          <ReferenceDataTags values={service.spatial} data={spatial} />
        </InfoCard.Item>
      )}

      {!isEmpty(service.subject) && (
        <InfoCard.Item title={localization.serviceForm.fieldLabel.subject}>
          <Table size="sm" className={styles.table}>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell>
                  {localization.serviceForm.fieldLabel.subject}
                </Table.HeaderCell>
                <Table.HeaderCell>{localization.publisher}</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {service.subject?.map((concept) => {
                const match = concepts?.find((item) => item.uri === concept);
                return (
                  <Table.Row key={concept}>
                    <Table.Cell>
                      <Link href={`${referenceDataEnv}/concepts/${match?.id}`}>
                        {getTranslateText(match?.title, language) ?? concept}
                      </Link>
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
            </Table.Body>
          </Table>
        </InfoCard.Item>
      )}

      {
        // todo: get proper dctType labels from reference data
        !isEmpty(service.dctType) && (
          <InfoCard.Item title={localization.serviceForm.fieldLabel.dctType}>
            {service.dctType?.join(", ")}
          </InfoCard.Item>
        )
      }
    </InfoCard>
  );
};

export default BasicServiceFormInfoCardItems;
