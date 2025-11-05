# Dataset Catalog E2E Tests

This directory contains end-to-end tests for the dataset catalog application.

## Auto-Save Tests

The `autoSave.spec.ts` file contains comprehensive tests for the auto-save functionality in the dataset catalog. These tests verify that:

### Main Form Auto-Save

- **Restore Dialog Appearance**: Tests that the restore dialog appears after a page refresh when there are unsaved changes
- **Data Restoration**: Verifies that form data is correctly restored when clicking the "Gjenopprett" (Restore) button
- **Data Discard**: Ensures that data is properly discarded when clicking the "Forkast" (Discard) button
- **Multiple Refreshes**: Tests that the restore dialog appears multiple times until data is explicitly discarded
- **No Dialog When Clean**: Confirms that no restore dialog appears when there are no unsaved changes
- **Clear After Save**: Verifies that auto-save data is cleared after successful form submission

### Modal Dialog Auto-Save

- **Legal Restriction Modal**: Tests auto-save functionality for legal restriction modal dialogs
- **Distribution Modal**: Tests auto-save functionality for distribution modal dialogs
- **Modal Data Restoration**: Verifies that modal dialog data is correctly restored after page refresh

## Test Structure

Each test follows this pattern:

1. **Setup**: Create a test dataset and navigate to the edit page
2. **Action**: Make changes to form fields or modal dialogs
3. **Trigger**: Refresh the page to trigger auto-save restore dialog
4. **Verify**: Check that the restore dialog appears and functions correctly
5. **Cleanup**: Verify the final state is as expected

## Helper Methods

The tests use helper methods from the `DatasetEditPage` page object model:

- `expectRestoreDialog()`: Verifies the restore dialog is visible with correct elements
- `clickRestoreButton()`: Clicks the restore button and waits for dialog to close
- `clickDiscardButton()`: Clicks the discard button and waits for dialog to close
- `expectNoRestoreDialog()`: Verifies no restore dialog is visible
- `waitForAutoSaveToComplete()`: Waits for auto-save to complete before proceeding

## Running the Tests

To run the auto-save tests specifically:

```bash
npx playwright test autoSave.spec.ts
```

To run all admin tests:

```bash
npx playwright test admin/
```

## Test Data

Tests use randomly generated data to avoid conflicts and ensure test isolation. Each test creates its own dataset using the `createRandomDataset()` helper function.

## Auto-Save Implementation

The auto-save functionality is implemented using:

- **FormikAutoSaver**: A React component that automatically saves form data to localStorage
- **LocalDataStorage**: A utility class for managing localStorage data
- **Restore Dialog**: A modal dialog that appears when unsaved changes are detected

The auto-save system:

1. Monitors form changes using Formik's `dirty` state
2. Saves form data to localStorage when changes are detected
3. Shows a restore dialog when the page is refreshed with unsaved changes
4. Allows users to restore or discard the saved data
5. Clears saved data after successful form submission or explicit discard
