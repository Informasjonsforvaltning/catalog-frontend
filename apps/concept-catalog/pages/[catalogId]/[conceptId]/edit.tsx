import { validOrganizationNumber, validUUID } from '@catalog-frontend/utils';

export const EditPage = () => {
  return <></>;
};

export async function getServerSideProps({ params }) {
  const { catalogId, conceptId } = params;
  if (!(validOrganizationNumber(catalogId) && validUUID(conceptId))) {
    return { notFound: true };
  }

  return {
    redirect: {
      permanent: false,
      destination: `${process.env.CONCEPT_CATALOG_GUI_BASE_URI}/${catalogId}/${conceptId}`,
    },
  };
}

export default EditPage;
