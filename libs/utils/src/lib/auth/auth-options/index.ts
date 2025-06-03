import { AuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

const isAfterNow = (date: number) => {
  return Date.now() < date * 1000;
};

const refreshToken = async (token: any) => {
  const maxRetries = 3;
  let attempt = 0;
  let lastError;

  while (attempt < maxRetries) {
    try {
      const response = await fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: `${process.env.KEYCLOAK_ID}`,
          client_secret: `${process.env.KEYCLOAK_SECRET}`,
          grant_type: 'refresh_token',
          refresh_token: `${token.refresh_token}`,
        }),
        method: 'POST',
      });

      const tokens = await response.json();

      if (!response.ok) throw tokens;

      return {
        ...token,
        access_token: tokens.access_token,
        expires_at: Math.floor(Date.now() / 1000 + Number(tokens.expires_in)),
        refresh_token: tokens.refresh_token ?? token.refresh_token,
      };
    } catch (error) {
      lastError = error;
      console.error(`Failed to refresh access token (attempt ${attempt + 1}):`, error);
      attempt++;
      if (attempt < maxRetries) {
        // Optional: add a short delay before retrying
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }

  // The error property will be used client-side to handle the refresh token error
  return { ...token, error: 'RefreshAccessTokenError' as const, refreshError: lastError };
};

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID ?? '',
      clientSecret: process.env.KEYCLOAK_SECRET ?? '',
      issuer: process.env.KEYCLOAK_ISSUER,
      idToken: true,
      profile(profile) {
        return {
          id: profile.user_name,
          name: profile.name,
          email: profile.email ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      session.user = {
        id: token.id ?? null,
        name: token.name,
        email: token.email ?? null,
        image: null,
      };

      session.accessToken = token.access_token;
      session.accessTokenExpiresAt = token.expires_at;
      if (token.error) {
        session.error = token.error;
      }

      return session;
    },
    async jwt({ token, user, account, trigger }) {
      if (trigger === 'update') {
        return refreshToken(token);
      }

      if (account) {
        // Save the access token and refresh token in the JWT on the initial login
        return {
          ...user,
          access_token: account.access_token,
          expires_at: Math.floor(Date.now() / 1000 + Number(account.expires_in)),
          refresh_token: account.refresh_token,
          id_token: account.id_token,
        };
      } else if (isAfterNow(Number(token.expires_at))) {
        // If the access token has not expired yet, return it
        return token;
      } else {
        return refreshToken(token);
      }
    },
  },
};
