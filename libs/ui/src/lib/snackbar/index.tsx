'use client';

import React, { Children, MouseEventHandler, ReactNode } from 'react';
import styles from './snackbar.module.scss';
import classNames from 'classnames';
import { Alert } from '@digdir/designsystemet-react';

type SnackbarProps = {
  children: ReactNode;
  duration?: number;
};

type SnackbarItemProps = {
  fadeIn?: boolean;
  children: ReactNode;
  severity?: 'success' | 'danger' | 'info' | 'warning';
  onClick?: MouseEventHandler<HTMLDivElement>;
};

const SnackbarItem = ({ children, fadeIn = true, severity = 'info', onClick }: SnackbarItemProps) => {
  return (
    <Alert
      className={classNames(styles.snackbaItem, ...(fadeIn ? [styles.fadeIn] : []))}
      size='sm'
      severity={severity}
      onClick={onClick}
    >
      {children}
    </Alert>
  );
};

const Snackbar = ({ children }: SnackbarProps) => {
  const items = Children.toArray(children)
    .filter((child) => React.isValidElement(child) && child.type === SnackbarItem)
    .map((child) => child as React.ReactElement);

  return <div className={styles.snackbar}>{items}</div>;
};

Snackbar.Item = SnackbarItem;

export { Snackbar };
