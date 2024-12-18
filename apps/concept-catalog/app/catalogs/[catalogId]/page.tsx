import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const Home = async ({ params }) => {
  // NOTICE: Call cookies() to opt into dynamic rendering
  cookies();
  redirect(`/catalogs/${params.catalogId}/concepts`);
};

export default Home;
