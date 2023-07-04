import jwtDecode from 'jwt-decode';

export interface ResourceRole {
  resource: string;
  resourceId: string;
  role: string;
}

export interface OrganizationRole {
  orgNr: string;
  role: string;
}

export interface AuthConfiguration {
  oidcIssuer: string;
  clientId: string;
  redirectUri: string;
  logoutRedirectUri: string;
  silentCheckSsoRedirectUri?: string;
}

export const getUsername = (token: string): string => {
  const tokenDecoded = jwtDecode(token);
  return ((tokenDecoded && (tokenDecoded as any).user_name) as string) || '';
};

const getAuthorities = (token: string): string => {
  const tokenDecoded = jwtDecode(token);
  return ((tokenDecoded && (tokenDecoded as any).authorities) as string) || '';
};

const getResourceRoles = (token: string): ResourceRole[] =>
  getAuthorities(token)
    .split(',')
    .map((authorityDescriptor) => authorityDescriptor.split(':'))
    .map(([resource, resourceId, role]) => ({ resource, resourceId, role }));

export const hasResourceRole = (token: string, { resource, resourceId, role }: ResourceRole): boolean =>
  !!getResourceRoles(token).find((r) => r.resource === resource && r.resourceId === resourceId && r.role === role);

export const hasOrganizationRole = (token: string, { orgNr, role }: OrganizationRole): boolean =>
  hasResourceRole(token, { resource: 'organization', resourceId: orgNr, role });

export const hasOrganizationReadPermission = (token: string, orgNr: string): boolean => {
  const roles = getResourceRoles(token);
  return roles?.find(({ resource, resourceId }) => resource === 'organization' && resourceId === orgNr) !== undefined;
};

export const hasOrganizationWritePermission = (token: string, orgNr: string): boolean =>
  hasOrganizationRole(token, { orgNr, role: 'admin' }) || hasOrganizationRole(token, { orgNr, role: 'write' });

export const hasOrganizationAdminPermission = (token: string, orgNr: string) =>
  hasOrganizationRole(token, { orgNr, role: 'admin' });

export const hasSystemAdminPermission = (token: string) =>
  hasResourceRole(token, {
    resource: 'system',
    resourceId: 'root',
    role: 'admin',
  });

export const isReadOnlyUser = (token: string, orgNr: string): boolean =>
  hasOrganizationReadPermission(token, orgNr) &&
  !(
    hasOrganizationWritePermission(token, orgNr) ||
    hasOrganizationAdminPermission(token, orgNr) ||
    hasSystemAdminPermission(token)
  );
