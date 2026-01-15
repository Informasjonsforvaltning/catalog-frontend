import { Layout } from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";

const PageLayout = async (props: LayoutProps<"/catalogs/[[...slug]]">) => {
  const { slug } = await props.params;
  const catalogId = slug ? slug[0] : null;

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
      {props.children}
    </Layout>
  );
};

export default PageLayout;
