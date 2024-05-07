import { hasOrganizationAdminPermission, validOrganizationNumber } from '@catalog-frontend/utils';
import { Session } from 'next-auth';
import { RedirectType, redirect } from 'next/navigation';

interface CheckAdminPermissionsProps {
  session: Session | null | undefined;
  catalogId: string;
  path?: string;
}

export const checkAdminPermissions = ({ session, catalogId, path }: CheckAdminPermissionsProps) => {
  if (!validOrganizationNumber(catalogId)) {
    return redirect(`/notfound`, RedirectType.replace);
  }

  const hasAdminPermission = session?.accessToken && hasOrganizationAdminPermission(session.accessToken, catalogId);
  if (!hasAdminPermission) {
    return redirect(`/catalogs/${catalogId}/no-access`);
  }

  return true;
};
