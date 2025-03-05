import {
  getResourceRoles,
  getTranslateText,
  getValidSession,
  hasNonSystemAccessForOrg,
  hasSystemAdminPermission,
  localization,
  redirectToSignIn,
} from '@catalog-frontend/utils';
import {
  getAllConceptCatalogs,
  getAllDataServiceCatalogs,
  getAllDatasetCatalogs,
  getAllProcessingActivities,
  getAllServiceCatalogs,
  getAllServiceMessages,
  getOrganizations,
  oldGetAllDataServiceCatalogs,
  StrapiGraphql,
} from '@catalog-frontend/data-access';
import {
  ConceptCatalog,
  DataServiceCatalog,
  DatasetCatalog,
  Organization,
  RecordOfProcessingActivities,
  ServiceCatalogItem,
} from '@catalog-frontend/types';
import OrganizationCombo from './components/organization-combobox';
import { redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { Breadcrumbs, NavigationCard, ServiceMessages } from '@catalog-frontend/ui';
import { Heading, Alert } from '@digdir/designsystemet-react';
import Link from 'next/link';
import styles from './catalogs.module.css';

const CatalogsPage = async ({ params: { catalogId } }: { params: { catalogId: string[] } }) => {
  const session = await getValidSession();
  if (!session) {
    redirectToSignIn({ callbackUrl: `/catalogs` });
  }

  let organizations: Organization[] = [];
  if(hasSystemAdminPermission(`${session?.accessToken}`)) {
    organizations = await getOrganizations().then((res) => res.json());
  } else {
    const resourceRoles = getResourceRoles(`${session?.accessToken}`);
    const organiztionIdsWithAdminRole = resourceRoles
      .filter((role) => role.resource === 'organization')
      .map((role) => role.resourceId);
    
    if (organiztionIdsWithAdminRole.length > 0) {
      organizations = await getOrganizations(organiztionIdsWithAdminRole).then((res) => res.json());
    }
  }
  
  if(organizations.length === 1 && !catalogId) {
    return redirect(`/catalogs/${organizations[0].organizationId}`);
  }

  const currentOrganization = organizations.find((org) => org.organizationId === catalogId?.[0]);
  const hasNonSystemAccess = catalogId ? hasNonSystemAccessForOrg(`${session?.accessToken}`, catalogId?.[0]) : false;
  const datasetCount = catalogId ? await getDatasetCountByOrg(catalogId?.[0], session) : 0;
  const dataServiceCount = catalogId ? await getDataServiceCountByOrg(catalogId?.[0], session) : 0;
  const conceptCount = catalogId ? await getConceptCountByOrg(catalogId?.[0], session) : 0;
  const serviceCount = catalogId
    ? await getServiceCountByOrg(catalogId?.[0], session)
    : { serviceCount: 0, publicServiceCount: 0 };
  const processingActivitiesCount = catalogId ? await getRecordsOfProcessingActivityCountByOrg(catalogId?.[0], session) : 0;
  const serviceMessages = await getServiceMessages();

  return (
    <div className='container'>
      <Breadcrumbs
        data-testid='catalog-portal-breadcrumbs'
        catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
      />
      <ServiceMessages serviceMessages={serviceMessages} />

      {(organizations.length > 1 || !currentOrganization) && (
        <OrganizationCombo organizations={organizations} />
      )}

{currentOrganization && (
        <div key={`org-section-${currentOrganization.organizationId}`}>
          <Heading
            data-testid='catalog-portal-heading'
            className={styles.heading}
            size='lg'
          >
            {getTranslateText(currentOrganization.prefLabel)}
          </Heading>
          {hasNonSystemAccess && (
            <Link
              className={styles.link}
              href={`${process.env.FDK_REGISTRATION_BASE_URI}/terms-and-conditions/${currentOrganization.organizationId}`}
            >
              {localization.footer.termsOfUse}
            </Link>
          )}
          <div className={styles.cards}>
            <div key={`datasetCatalog-${currentOrganization.organizationId}`}>
              <NavigationCard
                title={localization.catalogType.dataset}
                body={`${datasetCount > 0 ? datasetCount : localization.none} ${localization.descriptionType.dataset}`}
                href={`${process.env.FDK_REGISTRATION_BASE_URI}/catalogs/${currentOrganization.organizationId}/datasets`}
              />
            </div>

            <div key={`dataServiceCatalog-${currentOrganization.organizationId}`}>
              <NavigationCard
                title={localization.catalogType.dataService}
                body={`${dataServiceCount > 0 ? dataServiceCount : localization.none} ${localization.descriptionType.dataService}`}
                href={`${process.env.DATASERVICE_CATALOG_BASE_URI}/${currentOrganization.organizationId}`}
              />
            </div>

            <div key={`conceptCatalog-${currentOrganization.organizationId}`}>
              <NavigationCard
                title={localization.catalogType.concept}
                body={`${conceptCount > 0 ? conceptCount : localization.none} ${localization.descriptionType.concept}`}
                href={`${process.env.CONCEPT_CATALOG_FRONTEND}/catalogs/${currentOrganization.organizationId}/concepts`}
              />
            </div>

            <div key={`publicServiceCatalog-${currentOrganization.organizationId}`}>
              <NavigationCard
                title={localization.catalogType.service}
                subtitle={localization.resourceType.publicServices}
                body={`${serviceCount.publicServiceCount > 0 ? serviceCount.publicServiceCount : localization.none} ${localization.descriptionType.service}`}
                href={`${process.env.SERVICE_CATALOG_GUI_BASE_URI}/catalogs/${currentOrganization.organizationId}/public-services`}
              />
            </div>

            <div key={`serviceCatalog-${currentOrganization.organizationId}`}>
              <NavigationCard
                title={localization.catalogType.service}
                subtitle={localization.resourceType.services}
                body={`${serviceCount.serviceCount > 0 ? serviceCount.serviceCount : localization.none} ${localization.descriptionType.service}`}
                href={`${process.env.SERVICE_CATALOG_GUI_BASE_URI}/catalogs/${currentOrganization.organizationId}/services`}
              />
            </div>

            <div key={`recordOfProcessingActivities-${currentOrganization.organizationId}`}>
              <NavigationCard
                title={localization.catalogType.recordsOfProcessingActivities}
                body={
                  <>
                    <span className={styles.behandlingsoversikt}>
                      {`${processingActivitiesCount > 0 ? processingActivitiesCount : localization.none} ${localization.descriptionType.recordsOfProcessingActivities}`}
                    </span>
                    <Alert
                      severity='warning'
                      size='small'
                      className={styles.warning}
                    >
                      Legges ned 31. mars 2025
                    </Alert>
                  </>
                }
                href={`${process.env.RECORDS_OF_PROCESSING_ACTIVITIES_GUI_BASE_URI}/${currentOrganization.organizationId}`}
              ></NavigationCard>
            </div>
          </div>
        </div>
      )}
      </div>
  );
};

const getServiceCountByOrg = async (
  orgId: string | null | undefined, session: Session
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

const getRecordsOfProcessingActivityCountByOrg = async (orgId: string | null | undefined, session: Session): Promise<number> => {
 if (!orgId || !session) {
    return 0;
  }
  const response = await getAllProcessingActivities(`${session?.accessToken}`);
  if (response.status !== 200) {
    console.error('getAllProcessingActivitiesCatalogs failed with response code ' + response.status);
    return 0;
  }
  const result = (await response.json()) as RecordOfProcessingActivities[];
  const activities = result?.find((record) => record.organizationId === orgId);
  return activities?.recordCount ?? 0;
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
    const result = await response.json();
    if (result._embedded?.catalogs) {
      const catalog = (result._embedded.catalogs as DatasetCatalog[]).find((catalog) => catalog.id === orgId);
      return catalog?.datasetCount ?? 0;
    }
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
  const response = await getAllConceptCatalogs(`${session?.accessToken}`);
  if (response.status !== 200) {
    console.error('getAllConceptCatalogs failed with response code ' + response.status);
    return 0;
  }
  const result = (await response.json()) as ConceptCatalog[];
  const catalog = result.find((catalog) => catalog.id === orgId);
  return catalog?.antallBegrep ?? 0;
};

const getServiceMessages = async (): Promise<StrapiGraphql.ServiceMessage[]> => {
  const response = await getAllServiceMessages();
  if (response.status !== 200) {
    console.error('getServiceMessages failed with response code ' + response.status);
    return [];
  }
  return response.data?.serviceMessages;
}

export default CatalogsPage;
