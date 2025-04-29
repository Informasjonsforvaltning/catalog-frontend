'use client';

import { localization } from '@catalog-frontend/utils';
import { signIn } from 'next-auth/react';
import { useSearchParams, usePathname } from 'next/navigation';
import { Spinner } from '../spinner';
import { useEffect } from 'react';

const KeycloakSignin = () => {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  useEffect(() => {
    signIn('keycloak', callbackUrl ? { callbackUrl } : { callbackUrl: pathName.includes('auth') ? '/' : undefined });
  }, []);

  return <Spinner title={localization.auth.loggingIn} />;
};

export { KeycloakSignin };
