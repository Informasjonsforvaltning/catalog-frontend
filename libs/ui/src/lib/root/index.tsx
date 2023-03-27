import { FC, PropsWithChildren } from 'react';
import styles from './root.module.css';
  

export const Root: FC<PropsWithChildren> = ({children}) => {
  return (
    <div className={styles['root']}>
     {children}
    </div>
  );
};


export default Root;
