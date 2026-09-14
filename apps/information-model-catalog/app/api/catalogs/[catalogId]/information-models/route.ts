import { NextRequest, NextResponse } from "next/server";
import { withValidSessionForApi } from "@catalog-frontend/utils";
import {
  getAllInformationModels,
  getInformationModelById,
  postInformationModel,
} from "@catalog-frontend/data-access";

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
      const response = await getAllInformationModels(
        catalogId,
        session.accessToken,
      );
      if (!response.ok) {
        console.error(
          "[GET DATA SERVICES] API call failed with status:",
          response.status,
        );
        return NextResponse.json(
          { error: "Failed to fetch data services" },
          { status: response.status },
        );
      }

      const informationModels = await response.json();
      return NextResponse.json(informationModels, { status: 200 });
    } catch (error) {
      console.error("[GET DATA SERVICES] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch data services" },
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
  return await withValidSessionForApi(async (session) => {
    if (!catalogId) {
      return NextResponse.json(
        { error: "Catalog ID is required" },
        { status: 400 },
      );
    }

    try {
      const informationModel = await request.json();

      if (!informationModel.title) {
        return NextResponse.json(
          { error: "Data service title is required" },
          { status: 400 },
        );
      }

      const response = await postInformationModel(
        informationModel,
        catalogId,
        session.accessToken,
      );
      if (!response.ok) {
        console.error(
          "[POST DATA SERVICE] API call failed with status:",
          response.status,
        );
        return NextResponse.json(
          { error: "Failed to create data service" },
          { status: response.status },
        );
      }

      const locationHeader = response.headers.get("location");
      const informationModelId = locationHeader?.split("/").pop();
      if (!informationModelId) {
        return NextResponse.json(
          { error: "Failed to create data service" },
          { status: 500 },
        );
      }
      const newInformationModelResponse = await getInformationModelById(
        catalogId,
        informationModelId,
        session.accessToken,
      );
      if (!newInformationModelResponse.ok) {
        console.error(
          "[POST DATA SERVICE] API call failed with status:",
          newInformationModelResponse.status,
        );
        throw new Error("Failed to fetch data service");
      }

      const newInformationModel = await newInformationModelResponse.json();
      return NextResponse.json(newInformationModel, {
        status: 201,
        headers: {
          Location: locationHeader || "",
        },
      });
    } catch (error) {
      console.error("[POST DATA SERVICE] Error:", error);
      return NextResponse.json(
        { error: "Failed to create data service" },
        { status: 500 },
      );
    }
  });
}
