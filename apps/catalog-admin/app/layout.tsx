import { Layout, NextAuthProvider, ProxyProvider, ReactQueryClientProvider } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './global.css';
import { AdminContextProvider } from '../context/admin';

export const metadata: Metadata = {
  title: localization.catalogType.admin,
  description: localization.catalogType.admin,
};

const font = Inter({ subsets: ['latin'] });

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang={localization.getLanguage()}>
      <body>
        <ProxyProvider>
          <NextAuthProvider>
            <AdminContextProvider>
              <ReactQueryClientProvider>
                <Layout
                  className={font.className}
                  catalogAdminUrl={process.env.CATALOG_ADMIN_BASE_URI}
                  fdkRegistrationBaseUrl={process.env.FDK_REGISTRATION_BASE_URI}
                  adminGuiBaseUrl={process.env.ADMIN_GUI_BASE_URI}
                  fdkCommunityBaseUrl={process.env.FDK_COMMUNITY_BASE_URI}
                  fdkBaseUrl={process.env.FDK_BASE_URI}
                >
                  {children}
                </Layout>
              </ReactQueryClientProvider>
            </AdminContextProvider>
          </NextAuthProvider>
        </ProxyProvider>
      </body>
    </html>
  );
};

export default RootLayout;
