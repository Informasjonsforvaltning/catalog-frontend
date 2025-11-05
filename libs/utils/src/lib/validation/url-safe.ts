/**
 * Validates that a string is safe for URL construction and returns the encoded version
 * @param value - The string to validate and encode
 * @param fieldName - Name of the field being validated (for error messages)
 * @param functionName - Name of the function calling this validation (for error messages)
 * @returns The URL-encoded string
 * @throws Error if the string contains dangerous URL characters
 */
export const validateAndEncodeUrlSafe = (
  value: string,
  fieldName: string,
  functionName: string,
): string => {
  // Check for URL manipulation characters that could be used for SSRF
  const dangerousChars = ["/", "\\", "?", "#", "&", "=", "+", "%"];
  const foundChars = dangerousChars.filter((char) => value.includes(char));

  if (foundChars.length > 0) {
    throw new Error(
      `Invalid ${fieldName} '${value}' in ${functionName}. Contains dangerous URL characters: ${foundChars.join(", ")}`,
    );
  }

  return encodeURIComponent(value);
};
