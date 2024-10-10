import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const Home = async () => {
  // NOTICE: Call cookies() to opt into dynamic rendering
  cookies();
  redirect(`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`);
};

export default Home;
