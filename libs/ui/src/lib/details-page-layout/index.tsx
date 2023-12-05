'use client';

import { HTMLAttributes, ReactNode } from 'react';
import styles from './details-page.module.css';
import { ToggleGroup } from '@digdir/design-system-react';

import cn from 'classnames';
import { DetailHeading } from '../detail-heading';
import { Spinner } from '../spinner';

interface DetailsPageLayoutProps extends HTMLAttributes<HTMLDivElement> {
  mainColumn?: ReactNode;
  rightColumn?: ReactNode;
  headingTitle: ReactNode;
  headingSubtitle?: ReactNode;
  loading: boolean;
  handleLanguageChange?: (lang: any) => void;
  language?: string;
  buttons?: ReactNode;
}

const DetailsPageLayout = ({
  mainColumn,
  rightColumn,
  headingTitle,
  headingSubtitle,
  loading,
  handleLanguageChange,
  language,
  buttons,
}: DetailsPageLayoutProps) => {
  const languageOptions = [
    { value: 'nb', label: 'Norsk bokmål' },
    { value: 'nn', label: 'Norsk nynorsk' },
    { value: 'en', label: 'English' },
  ];

  return (
    <div className='container'>
      <DetailHeading
        className={styles.detailHeading}
        headingTitle={headingTitle}
        subtitle={headingSubtitle}
      />
      {loading && <Spinner />}
      {!loading && (
        <>
          <div className={styles.buttonRow}>
            <div className={styles.languages}>
              <ToggleGroup
                onChange={handleLanguageChange}
                value={language}
                size='small'
              >
                {languageOptions.map((item) => (
                  <ToggleGroup.Item
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </ToggleGroup.Item>
                ))}
              </ToggleGroup>
            </div>
            <div className={styles.buttons}>{buttons}</div>
          </div>
          <div className={cn(styles.twoColumnRow, styles.bottomSpace)}>
            {mainColumn}
            {rightColumn}
          </div>
        </>
      )}
    </div>
  );
};

export { DetailsPageLayout };
