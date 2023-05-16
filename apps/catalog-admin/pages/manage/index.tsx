import {Card} from '@catalog-frontend/ui';
import styles from './manage.module.css';

export const ManagePage = () => {
  return (
    <div className={styles.container}>
      <Card title='Kodeliste' body='Administrer kodeliste' />
      <Card title='Interne felt' body='Administrer interne felt' />
    </div>
  );
};

export default ManagePage;
