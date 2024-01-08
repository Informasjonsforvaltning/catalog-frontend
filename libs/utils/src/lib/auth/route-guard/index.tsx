'use client';

/* eslint-disable react/jsx-no-useless-fragment */
import { Session } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const { data: session, status }: UseSessionProps = useSession();

  const allowed = ['/notfound'].includes(pathname) || !!session?.user;

  useEffect(() => {
    if (
      (session?.error === 'RefreshAccessTokenError' || status === 'unauthenticated') &&
      !['/auth/signout', '/notfound'].includes(pathname)
    ) {
      signIn('keycloak');
    }
  }, [session, status, pathname]);

  if (allowed) {
    return <>{children}</>;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <></>;
};
