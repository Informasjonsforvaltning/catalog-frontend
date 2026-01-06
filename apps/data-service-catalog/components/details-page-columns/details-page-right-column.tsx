import { InfoCard } from "@catalog-frontend/ui";
import styles from "./details-columns.module.css";
import { DataService, DataServiceReferenceData } from "@catalog-frontend/types";
import {
  accessRights,
  getTranslateText,
  localization,
} from "@catalog-frontend/utils";
import { isEmpty } from "lodash";
import { EnvelopeClosedIcon, LinkIcon, PhoneIcon } from "@navikt/aksel-icons";
import PublishSwitch from "../publish-switch";
import { ReferenceDataTag } from "./components/reference-data-tag";

type Props = {
  catalogId: string;
  dataService: DataService;
  referenceData: DataServiceReferenceData;
  language: string;
  hasWritePermission: boolean;
};

export const RightColumn = ({
  catalogId,
  dataService,
  hasWritePermission,
  referenceData,
  language,
}: Props) => {
  return (
    <InfoCard data-testid="data-service-right-column">
      <InfoCard.Item
        key={`info-data-${localization.id}`}
        title={localization.dataServiceForm.fieldLabel.dataServiceID}
        headingColor="light"
        data-testid="data-service-id"
      >
        {dataService?.id}
      </InfoCard.Item>

      <InfoCard.Item
        key={`info-data-${localization.publicationState.state}`}
        title={localization.publicationState.state}
        headingColor="light"
        helpText={
          !dataService.published
            ? `${localization.dataServiceForm.helptext.publishWarning} [skjemaet.](/catalogs/${catalogId}/data-services/${dataService?.id}/edit)`
            : localization.dataServiceForm.helptext.publish
        }
        helpTextSeverity={!dataService.published ? "warning" : "info"}
      >
        <PublishSwitch
          catalogId={dataService.catalogId}
          dataService={dataService}
          disabled={!hasWritePermission}
        />

        {dataService.published
          ? localization.publicationState.publishedInFDK
          : localization.publicationState.unpublished}
      </InfoCard.Item>

      {dataService?.modified && (
        <InfoCard.Item
          title={localization.dataServiceForm.fieldLabel.modified}
          headingColor="light"
          data-testid="data-service-modified-date"
        >
          {new Date(dataService.modified).toLocaleDateString("no-NO")}
        </InfoCard.Item>
      )}

      {!isEmpty(dataService?.accessRights) && (
        <InfoCard.Item
          title={localization.dataServiceForm.fieldLabel.accessRights}
          headingColor="light"
          data-testid="data-service-access-rights"
        >
          <ReferenceDataTag
            referenceDataURI={dataService.accessRights}
            referenceDataCodes={accessRights}
            language={language}
          />
        </InfoCard.Item>
      )}

      {!isEmpty(dataService?.availability) && (
        <InfoCard.Item
          title={localization.dataServiceForm.fieldLabel.availability}
          headingColor="light"
          data-testid="data-service-availability"
        >
          <ReferenceDataTag
            referenceDataURI={dataService.availability}
            referenceDataCodes={referenceData.plannedAvailabilities}
            language={language}
          />
        </InfoCard.Item>
      )}

      {!isEmpty(dataService?.contactPoint) && (
        <InfoCard.Item
          title={localization.dataServiceForm.heading.contactPoint}
          headingColor="light"
          data-testid="data-service-contact-point"
        >
          <div className={styles.contactPoints}>
            {!isEmpty(dataService.contactPoint?.name) && (
              <span data-testid="data-service-contact-name">
                {getTranslateText(dataService.contactPoint?.name, language)}
              </span>
            )}
            {dataService.contactPoint.email && (
              <span data-testid="data-service-contact-email">
                <div>
                  <EnvelopeClosedIcon />
                </div>

                {dataService?.contactPoint.email}
              </span>
            )}
            {dataService.contactPoint?.phone && (
              <span data-testid="data-service-contact-phone">
                <div>
                  <PhoneIcon />
                </div>
                {dataService?.contactPoint.phone}
              </span>
            )}
            {dataService.contactPoint.url && (
              <span data-testid="data-service-contact-url">
                <div>
                  <LinkIcon />
                </div>

                {dataService?.contactPoint.url}
              </span>
            )}
          </div>
        </InfoCard.Item>
      )}
    </InfoCard>
  );
};
