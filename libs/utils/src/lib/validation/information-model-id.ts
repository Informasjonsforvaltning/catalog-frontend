export const validInformationModelID = (id?: string | null) => {
  return id?.match(/^[0-9a-f-]{20,40}$/i) !== null;
};

/**
 * Validates information model ID and throws an error if invalid
 * @param id - The ID to validate
 * @param functionName - Name of the function calling this validation (for error message)
 * @throws Error if information model ID is invalid
 */
export const validateInformationModelID = (
  id: string,
  functionName: string,
): void => {
  if (!validInformationModelID(id)) {
    throw new Error(
      `Invalid information model ID '${id}' in ${functionName}. ID must be a valid information model ID format.`,
    );
  }
};
