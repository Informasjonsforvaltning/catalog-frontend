import { cookies, type UnsafeUnwrappedCookies } from 'next/headers';
import { redirect } from 'next/navigation';

const Home = () => {
  void (cookies() as unknown as UnsafeUnwrappedCookies);
  redirect(`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`);
};

export default Home;
