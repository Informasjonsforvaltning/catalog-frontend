import NextAuth, { getServerSession } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { NextApiRequest, NextApiResponse } from "next/types";

export { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
export type { Session } from "next-auth";

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID ?? "",
      clientSecret: process.env.KEYCLOAK_SECRET ?? "",
      issuer: process.env.KEYCLOAK_ISSUER,
      idToken: true,
			profile(profile, tokens) {
				return {
					id: profile.sub,
					name: profile.name,
					email: profile.email,
					// Append the id token to the profile
					idToken: tokens.id_token,
				};
			},
    }),
  ],
  callbacks: {
		async session({ session, token }: any) {
			session.user = {...{
				// append the id token to the next-auth session
				idToken: token.idToken,
			}, ...session.user };
			return session;
		},
		async jwt({ token, user}: any) {
			if (user) {
				// append the id token to the next-auth token
				token.idToken = user.idToken;
			}
			return token;
		},
	},
};

export async function federatedSignOut(req: NextApiRequest, res: NextApiResponse) {
	// Get the site base url
	const baseUrl = process.env.NEXTAUTH_URL ?? '';

	try {
		// We need to grab the session to get at the id token
		// PS: You can use the «getToken()» method here instead of «unstable_getServerSession».
		const session = await getServerSession(req, res, authOptions);
		if (!session) {
			// If the user isn't logged in, just redirect to root
			return res.redirect(baseUrl);
		}

		// Create the provider endsession url
		const endSessionURL = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout`;
		// And the redirect url
		// At this url (/logout) the local next-auth session will be removed
		const redirectURL = `${baseUrl}/logout`;
		// Construct the query params and redirect the browser to
		// the provider auth server
		const endSessionParams = new URLSearchParams({
		  // Pass the original id tok the to the provider
			id_token_hint: (session.user as any).idToken,
			// Pass the redirect url
			post_logout_redirect_uri: redirectURL,
		});
		const fullUrl = `${endSessionURL}?${endSessionParams.toString()}`;
		return res.redirect(fullUrl);
	} catch (error) {
		res.redirect(baseUrl);
	}
}

export const Auth = NextAuth(authOptions);
export default Auth;
