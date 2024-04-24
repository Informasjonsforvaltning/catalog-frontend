'use client';

import { Spinner } from '@catalog-frontend/ui';
import { localization, validOrganizationNumber, validUUID } from '@catalog-frontend/utils';
import { Heading as DSHeading } from '@digdir/designsystemet-react';
import { Session } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const needLogin = (session: Session | null, status: string, pathname: string) =>
  (session?.error === 'RefreshAccessTokenError' || status === 'unauthenticated') && pathname !== '/auth/signout';

export const Heading = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data, status } = useSession();
  const session: Session | null = data;
  const callbackUrl = searchParams.get('callbackUrl') as string;

  const parts = callbackUrl.split('/');
  let securedUrl = '';
  if (parts.length === 2) {
    const orgNumber = validOrganizationNumber(parts[1]) ? parts[1] : '0';
    securedUrl = `/${orgNumber}`;
  } else if (parts.length === 3) {
    const orgNumber = validOrganizationNumber(parts[1]) ? parts[1] : '0';
    const conceptId = validUUID(parts[2]) ? parts[2] : '0';
    securedUrl = `/${orgNumber}/${conceptId}`;
  }

  if (securedUrl) {
    if (needLogin(session, status, pathname)) {
      signIn('keycloak', { callbackUrl: `${securedUrl}` });
    } else {
      router.push(`${securedUrl}`);
    }
  }

  return (
    <>
      {needLogin(session, status, pathname) && (
        <DSHeading
          level={2}
          size='small'
        >
          <div>{localization.auth.loggingIn}</div>
          <Spinner />
        </DSHeading>
      )}
    </>
  );
};

export default Heading;
