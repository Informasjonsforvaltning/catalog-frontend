import { redirect, RedirectType } from "next/navigation";
import {
  getAllCodeLists,
  getChangeRequest,
  getConceptRevisions,
  getConceptStatuses,
  getFields,
  getOrganization,
  getUsers,
} from "@catalog-frontend/data-access";
import {
  ChangeRequest,
  CodeListsResult,
  Concept,
  FieldsResult,
  Organization,
  UsersResult,
} from "@catalog-frontend/types";
import {
  BreadcrumbType,
  Breadcrumbs,
  DesignBanner,
} from "@catalog-frontend/ui";
import {
  conceptIsHigherVersion,
  localization,
  validUUID,
  prepareStatusList,
} from "@catalog-frontend/utils";
import jsonpatch from "fast-json-patch";
import { withReadProtectedPage } from "@concept-catalog/utils/auth";
import { EditConceptFormClient } from "./edit-concept-form-client";

const ChangeRequestEditPage = withReadProtectedPage(
  ({ catalogId, changeRequestId }) =>
    `/catalogs/${catalogId}/change-requests/${changeRequestId}/edit`,
  async ({ catalogId, changeRequestId, session, hasWritePermission }) => {
    const organization: Organization = await getOrganization(catalogId).then(
      (res) => res.json(),
    );

    const baselineConcept: Concept = {
      id: null,
      ansvarligVirksomhet: { id: organization.organizationId },
      seOgså: [],
    };

    const changeRequest: ChangeRequest = await getChangeRequest(
      catalogId,
      `${changeRequestId}`,
      `${session.accessToken}`,
    )
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        throw error;
      });

    if (!changeRequest || changeRequest.catalogId !== catalogId) {
      return redirect(`/notfound`, RedirectType.replace);
    }

    if (
      !(
        changeRequest.status === "OPEN" &&
        (hasWritePermission ||
          (changeRequest.proposedBy &&
            session.user.id === changeRequest.proposedBy.id))
      )
    ) {
      return redirect(
        `/catalogs/${catalogId}/change-requests/${changeRequest.id}`,
        RedirectType.replace,
      );
    }

    const originalConcept =
      changeRequest.conceptId && validUUID(changeRequest.conceptId)
        ? await getConceptRevisions(
            `${changeRequest.conceptId}`,
            `${session.accessToken}`,
          ).then((response) => {
            if (response.ok) {
              return response.json().then((revisions: Concept[]) => {
                return revisions.reduce(function (prev, current) {
                  return conceptIsHigherVersion(prev, current) ? prev : current;
                });
              });
            } else throw new Error("Error when searching for original concept");
          })
        : undefined;

    const changeRequestAsConcept: Concept = jsonpatch.applyPatch(
      jsonpatch.deepClone(originalConcept || baselineConcept),
      jsonpatch.deepClone(changeRequest.operations),
      false,
    ).newDocument;

    const breadcrumbList = [
      {
        href: `/catalogs/${catalogId}`,
        text: localization.concept.concept,
      },
      {
        href: `/catalogs/${catalogId}/change-requests`,
        text: localization.changeRequest.changeRequest,
      },
      {
        href: `/catalogs/${catalogId}/change-requests/${changeRequest.id}`,
        text: changeRequest.title,
      },
      {
        href: `/catalogs/${catalogId}/change-requests/${changeRequest.id}/edit`,
        text: localization.edit,
      },
    ] as BreadcrumbType[];

    const conceptStatuses = await getConceptStatuses()
      .then((response) => response.json())
      .then((body) => body?.conceptStatuses ?? [])
      .then((statuses) => prepareStatusList(statuses));

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

    return (
      <>
        <Breadcrumbs
          breadcrumbList={breadcrumbList}
          catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
        />
        <DesignBanner
          title={localization.changeRequest.changeRequest}
          catalogId={catalogId}
        />
        <EditConceptFormClient
          organization={organization}
          originalConcept={originalConcept}
          changeRequest={changeRequest}
          changeRequestAsConcept={changeRequestAsConcept}
          conceptStatuses={conceptStatuses}
          codeListsResult={codeListsResult}
          fieldsResult={fieldsResult}
          usersResult={usersResult}
        />
      </>
    );
  },
);

export default ChangeRequestEditPage;
