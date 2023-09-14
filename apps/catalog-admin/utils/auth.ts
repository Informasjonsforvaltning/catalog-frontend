import { hasOrganizationAdminPermission, validOrganizationNumber } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '../pages/api/auth/[...nextauth]';

export const serverSidePropsWithAdminPermissions = async ({ req, res, params }, props?: () => Promise<any>) => {
  const { catalogId } = params;

  if (!validOrganizationNumber(catalogId)) {
    return { notFound: true };
  }

  const session = await getServerSession(req, res, authOptions);
  if (!(session?.user && Date.now() < session?.accessTokenExpiresAt * 1000)) {
    return {
      redirect: {
        permanent: false,
        destination: `/auth/signin?callbackUrl=/catalogs/${catalogId}`,
      },
    };
  }

  const hasAdminPermission = session && hasOrganizationAdminPermission(session?.accessToken, catalogId);
  if (!hasAdminPermission) {
    return {
      redirect: {
        permanent: false,
        destination: `/catalogs/${catalogId}/no-access`,
      },
    };
  }

  return {
    props: props?.() ?? {},
  };
};
