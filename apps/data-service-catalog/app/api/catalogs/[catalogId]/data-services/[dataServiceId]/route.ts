import { NextRequest, NextResponse } from "next/server";
import { withValidSessionForApi } from "@catalog-frontend/utils";
import { deleteDataService } from "@catalog-frontend/data-access";

export async function DELETE(
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
      const response = await deleteDataService(
        catalogId,
        dataServiceId,
        session.accessToken,
      );
      if (!response.ok) {
        console.error(
          "[DELETE DATA SERVICE] API call failed with status:",
          response.status,
        );
        return NextResponse.json(
          { error: "Failed to delete data service" },
          { status: response.status },
        );
      }

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error("[DELETE DATA SERVICE] Error:", error);
      return NextResponse.json(
        { error: "Failed to delete data service" },
        { status: 500 },
      );
    }
  });
}
