'use client';

import { BreadcrumbType, Breadcrumbs, Card } from '@catalog-frontend/ui';
import React from 'react';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Banner } from '../../../../components/banner';
import { DatabaseIcon, PencilWritingIcon, RectangleSectionsIcon } from '@navikt/aksel-icons';
import styles from './concepts-page.module.css';

export const ConceptsPageClient = ({ catalogId, organization }) => {
  const breadcrumbList = catalogId
    ? ([
        {
          href: `/catalogs/${catalogId}`,
          text: getTranslateText(localization.catalogAdmin.manage.catalogAdmin),
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
      <Banner orgName={organization?.prefLabel} />
      <div className={styles.cardsContainer}>
        <div className={styles.cardsGrid}>
          <Card
            icon={
              <DatabaseIcon
                title='a11y-title'
                fontSize='3rem'
              />
            }
            title={localization.catalogAdmin.codeLists}
            body={localization.catalogAdmin.manage.codeList}
            href={`/catalogs/${catalogId}/concepts/code-lists`}
          />
          <Card
            icon={<RectangleSectionsIcon fontSize='3rem' />}
            title={localization.catalogAdmin.internalFields}
            body={localization.catalogAdmin.manage.internalFields}
            href={`/catalogs/${catalogId}/concepts/internal-fields`}
          />
          <Card
            icon={<PencilWritingIcon fontSize='3rem' />}
            title={localization.catalogAdmin.editableFields}
            body={localization.catalogAdmin.manage.editableFields}
            href={`/catalogs/${catalogId}/concepts/editable-fields`}
          />
        </div>
      </div>
    </>
  );
};

export default ConceptsPageClient;
