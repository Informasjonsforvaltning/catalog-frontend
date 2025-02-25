import { withProtectedPage } from '../../../utils/auth';
import AdminPageClient from './admin-page-client';
import { Breadcrumbs, BreadcrumbType, DesignBanner } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';

export default withProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}`,
  async ({ catalogId }) => {
    const breadcrumbList = catalogId
      ? ([
          {
            href: `/catalogs/${catalogId}`,
            text: localization.manageCatalog,
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
        <AdminPageClient catalogId={catalogId} />
      </>
    );
  },
);
