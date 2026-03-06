import {
  authOptions,
  isValidSessionAndToken,
  getUsername,
  getResourceRoles,
} from "@catalog-frontend/utils";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

/**
 * Creates a token route handler that provides debug information and access token
 * Access token is only included in development mode for security
 */
export const createTokenRoute = () => {
  const handler = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    const isValid = await isValidSessionAndToken(session);

    // Return 401 Unauthorized if session is not valid
    if (!isValid || !session?.accessToken) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
          message: "No valid session or access token available",
          hasSession: !!session,
          hasAccessToken: !!session?.accessToken,
          isValid: false,
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Enhanced debugging information for valid sessions
    const debugInfo: any = {
      hasSession: !!session,
      hasAccessToken: !!session.accessToken,
      tokenLength: session.accessToken.length || 0,
      tokenPrefix: session.accessToken.substring(0, 20) + "..." || "N/A",
      expiresAt: session.accessTokenExpiresAt,
      isExpired: session.accessTokenExpiresAt
        ? session.accessTokenExpiresAt < Date.now() / 1000
        : true,
      currentTime: Math.floor(Date.now() / 1000),
      timeUntilExpiry: session.accessTokenExpiresAt
        ? session.accessTokenExpiresAt - Math.floor(Date.now() / 1000)
        : 0,
      hasError: !!session.error,
      error: session.error || null,
      user: session.user || null,
    };

    // Add token payload information (without sensitive data)
    if (session.accessToken) {
      try {
        const decoded = jwtDecode(session.accessToken) as any;
        debugInfo.tokenPayload = {
          iss: decoded.iss,
          aud: decoded.aud,
          exp: decoded.exp,
          iat: decoded.iat,
          sub: decoded.sub,
          user_name: decoded.user_name,
          name: decoded.name,
          email: decoded.email,
          authorities: decoded.authorities,
          // Add other non-sensitive fields as needed
        };
        debugInfo.username = getUsername(session.accessToken);
        debugInfo.resourceRoles = getResourceRoles(session.accessToken);
      } catch (error) {
        debugInfo.tokenDecodeError = "Failed to decode token";
      }
    }

    debugInfo.isValid = isValid;

    // Return debug info and access token only in development
    const allowTokenAccess = process.env.NODE_ENV === "development";

    const response = {
      ...debugInfo,
      // Include the actual access token for API calls (development only)
      accessToken: allowTokenAccess ? session.accessToken : undefined,
    };

    return new Response(JSON.stringify(response, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return { handler };
};
