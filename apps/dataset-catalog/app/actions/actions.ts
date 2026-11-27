"use server";

import {
  deleteDataset as removeDataset,
  getAllDatasets as getAll,
  getById,
  postDataset,
  publishDataset as publish,
  unpublishDataset as unpublish,
  updateDataset as update,
} from "@catalog-frontend/data-access";
import { Dataset, DatasetToBeCreated } from "@catalog-frontend/types";
import {
  getValidSession,
  localization,
  redirectToSignIn,
  removeEmptyValues,
} from "@catalog-frontend/utils";
import { compare } from "fast-json-patch";
import { updateTag } from "next/cache";

export async function getDatasets(catalogId: string): Promise<Dataset[]> {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  const response = await getAll(catalogId, session.accessToken);
  if (response.status !== 200) {
    throw new Error("getDatasets failed with response code " + response.status);
  }
  return await response.json();
}

export async function getDatasetById(
  catalogId: string,
  datasetId: string,
): Promise<Dataset> {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  const response = await getById(catalogId, datasetId, session.accessToken);

  if (response.status !== 200) {
    throw new Error(
      "getDatasetById failed with response code " + response.status,
    );
  }

  return await response.json();
}

export async function createDataset(
  values: DatasetToBeCreated,
  catalogId: string,
): Promise<string | undefined> {
  const datasetNoEmptyValues = removeEmptyValues(values);

  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  let success = false;
  let datasetId: undefined | string = undefined;
  try {
    const response = await postDataset(
      datasetNoEmptyValues,
      catalogId,
      session.accessToken,
    );
    if (response.status !== 201) {
      throw new Error();
    }

    datasetId = response.headers.get("location")?.split("/").pop();
    success = true;
    return datasetId;
  } catch (error) {
    throw new Error(`${localization.alert.fail} ${error}`);
  } finally {
    if (success) {
      updateTag("dataset");
      updateTag("datasets");
    }
  }
}

export async function deleteDataset(
  catalogId: string,
  datasetId: string,
): Promise<void> {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  let success = false;
  try {
    const response = await removeDataset(
      catalogId,
      datasetId,
      session.accessToken,
    );
    if (response.status !== 200) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    throw new Error(`${localization.alert.deleteFailed} ${error}`);
  } finally {
    if (success) {
      updateTag("datasets");
    }
  }
}

export async function updateDataset(
  catalogId: string,
  initialDataset: Dataset,
  values: Dataset,
): Promise<Dataset> {
  const { published: _initialPublished, ...initialWithoutPublished } =
    initialDataset;
  const { published: _published, ...updatedDataset } =
    removeEmptyValues(values);

  const diff = compare(initialWithoutPublished, updatedDataset);

  if (diff.length === 0) {
    return initialDataset;
  }

  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }

  let response: Response;
  try {
    response = await update(
      catalogId,
      initialDataset.id,
      diff,
      session.accessToken,
    );
    if (response.status !== 200) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(`${localization.alert.fail} ${error}`);
    throw new Error("Noe gikk galt, prøv igjen...");
  }

  updateTag("dataset");
  updateTag("datasets");

  return await response.json();
}

export async function publishDataset(
  catalogId: string,
  datasetId: string,
): Promise<void> {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }

  try {
    const response = await publish(catalogId, datasetId, session.accessToken);
    if (response.status !== 200) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(`${localization.alert.fail} ${error}`);
    throw new Error("Noe gikk galt, prøv igjen...");
  }

  updateTag("dataset");
  updateTag("datasets");
}

export async function unpublishDataset(
  catalogId: string,
  dataset: Dataset,
): Promise<void> {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }

  try {
    const response = await unpublish(
      catalogId,
      dataset.id,
      session.accessToken,
    );
    if (response.status !== 200) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(`${localization.alert.fail} ${error}`);
    throw new Error("Noe gikk galt, prøv igjen...");
  } finally {
    updateTag("dataset");
    updateTag("datasets");
  }
}
