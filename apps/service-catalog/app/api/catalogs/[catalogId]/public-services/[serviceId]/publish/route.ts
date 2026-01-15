import { publishPublicService } from "@catalog-frontend/data-access";
import { withValidSessionForApi } from "@catalog-frontend/utils";
import { NextRequest } from "next/server";

export const POST = async (
  request: NextRequest,
  context: RouteContext<"/api/catalogs/[catalogId]/public-services/[serviceId]/publish">,
) => {
  const params = await context.params;
  return await withValidSessionForApi(async (session) => {
    const { catalogId, serviceId } = params;
    try {
      const response = await publishPublicService(
        catalogId,
        serviceId,
        session?.accessToken as string,
      );
      if (response.status !== 200) {
        throw new Error();
      }
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), {
        status: response?.status,
      });
    } catch (err) {
      return new Response("Failed to publish service", { status: 500 });
    }
  });
};
