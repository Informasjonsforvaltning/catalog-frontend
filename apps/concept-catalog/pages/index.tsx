export const HomePage = () => {
  return <></>;
};

export async function getServerSideProps() {
  return {
    redirect: {
      permanent: false,
      destination: process.env.NEXT_PUBLIC_FDK_REGISTRATION_BASE_URI,
    },
  };
}

export default HomePage;
