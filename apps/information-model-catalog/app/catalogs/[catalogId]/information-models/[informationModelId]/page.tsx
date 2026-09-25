import {
  Breadcrumbs,
  BreadcrumbType,
  DesignBanner,
} from "@catalog-frontend/ui";
import {
  getTranslateText,
  hasOrganizationWritePermission,
  localization,
  validInformationModelID,
} from "@catalog-frontend/utils";
import { getProductStatuses } from "@catalog-frontend/data-access";
import { redirect, RedirectType } from "next/navigation";
import InformationModelDetailsPageClient from "./information-model-details-page-client";
import { withReadProtectedPage } from "@information-model-catalog/utils/auth";
import { fetchInformationModelWithRetry } from "@information-model-catalog/utils/information-model";

const InformationModelDetailsPage = withReadProtectedPage(
  ({ catalogId, informationModelId }) =>
    `/catalogs/${catalogId}/information-models/${informationModelId}`,
  async ({ catalogId, informationModelId, session }) => {
    if (!informationModelId || !validInformationModelID(informationModelId)) {
      return redirect("/not-found", RedirectType.replace);
    }

    const [informationModel, statusesResponse] = await Promise.all([
      fetchInformationModelWithRetry(
        catalogId,
        informationModelId,
        session.accessToken,
      ),
      getProductStatuses(),
    ]);

    if (!informationModel || informationModel.catalogId !== catalogId) {
      redirect("/not-found", RedirectType.replace);
    }

    const hasWritePermission = hasOrganizationWritePermission(
      session.accessToken,
      catalogId,
    );

    const breadcrumbList = [
      {
        href: `/catalogs/${catalogId}/information-models`,
        text: localization.catalogType.informationModel,
      },
      {
        href: `/catalogs/${catalogId}/information-models/${informationModelId}`,
        text: getTranslateText(informationModel.title),
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
        <div className="container">
          <InformationModelDetailsPageClient
            informationModel={informationModel}
            catalogId={catalogId}
            informationModelId={informationModelId}
            hasWritePermission={hasWritePermission}
            statuses={statusesResponse.productStatuses}
          />
        </div>
      </>
    );
  },
);

export default InformationModelDetailsPage;
