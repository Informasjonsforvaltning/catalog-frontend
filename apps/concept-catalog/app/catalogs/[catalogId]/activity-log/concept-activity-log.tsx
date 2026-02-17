import Link from "next/link";
import {
  localization,
  convertTimestampToDateAndTime,
  getTranslateText,
} from "@catalog-frontend/utils";
import { Heading } from "@digdir/designsystemet-react";
import { EnrichedUpdate } from "@concept-catalog/utils/activity-log";
import styles from "./activity-log-page.module.css";

type ConceptActivityLogProps = {
  catalogId: string;
  updates: EnrichedUpdate[];
};

export const ConceptActivityLog = ({
  catalogId,
  updates,
}: ConceptActivityLogProps) => {
  if (updates.length === 0) {
    return <p className={styles.noHits}>{localization.search.noHits}</p>;
  }

  return (
    <ul className={styles.list}>
      {updates.map((update) => (
        <li key={update.id} className={styles.listItem}>
          <div className={styles.listContent}>
            <Heading level={3} data-size="xs">
              <Link
                href={`/catalogs/${catalogId}/concepts/${update.resourceId}`}
                className={styles.heading}
              >
                {getTranslateText(update.concept?.anbefaltTerm?.navn) ||
                  localization.concept.noName}
              </Link>
            </Heading>
            <p className={styles.text}>
              {localization.formatString(
                localization.activityLog.createdByAt,
                convertTimestampToDateAndTime(update.datetime),
                update.person?.name ?? localization.unknown,
              )}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};
