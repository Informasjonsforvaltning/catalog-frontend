"use server";

import {
  deleteDataset as removeDataset,
  getAllDatasets as getAll,
  getById,
  postDataset,
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

export async function getDatasets(catalogId: string) {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  const response = await getAll(catalogId, `${session?.accessToken}`);
  if (response.status !== 200) {
    throw new Error(
      `API responded with status ${response.status} for getAllDatasets`,
    );
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
  const response = await getById(
    catalogId,
    datasetId,
    `${session?.accessToken}`,
  );

  if (response.status !== 200) {
    throw new Error(
      `API responded with status ${response.status} for getDatasetById`,
    );
  }

  return await response.json();
}

export async function createDataset(
  values: DatasetToBeCreated,
  catalogId: string,
) {
  const datasetNoEmptyValues = removeEmptyValues(values);

  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  let datasetId: undefined | string = undefined;
  try {
    const response = await postDataset(
      datasetNoEmptyValues,
      catalogId,
      `${session?.accessToken}`,
    );
    if (response.status !== 201) {
      throw new Error(
        `API responded with status ${response.status} for createDataset`,
      );
    }

    datasetId = response?.headers?.get("location")?.split("/").pop();
  } catch (error) {
    console.error(error);
    throw new Error(
      error instanceof Error ? error.message : localization.alert.createFailed,
    );
  }
  updateTag("dataset");
  updateTag("datasets");
  return datasetId;
}

export async function deleteDataset(catalogId: string, datasetId: string) {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  try {
    const response = await removeDataset(
      catalogId,
      datasetId,
      `${session?.accessToken}`,
    );
    if (response.status !== 200) {
      throw new Error(
        `API responded with status ${response.status} for deleteDataset`,
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error(
      error instanceof Error ? error.message : localization.alert.deleteFailed,
    );
  }
  updateTag("datasets");
}

export async function updateDataset(
  catalogId: string,
  initialDataset: Dataset,
  values: Dataset,
) {
  const updatedDataset = removeEmptyValues(values);

  const diff = compare(initialDataset, updatedDataset);

  if (diff.length === 0) {
    throw new Error(localization.alert.noChanges);
  }

  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }

  try {
    const response = await update(
      catalogId,
      initialDataset.id,
      diff,
      `${session?.accessToken}`,
    );
    if (response.status !== 200) {
      throw new Error(
        `API responded with status ${response.status} for updateDataset`,
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error(
      error instanceof Error ? error.message : localization.alert.updateFailed,
    );
  }
  updateTag("dataset");
  updateTag("datasets");
}

export async function publishDataset(
  catalogId: string,
  initialDataset: Dataset,
  values: Dataset,
) {
  const diff = compare(initialDataset, values);

  if (diff.length === 0) {
    throw new Error(localization.alert.noChanges);
  }

  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }

  try {
    const response = await update(
      catalogId,
      initialDataset.id,
      diff,
      `${session?.accessToken}`,
    );
    if (response.status !== 200) {
      throw new Error(
        `API responded with status ${response.status} for publishDataset`,
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error(
      error instanceof Error ? error.message : localization.alert.publishFailed,
    );
  }

  updateTag("dataset");
}
