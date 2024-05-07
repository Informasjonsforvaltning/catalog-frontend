import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  callbacks: {
    authorized: ({ req, token }) => {
      if (!token || token.error === 'RefreshAccessTokenError') {
        return false;
      }
      return true;
    },
  },
});

export const config = {
  matcher: ['/((?!auth/signin|api|_next/static|_next/image|favicon.ico).*)'],
};
