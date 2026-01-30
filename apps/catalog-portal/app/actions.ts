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
import { getValidSession, redirectToSignIn } from "@catalog-frontend/utils";
import { Session } from "next-auth";
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
  orgId: string | null | undefined,
  session: Session,
): Promise<{ serviceCount: number; publicServiceCount: number }> => {
  if (!orgId || !session) {
    return {
      serviceCount: 0,
      publicServiceCount: 0,
    };
  }

  const response = await getAllServiceCatalogs(`${session?.accessToken}`);
  if (response.status !== 200) {
    throw new Error(
      `API responded with status ${response.status} for getAllServiceCatalogs`,
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
  orgId: string | null | undefined,
  session: Session,
): Promise<number> => {
  if (!orgId || !session) {
    return 0;
  }
  const response = await getAllDatasetCatalogs(`${session?.accessToken}`);
  if (response.status !== 200) {
    console.error(
      `API responded with status ${response.status} for getAllDatasetCatalogs`,
    );
    return 0;
  }
  try {
    const result = (await response.json()) as DatasetCatalog[];
    const catalog = result.find((catalog) => catalog.id === orgId);
    return catalog?.datasetCount ?? 0;
  } catch (e) {
    console.error("Failed to fetch json from dataset response", e);
  }
  return 0;
};

const getDataServiceCountByOrg = async (
  orgId: string | null | undefined,
  session: Session,
): Promise<number> => {
  if (!orgId || !session) {
    return 0;
  }
  const response = await oldGetAllDataServiceCatalogs(
    `${session?.accessToken}`,
  );
  if (response.status !== 200) {
    console.error(
      `API responded with status ${response.status} for oldGetAllDataServiceCatalogs`,
    );
    return 0;
  }
  try {
    const result = (await response.json()) as DataServiceCatalog[];
    const catalog = result.find((catalog) => catalog.id === orgId);
    return catalog?.dataServiceCount ?? 0;
  } catch (e) {
    console.error("Failed to fetch json from dataservice response", e);
  }
  return 0;
};

const getConceptCountByOrg = async (
  orgId: string | null | undefined,
  session: Session,
): Promise<number> => {
  if (!orgId || !session) {
    return 0;
  }
  const response = await getConceptCountByCatalogId(
    orgId,
    `${session?.accessToken}`,
  );
  if (response.status !== 200) {
    console.error(
      `API responded with status ${response.status} for getConceptCountByCatalogId`,
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
  const response = await acceptTerms(acceptation, `${session?.accessToken}`);
  if (response.status !== 201) {
    throw new Error(
      `API responded with status ${response.status} for acceptTerms`,
    );
  }
  updateTag("terms-acceptation");
}
