import type {GetServerSidePropsContext} from 'next';
import {signIn} from 'next-auth/react';
import {getServerSession} from 'next-auth/next';
import {authOptions} from '../api/auth/[...nextauth]';

export default function SignIn() {
  void signIn('keycloak');
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
