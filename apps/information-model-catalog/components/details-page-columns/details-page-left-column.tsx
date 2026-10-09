"use client";

import { InformationModel } from "@catalog-frontend/types";
import { InfoCard, useSearchConceptsByUri } from "@catalog-frontend/ui";
import {
  localization,
  getTranslateText,
  versionToString,
} from "@catalog-frontend/utils";
import { isEmpty } from "lodash";
import { Link, Paragraph, Table } from "@digdir/designsystemet-react";
import { useSearchEnheterByOrgNmbs } from "../../hooks/useEnhetsregister";
import styles from "./details-columns.module.css";

type Props = {
  informationModel: InformationModel;
  language: string;
  searchEnv: string;
  referenceDataEnv: string;
};

export const LeftColumn = ({
  informationModel,
  language,
  searchEnv,
  referenceDataEnv,
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
                return (
                  <Table.Row key={subjectUri}>
                    <Table.Cell>
                      <Link href={`${referenceDataEnv}/concepts/${match?.id}`}>
                        {getTranslateText(match?.title, language) || subjectUri}
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
    </InfoCard>
  );
};
