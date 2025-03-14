import { Layout } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout
      catalogAdminUrl={process.env.CATALOG_ADMIN_BASE_URI}
      fdkRegistrationBaseUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
      adminGuiBaseUrl={process.env.ADMIN_GUI_BASE_URI}
      fdkBaseUrl={process.env.FDK_BASE_URI}
      catalogTitle={localization.catalogOverview}
      displayFooter={false}
    >
      {children}
    </Layout>
  );
};

export default PageLayout;
