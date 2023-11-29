import { Layout, NextAuthProvider, ReactQueryClientProvider } from '@catalog-frontend/ui';
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
        <NextAuthProvider>
          <AdminContextProvider>
            <ReactQueryClientProvider>
              <Layout
                catalogAdminUrl={process.env.CATALOG_ADMIN_BASE_URI}
                className={font.className}
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
