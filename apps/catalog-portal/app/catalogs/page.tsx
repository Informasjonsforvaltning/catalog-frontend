import {
  getTranslateText,
  getValidSession,
  hasNonSystemAccessForOrg,
  localization,
  sortAscending,
} from '@catalog-frontend/utils';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { getAllCatalogs, getServiceMessages } from '../actions/actions';
import { getOrganizations } from '@catalog-frontend/data-access';
import { Alert, Heading, Link } from '@digdir/designsystemet-react';
import {
  ConceptCatalog,
  DataServiceCatalog,
  DatasetCatalog,
  Organization,
  PublicServiceCatalog,
  RecordOfProcessingActivities,
  ServiceCatalog,
} from '@catalog-frontend/types';
import { Breadcrumbs, NavigationCard, ServiceMessages } from '@catalog-frontend/ui';
import styles from './catalogs.module.css';
import { redirect } from 'next/navigation';
import _ from 'lodash';

const CatalogPortalPage: React.FC<{ params: Params }> = async () => {
  const session = await getValidSession({ callbackUrl: `/catalogs` });

  const catalogData = await getAllCatalogs();
  const serviceMessages = await getServiceMessages();

  if (!catalogData) {
    redirect('/no-access');
  }

  const {
    datasetCatalogs,
    dataServiceCatalogs,
    conceptCatalogs,
    publicServiceCatalogs,
    serviceCatalogs,
    recordsOfProcessingActivities,
  } = catalogData;

  const getDatasetCatalogByOrgId = (orgId: string): DatasetCatalog | null | undefined =>
    datasetCatalogs?.find((catalog) => catalog.id === orgId);

  const getDataServiceCatalogByOrgId = (orgId: string): DataServiceCatalog | null | undefined =>
    dataServiceCatalogs?.find((catalog: DataServiceCatalog) => catalog.id === orgId);

  const getConceptCatalogByOrgId = (orgId: string): ConceptCatalog | null | undefined =>
    conceptCatalogs?.find((catalog) => catalog.id === orgId);

  const getPublicServiceCatalogByOrgId = (orgId: string): PublicServiceCatalog | null | undefined =>
    publicServiceCatalogs?.find((catalog) => catalog.catalogId === orgId);

  const getServiceCatalogByOrgId = (orgId: string): ServiceCatalog | null | undefined =>
    serviceCatalogs?.find((catalog) => catalog.catalogId === orgId);

  const getRecordsOfProcessingActivityByOrgId = (orgId: string): RecordOfProcessingActivities | null | undefined =>
    recordsOfProcessingActivities?.find((record) => record.organizationId === orgId);

  const getAllUniqueOrgIds = (): string[] => {
    const orgIdsSet = new Set<string>();
    datasetCatalogs?.forEach((catalog) => orgIdsSet.add(catalog.id));
    conceptCatalogs?.forEach((catalog) => orgIdsSet.add(catalog.id));
    publicServiceCatalogs?.forEach((catalog) => orgIdsSet.add(catalog.catalogId));
    serviceCatalogs?.forEach((catalog) => orgIdsSet.add(catalog.catalogId));
    dataServiceCatalogs?.forEach((catalog: DataServiceCatalog) => orgIdsSet.add(catalog.id));
    recordsOfProcessingActivities?.forEach((catalog) => orgIdsSet.add(catalog.organizationId));

    return Array.from(orgIdsSet);
  };

  const organizationIds = getAllUniqueOrgIds();
  const organizations: Organization[] = await getOrganizations(organizationIds).then((res) => res.json());
  const sortedOrganization = organizations.sort((a, b) =>
    sortAscending(getTranslateText(a.prefLabel).toString(), getTranslateText(b.prefLabel).toString()),
  );

  return (
    <div className='container'>
      <Breadcrumbs
        data-testid='catalog-portal-breadcrumbs'
        catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
      />
      <ServiceMessages serviceMessages={serviceMessages} />

      {sortedOrganization.map((org: Organization) => (
        <div key={`org-section-${org.organizationId}`}>
          <Heading
            data-testid='catalog-portal-heading'
            className={styles.heading}
            size='lg'
          >
            {getTranslateText(org.prefLabel)}
          </Heading>
          {hasNonSystemAccessForOrg(session.accessToken, org.organizationId) && (
            <Link
              className={styles.link}
              href={`${process.env.FDK_REGISTRATION_BASE_URI}/terms-and-conditions/${org.organizationId}`}
            >
              {localization.footer.termsOfUse}
            </Link>
          )}
          <div className={styles.cards}>
            <div key={`datasetCatalog-${org.organizationId}`}>
              <NavigationCard
                title={localization.catalogType.dataset}
                body={`${getDatasetCatalogByOrgId(org.organizationId)?.datasetCount && getDatasetCatalogByOrgId(org.organizationId)?.datasetCount !== 0 ? getDatasetCatalogByOrgId(org.organizationId)?.datasetCount : localization.none} ${localization.descriptionType.dataset}`}
                href={`${process.env.FDK_REGISTRATION_BASE_URI}/catalogs/${org.organizationId}/datasets`}
              />
            </div>

            <div key={`dataServiceCatalog-${org.organizationId}`}>
              <NavigationCard
                title={localization.catalogType.dataService}
                body={`${getDataServiceCatalogByOrgId(org.organizationId)?.dataServiceCount ?? localization.none} ${localization.descriptionType.dataService}`}
                href={`${process.env.DATASERVICE_CATALOG_BASE_URI}/${org.organizationId}`}
              />
            </div>

            <div key={`conceptCatalog-${org.organizationId}`}>
              <NavigationCard
                title={localization.catalogType.concept}
                body={`${getConceptCatalogByOrgId(org.organizationId)?.antallBegrep ?? localization.none} ${localization.descriptionType.concept}`}
                href={`${process.env.CONCEPT_CATALOG_FRONTEND}/catalogs/${org.organizationId}/concepts`}
              />
            </div>

            <div key={`publicServiceCatalog-${org.organizationId}`}>
              <NavigationCard
                title={localization.catalogType.service}
                subtitle={localization.resourceType.publicServices}
                body={`${getPublicServiceCatalogByOrgId(org.organizationId)?.publicServiceCount && getPublicServiceCatalogByOrgId(org.organizationId)?.publicServiceCount !== 0 ? getPublicServiceCatalogByOrgId(org.organizationId)?.publicServiceCount : localization.none} ${localization.descriptionType.service}`}
                href={`${process.env.SERVICE_CATALOG_GUI_BASE_URI}/catalogs/${org.organizationId}/public-services`}
              />
            </div>

            <div key={`serviceCatalog-${org.organizationId}`}>
              <NavigationCard
                title={localization.catalogType.service}
                subtitle={localization.resourceType.services}
                body={`${getServiceCatalogByOrgId(org.organizationId)?.serviceCount && getServiceCatalogByOrgId(org.organizationId)?.serviceCount !== 0 ? getServiceCatalogByOrgId(org.organizationId)?.serviceCount : localization.none} ${localization.descriptionType.service}`}
                href={`${process.env.SERVICE_CATALOG_GUI_BASE_URI}/catalogs/${org.organizationId}/services`}
              />
            </div>

            <div key={`recordOfProcessingActivities-${org.organizationId}`}>
              <NavigationCard
                title={localization.catalogType.recordsOfProcessingActivities}
                body={
                  <>
                    <span className={styles.behandlingsoversikt}>
                      {`${getRecordsOfProcessingActivityByOrgId(org.organizationId)?.recordCount ?? localization.none} ${localization.descriptionType.recordsOfProcessingActivities}`}
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
                href={`${process.env.RECORDS_OF_PROCESSING_ACTIVITIES_GUI_BASE_URI}/${org.organizationId}`}
              ></NavigationCard>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CatalogPortalPage;
