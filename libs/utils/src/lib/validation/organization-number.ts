export const validOrganizationNumber = (organizationNumber: string) => {
  return RegExp(/^\d{9}$/).exec(organizationNumber) !== null;
};

/**
 * Validates organization number and throws an error if invalid
 * @param organizationNumber - The organization number to validate
 * @param functionName - Name of the function calling this validation (for error message)
 * @throws Error if organization number is invalid
 */
export const validateOrganizationNumber = (organizationNumber: string, functionName: string): void => {
  if (!validOrganizationNumber(organizationNumber)) {
    throw new Error(
      `Invalid organization number '${organizationNumber}' in ${functionName}. Organization number must be a 9-digit number.`,
    );
  }
};
