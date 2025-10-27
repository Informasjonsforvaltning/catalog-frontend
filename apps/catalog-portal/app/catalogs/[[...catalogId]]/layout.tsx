import { Layout } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { ReactNode } from 'react';

const PageLayout = async (props: { children: ReactNode; params: Promise<{ catalogId: string }> }) => {
  const params = await props.params;

  const { catalogId } = params;

  const { children } = props;

  return (
    <Layout
      catalogAdminUrl={process.env.CATALOG_ADMIN_BASE_URI}
      fdkRegistrationBaseUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
      adminGuiBaseUrl={process.env.ADMIN_GUI_BASE_URI}
      fdkBaseUrl={process.env.FDK_BASE_URI}
      termsOfUseUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/terms-and-conditions/${catalogId}`}
      catalogTitle={localization.catalogOverview}
      displayFooter={false}
    >
      {children}
    </Layout>
  );
};

export default PageLayout;
