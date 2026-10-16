"use client";

import { InformationModel, Search } from "@catalog-frontend/types";
import {
  InfoCard,
  useSearchConceptsByUri,
  useSearchInformationModelsByUri,
} from "@catalog-frontend/ui";
import {
  formatDateToDDMMYYYY,
  localization,
  getTranslateText,
  validUUID,
  versionToString,
} from "@catalog-frontend/utils";
import { compact, isEmpty } from "lodash";
import { Link, Paragraph, Table } from "@digdir/designsystemet-react";
import { useMemo } from "react";
import { useSearchEnheterByOrgNmbs } from "../../hooks/useEnhetsregister";
import relations from "../information-model-form/utils/relations.json";
import styles from "./details-columns.module.css";

type Props = {
  informationModel: InformationModel;
  language: string;
  searchEnv: string;
  fdkBaseUri: string;
};

export const LeftColumn = ({
  informationModel,
  language,
  searchEnv,
  fdkBaseUri,
}: Props) => {
  const { data: creatorEnheter } = useSearchEnheterByOrgNmbs(
    informationModel?.creator ? [informationModel.creator] : [],
  );
  const creatorName =
    creatorEnheter?.find(
      (enhet) => enhet.organisasjonsnummer === informationModel?.creator,
    )?.navn ?? informationModel?.creator;

  const { data: concepts } = useSearchConceptsByUri(
    searchEnv,
    informationModel?.subjects ?? [],
  );

  const relationUris = useMemo(
    () =>
      informationModel?.relations
        ?.map((relation) => relation?.source)
        .filter((uri): uri is string => Boolean(uri)) ?? [],
    [informationModel?.relations],
  );

  const { data: relatedInformationModels } = useSearchInformationModelsByUri(
    searchEnv,
    relationUris,
  );

  const getDataNorgeUri = (
    id: string | undefined,
    resourceType: Search.ResourceType,
  ) => {
    if (!id) {
      return undefined;
    }
    return validUUID(id) ? `${fdkBaseUri}/${resourceType}/${id}` : undefined;
  };

  const getRelationTypeLabel = (typeUri: string | undefined) => {
    const match = relations.find((rel) => rel.uri === typeUri);
    return match?.label ? getTranslateText(match.label, language) : typeUri;
  };

  return (
    <InfoCard data-testid="information-model-left-column">
      {!isEmpty(informationModel?.title) && (
        <InfoCard.Item
          title={localization.informationModelForm.fieldLabel.title}
          data-testid="information-model-title"
        >
          <Paragraph>
            {getTranslateText(informationModel?.title, language)}
          </Paragraph>
        </InfoCard.Item>
      )}
      {!isEmpty(informationModel?.description) && (
        <InfoCard.Item
          title={localization.informationModelForm.fieldLabel.description}
          data-testid="information-model-description"
        >
          <Paragraph>
            {getTranslateText(informationModel?.description, language)}
          </Paragraph>
        </InfoCard.Item>
      )}
      {!isEmpty(informationModel?.creator) && (
        <InfoCard.Item
          title={localization.informationModelForm.fieldLabel.creator}
          data-testid="information-model-creator"
        >
          <Paragraph>{creatorName}</Paragraph>
        </InfoCard.Item>
      )}
      {!isEmpty(informationModel?.subjects) && (
        <InfoCard.Item
          title={localization.informationModelForm.fieldLabel.subjects}
          data-testid="information-model-subjects"
        >
          <Table data-size="sm" className={styles.table}>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell>
                  {localization.informationModelForm.fieldLabel.subjects}
                </Table.HeaderCell>
                <Table.HeaderCell>{localization.publisher}</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {informationModel.subjects?.map((subjectUri) => {
                const match = concepts?.find((item) => item.uri === subjectUri);
                const href =
                  getDataNorgeUri(match?.id, "concepts") ?? subjectUri;
                const label =
                  getTranslateText(match?.title, language) || subjectUri;
                return (
                  <Table.Row key={subjectUri}>
                    <Table.Cell>
                      {href ? <Link href={href}>{label}</Link> : label}
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
      {informationModel?.relations &&
        compact(informationModel.relations).length > 0 && (
          <InfoCard.Item
            title={localization.informationModelForm.fieldLabel.relations}
            data-testid="information-model-relations"
          >
            <Table data-size="sm" className={styles.table}>
              <Table.Head>
                <Table.Row>
                  <Table.HeaderCell>
                    {localization.informationModelForm.fieldLabel.relationType}
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    {
                      localization.informationModelForm.fieldLabel
                        .informationModel
                    }
                  </Table.HeaderCell>
                  <Table.HeaderCell>{localization.publisher}</Table.HeaderCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {informationModel.relations.map((relation, index) => {
                  const match = relatedInformationModels?.find(
                    (item) => item?.uri === relation?.source,
                  );
                  const href =
                    getDataNorgeUri(match?.id, "information-models") ??
                    relation?.source;
                  const label =
                    getTranslateText(match?.title, language) ||
                    relation?.source;
                  return (
                    <Table.Row key={`relations-${index}`}>
                      <Table.Cell>
                        {getRelationTypeLabel(relation?.type)}
                      </Table.Cell>
                      <Table.Cell>
                        {href ? <Link href={href}>{label}</Link> : label}
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
      {!isEmpty(informationModel?.homepage) && (
        <InfoCard.Item
          title={localization.informationModelForm.fieldLabel.homepage}
          data-testid="information-model-homepage"
        >
          <Paragraph>
            <Link href={informationModel?.homepage ?? undefined}>
              {informationModel?.homepage}
            </Link>
          </Paragraph>
        </InfoCard.Item>
      )}
      {informationModel?.version && (
        <InfoCard.Item
          title={localization.informationModelForm.fieldLabel.version}
          data-testid="information-model-version"
        >
          <Paragraph>{versionToString(informationModel.version)}</Paragraph>
        </InfoCard.Item>
      )}
      {informationModel?.issued && (
        <InfoCard.Item
          title={localization.informationModelForm.fieldLabel.issued}
          data-testid="information-model-issued"
        >
          <Paragraph>{formatDateToDDMMYYYY(informationModel.issued)}</Paragraph>
        </InfoCard.Item>
      )}
      {informationModel?.modified && (
        <InfoCard.Item
          title={localization.informationModelForm.fieldLabel.modified}
          data-testid="information-model-modified"
        >
          <Paragraph>
            {formatDateToDDMMYYYY(informationModel.modified)}
          </Paragraph>
        </InfoCard.Item>
      )}
    </InfoCard>
  );
};
