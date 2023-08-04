import { hasOrganizationAdminPermission } from '@catalog-frontend/utils';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

function getCatalogId(url) {
  const matches = url.match(/\/catalogs\/(\d+)/);

  if (matches && matches.length > 1) {
    const catalogId = matches[1];
    return catalogId;
  } else {
    return null;
  }
}

export async function middleware(req) {
  const catalogId = getCatalogId(req.nextUrl.pathname);

  if (catalogId) {
    const secret = process.env.NEXT_AUTH_SECRET;
    const token = await getToken({
      req: req,
      secret: secret,
    });
    const hasPermission = token && hasOrganizationAdminPermission(JSON.stringify(token), catalogId);

    if (!hasPermission) {
      return NextResponse.rewrite(new URL(`/catalogs/${catalogId}/no-access`, req.url));
    }
  }
}

export const config = {
  matcher: '/catalogs/:path*',
};
