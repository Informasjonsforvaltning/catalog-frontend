# Data Service Catalog E2E Tests

This directory contains end-to-end tests for the data service catalog application.

## Test Structure

### Page Object Models

- `dataServicesPage.ts` - Tests for the data services list page
- `dataServiceDetailPage.ts` - Tests for individual data service detail pages
- `dataServiceEditPage.ts` - Tests for data service creation and editing forms

### Test Files

- `dataServicesPage.spec.ts` - Tests for data services list functionality
- `dataServiceEditPage.spec.ts` - Tests for data service creation and editing
- `dataServiceDetailPage.spec.ts` - Tests for data service detail page functionality
- `loginPage.setup.ts` - Authentication setup
- `default.init.ts` - Test data cleanup

## Test Coverage

### Data Services List Page

- Loading data services page
- Search functionality
- Filter functionality (status, publication state)
- Create data service button visibility
- Data service card display

### Data Service Creation/Editing

- Form field validation
- Required field validation
- Auto-save functionality
- Form cancellation
- Data service creation flow
- Data service editing flow

### Data Service Detail Page

- Display data service details
- Publish/unpublish functionality
- Edit navigation
- Delete functionality
- URL structure validation

## Running Tests

### Prerequisites

- Set up environment variables in `.env.e2e.local`:
  ```
  E2E_ADMIN_EMAIL=admin@example.com
  E2E_ADMIN_PASSWORD=password
  E2E_CATALOG_ID=your-catalog-id
  BASE_URL=http://localhost:4200
  ```

### Commands

```bash
# Run all tests
yarn nx e2e data-service-catalog-e2e

# Run tests in debug mode
yarn nx e2e data-service-catalog-e2e --debug

# Run specific test file
yarn nx e2e data-service-catalog-e2e --grep "should create new data service"
```

## Test Data Management

Tests use the following utilities for data management:

- `createDataService()` - Creates test data services via API
- `deleteDataService()` - Cleans up test data services
- `publishDataService()` - Publishes data services for testing
- `getRandomDataService()` - Generates random test data that satisfies the form's validation schema
- `getMinimalDataService()` - Minimal data for the API only. It has no contact point, so the **form** rejects
  it; using it in a form test makes the save fail silently and the test pass for the wrong reason

## Accessibility Testing

The page objects expose `checkAccessibility()` (axe-core, WCAG 2.0/2.1/2.2 AA plus best practices), but **no
test in this suite currently calls it**, so accessibility is not verified here today. `concept-catalog-e2e` and
`service-catalog-e2e` do call it, and are the examples to follow when enabling it.

## Test Patterns

### Page Object Model Pattern

Tests use the Page Object Model pattern to encapsulate page-specific logic and selectors.

### API Setup Pattern

Tests use API calls to set up and clean up test data, ensuring tests are isolated and repeatable.

### Accessibility Integration

All page objects include accessibility testing capabilities that can be enabled per test.

## Common Issues

### Timeout Issues

If tests fail with timeout errors, check:

- Server response times
- Network connectivity
- Environment configuration

### Selector Issues

If element selectors fail, verify:

- Page structure hasn't changed
- Localization text is correct
- Element attributes are as expected

### Data Cleanup Issues

If tests fail due to existing data:

- Check that `default.init.ts` is running
- Verify API endpoints are accessible
- Ensure proper authentication

## Adding New Tests

1. Create page object model if needed
2. Add test data utilities if needed
3. Write test using the `runTestAsAdmin` pattern
4. Include proper cleanup in tests
5. Add accessibility checks where appropriate
