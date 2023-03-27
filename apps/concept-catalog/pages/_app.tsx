import {AppProps} from 'next/app';
import Head from 'next/head';

import {GlobalStyle} from '@catalog-frontend/utils';
import {Header, Footer, Root} from '@catalog-frontend/ui';
import {RouteGaurd, Session, SessionProvider} from './api/auth/[...nextauth]';
import { useRouter } from 'next/router';

function CustomApp({
  Component,
  pageProps: {session, ...pageProps},
}: AppProps<{session: Session}>) {

  const router = useRouter();

  const handleLogout = () => {
    router.push('/auth/signout');
  }

  return (
    <SessionProvider session={session}>    
      <Head>
        <title>Begrepskatalogen</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <GlobalStyle /> 
      <RouteGaurd>
        <Root>
          <Header username={session?.user?.name} onLogout={handleLogout}/>
          <Component {...pageProps} />
          <Footer />          
        </Root>
      </RouteGaurd>      
    </SessionProvider>
  );
}

export default CustomApp;
