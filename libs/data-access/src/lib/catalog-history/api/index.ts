import {
  validateOrganizationNumber,
  validateAndEncodeUrlSafe,
} from "@catalog-frontend/utils";

export const getCatalogHistory = async (
  catalogId: string,
  accessToken: string,
  page = 1,
  size = 10,
) => {
  validateOrganizationNumber(catalogId, "getCatalogHistory");
  const encodedCatalogId = validateAndEncodeUrlSafe(
    catalogId,
    "catalog ID",
    "getCatalogHistory",
  );

  const encodedPage = encodeURIComponent(page.toString());
  const encodedSize = encodeURIComponent(size.toString());
  const resource = `${process.env.CATALOG_HISTORY_SERVICE_BASE_URI}/${encodedCatalogId}/concepts/updates?page=${encodedPage}&size=${encodedSize}`;
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "GET",
  };

  return fetch(resource, options);
};
