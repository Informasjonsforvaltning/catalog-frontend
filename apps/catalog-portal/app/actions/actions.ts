'use server';

import {
  getAllDatasetCatalogs,
  oldGetAllDataServiceCatalogs as getAllDataServiceCatalogs,
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
import _ from 'lodash';

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

export async function getServiceMessages(): Promise<Strapi.ServiceMessage[]> {
  const response = await getAllServiceMessages();
  if (response.status !== 200) {
    console.error('getServiceMessages failed with response code ' + response.status);
    return [];
  }
  return response.data?.serviceMessages;
}

export async function getAllCatalogs() {
  const session = await getValidSession();

  const [
    datasetCatalogsResponse,
    dataServiceCatalogsResponse,
    conceptCatalogsResponse,
    recordsOfProcessingActivitiesResponse,
  ] = await Promise.allSettled([
    getAllDatasetCatalogs(`${session?.accessToken}`),
    getAllDataServiceCatalogs(`${session?.accessToken}`),
    getAllConceptCatalogs(`${session?.accessToken}`),
    getAllProcessingActivities(`${session?.accessToken}`),
  ]);

  const datasetCatalogs =
    datasetCatalogsResponse.status === 'fulfilled' ? await datasetCatalogsResponse.value.json() : null;
  const dataServiceCatalogs =
    dataServiceCatalogsResponse.status === 'fulfilled' && dataServiceCatalogsResponse.value.status === 200
      ? ((await dataServiceCatalogsResponse.value.json()) as DataServiceCatalog[])
      : null;
  const conceptCatalogs =
    conceptCatalogsResponse.status === 'fulfilled'
      ? ((await conceptCatalogsResponse.value.json()) as ConceptCatalog[])
      : null;
  const recordsOfProcessingActivities =
    recordsOfProcessingActivitiesResponse.status === 'fulfilled'
      ? ((await recordsOfProcessingActivitiesResponse.value.json()) as RecordOfProcessingActivities[])
      : null;

  const { serviceCatalogs, publicServiceCatalogs } = await getServiceCatalogs();

  const isEmpty =
    (!datasetCatalogs?._embedded || datasetCatalogs.length === 0) &&
    (!dataServiceCatalogs || dataServiceCatalogs.length === 0) &&
    (!conceptCatalogs || conceptCatalogs.length === 0) &&
    (!recordsOfProcessingActivities || recordsOfProcessingActivities.length === 0) &&
    (!serviceCatalogs || serviceCatalogs.length === 0) &&
    (!publicServiceCatalogs || publicServiceCatalogs.length === 0);

  return isEmpty
    ? null
    : {
        datasetCatalogs: datasetCatalogs._embedded ? (datasetCatalogs._embedded?.catalogs as DatasetCatalog[]) : null,
        dataServiceCatalogs: _.isEmpty(dataServiceCatalogs) ? null : dataServiceCatalogs,
        conceptCatalogs: _.isEmpty(conceptCatalogs) ? null : conceptCatalogs,
        recordsOfProcessingActivities: _.isEmpty(recordsOfProcessingActivities) ? null : recordsOfProcessingActivities,
        publicServiceCatalogs: _.isEmpty(publicServiceCatalogs) ? null : publicServiceCatalogs,
        serviceCatalogs: _.isEmpty(serviceCatalogs) ? null : serviceCatalogs,
      };
}
