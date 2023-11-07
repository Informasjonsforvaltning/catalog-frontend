'use client';

import { ToggleButtonGroup as DigdirToggleButtonGroup } from '@digdir/design-system-react';
import styles from './toggle-button-group.module.css';

const ToggleButtonGroup = ({ ...props }: any) => (
  <span className={styles.toggleButtonGroup}>
    <DigdirToggleButtonGroup {...props} />
  </span>
);

export { ToggleButtonGroup };
