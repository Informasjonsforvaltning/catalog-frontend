import { BasicServiceForm } from "../../../../../components/basic-service-form";
import { Heading } from "@digdir/designsystemet-react";
import { BreadcrumbType, Breadcrumbs, PageBanner } from "@catalog-frontend/ui";
import { Organization, ReferenceDataCode } from "@catalog-frontend/types";
import {
  getAdmsStatuses,
  getOrganization,
} from "@catalog-frontend/data-access";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import styles from "./service-new-page.module.css";
import { NewPage } from "./new-page-client";

export default async function NewServicePage(props: {
  params: Promise<{ catalogId: string }>;
}) {
  const params = await props.params;
  const { catalogId } = params;
  const organization: Organization = await getOrganization(catalogId).then(
    (res) => res.json(),
  );
  const statusesResponse = await getAdmsStatuses().then((res) => res.json());

  const breadcrumbList = [
    {
      href: `/catalogs/${catalogId}/services`,
      text: localization.catalogType.service,
    },
    {
      href: `/catalogs/${catalogId}/services/new`,
      text: localization.serviceCatalog.form.new,
    },
  ];

  return (
    <>
      <Breadcrumbs
        breadcrumbList={breadcrumbList}
        catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
      />
      <PageBanner
        title={localization.catalogType.service}
        subtitle={getTranslateText(organization?.prefLabel).toString()}
      />
      <NewPage statuses={statusesResponse.statuses} />
    </>
  );
}
