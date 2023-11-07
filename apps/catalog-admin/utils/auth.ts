import { authOptions, hasOrganizationAdminPermission, validOrganizationNumber } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { RedirectType, redirect } from 'next/navigation';

export const checkAdminPermissions = async (catalogId: string) => {
  const session = await getServerSession(authOptions);

  if (!validOrganizationNumber(catalogId)) {
    redirect(`/not-found`, RedirectType.replace);
  }

  if (!(session?.user && Date.now() < session?.accessTokenExpiresAt * 1000)) {
    redirect(`/auth/signin?callbackUrl=/catalogs/${catalogId}`);
  }

  const hasAdminPermission = session && hasOrganizationAdminPermission(session?.accessToken, catalogId);
  if (!hasAdminPermission) {
    redirect(`/catalogs/${catalogId}/no-access`);
  }
};
