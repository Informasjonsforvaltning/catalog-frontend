import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@catalog-frontend/utils";
import { deleteDataService } from "@catalog-frontend/data-access";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ catalogId: string; dataServiceId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { catalogId, dataServiceId } = await context.params;

    if (!catalogId || !dataServiceId) {
      return NextResponse.json(
        { error: "Catalog ID and Data Service ID are required" },
        { status: 400 },
      );
    }

    const response = await deleteDataService(
      catalogId,
      dataServiceId,
      `${session.accessToken}`,
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
}
