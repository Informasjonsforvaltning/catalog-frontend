'use client';

import { localization } from '@catalog-frontend/utils';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Spinner } from '../spinner';
import { useEffect } from 'react';

const KeycloakSignin = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';

  useEffect(() => {
    signIn('keycloak', { callbackUrl });
  }, [callbackUrl]);

  return <Spinner title={localization.auth.loggingIn} />;
};

export { KeycloakSignin };
