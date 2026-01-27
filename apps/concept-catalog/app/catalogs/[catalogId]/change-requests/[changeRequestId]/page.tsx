import jsonpatch from "fast-json-patch";
import { redirect, RedirectType } from "next/navigation";
import {
  getOrganization,
  getChangeRequest,
  getConceptRevisions,
  getConceptStatuses,
  getAllCodeLists,
  getFields,
  getUsers,
} from "@catalog-frontend/data-access";
import {
  Organization,
  Concept,
  ChangeRequest,
  CodeListsResult,
  FieldsResult,
  UsersResult,
} from "@catalog-frontend/types";
import {
  BreadcrumbType,
  Breadcrumbs,
  DesignBanner,
} from "@catalog-frontend/ui";
import {
  validUUID,
  localization,
  conceptIsHigherVersion,
  prepareStatusList,
} from "@catalog-frontend/utils";
import { withReadProtectedPage } from "@concept-catalog/utils/auth";
import { AcceptConceptFormClient } from "./accept-concept-form-client";

const ChangeRequestDetailsPage = withReadProtectedPage(
  ({ catalogId, changeRequestId }) =>
    `/catalogs/${catalogId}/change-requests/${changeRequestId}`,
  async ({ catalogId, changeRequestId, session, hasWritePermission }) => {
    const organization: Organization = await getOrganization(catalogId);

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
        if (response.status === 404) {
          return redirect("/notfound", RedirectType.replace);
        }
        return response.json();
      })
      .catch((error) => {
        throw error;
      });

    let originalConcept;

    if (changeRequest.status !== "OPEN" && changeRequest.conceptSnapshot) {
      originalConcept = changeRequest.conceptSnapshot;
    } else {
      originalConcept =
        changeRequest.conceptId && validUUID(changeRequest.conceptId)
          ? await getConceptRevisions(
              `${changeRequest.conceptId}`,
              `${session.accessToken}`,
            ).then((response) => {
              if (response.ok) {
                return response.json().then((revisions: Concept[]) => {
                  return revisions.reduce(function (prev, current) {
                    return conceptIsHigherVersion(prev, current)
                      ? prev
                      : current;
                  });
                });
              } else {
                return redirect("/notfound", RedirectType.replace);
              }
            })
          : null;
    }

    const changeRequestAsConcept: Concept = jsonpatch.applyPatch(
      jsonpatch.deepClone(originalConcept || baselineConcept),
      jsonpatch.deepClone(changeRequest.operations),
      false,
    ).newDocument;

    const breadcrumbList: BreadcrumbType[] = [
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
    ];

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

    const allowApprove = hasWritePermission;
    const allowEdit =
      hasWritePermission ||
      (changeRequest.proposedBy &&
        session.user.id === changeRequest.proposedBy.id);

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
        <AcceptConceptFormClient
          organization={organization}
          originalConcept={originalConcept}
          changeRequest={changeRequest}
          changeRequestAsConcept={changeRequestAsConcept}
          conceptStatuses={conceptStatuses}
          codeListsResult={codeListsResult}
          fieldsResult={fieldsResult}
          usersResult={usersResult}
          allowApprove={allowApprove}
          allowEdit={allowEdit}
        />
      </>
    );
  },
);

export default ChangeRequestDetailsPage;
