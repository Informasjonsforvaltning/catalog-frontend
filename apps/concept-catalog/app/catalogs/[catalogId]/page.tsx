import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Home = async (props: PageProps<"/catalogs/[catalogId]">) => {
  const { catalogId } = await props.params;
  // NOTICE: Call cookies() to opt into dynamic rendering
  await cookies();
  redirect(`/catalogs/${catalogId}/concepts`);
};

export default Home;
