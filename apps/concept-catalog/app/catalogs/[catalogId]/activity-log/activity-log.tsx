import Link from "next/link";
import {
  localization,
  convertTimestampToDateAndTime,
  getTranslateText,
} from "@catalog-frontend/utils";
import { Heading } from "@digdir/designsystemet-react";
import {
  getCatalogHistory,
  getConceptsForCatalog,
} from "@catalog-frontend/data-access";
import { UpdateList, Concept } from "@catalog-frontend/types";
import { mapHistoryWithConcepts } from "@concept-catalog/utils/activity-log";
import styles from "./activity-log-page.module.css";

type Props = {
  catalogId: string;
  accessToken?: string;
};

export const ActivityLog = async ({ catalogId, accessToken }: Props) => {
  if (!accessToken) {
    return null;
  }

  const [historyResponse, conceptsResponse] = await Promise.all([
    getCatalogHistory(catalogId, accessToken),
    getConceptsForCatalog(catalogId, accessToken),
  ]);

  const historyData: UpdateList = await historyResponse.json();
  const conceptsData: Concept[] = await conceptsResponse.json();

  const enrichedUpdates = mapHistoryWithConcepts(
    historyData.updates ?? [],
    conceptsData,
  );

  if (enrichedUpdates.length === 0) {
    return <p className={styles.noHits}>{localization.search.noHits}</p>;
  }

  return (
    <ul className={styles.list}>
      {enrichedUpdates.map((update) => (
        <li key={update.id} className={styles.listItem}>
          <div className={styles.listContent}>
            <Heading level={3} size="xsmall">
              <Link
                href={`/catalogs/${catalogId}/concepts/${update.resourceId}`}
                className={styles.heading}
              >
                {getTranslateText(update.concept?.anbefaltTerm?.navn) ||
                  localization.concept.noName}
              </Link>
            </Heading>
            <p className={styles.text}>
              {convertTimestampToDateAndTime(update.datetime)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};
