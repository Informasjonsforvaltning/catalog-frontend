import { Layout, NextAuthProvider } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';

export const metadata: Metadata = {
  title: localization.catalogType.service,
  description: localization.catalogType.service,
};

const font = Inter({ subsets: ['latin'] });

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang={localization.getLanguage()}>
      <body>
        <NextAuthProvider>
          <Layout
            className={font.className}
            catalogAdminUrl={process.env.CATALOG_ADMIN_BASE_URI}
            fdkRegistrationBaseUrl={process.env.FDK_REGISTRATION_BASE_URI}
            adminGuiBaseUrl={process.env.ADMIN_GUI_BASE_URI}
            fdkCommunityBaseUrl={process.env.FDK_COMMUNITY_BASE_URI}
            fdkBaseUrl={process.env.FDK_BASE_URI}
            catalogTitle={localization.catalogType.service}
          >
            {children}
          </Layout>
        </NextAuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
