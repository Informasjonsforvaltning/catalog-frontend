import {
  getAllCodeLists,
  getConceptStatuses,
  getFields,
  getUsers,
} from "@catalog-frontend/data-access";
import {
  Breadcrumbs,
  BreadcrumbType,
  DesignBanner,
} from "@catalog-frontend/ui";
import { localization, prepareStatusList } from "@catalog-frontend/utils";
import {
  CodeListsResult,
  FieldsResult,
  UsersResult,
} from "@catalog-frontend/types";
import { withWriteProtectedPage } from "@concept-catalog/utils/auth";

import { NewPage } from "./new-page.client";

export default withWriteProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/concepts/new`,
  async ({ catalogId, session }) => {
    const conceptStatuses = await getConceptStatuses().then((body) =>
      prepareStatusList(body.conceptStatuses),
    );

    const codeListsResult: CodeListsResult = await getAllCodeLists(
      catalogId,
      session.accessToken,
    ).then((response) => response.json());
    const fieldsResult: FieldsResult = await getFields(
      catalogId,
      session.accessToken,
    ).then((response) => response.json());
    const usersResult: UsersResult = await getUsers(
      catalogId,
      session.accessToken,
    ).then((response) => response.json());

    const concept = {
      ansvarligVirksomhet: {
        id: catalogId,
      },
    };

    const breadcrumbList = catalogId
      ? ([
          {
            href: `/catalogs/${catalogId}`,
            text: localization.catalogType.concept,
          },
          {
            href: `/catalogs/${catalogId}/concepts/new`,
            text: localization.newConcept,
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
          title={localization.catalogType.concept}
          catalogId={catalogId}
        />
        <NewPage
          catalogId={catalogId}
          concept={concept}
          conceptStatuses={conceptStatuses}
          codeListsResult={codeListsResult}
          fieldsResult={fieldsResult}
          usersResult={usersResult}
        />
      </>
    );
  },
);
