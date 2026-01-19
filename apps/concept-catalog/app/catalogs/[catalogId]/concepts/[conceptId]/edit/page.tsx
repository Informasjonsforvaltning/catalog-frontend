import {
  getAllCodeLists,
  getConcept,
  getConceptStatuses,
  getFields,
  getUsers,
  searchChangeRequest,
} from "@catalog-frontend/data-access";
import { redirect, RedirectType } from "next/navigation";
import {
  Breadcrumbs,
  BreadcrumbType,
  DesignBanner,
} from "@catalog-frontend/ui";
import {
  getTranslateText,
  localization,
  prepareStatusList,
} from "@catalog-frontend/utils";
import {
  CodeListsResult,
  Concept,
  FieldsResult,
  UsersResult,
} from "@catalog-frontend/types";
import { withWriteProtectedPage } from "@concept-catalog/utils/auth";
import { EditPage } from "./edit-page.client";

export default withWriteProtectedPage(
  ({ catalogId, conceptId }) =>
    `/catalogs//${catalogId}/concepts/${conceptId}/edit`,
  async ({ catalogId, conceptId, session }) => {
    const concept: Concept = await getConcept(
      `${conceptId}`,
      `${session?.accessToken}`,
    ).then((response) => {
      if (response.ok) return response.json();
    });
    if (!concept || concept.ansvarligVirksomhet?.id !== catalogId) {
      return redirect(`/notfound`, RedirectType.replace);
    }

    const changeRequests = await searchChangeRequest(
      catalogId,
      `${conceptId}`,
      `${session?.accessToken}`,
      "OPEN",
    ).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.error(
          `Failed to fetch change requests, status: ${response.status}`,
        );
        throw new Error("Failed to fetch change requests");
      }
    });

    const conceptStatuses = await getConceptStatuses().then((body) =>
      prepareStatusList(body.conceptStatuses),
    );

    const codeListsResult: CodeListsResult = await getAllCodeLists(
      catalogId,
      `${session?.accessToken}`,
    ).then((response) => response.json());
    const fieldsResult: FieldsResult = await getFields(
      catalogId,
      `${session?.accessToken}`,
    ).then((response) => response.json());
    const usersResult: UsersResult = await getUsers(
      catalogId,
      `${session?.accessToken}`,
    ).then((response) => response.json());

    const getTitle = (text: string | string[]) =>
      text ? text : localization.concept.noName;
    const breadcrumbList = catalogId
      ? ([
          {
            href: `/catalogs/${catalogId}`,
            text: localization.catalogType.concept,
          },
          {
            href: `/catalogs/${catalogId}/concepts/${concept?.id}`,
            text: getTitle(getTranslateText(concept?.anbefaltTerm?.navn)),
          },
          {
            href: `/catalogs/${catalogId}/concepts/${concept?.id}/edit`,
            text: localization.edit,
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
        <EditPage
          catalogId={catalogId}
          concept={concept}
          conceptStatuses={conceptStatuses}
          codeListsResult={codeListsResult}
          fieldsResult={fieldsResult}
          usersResult={usersResult}
          hasChangeRequests={changeRequests?.length}
        />
      </>
    );
  },
);
