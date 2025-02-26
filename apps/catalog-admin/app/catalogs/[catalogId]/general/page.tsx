import React from 'react';
import { withProtectedPage } from '../../../../utils/auth';
import GeneralPageClient from './general-page-client';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { BreadcrumbType, Breadcrumbs, DesignBanner } from '@catalog-frontend/ui';

export default withProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/general`,
  async ({ catalogId }) => {
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
        <Breadcrumbs
          breadcrumbList={breadcrumbList}
          catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
        />
        <DesignBanner
          title={localization.manageCatalog}
          catalogId={catalogId}
        />
        <GeneralPageClient catalogId={catalogId} />
      </>
    );
  },
);
