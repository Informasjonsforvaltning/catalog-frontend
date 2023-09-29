import React from 'react';
import styles from './page-layout.module.css';

export const PageLayout = ({ children }: React.PropsWithChildren<React.ReactNode>) => {
  return (
    <>
      <div className='center'>
        <div className={styles.page}>{children}</div>
      </div>
    </>
  );
};
