import { isEmpty } from "lodash";
import { LosTheme, ReferenceDataCode, Service } from "@catalog-frontend/types";
import {
  Card,
  Heading,
  Link,
  Paragraph,
  Table,
  Tag,
} from "@digdir/designsystemet-react";
import {
  CostList,
  InfoCard,
  ReferenceDataTags,
  useSearchAdministrativeUnitsByUri,
  useSearchConceptsByUri,
  useSearchDatasetsByUri,
} from "@catalog-frontend/ui";
import {
  capitalizeFirstLetter,
  getTranslateText,
  localization,
} from "@catalog-frontend/utils";
import styles from "./basic-form-info-card-items.module.css";

type Props = {
  language: string;
  languages?: ReferenceDataCode[];
  losThemes?: LosTheme[];
  mainActivities?: ReferenceDataCode[];
  referenceDataEnv: string;
  searchEnv: string;
  service: Service;
};

export const BasicServiceFormInfoCardItems = (props: Props) => {
  const {
    language,
    languages,
    losThemes,
    mainActivities,
    referenceDataEnv,
    searchEnv,
    service,
  } = props;

  const losThemesByUri = new Map(losThemes?.map((theme) => [theme.uri, theme]));

  const { data: spatial } = useSearchAdministrativeUnitsByUri(
    service.spatial,
    referenceDataEnv,
  );

  const { data: concepts } = useSearchConceptsByUri(
    searchEnv,
    service?.subject ?? [],
  );
  const evidenceDatasetUris = [
    ...new Set((service.evidence ?? []).flatMap((item) => item.dataset ?? [])),
  ];
  const { data: datasets } = useSearchDatasetsByUri(
    searchEnv,
    evidenceDatasetUris,
  );

  return (
    <InfoCard>
      <InfoCard.Item title={`${localization.description}:`}>
        {getTranslateText(service.description, language)}
      </InfoCard.Item>

      <InfoCard.Item title={`${localization.serviceCatalog.produces}:`}>
        {!service.produces?.length && (
          <Paragraph data-size="sm" className={styles.content}>
            {localization.none}
          </Paragraph>
        )}

        <div className={styles.flexList}>
          {service.produces?.map((produce) => (
            <Card key={produce.identifier} data-color="neutral">
              <Heading data-size="2xs" level={4}>
                {getTranslateText(produce.title, language) ||
                  localization.noName}
              </Heading>

              <Paragraph>
                {getTranslateText(produce.description, language)}
              </Paragraph>
            </Card>
          ))}
        </div>
      </InfoCard.Item>

      <InfoCard.Item title={`${localization.serviceCatalog.evidence}:`}>
        {!service.evidence?.length && (
          <Paragraph data-size="sm" className={styles.content}>
            {localization.none}
          </Paragraph>
        )}

        <div className={styles.flexList}>
          {service.evidence?.map((item) => (
            <Card key={item.identifier} data-color="neutral">
              <Heading data-size="2xs" level={4}>
                {getTranslateText(item.title, language) || localization.noName}
              </Heading>

              <Paragraph>
                {getTranslateText(item.description, language)}
              </Paragraph>

              {!isEmpty(item.relatedDocumentation) && (
                <>
                  <Heading data-size="2xs" level={5}>
                    {localization.serviceForm.fieldLabel.relatedDocumentation}
                  </Heading>
                  <Paragraph data-size="sm">
                    {item.relatedDocumentation?.join(", ")}
                  </Paragraph>
                </>
              )}

              {!isEmpty(item.dataset) && (
                <>
                  <Heading data-size="2xs" level={5}>
                    {localization.serviceForm.fieldLabel.dataset}
                  </Heading>
                  <Paragraph data-size="sm">
                    {item.dataset
                      ?.map((uri) => {
                        const datasetMatch = datasets?.find(
                          (dataset) => dataset.uri === uri,
                        );
                        return (
                          getTranslateText(datasetMatch?.title, language) || uri
                        );
                      })
                      .join(", ")}
                  </Paragraph>
                </>
              )}

              {!isEmpty(item.language) && (
                <>
                  <Heading data-size="2xs" level={5}>
                    {localization.datasetForm.fieldLabel.language}
                  </Heading>
                  <Paragraph data-size="sm">
                    {item.language
                      ?.map((lang) => {
                        const matchedLang = languages?.find(
                          (languageItem) => languageItem?.uri === lang,
                        );
                        return matchedLang
                          ? getTranslateText(matchedLang.label, language)
                          : null;
                      })
                      .filter(Boolean)
                      .join(", ")}
                  </Paragraph>
                </>
              )}
            </Card>
          ))}
        </div>
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
          <Table data-size="sm" className={styles.table}>
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
                        {getTranslateText(match?.title, language) || concept}
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

      {!isEmpty(service.dctType) && (
        <InfoCard.Item title={localization.serviceForm.fieldLabel.dctType}>
          <ReferenceDataTags values={service.dctType} data={mainActivities} />
        </InfoCard.Item>
      )}

      {!isEmpty(service.losTheme) && (
        <InfoCard.Item title={localization.serviceForm.fieldLabel.losTheme}>
          <ul className={styles.tagList}>
            {service.losTheme?.map((uri) => {
              const match = losThemesByUri.get(uri);
              const displayText = capitalizeFirstLetter(
                getTranslateText(match?.name, language) || uri,
              );
              return (
                <Tag data-size="sm" data-color="info" key={uri}>
                  {displayText}
                </Tag>
              );
            })}
          </ul>
        </InfoCard.Item>
      )}

      {!isEmpty(service.costs) && (
        <InfoCard.Item title={localization.cost.fieldLabel.costs}>
          <CostList costs={service.costs} language={language} />
        </InfoCard.Item>
      )}
    </InfoCard>
  );
};

export default BasicServiceFormInfoCardItems;
