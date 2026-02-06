import { createService, getAllServices } from "@catalog-frontend/data-access";
import { Service } from "@catalog-frontend/types";
import { withValidSessionForApi } from "@catalog-frontend/utils";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  props: { params: Promise<{ catalogId: string }> },
) => {
  const params = await props.params;
  return await withValidSessionForApi(async (session) => {
    const { catalogId } = params;

    try {
      const response = await getAllServices(catalogId, session.accessToken);
      if (response.status !== 200) {
        throw new Error();
      }
      const services = await response.json();
      return new Response(JSON.stringify(services), { status: 200 });
    } catch (err) {
      return new Response("Failed to fetch services", { status: 500 });
    }
  });
};

export const POST = async (
  req: NextRequest,
  props: { params: Promise<{ catalogId: string }> },
) => {
  const params = await props.params;
  return await withValidSessionForApi(async (session) => {
    const { catalogId } = params;

    const service: Service = await req.json();

    try {
      const response = await createService(
        service,
        catalogId,
        session.accessToken,
      );
      if (response.status !== 201) {
        console.log(
          "Failed to create service with status " + response.status,
          await response.json(),
        );
        throw new Error(
          "Failed to create service with status " + response.status,
        );
      }
      const serviceId = response?.headers?.get("location")?.split("/").pop();
      return new Response(JSON.stringify(serviceId), { status: 200 });
    } catch (err) {
      console.log(err);
      return new Response("Failed to create service", { status: 500 });
    }
  });
};
