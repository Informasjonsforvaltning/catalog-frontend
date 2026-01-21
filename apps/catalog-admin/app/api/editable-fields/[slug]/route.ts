import { patchEditableFields } from "@catalog-frontend/data-access";
import { withValidSessionForApi } from "@catalog-frontend/utils";
import { NextRequest } from "next/server";

export const PATCH = async (
  req: NextRequest,
  ctx: RouteContext<"/api/editable-fields/[slug]">,
) => {
  const params = await ctx.params;
  return await withValidSessionForApi(async (session) => {
    const slug = params;
    const catalogId = slug.slug;
    try {
      const { diff } = await req.json();
      const response = await patchEditableFields(
        catalogId,
        `${session?.accessToken}`,
        diff,
      );

      if (response?.status !== 200) {
        throw new Error();
      }
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), {
        status: response.status,
      });
    } catch (error) {
      return new Response("Failed to update editable field", { status: 500 });
    }
  });
};
