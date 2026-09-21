import { InfoCard } from "@catalog-frontend/ui";
import { InformationModel } from "@catalog-frontend/types";
import { formatISO, localization } from "@catalog-frontend/utils";
import PublishSwitch from "../publish-switch";

type Props = {
  informationModel: InformationModel;
  hasWritePermission: boolean;
  onPublishedChange?: (published: boolean) => void;
};

export const RightColumn = ({
  informationModel,
  hasWritePermission,
  onPublishedChange,
}: Props) => {
  return (
    <InfoCard data-testid="information-model-right-column">
      <InfoCard.Item
        key={`info-data-${localization.id}`}
        title={localization.informationModelForm.fieldLabel.informationModelID}
        headingColor="light"
        data-testid="information-model-id"
      >
        {informationModel?.id}
      </InfoCard.Item>

      <InfoCard.Item
        key={`info-data-${localization.publicationState.state}`}
        title={localization.publicationState.state}
        headingColor="light"
        helpText={localization.informationModelForm.helptext.publish}
        helpTextSeverity="info"
      >
        <PublishSwitch
          catalogId={informationModel.catalogId}
          informationModel={informationModel}
          disabled={!hasWritePermission}
          onPublishedChange={onPublishedChange}
        />

        {informationModel.published
          ? localization.publicationState.publishedInFDK
          : localization.publicationState.unpublished}
      </InfoCard.Item>

      {informationModel?.lastModified && (
        <InfoCard.Item
          key={`info-data-${localization.informationModelForm.fieldLabel.lastModified}`}
          title={localization.informationModelForm.fieldLabel.lastModified}
          headingColor="light"
          data-testid="information-model-last-modified"
        >
          {formatISO(informationModel.lastModified, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </InfoCard.Item>
      )}
    </InfoCard>
  );
};
