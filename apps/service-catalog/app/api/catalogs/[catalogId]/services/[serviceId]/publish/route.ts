import { publishService } from "@catalog-frontend/data-access";
import { withValidSessionForApi } from "@catalog-frontend/utils";
import { NextRequest } from "next/server";

export const POST = async (
  request: NextRequest,
  props: { params: Promise<{ catalogId: string; serviceId: string }> },
) => {
  const params = await props.params;
  return await withValidSessionForApi(async (session) => {
    const { catalogId, serviceId } = params;
    try {
      const response = await publishService(
        catalogId,
        serviceId,
        session.accessToken,
      );
      if (response.status !== 200) {
        throw new Error();
      }
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), {
        status: response.status,
      });
    } catch (err) {
      return new Response("Failed to publish service", { status: 500 });
    }
  });
};
