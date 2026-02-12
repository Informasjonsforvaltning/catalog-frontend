import { getConceptHistory } from "@catalog-frontend/data-access";
import { withValidSessionForApi } from "@catalog-frontend/utils";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  props: { params: Promise<{ slug: string }> },
) => {
  const params = await props.params;
  return await withValidSessionForApi(async (session) => {
    const { slug } = params;
    if (slug?.length == 2) {
      const [catalogId, resourceId] = slug;
      const page = req.nextUrl.searchParams.get("page") ?? 0;
      const size = req.nextUrl.searchParams.get("size") ?? 10;

      try {
        const response = await getConceptHistory(
          catalogId,
          resourceId,
          session.accessToken,
          +page,
          +size,
        );
        if (response.status !== 200) {
          throw new Error();
        }
        const jsonResponse = await response.json();
        return new Response(JSON.stringify(jsonResponse), {
          status: response.status,
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ message: "Failed to get history" }),
          { status: 500 },
        );
      }
    } else {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
  });
};
