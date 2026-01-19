"use server";

import {
  getResourceRoles,
  getTranslateText,
  getValidSession,
  hasNonSystemAccessForOrg,
  hasSystemAdminPermission,
  localization,
  redirectToSignIn,
} from "@catalog-frontend/utils";
import {
  getAllServiceMessages,
  getOrganizations,
  StrapiGraphql,
} from "@catalog-frontend/data-access";
import { Organization } from "@catalog-frontend/types";
import OrganizationCombo from "./components/organization-combobox";
import { redirect } from "next/navigation";
import {
  ServiceMessages,
  TermsOfUseAlert,
  MarkdownComponent,
} from "@catalog-frontend/ui";
import { Alert, Heading } from "@digdir/designsystemet-react";
import styles from "./catalogs.module.css";
import { CatalogCard } from "./components/catalog-card";

const CatalogsPage = async (props: {
  params: Promise<{ catalogId: string[] }>;
}) => {
  const params = await props.params;

  const { catalogId } = params;

  const session = await getValidSession();
  if (!session) {
    redirectToSignIn({ callbackUrl: `/catalogs` });
  }

  let organizations: Organization[] = [];
  if (hasSystemAdminPermission(`${session?.accessToken}`)) {
    organizations = await getOrganizations();
  } else {
    const resourceRoles = getResourceRoles(`${session?.accessToken}`);
    const organiztionIdsWithAdminRole = resourceRoles
      .filter((role) => role.resource === "organization")
      .map((role) => role.resourceId);

    if (organiztionIdsWithAdminRole.length > 0) {
      organizations = await getOrganizations(organiztionIdsWithAdminRole);
    }
  }

  if (organizations.length === 1 && !catalogId) {
    return redirect(`/catalogs/${organizations[0].organizationId}`);
  }

  const currentOrganization = organizations.find(
    (org) => org.organizationId === catalogId?.[0],
  );
  const hasNonSystemAccess = catalogId
    ? hasNonSystemAccessForOrg(`${session?.accessToken}`, catalogId?.[0])
    : false;
  const serviceMessages = await getServiceMessages();

  return (
    <div className="container">
      <ServiceMessages serviceMessages={serviceMessages} />
      <Heading level={1} spacing>
        Katalogoversikt
      </Heading>
      {(organizations.length > 1 ||
        (organizations.length > 0 && !currentOrganization)) && (
        <OrganizationCombo
          organizations={organizations}
          currentOrganization={currentOrganization}
        />
      )}
      {organizations.length === 0 ? (
        <Alert severity="warning" style={{ marginTop: "1rem" }}>
          <Heading level={2} size="xs" spacing>
            {localization.alert.noOrganizationAvailable.heading}
          </Heading>
          <MarkdownComponent>
            {localization.alert.noOrganizationAvailable.text}
          </MarkdownComponent>
        </Alert>
      ) : null}
      {currentOrganization && (
        <div key={`org-section-${currentOrganization.organizationId}`}>
          <Heading
            data-testid="catalog-portal-heading"
            className={styles.heading}
            size="lg"
          >
            {getTranslateText(currentOrganization.prefLabel)}
          </Heading>
          {hasNonSystemAccess && (
            <TermsOfUseAlert catalogId={currentOrganization.organizationId} />
          )}
          <div className={styles.cards}>
            <div key={`datasetCatalog-${currentOrganization.organizationId}`}>
              <CatalogCard
                variant="dataset"
                organizationId={currentOrganization.organizationId}
                href={`${process.env.DATASET_CATALOG_FRONTEND}/catalogs/${currentOrganization.organizationId}/datasets`}
              />
            </div>

            <div
              key={`dataServiceCatalog-${currentOrganization.organizationId}`}
            >
              <CatalogCard
                variant="data-service"
                organizationId={currentOrganization.organizationId}
                href={`${process.env.DATASERVICE_CATALOG_BASE_URI}/${currentOrganization.organizationId}`}
              />
            </div>

            <div key={`conceptCatalog-${currentOrganization.organizationId}`}>
              <CatalogCard
                variant="concept"
                organizationId={currentOrganization.organizationId}
                href={`${process.env.CONCEPT_CATALOG_FRONTEND}/catalogs/${currentOrganization.organizationId}/concepts`}
              />
            </div>

            <div
              key={`publicServiceCatalog-${currentOrganization.organizationId}`}
            >
              <CatalogCard
                variant="public-service"
                organizationId={currentOrganization.organizationId}
                href={`${process.env.SERVICE_CATALOG_GUI_BASE_URI}/catalogs/${currentOrganization.organizationId}/public-services`}
              />
            </div>

            <div key={`serviceCatalog-${currentOrganization.organizationId}`}>
              <CatalogCard
                variant="service"
                organizationId={currentOrganization.organizationId}
                href={`${process.env.SERVICE_CATALOG_GUI_BASE_URI}/catalogs/${currentOrganization.organizationId}/services`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getServiceMessages = async (): Promise<
  StrapiGraphql.ServiceMessage[]
> => {
  const response = await getAllServiceMessages();
  if (response.status !== 200) {
    console.error(
      "getServiceMessages failed with response code " + response.status,
    );
    return [];
  }
  return response.data?.serviceMessages;
};

export default CatalogsPage;
