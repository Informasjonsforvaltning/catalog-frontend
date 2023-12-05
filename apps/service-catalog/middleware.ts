import {
  hasOrganizationReadPermission,
  hasOrganizationWritePermission,
  validOrganizationNumber,
  validUUID,
} from '@catalog-frontend/utils';
import { NextResponse } from 'next/server';
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';
import { Service } from '@catalog-frontend/types';
import { handleGetPublicServiceById, handleGetServiceById } from '@catalog-frontend/data-access';

export const config = {
  matcher: '/catalogs/:path*',
};

export default withAuth(async function middleware(req: NextRequestWithAuth) {
  const validType = (type: string): boolean => {
    if (type === 'services' || type === 'public-services') {
      return true;
    }
    return false;
  };

  const accessToken = req.nextauth.token?.access_token;

  const pathname = req.nextUrl.pathname;
  const parts = pathname.split('/');
  const catalogId = validOrganizationNumber(parts[2]) ? parts[2] : '';
  const type = validType(parts[3]) ? parts[3] : undefined;
  const serviceId = validUUID(parts[4]) ? parts[4] : undefined;

  const writePermissionsRoutes = [
    `/catalogs/${catalogId}/public-services/${serviceId}/edit`,
    `/catalogs/${catalogId}/public-services/new`,
    `/catalogs/${catalogId}/services/${serviceId}/edit`,
    `/catalogs/${catalogId}/services/new`,
  ];

  // User do not have read permission in the catalog
  if (accessToken && !hasOrganizationReadPermission(accessToken, catalogId)) {
    return NextResponse.rewrite(new URL('/catalogs/no-access/', req.url));
  }

  // User do not have write permission in the catalog
  if (
    accessToken &&
    !hasOrganizationWritePermission(accessToken, catalogId) &&
    writePermissionsRoutes.includes(pathname)
  ) {
    return NextResponse.rewrite(new URL('/catalogs/no-access/', req.url));
  }

  // CatalogId or serviceId does not have correct format
  if (!(validOrganizationNumber(catalogId) && validUUID(serviceId))) {
    return NextResponse.rewrite(new URL('/not-found/', req.url));
  }

  // Public service does not exist
  const publicService: Service | null =
    type === 'public-services' &&
    accessToken &&
    serviceId &&
    (await handleGetPublicServiceById(catalogId, serviceId, accessToken).then((response) => {
      if (response.ok) return response.json();
    }));
  if (type === 'public-services' && !publicService && serviceId) {
    return NextResponse.rewrite(new URL('/not-found/', req.url));
  }

  // Service does not exist
  const service: Service | null =
    type === 'services' &&
    accessToken &&
    serviceId &&
    (await handleGetServiceById(catalogId, serviceId, accessToken).then((response) => {
      if (response.ok) return response.json();
    }));
  if (type === 'services' && !service && serviceId) {
    return NextResponse.rewrite(new URL('/not-found/', req.url));
  }
});
