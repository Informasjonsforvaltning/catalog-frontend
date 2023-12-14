import styles from './field-header.module.css';
import cn from 'classnames';

interface Props {
  title: string;
  subtitle: string;
  variant?: 'second' | 'third';
}

export const FieldHeader = ({ title, subtitle, variant }: Props) => {
  const backgroundColor = styles[variant || 'third'];
  return (
    <div className={cn(styles.header, backgroundColor)}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
};
