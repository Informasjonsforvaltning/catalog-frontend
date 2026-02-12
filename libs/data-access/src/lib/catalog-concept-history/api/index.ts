import {
  validateOrganizationNumber,
  validateUUID,
  validateAndEncodeUrlSafe,
} from "@catalog-frontend/utils";

export const getConceptHistory = async (
  catalogId: string,
  resourceId: string,
  accessToken: string,
  page = 0,
  size = 10,
) => {
  validateOrganizationNumber(catalogId, "getConceptHistory");
  validateUUID(resourceId, "getConceptHistory");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "getConceptHistory",
  );
  const encodedResourceId = validateAndEncodeUrlSafe(
    resourceId,
    "resource ID",
    "getConceptHistory",
  );

  const encodedPage = encodeURIComponent(page.toString());
  const encodedSize = encodeURIComponent(size.toString());
  const resource = `${process.env.CATALOG_HISTORY_SERVICE_BASE_URI}/${encodedCatalogId}/${encodedResourceId}/updates?page=${encodedPage}&size=${encodedSize}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "GET",
  };

  return fetch(resource, options);
};
