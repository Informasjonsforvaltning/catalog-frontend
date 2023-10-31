import { FC } from 'react';
import App, { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import '@altinn/figma-design-tokens/dist/tokens.css';
import '@digdir/design-system-tokens/brand/digdir/tokens.css';
import { localization } from '@catalog-frontend/utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Inter } from 'next/font/google';
import { SearchContextProvider } from '../context/search';
import { CatalogDesignContextProvider } from '../context/catalog-design';
import CatalogLayout from '../components/catalog-layout';

const font = Inter({ subsets: ['latin'] });

type TProps = Pick<AppProps, 'Component' | 'pageProps'> & {
  catalogAdminUrl?: string;
};

const CustomApp = ({ Component, pageProps: { session, ...pageProps }, catalogAdminUrl }: TProps) => {
  const queryClient = new QueryClient();

  return (
    <SearchContextProvider>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <CatalogDesignContextProvider>
            <Head>
              <title>{localization.catalogType.concept}</title>
              <link
                rel='shortcut icon'
                href='/favicon.ico'
              />
            </Head>

            <CatalogLayout
              className={font.className}
              catalogAdminUrl={catalogAdminUrl}
            >
              <Component {...pageProps} />
            </CatalogLayout>
          </CatalogDesignContextProvider>
        </QueryClientProvider>
      </SessionProvider>
    </SearchContextProvider>
  );
};

CustomApp.getInitialProps = async () => {
  const catalogAdminUrl = `${process.env.CATALOG_ADMIN_BASE_URI}`;
  return {
    catalogAdminUrl,
  };
};

export default CustomApp;
