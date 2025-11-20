import { authOptions } from "@catalog-frontend/utils";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
  // Get JWT
  const token = await getToken({ req });

  // Get the site base url
  const baseUrl = process.env.NEXTAUTH_URL ?? "";

  try {
    // We need to grab the session to get at the id token
    // PS: You can use the «getToken()» method here instead of «unstable_getServerSession».
    const session = await getServerSession(authOptions);
    if (!session) {
      // If the user isn't logged in, just redirect to root
      return NextResponse.redirect(baseUrl);
    }

    // Create the provider endsession url
    const endSessionURL = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout`;
    // And the redirect url
    // At this url (/logout) the local next-auth session will be removed
    const redirectURL = `${baseUrl}/auth/signout`;
    // Construct the query params and redirect the browser to
    // the provider auth server
    const endSessionParams = new URLSearchParams({
      // Pass the original id tok the to the provider
      id_token_hint: `${token?.id_token}`,
      // Pass the redirect url
      post_logout_redirect_uri: redirectURL,
    });
    const fullUrl = `${endSessionURL}?${endSessionParams.toString()}`;
    return NextResponse.redirect(fullUrl);
  } catch (error) {
    return NextResponse.redirect(baseUrl);
  }
};

export { handler as GET, handler as POST };
