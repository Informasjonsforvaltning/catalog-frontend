import type {GetServerSidePropsContext} from 'next';
import {signIn} from 'next-auth/react';
import {getServerSession} from 'next-auth/next';
import {authOptions} from '../api/auth/[...nextauth]';
import { useEffect } from 'react';

export default function SignIn() {
  	useEffect(() => {
  		signIn('keycloak');
  	}, []);
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
