import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../auth-options";
import { validateOidcUserSession } from "../token";

export type ValidSession = Session & { accessToken: string };

export const isValidSessionAndToken = async (
  session: Session | null,
): Promise<boolean> => {
  if (!session?.accessToken || !session.accessTokenExpiresAt) {
    return false;
  }
  const validToken = session.accessTokenExpiresAt > Date.now() / 1000;
  return validToken && validateOidcUserSession(session.accessToken);
};

export const withValidSessionForApi = async (
  next: (session: ValidSession) => Promise<Response>,
) => {
  const session = await getServerSession(authOptions);
  const valid = await isValidSessionAndToken(session);
  if (!valid) {
    return new Response("Unauthorized", { status: 401 });
  }
  return next(session as ValidSession);
};

export const getValidSession = async (): Promise<ValidSession | null> => {
  const session = await getServerSession(authOptions);
  const valid = await isValidSessionAndToken(session);
  return valid ? (session as ValidSession) : null;
};

export const redirectToSignIn = (callbackUrl?: string): never => {
  return redirect(
    callbackUrl?.startsWith("/")
      ? `/auth/signin?callbackUrl=${callbackUrl}`
      : "/auth/signin",
  );
};
