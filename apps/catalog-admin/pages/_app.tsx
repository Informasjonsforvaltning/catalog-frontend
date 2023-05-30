import { FC } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { localization } from '@catalog-frontend/utils';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { Layout } from '@catalog-frontend/ui';
import '@altinn/figma-design-tokens/dist/tokens.css';
import '@digdir/design-system-tokens/brand/digdir/tokens.css';

const CustomApp: FC<AppProps<{ session: Session }>> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>{localization.catalogType.concept}</title>
        <link
          rel='shortcut icon'
          href='/favicon.ico'
        />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
};

export default CustomApp;
