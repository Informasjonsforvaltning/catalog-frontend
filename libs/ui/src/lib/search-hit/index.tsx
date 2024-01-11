import { localization, getTranslateText as translate } from '@catalog-frontend/utils';
import styles from './search-hit.module.css';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Url } from 'next/dist/shared/lib/router/router';
import { Tag } from '@digdir/design-system-react';

interface Props {
  title: string[] | string;
  description?: string[] | string;
  status?: string;
  statusColor?: string;
  conceptSubject?: ReactNode;
  content?: ReactNode;
  titleHref?: Url;
  labels?: ReactNode;
}

const SearchHit = ({ title, description, content, status, statusColor, titleHref, conceptSubject, labels }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.rowSpaceBetween}>
        <div className={styles.titleRow}>
          <Link href={titleHref ?? ''}>
            <h2 className={styles.title}>{translate(title) ? translate(title) : localization.concept.noName}</h2>
          </Link>
          {status && (
            <div className={styles.status}>
              <Tag color={statusColor}>{status}</Tag>
            </div>
          )}
        </div>
        {conceptSubject}
      </div>
      {content}
      {description && <p className={styles.description}>{description}</p>}
      {labels}
    </div>
  );
};

export { SearchHit };
