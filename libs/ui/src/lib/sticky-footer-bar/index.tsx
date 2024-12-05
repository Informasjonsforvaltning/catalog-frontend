import { PropsWithChildren } from 'react';
import classNames from 'classnames';
import styles from './sticky-footer-bar.module.css';

const StickyFooterBar = ({ children }: PropsWithChildren) => {
  return (
    <div className={styles.stickyFooterBar}>
      <div className={classNames('container', styles.stickyFooterContent)}>{children}</div>
    </div>
  );
};

export { StickyFooterBar };
