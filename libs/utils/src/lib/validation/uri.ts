/**
 * Validates if a string is a valid URI
 * @param uri - The URI to validate
 * @returns true if the URI is valid, false otherwise
 */
export const validURI = (uri: string): boolean => {
  if (!uri || typeof uri !== "string") {
    return false;
  }

  try {
    new URL(uri);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates URI and throws an error if invalid
 * @param uri - The URI to validate
 * @param functionName - Name of the function calling this validation (for error message)
 * @throws Error if URI is invalid
 */
export const validateURI = (uri: string, functionName: string): void => {
  if (!validURI(uri)) {
    throw new Error(
      `Invalid URI '${uri}' in ${functionName}. URI must be a valid URL format.`,
    );
  }
};

/**
 * Validates multiple URIs in a single call
 * @param uris - Array of URIs to validate
 * @param functionName - Name of the function calling this validation
 * @throws Error if any URI is invalid
 */
export const validateURIs = (uris: string[], functionName: string): void => {
  uris.forEach((uri, index) => {
    try {
      validateURI(uri, `${functionName}[${index}]`);
    } catch (error) {
      throw new Error(
        `Invalid URI at index ${index}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  });
};
