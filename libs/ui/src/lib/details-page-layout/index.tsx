'use client';

import { HTMLAttributes, ReactNode, Children, isValidElement } from 'react';
import styles from './details-page.module.css';

import cn from 'classnames';
import { Spinner } from '../spinner';
import { Select } from '../select';
import { Heading, Ingress } from '@digdir/designsystemet-react';

interface DetailsPageLayoutProps extends HTMLAttributes<HTMLDivElement> {
  headingTitle: string | string[];
  headingSubtitle?: ReactNode;
  headingTag?: ReactNode;
  loading: boolean;
  handleLanguageChange?: (lang: string) => void;
  language?: string;
  buttons?: ReactNode;
}

const DetailsPageLayout = ({
  headingTitle,
  headingSubtitle,
  headingTag,
  loading,
  handleLanguageChange,
  language,
  children,
}: DetailsPageLayoutProps & { children: ReactNode }) => {
  const languageOptions = [
    { value: 'nb', label: 'Norsk bokmål' },
    { value: 'nn', label: 'Norsk nynorsk' },
    { value: 'en', label: 'English' },
  ];

  const childrenArray = Children.toArray(children);
  const leftChild = childrenArray.find((child) => isValidElement(child) && child.type === DetailsPageLayout.Left);
  const rightChild = childrenArray.find((child) => isValidElement(child) && child.type === DetailsPageLayout.Right);
  const buttonsChild = childrenArray.find((child) => isValidElement(child) && child.type === DetailsPageLayout.Buttons);

  return (
    <div className='container'>
      <div className={styles.heading}>
        <div className={styles.headingTitle}>
          <Heading
            level={2}
            size='lg'
          >
            {headingTitle}
          </Heading>
          <span>{headingTag}</span>
        </div>
        <div>{headingSubtitle}</div>
      </div>
      {loading && <Spinner />}
      {!loading && (
        <>
          <div className={styles.twoColumnRow}>
            <div className={styles.actionsRow}>
              <div className={styles.buttons}>{buttonsChild}</div>
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
            {leftChild}
            {rightChild}
          </div>
        </>
      )}
    </div>
  );
};

const Left = ({ children }: { children: ReactNode }) => <div className={styles.mainColumn}>{children}</div>;

const Right = ({ children }: { children: ReactNode }) => <div className={styles.rightColumn}>{children}</div>;

const Buttons = ({ children }: { children: ReactNode }) => <div>{children}</div>;

DetailsPageLayout.Left = Left;
DetailsPageLayout.Right = Right;
DetailsPageLayout.Buttons = Buttons;

export { DetailsPageLayout };
