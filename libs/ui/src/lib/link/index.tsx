import { ExternalLinkIcon } from '@navikt/aksel-icons';
import styles from './link.module.css';

import React, { FC, ComponentPropsWithoutRef, PropsWithChildren, ReactNode, ComponentType } from 'react';

export interface Props extends ComponentPropsWithoutRef<'a'> {
  /**
   * An alternative to href
   */
  to?: string;
  /**
   * An indication whether link points to an external resource
   * @type {boolean}
   * @default false
   */
  external?: boolean;
  /**
   * Icon placed before link text
   * @type {ReactNode}
   */
  icon?: ReactNode;
  /**
   * Component to render
   * @default a
   */
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
}

export const Link: FC<PropsWithChildren<Props>> = ({ external, icon, children, as = 'a', ...props }) => {
  const As = as;
  return (
    <As
      className={styles.link}
      target={external ? '_blank' : undefined}
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
      {external && <ExternalLinkIcon title='ExternalLinkIcon' />}
    </As>
  );
};

export default Link;
