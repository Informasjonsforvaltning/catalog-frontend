import React, { memo, FC, PropsWithChildren, ReactNode } from 'react';
import classes from './key-value-list-item.module.css';

interface Props {
  property: string | ReactNode;
  value: string | ReactNode;
}

const KeyValueListItem: FC<PropsWithChildren<Props>> = ({ property, value, ...props }) => (
  <li
    className={classes.listItem}
    {...props}
  >
    {property && <div className={classes.property}>{property}</div>}
    <div className={classes.value}>{value}</div>
  </li>
);

export { KeyValueListItem };
