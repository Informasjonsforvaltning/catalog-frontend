'use client';

import React, { ReactNode } from 'react';
import { Layout } from '@catalog-frontend/ui';
import { useCatalogDesign } from '../../context/catalog-design';
import { localization } from '@catalog-frontend/utils';

interface CatalogLayoutProps {
  children: ReactNode;
  className?: string;
  catalogAdminUrl?: string;
  fdkRegistrationBaseUrl?: string;
  adminGuiBaseUrl?: string;
  fdkCommunityBaseUrl?: string;
  fdkBaseUrl?: string;
}

export const CatalogLayout = ({
  children,
  className,
  catalogAdminUrl,
  fdkRegistrationBaseUrl,
  adminGuiBaseUrl,
  fdkCommunityBaseUrl,
  fdkBaseUrl,
}: CatalogLayoutProps) => {
  const design = useCatalogDesign();

  return (
    <Layout
      fontColor={design?.fontColor}
      backgroundColor={design?.backgroundColor}
      className={className}
      catalogAdminUrl={catalogAdminUrl}
      fdkRegistrationBaseUrl={fdkRegistrationBaseUrl}
      adminGuiBaseUrl={adminGuiBaseUrl}
      fdkCommunityBaseUrl={fdkCommunityBaseUrl}
      fdkBaseUrl={fdkBaseUrl}
      catalogTitle={localization.catalogType.concept}
    >
      {children}
    </Layout>
  );
};

export default CatalogLayout;
