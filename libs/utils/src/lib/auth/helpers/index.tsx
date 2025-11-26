import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../auth-options";
import { validateOidcUserSession } from "../token";

type SignInCallbackProps = {
  callbackUrl: string;
};

export const isValidSessionAndToken = async (session: Session) =>
  session &&
  session.accessTokenExpiresAt > Date.now() / 1000 &&
  (await validateOidcUserSession(session?.accessToken));

export const withValidSessionForApi = async (
  next: (session: Session) => Promise<Response>,
) => {
  const session = await getServerSession(authOptions);

  const valid = await isValidSessionAndToken(session);
  if (!valid) {
    return new Response("Unauthorized", { status: 401 });
  }
  return next(session);
};

export const getValidSession = async () => {
  const session = await getServerSession(authOptions);
  const valid = await isValidSessionAndToken(session);
  return valid ? session : undefined;
};

export const redirectToSignIn = (callback?: SignInCallbackProps) => {
  if (callback) {
    const { callbackUrl } = callback;
    if (callbackUrl.startsWith("/")) {
      return redirect(`/auth/signin?callbackUrl=${callbackUrl}`);
    }
  }
  return redirect("/auth/signin");
};
