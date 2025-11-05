import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Home = async (props) => {
  const params = await props.params;
  // NOTICE: Call cookies() to opt into dynamic rendering
  await cookies();
  redirect(`/catalogs/${params.catalogId}/concepts`);
};

export default Home;
