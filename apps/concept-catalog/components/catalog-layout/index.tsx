import React from 'react';
import { Layout } from '@catalog-frontend/ui';
import { useCatalogDesign } from '../../context/catalog-design';

export const CatalogLayout = ({ children, className, catalogAdminUrl }) => {
  const design = useCatalogDesign();

  return (
    <Layout
      fontColor={design?.fontColor}
      backgroundColor={design?.backgroundColor}
      className={className}
      catalogAdminUrl={catalogAdminUrl}
    >
      {children}
    </Layout>
  );
};

export default CatalogLayout;
