'use client';

import React, { ReactNode } from 'react';
import { Layout } from '@catalog-frontend/ui';
import { useCatalogDesign } from '../../context/catalog-design';

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
  console.log('CatalogLayout', design);

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
    >
      {children}
    </Layout>
  );
};

export default CatalogLayout;
