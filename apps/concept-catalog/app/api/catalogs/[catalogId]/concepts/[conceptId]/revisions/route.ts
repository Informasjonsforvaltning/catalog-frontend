import { getConceptRevisions } from "@catalog-frontend/data-access";
import { withValidSessionForApi } from "@catalog-frontend/utils";
import { NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  props: { params: Promise<{ conceptId: string }> },
) => {
  const params = await props.params;
  return await withValidSessionForApi(async (session) => {
    const { conceptId } = params;
    try {
      const response = await getConceptRevisions(
        conceptId,
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
      return new Response(
        JSON.stringify({ message: "Failed to fetch revisions for concept" }),
        { status: 500 },
      );
    }
  });
};
