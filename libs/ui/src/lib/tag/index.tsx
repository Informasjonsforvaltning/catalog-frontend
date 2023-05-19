import styles from './tag.module.css';
import cn from 'classnames';
interface TagProps {
  label?: string;
}

export function Tag({label}: TagProps) {
  return (
    <div className={cn(styles.container, styles[label ? label : ''])}>
      <p className={styles.text}>
        {label && label.charAt(0).toUpperCase() + label.substring(1)}
      </p>
    </div>
  );
}

export default Tag;
