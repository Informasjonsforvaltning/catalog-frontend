import { getUsers } from "@catalog-frontend/data-access";
import { withValidSessionForApi } from "@catalog-frontend/utils";
import { NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  props: { params: Promise<{ catalogId: string }> },
) => {
  const params = await props.params;
  return await withValidSessionForApi(async (session) => {
    const { catalogId } = params;

    try {
      const response = await getUsers(catalogId, `${session?.accessToken}`);
      if (response.status !== 200) {
        return new Response(
          JSON.stringify({ message: "Failed to get user list" }),
          { status: response.status },
        );
      }
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), {
        status: response.status,
      });
    } catch {
      return new Response(
        JSON.stringify({ message: "Failed to get user list" }),
        { status: 500 },
      );
    }
  });
};
