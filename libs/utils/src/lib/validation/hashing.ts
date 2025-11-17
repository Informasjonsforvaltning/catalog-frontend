import { createHash } from "crypto";

/**
 * Creates a hash of a string  can be a URI or UUID
 * @param id - The ID to be hashed
 * @returns the hash of the input
 */
export function hashText(id: string): string {
  return createHash("sha256").update(id).digest("hex");
}