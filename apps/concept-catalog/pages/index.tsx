export const HomePage = () => {
  return <></>;
};

export async function getServerSideProps() {
  return {
    redirect: {
      permanent: false,
      destination: process.env.FDK_REGISTRATION_BASE_URI,
    },
  };
}

export default HomePage;
