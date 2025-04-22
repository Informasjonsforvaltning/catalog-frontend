import { Children, PropsWithChildren, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './button-bar.module.scss';
import React from 'react';

const Left = ({ children }: PropsWithChildren) => <div className={styles.left}>{children}</div>;

const Right = ({ children }: PropsWithChildren) => <div className={styles.right}>{children}</div>;

const ButtonBar = ({ children }: PropsWithChildren) => {
  const childrenArray = Children.toArray(children);
  const left = childrenArray
    .filter((child) => React.isValidElement(child) && child.type === Left)
    .map((child) => child as React.ReactElement)[0];

  const right = childrenArray
    .filter((child) => React.isValidElement(child) && child.type === Right)
    .map((child) => child as React.ReactElement)[0];

  return (
    <div className={classNames('container', styles.buttonBar)}>
      {left}
      {right}
    </div>
  );
};

ButtonBar.Left = Left;
ButtonBar.Right = Right;

export { ButtonBar };
