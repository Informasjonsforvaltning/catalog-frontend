import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../auth-options";
import { validateOidcUserSession } from "../token";

export const isValidSessionAndToken = async (session: any) =>
  session &&
  session.accessTokenExpiresAt > Date.now() / 1000 &&
  (await validateOidcUserSession(session?.accessToken));

export const withValidSessionForApi = async (
  next: (session: any) => Promise<Response>,
) => {
  const session: any = await getServerSession(authOptions);

  const valid = await isValidSessionAndToken(session);
  if (!valid) {
    return new Response("Unauthorized", { status: 401 });
  }
  return await next(session);
};

export const getValidSession = async () => {
  const session = await getServerSession(authOptions);
  const valid = await isValidSessionAndToken(session);
  return valid ? session : null;
};

export const redirectToSignIn = (callbackUrl?: string): never => {
  return redirect(
    callbackUrl?.startsWith("/")
      ? `/auth/signin?callbackUrl=${callbackUrl}`
      : "/auth/signin",
  );
};
