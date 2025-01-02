'use server';

import {
  getAllDatasetCatalogs,
  getAllDataServiceCatalogs,
  getAllConceptCatalogs,
  getAllServiceCatalogs,
  getAllProcessingActivities,
  getAllServiceMessages,
  Strapi,
} from '@catalog-frontend/data-access';
import {
  ConceptCatalog,
  DataServiceCatalog,
  DatasetCatalog,
  RecordOfProcessingActivities,
  ServiceCatalogItem,
  ServiceCatalogs,
} from '@catalog-frontend/types';
import { getValidSession } from '@catalog-frontend/utils';

export async function getDatasetCatalogs(): Promise<DatasetCatalog[]> {
  const session = await getValidSession();
  const response = await getAllDatasetCatalogs(`${session?.accessToken}`);

  if (response.status !== 200) {
    console.error('getDatasetCatalogs failed with response code ' + response.status);
    return [];
  }

  const jsonResponse = await response.json();
  return jsonResponse._embedded.catalogs;
}

export async function getDataServiceCatalogs(): Promise<DataServiceCatalog[]> {
  const session = await getValidSession();
  const response = await getAllDataServiceCatalogs(`${session?.accessToken}`);

  if (response.status !== 200) {
    console.error('getDataServiceCatalogs failed with response code ' + response.status);
    return [];
  }
  const jsonResponse = await response.json();
  return jsonResponse;
}

export async function getConceptCatalogs(): Promise<ConceptCatalog[]> {
  const session = await getValidSession();
  const response = await getAllConceptCatalogs(`${session?.accessToken}`);

  if (response.status !== 200) {
    console.error('getConceptCatalogs failed with response code ' + response.status);
    return [];
  }
  const jsonResponse = await response.json();
  return jsonResponse;
}

export async function getServiceCatalogs(): Promise<ServiceCatalogs> {
  const session = await getValidSession();
  const response = await getAllServiceCatalogs(`${session?.accessToken}`);

  if (response.status !== 200) {
    throw new Error('getServiceCatalogs failed with response code ' + response.status);
  }

  const jsonResponse: ServiceCatalogItem[] = await response.json();

  const serviceCatalogs: { catalogId: string; serviceCount: number }[] = [];
  const publicServiceCatalogs: { catalogId: string; publicServiceCount: number }[] = [];

  jsonResponse.forEach((item) => {
    if (item.serviceCount !== undefined) {
      // add the catalog if it has services
      serviceCatalogs.push({
        catalogId: item.catalogId,
        serviceCount: item.serviceCount,
      });
    }

    if (item.publicServiceCount !== undefined) {
      publicServiceCatalogs.push({
        catalogId: item.catalogId,
        publicServiceCount: item.publicServiceCount,
      });
    }
  });

  return {
    serviceCatalogs,
    publicServiceCatalogs,
  };
}

export async function getAllProcessingActivitiesCatalogs(): Promise<RecordOfProcessingActivities[]> {
  const session = await getValidSession();
  const response = await getAllProcessingActivities(`${session?.accessToken}`);
  if (response.status !== 200) {
    console.error('getAllProcessingActivitiesCatalogs failed with response code ' + response.status);
    return [];
  }
  const jsonResponse = await response.json();
  return jsonResponse;
}

export async function getServiceMessages(): Promise<Strapi.ServiceMessage[]> {
  const response = await getAllServiceMessages();
  if (response.status !== 200) {
    console.error('getServiceMessages failed with response code ' + response.status);
    return [];
  }
  return response.data?.serviceMessages;
}
