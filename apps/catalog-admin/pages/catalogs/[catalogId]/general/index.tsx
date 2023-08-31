import { BreadcrumbType, Breadcrumbs, Card } from '@catalog-frontend/ui';
import styles from './general.module.css';
import React from 'react';
import { useRouter } from 'next/router';
import { getTranslateText, localization } from '@catalog-frontend/utils';

export const ConceptsPage = () => {
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';

  const breadcrumbList = catalogId
    ? ([
        {
          href: `/catalogs/${catalogId}`,
          text: getTranslateText(localization.catalogAdmin.catalogAdmin),
        },
        {
          href: `/catalogs/${catalogId}/general`,
          text: getTranslateText(localization.general),
        },
      ] as BreadcrumbType[])
    : [];

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <div className={styles.container}>
        <Card
          title={localization.catalogAdmin.design}
          body={localization.catalogAdmin.manage.design}
          href={`/catalogs/${catalogId}/general/design`}
        />
        <Card
          title={localization.catalogAdmin.userList}
          body={localization.catalogAdmin.manage.userList}
          href={`/catalogs/${catalogId}/general/users`}
        />
      </div>
    </>
  );
};

export default ConceptsPage;
