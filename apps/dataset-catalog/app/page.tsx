import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const Home = () => {
  cookies();
  redirect(`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`);
};

export default Home;
