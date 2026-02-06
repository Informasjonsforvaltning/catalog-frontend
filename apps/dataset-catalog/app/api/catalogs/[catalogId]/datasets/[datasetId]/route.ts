import { NextRequest, NextResponse } from "next/server";
import { withValidSessionForApi } from "@catalog-frontend/utils";
import { deleteDataset } from "@catalog-frontend/data-access";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ catalogId: string; datasetId: string }> },
) {
  const { catalogId, datasetId } = await context.params;
  return withValidSessionForApi(async (session) => {
    if (!catalogId || !datasetId) {
      return NextResponse.json(
        { error: "Catalog ID and Dataset ID are required" },
        { status: 400 },
      );
    }

    try {
      const response = await deleteDataset(
        catalogId,
        datasetId,
        session.accessToken,
      );
      if (!response.ok) {
        console.error(
          "[DELETE DATASET] API call failed with status:",
          response.status,
        );
        return NextResponse.json(
          { error: "Failed to delete dataset" },
          { status: response.status },
        );
      }

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error("[DELETE DATASET] Error:", error);
      return NextResponse.json(
        { error: "Failed to delete dataset" },
        { status: 500 },
      );
    }
  });
}
