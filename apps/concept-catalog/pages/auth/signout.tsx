import {GetServerSidePropsContext} from 'next';
import {authOptions, signOut} from '../api/auth/[...nextauth]';
import {getServerSession} from 'next-auth';

export default function SignOut() {
  void signOut();
}

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const baseUrl = process.env.NEXTAUTH_URL ?? '';
  const session = await getServerSession(req, res, authOptions);
  const endSessionURL = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout`;
  const redirectURL = `${baseUrl}/api/auth/signout`;
  const endSessionParams = new URLSearchParams({
    id_token_hint: (session?.user as any)?.idToken,
    post_logout_redirect_uri: redirectURL,
  });
  const fullUrl = `${endSessionURL}?${endSessionParams.toString()}`;

  await fetch(fullUrl);

  return {props: {}};
}
