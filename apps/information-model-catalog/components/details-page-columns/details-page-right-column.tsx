import { InfoCard } from "@catalog-frontend/ui";
import { InformationModel } from "@catalog-frontend/types";
import {
  formatISO,
  getTranslateText,
  localization,
} from "@catalog-frontend/utils";
import { isEmpty } from "lodash";
import { EnvelopeClosedIcon, LinkIcon, PhoneIcon } from "@navikt/aksel-icons";
import { Link } from "@digdir/designsystemet-react";
import PublishSwitch from "../publish-switch";
import styles from "./details-columns.module.css";

type Props = {
  informationModel: InformationModel;
  language?: string;
  hasWritePermission: boolean;
  onPublishedChange?: (published: boolean) => void;
};

export const RightColumn = ({
  informationModel,
  language,
  hasWritePermission,
  onPublishedChange,
}: Props) => {
  const contactPoint = informationModel?.contactPoints?.[0];

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

      {contactPoint && !isEmpty(contactPoint) && (
        <InfoCard.Item
          title={localization.informationModelForm.heading.contactPoint}
          headingColor="light"
          data-testid="information-model-contact-point"
        >
          <div className={styles.contactPoints}>
            {!isEmpty(contactPoint?.name) && (
              <span data-testid="information-model-contact-name">
                {getTranslateText(contactPoint?.name, language)}
              </span>
            )}
            {contactPoint.email && (
              <span data-testid="information-model-contact-email">
                <div>
                  <EnvelopeClosedIcon />
                </div>
                {contactPoint.email}
              </span>
            )}
            {contactPoint.telephone && (
              <span data-testid="information-model-contact-telephone">
                <div>
                  <PhoneIcon />
                </div>
                {contactPoint.telephone}
              </span>
            )}
            {contactPoint.url && (
              <span data-testid="information-model-contact-url">
                <div>
                  <LinkIcon />
                </div>
                <Link href={contactPoint.url}>{contactPoint.url}</Link>
              </span>
            )}
          </div>
        </InfoCard.Item>
      )}
    </InfoCard>
  );
};
