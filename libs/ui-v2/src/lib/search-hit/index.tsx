import { localization } from "@catalog-frontend/utils";
import styles from "./search-hit.module.css";
import Link from "next/link";
import { ReactNode } from "react";
import { Url } from "next/dist/shared/lib/router/router";
import { MarkdownComponent } from "@catalog-frontend/ui-v2";

interface Props {
  title: string;
  description?: string[] | string;
  rightColumn?: ReactNode;
  content?: ReactNode;
  titleHref?: Url;
  labels?: ReactNode;
  statusTag?: ReactNode;
}

const SearchHit = ({
  title,
  description,
  content,
  statusTag,
  titleHref,
  rightColumn,
  labels,
}: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.rowSpaceBetween}>
        <div className={styles.titleRow}>
          <Link href={titleHref ?? ""} className={styles.titleLink}>
            <h2 className={styles.title}>
              {title || localization.concept.noName}
            </h2>
          </Link>
          {statusTag && <div>{statusTag}</div>}
        </div>
        {rightColumn}
      </div>
      {content}
      {description && (
        <div className={styles.description}>
          <MarkdownComponent>{description.toString()}</MarkdownComponent>
        </div>
      )}
      {labels}
    </div>
  );
};

export { SearchHit };
