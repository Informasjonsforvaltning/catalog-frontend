'use client';

import { NativeSelect as DigdirSelect, NativeSelectProps } from '@digdir/designsystemet-react';
import styles from './style.module.css';

export const Select = (props: NativeSelectProps) => {
  return (
    <div className={styles.select}>
      <DigdirSelect {...props} />
    </div>
  );
};
