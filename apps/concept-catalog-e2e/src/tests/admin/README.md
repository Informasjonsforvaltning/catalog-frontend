# Concept Catalog E2E Tests

This directory contains end-to-end tests for the concept catalog application.

## Auto-Save Tests

The `autoSave.spec.ts` file contains comprehensive tests for the auto-save functionality in the concept catalog. These tests verify that:

### Main Form Auto-Save
- **Restore Dialog Appearance**: Tests that the restore dialog appears after a page refresh when there are unsaved changes
- **Data Restoration**: Verifies that form data is correctly restored when clicking the "Gjenopprett" (Restore) button
- **Data Discard**: Ensures that data is properly discarded when clicking the "Forkast" (Discard) button
- **Multiple Refreshes**: Tests that the restore dialog appears multiple times until data is explicitly discarded
- **No Dialog When Clean**: Confirms that no restore dialog appears when there are no unsaved changes
- **Clear After Save**: Verifies that auto-save data is cleared after successful form submission

### Concept-Specific Auto-Save
- **Anbefalt Term**: Tests auto-save functionality for the recommended term field
- **Definition**: Tests auto-save functionality for concept definitions
- **Tillatt Term**: Tests auto-save functionality for allowed terms
- **Relation Modal**: Tests auto-save functionality for relation modal dialogs
- **Modal Data Restoration**: Verifies that modal dialog data is correctly restored after page refresh

## Test Structure

Each test follows this pattern:
1. **Setup**: Create a test concept and navigate to the edit page
2. **Action**: Make changes to form fields or modal dialogs
3. **Trigger**: Refresh the page to trigger auto-save restore dialog
4. **Verify**: Check that the restore dialog appears and functions correctly
5. **Cleanup**: Verify the final state is as expected

## Helper Methods

The tests use helper methods from the `EditPage` page object model:

- `expectRestoreDialog()`: Verifies the restore dialog is visible with correct elements
- `clickRestoreButton()`: Clicks the restore button and waits for dialog to close
- `clickDiscardButton()`: Clicks the discard button and waits for dialog to close
- `expectNoRestoreDialog()`: Verifies no restore dialog is visible
- `waitForAutoSaveToComplete()`: Waits for auto-save to complete before proceeding
- `expectAnbefaltTermField()`: Verifies the recommended term field has expected value
- `fillAnbefaltTermField()`: Fills in the recommended term field
- `expectDefinitionField()`: Verifies the definition field has expected value
- `fillDefinitionField()`: Fills in the definition field
- `clickAddRelation()`: Opens the relation modal dialog
- `clickSaveButton()`: Saves the form and waits for success message

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

Tests use randomly generated data to avoid conflicts and ensure test isolation. Each test creates its own concept using the `createRandomConcept()` helper function.

## Auto-Save Implementation

The auto-save functionality is implemented using:
- **FormikAutoSaver**: A React component that automatically saves form data to localStorage
- **LocalDataStorage**: A utility class for managing localStorage data with secondary storage support
- **Restore Dialog**: A modal dialog that appears when unsaved changes are detected

The auto-save system:
1. Monitors form changes using Formik's `dirty` state
2. Saves form data to localStorage when changes are detected
3. Supports secondary storage for complex data like relations and definitions
4. Shows a restore dialog when the page is refreshed with unsaved changes
5. Allows users to restore or discard the saved data
6. Clears saved data after successful form submission or explicit discard

## Concept-Specific Features

The concept catalog auto-save system includes additional features:
- **Secondary Storage**: Handles complex data structures like relations and definitions
- **Multi-language Support**: Auto-saves data in Norwegian (Bokmål, Nynorsk) and English
- **Relation Management**: Auto-saves relation data including internal and external concepts
- **Definition Sources**: Auto-saves definition source information and relationships 