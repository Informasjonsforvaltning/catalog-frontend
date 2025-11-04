import React, { FC, PropsWithChildren, Children, isValidElement } from "react";

import classes from "./key-value-list.module.css";

const KeyValueList: FC<PropsWithChildren<any>> = ({ children, ...props }) => (
  <ul className={classes.keyValueList} {...props}>
    {Children.map(children, (child) => (isValidElement(child) ? child : null))}
  </ul>
);

export { KeyValueList };
