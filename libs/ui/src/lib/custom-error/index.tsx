import styles from './custom-error.module.css';
import { localization as loc } from '@catalog-frontend/utils';

const CustomError = () => (
  <div className={styles.error}>
    <span>{loc.somethingWentWrong}</span>
  </div>
);

export { CustomError };
