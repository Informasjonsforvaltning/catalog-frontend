import { FC, PropsWithChildren } from 'react';
import { FieldHeader } from './field-header';
import styles from './form-field-container.module.css';

interface Props extends PropsWithChildren {
  title?: string;
  subtitle?: string;
  variant?: 'second' | 'third';
}

export const FormFieldCard: FC<PropsWithChildren<Props>> = ({ title, subtitle, variant, children }) => {
  return (
    <div className={styles.container}>
      <FieldHeader
        title={title ?? ''}
        subtitle={subtitle ?? ''}
        variant={variant}
      />
      <div className={styles.content}>{children}</div>
    </div>
  );
};
