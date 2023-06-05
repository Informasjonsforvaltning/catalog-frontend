import { FC } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import '@altinn/figma-design-tokens/dist/tokens.css';
import '@digdir/design-system-tokens/brand/digdir/tokens.css';
import { localization } from '@catalog-frontend/utils';
import { Layout } from '@catalog-frontend/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Heebo } from '@next/font/google';

const heebo = Heebo({ subsets: ['latin'] });

const CustomApp: FC<AppProps<{ session: Session }>> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const queryClient = new QueryClient();

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>{localization.catalogType.concept}</title>
          <link
            rel='shortcut icon'
            href='/favicon.ico'
          />
        </Head>
        <Layout className={heebo.className}>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default CustomApp;
