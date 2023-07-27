import { BreadcrumbType, Breadcrumbs, CenterContainer, PageBanner, Spinner } from '@catalog-frontend/ui';
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

  useEffect(() => {
    if (validOrganizationNumber(catalogId)) {
      if (needLogin(session, status, router)) {
        signIn('keycloak', { callbackUrl: catalogId ? `/${catalogId}` : '/' });
      } else if (catalogId) {
        router.push(`/${catalogId}`);
      } else {
        router.push(`/`);
      }
    }
  }, [session, status, router, catalogId]);

  return (
    <>
      <PageBanner
        title=''
        subtitle=''
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

export default SignIn;
