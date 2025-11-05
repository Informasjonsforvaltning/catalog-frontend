import {
  validateOrganizationNumber,
  validateAndEncodeUrlSafe,
} from "@catalog-frontend/utils";

export const getOrganizations = async (
  organizationIds: string[] | null = null,
) => {
  let resource;

  if (organizationIds === null) {
    resource = `${process.env.ORGANIZATION_CATALOG_BASE_URI}/organizations`;
  } else if (organizationIds.length > 0) {
    // Validate all organization IDs
    organizationIds.forEach((id, index) => {
      validateOrganizationNumber(id, `getOrganizations[${index}]`);
    });
    const encodedOrgIds = organizationIds.map((id) =>
      validateAndEncodeUrlSafe(id, "organization ID", "getOrganizations"),
    );
    resource = `${process.env.ORGANIZATION_CATALOG_BASE_URI}/organizations?organizationId=${encodedOrgIds.join(",")}`;
  } else {
    return Promise.reject("Organization ids cannot be empty");
  }

  const options = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
    cache: "no-cache" as RequestCache,
  };
  return await fetch(resource, options);
};

export const getOrganization = async (organizationId: string) => {
  validateOrganizationNumber(organizationId, "getOrganization");
  const encodedOrganizationId = validateAndEncodeUrlSafe(
    organizationId,
    "organization ID",
    "getOrganization",
  );

  const resource = `${process.env.ORGANIZATION_CATALOG_BASE_URI}/organizations/${encodedOrganizationId}`;
  const options = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
    cache: "no-cache" as RequestCache,
  };
  return await fetch(resource, options);
};
