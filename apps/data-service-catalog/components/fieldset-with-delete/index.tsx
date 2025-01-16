import React, { PropsWithChildren } from 'react';
import { DeleteButton } from '@catalog-frontend/ui';
import styles from './fieldset-with-delete.module.scss';

type Props = {
  onDelete: () => void;
} & PropsWithChildren;

export const FieldsetWithDelete = ({ children, onDelete }: Props) => {
  const childArray = React.Children.toArray(children).filter(Boolean);

  return (
    <div className={styles.content}>
      <div className={childArray.length === 1 ? styles.singleChild : styles.twoChildren}>{children}</div>
      <DeleteButton
        className={styles.deleteButton}
        onClick={onDelete}
      />
    </div>
  );
};

export default FieldsetWithDelete;
