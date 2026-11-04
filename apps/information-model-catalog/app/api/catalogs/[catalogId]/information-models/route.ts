import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import {
  validInformationModelID,
  validOrganizationNumber,
  withValidSessionForApi,
} from "@catalog-frontend/utils";
import {
  getAllInformationModels,
  getInformationModelById,
  postInformationModel,
} from "@catalog-frontend/data-access";
import { parseInformationModelToBeCreated } from "@information-model-catalog/utils/parse-information-model-to-be-created";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ catalogId: string }> },
) {
  const { catalogId } = await context.params;
  return await withValidSessionForApi(async (session) => {
    if (!validOrganizationNumber(catalogId)) {
      return NextResponse.json(
        { error: "A valid catalog ID is required" },
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
          "[GET INFORMATION MODELS] API call failed with status:",
          response.status,
        );
        return NextResponse.json(
          { error: "Failed to fetch information models" },
          { status: response.status },
        );
      }

      const informationModels = await response.json();
      return NextResponse.json(informationModels, { status: 200 });
    } catch (error) {
      console.error("[GET INFORMATION MODELS] Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch information models" },
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
    if (!validOrganizationNumber(catalogId)) {
      return NextResponse.json(
        { error: "A valid catalog ID is required" },
        { status: 400 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Request body must be valid JSON" },
        { status: 400 },
      );
    }

    const informationModel = parseInformationModelToBeCreated(body);
    if (!informationModel) {
      return NextResponse.json(
        {
          error:
            "Invalid information model: a title in at least one language is required, and all fields must have the correct type",
        },
        { status: 400 },
      );
    }

    let locationHeader: string | null;
    try {
      const response = await postInformationModel(
        informationModel,
        catalogId,
        session.accessToken,
      );
      if (!response.ok) {
        console.error(
          "[POST INFORMATION MODEL] API call failed with status:",
          response.status,
        );
        return NextResponse.json(
          { error: "Failed to create information model" },
          { status: response.status },
        );
      }
      locationHeader = response.headers.get("location");
    } catch (error) {
      console.error("[POST INFORMATION MODEL] Error:", error);
      return NextResponse.json(
        { error: "Failed to create information model" },
        { status: 500 },
      );
    }

    revalidateTag("information-models", { expire: 0 });

    const informationModelId = locationHeader?.split("/").pop();
    if (!locationHeader || !informationModelId) {
      console.error(
        "[POST INFORMATION MODEL] Backend response is missing a Location header",
      );
      return NextResponse.json(
        {
          error:
            "Information model was created, but the backend returned no Location header",
        },
        { status: 502 },
      );
    }
    if (!validInformationModelID(informationModelId)) {
      console.error(
        "[POST INFORMATION MODEL] Backend returned an invalid information model ID:",
        informationModelId,
      );
      return NextResponse.json(
        {
          error:
            "Information model was created, but the backend returned an invalid ID",
        },
        { status: 502, headers: { Location: locationHeader } },
      );
    }

    const created = { status: 201, headers: { Location: locationHeader } };
    try {
      const newInformationModelResponse = await getInformationModelById(
        catalogId,
        informationModelId,
        session.accessToken,
      );
      if (newInformationModelResponse.ok) {
        const newInformationModel = await newInformationModelResponse.json();
        return NextResponse.json(newInformationModel, created);
      }
      console.error(
        "[POST INFORMATION MODEL] Fetching the created model failed with status:",
        newInformationModelResponse.status,
      );
    } catch (error) {
      console.error(
        "[POST INFORMATION MODEL] Fetching the created model failed:",
        error,
      );
    }
    return NextResponse.json({ id: informationModelId }, created);
  });
}
