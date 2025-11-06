import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@catalog-frontend/utils";
import { publishDataService } from "@catalog-frontend/data-access";

export async function POST(
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

    const response = await publishDataService(
      catalogId,
      dataServiceId,
      `${session.accessToken}`,
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
}
