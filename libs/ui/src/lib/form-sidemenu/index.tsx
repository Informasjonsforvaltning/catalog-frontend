'use client';

import React, { PropsWithChildren } from 'react';
import styles from './form-sidemenu.module.scss';
import { Heading, Link, Tag } from '@digdir/designsystemet-react';
import classNames from 'classnames';
import { localization } from '@catalog-frontend/utils';

type SideMenuProps = {
  heading?: string;
} & PropsWithChildren;

type MenuItemProps = {
  active: boolean;
  required?: boolean;
  id: string;
  title: string;
  changed?: boolean;
  error?: boolean;
  onClick: () => void;
};

export const SideMenu = ({ heading, children }: SideMenuProps) => {
  return (
    <div>
      <Heading
        data-size='sm'
        className={styles.sideMenuHeading}
      >
        {heading}
      </Heading>
      <ol className={styles.list}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === MenuItem) {
            // eslint-disable-next-line react/jsx-no-useless-fragment
            return <>{child}</>;
          }
        })}
      </ol>
      <div className={styles.sideMenuFooter}>* Påkrevd</div>
    </div>
  );
};

export const MenuItem = ({
  active,
  required = false,
  id,
  title,
  changed,
  error,
  onClick,
}: MenuItemProps) => {
  return (
    <li className={classNames(active ? styles.active : {}, required ? styles.required : {})}>
      <Link onClick={onClick}>
        <span>
          {title}{' '}
          {required && (
            <span
              className={styles.required}
              aria-label={localization.conceptForm.validation.required}
            >
              *
            </span>
          )}
        </span>
        {changed && (
          <Tag
            data-size='sm'
            color='warning'
            style={{ scale: 0.8, margin: '-0.25rem 0' }}
          >
            {localization.changed}
          </Tag>
        )}
        {error && (
          <Tag
            data-size='sm'
            color='danger'
            style={{ scale: 0.8, margin: '-0.25rem 0' }}
          >
            {localization.error}
          </Tag>
        )}
      </Link>
    </li>
  );
};

