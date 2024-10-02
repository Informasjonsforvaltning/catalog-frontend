import { Layout, NextAuthProvider } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Metadata } from 'next';
import { ThemesProvider } from './context/themes';

export const metadata: Metadata = {
  title: localization.catalogType.dataset,
  description: localization.catalogType.dataset,
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang={localization.getLanguage()}>
      <body>
        <NextAuthProvider>
          <ThemesProvider>
            <Layout
              catalogAdminUrl={process.env.CATALOG_ADMIN_BASE_URI}
              fdkRegistrationBaseUrl={`${process.env.NEXT_PUBLIC_CATALOG_PORTAL_BASE_URI}/catalogs`}
              adminGuiBaseUrl={process.env.ADMIN_GUI_BASE_URI}
              fdkCommunityBaseUrl={process.env.FDK_COMMUNITY_BASE_URI}
              fdkBaseUrl={process.env.FDK_BASE_URI}
              catalogTitle={localization.catalogType.service}
            >
              {children}
            </Layout>
          </ThemesProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
