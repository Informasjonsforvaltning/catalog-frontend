'use client';

import { HTMLAttributes, ReactNode } from 'react';
import styles from './details-page.module.css';

import cn from 'classnames';
import { DetailHeading } from '../detail-heading';
import { Spinner } from '../spinner';
import { Select } from '../select';

interface DetailsPageLayoutProps extends HTMLAttributes<HTMLDivElement> {
  mainColumn?: ReactNode;
  rightColumn?: ReactNode;
  headingTitle: ReactNode;
  headingSubtitle?: ReactNode;
  loading: boolean;
  handleLanguageChange?: (lang: string) => void;
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
          <div className={styles.twoColumnRow}>
            <div className={styles.actionsRow}>
              <div className={styles.buttons}>{buttons}</div>
              <div>
                <Select
                  onChange={(event) => handleLanguageChange?.(event.target.value)}
                  value={language}
                  size='small'
                >
                  {languageOptions.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div>&nbsp;</div>
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
