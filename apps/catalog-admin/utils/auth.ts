import { hasOrganizationAdminPermission, validOrganizationNumber } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '../app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export const checkAdminPermissions = async (catalogId: string) => {
  const session = await getServerSession(authOptions);

  if (!validOrganizationNumber(catalogId)) {
    return { notFound: true };
  }

  if (!(session?.user && Date.now() < session?.accessTokenExpiresAt * 1000)) {
    redirect(`/auth/signin?callbackUrl=/catalogs/${catalogId}`);
  }

  const hasAdminPermission = session && hasOrganizationAdminPermission(session?.accessToken, catalogId);
  if (!hasAdminPermission) {
    redirect(`/catalogs/${catalogId}/no-access`);
  }
};
