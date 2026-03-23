import { Fields } from "@catalog-frontend/types";
import { withProtectedPage } from "../../../../../utils/auth";
import { getFields } from "@catalog-frontend/data-access";
import CodeListsPageClient from "./code-list-page-client";
import {
  Breadcrumbs,
  BreadcrumbType,
  DesignBanner,
} from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";

export default withProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/concepts/code-lists`,
  async ({ catalogId, session }) => {
    const { internal, editable }: Fields = await getFields(
      catalogId,
      session.accessToken,
    ).then((res) => res.json());

    const codeListsInUse: string[] = [];

    internal.forEach((field) => {
      if (field.codeListId != null) {
        codeListsInUse.push(field.codeListId);
      }
    });

    if (editable?.domainCodeListId !== null) {
      codeListsInUse.push(editable.domainCodeListId);
    }

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
            href: `/catalogs/${catalogId}/concepts/code-lists`,
            text: localization.catalogAdmin.codeLists,
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
        <CodeListsPageClient
          catalogId={catalogId}
          codeListsInUse={codeListsInUse}
        />
      </>
    );
  },
);
