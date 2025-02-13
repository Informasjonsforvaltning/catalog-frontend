import { withAuth } from 'next-auth/middleware';

export default withAuth({});

export const config = {
  matcher: ['/((?!auth/signin|api|_next/static|_next/image|favicon.ico).*)'],
};
