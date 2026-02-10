"use server";

import {
  conceptIsHigherVersion,
  getValidSession,
  hasOrganizationWritePermission,
  redirectToSignIn,
  validOrganizationNumber,
  validUUID,
} from "@catalog-frontend/utils";
import {
  acceptChangeRequest,
  createChangeRequest,
  getChangeRequest,
  getConceptRevisions,
  rejectChangeRequest,
  updateChangeRequest,
} from "@catalog-frontend/data-access";
import { updateTag } from "next/cache";
import jsonpatch from "fast-json-patch";
import {
  ChangeRequest,
  ChangeRequestUpdateBody,
  Concept,
} from "@catalog-frontend/types";

async function getChangeRequestAsConcept(
  catalogId: string,
  changeRequestId: string,
): Promise<Concept> {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  if (!validOrganizationNumber(catalogId)) throw new Error("Invalid catalogId");
  if (!validUUID(changeRequestId)) throw new Error("Invalid changeRequestId");

  const changeRequest: ChangeRequest = await getChangeRequest(
    catalogId,
    changeRequestId,
    session.accessToken,
  )
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      throw error;
    });

  const baselineConcept: Concept = {
    id: null,
    ansvarligVirksomhet: { id: catalogId },
    seOgså: [],
  };

  const originalConcept =
    changeRequest.conceptId && validUUID(changeRequest.conceptId)
      ? await getConceptRevisions(
          `${changeRequest.conceptId}`,
          session.accessToken,
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

  return changeRequestAsConcept;
}

export async function createChangeRequestAction(
  catalogId: string,
  body: ChangeRequestUpdateBody,
): Promise<string> {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  if (!validOrganizationNumber(catalogId)) throw new Error("Invalid catalogId");

  const response = await createChangeRequest(
    body,
    catalogId,
    session.accessToken,
  );
  if (response.status !== 201) {
    const errorMsg = `Error when creating change request. Response status: ${
      response.status
    }, message: ${await response.text()}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  const changeRequestId = response.headers.get("location")?.split("/").pop();
  if (!changeRequestId) {
    console.error("Failed to fetch change request id");
    throw new Error("Failed to fetch change request id");
  }
  return changeRequestId;
}

export async function updateChangeRequestAction(
  catalogId: string,
  changeRequestId: string,
  body: ChangeRequestUpdateBody,
): Promise<Concept> {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  if (!validOrganizationNumber(catalogId)) throw new Error("Invalid catalogId");
  if (!validUUID(changeRequestId)) throw new Error("Invalid changeRequestId");

  const response = await updateChangeRequest(
    body,
    catalogId,
    changeRequestId,
    session.accessToken,
  );

  if (response.status !== 200) {
    const errorMsg = `Error when updating change request. Response status: ${
      response.status
    }, message: ${await response.text()}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  return await getChangeRequestAsConcept(catalogId, changeRequestId);
}

export async function acceptChangeRequestAction(
  catalogId: string,
  changeRequestId: string,
): Promise<void> {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  if (!validOrganizationNumber(catalogId)) throw new Error("Invalid catalogId");
  if (!validUUID(changeRequestId)) throw new Error("Invalid changeRequestId");
  if (!hasOrganizationWritePermission(session.accessToken, catalogId))
    throw new Error("User does not have write permission for this catalog");

  try {
    await acceptChangeRequest(catalogId, changeRequestId, session.accessToken);
  } catch (error) {
    throw new Error(error);
  } finally {
    updateTag("concept-change-requests");
    updateTag("concept-change-request");
  }
}

export async function rejectChangeRequestAction(
  catalogId: string,
  changeRequestId: string,
): Promise<void> {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  if (!validOrganizationNumber(catalogId)) throw new Error("Invalid catalogId");
  if (!validUUID(changeRequestId)) throw new Error("Invalid changeRequestId");
  if (!hasOrganizationWritePermission(session.accessToken, catalogId))
    throw new Error("User does not have write permission for this catalog");

  try {
    await rejectChangeRequest(catalogId, changeRequestId, session.accessToken);
  } catch (error) {
    throw new Error(error);
  } finally {
    updateTag("concept-change-requests");
    updateTag("concept-change-request");
  }
}
