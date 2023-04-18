import type {GetServerSidePropsContext} from 'next';
import {signIn, useSession} from 'next-auth/react';
import {getServerSession} from 'next-auth/next';
import {authOptions} from '../api/auth/[...nextauth]';
import {useRouter} from 'next/router';
import {useEffect} from 'react';

export default function SignIn() {
  const router = useRouter();
  const {data: session} = useSession();

  useEffect(() => {
    // redirect to home if already logged in
    if (session?.user) {
      router.push('/');
    } else signIn('keycloak');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <p>Signing in ...</p>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {redirect: {destination: '/'}};
  }

  return {
    props: {},
  };
}
