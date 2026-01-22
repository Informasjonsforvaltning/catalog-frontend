import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../auth-options";
import { validateOidcUserSession } from "../token";

export const isValidSessionAndToken = async (session: any) => {
  // Check if session exists and has required properties
  if (!session || !session.accessToken) {
    return false;
  }

  // Check if there's a refresh error (refresh token expired - 30 min idle timeout)
  // This is the primary condition for showing "session expired" modal
  if (session.error === "RefreshAccessTokenError") {
    return false;
  }

  const currentTime = Date.now() / 1000;

  // If access token is expired, try to refresh it
  // getServerSession should have already refreshed it via JWT callback, but ensure it happened
  if (session.accessTokenExpiresAt <= currentTime) {
    // Get a fresh session to ensure token refresh via JWT callback
    const freshSession: any = await getServerSession(authOptions);

    // If refresh failed (refresh token expired), this is a true session expiry
    if (
      !freshSession ||
      !freshSession.accessToken ||
      freshSession.error === "RefreshAccessTokenError"
    ) {
      return false;
    }

    // If still expired after refresh attempt, something is wrong
    if (freshSession.accessTokenExpiresAt <= currentTime) {
      return false;
    }

    // Refresh succeeded - Keycloak just validated the session by giving us a new access token
    // No need to validate again, the session is definitely valid
    return true;
  }

  // Token wasn't expired, so refresh didn't happen
  // Validate with Keycloak to check if session was terminated server-side
  const isValidWithKeycloak = await validateOidcUserSession(
    session.accessToken,
  );

  // If validation succeeds, session is valid
  if (isValidWithKeycloak) {
    return true;
  }

  // If validation fails, retry once to handle transient network/Keycloak issues
  await new Promise((resolve) => setTimeout(resolve, 100));
  const retryValidation = await validateOidcUserSession(session.accessToken);

  // Return the retry result - if both attempts fail, session might be terminated server-side
  return retryValidation;
};

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
