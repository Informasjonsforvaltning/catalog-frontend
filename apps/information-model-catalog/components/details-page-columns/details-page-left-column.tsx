"use client";

import { InformationModel } from "@catalog-frontend/types";
import { InfoCard } from "@catalog-frontend/ui";
import {
  localization,
  getTranslateText,
  versionToString,
} from "@catalog-frontend/utils";
import { isEmpty } from "lodash";
import { Link, Paragraph } from "@digdir/designsystemet-react";
import { useSearchEnheterByOrgNmbs } from "../../hooks/useEnhetsregister";

type Props = {
  informationModel: InformationModel;
  language: string;
};

export const LeftColumn = ({ informationModel, language }: Props) => {
  const { data: creatorEnheter } = useSearchEnheterByOrgNmbs(
    informationModel?.creator ? [informationModel.creator] : [],
  );
  const creatorName =
    creatorEnheter?.find(
      (enhet) => enhet.organisasjonsnummer === informationModel?.creator,
    )?.navn ?? informationModel?.creator;

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
