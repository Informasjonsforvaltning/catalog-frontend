import { Layout } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Metadata } from 'next';
import '../global.css';

export const metadata: Metadata = {
  title: localization.catalogType.admin,
  description: localization.catalogType.admin,
};

const PageLayout = ({ children }: { children: React.ReactNode; }) => {
  return (
    <Layout
      catalogAdminUrl={process.env.CATALOG_ADMIN_BASE_URI}
      fdkRegistrationBaseUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
      adminGuiBaseUrl={process.env.ADMIN_GUI_BASE_URI}
      fdkBaseUrl={process.env.FDK_BASE_URI}
    >
      {children}
    </Layout>
  );
};

export default PageLayout;
