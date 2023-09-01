import { BreadcrumbType, Breadcrumbs, Card } from '@catalog-frontend/ui';
import styles from './concepts.module.css';
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
          href: `/catalogs/${catalogId}/concepts`,
          text: getTranslateText(localization.catalogType.concept),
        },
      ] as BreadcrumbType[])
    : [];

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <div className={styles.container}>
        <Card
          title={localization.catalogAdmin.codeList}
          body={localization.catalogAdmin.manage.codeList}
          href={`/catalogs/${catalogId}/concepts/code-lists`}
        />
        <Card
          title={localization.catalogAdmin.internalFields}
          body={localization.catalogAdmin.manage.internalFields}
          href={`/catalogs/${catalogId}/concepts/internal-fields`}
        />
      </div>
      <div className={styles.container}>
        <Card
          title={localization.catalogAdmin.editableFields}
          body={localization.catalogAdmin.manage.editableFields}
          href={`/catalogs/${catalogId}/concepts/editable-fields`}
        />
      </div>
    </>
  );
};

export default ConceptsPage;
