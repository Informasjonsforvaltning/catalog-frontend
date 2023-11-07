import { hasOrganizationWritePermission, validOrganizationNumber, validUUID } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]';

export const EditPage = () => {
  return <></>;
};

export async function getServerSideProps({ req, res, params }) {
  const { catalogId, conceptId } = params;
  if (!(validOrganizationNumber(catalogId) && validUUID(conceptId))) {
    return { notFound: true };
  }

  const session = await getServerSession(req, res, authOptions);
  if (!(session?.user && Date.now() < session?.accessTokenExpiresAt * 1000)) {
    return {
      redirect: {
        permanent: false,
        destination: `/auth/signin?callbackUrl=/${catalogId}/${conceptId}`,
      },
    };
  }

  const hasWritePermission = session && hasOrganizationWritePermission(session?.accessToken, catalogId);
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
      destination: `${process.env.CONCEPT_CATALOG_GUI_BASE_URI}/${catalogId}/${conceptId}`,
    },
  };
}

export default EditPage;
