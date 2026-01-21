"use client";

import React, { ReactNode } from "react";
import { Layout } from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";
import { useGetCatalogDesign } from "../../hooks/catalog-admin";

interface CatalogLayoutProps {
  catalogId?: string;
  children: ReactNode;
  className?: string;
  catalogAdminUrl?: string;
  catalogAdminServiceUrl?: string;
  fdkRegistrationBaseUrl?: string;
  adminGuiBaseUrl?: string;
  fdkCommunityBaseUrl?: string;
  fdkBaseUrl?: string;
}

export const CatalogLayout = ({
  catalogId,
  children,
  className,
  catalogAdminUrl,
  catalogAdminServiceUrl,
  fdkRegistrationBaseUrl,
  adminGuiBaseUrl,
  fdkBaseUrl,
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
      termsOfUseUrl={`${fdkRegistrationBaseUrl}/terms-and-conditions/${catalogId}`}
      adminGuiBaseUrl={adminGuiBaseUrl}
      fdkBaseUrl={fdkBaseUrl}
      catalogTitle={localization.catalogType.dataset}
      displayFooter={false}
    >
      {children}
    </Layout>
  );
};
