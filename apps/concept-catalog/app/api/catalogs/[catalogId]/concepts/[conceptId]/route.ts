import { deleteConcept } from "@catalog-frontend/data-access";
import { withValidSessionForApi } from "@catalog-frontend/utils";
import { NextRequest } from "next/server";

export const DELETE = async (
  req: NextRequest,
  ctx: RouteContext<"/api/catalogs/[catalogId]/concepts/[conceptId]">,
) => {
  const params = await ctx.params;
  return withValidSessionForApi(async (session) => {
    const { conceptId } = params;
    try {
      const response = await deleteConcept(conceptId, session?.accessToken);
      if (!response.ok) {
        throw new Error();
      }
      return new Response(response?.text?.toString(), { status: 200 });
    } catch (err) {
      console.log("Error", err);
      return new Response(
        JSON.stringify({ message: "Failed to delete concept" }),
        { status: 500 },
      );
    }
  });
};
