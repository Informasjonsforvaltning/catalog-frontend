import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const CatalogPage = async () => {
  // NOTICE: Call cookies() to opt into dynamic rendering
  cookies();
  redirect(`${process.env.FDK_REGISTRATION_BASE_URI}`);
};

export default CatalogPage;
