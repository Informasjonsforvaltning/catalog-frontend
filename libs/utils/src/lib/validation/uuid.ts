export const validUUID = (uuid?: string | null) => {
  return uuid?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{3,4}-[0-9a-f]{3,4}-[0-9a-f]{12}$/i) !== null;
};

/**
 * Validates UUID and throws an error if invalid
 * @param uuid - The UUID to validate
 * @param functionName - Name of the function calling this validation (for error message)
 * @throws Error if UUID is invalid
 */
export const validateUUID = (uuid: string, functionName: string): void => {
  if (!validUUID(uuid)) {
    throw new Error(`Invalid UUID '${uuid}' in ${functionName}. UUID must be a valid UUID format.`);
  }
};
