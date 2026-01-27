import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../auth-options";
import { validateOidcUserSession } from "../token";

export const isValidSessionAndToken = async (session: any) => {
  console.log("[AUTH DEBUG] isValidSessionAndToken: called");

  if (!session || !session?.accessToken) {
    console.log("[AUTH DEBUG] isValidSessionAndToken: no session");
    return false;
  }

  console.log("[AUTH DEBUG] isValidSessionAndToken: session exists", {
    hasAccessToken: !!session.accessToken,
    hasError: !!session.error,
    error: session.error,
    accessTokenExpiresAt: session.accessTokenExpiresAt,
  });

  // Check for refresh token error flag
  if (session.error === "RefreshAccessTokenError") {
    console.log(
      "[AUTH DEBUG] isValidSessionAndToken: RefreshAccessTokenError flag set",
    );
    return false;
  }

  const now = Date.now() / 1000;
  const expiresAt = session.accessTokenExpiresAt;

  if (expiresAt <= now) {
    console.log(
      "[AUTH DEBUG] isValidSessionAndToken: token expired",
      "expiresAt:",
      expiresAt,
      "now:",
      now,
    );
    return false;
  }

  console.log("[AUTH DEBUG] isValidSessionAndToken: validating OIDC session");
  const oidcValid = await validateOidcUserSession(session?.accessToken);
  if (!oidcValid) {
    console.log("[AUTH DEBUG] isValidSessionAndToken: OIDC validation failed");
    return false;
  }

  console.log("[AUTH DEBUG] isValidSessionAndToken: valid session", {
    expiresIn: Math.round(expiresAt - now),
  });
  return true;
};

export const withValidSessionForApi = async (
  next: (session: any) => Promise<Response>,
) => {
  console.log("[AUTH DEBUG] withValidSessionForApi: called");
  const session: any = await getServerSession(authOptions);

  // Check if token was invalidated by a new login (race condition during login)
  // Return 503 instead of 401 to avoid triggering auth modal - client will retry
  if (session?.tokenInvalidatedByNewLogin) {
    console.log(
      "[AUTH DEBUG] withValidSessionForApi: token invalidated by new login, returning 503",
    );
    return new Response("Session refreshing", {
      status: 503,
      headers: { "Retry-After": "1" },
    });
  }

  const valid = await isValidSessionAndToken(session);
  if (!valid) {
    console.log("[AUTH DEBUG] withValidSessionForApi: returning 401");
    return new Response("Unauthorized", { status: 401 });
  }
  console.log(
    "[AUTH DEBUG] withValidSessionForApi: proceeding with valid session",
  );
  return await next(session);
};

export const getValidSession = async () => {
  console.log("[AUTH DEBUG] getValidSession: called");
  const session = await getServerSession(authOptions);

  console.log("[AUTH DEBUG] getValidSession: got session from server", {
    hasSession: !!session,
    hasError: !!session?.error,
  });

  // Early return if session has error flag
  if (session?.error) {
    console.log(
      "[AUTH DEBUG] getValidSession: session has error:",
      session.error,
    );
    return null;
  }

  // Early return if token was invalidated by new login (race condition)
  // The next request with new cookie will succeed
  if (session?.tokenInvalidatedByNewLogin) {
    console.log(
      "[AUTH DEBUG] getValidSession: token invalidated by new login, waiting for new session",
    );
    return null;
  }

  const valid = await isValidSessionAndToken(session);
  console.log("[AUTH DEBUG] getValidSession: validation result:", valid);
  return valid ? session : null;
};

export const redirectToSignIn = (callbackUrl?: string): never => {
  console.log(
    "[AUTH DEBUG] redirectToSignIn: called with callbackUrl:",
    callbackUrl,
  );
  return redirect(
    callbackUrl?.startsWith("/")
      ? `/auth/signin?callbackUrl=${callbackUrl}`
      : "/auth/signin",
  );
};
