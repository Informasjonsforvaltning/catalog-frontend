import { FC, PropsWithChildren } from 'react';
import { FieldHeader } from './field-header';
import styles from './form-field-container.module.css';

interface Props extends PropsWithChildren {
  title?: string;
  subtitle?: string;
}

export const FormFieldCard: FC<PropsWithChildren<Props>> = ({ title, subtitle, children }) => {
  return (
    <div className={styles.container}>
      <FieldHeader
        title={title ?? ''}
        subtitle={subtitle ?? ''}
      />
      <div className={styles.content}>{children}</div>
    </div>
  );
};
