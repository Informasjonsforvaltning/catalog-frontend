import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const Home = async () => {
  // NOTICE: Call cookies() to opt into dynamic rendering
  cookies();
  redirect('/catalogs');
};

export default Home;
