import { NextRequest, NextResponse } from "next/server";
import { withValidSessionForApi } from "@catalog-frontend/utils";
import { publishDataService } from "@catalog-frontend/data-access";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ catalogId: string; dataServiceId: string }> },
) {
  const { catalogId, dataServiceId } = await context.params;
  return await withValidSessionForApi(async (session) => {
    if (!catalogId || !dataServiceId) {
      return NextResponse.json(
        { error: "Catalog ID and Data Service ID are required" },
        { status: 400 },
      );
    }

    try {
      const response = await publishDataService(
        catalogId,
        dataServiceId,
        session.accessToken,
      );
      if (!response.ok) {
        console.error(
          "[PUBLISH DATA SERVICE] API call failed with status:",
          response.status,
        );
        return NextResponse.json(
          { error: "Failed to publish data service" },
          { status: response.status },
        );
      }

      return NextResponse.json({}, { status: 200 });
    } catch (error) {
      console.error("[PUBLISH DATA SERVICE] Error:", error);
      return NextResponse.json(
        { error: "Failed to publish data service" },
        { status: 500 },
      );
    }
  });
}
