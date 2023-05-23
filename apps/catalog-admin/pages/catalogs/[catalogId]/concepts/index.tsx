import { Card } from '@catalog-frontend/ui';
import styles from './concepts.module.css';
import React from 'react';
import { useRouter } from 'next/router';

export const ConceptsPage = () => {
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';

  return (
    <div className={styles.container}>
      <Card
        title='Kodeliste'
        body='Administrer kodeliste'
        href={`/catalogs/${catalogId}/concepts/code-lists`}
      />
      <Card
        title='Interne felt'
        body='Administrer interne felt'
        href={`/catalogs/${catalogId}/concepts/internal-fields`}
      />
    </div>
  );
};

export default ConceptsPage;
