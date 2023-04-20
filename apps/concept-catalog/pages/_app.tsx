import {FC} from 'react';
import {AppProps} from 'next/app';
import Head from 'next/head';
import {GlobalStyle} from '@catalog-frontend/utils';
import {Footer, Root} from '@catalog-frontend/ui';
import type {Session} from 'next-auth';
import {
  SessionProvider,
} from 'next-auth/react';
import Header from '../components/header/header';
import RouteGuard from '../components/route-guard/route-guard';

const CustomApp: FC<AppProps<{session: Session}>> = ({
  Component,
  pageProps: {session, ...pageProps},
}) => {  

  return (
    <SessionProvider session={session}>
      <Head>
        <title>Begrepskatalogen</title>
        <link
          rel="shortcut icon"
          href="/favicon.ico"
        />
      </Head>
      <GlobalStyle />
      <Root>
        <RouteGuard>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </RouteGuard>
      </Root>   
    </SessionProvider>
  );
};

export default CustomApp;
