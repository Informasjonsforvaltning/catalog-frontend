'use client';

import { NativeSelect as DigdirSelect, NativeSelectProps } from '@digdir/design-system-react';
import styles from './style.module.css';

export const Select = (props: NativeSelectProps) => {
  return (
    <div className={styles.select}>
      <DigdirSelect {...props} />
    </div>
  );
};
