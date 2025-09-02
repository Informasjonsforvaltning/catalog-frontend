import { getDataServiceById } from '@catalog-frontend/data-access';

/**
 * Fetches a data service with retry mechanism to handle race conditions
 * @param catalogId - The catalog ID
 * @param dataServiceId - The data service ID
 * @param accessToken - The access token
 * @param maxRetries - Maximum number of retries (default: 3)
 * @param timeout - Maximum time to wait in milliseconds (default: 10000)
 * @returns The data service object or null if not found after all retries
 */
export async function fetchDataServiceWithRetry(
  catalogId: string,
  dataServiceId: string,
  accessToken: string,
  maxRetries: number = 3,
  timeout: number = 10000,
): Promise<any> {
  let retryCount = 0;
  const startTime = Date.now();
  
  // Check if we're in a test environment (E2E tests)
  const isTestEnvironment = process.env.NODE_ENV === 'test' || process.env.NX_TASK_TARGET_PROJECT?.includes('e2e');
  
  // Adjust retry behavior for test environment
  if (isTestEnvironment) {
    maxRetries = Math.min(maxRetries, 2); // Fewer retries in tests
    timeout = Math.min(timeout, 5000); // Shorter timeout in tests
  }

  while (retryCount < maxRetries) {
    // Check if we've exceeded the timeout
    if (Date.now() - startTime > timeout) {
      console.warn(`[fetchDataServiceWithRetry] Timeout exceeded after ${timeout}ms`);
      break;
    }

    const response = await getDataServiceById(catalogId, dataServiceId, accessToken);

    if (response.ok) {
      const dataService = await response.json();
      if (retryCount > 0) {
        console.log(`[fetchDataServiceWithRetry] Successfully fetched data service after ${retryCount + 1} attempts`);
      }
      return dataService;
    }

    // If it's a 404 and we haven't exhausted retries, wait and retry
    if (response.status === 404 && retryCount < maxRetries - 1) {
      const delay = isTestEnvironment ? 500 * (retryCount + 1) : 1000 * (retryCount + 1); // Shorter delays in tests
      console.log(
        `[fetchDataServiceWithRetry] Data service not found, retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      retryCount++;
      continue;
    }

    // For other errors or after max retries, log and return null
    if (response.status !== 404) {
      console.error(
        `[fetchDataServiceWithRetry] Failed to fetch data service: ${response.status} ${response.statusText}`,
      );
    }
    break;
  }

  return null;
}
