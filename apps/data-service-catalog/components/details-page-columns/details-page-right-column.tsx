import { InfoCard } from "@catalog-frontend/ui";
import styles from "./details-columns.module.css";
import { DataService, DataServiceReferenceData } from "@catalog-frontend/types";
import {
  accessRights,
  formatISO,
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
  isValid: boolean;
};

export const RightColumn = ({
  catalogId,
  dataService,
  hasWritePermission,
  referenceData,
  language,
  isValid,
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
        helpText={
          isValid
            ? undefined
            : `Publisering er ikke mulig fordi ett eller flere felt inneholder ugyldige eller manglende verdier. Klikk på 
            [Rediger API-et](/catalogs/${catalogId}/data-services/${dataService?.id}/edit) for å åpne skjemaet og se hvilke feil som må rettes for å publisere.`
        }
        helpTextSeverity={"warning"}
        headingColor="light"
        data-testid="data-service-publication-state"
      >
        <PublishSwitch
          catalogId={dataService.catalogId}
          dataService={dataService}
          disabled={!hasWritePermission || !isValid}
        />
        <div
          className={styles.greyFont}
          data-testid="data-service-publication-date"
        >
          {dataService.published
            ? `${localization.publicationState.publishedInFDK}${
                dataService.publishedDate
                  ? " " +
                    formatISO(dataService.publishedDate, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""
              }`
            : ""}
        </div>
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
