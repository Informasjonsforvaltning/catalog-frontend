# Merge Plan: main → feat/el/dataset-ds-upgrade-merge

## Overview

This document outlines all conflicts and potential conflicts when merging `main` **INTO** `feat/el/dataset-ds-upgrade-merge`. The goal is to update the branch with all changes from main so it can be merged into main later via pull request without conflicts.

The branch contains significant design system upgrades and UI improvements that should be preserved, while main has received many new features and bug fixes that need to be incorporated.

**Total files with conflicts**: ~150+ files  
**Total files changed in branch**: 222 files  
**Branch focus**: Design system upgrades, UI component improvements, Header/Breadcrumbs upgrades

---

## Strategy

**General approach:**
- ✅ **Keep from branch (ours)**: All design system upgrades, UI component improvements, Header/Breadcrumbs changes
- ✅ **Keep from main (theirs)**: New features, bug fixes, functional improvements (except where they conflict with design system upgrades)
- ⚠️ **Manual review needed**: Files with overlapping changes

**Note**: When merging main INTO the branch:
- `--ours` = branch version (feat/el/dataset-ds-upgrade-merge)
- `--theirs` = main version

---

## Critical Files - Special Handling Required

### 1. `libs/ui/src/lib/form-sidemenu/index.tsx` ⚠️ **KEEP FROM BRANCH**
- **Status**: File exists in branch, does NOT exist in main
- **Action**: **KEEP BRANCH VERSION** - This is a new component created in the branch
- **Note**: You mentioned a previous attempt messed up this file, so ensure the branch version is preserved
- **Location**: `libs/ui/src/lib/form-sidemenu/index.tsx`

### 2. `libs/ui/src/lib/new-dataset-modal/index.tsx` ⚠️ **KEEP FROM MAIN**
- **Status**: Both branches modified this file significantly
- **Branch version**: Uses `Dialog` component, simpler implementation
- **Main version**: Uses `Modal.Root`, `Modal.Trigger`, `Modal.Dialog` - more complete with better UX (shows two dataset type options)
- **Action**: **KEEP MAIN VERSION** - You mentioned main has a more complete/recent version
- **Note**: Keep main's version as-is. Update design system components after merge if needed (main may use older DS components)

### 3. `libs/ui/src/lib/header/index.tsx` ⚠️ **KEEP FROM BRANCH + MERGE FUNCTIONAL IMPROVEMENTS**
- **Status**: Both branches modified
- **Branch**: Contains design system upgrades (Header user details, dropdown upgrades)
- **Main**: May have functional improvements
- **Action**: **KEEP BRANCH VERSION AS BASE** - Preserve design system upgrades, then manually merge any functional improvements from main

### 4. `libs/ui/src/lib/breadcrumbs/index.tsx` ⚠️ **KEEP FROM BRANCH**
- **Status**: Both branches modified
- **Branch**: Upgraded to design system component (commit: `1bc343ab`)
- **Action**: **KEEP BRANCH VERSION** - Preserve design system upgrade

---

## Design System Upgrade Files - KEEP FROM BRANCH

These files contain design system upgrades and should be kept from the branch:

### UI Library Components (`libs/ui/src/lib/`)
- ✅ `libs/ui/src/lib/accordion-item/index.tsx` - DS upgrades
- ✅ `libs/ui/src/lib/auth-session-modal/index.tsx` - DS upgrades
- ✅ `libs/ui/src/lib/breadcrumbs/index.tsx` - Upgraded to DS component
- ✅ `libs/ui/src/lib/breadcrumbs/breadcrumbs.module.css` - Updated styles
- ✅ `libs/ui/src/lib/button/add.tsx` - DS upgrades
- ✅ `libs/ui/src/lib/button/button.tsx` - DS upgrades
- ✅ `libs/ui/src/lib/button/delete.tsx` - DS upgrades
- ✅ `libs/ui/src/lib/button/edit.tsx` - DS upgrades
- ✅ `libs/ui/src/lib/checkbox-group-filter/index.tsx` - Made controlled component
- ✅ `libs/ui/src/lib/confirm-modal/index.tsx` - DS upgrades
- ✅ `libs/ui/src/lib/details-page-layout/index.tsx` - DS upgrades
- ✅ `libs/ui/src/lib/error-boundry/index.tsx` - DS upgrades
- ✅ `libs/ui/src/lib/form-layout/index.tsx` - DS upgrades
- ✅ `libs/ui/src/lib/formik-auto-saver/index.tsx` - DS upgrades
- ✅ `libs/ui/src/lib/formik-language-fieldset/index.tsx` - DS upgrades
- ✅ `libs/ui/src/lib/formik-multivalue-textfield/index.tsx` - DS upgrades
- ✅ `libs/ui/src/lib/formik-optional-fields-fieldset/index.tsx` - DS upgrades
- ✅ `libs/ui/src/lib/formik-reference-data-combobox/index.tsx` - DS upgrades
- ✅ `libs/ui/src/lib/header/index.tsx` - Header upgrades (user details, dropdown)
- ✅ `libs/ui/src/lib/header/header.module.scss` - Header styles
- ✅ `libs/ui/src/lib/help-markdown/index.tsx` - DS upgrades
- ✅ `libs/ui/src/lib/page-banner/page-banner.module.css` - DS upgrades
- ✅ `libs/ui/src/lib/page-banner/page-banner.tsx` - DS upgrades

### New Components in Branch (Keep)
- ✅ `libs/ui/src/lib/app-bar-catalog-selector/index.tsx` - New component
- ✅ `libs/ui/src/lib/app-bar-catalog-selector/styles.module.scss` - New styles
- ✅ `libs/ui/src/lib/app-bar-hamburger-menu/index.tsx` - New component
- ✅ `libs/ui/src/lib/app-bar-hamburger-menu/styles.module.scss` - New styles
- ✅ `libs/ui/src/lib/app-bar-org-selector/index.tsx` - New component
- ✅ `libs/ui/src/lib/app-bar-org-selector/styles.module.scss` - New styles
- ✅ `libs/ui/src/lib/app-bar-user-menu/index.tsx` - New component
- ✅ `libs/ui/src/lib/app-bar/index.tsx` - New component
- ✅ `libs/ui/src/lib/app-bar/styles.module.scss` - New styles
- ✅ `libs/ui/src/lib/form-sidemenu/index.tsx` - **CRITICAL: Keep branch version**
- ✅ `libs/ui/src/lib/form-sidemenu/form-sidemenu.module.scss` - Keep branch version

### Index Files
- ⚠️ `libs/ui/src/index.ts` - **Manual merge**: Add exports for new components from branch, keep any new exports from main

---

## Files Modified in Both Branches - Manual Review Needed

### Catalog Admin App
- ⚠️ `apps/catalog-admin/app/auth/signout/page.tsx` - Likely import/component changes
- ⚠️ `apps/catalog-admin/app/catalogs/[catalogId]/concepts/code-lists/code-list-page-client.tsx`
- ⚠️ `apps/catalog-admin/app/catalogs/[catalogId]/concepts/editable-fields/editable-fields-client.tsx`
- ⚠️ `apps/catalog-admin/app/catalogs/[catalogId]/concepts/internal-fields/internal-page-client.tsx`
- ⚠️ `apps/catalog-admin/app/catalogs/[catalogId]/general/design/design-page-client.tsx` - May have DS upgrades
- ⚠️ `apps/catalog-admin/app/catalogs/[catalogId]/general/users/users-page-client.tsx`
- ⚠️ `apps/catalog-admin/app/catalogs/[catalogId]/no-access/page.tsx`
- ⚠️ `apps/catalog-admin/app/notfound/page.tsx`
- ⚠️ `apps/catalog-admin/components/internal-field-editor/index.tsx`

### Catalog Portal App
- ⚠️ `apps/catalog-portal/app/auth/signout/page.tsx`
- ⚠️ `apps/catalog-portal/app/catalogs/[[...catalogId]]/components/catalog-card/index.tsx`
- ⚠️ `apps/catalog-portal/app/catalogs/[[...catalogId]]/components/organization-combobox/index.tsx`
- ⚠️ `apps/catalog-portal/app/catalogs/[[...catalogId]]/page.tsx`
- ⚠️ `apps/catalog-portal/app/no-access/page.tsx`
- ⚠️ `apps/catalog-portal/app/terms-and-conditions/[catalogId]/terms-and-conditions-page-client.tsx`

### Concept Catalog App
**All concept form components** - These likely have Fieldset.Legend upgrades from branch:
- ⚠️ `apps/concept-catalog/app/auth/signout/page.tsx`
- ⚠️ `apps/concept-catalog/app/catalogs/[catalogId]/change-requests/[changeRequestId]/accept-concept-form-client.tsx`
- ⚠️ `apps/concept-catalog/app/catalogs/[catalogId]/change-requests/[changeRequestId]/edit/edit-concept-form-client.tsx`
- ⚠️ `apps/concept-catalog/app/catalogs/[catalogId]/change-requests/change-requests-page-client.tsx`
- ⚠️ `apps/concept-catalog/app/catalogs/[catalogId]/change-requests/new/new-concept-form-client.tsx`
- ⚠️ `apps/concept-catalog/app/catalogs/[catalogId]/concepts/[conceptId]/concept-page-client.tsx`
- ⚠️ `apps/concept-catalog/app/catalogs/[catalogId]/concepts/[conceptId]/edit/edit-page.client.tsx`
- ⚠️ `apps/concept-catalog/app/catalogs/[catalogId]/concepts/import-results/import-results-page-client.tsx`
- ⚠️ `apps/concept-catalog/app/catalogs/[catalogId]/concepts/new/new-page.client.tsx`
- ⚠️ `apps/concept-catalog/app/catalogs/[catalogId]/concepts/search-page-client.tsx`
- ⚠️ `apps/concept-catalog/app/catalogs/[catalogId]/no-access/page.tsx`
- ⚠️ `apps/concept-catalog/app/notfound/page.tsx`
- ⚠️ `apps/concept-catalog/components/change-request-filter/index.tsx`
- ⚠️ `apps/concept-catalog/components/change-request-sort/index.tsx`
- ⚠️ `apps/concept-catalog/components/concept-form/components/contact-section.tsx` - **Fieldset.Legend upgrade**
- ⚠️ `apps/concept-catalog/components/concept-form/components/definition-modal/index.tsx` - **FieldModal Dialog pattern**
- ⚠️ `apps/concept-catalog/components/concept-form/components/definition-section.tsx` - **Fieldset.Legend upgrade**
- ⚠️ `apps/concept-catalog/components/concept-form/components/example-section.tsx`
- ⚠️ `apps/concept-catalog/components/concept-form/components/internal-section/index.tsx`
- ⚠️ `apps/concept-catalog/components/concept-form/components/period-section.tsx`
- ⚠️ `apps/concept-catalog/components/concept-form/components/relation-fieldset/index.tsx` - **VStack wrapper, FieldModal Dialog**
- ⚠️ `apps/concept-catalog/components/concept-form/components/relation-modal/index.tsx` - **FieldModal Dialog pattern**
- ⚠️ `apps/concept-catalog/components/concept-form/components/relation-section.tsx`
- ⚠️ `apps/concept-catalog/components/concept-form/components/remark-section.tsx`
- ⚠️ `apps/concept-catalog/components/concept-form/components/source-description-fieldset/index.tsx`
- ⚠️ `apps/concept-catalog/components/concept-form/components/status-section.tsx`
- ⚠️ `apps/concept-catalog/components/concept-form/components/subject-section.tsx`
- ⚠️ `apps/concept-catalog/components/concept-form/components/term-section.tsx`
- ⚠️ `apps/concept-catalog/components/concept-form/components/value-range-section.tsx`
- ⚠️ `apps/concept-catalog/components/concept-form/components/version-fieldset/index.tsx`
- ⚠️ `apps/concept-catalog/components/concept-form/components/version-section.tsx`
- ⚠️ `apps/concept-catalog/components/concept-form/index.tsx`
- ⚠️ `apps/concept-catalog/components/concept-search-hits/index.tsx`
- ⚠️ `apps/concept-catalog/components/import-modal/index.tsx`
- ⚠️ `apps/concept-catalog/components/search-filter/checkbox-tree-filter/index.tsx`
- ⚠️ `apps/concept-catalog/components/search-filter/index.tsx`
- ⚠️ `apps/concept-catalog/components/source-section/relation-to-source/index.tsx`

### Data Service Catalog App
- ⚠️ `apps/data-service-catalog/app/auth/signout/page.tsx`
- ⚠️ `apps/data-service-catalog/app/catalogs/[catalogId]/data-services/[dataServiceId]/edit/edit-page-client.tsx`
- ⚠️ `apps/data-service-catalog/app/catalogs/[catalogId]/data-services/data-services-page-client.tsx`
- ⚠️ `apps/data-service-catalog/app/catalogs/[catalogId]/data-services/import-results/import-results-page-client.tsx`
- ⚠️ `apps/data-service-catalog/app/catalogs/[catalogId]/data-services/new/new-page-client.tsx`
- ⚠️ `apps/data-service-catalog/app/catalogs/[catalogId]/no-access/page.tsx`
- ⚠️ `apps/data-service-catalog/app/not-found/page.tsx`
- ⚠️ `apps/data-service-catalog/components/data-service-form/components/about-section.tsx`
- ⚠️ `apps/data-service-catalog/components/data-service-form/components/access-section.tsx`
- ⚠️ `apps/data-service-catalog/components/data-service-form/components/contact-point-section.tsx`
- ⚠️ `apps/data-service-catalog/components/data-service-form/components/costs-table.tsx`
- ⚠️ `apps/data-service-catalog/components/data-service-form/components/dataset-section.tsx`
- ⚠️ `apps/data-service-catalog/components/data-service-form/components/documentation-section.tsx`
- ⚠️ `apps/data-service-catalog/components/data-service-form/components/endpoint-section.tsx`
- ⚠️ `apps/data-service-catalog/components/data-service-form/components/format-section.tsx`
- ⚠️ `apps/data-service-catalog/components/data-service-form/components/status-section.tsx`
- ⚠️ `apps/data-service-catalog/components/data-service-form/index.tsx`
- ⚠️ `apps/data-service-catalog/components/details-page-columns/components/cost-list.tsx`
- ⚠️ `apps/data-service-catalog/components/details-page-columns/components/format-list.tsx`
- ⚠️ `apps/data-service-catalog/components/details-page-columns/components/reference-data-tag.tsx`
- ⚠️ `apps/data-service-catalog/components/details-page-columns/details-page-left-column.tsx`
- ⚠️ `apps/data-service-catalog/components/import-modal/index.tsx`
- ⚠️ `apps/data-service-catalog/components/publish-switch/index.tsx`

### Dataset Catalog App - HIGH PRIORITY
**All dataset form components** - These have Fieldset.Legend upgrades and other DS improvements:
- ⚠️ `apps/dataset-catalog/app/actions/actions.ts` - **Resource service integration (branch: dataset-catalog only - "Gå til side" button functionality)**
- ⚠️ `apps/dataset-catalog/app/auth/signout/page.tsx`
- ⚠️ `apps/dataset-catalog/app/catalogs/[catalogId]/datasets/[datasetId]/dataset-details-page-client.tsx`
- ⚠️ `apps/dataset-catalog/app/catalogs/[catalogId]/datasets/[datasetId]/edit/edit-page-client.tsx`
- ⚠️ `apps/dataset-catalog/app/catalogs/[catalogId]/datasets/[datasetId]/page.tsx` - **Resource service integration (branch: dataset-catalog only - "Gå til side" button pointing to FDK_BASE_URI)**
- ⚠️ `apps/dataset-catalog/app/catalogs/[catalogId]/datasets/datasets-page-client.tsx`
- ⚠️ `apps/dataset-catalog/app/catalogs/[catalogId]/datasets/new/new-page-client.tsx`
- ⚠️ `apps/dataset-catalog/app/catalogs/[catalogId]/no-access/page.tsx`
- ⚠️ `apps/dataset-catalog/app/catalogs/notfound/page.tsx`
- ⚠️ `apps/dataset-catalog/components/dataset-form/components/about-section.tsx` - **Fieldset.Legend upgrade**
- ⚠️ `apps/dataset-catalog/components/dataset-form/components/access-rights-fields.tsx`
- ⚠️ `apps/dataset-catalog/components/dataset-form/components/concept-section.tsx`
- ⚠️ `apps/dataset-catalog/components/dataset-form/components/details-section/details-section.tsx` - **Fieldset.Legend upgrade**
- ⚠️ `apps/dataset-catalog/components/dataset-form/components/details-section/minimized-detail-fields.tsx`
- ⚠️ `apps/dataset-catalog/components/dataset-form/components/details-section/recommended-detail-fields.tsx`
- ⚠️ `apps/dataset-catalog/components/dataset-form/components/details-section/temporal-modal.tsx` - **FieldModal Dialog pattern**
- ⚠️ `apps/dataset-catalog/components/dataset-form/components/distribution-section/distribution-details.tsx`
- ⚠️ `apps/dataset-catalog/components/dataset-form/components/distribution-section/distribution-modal.tsx` - **FieldModal Dialog pattern, dynamic import with ssr: false**
- ⚠️ `apps/dataset-catalog/components/dataset-form/components/distribution-section/distribution-section.tsx` - **Fieldset.Legend upgrade**
- ⚠️ `apps/dataset-catalog/components/dataset-form/components/information-model-section.tsx`
- ⚠️ `apps/dataset-catalog/components/dataset-form/components/qualified-attributions-section.tsx`
- ⚠️ `apps/dataset-catalog/components/dataset-form/components/relations-section/references-table.tsx`
- ⚠️ `apps/dataset-catalog/components/dataset-form/components/relations-section/relations-section.tsx` - **Fieldset.Legend upgrade**
- ⚠️ `apps/dataset-catalog/components/dataset-form/components/theme-section.tsx` - **Reverted Suggestion to Combobox**
- ⚠️ `apps/dataset-catalog/components/dataset-form/components/toggle-field-button.tsx`
- ⚠️ `apps/dataset-catalog/components/dataset-form/components/uri-with-label-field-set-table.tsx`
- ⚠️ `apps/dataset-catalog/components/dataset-form/index.tsx`
- ⚠️ `apps/dataset-catalog/components/details-page-columns/components/access-rights-details.tsx`
- ⚠️ `apps/dataset-catalog/components/details-page-columns/components/distribution-details.tsx`
- ⚠️ `apps/dataset-catalog/components/details-page-columns/components/temporal-details.tsx`
- ⚠️ `apps/dataset-catalog/components/details-page-columns/details-page-left-column.tsx`
- ⚠️ `apps/dataset-catalog/components/details-page-columns/details-page-right-column.tsx` - **May have resource service changes (dataset-catalog specific)**
- ⚠️ `apps/dataset-catalog/components/publish-switch/index.tsx` - **LinkButton for "Gå til side" (branch: dataset-catalog only - uses resource service to get FDK dataset ID for button)**
- ⚠️ `apps/dataset-catalog/components/search-filter/index.tsx` - **CheckboxGroupFilter controlled component**
- ⚠️ `apps/dataset-catalog/components/status-tag/index.tsx`
- ⚠️ `apps/dataset-catalog/components/tag-list/index.tsx`
- ⚠️ `apps/dataset-catalog/components/uri-with-label-table/index.tsx`

### Service Catalog App
- ⚠️ `apps/service-catalog/app/auth/signout/page.tsx`
- ⚠️ `apps/service-catalog/app/catalogs/[catalogId]/no-access/page.tsx`
- ⚠️ `apps/service-catalog/app/catalogs/[catalogId]/public-services/[serviceId]/edit/page.tsx`
- ⚠️ `apps/service-catalog/app/catalogs/[catalogId]/public-services/new/page.tsx`
- ⚠️ `apps/service-catalog/app/catalogs/[catalogId]/services/[serviceId]/edit/page.tsx`
- ⚠️ `apps/service-catalog/app/catalogs/[catalogId]/services/new/page.tsx`
- ⚠️ `apps/service-catalog/app/notfound/page.tsx`
- ⚠️ `apps/service-catalog/components/basic-form-info-card-items/index.tsx`
- ⚠️ `apps/service-catalog/components/buttons/index.tsx`
- ⚠️ `apps/service-catalog/components/filter-chips/index.tsx`
- ⚠️ `apps/service-catalog/components/filter/index.tsx`
- ⚠️ `apps/service-catalog/components/publish-switch/index.tsx`

### Data Access Library
- ⚠️ `libs/data-access/src/index.ts` - **Manual merge**: Branch adds resource service export (new feature, doesn't exist in main). Add the export: `export * from './lib/resource-service/api';`
- ✅ `libs/data-access/src/lib/resource-service/api/index.ts` - **New file in branch** - Keep from branch (doesn't exist in main)

### Other Files
- ⚠️ `.husky/pre-commit` - Branch has `yarn lint-staged --relative`, main has disabled hook
- ⚠️ `.env.local.example` - Branch missing new env vars from main (FDK_REGISTRATION_BASE_URI, FDK_RESOURCE_SERVICE_BASE_URI)

---

## Deleted/Modified Conflicts

### 1. `apps/dataset-catalog/components/reference-data-tags/index.tsx`
- **Status**: Deleted in main, modified in branch
- **Action**: **KEEP BRANCH VERSION** - If branch has improvements, keep it. Otherwise, check if functionality moved elsewhere in main.

### 2. `apps/service-catalog/components/basic-service-form/index.tsx`
- **Status**: Deleted in main, modified in branch
- **Action**: **Check main** - See if functionality was refactored/moved. If branch has important changes, may need to port them to new location.

---

## Files Only in Main (New Features) - Keep from Main

These files exist only in main and should be kept:
- ✅ `PLAN-resource-service-integration.md` - Planning document (already exists in branch)
- ✅ All new files in main that don't exist in branch (check git diff for additions)

---

## Files Only in Branch - Keep from Branch

These are new files/features in the branch:
- ✅ All new app-bar components (listed above)
- ✅ `libs/ui/src/lib/form-sidemenu/` - **CRITICAL: Keep**
- ✅ `libs/data-access/src/lib/resource-service/api/index.ts` - **New resource service API library** (used only in dataset-catalog)
- ✅ Resource service integration in dataset-catalog (new feature)

---

## Merge Strategy by Category

### 1. Design System Component Upgrades
**Action**: Keep all DS upgrades from branch
- Fieldset.Legend component usage
- Dialog/Modal pattern updates
- Button, Checkbox, RadioGroup upgrades
- Header, Breadcrumbs upgrades

### 2. Functional Features from Main
**Action**: Keep functional improvements from main, but ensure they use updated DS components
- Resource service integration (may need to merge with branch version)
- New dataset modal (keep main version, but verify DS components)
- Bug fixes
- New features

### 3. Import/Export Changes
**Action**: Manual merge required
- `libs/ui/src/index.ts` - Add new exports from branch, keep new exports from main
- `libs/data-access/src/index.ts` - Add resource service export from branch (new feature, doesn't exist in main)

### 4. Configuration Files
**Action**: Merge carefully
- `.husky/pre-commit` - Decide: keep lint-staged (branch) or disabled (main)?
- `.env.local.example` - Add missing env vars from main to branch version

---

## Step-by-Step Merge Process

### Phase 1: Preparation
1. ✅ Create this merge plan document
2. ⬜ Review critical files manually (form-sidemenu, new-dataset-modal, header, breadcrumbs)
3. ⬜ Identify any additional files that need special handling

### Phase 2: Start Merge
1. ⬜ Ensure you're on the branch: `git checkout feat/el/dataset-ds-upgrade-merge`
2. ⬜ Merge main into branch: `git merge main --no-commit --no-ff`
3. ⬜ Review conflict list

### Phase 3: Resolve Critical Files First
1. ⬜ **form-sidemenu**: Accept branch version (use `git checkout --ours`) - file doesn't exist in main
2. ⬜ **new-dataset-modal**: Accept main version (use `git checkout --theirs`) - will update DS components after merge if needed
3. ⬜ **header/index.tsx**: Accept branch version as base (use `git checkout --ours`), then manually merge functional improvements from main
4. ⬜ **breadcrumbs**: Accept branch version (use `git checkout --ours`)

### Phase 4: Resolve Design System Files
1. ⬜ Accept branch version for all UI component files with DS upgrades
2. ⬜ Use `git checkout --ours` for files in the "Design System Upgrade Files" section (this keeps the branch's DS upgrades)

### Phase 5: Resolve Functional Files
1. ⬜ For each file in "Files Modified in Both Branches":
   - Review the conflict
   - Keep DS upgrades from branch
   - Keep functional improvements from main
   - Manually merge if both have important changes

### Phase 6: Handle Special Cases
1. ⬜ **reference-data-tags**: Decide whether to keep branch version or check if moved in main
2. ⬜ **basic-service-form**: Check if refactored in main, port changes if needed
3. ⬜ **Index files**: Manually merge exports

### Phase 7: Configuration Files
1. ⬜ `.husky/pre-commit`: Choose approach (likely keep branch version with lint-staged)
2. ⬜ `.env.local.example`: Add missing env vars from main

### Phase 8: Testing & Validation
1. ⬜ Build the project
2. ⬜ Run linter
3. ⬜ Test critical paths:
   - Form sidemenu functionality
   - New dataset modal
   - Header/Breadcrumbs
   - Dataset forms with Fieldset.Legend
   - Resource service integration

### Phase 9: Final Review & Commit
1. ⬜ Review all resolved conflicts
2. ⬜ Ensure no design system upgrades were lost (from branch)
3. ⬜ Ensure no functional improvements from main were lost
4. ⬜ Commit the merge: `git commit -m "Merge main into feat/el/dataset-ds-upgrade-merge"`
5. ⬜ Push updated branch: `git push origin feat/el/dataset-ds-upgrade-merge`
6. ⬜ Create/update pull request to merge branch into main

---

## Key Commands Reference

**When merging main INTO the branch:**

```bash
# Accept branch version (feat/el/dataset-ds-upgrade-merge) - keeps DS upgrades
git checkout --ours <file>
git add <file>

# Accept main version - for new features/bug fixes
git checkout --theirs <file>
git add <file>

# Manual merge (edit file, then)
git add <file>

# Abort merge if needed
git merge --abort

# After resolving all conflicts, complete the merge
git commit -m "Merge main into feat/el/dataset-ds-upgrade-merge"
```

---

## Notes

- The branch has significant design system upgrades that must be preserved
- Main has new features and bug fixes that should be kept
- The `form-sidemenu` component is critical - ensure it's not lost
- The `new-dataset-modal` should use the main version (more complete)
- Many conflicts will be import/component name changes due to DS upgrades
- Resource service integration: **CONFIRMED** - Branch only uses resource service in **dataset-catalog** app (for "Gå til side" button). Resource service API library (`libs/data-access/src/lib/resource-service/api/index.ts`) is new in branch and doesn't exist in main. No other apps use resource service in either branch or main.

---

## Questions to Resolve During Merge

1. Does main's `new-dataset-modal` use the latest design system components, or does it need updating?
   - unknown, keep main's version, and i'll update the components after if needed
2. Are there any functional improvements in main's header that should be preserved alongside branch's DS upgrades?
   - if so, preserve functional improvements
3. Has the resource service integration in main diverged significantly from branch?
   - **Answer**: **CONFIRMED** - Resource service does NOT exist in main. Branch added resource service API library and only uses it in **dataset-catalog** app (for "Gå til side" button pointing to FDK_BASE_URI). No other apps use resource service in either branch or main. This is a new feature in the branch.
4. Are there any breaking changes in main that would affect the DS upgrades?
   - unknown

---

**Last Updated**: Generated during merge planning  
**Source**: `main` (being merged INTO)  
**Target**: `feat/el/dataset-ds-upgrade-merge` (receiving the merge)  
**Goal**: Update branch with main's changes so it can be PR'd into main without conflicts
