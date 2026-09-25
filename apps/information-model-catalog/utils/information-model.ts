import { getInformationModelById } from "@catalog-frontend/data-access";
import {
  InformationModel,
  InformationModelToBeCreated,
} from "@catalog-frontend/types";
import { normalizeVersion, removeEmptyValues } from "@catalog-frontend/utils";
import { pick } from "lodash";

/** Fields accepted by catalog-backend InformationModelValues (mutable via JSON Patch). */
const MUTABLE_INFORMATION_MODEL_FIELDS = [
  "title",
  "description",
  "contactPoints",
  "status",
  "version",
] as const;

export const toMutableInformationModelValues = (
  model: InformationModel | InformationModelToBeCreated,
) => ({
  ...removeEmptyValues(pick(model, MUTABLE_INFORMATION_MODEL_FIELDS)),
  version: normalizeVersion(model.version),
});

export async function fetchInformationModelWithRetry(
  catalogId: string,
  informationModelId: string,
  accessToken: string,
  maxRetries: number = 3,
  timeout: number = 10000,
): Promise<InformationModel | null> {
  let retryCount = 0;
  const startTime = Date.now();

  const isTestEnvironment =
    process.env.NODE_ENV === "test" ||
    process.env.NX_TASK_TARGET_PROJECT?.includes("e2e");

  if (isTestEnvironment) {
    maxRetries = Math.min(maxRetries, 2);
    timeout = Math.min(timeout, 5000);
  }

  while (retryCount < maxRetries) {
    if (Date.now() - startTime > timeout) {
      console.warn(
        `[fetchInformationModelWithRetry] Timeout exceeded after ${timeout}ms`,
      );
      break;
    }

    const response = await getInformationModelById(
      catalogId,
      informationModelId,
      accessToken,
    );

    if (response.ok) {
      const informationModel = await response.json();
      if (retryCount > 0) {
        console.log(
          `[fetchInformationModelWithRetry] Successfully fetched information model after ${retryCount + 1} attempts`,
        );
      }
      return informationModel;
    }

    if (response.status === 404 && retryCount < maxRetries - 1) {
      const delay = isTestEnvironment
        ? 500 * (retryCount + 1)
        : 1000 * (retryCount + 1);
      console.log(
        `[fetchInformationModelWithRetry] Information model not found, retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      retryCount++;
      continue;
    }

    if (response.status !== 404) {
      console.error(
        `[fetchInformationModelWithRetry] Failed to fetch information model: ${response.status} ${response.statusText}`,
      );
    }
    break;
  }

  return null;
}
