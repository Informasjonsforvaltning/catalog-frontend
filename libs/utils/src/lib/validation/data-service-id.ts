export const validDataServiceID = (id?: string | null) => {
  return id?.match(/^[0-9a-f-]{20,40}$/i) !== null;
};

/**
 * Validates data service ID and throws an error if invalid
 * @param id - The ID to validate
 * @param functionName - Name of the function calling this validation (for error message)
 * @throws Error if data service ID is invalid
 */
export const validateDataServiceID = (
  id: string,
  functionName: string,
): void => {
  if (!validDataServiceID(id)) {
    throw new Error(
      `Invalid data service ID '${id}' in ${functionName}. ID must be a valid data service ID format.`,
    );
  }
};
