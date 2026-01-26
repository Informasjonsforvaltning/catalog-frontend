"use server";

import {
  deleteDataService as removeDataService,
  deleteImportResult as removeImportResult,
  getAllDataServices,
  postDataService,
  publishDataService as publish,
  unpublishDataService as unpublish,
  updateDataService as update,
} from "@catalog-frontend/data-access";
import {
  getValidSession,
  redirectToSignIn,
  removeEmptyValues,
} from "@catalog-frontend/utils";
import { DataService, DataServiceToBeCreated } from "@catalog-frontend/types";
import { updateTag } from "next/cache";
import { compare } from "fast-json-patch";
import omit from "lodash/omit";

const dataServiceMetadataFieldsToOmit = ["modified"];

export async function getDataServices(
  catalogId: string,
): Promise<DataService[]> {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }

  const response = await getAllDataServices(
    catalogId,
    `${session?.accessToken}`,
  );
  if (response.status !== 200) {
    throw new Error(
      `API responded with status ${response.status} for getAllDataServices`,
    );
  }
  return await response.json();
}

export async function createDataService(
  catalogId: string,
  values: DataServiceToBeCreated,
): Promise<string> {
  console.log(`[createDataService] Starting creation for catalog ${catalogId}`);
  const newDataService = removeEmptyValues({
    ...values,
    accessRights:
      values?.accessRights === "none" ? undefined : values?.accessRights,
    license: values?.license === "none" ? undefined : values?.license,
    status: values?.status === "none" ? undefined : values?.status,
    availability:
      values?.availability === "none" ? undefined : values?.availability,
  });
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }

  const response = await postDataService(
    newDataService,
    catalogId,
    `${session?.accessToken}`,
  );
  if (response.status !== 201) {
    throw new Error(
      `API responded with status ${response.status} for createDataService`,
    );
  }

  updateTag("data-service");
  updateTag("data-services");

  const locationHeader = response?.headers?.get("location");
  if (!locationHeader) {
    throw new Error("No location header returned from server");
  }

  const dataServiceId = locationHeader?.split("/").pop();
  if (!dataServiceId) {
    throw new Error("Could not extract data service ID from location header");
  }
  return dataServiceId;
}

export async function deleteDataService(
  catalogId: string,
  dataServiceId: string,
): Promise<void> {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  const response = await removeDataService(
    catalogId,
    dataServiceId,
    `${session?.accessToken}`,
  );
  if (response.status !== 204) {
    throw new Error(
      `API responded with status ${response.status} for deleteDataService`,
    );
  }
  updateTag("data-services");
}

export async function updateDataService(
  catalogId: string,
  initialDataService: DataService,
  values: DataService,
): Promise<DataService> {
  const nextDataService = removeEmptyValues({
    ...values,
    accessRights:
      values?.accessRights === "none" ? undefined : values?.accessRights,
    license: values?.license === "none" ? undefined : values?.license,
    status: values?.status === "none" ? undefined : values?.status,
    availability:
      values?.availability === "none" ? undefined : values?.availability,
  });

  const diff = compare(
    omit(initialDataService, dataServiceMetadataFieldsToOmit),
    omit(nextDataService, dataServiceMetadataFieldsToOmit),
  );

  if (diff.length === 0) {
    return initialDataService;
  }

  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }

  const response = await update(
    catalogId,
    initialDataService.id,
    diff,
    `${session?.accessToken}`,
  );
  if (response.status !== 200) {
    throw new Error(
      `API responded with status ${response.status} for updateDataService`,
    );
  }

  updateTag("data-service");
  updateTag("data-services");
  return response.json();
}

export async function publishDataService(
  catalogId: string,
  dataServiceId: string,
): Promise<void> {
  const session = await getValidSession();
  const response = await publish(
    catalogId,
    dataServiceId,
    `${session?.accessToken}`,
  );
  if (response.status !== 200) {
    throw new Error(
      `API responded with status ${response.status} for publishDataService`,
    );
  }
  updateTag("data-service");
  updateTag("data-services");
}

export async function unpublishDataService(
  catalogId: string,
  dataServiceId: string,
): Promise<void> {
  const session = await getValidSession();
  const response = await unpublish(
    catalogId,
    dataServiceId,
    `${session?.accessToken}`,
  );
  if (response.status !== 200) {
    throw new Error(
      `API responded with status ${response.status} for unpublishDataService`,
    );
  }
  updateTag("data-service");
  updateTag("data-services");
}

export async function deleteImportResult(
  catalogId: string,
  resultId: string,
): Promise<void> {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  const response = await removeImportResult(
    catalogId,
    resultId,
    `${session?.accessToken}`,
  );
  if (response.status !== 204) {
    throw new Error(
      `API responded with status ${response.status} for deleteImportResult`,
    );
  }
  updateTag("import-results");
}
