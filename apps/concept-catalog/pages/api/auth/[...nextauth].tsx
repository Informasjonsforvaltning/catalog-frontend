import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import {signIn, useSession} from 'next-auth/react';
import {useEffect} from 'react';

export {SessionProvider, useSession, signIn, signOut} from 'next-auth/react';
export type {Session} from 'next-auth';

export const authOptions = {
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID ?? '',
      clientSecret: process.env.KEYCLOAK_SECRET ?? '',
      issuer: process.env.KEYCLOAK_ISSUER,
      idToken: true,
      profile(profile, tokens) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email ?? null,
          image: profile.email ?? null,
          // Append the id token to the profile
          idToken: tokens.id_token,
        };
      },
    }),
  ],
  callbacks: {
    async session({session, token}: any) {
      session.user = {
        ...{
          // append the id token to the next-auth session
          idToken: token.idToken ?? null,
        },
        ...{
          id: session.user.id ?? null,
          name: session.user.name,
          email: session.user.email ?? null,
          image: session.user.image ?? null,
        },
      };
      return session;
    },
    async jwt({token, user}: any) {
      if (user) {
        // append the id token to the next-auth token
        token.idToken = user.idToken;
      }
      return token;
    },
  },
};

export const Auth = NextAuth(authOptions);
export default Auth;
