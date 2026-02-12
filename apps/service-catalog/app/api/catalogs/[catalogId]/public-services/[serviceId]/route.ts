import { deletePublicService } from "@catalog-frontend/data-access";
import { withValidSessionForApi } from "@catalog-frontend/utils";
import { NextRequest } from "next/server";

export const DELETE = async (req: NextRequest, props: { params: any }) => {
  const params = await props.params;
  return withValidSessionForApi(async (session) => {
    const { catalogId, serviceId } = params;
    try {
      const response = await deletePublicService(
        catalogId,
        serviceId,
        session.accessToken,
      );
      if (response.status !== 204) {
        throw new Error();
      }
      return new Response(await response.text(), { status: 200 });
    } catch (err) {
      return new Response("Failed to delete service", { status: 500 });
    }
  });
};
