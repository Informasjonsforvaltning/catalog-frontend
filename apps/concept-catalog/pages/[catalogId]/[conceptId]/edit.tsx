export const EditPage = () => {
  return <></>;
};

export async function getServerSideProps({ params }) {
  const { catalogId, conceptId } = params;
  return {
    redirect: {
      permanent: false,
      destination: `${process.env.CONCEPT_CATALOG_GUI_BASE_URI}/${catalogId}/${conceptId}`,
    },
  };
}

export default EditPage;
