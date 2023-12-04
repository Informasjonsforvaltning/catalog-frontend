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

export const checkAuthenticated = async ({ session, callbackUrl }: CheckAuthenticatedProps) => {
  if (!(session?.user && Date.now() < (session?.accessTokenExpiresAt ?? 0) * 1000)) {
    redirect(`/auth/signin?callbackUrl=${callbackUrl}`);
  }
};

export const checkAdminPermissions = async ({ session, catalogId, path }: CheckAdminPermissionsProps) => {
  if (!validOrganizationNumber(catalogId)) {
    redirect(`/not-found`, RedirectType.replace);
  }

  checkAuthenticated({ session, callbackUrl: `/catalogs/${catalogId}${path ?? ''}` });

  const hasAdminPermission = session?.accessToken && hasOrganizationAdminPermission(session.accessToken, catalogId);
  if (!hasAdminPermission) {
    redirect(`/catalogs/${catalogId}/no-access`);
  }
};
