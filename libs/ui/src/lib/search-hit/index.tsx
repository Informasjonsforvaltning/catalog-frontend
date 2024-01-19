import { localization, getTranslateText as translate } from '@catalog-frontend/utils';
import styles from './search-hit.module.css';
import { ReactNode } from 'react';
import { Url } from 'next/dist/shared/lib/router/router';
import { Link } from '../proxy-provider';

interface Props {
  title: string[] | string;
  description?: string[] | string;
  conceptSubject?: ReactNode;
  content?: ReactNode;
  titleHref?: Url;
  labels?: ReactNode;
  statusTag?: ReactNode;
}

const SearchHit = ({ title, description, content, statusTag, titleHref, conceptSubject, labels }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.rowSpaceBetween}>
        <div className={styles.titleRow}>
          <Link href={titleHref ?? ''}>
            <h2 className={styles.title}>{translate(title) ? translate(title) : localization.concept.noName}</h2>
          </Link>
          {statusTag && <div className={styles.status}>{statusTag}</div>}
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
