# Merge Plan: main → feat/el/dataset-ds-upgrade-merge (Second Merge)

## Overview

This document outlines the merge plan for the **second merge** of `main` **INTO** `feat/el/dataset-ds-upgrade-merge`. The first merge was completed at commit `a3623746` (Jan 19, 2026) which resolved 167 conflicts across 703 files.

This second merge is significantly simpler as it only needs to incorporate changes made **since the first merge**.

**Merge Base**: `a3623746` (first merge commit)  
**Total files changed on main since merge**: 166 files  
**Total files changed on branch since merge**: 39 files  
**Overlapping files (potential conflicts)**: 19 files  
**Estimated complexity**: **Low-Medium** (much simpler than first merge)

---

## What Changed Since First Merge

### Main Branch (17 commits since `a3623746`)
- **Dependency updates** (7 commits): sass, tar, general deps bumps
- **Features**: Version field validation, data service version field
- **Fixes**: Async layout params, e2e test improvements
- **Chores**: Remove unused webpack/sass dependencies

### Feature Branch (17 commits since `a3623746`)
- **Design system fixes**: Modal button wrapping, StatusTag colors, Header button sizes
- **Resource service integration**: FDK dataset ID integration for "Gå til side" button
- **UI improvements**: Localization fixes, search-hit updates, pagination fixes
- **Component migrations**: Continued DS component upgrades

---

## Strategy

**General approach:**
- ✅ **Keep from branch (ours)**: All design system upgrades, UI component improvements
- ✅ **Keep from main (theirs)**: New features, bug fixes, dependency updates (except design system packages)
- ⚠️ **Manual review needed**: 18 overlapping files

**Note**: When merging main INTO the branch:
- `--ours` = branch version (feat/el/dataset-ds-upgrade-merge)
- `--theirs` = main version

---

## Overlapping Files (18 files - Potential Conflicts)

These files have been modified in both branches since the first merge (19 files total):

### Dependency Files (Usually Auto-Resolve)
1. ⚠️ `package.json` - **Accept main's version** for dependency updates, but **manually preserve** design system packages from branch:
   - Keep branch: `@digdir/designsystemet-*` (1.7.1), `@navikt/aksel-icons` (^7.40.0)
   - Accept main: All other dependency updates
2. ⚠️ `yarn.lock` - **Accept main's version** (will regenerate correctly after package.json merge)
3. ⚠️ `apps/dataset-catalog/project.json` - Likely minor config changes, review manually

### Component Files (Manual Review)
4. ⚠️ `apps/concept-catalog/components/change-request-filter/index.tsx`
5. ⚠️ `apps/concept-catalog/components/concept-search-hits/index.tsx`
6. ⚠️ `apps/concept-catalog/components/search-filter/index.tsx`
7. ⚠️ `apps/dataset-catalog/components/dataset-form/components/distribution-section/distribution-modal.tsx`
8. ⚠️ `apps/dataset-catalog/components/details-page-columns/details-page-right-column.tsx`
9. ⚠️ `apps/dataset-catalog/components/status-tag/index.tsx`
10. ⚠️ `apps/dataset-catalog/components/search-filter/index.tsx` - **CRITICAL: Application Profile filter from main**
11. ⚠️ `libs/ui/src/lib/auth-session-modal/index.tsx`
12. ⚠️ `libs/ui/src/lib/form-layout/form-layout.module.scss`
13. ⚠️ `libs/ui/src/lib/formik-auto-saver/index.tsx`
14. ⚠️ `libs/ui/src/lib/header/index.tsx`
15. ⚠️ `libs/ui/src/lib/import-result-details/components/import-record-accordion-item/index.tsx`
16. ⚠️ `libs/ui/src/lib/import-result-details/index.tsx`
17. ⚠️ `libs/ui/src/lib/search-hit/index.tsx`

### Documentation
18. ⚠️ `MERGE-PLAN.md` - This file (will be replaced by this plan)

---

## Critical Files - Special Handling

### 1. `package.json` ⚠️ **MANUAL MERGE REQUIRED**
- **Action**: Accept main's dependency updates EXCEPT design system packages
- **Keep from branch**:
  - `@digdir/designsystemet-css`: `1.7.1` (branch) vs `0.10.0` (main)
  - `@digdir/designsystemet-react`: `1.7.1` (branch) vs `0.63.1` (main)
  - `@digdir/designsystemet-theme`: `^1.7.1` (branch) vs `^0.15.3` (main)
  - `@navikt/aksel-icons`: `^7.40.0` (branch) vs `^7.35.0` (main)
- **Accept from main**: All other dependencies (sass, tar, etc.)

### 2. `libs/ui/src/lib/header/index.tsx` ⚠️ **KEEP FROM BRANCH**
- **Status**: Both branches modified
- **Branch changes**: Button size fixes (`data-size='sm'`)
- **Main changes**: 
  - Migrated from `Dropdown` to `DropdownMenu` API (design system API change)
  - Removed `Avatar` component, replaced with `PersonIcon`
  - Changed from `Dropdown.Button` to `DropdownMenu.Item` with `asChild` pattern
  - Added `Button` wrapper for menu trigger
  - Code formatting changes (quotes, spacing)
- **Action**: **KEEP BRANCH VERSION** - Branch has newer design system version (1.7.1) with `Dropdown` API, main uses older API. Branch's button size fixes should be preserved. If needed, manually merge the `DropdownMenu` migration from main after ensuring compatibility with branch's DS version.

### 3. `libs/ui/src/lib/search-hit/index.tsx` ⚠️ **KEEP FROM BRANCH**
- **Status**: Both branches modified
- **Branch changes**: Localization fixes, generic `noName` usage, `translate()` function handling
- **Main changes**: 
  - Removed `Card` wrapper component
  - Changed `title` prop type from `string[] | string` to just `string`
  - Removed `TagList` component wrapper
  - Changed from `Heading` component to plain `h2` tag
  - Removed `translate()` function usage, simplified to direct `title || localization.concept.noName`
  - Removed `'use client'` directive
  - Moved `Link` inside title row instead of wrapping entire card
- **Action**: **KEEP BRANCH VERSION** - Branch has better localization handling with `translate()` function support and maintains design system `Card` component. Main's changes are a simplification that loses functionality.

### 4. `apps/dataset-catalog/components/status-tag/index.tsx` ⚠️ **KEEP FROM BRANCH**
- **Status**: Both branches modified
- **Branch changes**: Warning color updates
- **Main changes**: 
  - Changed from `data-color` prop to `color` prop (design system API update)
  - Added `size="sm"` prop
  - Code formatting changes (quotes, spacing)
- **Action**: **KEEP BRANCH VERSION** - Branch has newer design system version (1.7.1) which may use different API. Branch's warning color fixes should be preserved. The API change in main may not be compatible with branch's DS version.

### 5. `apps/dataset-catalog/components/search-filter/index.tsx` ⚠️ **CRITICAL: ADD APPLICATION PROFILE FILTER FROM MAIN**
- **Status**: Both branches modified
- **Branch changes**: Design system upgrades, code formatting
- **Main changes**: 
  - **Added**: Application Profile filter section ("Datasett-standard") with DCAT-AP-NO and mobilityDCAT-AP options
  - **Added**: `ApplicationProfile` import from types
  - **Added**: `defaultFilterApplicationProfile` state
  - **Added**: `filterApplicationProfile` query state
  - **Added**: `applicationProfileItems` array with MOBILITYDCATAP and DCATAPNO options
  - **Added**: `handleApplicationProfileOnChange` handler
  - **Added**: New accordion item with header `localization.tag.applicationProfile`
  - **Changed**: `localization.publicationState.descriptionConcept` → `descriptionDataset`
  - **Added**: `Accordion` wrapper from design system
  - Code formatting changes (quotes, spacing)
- **Action**: **MANUAL MERGE REQUIRED** - Branch already has filtering logic in `datasets-page-client.tsx` but missing the UI filter. Need to:
  1. Keep branch's design system upgrades and formatting
  2. **Add from main**: Complete Application Profile filter implementation (all the additions listed above)
  3. **Add from main**: `Accordion` wrapper (verify compatibility with branch's DS version 1.7.1)
  4. **Add from main**: Change `descriptionConcept` to `descriptionDataset` for publication state description
  5. Ensure the filter state connects properly with existing filtering logic in `datasets-page-client.tsx` (which already exists in branch)

### 6. `apps/dataset-catalog/components/details-page-columns/details-page-right-column.tsx` ⚠️ **REVIEW MANUALLY**
- **Status**: Both branches modified
- **Branch changes**: Resource service integration (`referenceDataEnv`, `fdkDatasetId` props), localization fixes
- **Main changes**: 
  - **Added**: Application profile display section (shows MOBILITYDCATAP vs DCATAPNO)
  - **Removed**: `referenceDataEnv` and `fdkDatasetId` props (removes resource service integration)
  - **Removed**: `VStack` wrapper and `Tag.PublishedTag` component
  - **Changed**: Publication state now shows as text (`publishedInFDK` / `unpublished`) instead of tag component
  - **Changed**: Removed `console.log(dataset)`
  - **Added**: `key` props to `InfoCard.Item` components
  - Code formatting changes (quotes, spacing)
- **Action**: **MANUAL MERGE REQUIRED** - This is critical! Main removed the resource service integration that branch added. Need to:
  1. Keep branch's resource service props (`referenceDataEnv`, `fdkDatasetId`)
  2. Keep branch's `VStack` and `Tag.PublishedTag` usage
  3. Merge in main's application profile display section
  4. Keep branch's resource service integration in `PublishSwitch` component

---

## Files Modified Only on Main (Keep from Main)

These files were changed on main but not on branch - accept main's version:
- `.github/workflows/e2e.yaml` - E2E workflow improvements
- `apps/catalog-admin/app/catalogs/[catalogId]/layout.tsx` - Async params fix
- `apps/concept-catalog-e2e/` - E2E test improvements
- `apps/data-service-catalog/components/data-service-form/` - Version field additions
- `apps/service-catalog/` - Service details page updates
- `libs/types/src/lib/data-service.ts` - Type updates for version field
- `libs/utils/src/lib/language/data.service.form.nb.ts` - Localization updates

---

## Files Modified Only on Branch (Keep from Branch)

These files were changed on branch but not on main - keep branch version:
- All design system upgrade commits
- Resource service integration files
- Localization fixes
- Modal/button wrapping improvements

**Note**: `apps/dataset-catalog/app/catalogs/[catalogId]/datasets/datasets-page-client.tsx` already has the Application Profile filtering logic implemented in the branch (lines 70-73, 89-92, 136-141, 152, 162, 190-209, 245, 275-286, 394-401). The search-filter component just needs the UI filter added from main to complete the feature.

---

## Step-by-Step Merge Process

### Phase 1: Preparation
1. ✅ Ensure you're on the branch: `git checkout feat/el/dataset-ds-upgrade-merge`
2. ✅ Ensure working tree is clean: `git status`
3. ✅ Verify you're up to date with remote: `git pull origin feat/el/dataset-ds-upgrade-merge`

### Phase 2: Start Merge
1. ⬜ Merge main into branch: `git merge main --no-commit --no-ff`
2. ⬜ Review conflict list: `git status`
3. ⬜ Expected conflicts: ~5-15 files (much fewer than first merge's 167)

### Phase 3: Resolve Dependency Files
1. ⬜ **package.json**: 
   - Accept main's version: `git checkout --theirs package.json`
   - Manually edit to restore design system package versions from branch
   - Run: `yarn install` to update yarn.lock
2. ⬜ **yarn.lock**: Accept main's version (will be regenerated): `git checkout --theirs yarn.lock`

### Phase 4: Resolve Component Files
1. ⬜ **Keep from branch** (DS upgrades):
   - `libs/ui/src/lib/header/index.tsx` → `git checkout --ours`
   - `libs/ui/src/lib/search-hit/index.tsx` → `git checkout --ours`
   - `apps/dataset-catalog/components/status-tag/index.tsx` → `git checkout --ours`
   - `libs/ui/src/lib/auth-session-modal/index.tsx` → `git checkout --ours`
   - `libs/ui/src/lib/formik-auto-saver/index.tsx` → `git checkout --ours`
   - `libs/ui/src/lib/form-layout/form-layout.module.scss` → `git checkout --ours`
   - `libs/ui/src/lib/import-result-details/index.tsx` → `git checkout --ours`
   - `libs/ui/src/lib/import-result-details/components/import-record-accordion-item/index.tsx` → `git checkout --ours`

2. ⬜ **CRITICAL: Manual merge required** for `search-filter/index.tsx` (Application Profile filter):
   - Start with branch version: `git checkout --ours apps/dataset-catalog/components/search-filter/index.tsx`
   - **Add from main**: Import `ApplicationProfile` from `@catalog-frontend/types`
   - **Add from main**: `defaultFilterApplicationProfile` useMemo hook
   - **Add from main**: `filterApplicationProfile` query state with `useQueryState`
   - **Add from main**: `applicationProfileItems` array with MOBILITYDCATAP and DCATAPNO options
   - **Add from main**: `handleApplicationProfileOnChange` handler function
   - **Add from main**: New accordion item in `accordionItemContents` array:
     ```tsx
     {
       initiallyOpen: true,
       header: localization.tag.applicationProfile,
       content: (
         <CheckboxGroupFilter
           items={applicationProfileItems}
           onChange={handleApplicationProfileOnChange}
           value={filterApplicationProfile ?? []}
         />
       ),
     }
     ```
   - **Add from main**: `Accordion` wrapper component (verify compatibility with branch's DS 1.7.1)
   - **Change from main**: `localization.publicationState.descriptionConcept` → `descriptionDataset`
   - **Keep from branch**: Design system component usage, code formatting preferences
   - **Verify**: The filter state should automatically connect with existing filtering logic in `datasets-page-client.tsx` (already implemented in branch)

3. ⬜ **CRITICAL: Manual merge required** for `details-page-right-column.tsx`:
   - Start with branch version: `git checkout --ours apps/dataset-catalog/components/details-page-columns/details-page-right-column.tsx`
   - **Keep from branch**: Resource service props (`referenceDataEnv`, `fdkDatasetId`), `VStack` wrapper, `Tag.PublishedTag` component
   - **Add from main**: Application profile display section (new `InfoCard.Item` showing MOBILITYDCATAP vs DCATAPNO)
   - **Keep from branch**: Resource service integration in `PublishSwitch` component call
   - **Keep from main**: `key` props on `InfoCard.Item` components, code formatting improvements
   - Manually edit the file to combine both changes

4. ⬜ **Review manually** (may have functional improvements from main):
   - `apps/concept-catalog/components/change-request-filter/index.tsx`
   - `apps/concept-catalog/components/concept-search-hits/index.tsx`
   - `apps/concept-catalog/components/search-filter/index.tsx`
   - `apps/dataset-catalog/components/dataset-form/components/distribution-section/distribution-modal.tsx`

3. ⬜ **Config files**:
   - `apps/dataset-catalog/project.json` → Review manually

### Phase 5: Finalize Merge
1. ⬜ Stage all resolved files: `git add .`
2. ⬜ Verify no unmerged files: `git status`
3. ⬜ Complete merge: `git commit -m "Merge main into feat/el/dataset-ds-upgrade-merge (second merge)"`
4. ⬜ Run dependency install: `yarn install` (to ensure yarn.lock is correct)

### Phase 6: Testing & Validation
1. ⬜ Build the project: `yarn build` (or `nx build <app>`)
2. ⬜ Run linter: `yarn lint`
3. ⬜ Test critical paths:
   - Resource service integration ("Gå til side" button)
   - StatusTag colors
   - Header button sizes
   - Search-hit localization
   - Version field validation (new from main)
   - Application profile display in dataset details (new from main)
   - **Application Profile filter in search sidebar** (new from main) - verify filtering by DCAT-AP-NO and mobilityDCAT-AP works correctly

### Phase 7: Push & Update PR
1. ⬜ Push updated branch: `git push origin feat/el/dataset-ds-upgrade-merge`
2. ⬜ Update/create pull request to merge branch into main

---

## Key Commands Reference

```bash
# Start merge
git merge main --no-commit --no-ff

# Accept branch version (keeps DS upgrades)
git checkout --ours <file>
git add <file>

# Accept main version (for new features/bug fixes)
git checkout --theirs <file>
git add <file>

# Manual merge (edit file, then)
git add <file>

# Abort merge if needed
git merge --abort

# After resolving all conflicts, complete the merge
git commit -m "Merge main into feat/el/dataset-ds-upgrade-merge (second merge)"
```

---

## Expected Conflict Resolution Summary

| File Category | Count | Resolution Strategy |
|--------------|-------|---------------------|
| Dependency files | 3 | Manual merge (preserve DS packages) |
| UI Components (DS upgrades) | 8 | Keep branch version |
| Critical manual merge | 2 | `search-filter/index.tsx` (add app profile filter), `details-page-right-column.tsx` (preserve resource service, add app profile) |
| Components (review needed) | 4 | Manual review |
| Documentation | 1 | Replace with this plan |
| Config files | 1 | Manual review |
| **Total** | **19** | **~6-16 actual conflicts** |

---

## Notes

- This merge is **much simpler** than the first merge (18 overlapping files vs 150+ conflicts)
- Most conflicts will be straightforward (dependency updates, minor component changes)
- The first merge already handled all major design system migration conflicts
- Focus on preserving branch's DS upgrades while incorporating main's bug fixes and features
- Resource service integration is branch-only and should be preserved

---

## Risk Assessment

**Complexity**: ⭐⭐☆☆☆ (Low-Medium)  
**Estimated Time**: 15-45 minutes  
**Risk Level**: Low  
**Reasoning**: 
- Small number of overlapping files (18)
- Clear merge base (previous merge commit)
- Most conflicts in dependency files (usually straightforward)
- Component conflicts are likely minor (button sizes, colors, localization)

---

**Last Updated**: 2026-01-19 (Second merge planning)  
**Merge Base**: `a3623746` (first merge commit)  
**Source**: `main` (being merged INTO)  
**Target**: `feat/el/dataset-ds-upgrade-merge` (receiving the merge)  
**Goal**: Update branch with main's latest changes (17 commits) while preserving all design system upgrades
