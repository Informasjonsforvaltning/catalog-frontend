import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

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
    }),
  ],
  callbacks: {
    async session({session, token}: any) {
      session.user = {
        ...{
          id: session.user.id ?? null,
          name: session.user.name,
          email: session.user.email ?? null,
          image: session.user.image ?? null,
          idToken: token.idToken ?? null,
        },
      };
      session.account = token.account ?? null;
      return session;
    },
    async jwt({token, user, account}) {
      if (user) {
        token.idToken = user.idToken;
      }
      if (account) {
        token.account = account;
      }
      return token;
    },
  },
};

export function RouteGaurd({children}) {
  const {data: session, status} = useSession();
  const isUser = !!session?.user;

  useEffect(() => {
    if (typeof window !== 'undefined' && status === 'loading') return;
    if (!isUser) signIn('keycloak');
  }, [isUser, status]);

  if (isUser) {
    return children;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <div>Loading...</div>;
}

export const Auth = NextAuth(authOptions);
export default Auth;
