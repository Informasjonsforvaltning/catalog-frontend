'use client';

import { localization, getTranslateText as translate, getString } from '@catalog-frontend/utils';
import { LocalizedStrings } from '@catalog-frontend/types';
import styles from './search-hit.module.css';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Url } from 'next/dist/shared/lib/router/router';
import { MarkdownComponent } from '@catalog-frontend/ui';
import { TagList } from '@fellesdatakatalog/ui';
import { Card, Heading, Link as DsLink } from '@digdir/designsystemet-react';

interface Props {
  title: string[] | string | LocalizedStrings;
  description?: string[] | string;
  rightColumn?: ReactNode;
  content?: ReactNode;
  titleHref?: Url;
  labels?: ReactNode;
  statusTag?: ReactNode;
}

const SearchHit = ({ title, description, content, statusTag, titleHref, rightColumn, labels }: Props) => {
  // Handle title: if it's already a string/string[], use it directly; otherwise translate it
  const getTitle = (): string => {
    // If title is a string or string array, use it directly
    if (typeof title === 'string' || Array.isArray(title)) {
      const titleStr = typeof title === 'string' ? title : getString(title);
      return titleStr || localization.noName;
    }
    // Otherwise, treat it as LocalizedStrings and translate
    const translated = translate(title as LocalizedStrings);
    const translatedStr = typeof translated === 'string' ? translated : getString(translated);
    return translatedStr || localization.noName;
  };

  return (
    <Card className={styles.container} asChild>
      <Link href={titleHref ?? ''} className={styles.titleLink}>
        <div className={styles.rowSpaceBetween}>
          <div className={styles.titleRow}>
            <Heading level={2} className={styles.title}>
              {getTitle()}
            </Heading>
            {
              statusTag &&
              <TagList>{statusTag}</TagList>
            }
          </div>
          {rightColumn}
        </div>
        {description && (
          <div className={styles.description}>
            <MarkdownComponent>{description.toString()}</MarkdownComponent>
          </div>
        )}
        {labels}
        {content}
      </Link>
    </Card>
  );
};

export { SearchHit };
