import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@catalog-frontend/utils";
import {
  getAllDataServices,
  getDataServiceById,
  postDataService,
} from "@catalog-frontend/data-access";

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

    const response = await getAllDataServices(
      catalogId,
      `${session.accessToken}`,
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

    const dataServices = await response.json();
    return NextResponse.json(dataServices, { status: 200 });
  } catch (error) {
    console.error("[GET DATA SERVICES] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data services" },
      { status: 500 },
    );
  }
}

export async function POST(
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

    const dataService = await request.json();

    if (!dataService.title) {
      return NextResponse.json(
        { error: "Data service title is required" },
        { status: 400 },
      );
    }

    const response = await postDataService(
      dataService,
      catalogId,
      `${session.accessToken}`,
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
    const dataServiceId = locationHeader?.split("/").pop();
    if (!dataServiceId) {
      return NextResponse.json(
        { error: "Failed to create data service" },
        { status: 500 },
      );
    }
    const newDataServiceResponse = await getDataServiceById(
      catalogId,
      dataServiceId,
      `${session?.accessToken}`,
    );
    if (!newDataServiceResponse.ok) {
      console.error(
        "[POST DATA SERVICE] API call failed with status:",
        newDataServiceResponse.status,
      );
      throw new Error("Failed to fetch data service");
    }

    const newDataService = await newDataServiceResponse.json();
    return NextResponse.json(newDataService, {
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
}
