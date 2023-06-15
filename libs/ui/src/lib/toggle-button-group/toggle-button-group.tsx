import { ToggleButtonGroup as DigdirToggleButtonGroup } from '@digdir/design-system-react';
import styles from './toggle-button-group.module.css';

export const ToggleButtonGroup = ({ ...props }: any) => (
  <span className={styles.toggleButtonGroup}>
    <DigdirToggleButtonGroup {...props} />
  </span>
);

export default ToggleButtonGroup;
