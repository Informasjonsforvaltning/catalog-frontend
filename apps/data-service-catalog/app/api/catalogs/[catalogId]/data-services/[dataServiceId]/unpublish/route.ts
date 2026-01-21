import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@catalog-frontend/utils";
import { unpublishDataService } from "@catalog-frontend/data-access";

export async function POST(
  request: NextRequest,
  context: RouteContext<"/api/catalogs/[catalogId]/data-services/[dataServiceId]/unpublish">,
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

    const response = await unpublishDataService(
      catalogId,
      dataServiceId,
      `${session.accessToken}`,
    );
    if (!response.ok) {
      console.error(
        "[UNPUBLISH DATA SERVICE] API call failed with status:",
        response.status,
      );
      return NextResponse.json(
        { error: "Failed to unpublish data service" },
        { status: response.status },
      );
    }

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error("[UNPUBLISH DATA SERVICE] Error:", error);
    return NextResponse.json(
      { error: "Failed to unpublish data service" },
      { status: 500 },
    );
  }
}
