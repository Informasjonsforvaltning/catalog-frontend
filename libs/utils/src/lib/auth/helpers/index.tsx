import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../auth-options';
import { validateOidcUserSession } from '../token';

type SignInCallbackProps = {
  callbackUrl: string;
  callbackParams?: any;
};

export const isValidSessionAndToken = async (session: any) =>
  session && session.accessTokenExpiresAt > Date.now() / 1000 && (await validateOidcUserSession(session?.accessToken));

export const withValidSessionForApi = async (next: (session: any) => Promise<Response>) => {
  const session: any = await getServerSession(authOptions);

  const valid = await isValidSessionAndToken(session);
  if (!valid) {
    return new Response('Unauthorized', { status: 401 });
  }
  return await next(session);
};

export const getValidSession = async () => {
  const session: any = await getServerSession(authOptions);
  const valid = await isValidSessionAndToken(session);
  return valid ? session : undefined;
};

export const redirectToSignIn = (callback: SignInCallbackProps | undefined = undefined) => {
  if (callback) {
    const { callbackUrl, callbackParams } = callback;
    if(callbackUrl.startsWith('/')) {
      const callbackUrlWithParams = `${callbackUrl}${callbackParams ? '?' + new URLSearchParams(callbackParams) : ''}`;
      return redirect(`/auth/signin?callbackUrl=${callbackUrlWithParams}`);
    }
  }
  return redirect('/auth/signin');
};
