import { Layout } from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";

const PageLayout = async (
  props: LayoutProps<"/terms-and-conditions/[catalogId]">,
) => {
  const { catalogId } = await props.params;

  return (
    <Layout
      catalogAdminUrl={process.env.CATALOG_ADMIN_BASE_URI}
      fdkRegistrationBaseUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
      adminGuiBaseUrl={process.env.ADMIN_GUI_BASE_URI}
      fdkBaseUrl={process.env.FDK_BASE_URI}
      termsOfUseUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/terms-and-conditions/${catalogId}`}
      catalogTitle={localization.termsOfUse.pageTitle}
      displayFooter={true}
    >
      {props.children}
    </Layout>
  );
};

export default PageLayout;
