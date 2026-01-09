import { authOptions, isValidSessionAndToken } from "@catalog-frontend/utils";
import { getServerSession } from "next-auth";

export const GET = async () => {
  const session = await getServerSession(authOptions);
  const isValid = await isValidSessionAndToken(session);
  return new Response(null, { status: isValid ? 200 : 401 });
};
