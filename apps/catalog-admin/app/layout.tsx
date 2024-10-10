import { Layout, NextAuthProvider, ReactQueryClientProvider } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Metadata } from 'next';
import './global.css';
import { AdminContextProvider } from '../context/admin';

export const metadata: Metadata = {
  title: localization.catalogType.admin,
  description: localization.catalogType.admin,
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang={localization.getLanguage()}>
      <body>
        <NextAuthProvider>
          <AdminContextProvider>
            <ReactQueryClientProvider>
              <Layout
                catalogAdminUrl={process.env.CATALOG_ADMIN_BASE_URI}
                fdkRegistrationBaseUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
                adminGuiBaseUrl={process.env.ADMIN_GUI_BASE_URI}
                fdkCommunityBaseUrl={process.env.FDK_COMMUNITY_BASE_URI}
                fdkBaseUrl={process.env.FDK_BASE_URI}
              >
                {children}
              </Layout>
            </ReactQueryClientProvider>
          </AdminContextProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
