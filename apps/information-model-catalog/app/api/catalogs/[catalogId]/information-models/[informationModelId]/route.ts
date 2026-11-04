import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import {
  validInformationModelID,
  validOrganizationNumber,
  withValidSessionForApi,
} from "@catalog-frontend/utils";
import { deleteInformationModel } from "@catalog-frontend/data-access";

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{ catalogId: string; informationModelId: string }>;
  },
) {
  const { catalogId, informationModelId } = await context.params;
  return await withValidSessionForApi(async (session) => {
    if (
      !validOrganizationNumber(catalogId) ||
      !validInformationModelID(informationModelId)
    ) {
      return NextResponse.json(
        { error: "A valid catalog ID and information model ID are required" },
        { status: 400 },
      );
    }

    try {
      const response = await deleteInformationModel(
        catalogId,
        informationModelId,
        session.accessToken,
      );
      if (!response.ok) {
        console.error(
          "[DELETE INFORMATION MODEL] API call failed with status:",
          response.status,
        );
        return NextResponse.json(
          { error: "Failed to delete information model" },
          { status: response.status },
        );
      }

      revalidateTag("information-model", { expire: 0 });
      revalidateTag("information-models", { expire: 0 });
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error("[DELETE INFORMATION MODEL] Error:", error);
      return NextResponse.json(
        { error: "Failed to delete information model" },
        { status: 500 },
      );
    }
  });
}
