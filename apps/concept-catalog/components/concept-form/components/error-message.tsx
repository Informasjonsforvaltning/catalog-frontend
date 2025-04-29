import { PropsWithChildren } from 'react';
import styles from '../concept-form.module.scss';

export const ErrorMessage = ({ children }: PropsWithChildren) => {
  return <span className={styles.errorMessage}>{children}</span>;
};
