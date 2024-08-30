import {
  getTranslateText,
  getValidSession,
  hasNonSystemAccessForOrg,
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

const CatalogPortalPage: React.FC<{ params: Params }> = async () => {
  const session = await getValidSession({ callbackUrl: `/catalogs` });
  const datasetCatalogs: DatasetCatalog[] = await getDatasetCatalogs();
  const dataServiceCatalogs: DataServiceCatalog[] = await getDataServiceCatalogs();
  const conceptCatalogs: ConceptCatalog[] = await getConceptCatalogs();
  const allServiceCatalogs = await getServiceCatalogs();
  const publicServiceCatalogs: PublicServiceCatalog[] = allServiceCatalogs.publicServiceCatalogs;
  const serviceCatalogs: ServiceCatalog[] = allServiceCatalogs.serviceCatalogs;
  const recordsOfProcessingActivities: RecordOfProcessingActivities[] = await getAllProcesssingActivitiesCatalogs();
  const serviceMessages: ServiceMessageEntity[] = await getServiceMessages();

  const getDatasetCatalogByOrgId = (orgId: string): DatasetCatalog | undefined =>
    datasetCatalogs.find((catalog) => catalog.id === orgId);

  const getDataServiceCatalogByOrgId = (orgId: string): DataServiceCatalog | undefined =>
    dataServiceCatalogs.find((catalog) => catalog.id === orgId);

  const getConceptCatalogByOrgId = (orgId: string): ConceptCatalog | undefined =>
    conceptCatalogs.find((catalog) => catalog.id === orgId);

  const getPublicServiceCatalogByOrgId = (orgId: string): PublicServiceCatalog | undefined =>
    publicServiceCatalogs.find((catalog) => catalog.catalogId === orgId);

  const getServiceCatalogByOrgId = (orgId: string): ServiceCatalog | undefined =>
    serviceCatalogs.find((catalog) => catalog.catalogId === orgId);

  const getRecordsOfProcessingActivityByOrgId = (orgId: string): RecordOfProcessingActivities | undefined =>
    recordsOfProcessingActivities.find((record) => record.organizationId === orgId);

  const getAllUniqueOrgIds = (): string[] => {
    const orgIdsSet = new Set<string>();
    datasetCatalogs.forEach((catalog) => orgIdsSet.add(catalog.publisher.id));
    conceptCatalogs.forEach((catalog) => orgIdsSet.add(catalog.id));
    publicServiceCatalogs.forEach((catalog) => orgIdsSet.add(catalog.catalogId));
    serviceCatalogs.forEach((catalog) => orgIdsSet.add(catalog.catalogId));
    dataServiceCatalogs.forEach((catalog) => orgIdsSet.add(catalog.id));
    recordsOfProcessingActivities.forEach((catalog) => orgIdsSet.add(catalog.organizationId));

    return Array.from(orgIdsSet);
  };

  const organizationIds = getAllUniqueOrgIds();
  const organizations = await getOrganizations(organizationIds).then((res) => res.json());

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
                icon={
                  <FilesIcon
                    title='Files icon'
                    fontSize='2.5rem'
                  />
                }
                title={localization.catalogType.dataset}
                body={`${getDatasetCatalogByOrgId(org.organizationId)?.datasetCount ?? localization.none} ${localization.descriptionType.dataset}`}
                href={`${process.env.FDK_REGISTRATION_BASE_URI}/catalogs/${org.organizationId}/datasets`}
              />
            </div>

            <div key={`dataServiceCatalog-${org.organizationId}`}>
              <NavigationCard
                icon={
                  <CodeIcon
                    title='Code icon'
                    fontSize='2.5rem'
                  />
                }
                title={localization.catalogType.dataService}
                body={`${getDataServiceCatalogByOrgId(org.organizationId)?.dataServiceCount ?? localization.none} ${localization.descriptionType.dataService}`}
                href={`${process.env.DATASERVICE_CATALOG_BASE_URI}/${org.organizationId}`}
              />
            </div>

            <div key={`conceptCatalog-${org.organizationId}`}>
              <NavigationCard
                icon={
                  <ChatElipsisIcon
                    title='Elipsis icon'
                    fontSize='2.5rem'
                  />
                }
                title={localization.catalogType.concept}
                body={`${getConceptCatalogByOrgId(org.organizationId)?.antallBegrep ?? localization.none} ${localization.descriptionType.concept}`}
                href={`${process.env.CONCEPT_CATALOG_FRONTEND}/${org.organizationId}`}
              />
            </div>

            <div key={`publicServiceCatalog-${org.organizationId}`}>
              <NavigationCard
                icon={
                  <CompassIcon
                    title='Compass icon'
                    fontSize='2.5rem'
                  />
                }
                title={localization.catalogType.publicService}
                body={`${getPublicServiceCatalogByOrgId(org.organizationId)?.publicServiceCount ?? localization.none} ${localization.descriptionType.publicService}`}
                href={`${process.env.SERVICE_CATALOG_GUI_BASE_URI}/catalogs/${org.organizationId}/public-services`}
              />
            </div>

            <div key={`serviceCatalog-${org.organizationId}`}>
              <NavigationCard
                icon={
                  <CompassIcon
                    title='Compass icon'
                    fontSize='2.5rem'
                  />
                }
                title={localization.catalogType.service}
                body={`${getServiceCatalogByOrgId(org.organizationId)?.serviceCount ?? localization.none} ${localization.descriptionType.service}`}
                href={`${process.env.SERVICE_CATALOG_GUI_BASE_URI}/catalogs/${org.organizationId}/services`}
              />
            </div>

            <div key={`recordOfProcessingActivities-${org.organizationId}`}>
              <NavigationCard
                icon={
                  <GavelSoundBlockIcon
                    title='Gavel Sound Block Icon'
                    fontSize='2.5rem'
                  />
                }
                title={localization.catalogType.recordsOfProcessingActivities}
                body={`${getRecordsOfProcessingActivityByOrgId(org.organizationId)?.recordCount ?? localization.none} ${localization.descriptionType.recordsOfProcessingActivities}`}
                href={`${process.env.RECORDS_OF_PROCESSING_ACTIVITIES_GUI_BASE_URI}/${org.organizationId}`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CatalogPortalPage;
