import { Organization } from "@catalog-frontend/types";
import {
  validateOrganizationNumber,
  validateAndEncodeUrlSafe,
} from "@catalog-frontend/utils";

export const getOrganizations = async (
  organizationIds: string[] | null = null,
): Promise<Organization[]> => {
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
  const response = await fetch(resource, options);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch organizations: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
};

export const getOrganization = async (
  organizationId: string,
): Promise<Organization> => {
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
  const response = await fetch(resource, options);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch organization: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
};
