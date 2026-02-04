"use server";

import {
  acceptTerms,
  getAllDatasetCatalogs,
  getAllServiceCatalogs,
  getConceptCountByCatalogId,
  oldGetAllDataServiceCatalogs,
} from "@catalog-frontend/data-access";
import {
  ServiceCatalogItem,
  DatasetCatalog,
  DataServiceCatalog,
  TermsAcceptation,
} from "@catalog-frontend/types";
import {
  getValidSession,
  redirectToSignIn,
  ValidSession,
} from "@catalog-frontend/utils";
import { updateTag } from "next/cache";

export const getDatasetCount = async (catalogId: string): Promise<number> => {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn("/catalogs");
  }

  return getDatasetCountByOrg(catalogId, session);
};

export const getDataServiceCount = async (
  catalogId: string,
): Promise<number> => {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn("/catalogs");
  }

  return getDataServiceCountByOrg(catalogId, session);
};

export const getConceptCount = async (catalogId: string): Promise<number> => {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn("/catalogs");
  }

  return getConceptCountByOrg(catalogId, session);
};

export const getServiceCount = async (
  catalogId: string,
): Promise<{ serviceCount: number; publicServiceCount: number }> => {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn("/catalogs");
  }

  return getServiceCountByOrg(catalogId, session);
};

const getServiceCountByOrg = async (
  orgId: string,
  session: ValidSession,
): Promise<{ serviceCount: number; publicServiceCount: number }> => {
  const response = await getAllServiceCatalogs(session.accessToken);
  if (response.status !== 200) {
    throw new Error(
      "getServiceCatalogs failed with response code " + response.status,
    );
  }

  const jsonResponse: ServiceCatalogItem[] = await response.json();

  let serviceCount = 0;
  let publicServiceCount = 0;

  jsonResponse
    .filter((item) => item.catalogId === orgId)
    .forEach((item) => {
      if (item.serviceCount !== undefined) {
        // add the catalog if it has services
        serviceCount = item.serviceCount;
      }

      if (item.publicServiceCount !== undefined) {
        publicServiceCount = item.publicServiceCount;
      }
    });

  return {
    serviceCount,
    publicServiceCount,
  };
};

const getDatasetCountByOrg = async (
  orgId: string,
  session: ValidSession,
): Promise<number> => {
  const response = await getAllDatasetCatalogs(session.accessToken);
  if (response.status !== 200) {
    console.error(
      "getAllDatasetCatalogs failed with response code " + response.status,
    );
    return 0;
  }
  try {
    const result = (await response.json()) as DatasetCatalog[];
    const catalog = result.find((catalog) => catalog.id === orgId);
    return catalog?.datasetCount ?? 0;
  } catch (e) {
    console.log("Failed to fetch json from dataset response", e);
  }
  return 0;
};

const getDataServiceCountByOrg = async (
  orgId: string,
  session: ValidSession,
): Promise<number> => {
  const response = await oldGetAllDataServiceCatalogs(session.accessToken);
  if (response.status !== 200) {
    console.error(
      "oldGetAllDataServiceCatalogs failed with response code " +
        response.status,
    );
    return 0;
  }
  try {
    const result = (await response.json()) as DataServiceCatalog[];
    const catalog = result.find((catalog) => catalog.id === orgId);
    return catalog?.dataServiceCount ?? 0;
  } catch (e) {
    console.log("Failed to fetch json from dataservice response", e);
  }
  return 0;
};

const getConceptCountByOrg = async (
  orgId: string,
  session: ValidSession,
): Promise<number> => {
  const response = await getConceptCountByCatalogId(orgId, session.accessToken);
  if (response.status !== 200) {
    console.error(
      "getConceptCountByCatalogId failed with response code " + response.status,
    );
    return 0;
  }
  return (await response.json()) as number;
};

export async function acceptTermsAndConditions(
  acceptation: TermsAcceptation,
): Promise<void> {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  const response = await acceptTerms(acceptation, session.accessToken);
  if (response.status !== 201) {
    console.error("status: " + response.status);
    throw new Error("acceptTerms failed with response code " + response.status);
  }
  updateTag("terms-acceptation");
}
