### Report: Combobox runtime crash (`value is undefined`)

### Problem summary
- **Symptom**: Next.js runtime error `can't access property "value", value is undefined`
- **Origin**: `@digdir/designsystemet-react` `ComboboxComponent.useEffect`
- **Impact**: Dataset edit page crashed when rendering Comboboxes in:
  - `apps/dataset-catalog/components/dataset-form/components/theme-section.tsx` (theme comboboxes)
  - `apps/dataset-catalog/components/dataset-form/components/relations-section/references-table.tsx` (relation `FieldModal` comboboxes)

### Root cause (confirmed)
In the `designsystemet` source (`designsystemet/packages/react/src/components/Combobox/Combobox.tsx`), the Combobox sync effect maps incoming `value: string[]` to internal options and then reduces assuming every lookup succeeded. If an element is missing/invalid/timing-mismatched, the lookup yields `undefined`, and the reduce hits `undefined.value`, throwing.

Key triggers we saw:
- **Invalid values in arrays**: `undefined`/`null`/empty strings or values not present among options.
- **Value not found in options**: e.g. `referenceType` not matching any `relations.json` code.
- **Timing/race** (important): dynamic options (dataset search combobox) can have a valid form value *before* the component’s internal option map has registered the corresponding `Combobox.Option` children.

### Solutions tried (chronological)
1. **Initial suspicion / attempted sanitization**: Treat arrays as possibly containing `undefined/null`; propose filtering and cleaning initial values.
2. **Workaround that “worked” but not acceptable**: Commented out `value` props (uncontrolled mode) → page rendered, but breaks controlled behavior and form synchronization.
3. **Fixing Formik handlers**:
   - Corrected `onValueChange` usage to treat incoming values as `string[]` and select the first element for single-select fields (instead of `.toString()`).
4. **Safe value guarding**:
   - Added validation so `value` is only passed if it exists in the available options.
   - This fixed “value not found in options” but **did not** fully fix the crash for dynamic options due to timing.
5. **Final fix for dynamic options (simplest, successful)**:
   - For the dataset “source” combobox in `references-table.tsx`, only pass a value **after** options exist:
     - `comboboxOptions.length > 0`
     - value is non-empty
     - value is present in `comboboxOptions`
   - This removed the race where the Combobox sync effect ran before its internal option map was ready.
6. **ThemeSection fix**:
   - Introduced safe filtering/validation for `euDataTheme` and `losTheme` values; these are effectively static option lists (loaded upfront), so sanitization/validation was sufficient.
7. **Cleanup / reuse**:
   - Extracted a reusable `SafeCombobox` into `libs/ui/src/lib/safe-combobox/index.tsx` and re-exported via `libs/ui/src/index.ts`.
   - Updated `theme-section.tsx` and `references-table.tsx` to use `SafeCombobox`.

### Examples: value filtering and option preparation

#### Example A: `theme-section.tsx` (static option sets)
We derive valid option values from reference data and pass them as `availableValues`:

```ts
const availableEuDataThemeUris = useMemo(
  () => euDataThemes.map((theme) => theme.uri).filter(Boolean),
  [euDataThemes],
);

const availableLosThemeUris = useMemo(
  () => losThemes.map((theme) => theme.uri).filter(Boolean),
  [losThemes],
);
```

Then use `SafeCombobox` via Formik `FastField`:

```ts
<FastField
  as={SafeCombobox}
  multiple
  value={values.euDataTheme ?? []}
  availableValues={availableEuDataThemeUris}
  onValueChange={(vals: string[]) => setFieldValue('euDataTheme', vals)}
>
  ...
</FastField>
```

#### Example B: `references-table.tsx` (static + dynamic option sets)
We prepare valid option values for static relations:

```ts
const availableRelationCodes = useMemo(
  () => relations.map((relation) => relation.code).filter(Boolean),
  [],
);
```

For dynamic dataset options (search results), we derive URIs from `comboboxOptions`:

```ts
const availableDatasetUris = useMemo(
  () => comboboxOptions.map((option) => option.uri).filter(Boolean),
  [comboboxOptions],
);
```

And for the dynamic “source” combobox we apply the **options-ready gate** (the final, critical fix):

```ts
value={
  comboboxOptions.length > 0 &&
  values?.source &&
  values.source.trim() !== '' &&
  comboboxOptions.some((option) => option.uri === values.source)
    ? [values.source]
    : []
}
```

### Final state (what fixed what)
- **`apps/dataset-catalog/components/dataset-form/components/relations-section/references-table.tsx`**
  - **Critical fix** for the **source** combobox: **gate the `value` prop on options readiness** (`comboboxOptions.length > 0`) + membership check.
  - Uses `SafeCombobox` for additional sanitization/validation.
- **`apps/dataset-catalog/components/dataset-form/components/theme-section.tsx`**
  - Uses `SafeCombobox` with `availableValues` derived from the loaded theme lists.
- **Reusable component**
  - `libs/ui/src/lib/safe-combobox/index.tsx` exported as `SafeCombobox` from `@catalog-frontend/ui`.

### Recommended future usage pattern
Because we assume we **cannot change the design system Combobox**, treat it as requiring strict guarantees.

- **Always pass `value` as `string[]`** (never `undefined`; use `[]`).
- **Sanitize**: remove `undefined/null/empty` entries before passing to Combobox (use `SafeCombobox`).
- **Validate membership**:
  - For static option sets: pass `availableValues` to `SafeCombobox` (or otherwise ensure `value` is a subset of options).
- **Handle dynamic option sets (most important)**:
  - Do **not** set `value` until options are actually present (options-ready gate), e.g.:
    - `options.length > 0 && options.some(...) ? [selected] : []`
  - This avoids the internal sync effect running before the option map is populated.

### Files changed / added
- **Added**: `libs/ui/src/lib/safe-combobox/index.tsx`
- **Updated**: `libs/ui/src/index.ts` (export)
- **Updated**:
  - `apps/dataset-catalog/components/dataset-form/components/relations-section/references-table.tsx`
  - `apps/dataset-catalog/components/dataset-form/components/theme-section.tsx`
