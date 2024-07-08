import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../auth-options';
import { validateOidcUserSession } from '../token';

type GetValidSessionProps = {
  signInPath: string;
  callbackUrl: string;
  callbackParams?: any;
};

const isValidSessionAndToken = async (session: any) =>
  session && session.accessTokenExpiresAt > Date.now() / 1000 && (await validateOidcUserSession(session?.accessToken));

export const withValidSessionForApi = async (next: (session: any) => Promise<Response>) => {
  const session: any = await getServerSession(authOptions);
  const valid = await isValidSessionAndToken(session);
  if (!valid) {
    return new Response('Unauthorized', { status: 401 });
  }
  return await next(session);
};

export const getValidSessionForAction = async () => {
  const session: any = await getServerSession(authOptions);
  const valid = await isValidSessionAndToken(session);
  if (!valid) {
    redirect('/auth/signin');
  }
  return session;
};

export const getValidSession = async ({ signInPath, callbackUrl, callbackParams }: GetValidSessionProps) => {
  const session: any = await getServerSession(authOptions);
  const valid = await isValidSessionAndToken(session);
  if (!valid) {
    const callbackUrlWithParams = `${callbackUrl}${callbackParams ? '?' + new URLSearchParams(callbackParams) : ''}`;
    redirect(`${signInPath}?callbackUrl=${callbackUrlWithParams}`);
  }
  return session;
};
