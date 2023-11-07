'use client';

import { BreadcrumbType, Breadcrumbs, CenterContainer, PageBanner, Spinner } from '@catalog-frontend/ui';
import { localization, validOrganizationNumber } from '@catalog-frontend/utils';
import { Heading } from '@digdir/design-system-react';
import { Session } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const needLogin = (session, status, router) =>
  (session?.error === 'RefreshAccessTokenError' || status === 'unauthenticated') && router.pathname !== '/auth/signout';

export const SignIn = ({ FDK_REGISTRATION_BASE_URI }) => {
  const router = useRouter();
  const { data, status } = useSession();
  const session: Session = data;
  const callbackUrl = router.query.callbackUrl as string;

  const breadcrumbList = [
    {
      href: `#`,
      text: localization.auth.login,
    },
  ] as BreadcrumbType[];

  useEffect(() => {
    const parts = callbackUrl?.split('/');
    let securedUrl = null;
    if (parts?.length >= 3) {
      const orgNumber = validOrganizationNumber(parts[2]) ? parts[2] : '0';
      securedUrl = `/catalogs/${orgNumber}`;
    } else {
      securedUrl = '/';
    }

    if (securedUrl) {
      if (needLogin(session, status, router)) {
        signIn('keycloak', { callbackUrl: `${securedUrl}` });
      } else {
        router.push(`${securedUrl}`);
      }
    }
  }, [session, status, router, callbackUrl]);

  return (
    <>
      <Breadcrumbs
        baseURI={FDK_REGISTRATION_BASE_URI}
        breadcrumbList={breadcrumbList}
      />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={localization.auth.login}
      />
      <CenterContainer>
        <Heading
          level={2}
          size='small'
        >
          {needLogin(session, status, router) && (
            <>
              <div>{localization.auth.loggingIn}</div>
              <Spinner />
            </>
          )}
        </Heading>
      </CenterContainer>
    </>
  );
};

export async function getServerSideProps() {
  return {
    props: {
      FDK_REGISTRATION_BASE_URI: process.env.FDK_REGISTRATION_BASE_URI,
    },
  };
}

export default SignIn;
