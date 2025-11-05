"use client";

import React, { ReactNode } from "react";
import { useParams } from "next/navigation";
import { Layout } from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";
import { useGetCatalogDesign } from "@concept-catalog/hooks/catalog-admin";

interface CatalogLayoutProps {
  children: ReactNode;
  className?: string;
  catalogAdminUrl?: string;
  fdkRegistrationBaseUrl?: string;
  adminGuiBaseUrl?: string;
  fdkCommunityBaseUrl?: string;
  fdkBaseUrl?: string;
  catalogAdminServiceUrl?: string;
}

export const CatalogLayout = ({
  children,
  className,
  catalogAdminUrl,
  fdkRegistrationBaseUrl,
  adminGuiBaseUrl,
  fdkBaseUrl,
  catalogAdminServiceUrl,
}: CatalogLayoutProps) => {
  const { catalogId } = useParams();
  const { data: design } = useGetCatalogDesign(
    catalogId?.toString(),
    catalogAdminServiceUrl,
  );

  return (
    <Layout
      fontColor={design?.fontColor}
      backgroundColor={design?.backgroundColor}
      className={className}
      catalogAdminUrl={catalogAdminUrl}
      fdkRegistrationBaseUrl={`${fdkRegistrationBaseUrl}/catalogs`}
      adminGuiBaseUrl={adminGuiBaseUrl}
      fdkBaseUrl={fdkBaseUrl}
      termsOfUseUrl={`${fdkRegistrationBaseUrl}/terms-and-conditions/${catalogId}`}
      catalogTitle={localization.catalogType.concept}
      displayFooter={false}
    >
      {children}
    </Layout>
  );
};

export default CatalogLayout;
