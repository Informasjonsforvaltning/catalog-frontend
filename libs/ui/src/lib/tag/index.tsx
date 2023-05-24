import { capitalizeFirstLetter } from '@catalog-frontend/utils';
import styles from './tag.module.css';
import cn from 'classnames';
interface TagProps {
  children?: string;
}

export function Tag({ children }: TagProps) {
  return (
    <div className={cn(styles.container, styles[children ? children.toLocaleLowerCase() : ''])}>
      <p className={styles.text}>{children && capitalizeFirstLetter(children)}</p>
    </div>
  );
}

export default Tag;
