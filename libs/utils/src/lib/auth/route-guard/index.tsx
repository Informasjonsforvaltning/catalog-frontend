/* eslint-disable react/jsx-no-useless-fragment */
import { Session } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface RouteGuardProps {
  children: React.ReactNode;
}

interface SessionProps extends Session {
  error?: string;
}

interface UseSessionProps {
  data: SessionProps | null;
  status: string;
}

export const RouteGuard = ({ children }: RouteGuardProps) => {
  const router = useRouter();
  const { data: session, status }: UseSessionProps = useSession();

  const allowed = !!session?.user;

  useEffect(() => {
    if (
      (session?.error === 'RefreshAccessTokenError' || status === 'unauthenticated') &&
      router.pathname !== '/auth/signout'
    ) {
      signIn('keycloak');
    }
  }, [session, status, router]);

  if (allowed) {
    return <>{children}</>;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <></>;
};
