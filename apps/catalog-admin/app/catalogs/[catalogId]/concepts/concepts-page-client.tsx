'use client';

import { BreadcrumbType, Breadcrumbs, NavigationCard } from '@catalog-frontend/ui';
import React from 'react';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Banner } from '../../../../components/banner';
import { DatabaseIcon, PencilWritingIcon, RectangleSectionsIcon } from '@navikt/aksel-icons';
import styles from './concepts-page.module.css';
import { Organization } from '@catalog-frontend/types';

export interface ConceptsPageClientProps {
  organization: Organization;
  catalogId: string;
}

export const ConceptsPageClient = ({ catalogId, organization }: ConceptsPageClientProps) => {
  const breadcrumbList = catalogId
    ? ([
        {
          href: `/catalogs/${catalogId}`,
          text: localization.manageCatalog,
        },
        {
          href: `/catalogs/${catalogId}/concepts`,
          text: localization.catalogType.concept,
        },
      ] as BreadcrumbType[])
    : [];

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <Banner
        title={localization.catalogAdmin.manage.conceptCatalog}
        orgName={`${getTranslateText(organization?.prefLabel)}`}
        catalogId={catalogId}
      />
      <div className={styles.cardsContainer}>
        <div className={styles.cardsGrid}>
          <NavigationCard
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
          <NavigationCard
            icon={<RectangleSectionsIcon fontSize='3rem' />}
            title={localization.catalogAdmin.internalFields}
            body={localization.catalogAdmin.manage.internalFields}
            href={`/catalogs/${catalogId}/concepts/internal-fields`}
          />
          <NavigationCard
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
