import { NextAuthProvider, ReactQueryClientProvider } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Metadata } from 'next';
import CatalogLayout from '../components/catalog-layout';
import { Inter } from 'next/font/google';

export const metadata: Metadata = {
  title: localization.catalogType.concept,
  description: localization.catalogType.concept,
};

const font = Inter({ subsets: ['latin'] });

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang={localization.getLanguage()}>
      <body>
        <NextAuthProvider>
          <ReactQueryClientProvider>
            <CatalogLayout className={font.className}>{children}</CatalogLayout>
          </ReactQueryClientProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
