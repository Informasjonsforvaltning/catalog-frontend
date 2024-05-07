'use client';

import { localization } from '@catalog-frontend/utils';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Spinner } from '../spinner';

const KeycloakSignin = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';

  signIn('keycloak', { callbackUrl });

  return <Spinner title={localization.auth.loggingIn} />;
};

export { KeycloakSignin };
