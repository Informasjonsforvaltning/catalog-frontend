import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../auth-options';

type GetValidSessionProps = {
  signInPath: string;
  callbackUrl: string;
  callbackParams?: any;
};

export const withValidSessionForApi = async (next: (session: any) => Promise<Response>) => {
  const session: any = await getServerSession(authOptions);
  if (!session || session?.accessTokenExpiresAt < Date.now() / 1000) {
    return new Response('Unauthorized', { status: 401 });
  }
  return await next(session);
};

export const getValidSessionForAction = async () => {
  const session: any = await getServerSession(authOptions);
  if (!session || session?.accessTokenExpiresAt < Date.now() / 1000) {
    return new Error('Unauthorized');
  }
  return session;
};

export const getValidSession = async ({ signInPath, callbackUrl, callbackParams }: GetValidSessionProps) => {
  const session: any = await getServerSession(authOptions);
  if (!session || session?.accessTokenExpiresAt < Date.now() / 1000) {
    const callbackUrlWithParams = `${callbackUrl}${callbackParams ? '?' + new URLSearchParams(callbackParams) : ''}`;
    redirect(`${signInPath}?callbackUrl=${callbackUrlWithParams}`);
  }
  return session;
};
