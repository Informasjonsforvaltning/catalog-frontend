import { hasOrganizationWritePermission, validOrganizationNumber } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

export const NewPage = () => {
  return <></>;
};

export async function getServerSideProps({ req, res, params }) {
  const { catalogId } = params;
  if (!validOrganizationNumber(catalogId)) {
    return { notFound: true };
  }

  const session = await getServerSession(req, res, authOptions);
  if (!(session?.user && Date.now() < session?.accessTokenExpiresAt * 1000)) {
    return {
      redirect: {
        permanent: false,
        destination: `/auth/signin?callbackUrl=/${catalogId}`,
      },
    };
  }

  const hasWritePermission = session && hasOrganizationWritePermission(session.accessToken, catalogId);
  if (!hasWritePermission) {
    return {
      redirect: {
        permanent: false,
        destination: `/${catalogId}/no-access`,
      },
    };
  }

  return {
    redirect: {
      permanent: false,
      destination: `${process.env.CONCEPT_CATALOG_GUI_BASE_URI}/${catalogId}/new`,
    },
  };
}

export default NewPage;
