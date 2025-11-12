'use client';

import { Select as DSSelect, SelectProps as DSSelectProps } from '@digdir/designsystemet-react';
import styles from './style.module.css';

export type SelectOption = {
  label: string;
  value: string;
};

export const Select = (props: DSSelectProps) => {
  return (
    <div className={styles.select}>
      <DSSelect {...props} />
    </div>
  );
};
