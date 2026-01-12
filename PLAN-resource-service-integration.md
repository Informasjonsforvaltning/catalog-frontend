# Plan: Resource Service Integration for "Gå til side" Button

## Overview
The "Gå til side" button needs to link to the external FDK portal (data.norge.no) using the FDK dataset ID, not the catalog-frontend dataset ID. The catalog-frontend uses `uri` as the unique identifier, while FDK uses a different `id`. We need to query the resource service to get the FDK `id` from the dataset `uri`.

## Current State

### Dataset Object
- The `Dataset` type has a `uri?: string` property (line 8 in `libs/types/src/lib/dataset.ts`)
- This URI is the catalog-frontend identifier (e.g., `https://registrering.staging.fellesdatakatalog.digdir.no/catalogs/910244132/datasets/1d72d01d-c1ae-411c-8339-de10a194cde7`)

### Current Button Implementation
- Located in `apps/dataset-catalog/components/publish-switch/index.tsx`
- Currently uses: `${referenceDataEnv}/nb/datasets/${dataset.id}` (incorrect - uses catalog-frontend ID)
- Should use: `${referenceDataEnv}/nb/datasets/${fdkDatasetId}` (correct - uses FDK ID)

### Page Data Flow
- Server component: `apps/dataset-catalog/app/catalogs/[catalogId]/datasets/[datasetId]/page.tsx`
  - Fetches dataset via `getDatasetById()` (server-side)
  - Passes `referenceDataEnv` (FDK_BASE_URI) to client component
  - Does NOT currently query resource service

## Resource Service API

### Endpoint Pattern
```
GET {RESOURCE_SERVICE_BASE_URI}/v1/resources/by-uri?uri={encodedUri}
```

### Example (Staging)
```bash
curl -X 'GET' \
  'https://resource.api.staging.fellesdatakatalog.digdir.no/v1/resources/by-uri?uri=https%3A%2F%2Fregistrering.staging.fellesdatakatalog.digdir.no%2Fcatalogs%2F910244132%2Fdatasets%2F1d72d01d-c1ae-411c-8339-de10a194cde7' \
  -H 'accept: application/json'
```

### Response Structure
```json
{
  "id": "433c630e-48ed-368d-8d19-5816586ba5c5",
  "uri": "https://registrering.staging.fellesdatakatalog.digdir.no/catalogs/910244132/datasets/1d72d01d-c1ae-411c-8339-de10a194cde7",
  "type": "datasets",
  "title": {
    "en": null,
    "nb": "Sparkesykkeloversikt",
    "nn": null,
    "no": null
  },
  // ... other properties
}
```

### Environment Variable
**Status**: ❌ **NOT FOUND** - No `RESOURCE_SERVICE_BASE_URI` or similar environment variable exists in the codebase.

**Action Required**: 
- Add `RESOURCE_SERVICE_BASE_URI` environment variable to deployment configs
- Add to `deploy/staging/dataset-catalog-frontend/dataset-catalog-frontend-env.yaml`
- Add to `deploy/prod/dataset-catalog-frontend/dataset-catalog-frontend-env.yaml`
- Add to `deploy/demo/dataset-catalog-frontend/dataset-catalog-frontend-env.yaml` (if applicable)

## Implementation Plan

### Step 1: Add Environment Variable
- [ ] Add `RESOURCE_SERVICE_BASE_URI` to all environment deployment YAML files
- [ ] Pattern: `https://resource.api.{env}.fellesdatakatalog.digdir.no` (or `https://resource.api.fellesdatakatalog.digdir.no` for prod)

### Step 2: Create Resource Service API Function
**File**: `libs/data-access/src/lib/resource-service/api/index.ts` (new file)

**Function**:
```typescript
export const getResourceByUri = async (uri: string): Promise<Response> => {
  // Validate URI
  // Encode URI properly
  // Fetch from: ${process.env.RESOURCE_SERVICE_BASE_URI}/v1/resources/by-uri?uri=${encodedUri}
  // Return response
}
```

**Considerations**:
- URI encoding (use `encodeURIComponent`)
- Error handling
- Response validation

### Step 3: Create Server Action (Optional)
**File**: `apps/dataset-catalog/app/actions/actions.ts`

**Function**:
```typescript
export async function getFdkDatasetIdByUri(uri: string): Promise<string | null> {
  // Call getResourceByUri
  // Parse response
  // Extract and return the 'id' field
  // Return null if not found or error
}
```

### Step 4: Update Server Page Component
**File**: `apps/dataset-catalog/app/catalogs/[catalogId]/datasets/[datasetId]/page.tsx`

**Changes**:
- After `getDatasetById()`, check if `dataset.uri` exists
- If exists, call `getFdkDatasetIdByUri(dataset.uri)` (or directly call API)
- Pass `fdkDatasetId` to `DatasetDetailsPageClient`

**Code Pattern**:
```typescript
const dataset = await getDatasetById(catalogId, datasetId);
let fdkDatasetId: string | null = null;

if (dataset.uri) {
  try {
    const resourceResponse = await getResourceByUri(dataset.uri);
    if (resourceResponse.ok) {
      const resource = await resourceResponse.json();
      fdkDatasetId = resource.id;
    }
  } catch (error) {
    // Log error but don't fail the page
    console.error('Failed to fetch FDK dataset ID:', error);
  }
}

// Pass to client component
<DatasetDetailsPageClient
  // ... existing props
  fdkDatasetId={fdkDatasetId}
/>
```

### Step 5: Update Client Component Props
**File**: `apps/dataset-catalog/app/catalogs/[catalogId]/datasets/[datasetId]/dataset-details-page-client.tsx`

**Changes**:
- Add `fdkDatasetId?: string | null` to props interface
- Pass to `RightColumn` component

### Step 6: Update RightColumn Component
**File**: `apps/dataset-catalog/components/details-page-columns/details-page-right-column.tsx`

**Changes**:
- Add `fdkDatasetId?: string | null` to props
- Pass to `PublishSwitch` component

### Step 7: Update PublishSwitch Component
**File**: `apps/dataset-catalog/components/publish-switch/index.tsx`

**Changes**:
- Add `fdkDatasetId?: string | null` to props
- Update LinkButton href logic:
  ```typescript
  {fdkDatasetId ? (
    <LinkButton
      href={`${referenceDataEnv}/nb/datasets/${fdkDatasetId}`}
      data-variant='secondary'
      data-size='sm'
    >
      {localization.button.goToPage}
    </LinkButton>
  ) : null}
  ```
- Only show button if `fdkDatasetId` is available

## Error Handling Strategy

1. **Missing URI**: If `dataset.uri` is not present, don't show the button
2. **Resource Service Failure**: If API call fails, log error but don't fail page load, don't show button
3. **Missing ID in Response**: If response doesn't contain `id`, don't show button
4. **Network Errors**: Handle gracefully, don't block page rendering

## Testing Considerations

1. Test with dataset that has `uri` and is published in FDK
2. Test with dataset that has `uri` but is not found in resource service
3. Test with dataset that doesn't have `uri`
4. Test error scenarios (network failure, malformed response)
5. Verify URL construction for staging, demo, and prod environments

## Performance Considerations

- Resource service call is server-side, so it won't block client rendering
- Consider caching the FDK ID if the same dataset is viewed multiple times
- The API call adds latency - ensure it doesn't significantly slow down page load

## Open Questions

1. ✅ **Endpoint pattern**: Confirmed - `/v1/resources/by-uri?uri={encodedUri}`
2. ❓ **Environment variable naming**: Should it be `RESOURCE_SERVICE_BASE_URI` or `FDK_RESOURCE_SERVICE_BASE_URI`?
3. ❓ **Caching**: Should we cache the FDK ID? If so, how long?
4. ❓ **Error visibility**: Should we show any indication to the user if the button can't be displayed?

## Files to Modify

1. `deploy/staging/dataset-catalog-frontend/dataset-catalog-frontend-env.yaml` - Add env var
2. `deploy/prod/dataset-catalog-frontend/dataset-catalog-frontend-env.yaml` - Add env var
3. `deploy/demo/dataset-catalog-frontend/dataset-catalog-frontend-env.yaml` - Add env var (if exists)
4. `libs/data-access/src/lib/resource-service/api/index.ts` - New file, API function
5. `apps/dataset-catalog/app/catalogs/[catalogId]/datasets/[datasetId]/page.tsx` - Fetch FDK ID
6. `apps/dataset-catalog/app/catalogs/[catalogId]/datasets/[datasetId]/dataset-details-page-client.tsx` - Pass prop
7. `apps/dataset-catalog/components/details-page-columns/details-page-right-column.tsx` - Pass prop
8. `apps/dataset-catalog/components/publish-switch/index.tsx` - Use FDK ID in URL

## Notes

- The resource service appears to be a separate service from the search service (`FDK_SEARCH_SERVICE_BASE_URI`)
- The endpoint uses query parameter `uri` (not path parameter)
- URI must be properly URL-encoded
- Response is JSON with `id` field that we need
