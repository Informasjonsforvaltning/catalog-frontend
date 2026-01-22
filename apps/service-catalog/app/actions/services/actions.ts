"use server";

import {
  createService as create,
  deleteService as removeService,
  getAllServices as getAll,
  getServiceById as getById,
  publishService as publish,
  unpublishService as unpublish,
  updateService as update,
} from "@catalog-frontend/data-access";
import { Service, ServiceToBeCreated } from "@catalog-frontend/types";
import {
  getValidSession,
  localization,
  redirectToSignIn,
  removeEmptyValues,
} from "@catalog-frontend/utils";
import { compare } from "fast-json-patch";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function getServices(catalogId: string) {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }

  const response = await getAll(catalogId, `${session?.accessToken}`);
  if (response.status !== 200) {
    throw new Error(
      `API responded with status ${response.status} for getAllServices`,
    );
  }
  const jsonResponse = await response.json();
  return jsonResponse;
}

export async function getServiceById(catalogId: string, serviceId: string) {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  const response = await getById(
    catalogId,
    serviceId,
    `${session?.accessToken}`,
  );

  if (response.status !== 200) {
    throw new Error(
      `API responded with status ${response.status} for getServiceById`,
    );
  }

  const jsonResponse = await response.json();
  return jsonResponse;
}

export async function createService(
  catalogId: string,
  values: ServiceToBeCreated,
) {
  const newService = removeEmptyValues(values);
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  let serviceId = undefined;
  try {
    const response = await create(
      newService,
      catalogId,
      `${session?.accessToken}`,
    );
    if (response.status !== 201) {
      throw new Error(
        `API responded with status ${response.status} for createService`,
      );
    }
    serviceId = response?.headers?.get("location")?.split("/").pop();
  } catch (error) {
    console.error(error);
    throw new Error(
      error instanceof Error ? error.message : localization.alert.createFailed,
    );
  }
  updateTag("service");
  updateTag("services");
  return serviceId;
}

export async function deleteService(catalogId: string, serviceId: string) {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  try {
    const response = await removeService(
      catalogId,
      serviceId,
      `${session?.accessToken}`,
    );
    if (response.status !== 204) {
      throw new Error(
        `API responded with status ${response.status} for deleteService`,
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error(
      error instanceof Error ? error.message : localization.alert.deleteFailed,
    );
  }
  updateTag("services");
  redirect(`/catalogs/${catalogId}/services`);
}

export async function updateService(
  catalogId: string,
  oldService: Service,
  values: Service,
) {
  const updatedService = removeEmptyValues(values);

  const updatedServiceMerged = {
    ...oldService,
    title: updatedService.title,
    description: updatedService.description,
    produces: updatedService.produces,
    contactPoints: updatedService.contactPoints,
    homepage: updatedService.homepage,
    status: updatedService.status,
    spatial: updatedService.spatial,
    subject: updatedService.subject,
  };

  const diff = compare(oldService, updatedServiceMerged);

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
      oldService.id,
      diff,
      `${session?.accessToken}`,
    );
    if (response.status !== 200) {
      throw new Error(
        `API responded with status ${response.status} for updateService`,
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error(
      error instanceof Error ? error.message : localization.alert.updateFailed,
    );
  }
  updateTag("service");
  updateTag("services");
}

export async function publishService(catalogId: string, serviceId: string) {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  try {
    const response = await publish(
      catalogId,
      serviceId,
      `${session?.accessToken}`,
    );
    if (response.status !== 200) {
      throw new Error(
        `API responded with status ${response.status} for publishService`,
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error(
      error instanceof Error ? error.message : localization.alert.publishFailed,
    );
  }
  updateTag("service");
  updateTag("services");
}

export async function unpublishService(catalogId: string, serviceId: string) {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  try {
    const response = await unpublish(
      catalogId,
      serviceId,
      `${session?.accessToken}`,
    );
    if (response.status !== 200) {
      throw new Error(
        `API responded with status ${response.status} for unpublishService`,
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error(
      error instanceof Error
        ? error.message
        : localization.alert.unpublishFailed,
    );
  }
  updateTag("service");
  updateTag("services");
}
