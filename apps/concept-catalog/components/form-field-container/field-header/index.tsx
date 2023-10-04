import styles from './field-header.module.css';

interface Props {
  title: string;
  subtitle: string;
}

export const FieldHeader = ({ title, subtitle }: Props) => {
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
};
