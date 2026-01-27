import { AuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

const isAfterNow = (date: number) => {
  return Date.now() < date * 1000;
};

const refreshToken = async (token: any) => {
  console.log("[AUTH] refreshToken: called");
  const maxRetries = 3;
  let attempt = 0;
  let lastError;

  while (attempt < maxRetries) {
    try {
      const response = await fetch(
        `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: `${process.env.KEYCLOAK_ID}`,
            client_secret: `${process.env.KEYCLOAK_SECRET}`,
            grant_type: "refresh_token",
            refresh_token: `${token.refresh_token}`,
          }),
          method: "POST",
        },
      );

      const tokens = await response.json();

      if (!response.ok) throw tokens;

      const newExpiresAt = Math.floor(
        Date.now() / 1000 + Number(tokens.expires_in),
      );
      console.log("[AUTH] refreshToken: success", { newExpiresAt });

      return {
        ...token,
        access_token: tokens.access_token,
        expires_at: newExpiresAt,
        refresh_token: tokens.refresh_token ?? token.refresh_token,
      };
    } catch (error) {
      lastError = error;
      console.error(
        `[AUTH] refreshToken: failed (attempt ${attempt + 1}):`,
        error,
      );
      attempt++;
      if (attempt < maxRetries) {
        // Optional: add a short delay before retrying
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }

  // The error property will be used client-side to handle the refresh token error
  return {
    ...token,
    error: "RefreshAccessTokenError" as const,
    refreshError: lastError,
  };
};

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID ?? "",
      clientSecret: process.env.KEYCLOAK_SECRET ?? "",
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
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/signin",
    verifyRequest: "/auth/signin",
    newUser: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }: any) {
      console.log("[AUTH] session callback: called");
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

      console.log("[AUTH] session callback: result", {
        userId: session.user?.id,
        hasAccessToken: !!session.accessToken,
        expiresAt: session.accessTokenExpiresAt,
        hasError: !!session.error,
      });

      return session;
    },
    async jwt({ token, user, account, trigger }) {
      const expiresIn = token.expires_at
        ? Number(token.expires_at) - Math.floor(Date.now() / 1000)
        : null;
      console.log("[AUTH] jwt callback: called", {
        trigger,
        hasAccount: !!account,
        hasUser: !!user,
        expiresAt: token.expires_at,
        expiresIn,
      });

      // 1) NEW LOGIN: if we have an account, always store those tokens
      if (account) {
        console.log("[AUTH] jwt callback: initial login, saving tokens");
        return {
          ...token,
          ...user,
          access_token: account.access_token,
          expires_at:
            (account as any).expires_at ??
            Math.floor(Date.now() / 1000 + Number(account.expires_in)),
          refresh_token: account.refresh_token ?? token.refresh_token,
          id_token: account.id_token,
          error: undefined,
          refreshError: undefined,
        };
      }

      // 2) Manual update trigger: refresh
      if (trigger === "update") {
        console.log("[AUTH] jwt callback: update trigger, refreshing token");
        return refreshToken(token);
      }

      // 3) Token still valid
      if (token.expires_at && Date.now() < Number(token.expires_at) * 1000) {
        console.log("[AUTH] jwt callback: token valid, returning as-is");
        return token;
      }

      // 4) Token expired
      console.log("[AUTH] jwt callback: token expired, refreshing");
      return refreshToken(token);
    },
  },
};
