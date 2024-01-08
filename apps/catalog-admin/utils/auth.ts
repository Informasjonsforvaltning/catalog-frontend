import { hasOrganizationAdminPermission, validOrganizationNumber } from '@catalog-frontend/utils';
import { Session } from 'next-auth';
import { RedirectType, redirect } from 'next/navigation';

interface CheckAuthenticatedProps {
  session: Session | null | undefined;
  callbackUrl: string;
}

interface CheckAdminPermissionsProps {
  session: Session | null | undefined;
  catalogId: string;
  path?: string;
}

export const checkAuthenticated = ({ session, callbackUrl }: CheckAuthenticatedProps) => {
  if (!(session?.user && Date.now() < (session?.accessTokenExpiresAt ?? 0) * 1000)) {
    return redirect(`/auth/signin?callbackUrl=${callbackUrl}`);
  }

  return true;
};

export const checkAdminPermissions = ({ session, catalogId, path }: CheckAdminPermissionsProps) => {
  if (!validOrganizationNumber(catalogId)) {
    return redirect(`/notfound`, RedirectType.replace);
  }

  if (checkAuthenticated({ session, callbackUrl: `/catalogs/${catalogId}${path ?? ''}` })) {
    const hasAdminPermission = session?.accessToken && hasOrganizationAdminPermission(session.accessToken, catalogId);
    if (!hasAdminPermission) {
      return redirect(`/catalogs/${catalogId}/no-access`);
    }
  }

  return true;
};
