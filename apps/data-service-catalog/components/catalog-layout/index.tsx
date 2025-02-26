'use client';

import React, { ReactNode } from 'react';
import { Layout } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { useParams } from 'next/navigation';
import { useGetCatalogDesign } from '../../hooks/catalog-admin';

interface CatalogLayoutProps {
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
  children,
  className,
  catalogAdminUrl,
  catalogAdminServiceUrl,
  fdkRegistrationBaseUrl,
  adminGuiBaseUrl,
  fdkBaseUrl,
}: CatalogLayoutProps) => {
  const { catalogId } = useParams();
  const { data: design } = useGetCatalogDesign(catalogId?.toString(), catalogAdminServiceUrl);

  return (
    <Layout
      fontColor={design?.fontColor}
      backgroundColor={design?.backgroundColor}
      className={className}
      catalogAdminUrl={catalogAdminUrl}
      fdkRegistrationBaseUrl={fdkRegistrationBaseUrl}
      adminGuiBaseUrl={adminGuiBaseUrl}
      fdkBaseUrl={fdkBaseUrl}
      catalogTitle={localization.catalogType.dataset}
      displayFooter={false}
    >
      {children}
    </Layout>
  );
};
