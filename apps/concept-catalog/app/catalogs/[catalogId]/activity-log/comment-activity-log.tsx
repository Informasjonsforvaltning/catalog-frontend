import Link from "next/link";
import { Heading } from "@digdir/designsystemet-react";
import {
  localization,
  convertTimestampToDateAndTime,
  getTranslateText,
} from "@catalog-frontend/utils";
import { EnrichedComment } from "@concept-catalog/utils/activity-log";
import styles from "./activity-log-page.module.css";

type CommentActivityLogProps = {
  catalogId: string;
  comments: EnrichedComment[];
};

export const CommentActivityLog = ({
  catalogId,
  comments,
}: CommentActivityLogProps) => {
  if (comments.length === 0) {
    return (
      <p className={styles.noHits}>{localization.activityLog.noComments}</p>
    );
  }

  return (
    <ul className={styles.list}>
      {comments.map((comment) => (
        <li key={comment.id} className={styles.listItem}>
          <div className={styles.listContent}>
            <Heading level={3} size="xsmall">
              <Link
                href={`/catalogs/${catalogId}/concepts/${comment.topicId}`}
                className={styles.heading}
              >
                {getTranslateText(comment.concept?.anbefaltTerm?.navn) ||
                  localization.concept.noName}
              </Link>
            </Heading>
            <span>
              {localization.formatString(
                localization.activityLog.createdByAt,
                convertTimestampToDateAndTime(comment.createdDate),
                comment.user?.name ?? localization.unknown,
              )}
            </span>
            <div className={styles.commentText}>
              {comment.comment.split("\n").map((line, index) => (
                <span key={`comment-${comment.id}-${index}`}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
