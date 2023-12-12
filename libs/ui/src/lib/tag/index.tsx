'use client';

import { capitalizeFirstLetter } from '@catalog-frontend/utils';
import { Tag as FdsTag } from '@digdir/design-system-react';
import styles from './tag.module.css';

interface TagProps {
  children?: string;
}

const Tag = ({ children }: TagProps) => {
  return (
    <div>
      <FdsTag
        className={styles[children ? `${children}`.toLocaleLowerCase().replace(/\s/g, '') : '']}
        size='small'
        variant='secondary'
      >
        {children && capitalizeFirstLetter(`${children}`)}
      </FdsTag>
    </div>
  );
};

export { Tag };
