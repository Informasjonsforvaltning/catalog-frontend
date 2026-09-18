import {
  Breadcrumbs,
  BreadcrumbType,
  DesignBanner,
} from "@catalog-frontend/ui";
import {
  getTranslateText,
  localization,
  validInformationModelID,
} from "@catalog-frontend/utils";
import { redirect, RedirectType } from "next/navigation";
import { withWriteProtectedPage } from "@information-model-catalog/utils/auth";
import { EditPage } from "./edit-page-client";
import { fetchInformationModelWithRetry } from "@information-model-catalog/utils/information-model";

const EditInformationModelPage = withWriteProtectedPage(
  ({ catalogId, informationModelId }) =>
    `/catalogs/${catalogId}/information-models/${informationModelId}/edit`,
  async ({ catalogId, informationModelId, session }) => {
    if (!informationModelId || !validInformationModelID(informationModelId)) {
      return redirect("/not-found", RedirectType.replace);
    }

    const informationModel = await fetchInformationModelWithRetry(
      catalogId,
      informationModelId,
      session.accessToken,
    );

    if (!informationModel || informationModel.catalogId !== catalogId) {
      redirect("/not-found", RedirectType.replace);
    }

    const breadcrumbList = [
      {
        href: `/catalogs/${catalogId}/information-models`,
        text: localization.catalogType.informationModel,
      },
      {
        href: `/catalogs/${catalogId}/information-models/${informationModelId}`,
        text: getTranslateText(informationModel.title),
      },
      {
        href: `/catalogs/${catalogId}/information-models/${informationModelId}/edit`,
        text: localization.edit,
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
        <EditPage catalogId={catalogId} informationModel={informationModel} />
      </>
    );
  },
);

export default EditInformationModelPage;
