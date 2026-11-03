"use server";

import { Design } from "@catalog-frontend/types";
import { getDesign } from "./index";

export type CatalogDesignResult =
  | { ok: true; design: Design }
  | { ok: false; status: number };

export const getCatalogDesign = async (
  catalogId: string,
  accessToken: string,
): Promise<CatalogDesignResult> => {
  const response = await getDesign(catalogId, accessToken);
  if (!response.ok) {
    return { ok: false, status: response.status };
  }
  const design: Design = await response.json();
  return { ok: true, design };
};
