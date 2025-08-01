import { TermsOfUseModal } from '@catalog-frontend/ui';
import { CatalogLayout } from '@concept-catalog/components/catalog-layout';

const Layout = async (props: { children: React.ReactNode; params: Promise<{ catalogId: string }> }) => {
  const params = await props.params;

  const { catalogId } = params;

  const { children } = props;

  return (
    <CatalogLayout
      catalogAdminUrl={process.env.CATALOG_ADMIN_BASE_URI}
      catalogAdminServiceUrl={process.env.CATALOG_ADMIN_SERVICE_BASE_URI}
      fdkRegistrationBaseUrl={process.env.CATALOG_PORTAL_BASE_URI}
      adminGuiBaseUrl={process.env.ADMIN_GUI_BASE_URI}
      fdkCommunityBaseUrl={process.env.FDK_COMMUNITY_BASE_URI}
      fdkBaseUrl={process.env.FDK_BASE_URI}
    >
      <TermsOfUseModal catalogId={catalogId} />
      {children}
    </CatalogLayout>
  );
};

export default Layout;
