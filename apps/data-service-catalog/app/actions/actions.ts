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
  localization,
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
      "getDataServices failed with response code " + response.status,
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
  let success = false;
  let dataServiceId: undefined | string = undefined;
  try {
    const response = await postDataService(
      newDataService,
      catalogId,
      `${session?.accessToken}`,
    );
    if (response.status !== 201) {
      throw new Error(
        `Failed to create data service: ${response.status} ${response.statusText}`,
      );
    }

    const locationHeader = response?.headers?.get("location");
    if (!locationHeader) {
      throw new Error("No location header returned from server");
    }

    dataServiceId = locationHeader?.split("/").pop();
    if (!dataServiceId) {
      throw new Error("Could not extract data service ID from location header");
    }

    console.log(
      `[createDataService] Successfully created data service with ID: ${dataServiceId}`,
    );
    success = true;
    return dataServiceId;
  } catch (error) {
    console.error("Error creating data service:", error);
    throw new Error(localization.alert.fail);
  } finally {
    if (success) {
      console.log(
        `[createDataService] Revalidating cache tags for data service ${dataServiceId}`,
      );
      updateTag("data-service");
      updateTag("data-services");
    }
  }
}

export async function deleteDataService(
  catalogId: string,
  dataServiceId: string,
): Promise<void> {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  let success = false;
  try {
    const response = await removeDataService(
      catalogId,
      dataServiceId,
      `${session?.accessToken}`,
    );
    if (response.status !== 204) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    throw new Error(localization.alert.deleteFailed);
  } finally {
    if (success) {
      updateTag("data-services");
    }
  }
}

export async function updateDataService(
  catalogId: string,
  initialDataService: DataService,
  values: DataService,
): Promise<DataService> {
  const updatedDataService = removeEmptyValues({
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
    omit(updatedDataService, dataServiceMetadataFieldsToOmit),
  );

  if (diff.length === 0) {
    throw new Error(localization.alert.noChanges);
  }

  let success = false;
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }

  try {
    const response = await update(
      catalogId,
      initialDataService.id,
      diff,
      `${session?.accessToken}`,
    );
    if (response.status !== 200) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    success = true;

    const updatedDataService = await response.json();
    return updatedDataService;
  } catch (error) {
    console.error(`${localization.alert.fail} ${error}`);
    throw new Error("Noe gikk galt, prøv igjen...");
  } finally {
    if (success) {
      updateTag("data-service");
      updateTag("data-services");
    }
  }
}

export async function publishDataService(
  catalogId: string,
  dataServiceId: string,
): Promise<void> {
  const session = await getValidSession();
  let success = false;
  try {
    const response = await publish(
      catalogId,
      dataServiceId,
      `${session?.accessToken}`,
    );
    if (response.status !== 200) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    throw new Error(localization.alert.deleteFailed);
  } finally {
    if (success) {
      updateTag("data-service");
      updateTag("data-services");
    }
  }
}

export async function unpublishDataService(
  catalogId: string,
  dataServiceId: string,
): Promise<void> {
  const session = await getValidSession();
  let success = false;
  try {
    const response = await unpublish(
      catalogId,
      dataServiceId,
      `${session?.accessToken}`,
    );
    if (response.status !== 200) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    throw new Error(localization.alert.deleteFailed);
  } finally {
    if (success) {
      updateTag("data-service");
      updateTag("data-services");
    }
  }
}

export async function deleteImportResult(
  catalogId: string,
  resultId: string,
): Promise<void> {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  let success = false;
  try {
    const response = await removeImportResult(
      catalogId,
      resultId,
      `${session?.accessToken}`,
    );
    if (response.status !== 204) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    throw new Error(localization.alert.deleteFailed);
  } finally {
    if (success) {
      updateTag("import-results");
    }
  }
}
