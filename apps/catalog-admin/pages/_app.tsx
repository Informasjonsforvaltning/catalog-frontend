import { FC } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import { localization } from '@catalog-frontend/utils';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { Layout } from '@catalog-frontend/ui';
import '@altinn/figma-design-tokens/dist/tokens.css';
import '@digdir/design-system-tokens/brand/digdir/tokens.css';
import { AdminContextProvider } from '../context/admin';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CatalogDesignContextProvider } from '../context/catalog-design';
import './global.css';

const font = Inter({ subsets: ['latin'] });

const CustomApp: FC<AppProps<{ session: Session }>> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const queryClient = new QueryClient();
  return (
    <AdminContextProvider>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <CatalogDesignContextProvider>
            <Head>
              <title>{localization.manageCatalog}</title>
              <link
                rel='shortcut icon'
                href='/favicon.ico'
              />
            </Head>

            <Layout className={font.className}>
              <Component {...pageProps} />
            </Layout>
          </CatalogDesignContextProvider>
        </QueryClientProvider>
      </SessionProvider>
    </AdminContextProvider>
  );
};

export default CustomApp;
