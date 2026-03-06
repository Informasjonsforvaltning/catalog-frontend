"use server";

import { getValidSession } from "../helpers";

export async function isSessionValid(): Promise<boolean> {
  const session = await getValidSession();
  return Boolean(session);
}
