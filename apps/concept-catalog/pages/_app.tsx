import {FC} from 'react';
import {AppProps} from 'next/app';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {GlobalStyle} from '@catalog-frontend/utils';
import {Header, Footer, Root} from '@catalog-frontend/ui';
import type {Session} from 'next-auth';
import {
  SessionProvider,
} from 'next-auth/react';
import RouteGuard from '../components/route-guard/route-guard';

const CustomApp: FC<AppProps<{session: Session}>> = ({
  Component,
  pageProps: {session, ...pageProps},
}) => {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/api/auth/logout');
  };

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
      <RouteGuard>
        <Root>
          <Header
            username={session?.user?.name}
            onLogout={handleLogout}
          />
          <Component {...pageProps} />
          <Footer />
        </Root>
      </RouteGuard>
    </SessionProvider>
  );
};

export default CustomApp;
