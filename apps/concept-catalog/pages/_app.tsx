import { FC } from 'react';
import { AppProps } from 'next/app';
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

const CustomApp: FC<AppProps<{ session: Session }>> = ({ Component, pageProps: { session, ...pageProps } }) => {
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

            <CatalogLayout className={font.className}>
              <Component {...pageProps} />
            </CatalogLayout>
          </CatalogDesignContextProvider>
        </QueryClientProvider>
      </SessionProvider>
    </SearchContextProvider>
  );
};

export default CustomApp;
