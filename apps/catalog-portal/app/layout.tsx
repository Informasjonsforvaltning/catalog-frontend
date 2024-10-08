import { Layout, NextAuthProvider } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';

export const metadata: Metadata = {
  title: localization.catalogOverview,
  description: localization.catalogOverview,
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
            fdkRegistrationBaseUrl={`${process.env.NEXT_PUBLIC_CATALOG_PORTAL_BASE_URI}/catalogs`}
            adminGuiBaseUrl={process.env.ADMIN_GUI_BASE_URI}
            fdkCommunityBaseUrl={process.env.FDK_COMMUNITY_BASE_URI}
            fdkBaseUrl={process.env.FDK_BASE_URI}
            catalogTitle={localization.catalogOverview}
          >
            {children}
          </Layout>
        </NextAuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
