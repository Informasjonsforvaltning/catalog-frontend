import {
  Breadcrumbs,
  BreadcrumbType,
  DesignBanner,
} from "@catalog-frontend/ui";
import { informationModelToBeCreatedTemplate } from "../../../../../components/information-model-form/utils/information-model-initial-values";
import { localization } from "@catalog-frontend/utils";
import { withWriteProtectedPage } from "@information-model-catalog/utils/auth";
import { NewInformationModelPageClient } from "./new-page-client";

const NewInformationModelPage = withWriteProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/information-models/new`,
  async ({ catalogId }) => {
    const initialValues = informationModelToBeCreatedTemplate();

    const breadcrumbList = [
      {
        href: `/catalogs/${catalogId}/information-models`,
        text: localization.catalogType.informationModel,
      },
      {
        href: `/catalogs/${catalogId}/information-models/new`,
        text: localization.informationModelCatalog.button.newInformationModel,
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
        <NewInformationModelPageClient
          catalogId={catalogId}
          initialValues={initialValues}
        />
      </>
    );
  },
);

export default NewInformationModelPage;
