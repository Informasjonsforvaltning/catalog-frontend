'use client';

import React from 'react';
import { Layout } from '@catalog-frontend/ui';
import { useCatalogDesign } from '../../context/catalog-design';

export const CatalogLayout = ({
  children,
  className,
  catalogAdminUrl,
  fdkRegistrationBaseUrl,
  adminGuiBaseUrl,
  fdkCommunityBaseUrl,
  fdkBaseUrl,
}) => {
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
    >
      {children}
    </Layout>
  );
};

export default CatalogLayout;
