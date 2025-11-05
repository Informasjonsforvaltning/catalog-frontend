import { withProtectedPage } from "../../../../../utils/auth";
import EditableFieldsClient from "./editable-fields-client";
import {
  BreadcrumbType,
  Breadcrumbs,
  DesignBanner,
} from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";

export default withProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/concepts/editable-fields`,
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
            href: `/catalogs/${catalogId}/concepts/editable-fields`,
            text: localization.catalogAdmin.editableFields,
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
        <EditableFieldsClient catalogId={catalogId} />
      </>
    );
  },
);
