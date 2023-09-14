import { capitalizeFirstLetter } from '@catalog-frontend/utils';
import { Tag as FdsTag } from '@digdir/design-system-react';
import styles from './tag.module.css';

interface TagProps {
  children?: string;
}

export function Tag({ children }: TagProps) {
  return (
    <div>
      <FdsTag
        className={styles[children ? `${children}`.toLocaleLowerCase() : '']}
        size='small'
        variant='outlined'
      >
        {children && capitalizeFirstLetter(`${children}`)}
      </FdsTag>
    </div>
  );
}

export default Tag;
