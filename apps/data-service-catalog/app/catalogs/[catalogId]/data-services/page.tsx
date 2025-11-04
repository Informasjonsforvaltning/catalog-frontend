import { DataService } from "@catalog-frontend/types";
import {
  BreadcrumbType,
  Breadcrumbs,
  DesignBanner,
} from "@catalog-frontend/ui";
import {
  localization,
  redirectToSignIn,
  getServerDataServicesPageSettings,
} from "@catalog-frontend/utils";

import { getDistributionStatuses } from "@catalog-frontend/data-access";
import DataServicePageClient from "./data-services-page-client";
import { getDataServices } from "../../../actions/actions";
import { withReadProtectedPage } from "@data-service-catalog/utils/auth";
import { cookies } from "next/headers";

const DataServicesSearchHits = withReadProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/data-services`,
  async ({ catalogId, session, hasWritePermission, hasAdminPermission }) => {
    if (!session) {
      return redirectToSignIn({
        callbackUrl: `/catalogs/${catalogId}/data-services`,
      });
    }
    const dataServices: DataService[] = await getDataServices(catalogId);

    const distributionStatuses = await getDistributionStatuses()
      .then((response) => response.json())
      .then((body) => body?.distributionStatuses ?? []);

    const cookieStore = await cookies();
    const pageSettings = getServerDataServicesPageSettings(cookieStore);

    const breadcrumbList = [
      {
        href: `/catalogs/${catalogId}/data-services`,
        text: localization.catalogType.dataService,
      },
    ] as BreadcrumbType[];

    return (
      <>
        <Breadcrumbs
          breadcrumbList={breadcrumbList}
          catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
        />
        <DesignBanner
          title={localization.catalogType.dataService}
          catalogId={catalogId}
        />
        <DataServicePageClient
          dataServices={dataServices}
          catalogId={catalogId}
          hasWritePermission={hasWritePermission}
          hasAdminPermission={hasAdminPermission}
          distributionStatuses={distributionStatuses}
          pageSettings={pageSettings}
        />
      </>
    );
  },
);

export default DataServicesSearchHits;
