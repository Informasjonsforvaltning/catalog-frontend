import { withAuth } from 'next-auth/middleware';

export const config = {
  matcher: '/catalogs/:path*',
};

export default withAuth({});
