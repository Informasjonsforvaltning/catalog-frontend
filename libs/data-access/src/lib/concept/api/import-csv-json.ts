"use server";

import { Concept } from "@catalog-frontend/types";
import {
  validateAndEncodeUrlSafe,
  validateOrganizationNumber,
  validateUUID,
} from "@catalog-frontend/utils";

export const importConceptsCSV = async (
  catalogId: string,
  importId: string,
  concepts: Concept[],
  accessToken: string,
) => {
  validateOrganizationNumber(catalogId, "importConceptsCSV");
  validateUUID(importId, "importConceptsCSV");

  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "importConceptsCSV",
  );
  const encodedResultId = validateAndEncodeUrlSafe(
    importId,
    "result ID",
    "importConceptsCSV",
  );

  const resource = `${process.env.CONCEPT_CATALOG_BASE_URI}/import/${encodedCatalogId}/${encodedResultId}`;

  console.log("sending concepts", concepts);

  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(concepts),
  };

  return await fetch(resource, options).then((res) =>
    res.headers.get("location"),
  );
};
