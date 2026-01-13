import { isEmpty } from "lodash";
import { Service } from "@catalog-frontend/types";
import { Heading, Paragraph } from "@digdir/designsystemet-react";
import {
  DividerLine,
  InfoCard,
  ReferenceDataTags,
  useSearchAdministrativeUnitsByUri,
} from "@catalog-frontend/ui";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import styles from "./basic-form-info-card-items.module.css";

type Props = {
  service: Service;
  language: string;
  referenceDataEnv: string;
};

export const BasicServiceFormInfoCardItems = (props: Props) => {
  const { service, language, referenceDataEnv } = props;

  const { data: spatial } = useSearchAdministrativeUnitsByUri(
    service.spatial,
    referenceDataEnv,
  );

  return (
    <InfoCard>
      <InfoCard.Item title={`${localization.description}:`}>
        {getTranslateText(service.description, language)}
      </InfoCard.Item>

      <InfoCard.Item title={`${localization.serviceCatalog.produces}:`}>
        {!service.produces?.length && (
          <Paragraph size="small" className={styles.content}>
            {localization.none}
          </Paragraph>
        )}
        {service.produces?.map((produce) => (
          <div key={produce.identifier}>
            <Heading size="2xs" level={4} className={styles.heading}>
              {getTranslateText(produce.title, language) || localization.noName}
            </Heading>

            <DividerLine />

            <Paragraph size="small" className={styles.content}>
              <span className={styles.bold}>{localization.description}:</span>
              {getTranslateText(produce.description, language)}
            </Paragraph>
          </div>
        ))}
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
    </InfoCard>
  );
};

export default BasicServiceFormInfoCardItems;
