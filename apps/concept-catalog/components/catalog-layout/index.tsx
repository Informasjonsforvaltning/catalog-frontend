"use client";

import React, { ReactNode } from "react";
import { Layout } from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";
import { useGetCatalogDesign } from "@concept-catalog/hooks/catalog-admin";

interface CatalogLayoutProps {
  catalogId?: string;
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
  catalogId,
  children,
  className,
  catalogAdminUrl,
  fdkRegistrationBaseUrl,
  adminGuiBaseUrl,
  fdkBaseUrl,
  catalogAdminServiceUrl,
}: CatalogLayoutProps) => {
  const { data: design } = useGetCatalogDesign(
    catalogId || "",
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
