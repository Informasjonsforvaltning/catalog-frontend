"use server";

import {
  deleteInformationModel as removeInformationModel,
  deleteInformationModelImportResult as removeImportResult,
  getAllInformationModels,
  postInformationModel,
  publishInformationModel as publish,
  unpublishInformationModel as unpublish,
  updateInformationModel as update,
} from "@catalog-frontend/data-access";
import {
  getValidSession,
  localization,
  redirectToSignIn,
  removeEmptyValues,
} from "@catalog-frontend/utils";
import {
  InformationModel,
  InformationModelToBeCreated,
} from "@catalog-frontend/types";
import { updateTag } from "next/cache";
import { compare } from "fast-json-patch";

export async function getInformationModels(
  catalogId: string,
): Promise<InformationModel[]> {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }

  const response = await getAllInformationModels(
    catalogId,
    session.accessToken,
  );
  if (response.status !== 200) {
    throw new Error(
      "getInformationModels failed with response code " + response.status,
    );
  }
  return await response.json();
}

export async function createInformationModel(
  catalogId: string,
  values: InformationModelToBeCreated,
): Promise<string> {
  console.log(
    `[createInformationModel] Starting creation for catalog ${catalogId}`,
  );
  const newInformationModel = removeEmptyValues({ ...values });
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  let success = false;
  let informationModelId: undefined | string = undefined;
  try {
    const response = await postInformationModel(
      newInformationModel,
      catalogId,
      session.accessToken,
    );
    if (response.status !== 201) {
      throw new Error(
        `Failed to create information model: ${response.status} ${response.statusText}`,
      );
    }

    const locationHeader = response.headers.get("location");
    if (!locationHeader) {
      throw new Error("No location header returned from server");
    }

    informationModelId = locationHeader?.split("/").pop();
    if (!informationModelId) {
      throw new Error(
        "Could not extract information model ID from location header",
      );
    }

    console.log(
      `[createInformationModel] Successfully created information model with ID: ${informationModelId}`,
    );
    success = true;
    return informationModelId;
  } catch (error) {
    console.error("Error creating information model:", error);
    throw new Error(localization.alert.fail);
  } finally {
    if (success) {
      console.log(
        `[createInformationModel] Revalidating cache tags for information model ${informationModelId}`,
      );
      updateTag("information-model");
      updateTag("information-models");
    }
  }
}

export async function deleteInformationModel(
  catalogId: string,
  informationModelId: string,
): Promise<void> {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  let success = false;
  try {
    const response = await removeInformationModel(
      catalogId,
      informationModelId,
      session.accessToken,
    );
    if (response.status !== 204) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    throw new Error(localization.alert.deleteFailed);
  } finally {
    if (success) {
      updateTag("information-models");
    }
  }
}

export async function updateInformationModel(
  catalogId: string,
  initialInformationModel: InformationModel,
  values: InformationModel,
): Promise<InformationModel> {
  const updatedInformationModel = removeEmptyValues({ ...values });

  const diff = compare(initialInformationModel, updatedInformationModel);

  if (diff.length === 0) {
    return initialInformationModel;
  }

  let success = false;
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }

  try {
    const response = await update(
      catalogId,
      initialInformationModel.id,
      diff,
      session.accessToken,
    );
    if (response.status !== 200) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    success = true;

    return await response.json();
  } catch (error) {
    console.error("Error updating information model:", error);
    throw new Error(localization.alert.fail);
  } finally {
    if (success) {
      updateTag("information-model");
      updateTag("information-models");
    }
  }
}

export async function publishInformationModel(
  catalogId: string,
  informationModelId: string,
): Promise<void> {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  let success = false;
  try {
    const response = await publish(
      catalogId,
      informationModelId,
      session.accessToken,
    );
    if (response.status !== 200) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    throw new Error(localization.alert.deleteFailed);
  } finally {
    if (success) {
      updateTag("information-model");
      updateTag("information-models");
    }
  }
}

export async function unpublishInformationModel(
  catalogId: string,
  informationModelId: string,
): Promise<void> {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  let success = false;
  try {
    const response = await unpublish(
      catalogId,
      informationModelId,
      session.accessToken,
    );
    if (response.status !== 200) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    throw new Error(localization.alert.deleteFailed);
  } finally {
    if (success) {
      updateTag("information-model");
      updateTag("information-models");
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
      session.accessToken,
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
