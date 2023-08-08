import jwtDecode from 'jwt-decode';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export interface ResourceRole {
  resource: string;
  resourceId: string;
  role: string;
}

export interface OrganizationRole {
  orgNr: string;
  role: string;
}

function getCatalogId(url: string): string | null {
  const matches = url.match(/\/catalogs\/(\d+)/);

  if (matches && matches.length > 1) {
    const catalogId = matches[1];
    return catalogId;
  } else {
    return null;
  }
}

const getAuthorities = (token: string): string => {
  const tokenDecoded = jwtDecode(token);
  return (tokenDecoded && (tokenDecoded as any).authorities) || '';
};

const getResourceRoles = (token: string): ResourceRole[] =>
  getAuthorities(token)
    .split(',')
    .map((authorityDescriptor) => authorityDescriptor.split(':'))
    .map(([resource, resourceId, role]) => ({ resource, resourceId, role }));

export const hasResourceRole = (token: string, { resource, resourceId, role }: ResourceRole): boolean =>
  getResourceRoles(token).some((r) => r.resource === resource && r.resourceId === resourceId && r.role === role);

export const hasOrganizationRole = (token: string, { orgNr, role }: OrganizationRole): boolean =>
  hasResourceRole(token, { resource: 'organization', resourceId: orgNr, role });

export const hasOrganizationAdminPermission = (token: string, orgNr: string): boolean =>
  hasOrganizationRole(token, { orgNr, role: 'admin' });

export async function middleware(req: any) {
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
