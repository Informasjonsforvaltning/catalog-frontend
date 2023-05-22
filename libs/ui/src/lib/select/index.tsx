import { Select as DigdirSelect } from '@digdir/design-system-react';
import styles from './style.module.css';

export const Select = (props: any) => {
  return (
    <span className={styles.select}>
      <DigdirSelect {...props} />
    </span>
  );
};
