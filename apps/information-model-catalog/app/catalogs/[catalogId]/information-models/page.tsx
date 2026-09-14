import { InformationModel } from "@catalog-frontend/types";
import {
  BreadcrumbType,
  Breadcrumbs,
  DesignBanner,
} from "@catalog-frontend/ui";
import {
  localization,
  getServerInformationModelsPageSettings,
} from "@catalog-frontend/utils";

import InformationModelPageClient from "./information-models-page-client";
import { getInformationModels } from "../../../actions/actions";
import { withReadProtectedPage } from "@information-model-catalog/utils/auth";
import { cookies } from "next/headers";

const InformationModelsSearchHits = withReadProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/information-models`,
  async ({ catalogId, hasWritePermission, hasAdminPermission }) => {
    const informationModels: InformationModel[] =
      await getInformationModels(catalogId);

    const cookieStore = await cookies();
    const pageSettings = getServerInformationModelsPageSettings(cookieStore);

    const breadcrumbList = [
      {
        href: `/catalogs/${catalogId}/information-models`,
        text: localization.catalogType.informationModel,
      },
    ] as BreadcrumbType[];

    return (
      <>
        <Breadcrumbs
          breadcrumbList={breadcrumbList}
          catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
        />
        <DesignBanner
          title={localization.catalogType.informationModel}
          catalogId={catalogId}
        />
        <InformationModelPageClient
          informationModels={informationModels}
          catalogId={catalogId}
          hasWritePermission={hasWritePermission}
          hasAdminPermission={hasAdminPermission}
          pageSettings={pageSettings}
        />
      </>
    );
  },
);

export default InformationModelsSearchHits;
