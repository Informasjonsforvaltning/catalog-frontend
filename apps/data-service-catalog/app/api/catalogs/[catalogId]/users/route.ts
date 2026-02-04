import { NextRequest, NextResponse } from "next/server";
import { withValidSessionForApi } from "@catalog-frontend/utils";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ catalogId: string }> },
) {
  const { catalogId } = await context.params;
  return await withValidSessionForApi(async (session) => {
    if (!catalogId) {
      return NextResponse.json(
        { error: "Catalog ID is required" },
        { status: 400 },
      );
    }

    try {
      // For now, return a mock response since we don't have a users API
      // This can be updated when the actual users API is available
      return NextResponse.json(
        {
          users: [
            {
              id: session.user?.id || "current-user",
              name: session.user?.name || "Current User",
              email: session.user?.email || "user@example.com",
              role: "admin",
            },
          ],
        },
        { status: 200 },
      );
    } catch (error) {
      console.error("[GET USERS] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 },
      );
    }
  });
}
