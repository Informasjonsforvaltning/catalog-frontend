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

const MAX_COMMENT_LENGTH = 100;

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
              {`Opprettet: ${convertTimestampToDateAndTime(comment.createdDate)} av ${comment.user?.name ?? localization.unknown}`}
            </span>
            {(comment.comment.length > MAX_COMMENT_LENGTH
              ? comment.comment.slice(0, MAX_COMMENT_LENGTH) + "..."
              : comment.comment
            )
              .split("\n")
              .map((line, index) => (
                <span key={`comment-${comment.id}-${index}`}>
                  {line}
                  <br />
                </span>
              ))}
          </div>
        </li>
      ))}
    </ul>
  );
};
