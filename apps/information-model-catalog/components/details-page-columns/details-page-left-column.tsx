"use client";

import {
  InformationModel,
  ReferenceDataCode,
  Search,
} from "@catalog-frontend/types";
import {
  InfoCard,
  useSearchConceptsByUri,
  useSearchFileTypeByUri,
  useSearchInformationModelsByUri,
  useSearchLanguageByUri,
} from "@catalog-frontend/ui";
import {
  capitalizeFirstLetter,
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

  const hasFormatLanguageUris = useMemo(
    () =>
      informationModel?.hasFormat
        ?.map((document) => document?.language)
        .filter((uri): uri is string => Boolean(uri)) ?? [],
    [informationModel?.hasFormat],
  );

  const hasFormatFormatUris = useMemo(
    () =>
      informationModel?.hasFormat
        ?.map((document) => document?.format)
        .filter((uri): uri is string => Boolean(uri)) ?? [],
    [informationModel?.hasFormat],
  );

  const { data: hasFormatLanguages } = useSearchLanguageByUri(
    hasFormatLanguageUris,
    fdkBaseUri,
  );
  const { data: hasFormatFormats } = useSearchFileTypeByUri(
    hasFormatFormatUris,
    fdkBaseUri,
  );

  const hasFormatDocuments = useMemo(
    () => compact(informationModel?.hasFormat),
    [informationModel?.hasFormat],
  );

  const resolveReferenceDataLabel = (
    uri: string | null | undefined,
    items: ReferenceDataCode[] | undefined,
  ) => {
    if (!uri) return undefined;
    const match = items?.find((item) => item.uri === uri);
    if (!match?.label) {
      return uri;
    }
    return capitalizeFirstLetter(
      getTranslateText(match.label, language),
      false,
    );
  };

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
      {hasFormatDocuments.length > 0 && (
        <InfoCard.Item
          title={localization.informationModelForm.fieldLabel.hasFormat}
          data-testid="information-model-has-format"
        >
          <Table data-size="sm" className={styles.table}>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell>
                  {localization.informationModelForm.fieldLabel.hasFormatTitle}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {
                    localization.informationModelForm.fieldLabel
                      .hasFormatLanguage
                  }
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {localization.informationModelForm.fieldLabel.hasFormatFormat}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {
                    localization.informationModelForm.fieldLabel
                      .hasFormatSeeAlso
                  }
                </Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {hasFormatDocuments.map((document, index) => (
                <Table.Row key={`hasFormat-${index}`}>
                  <Table.Cell>
                    {getTranslateText(document?.title, language) || "—"}
                  </Table.Cell>
                  <Table.Cell>
                    {resolveReferenceDataLabel(
                      document?.language,
                      hasFormatLanguages,
                    ) || "—"}
                  </Table.Cell>
                  <Table.Cell>
                    {resolveReferenceDataLabel(
                      document?.format,
                      hasFormatFormats,
                    ) || "—"}
                  </Table.Cell>
                  <Table.Cell className={styles.urlCell}>
                    {document?.seeAlso ? (
                      <Link
                        className={styles.urlLink}
                        href={document.seeAlso}
                        title={document.seeAlso}
                      >
                        {document.seeAlso}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
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
