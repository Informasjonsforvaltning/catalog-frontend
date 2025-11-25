"use server";

import {
  getValidSession,
  redirectToSignIn,
  validateAndEncodeUrlSafe,
  validateOrganizationNumber,
  validateUUID,
} from "@catalog-frontend/utils";

export const createImportJob = async (catalogId: string) => {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  const accessToken = await session?.accessToken;

  validateOrganizationNumber(catalogId, "createImportJob");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "createImportJob",
  );

  const resource = `${process.env.CONCEPT_CATALOG_BASE_URI}/import/${encodedCatalogId}/create-import-id`;

  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: "GET",
  };

  return fetch(resource, options).then((res) => res.headers.get("location"));
};

export const importRdfConcepts = async (
  fileContent: string,
  contentType: string,
  catalogId: string,
  importId: string,
) => {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  const accessToken = await session?.accessToken;

  validateOrganizationNumber(catalogId, "importRdfConcepts");
  validateUUID(importId, "importRdfConcepts");

  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "importRdfConcepts",
  );
  const encodedResultId = validateAndEncodeUrlSafe(
    importId,
    "result ID",
    "importRdfConcepts",
  );

  console.log("Uploading the concept rdf file catalog:", encodedCatalogId);

  const resource = `${process.env.CONCEPT_CATALOG_BASE_URI}/import/${encodedCatalogId}/${encodedResultId}`;

  console.log("Updating status of import result with id:", encodedResultId);

  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": contentType,
    },
    method: "POST",
    body: fileContent,
  };

  return fetch(resource, options).then((res) => res.headers.get("location"));
};
