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
  ValidSession,
} from "@catalog-frontend/utils";
import {
  ChangeRequest,
  CodeListsResult,
  Concept,
  FieldsResult,
  ReferenceDataCode,
  UsersResult,
} from "@catalog-frontend/types";
import { EditPage, EditMode } from "./edit-page.client";

type LoaderArgs = {
  catalogId: string;
  conceptId: string;
  session: ValidSession;
  mode: EditMode;
};

const getTitle = (text: string | string[]) =>
  text ? text : localization.concept.noName;

const getBreadcrumbList = ({
  catalogId,
  concept,
  editPathSegment,
  editBreadcrumbLabel,
}: {
  catalogId: string;
  concept: Concept;
  editPathSegment: string;
  editBreadcrumbLabel: string;
}): BreadcrumbType[] => [
  {
    href: `/catalogs/${catalogId}`,
    text: localization.catalogType.concept,
  },
  {
    href: `/catalogs/${catalogId}/concepts/${concept.id}`,
    text: getTitle(getTranslateText(concept.anbefaltTerm?.navn)) as string,
  },
  {
    href: `/catalogs/${catalogId}/concepts/${concept.id}/${editPathSegment}`,
    text: editBreadcrumbLabel,
  },
];

export async function renderConceptEditPage({
  catalogId,
  conceptId,
  session,
  mode,
}: LoaderArgs) {
  const concept: Concept | undefined = await getConcept(
    `${conceptId}`,
    session.accessToken,
  ).then((response) => (response.ok ? response.json() : undefined));

  if (!concept || concept.ansvarligVirksomhet?.id !== catalogId) {
    return redirect("/notfound", RedirectType.replace);
  }

  if (mode === "archived" && !concept.isArchived) {
    return redirect(
      `/catalogs/${catalogId}/concepts/${conceptId}/edit`,
      RedirectType.replace,
    );
  }

  const [
    changeRequests,
    conceptStatuses,
    codeListsResult,
    fieldsResult,
    usersResult,
  ] = (await Promise.all([
    searchChangeRequest(
      catalogId,
      `${conceptId}`,
      session.accessToken,
      "OPEN",
    ).then((response) => {
      if (response.ok) {
        return response.json();
      }
      console.error(
        `Failed to fetch change requests, status: ${response.status}`,
      );
      throw new Error("Failed to fetch change requests");
    }),
    getConceptStatuses().then((body) =>
      prepareStatusList(body.conceptStatuses),
    ),
    getAllCodeLists(catalogId, session.accessToken).then((response) =>
      response.json(),
    ),
    getFields(catalogId, session.accessToken).then((response) =>
      response.json(),
    ),
    getUsers(catalogId, session.accessToken).then((response) =>
      response.json(),
    ),
  ])) as [
    ChangeRequest[],
    ReferenceDataCode[],
    CodeListsResult,
    FieldsResult,
    UsersResult,
  ];

  const editPathSegment = mode === "archived" ? "edit-archived" : "edit";
  const editBreadcrumbLabel =
    mode === "archived" ? localization.concept.editArchived : localization.edit;

  const breadcrumbList = getBreadcrumbList({
    catalogId,
    concept,
    editPathSegment,
    editBreadcrumbLabel,
  });

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
        hasChangeRequests={Boolean(changeRequests?.length)}
        mode={mode}
      />
    </>
  );
}
