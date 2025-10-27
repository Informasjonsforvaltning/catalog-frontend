import { withProtectedPage } from '../../../../../utils/auth';
import InternalFieldsPageClient from './internal-page-client';
import { Breadcrumbs, BreadcrumbType, DesignBanner } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';

export default withProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/concepts/internal-fields`,
  async ({ catalogId }) => {
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
          {
            href: `/catalogs/${catalogId}/concepts/internal-fields`,
            text: localization.catalogAdmin.internalFields,
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
          title={localization.catalogAdmin.manage.conceptCatalog}
          catalogId={catalogId}
        />
        <InternalFieldsPageClient catalogId={catalogId} />
      </>
    );
  },
);
