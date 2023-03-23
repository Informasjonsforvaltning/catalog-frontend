import {AppProps} from 'next/app';
import Head from 'next/head';

import {DefaultTheme} from '@fellesdatakatalog/theme';
import {ThemeProvider} from 'styled-components';
import {GlobalStyle} from '@catalog-frontend/utils';
import {RouteGaurd, Session, SessionProvider} from './api/auth/[...nextauth]';

function CustomApp({
  Component,
  pageProps: {session, ...pageProps},
}: AppProps<{session: Session}>) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Begrepskatalogen</title>
      </Head>
      <main>
        <ThemeProvider theme={DefaultTheme}>
          <GlobalStyle />
          <RouteGaurd>
            <Component {...pageProps} />
          </RouteGaurd>
        </ThemeProvider>
      </main>
    </SessionProvider>
  );
}

export default CustomApp;
