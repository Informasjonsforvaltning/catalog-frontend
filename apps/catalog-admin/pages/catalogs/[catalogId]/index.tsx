import React from 'react';
import { useRouter } from 'next/router';
import { Card } from '@catalog-frontend/ui';

import styles from './style.module.css';
import { localization } from '@catalog-frontend/utils';

export const CatalogsAdminPage = () => {
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';

  return (
    <>
      <div>
        <div className={styles.card}>
          <Card
            title={localization.general}
            body={localization.catalogAdmin.description.general}
            href={`/catalogs/${catalogId}/general`}
          />
          <Card
            title={localization.catalogType.concept}
            body={localization.catalogAdmin.description.conceptCatalog}
            href={`/catalogs/${catalogId}/concepts`}
          />
        </div>
      </div>
    </>
  );
};

export default CatalogsAdminPage;
