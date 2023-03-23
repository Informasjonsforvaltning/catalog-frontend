import {AppProps} from 'next/app';
import Head from 'next/head';

import "@altinn/figma-design-tokens/dist/tokens.css";
import {SessionProvider, Session} from '@catalog-frontend/auth';
import {DefaultTheme} from '@fellesdatakatalog/theme';
import {ThemeProvider} from 'styled-components';
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
        <ThemeProvider theme={DefaultTheme}>
          <GlobalStyle />
          <Component {...pageProps} />
        </ThemeProvider>
      </main>
    </SessionProvider>
  );
}

export default CustomApp;
