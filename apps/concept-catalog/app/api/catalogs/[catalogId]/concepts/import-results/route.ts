import { NextRequest } from "next/server";
import { withValidSessionForApi } from "@catalog-frontend/utils";
import { getConceptImportResults } from "@catalog-frontend/data-access";

export const GET = async (
  req: NextRequest,
  props: { params: Promise<{ catalogId: string }> },
) => {
  const params = await props.params;
  return await withValidSessionForApi(async (session) => {
    const { catalogId } = params;

    try {
      const response = await getConceptImportResults(
        catalogId,
        session?.accessToken,
      );

      console.log("Import results", response);

      const importResults = await response.json();
      return new Response(JSON.stringify(importResults), { status: 200 });
    } catch (err) {
      return new Response(
        JSON.stringify({ message: "Failed to fetch concepts" }),
        { status: 500 },
      );
    }
  });
};
