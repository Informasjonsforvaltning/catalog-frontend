'use client';

import { BreadcrumbType, Breadcrumbs, NavigationCard } from '@catalog-frontend/ui';
import React from 'react';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Banner } from '../../../../components/banner';
import { PaletteIcon, PersonIcon } from '@navikt/aksel-icons';
import styles from './general-page.module.css';
import { Organization } from '@catalog-frontend/types';

export interface GeneralPageClientProps {
  organization: Organization;
  catalogId: string;
}

export const GeneralPageClient = ({ catalogId, organization }: GeneralPageClientProps) => {
  const breadcrumbList = catalogId
    ? ([
        {
          href: `/catalogs/${catalogId}`,
          text: getTranslateText(localization.manageCatalog),
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
      <Banner
        title={localization.manageCatalog}
        orgName={`${getTranslateText(organization?.prefLabel)}`}
        catalogId={catalogId}
      />
      <div className={styles.cardsContainer}>
        <NavigationCard
          icon={<PaletteIcon fontSize='3rem' />}
          title={localization.catalogAdmin.design}
          body={localization.catalogAdmin.manage.design}
          href={`/catalogs/${catalogId}/general/design`}
        />
        <NavigationCard
          icon={<PersonIcon fontSize='3rem' />}
          title={localization.catalogAdmin.username}
          body={localization.catalogAdmin.manage.username}
          href={`/catalogs/${catalogId}/general/users`}
        />
      </div>
    </>
  );
};

export default GeneralPageClient;
