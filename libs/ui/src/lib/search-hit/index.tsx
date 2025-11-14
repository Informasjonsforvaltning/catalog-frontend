'use client';

import { localization, getTranslateText as translate } from '@catalog-frontend/utils';
import styles from './search-hit.module.css';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Url } from 'next/dist/shared/lib/router/router';
import { MarkdownComponent } from '@catalog-frontend/ui';
import { TagList } from '@fellesdatakatalog/ui';
import { Card, Heading, Link as DsLink } from '@digdir/designsystemet-react';

interface Props {
  title: string[] | string;
  description?: string[] | string;
  rightColumn?: ReactNode;
  content?: ReactNode;
  titleHref?: Url;
  labels?: ReactNode;
  statusTag?: ReactNode;
}

const SearchHit = ({ title, description, content, statusTag, titleHref, rightColumn, labels }: Props) => {
  return (
    <Card className={styles.container} asChild>
      <Link href={titleHref ?? ''} className={styles.titleLink}>
        <div className={styles.rowSpaceBetween}>
          <div className={styles.titleRow}>
            <Heading level={2} className={styles.title}>
              {translate(title) ? translate(title) : localization.concept.noName}
            </Heading>
            <TagList>
              {statusTag && <div>{statusTag}</div>}
            </TagList>
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
      </Link>
    </Card>
  );
};

export { SearchHit };
