import {
  getOrganizationsIds,
  getTranslateText,
  getValidSession,
  hasOrganizationWritePermission,
  hasSystemAdminPermission,
  localization,
} from '@catalog-frontend/utils';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import {
  getAllProcesssingActivitiesCatalogs,
  getConceptCatalogs,
  getDataServiceCatalogs,
  getDatasetCatalogs,
  getServiceCatalogs,
  getServiceMessages,
} from '../actions/actions';
import { getOrganizations, ServiceMessageEntity } from '@catalog-frontend/data-access';
import { Heading, Link } from '@digdir/designsystemet-react';
import {
  ConceptCatalog,
  DataServiceCatalog,
  DatasetCatalog,
  Organization,
  PublicServiceCatalog,
  RecordOfProcessingActivities,
  ServiceCatalog,
} from '@catalog-frontend/types';
import React from 'react';
import { Breadcrumbs, NavigationCard, ServiceMessages } from '@catalog-frontend/ui';
import styles from './catalogs.module.css';
import { CompassIcon, ChatElipsisIcon, CodeIcon, FilesIcon, GavelSoundBlockIcon } from '@navikt/aksel-icons';

const isDatasetCatalog = (catalog: any): catalog is DatasetCatalog => 'datasetCount' in catalog;
const isDataServiceCatalog = (catalog: any): catalog is DataServiceCatalog => 'dataServiceCount' in catalog;
const isConceptCatalog = (catalog: any): catalog is ConceptCatalog => 'antallBegrep' in catalog;
const isPublicServiceCatalog = (catalog: any): catalog is PublicServiceCatalog => 'publicServiceCount' in catalog;
const isServiceCatalog = (catalog: any): catalog is ServiceCatalog => 'serviceCount' in catalog;
const isRecordOfProccessingActivity = (catalog: any): catalog is RecordOfProcessingActivities =>
  'recordCount' in catalog;

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

const getRecordsOfProcessingActivitiesByOrgId = (
  orgId: string,
  records: { organizationId: string; recordCount: number }[],
) => {
  return records.filter((record) => record.organizationId === orgId);
};

const getAllCatalogsByOrgId = (
  orgId: string,
  datasetCatalogs: DatasetCatalog[],
  dataServiceCatalogs: DataServiceCatalog[],
  conceptCatalogs: ConceptCatalog[],
  publicServiceCatalogs: PublicServiceCatalog[],
  serviceCatalogs: ServiceCatalog[],
  recordsOfProcessingActivities: RecordOfProcessingActivities[],
) => {
  return [
    ...getDatasetCatalogsByOrgId(orgId, datasetCatalogs),
    ...getDataServiceCatalogsByOrgId(orgId, dataServiceCatalogs),
    ...getConceptCatalogsByOrgId(orgId, conceptCatalogs),
    ...getPublicServiceCatalogsByOrgId(orgId, publicServiceCatalogs),
    ...getServiceCatalogsByOrgId(orgId, serviceCatalogs),
    ...getRecordsOfProcessingActivitiesByOrgId(orgId, recordsOfProcessingActivities),
  ];
};

const DatasetSearchHitsPage: React.FC<{ params: Params }> = async () => {
  const session = await getValidSession({ callbackUrl: `/catalogs` });
  const datasetCatalogs = await getDatasetCatalogs();
  const dataServiceCatalogs = await getDataServiceCatalogs();
  const conceptCatalogs = await getConceptCatalogs();
  const allServiceCatalogs = await getServiceCatalogs();
  const publicServiceCatalogs = allServiceCatalogs.publicServiceCatalogs;
  const serviceCatalogs = allServiceCatalogs.serviceCatalogs;
  const organizationIds = getOrganizationsIds(session.accessToken);
  const organizations = await getOrganizations(organizationIds).then((res) => res.json());
  const recordsOfProcessingActivities = await getAllProcesssingActivitiesCatalogs();
  const serviceMessages: ServiceMessageEntity[] = await getServiceMessages();

  return (
    <div className='container'>
      <Breadcrumbs baseURI={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`} />
      <ServiceMessages serviceMessages={serviceMessages} />

      {organizations.map((org: Organization) => (
        <div key={`org-section-${org.organizationId}`}>
          <Heading
            className={styles.heading}
            size='lg'
          >
            {getTranslateText(org.prefLabel)}
          </Heading>
          {(hasOrganizationWritePermission(session.accessToken, org.organizationId) ||
            hasSystemAdminPermission(session.accessToken)) && (
            <Link
              className={styles.link}
              href={`${process.env.FDK_REGISTRATION_BASE_URI}/terms-and-conditions/${org.organizationId}`}
            >
              {localization.footer.termsOfUse}
            </Link>
          )}
          <div className={styles.cards}>
            {getAllCatalogsByOrgId(
              org.organizationId,
              datasetCatalogs,
              dataServiceCatalogs,
              conceptCatalogs,
              publicServiceCatalogs,
              serviceCatalogs,
              recordsOfProcessingActivities,
            ).map((catalog, index) => (
              <div key={`catalog-collection-${index}`}>
                {isDatasetCatalog(catalog) && catalog.datasetCount > 0 && (
                  <div key={`datasetCatalog-${catalog.id}`}>
                    <NavigationCard
                      key={catalog.id}
                      icon={
                        <FilesIcon
                          title='Files icon'
                          fontSize='2.5rem'
                        />
                      }
                      title={localization.catalogType.dataset}
                      body={`${catalog.datasetCount} ${localization.descriptionType.dataset}`}
                      href={`${process.env.FDK_REGISTRATION_BASE_URI}/catalogs/${catalog.id}/datasets`}
                    />
                  </div>
                )}
                {isDataServiceCatalog(catalog) && catalog.dataServiceCount > 0 && (
                  <div key={`dataServiceCatalog-${catalog.id}`}>
                    <NavigationCard
                      icon={
                        <CodeIcon
                          title='Code icon'
                          fontSize='2.5rem'
                        />
                      }
                      title={localization.catalogType.dataService}
                      body={`${catalog.dataServiceCount} ${localization.descriptionType.dataService}`}
                      href={`${process.env.DATASERVICE_CATALOG_BASE_URI}/${catalog.id}`}
                    />
                  </div>
                )}
                {isConceptCatalog(catalog) && catalog.antallBegrep > 0 && (
                  <div key={`conceptCatalog-${catalog.id}`}>
                    <NavigationCard
                      icon={
                        <ChatElipsisIcon
                          title='Elipsis icon'
                          fontSize='2.5rem'
                        />
                      }
                      title={localization.catalogType.concept}
                      body={`${catalog.antallBegrep} ${localization.descriptionType.concept}`}
                      href={`${process.env.CONCEPT_CATALOG_FRONTEND}/${catalog.id}`}
                    />
                  </div>
                )}
                {isPublicServiceCatalog(catalog) && catalog.publicServiceCount > 0 && (
                  <div key={`publicServiceCatalog-${catalog.catalogId}`}>
                    <NavigationCard
                      icon={
                        <CompassIcon
                          title='Compass icon'
                          fontSize='2.5rem'
                        />
                      }
                      title={localization.catalogType.publicService}
                      body={`${catalog.publicServiceCount} ${localization.descriptionType.publicService}`}
                      href={`${process.env.SERVICE_CATALOG_GUI_BASE_URI}/catalogs/${catalog.catalogId}/public-services`}
                    />
                  </div>
                )}
                {isServiceCatalog(catalog) && catalog.serviceCount > 0 && (
                  <div key={`serviceCatalog-${catalog.catalogId}`}>
                    <NavigationCard
                      icon={
                        <CompassIcon
                          title='Compass icon'
                          fontSize='2.5rem'
                        />
                      }
                      title={localization.catalogType.service}
                      body={`${catalog.serviceCount} ${localization.descriptionType.service}`}
                      href={`${process.env.SERVICE_CATALOG_GUI_BASE_URI}/catalogs/${catalog.catalogId}/services`}
                    />
                  </div>
                )}
                {isRecordOfProccessingActivity(catalog) && catalog.recordCount > 0 && (
                  <div key={`recordOfProcessingActivities-${catalog.organizationId}`}>
                    <NavigationCard
                      icon={
                        <GavelSoundBlockIcon
                          title='Gavel Sound Block Icon'
                          fontSize='2.5rem'
                        />
                      }
                      title={localization.catalogType.recordsOfProcessingActivities}
                      body={`${catalog.recordCount} ${localization.descriptionType.recordsOfProcessingActivities}`}
                      href={`${process.env.RECORDS_OF_PROCESSING_ACTIVITIES_GUI_BASE_URI}/${catalog.organizationId}`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DatasetSearchHitsPage;
