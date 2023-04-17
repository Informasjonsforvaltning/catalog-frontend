import {AppProps} from 'next/app';
import Head from 'next/head';

import {SessionProvider, Session} from '@catalog-frontend/auth';
import GlobalStyle from '../styles/global';

function CustomApp({
  Component,
  pageProps: {session, ...pageProps},
}: AppProps<{session: Session}>) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Welcome to concept-catalog!</title>
      </Head>
      <main>
        <GlobalStyle />
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}

export default CustomApp;
