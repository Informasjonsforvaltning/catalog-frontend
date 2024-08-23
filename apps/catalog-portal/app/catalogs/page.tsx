import { getOrganizationsIds, getTranslateText, getValidSession } from '@catalog-frontend/utils';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { getConceptCatalogs, getDataServiceCatalogs, getDatasetCatalogs, getServiceCatalogs } from '../actions/actions';
import { getOrganizations } from '@catalog-frontend/data-access';
import { Heading } from '@digdir/designsystemet-react';
import {
  ConceptCatalog,
  DataServiceCatalog,
  DatasetCatalog,
  Organization,
  PublicServiceCatalog,
  ServiceCatalog,
} from '@catalog-frontend/types';
import React from 'react';

type Catalog = DatasetCatalog | DataServiceCatalog | ConceptCatalog | PublicServiceCatalog | ServiceCatalog;

const isDatasetCatalog = (catalog: any): catalog is DatasetCatalog => 'datasetCount' in catalog;
const isDataServiceCatalog = (catalog: any): catalog is DataServiceCatalog => 'dataServiceCount' in catalog;
const isConceptCatalog = (catalog: any): catalog is ConceptCatalog => 'antallBegrep' in catalog;
const isPublicServiceCatalog = (catalog: any): catalog is PublicServiceCatalog => 'publicServiceCount' in catalog;
const isServiceCatalog = (catalog: any): catalog is ServiceCatalog => 'serviceCount' in catalog;

const getDatasetCatalogsByOrgId = (orgId: string, datasetCatalogs: DatasetCatalog[]): DatasetCatalog[] => {
  return datasetCatalogs.filter((catalog) => catalog.id === orgId);
};

const getDataServiceCatalogsByOrgId = (
  orgId: string,
  dataServiceCatalogs: DataServiceCatalog[],
): DataServiceCatalog[] => {
  return dataServiceCatalogs.filter((catalog) => catalog.id === orgId);
};

const getConceptCatalogsByOrgId = (orgId: string, conceptCatalogs: ConceptCatalog[]): ConceptCatalog[] => {
  return conceptCatalogs.filter((catalog) => catalog.id === orgId);
};

const getPublicServiceCatalogsByOrgId = (
  orgId: string,
  publicServiceCatalogs: PublicServiceCatalog[],
): PublicServiceCatalog[] => {
  return publicServiceCatalogs.filter((catalog) => catalog.catalogId === orgId);
};

const getServiceCatalogsByOrgId = (orgId: string, serviceCatalogs: ServiceCatalog[]): ServiceCatalog[] => {
  return serviceCatalogs.filter((catalog) => catalog.catalogId === orgId);
};

const getAllCatalogsByOrgId = (
  orgId: string,
  datasetCatalogs: DatasetCatalog[],
  dataServiceCatalogs: DataServiceCatalog[],
  conceptCatalogs: ConceptCatalog[],
  publicServiceCatalogs: PublicServiceCatalog[],
  serviceCatalogs: ServiceCatalog[],
): Catalog[] => {
  return [
    ...getDatasetCatalogsByOrgId(orgId, datasetCatalogs),
    ...getDataServiceCatalogsByOrgId(orgId, dataServiceCatalogs),
    ...getConceptCatalogsByOrgId(orgId, conceptCatalogs),
    ...getPublicServiceCatalogsByOrgId(orgId, publicServiceCatalogs),
    ...getServiceCatalogsByOrgId(orgId, serviceCatalogs),
  ];
};

const DatasetSearchHitsPage: React.FC<{ params: Params }> = async ({ params }) => {
  const session = await getValidSession({ callbackUrl: `/catalogs/` });
  const datasetCatalogs = await getDatasetCatalogs();
  const dataServiceCatalogs = await getDataServiceCatalogs();
  const conceptCatalogs = await getConceptCatalogs();
  const allServiceCatalogs = await getServiceCatalogs();
  const publicServiceCatalogs = allServiceCatalogs.publicServiceCatalogs;
  const serviceCatalogs = allServiceCatalogs.serviceCatalogs;
  const organizationIds = getOrganizationsIds(session.accessToken);
  const organizations = await getOrganizations(organizationIds).then((res) => res.json());
  //const recordsOfProcessingActivities = await getAllProcesssingActivitiesCatalogs();

  return (
    <>
      {organizations.map((org: Organization) => (
        <div key={org.organizationId}>
          <Heading size='sm'>{getTranslateText(org.prefLabel)}</Heading>
          {getAllCatalogsByOrgId(
            org.organizationId,
            datasetCatalogs,
            dataServiceCatalogs,
            conceptCatalogs,
            publicServiceCatalogs,
            serviceCatalogs,
          ).map((catalog, index) => (
            <div key={`${catalog?.id || catalog?.catalogId}-${index}`}>
              {isDatasetCatalog(catalog) && catalog.datasetCount !== undefined && (
                <p key={`dataset-${catalog.id}`}>{`Datasettkatalog: ${catalog.datasetCount}`}</p>
              )}
              {isDataServiceCatalog(catalog) && catalog.dataServiceCount !== undefined && (
                <p key={`dataService-${catalog.id}`}>{`Datasettkatalog: ${catalog.dataServiceCount}`}</p>
              )}
              {isConceptCatalog(catalog) && catalog.antallBegrep !== undefined && (
                <p key={`concept-${catalog.id}`}>{`Begrepskatalog: ${catalog.antallBegrep}`}</p>
              )}
              {isPublicServiceCatalog(catalog) && catalog.publicServiceCount !== undefined && (
                <p
                  key={`publicService-${catalog.catalogId}`}
                >{`Offentlig tjenestekatalog: ${catalog.publicServiceCount}`}</p>
              )}
              {isServiceCatalog(catalog) && catalog.serviceCount !== undefined && (
                <p key={`service-${catalog.catalogId}`}>{`Tjenestekatalog: ${catalog.serviceCount}`}</p>
              )}
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default DatasetSearchHitsPage;
