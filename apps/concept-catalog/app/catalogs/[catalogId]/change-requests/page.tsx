import { ChangeRequest } from '@catalog-frontend/types';
import { getChangeRequests } from '@catalog-frontend/data-access';
import { BreadcrumbType, Breadcrumbs, DesignBanner } from '@catalog-frontend/ui';
import { getServerChangeRequestsPageSettings, localization } from '@catalog-frontend/utils';
import { withReadProtectedPage } from '@concept-catalog/utils/auth';
import ChangeRequestsPageClient from './change-requests-page-client';
import { cookies } from 'next/headers';

const ChangeRequestsPage = withReadProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/change-requests`,
  async ({ catalogId, session }) => {
    const reponseData: ChangeRequest[] = await getChangeRequests(catalogId, `${session.accessToken}`)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        throw error;
      });

    const breadcrumbList = [
      {
        href: `/catalogs/${catalogId}`,
        text: localization.concept.concept,
      },
      {
        href: `/catalogs/${catalogId}/change-requests`,
        text: localization.changeRequest.changeRequest,
      },
    ] as BreadcrumbType[];

    const pageSettings = getServerChangeRequestsPageSettings(await cookies());

    return (
      <>
        <Breadcrumbs
          breadcrumbList={breadcrumbList}
          catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
        />
        <DesignBanner
          title={localization.changeRequest.changeRequest}
          catalogId={catalogId}
        />
        <ChangeRequestsPageClient
          catalogId={catalogId}
          data={reponseData}
          pageSettings={pageSettings}
        />
      </>
    );
  },
);

export default ChangeRequestsPage;
