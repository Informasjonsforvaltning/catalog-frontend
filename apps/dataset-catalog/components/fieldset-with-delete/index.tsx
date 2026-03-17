import React, { CSSProperties, PropsWithChildren } from "react";
import { DeleteButton } from "@catalog-frontend/ui-v2";
import styles from "./fieldset-with-delete.module.scss";

type Props = {
  onDelete: () => void;
  style?: CSSProperties | undefined;
} & PropsWithChildren;

export const FieldsetWithDelete = ({ children, onDelete, style }: Props) => {
  const childArray = React.Children.toArray(children).filter(Boolean);

  return (
    <div className={styles.content} style={style}>
      <div
        className={
          childArray.length === 1 ? styles.singleChild : styles.twoChildren
        }
      >
        {children}
      </div>
      <DeleteButton className={styles.deleteButton} onClick={onDelete} />
    </div>
  );
};

export default FieldsetWithDelete;
