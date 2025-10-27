import { Layout } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { ReactNode } from 'react';

const PageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Layout
      catalogAdminUrl={process.env.CATALOG_ADMIN_BASE_URI}
      fdkRegistrationBaseUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
      adminGuiBaseUrl={process.env.ADMIN_GUI_BASE_URI}
      fdkBaseUrl={process.env.FDK_BASE_URI}
      catalogTitle={localization.catalogType.service}
    >
      {children}
    </Layout>
  );
};

export default PageLayout;
