/**
 * Validates if a string is a valid search query
 * @param query - The search query to validate
 * @returns true if the query is valid, false otherwise
 */
export const validSearchQuery = (query: string): boolean => {
  if (!query || typeof query !== 'string') {
    return false;
  }
  
  // Basic validation: query should not be empty and should have reasonable length
  return query.trim().length > 0 && query.length <= 1000;
};

/**
 * Validates search query and throws an error if invalid
 * @param query - The search query to validate
 * @param functionName - Name of the function calling this validation (for error message)
 * @throws Error if search query is invalid
 */
export const validateSearchQuery = (query: string, functionName: string): void => {
  if (!validSearchQuery(query)) {
    throw new Error(`Invalid search query '${query}' in ${functionName}. Query must be a non-empty string with maximum length of 1000 characters.`);
  }
};

/**
 * Validates if a string is a valid resource type
 * @param resourceType - The resource type to validate
 * @returns true if the resource type is valid, false otherwise
 */
export const validResourceType = (resourceType: string): boolean => {
  if (!resourceType || typeof resourceType !== 'string') {
    return false;
  }
  
  // Basic validation: resource type should be alphanumeric with possible hyphens/underscores
  return /^[a-zA-Z0-9_-]+$/.test(resourceType) && resourceType.length <= 50;
};

/**
 * Validates resource type and throws an error if invalid
 * @param resourceType - The resource type to validate
 * @param functionName - Name of the function calling this validation (for error message)
 * @throws Error if resource type is invalid
 */
export const validateResourceType = (resourceType: string, functionName: string): void => {
  if (!validResourceType(resourceType)) {
    throw new Error(`Invalid resource type '${resourceType}' in ${functionName}. Resource type must be alphanumeric with hyphens/underscores and maximum length of 50 characters.`);
  }
};

/**
 * Validates if a string is a valid environment URL
 * @param env - The environment URL to validate
 * @returns true if the environment URL is valid, false otherwise
 */
export const validEnvironmentURL = (env: string): boolean => {
  if (!env || typeof env !== 'string') {
    return false;
  }
  
  try {
    new URL(env);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates environment URL and throws an error if invalid
 * @param env - The environment URL to validate
 * @param functionName - Name of the function calling this validation (for error message)
 * @throws Error if environment URL is invalid
 */
export const validateEnvironmentURL = (env: string, functionName: string): void => {
  if (!validEnvironmentURL(env)) {
    throw new Error(`Invalid environment URL '${env}' in ${functionName}. Environment URL must be a valid URL format.`);
  }
};
