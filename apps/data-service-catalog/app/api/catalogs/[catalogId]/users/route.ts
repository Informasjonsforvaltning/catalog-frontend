import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@catalog-frontend/utils";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ catalogId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { catalogId } = await context.params;

    if (!catalogId) {
      return NextResponse.json(
        { error: "Catalog ID is required" },
        { status: 400 },
      );
    }

    // For now, return a mock response since we don't have a users API
    // This can be updated when the actual users API is available
    return NextResponse.json(
      {
        users: [
          {
            id: (session.user as any)?.id || "current-user",
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
}
