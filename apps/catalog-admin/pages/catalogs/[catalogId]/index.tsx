import React from 'react';
import { useRouter } from 'next/router';
import { Card } from '@catalog-frontend/ui';

import styles from './style.module.css';

export const CatalogsAdminPage = () => {
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';

  return (
    <>
      <div>{catalogId}</div>
      <div>
        <div className={styles.card}>
          <Card
            title='Generelt'
            body='Oversikt over beskrivelser av datasett, begrep, apier og informasjonmodeller. Innholdet blir levert av ulike virksomheter, offentlige og private.'
            href={`/catalogs/${catalogId}/general`}
          />
          <Card
            title='Begrepskatalog'
            body='Formålet med begrepskatalogen er å gjøre dataene mer forståelige. Like begreper kan brukes på forskjellige måter i ulik kontekster.'
            href={`/catalogs/${catalogId}/concepts`}
          />
        </div>
      </div>
    </>
  );
};

export default CatalogsAdminPage;
