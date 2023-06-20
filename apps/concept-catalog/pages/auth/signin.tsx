import { Session } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const SignIn = () => {
  const router = useRouter();
  const { data, status } = useSession();
  const session: Session = data;

  useEffect(() => {
    if (
      (session?.error === 'RefreshAccessTokenError' || status === 'unauthenticated') &&
      router.pathname !== '/auth/signout'
    ) {
      signIn('keycloak');
    }
  }, [session, status, router]);

  return <p>Logger in...</p>;
};

export default SignIn;
