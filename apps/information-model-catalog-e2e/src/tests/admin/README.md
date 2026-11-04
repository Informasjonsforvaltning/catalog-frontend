# Information Model Catalog E2E Tests

End-to-end tests for the information model catalog.

## Test Structure

### Page Object Models

- `informationModelsPage.ts` - List page (search, filters, create button)
- `informationModelDetailPage.ts` - Detail page (details, edit, delete)
- `informationModelEditPage.ts` - New/edit form

### Test Files

- `loginPage.setup.ts` - Logs in as admin and stores the session
- `default.init.ts` - Removes stale test models left behind by earlier runs
- `default.teardown.ts` - Removes test models left behind by this run (safety net)
- `informationModelsPage.spec.ts` - Search finds a model by title; opening it shows the detail page
- `informationModelEditPage.spec.ts` - Creating a model through the form; editing the title
- `informationModelDetailPage.spec.ts` - Deleting an unpublished model; publishing/unpublishing, including the publication-state filter

## Running Tests

Set up `apps/information-model-catalog-e2e/.env.e2e.local`:

```
E2E_AUTH_ADMIN_ID=<synthetic person id>
E2E_CATALOG_ID=<organization number>
E2E_KEYCLOAK_ID_INFORMATION_MODEL_CATALOG_FRONTEND=<client id>
E2E_KEYCLOAK_SECRET_INFORMATION_MODEL_CATALOG_FRONTEND=<client secret>
E2E_NEXTAUTH_SECRET=<secret>
```

```bash
yarn nx e2e information-model-catalog-e2e
yarn nx e2e information-model-catalog-e2e --ui --debug
```

## Test Data Management

Test data is created and removed through the app's API routes
(`apps/information-model-catalog/app/api/catalogs/[catalogId]/information-models`:
GET, POST, DELETE `/[id]` and POST `/[id]/unpublish`), using the `adminApi`
fixture, which is authenticated with the stored admin session.

- `createdModels` fixture - `create()` makes a model via the API, `track()` registers
  one made through the UI. Both are removed (unpublished first if needed) when the test ends.
- `getRandomInformationModel()` - Random data that satisfies the form's validation schema

### Run-scoped test data

Every run uses the shared staging catalog, so test data is scoped to the run:

- `playwright.config.ts` sets `E2E_RUN_ID` (from `GITHUB_RUN_ID`/`GITHUB_RUN_ATTEMPT`
  in CI, or a timestamp locally).
- Test titles look like `test_informationmodel_<runId>_<suffix>_<timestamp>_<random>`.
- `deleteTestInformationModelsFromThisRun()` (`default.teardown.ts`) only removes models
  with this run's prefix.
- `deleteStaleTestInformationModels()` (`default.init.ts`) removes this run's models
  and any `test_informationmodel_` model older than 2 hours. Models from runs that
  may still be in progress are left alone.
