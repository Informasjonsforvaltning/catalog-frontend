import { NextRequest, NextResponse } from "next/server";
import { withValidSessionForApi } from "@catalog-frontend/utils";
import { getAllDatasets, postDataset } from "@catalog-frontend/data-access";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ catalogId: string }> },
) {
  const { catalogId } = await context.params;
  return withValidSessionForApi(async (session) => {
    if (!catalogId) {
      return NextResponse.json(
        { error: "Catalog ID is required" },
        { status: 400 },
      );
    }

    try {
      const response = await getAllDatasets(catalogId, session.accessToken);
      if (!response.ok) {
        console.error(
          "[GET DATASETS] API call failed with status:",
          response.status,
        );
        return NextResponse.json(
          { error: "Failed to fetch datasets" },
          { status: response.status },
        );
      }

      const datasets = await response.json();
      return NextResponse.json(datasets, { status: 200 });
    } catch (error) {
      console.error("[GET DATASETS] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch datasets" },
        { status: 500 },
      );
    }
  });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ catalogId: string }> },
) {
  const { catalogId } = await context.params;
  return withValidSessionForApi(async (session) => {
    if (!catalogId) {
      return NextResponse.json(
        { error: "Catalog ID is required" },
        { status: 400 },
      );
    }

    try {
      const dataset = await request.json();

      if (!dataset.title) {
        return NextResponse.json(
          { error: "Dataset title is required" },
          { status: 400 },
        );
      }

      const response = await postDataset(
        dataset,
        catalogId,
        session.accessToken,
      );
      if (!response.ok) {
        console.error(
          "[POST DATASET] API call failed with status:",
          response.status,
        );
        return NextResponse.json(
          { error: "Failed to create dataset" },
          { status: response.status },
        );
      }

      const locationHeader = response.headers.get("location");
      const datasetId = locationHeader?.split("/").pop();

      return NextResponse.json(datasetId, {
        status: 201,
        headers: {
          Location: locationHeader || "",
        },
      });
    } catch (error) {
      console.error("[POST DATASET] Error:", error);
      return NextResponse.json(
        { error: "Failed to create dataset" },
        { status: 500 },
      );
    }
  });
}
