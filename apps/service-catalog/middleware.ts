import { hasOrganizationReadPermission, hasOrganizationWritePermission } from '../../libs/utils/src/lib/auth/token';
import { validUUID } from '../../libs/utils/src/lib/validation/uuid';
import { validOrganizationNumber } from '../../libs/utils/src/lib/validation/organization-number';

import { NextResponse } from 'next/server';
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';

export const config = {
  matcher: '/catalogs/:path*',
};

export default withAuth(async function middleware(req: NextRequestWithAuth) {
  const accessToken = req.nextauth.token?.access_token;

  const pathname = req.nextUrl.pathname;
  const parts = pathname.split('/');
  const catalogId = validOrganizationNumber(parts[2]) ? parts[2] : undefined;
  const serviceId = validUUID(parts[4]) ? parts[4] : undefined;

  const writePermissionsRoutes = [
    `/catalogs/${catalogId}/public-services/${serviceId}/edit`,
    `/catalogs/${catalogId}/public-services/new`,
    `/catalogs/${catalogId}/services/${serviceId}/edit`,
    `/catalogs/${catalogId}/services/new`,
  ];

  if (catalogId && !validOrganizationNumber(catalogId)) {
    return NextResponse.rewrite(new URL('/not-found', req.url));
  }

  if (serviceId && !validUUID(serviceId)) {
    return NextResponse.rewrite(new URL('/not-found', req.url));
  }

  if (accessToken && catalogId && !hasOrganizationReadPermission(accessToken, catalogId)) {
    return NextResponse.rewrite(new URL(`/catalogs/${catalogId}/no-access`, req.url));
  }

  if (
    accessToken &&
    catalogId &&
    !hasOrganizationWritePermission(accessToken, catalogId) &&
    writePermissionsRoutes.includes(pathname)
  ) {
    return NextResponse.rewrite(new URL(`/catalogs/${catalogId}/no-access`, req.url));
  }
});
