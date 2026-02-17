import {
  getAllCodeLists,
  getConceptRevisions,
  getConceptStatuses,
  getFields,
  getOrganization,
  getUsers,
  searchChangeRequest,
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
  conceptIsHigherVersion,
  localization,
  prepareStatusList,
} from "@catalog-frontend/utils";
import jsonpatch from "fast-json-patch";
import { RedirectType, redirect } from "next/navigation";
import {
  BreadcrumbType,
  Breadcrumbs,
  DesignBanner,
} from "@catalog-frontend/ui-v2";
import { withReadProtectedPage } from "@concept-catalog/utils/auth";
import { NewConceptFormClient } from "./new-concept-form-client";

const ChangeRequestOrNew = withReadProtectedPage(
  ({ catalogId, conceptIdSearch }) =>
    `/catalogs/${catalogId}/change-requests/new${conceptIdSearch ? `?conceptId=${conceptIdSearch}` : ""}`,
  async ({ catalogId, conceptIdSearch, session }) => {
    const organization: Organization = await getOrganization(catalogId);
    const baselineConcept: Concept = {
      id: null,
      ansvarligVirksomhet: { id: organization.organizationId },
      seOgså: [],
    };

    let originalConcept: Concept | undefined = undefined;

    if (conceptIdSearch) {
      originalConcept = await getConceptRevisions(
        conceptIdSearch,
        session.accessToken,
      ).then((response) => {
        if (response.ok) {
          return response.json().then((revisions: Concept[]) => {
            return revisions.reduce(function (prev, current) {
              return conceptIsHigherVersion(prev, current) ? prev : current;
            });
          });
        } else if (response.status === 404) {
          return originalConcept;
        } else throw new Error("Error when searching for original concept");
      });

      let existingChangeRequest: ChangeRequest | undefined = undefined;

      if (originalConcept?.originaltBegrep) {
        [existingChangeRequest] = await searchChangeRequest(
          catalogId,
          `${originalConcept?.originaltBegrep}`,
          session.accessToken,
          "OPEN",
        ).then((res) => res.json());
      }

      if (
        existingChangeRequest?.id &&
        existingChangeRequest?.status === "OPEN"
      ) {
        return redirect(
          `/catalogs/${catalogId}/change-requests/${existingChangeRequest.id}`,
          RedirectType.replace,
        );
      }
    }

    const clonedConcept = jsonpatch.deepClone(
      originalConcept || baselineConcept,
    );
    delete clonedConcept.id;
    delete clonedConcept.ansvarligVirksomhet;
    delete clonedConcept.originaltBegrep;
    delete clonedConcept.endringslogelement;
    delete clonedConcept.publiseringsTidspunkt;
    delete clonedConcept.erPublisert;
    delete clonedConcept.isArchived;

    const changeRequestAsConcept = jsonpatch.applyPatch(
      clonedConcept,
      [],
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
        href: `/catalogs/${catalogId}/change-requests/new`,
        text: conceptIdSearch
          ? localization.changeRequest.newChangeRequest
          : localization.suggestionForNewConcept,
      },
    ];

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
        <NewConceptFormClient
          organization={organization}
          originalConcept={originalConcept}
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

export default ChangeRequestOrNew;
