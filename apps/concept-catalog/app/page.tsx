import { redirect } from 'next/navigation';

const Home = async () => {
  redirect(`${process.env.FDK_REGISTRATION_BASE_URI}`);
};

export default Home;
