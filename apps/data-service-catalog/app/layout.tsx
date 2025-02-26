import { NextAuthProvider, ReactQueryClientProvider } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Metadata } from 'next';
import { CatalogLayout } from '../components/catalog-layout';

export const metadata: Metadata = {
  title: localization.catalogType.dataService,
  description: localization.catalogType.dataService,
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang={localization.getLanguage()}>
      <body>
        <NextAuthProvider>
          <ReactQueryClientProvider>
            <CatalogLayout
              catalogAdminUrl={process.env.CATALOG_ADMIN_BASE_URI}
              catalogAdminServiceUrl={process.env.CATALOG_ADMIN_SERVICE_BASE_URI}
              fdkRegistrationBaseUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
              adminGuiBaseUrl={process.env.ADMIN_GUI_BASE_URI}
              fdkCommunityBaseUrl={process.env.FDK_COMMUNITY_BASE_URI}
              fdkBaseUrl={process.env.FDK_BASE_URI}
            >
              {children}
            </CatalogLayout>
          </ReactQueryClientProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
