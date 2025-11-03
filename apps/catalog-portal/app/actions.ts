'use server';

import {
  acceptTerms,
  getAllDatasetCatalogs,
  getAllProcessingActivities,
  getAllServiceCatalogs,
  getConceptCountByCatalogId,
  oldGetAllDataServiceCatalogs,
} from '@catalog-frontend/data-access';
import {
  ServiceCatalogItem,
  RecordOfProcessingActivities,
  DatasetCatalog,
  DataServiceCatalog,
  TermsAcceptation,
} from '@catalog-frontend/types';
import { getValidSession, redirectToSignIn } from '@catalog-frontend/utils';
import { Session } from 'next-auth';
import { revalidateTag } from 'next/cache';

export const getDatasetCount = async (catalogId: string) => {
  const session: Session = await getValidSession();
  if (!session) {
    redirectToSignIn({ callbackUrl: `/catalogs` });
  }

  return catalogId ? getDatasetCountByOrg(catalogId, session) : 0;
};

export const getDataServiceCount = async (catalogId: string) => {
  const session: Session = await getValidSession();
  if (!session) {
    redirectToSignIn({ callbackUrl: `/catalogs` });
  }

  return catalogId ? getDataServiceCountByOrg(catalogId, session) : 0;
};

export const getConceptCount = async (catalogId: string) => {
  const session: Session = await getValidSession();
  if (!session) {
    redirectToSignIn({ callbackUrl: `/catalogs` });
  }

  return catalogId ? getConceptCountByOrg(catalogId, session) : 0;
};

export const getServiceCount = async (catalogId: string) => {
  const session: Session = await getValidSession();
  if (!session) {
    redirectToSignIn({ callbackUrl: `/catalogs` });
  }

  return catalogId ? await getServiceCountByOrg(catalogId, session) : { serviceCount: 0, publicServiceCount: 0 };
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
    throw new Error('getServiceCatalogs failed with response code ' + response.status);
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

const getDatasetCountByOrg = async (orgId: string | null | undefined, session: Session): Promise<number> => {
  if (!orgId || !session) {
    return 0;
  }
  const response = await getAllDatasetCatalogs(`${session?.accessToken}`);
  if (response.status !== 200) {
    console.error('getAllDatasetCatalogs failed with response code ' + response.status);
    return 0;
  }
  try {
    const result = (await response.json()) as DatasetCatalog[];
    const catalog = result.find((catalog) => catalog.id === orgId);
    return catalog?.datasetCount ?? 0;
  } catch (e) {
    console.log('Failed to fetch json from dataset response', e);
  }
  return 0;
};

const getDataServiceCountByOrg = async (orgId: string | null | undefined, session: Session): Promise<number> => {
  if (!orgId || !session) {
    return 0;
  }
  const response = await oldGetAllDataServiceCatalogs(`${session?.accessToken}`);
  if (response.status !== 200) {
    console.error('oldGetAllDataServiceCatalogs failed with response code ' + response.status);
    return 0;
  }
  try {
    const result = (await response.json()) as DataServiceCatalog[];
    const catalog = result.find((catalog) => catalog.id === orgId);
    return catalog?.dataServiceCount ?? 0;
  } catch (e) {
    console.log('Failed to fetch json from dataservice response', e);
  }
  return 0;
};

const getConceptCountByOrg = async (orgId: string | null | undefined, session: Session): Promise<number> => {
  if (!orgId || !session) {
    return 0;
  }
  const response = await getConceptCountByCatalogId(orgId, `${session?.accessToken}`);
  if (response.status !== 200) {
    console.error('getConceptCountByCatalogId failed with response code ' + response.status);
    return 0;
  }
  return (await response.json()) as number;
};

export async function acceptTermsAndConditions(acceptation: TermsAcceptation) {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  const response = await acceptTerms(acceptation, `${session?.accessToken}`);
  if (response.status !== 201) {
    console.error('status: ' + response.status);
    throw new Error('acceptTerms failed with response code ' + response.status);
  }
  revalidateTag('terms-acceptation');
}
