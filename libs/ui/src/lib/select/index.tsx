'use client';

import { Select as DigdirSelect, SelectProps } from '@digdir/design-system-react';
import styles from './style.module.css';

export const Select = (props: SelectProps) => {
  return (
    <div className={styles.select}>
      <DigdirSelect {...props} />
    </div>
  );
};
