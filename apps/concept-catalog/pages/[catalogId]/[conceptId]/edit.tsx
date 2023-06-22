import { hasOrganizationReadPermission, validOrganizationNumber, validUUID } from '@catalog-frontend/utils';
import { getToken } from 'next-auth/jwt';

export const EditPage = () => {
  return <></>;
};

export async function getServerSideProps({ req, params }) {
  const { catalogId, conceptId } = params;
  if (!(validOrganizationNumber(catalogId) && validUUID(conceptId))) {
    return { notFound: true };
  }

  const token = await getToken({ req });
  const hasPermission = token && hasOrganizationReadPermission(token.access_token, catalogId);
  if (!hasPermission) {
    return {
      redirect: {
        permanent: false,
        destination: '/no-access',
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
