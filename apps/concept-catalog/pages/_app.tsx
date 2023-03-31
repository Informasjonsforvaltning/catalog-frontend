import {FC, PropsWithChildren, useEffect} from 'react';
import {AppProps} from 'next/app';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {GlobalStyle} from '@catalog-frontend/utils';
import {Header, Footer, Root} from '@catalog-frontend/ui';
import {
  Session,
  SessionProvider,
  signIn,
  useSession,
} from './api/auth/[...nextauth]';

const RouteGaurd: FC<PropsWithChildren> = ({children}) => {
  const {data: session, status} = useSession();
  const isUser = !!session?.user;

  useEffect(() => {
    if (typeof window !== 'undefined' && status === 'loading') return;
    if (!isUser) signIn('keycloak');
  }, [isUser, status]);

  if (isUser) {
    return <>{children}</>;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <></>;
};

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
      <RouteGaurd>
        <Root>
          <Header
            username={session?.user?.name}
            onLogout={handleLogout}
          />
          <Component {...pageProps} />
          <Footer />
        </Root>
      </RouteGaurd>
    </SessionProvider>
  );
};

export default CustomApp;
