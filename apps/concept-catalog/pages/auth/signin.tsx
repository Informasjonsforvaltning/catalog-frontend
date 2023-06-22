import { BreadcrumbType, Breadcrumbs, CenterContainer, PageBanner } from '@catalog-frontend/ui';
import { localization, validOrganizationNumber } from '@catalog-frontend/utils';
import { Heading } from '@digdir/design-system-react';
import { Session } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const needLogin = (session, status, router) =>
  (session?.error === 'RefreshAccessTokenError' || status === 'unauthenticated') && router.pathname !== '/auth/signout';

export const SignIn = () => {
  const router = useRouter();
  const { data, status } = useSession();
  const session: Session = data;
  const catalogId = router.query.catalogId as string;

  const breadcrumbList = [
    {
      href: `#`,
      text: localization.auth.login,
    },
  ] as BreadcrumbType[];

  useEffect(() => {
    if (validOrganizationNumber(catalogId)) {
      if (needLogin(session, status, router)) {
        signIn('keycloak', { callbackUrl: `/${catalogId}` });
      } else {
        router.push(`/${catalogId}`);
      }
    }
  }, [session, status, router, catalogId]);

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={localization.auth.login}
      />
      <CenterContainer>
        <Heading
          level={2}
          size='small'
        >
          {needLogin(session, status, router) && localization.auth.loggingIn}
        </Heading>
      </CenterContainer>
    </>
  );
};

export default SignIn;
