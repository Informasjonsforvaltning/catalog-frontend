import { InformationModel } from "@catalog-frontend/types";
import { InfoCard } from "@catalog-frontend/ui";
import { localization, getTranslateText } from "@catalog-frontend/utils";
import { isEmpty } from "lodash";
import { Paragraph } from "@digdir/designsystemet-react";

type Props = {
  informationModel: InformationModel;
  language: string;
};

export const LeftColumn = ({ informationModel, language }: Props) => {
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
    </InfoCard>
  );
};
