import { TermsOfUseModal } from "@catalog-frontend/ui";
import { CatalogLayout } from "../../../components/catalog-layout";

export default async function PageLayout(
  props: LayoutProps<"/catalogs/[catalogId]">,
) {
  const { catalogId } = await props.params;

  return (
    <CatalogLayout
      catalogAdminUrl={process.env.CATALOG_ADMIN_BASE_URI}
      catalogAdminServiceUrl={process.env.CATALOG_ADMIN_SERVICE_BASE_URI}
      fdkRegistrationBaseUrl={process.env.CATALOG_PORTAL_BASE_URI}
      adminGuiBaseUrl={process.env.ADMIN_GUI_BASE_URI}
      fdkBaseUrl={process.env.FDK_BASE_URI}
    >
      <TermsOfUseModal catalogId={catalogId} />
      {props.children}
    </CatalogLayout>
  );
}
