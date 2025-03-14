import { jwtDecode } from 'jwt-decode';

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

type Token = string | null | undefined;

export const getUsername = (token: Token): string => {
  if (!token) {
    return '';
  }
  const tokenDecoded = jwtDecode(token);
  return ((tokenDecoded && (tokenDecoded as any).user_name) as string) || '';
};

const getAuthorities = (token: Token): string => {
  if (!token) {
    return '';
  }
  const tokenDecoded = jwtDecode(token);
  return ((tokenDecoded && (tokenDecoded as any).authorities) as string) || '';
};

export const getResourceRoles = (token: Token): ResourceRole[] =>
  getAuthorities(token)
    .split(',')
    .map((authorityDescriptor) => authorityDescriptor.split(':'))
    .map(([resource, resourceId, role]) => ({ resource, resourceId, role }));

export const hasResourceRole = (token: Token, { resource, resourceId, role }: ResourceRole): boolean =>
  !!getResourceRoles(token).find((r) => r.resource === resource && r.resourceId === resourceId && r.role === role);

export const hasOrganizationRole = (token: Token, { orgNr, role }: OrganizationRole): boolean =>
  hasResourceRole(token, { resource: 'organization', resourceId: orgNr, role });

export const hasOrganizationReadPermission = (token: Token, orgNr: string): boolean => {
  const roles = getResourceRoles(token);
  return roles?.find(({ resource, resourceId }) => resource === 'organization' && resourceId === orgNr) !== undefined;
};

export const hasOrganizationWritePermission = (token: Token, orgNr: string): boolean =>
  hasOrganizationRole(token, { orgNr, role: 'admin' }) || hasOrganizationRole(token, { orgNr, role: 'write' });

export const hasOrganizationAdminPermission = (token: Token, orgNr: string) =>
  hasOrganizationRole(token, { orgNr, role: 'admin' });

export const hasSystemAdminPermission = (token: Token) =>
  hasResourceRole(token, {
    resource: 'system',
    resourceId: 'root',
    role: 'admin',
  });

export const isReadOnlyUser = (token: Token, orgNr: string): boolean =>
  hasOrganizationReadPermission(token, orgNr) &&
  !(
    hasOrganizationWritePermission(token, orgNr) ||
    hasOrganizationAdminPermission(token, orgNr) ||
    hasSystemAdminPermission(token)
  );

export const validateOidcUserSession = async (token: Token): Promise<boolean> => {
  try {
    const response = await fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/userinfo?scope=openid`, {
      headers: { Authorization: `Bearer ${token}` },
      method: 'GET',
    });

    return response.ok;
  } catch (e) {
    console.log('validateOidcUserSession failed', e);
  }
  return false;
};

export const hasNonSystemAccessForOrg = (token: Token, orgId: string): boolean => {
  return (
    hasOrganizationAdminPermission(token, orgId) ||
    hasOrganizationWritePermission(token, orgId) ||
    hasOrganizationReadPermission(token, orgId)
  );
};

export const hasAcceptedTermsForOrg = (token: Token, orgId: string): boolean => {
  if (hasSystemAdminPermission(token)) {
    return true; // not relevant for sysAdmin
  }

  if (!token) {
    return false;
  }
  const tokenDecoded = jwtDecode(token);
  if (!tokenDecoded) {
    return false;
  }

  const fdkTerms: string = (tokenDecoded as any).fdk_terms;
  const orgTerms: string = (tokenDecoded as any).org_terms;
  if (!fdkTerms || !orgTerms) {
    return false;
  }

  return orgTerms.includes(`${orgId}:${fdkTerms}`);
};

export const hasAccessToMoreThanOneOrg = (token: Token): boolean => {
  return new Set(getResourceRoles(token).map(({ resourceId }) => resourceId)).size > 1;
};
