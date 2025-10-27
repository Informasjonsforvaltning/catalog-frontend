import { TermsOfUseModal } from '@catalog-frontend/ui';
import { CatalogLayout } from '../../../components/catalog-layout';
import { ReactNode } from 'react';

export default async function PageLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ catalogId: string }>;
}) {
  const { catalogId } = await params;
  return (
    <CatalogLayout
      catalogAdminUrl={process.env.CATALOG_ADMIN_BASE_URI}
      catalogAdminServiceUrl={process.env.CATALOG_ADMIN_SERVICE_BASE_URI}
      fdkRegistrationBaseUrl={process.env.CATALOG_PORTAL_BASE_URI}
      adminGuiBaseUrl={process.env.ADMIN_GUI_BASE_URI}
      fdkBaseUrl={process.env.FDK_BASE_URI}
    >
      <TermsOfUseModal catalogId={catalogId} />
      {children}
    </CatalogLayout>
  );
}
