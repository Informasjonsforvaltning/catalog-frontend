# Combobox Runtime Error Assessment

## Error Details

**Error Message:**
```
Runtime TypeError
can't access property "value", value is undefined
```

**Location:**
- File: `app/catalogs/[catalogId]/datasets/[datasetId]/edit/page.tsx` (line 106)
- Component: `<EditPage>` 
- Call Stack: `ComboboxComponent.useEffect` in `@digdir/designsystemet-react`

## Root Cause Analysis

### Primary Issue
The error occurs when the Combobox component from `@digdir/designsystemet-react` receives a `value` prop that is either:
1. **`undefined`** instead of an array, OR
2. An array containing **`undefined` or `null` elements** (e.g., `[undefined, "uri"]` or `["uri1", null, "uri2"]`)

### Where It's Happening
The error originates from `apps/dataset-catalog/components/dataset-form/components/theme-section.tsx` where Combobox components are used with:
- `value={values.euDataTheme}` (line 37)
- `value={values.losTheme}` (line 55)

Both Comboboxes use:
- `FastField` with `as={Combobox}`
- `multiple={true}` prop
- Direct value binding from Formik context

### The Problem Chain

1. **Data Source Issue**: 
   - The dataset coming from the API may have `euDataTheme` or `losTheme` arrays that contain `undefined` or `null` values
   - Example: `["uri1", undefined, "uri2"]` or `[null, "uri"]`

2. **Initial Values Processing**:
   - `datasetTemplate()` function in `dataset-initial-values.tsx` uses:
     ```typescript
     euDataTheme: dataset.euDataTheme ?? [],
     losTheme: dataset.losTheme ?? [],
     ```
   - This only handles the case where the field is missing, but **doesn't filter out undefined/null values** within the array

3. **Combobox Processing**:
   - The Combobox component's internal `useEffect` hook iterates over the value array
   - It tries to access `.value` property on each item in the array
   - When an item is `undefined`, accessing `undefined.value` throws the error

## Evidence from Codebase

### Defensive Patterns Found Elsewhere
Other Combobox usages in the codebase show defensive patterns:

1. **SpatialCombobox** (`libs/ui/src/lib/spatial-combobox/index.tsx`):
   ```typescript
   value={values.spatial || []}
   ```

2. **RecommendedDetailFields** (`apps/dataset-catalog/components/dataset-form/components/details-section/recommended-detail-fields.tsx`):
   ```typescript
   value={values.language ?? []}
   value={values.spatial || []}
   ```

3. **Single-value Comboboxes** in `minimized-detail-fields.tsx`:
   ```typescript
   value={props.values?.provenance ? [props.values?.provenance] : []}
   value={[props.values.type]}
   ```

### Missing Defensive Checks
The `theme-section.tsx` file passes values directly without filtering:
```typescript
value={values.euDataTheme}  // No filtering or fallback
value={values.losTheme}     // No filtering or fallback
```

## Type Definitions

From `libs/types/src/lib/dataset.ts`:
```typescript
euDataTheme?: string[];
losTheme?: string[];
```

These are optional arrays of strings, but the API may return arrays with undefined/null elements.

## Likely Scenarios

1. **API Response Issue**: The backend API returns arrays with undefined/null values:
   ```json
   {
     "euDataTheme": ["uri1", null, "uri2"],
     "losTheme": [undefined, "uri"]
   }
   ```

2. **Form State Manipulation**: During form interactions, undefined values might be introduced into the arrays

3. **Combobox Library Expectation**: The Combobox library might expect objects with `.value` properties in certain modes, but receives plain strings (though this is less likely given the `multiple` prop usage)

## Recommended Fix Strategy (Application-Level Only)

**⚠️ Constraint**: Since we cannot modify the Combobox component in the design system, all fixes must be implemented in our application code.

### Option 1: Filter at Component Level (Immediate Fix)
Add defensive filtering in `theme-section.tsx`:

```typescript
value={values.euDataTheme?.filter(Boolean) ?? []}
value={values.losTheme?.filter(Boolean) ?? []}
```

### Option 2: Clean Initial Values (Comprehensive Fix)
Ensure initial values are clean in `dataset-initial-values.tsx`:

```typescript
euDataTheme: (dataset.euDataTheme ?? []).filter(Boolean),
losTheme: (dataset.losTheme ?? []).filter(Boolean),
```

### Option 3: Combined Approach (Recommended)
Implement both:
1. Clean initial values at the template level
2. Add defensive checks in the component for runtime safety
3. Validate values exist in available options before passing to Combobox

### Option 4: Create Utility Functions (Reusable Solution)
Create helper functions to safely prepare values for Combobox:

```typescript
// utils/combobox-helpers.ts
export const sanitizeComboboxValue = (value: string | undefined | null): string[] => {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    return [];
  }
  return [value];
};

export const validateAndSanitizeComboboxValue = (
  value: string | undefined | null,
  availableOptions: Array<{ value: string } | string>,
  getValue?: (option: any) => string
): string[] => {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    return [];
  }
  
  const valueExtractor = getValue || ((option: any) => typeof option === 'string' ? option : option.value);
  const exists = availableOptions.some((option) => valueExtractor(option) === value);
  
  return exists ? [value] : [];
};
```

## Additional Considerations

- The error occurs in the Combobox's `useEffect`, which runs after initial render
- This suggests the problem might also occur when form values change dynamically
- Other Combobox fields in the form might have similar issues (e.g., `concepts`, `informationModelsFromFDK`, `qualifiedAttributions`)

## Related Files

- `apps/dataset-catalog/components/dataset-form/components/theme-section.tsx` - Problem location
- `apps/dataset-catalog/components/dataset-form/utils/dataset-initial-values.tsx` - Initial values processing
- `apps/dataset-catalog/app/catalogs/[catalogId]/datasets/[datasetId]/edit/page.tsx` - Error location
- `libs/types/src/lib/dataset.ts` - Type definitions

## Design System Source Code Analysis

### Critical Code Location
The error originates from `packages/react/src/components/Combobox/Combobox.tsx` in the `designsystemet` repository, specifically in the `useEffect` hook at **lines 225-241**:

```typescript
useEffect(() => {
  if (value && Object.keys(options).length >= 0) {
    const updatedSelectedOptions = value.map((option) => {
      const value = options[prefix(option)];
      return value;
    });

    setSelectedOptions(
      updatedSelectedOptions.reduce<{
        [key: string]: Option;
      }>((acc, value) => {
        acc[prefix(value.value)] = value;  // ❌ ERROR HERE: value can be undefined
        return acc;
      }, {}),
    );
  }
}, [multiple, value, options, setSelectedOptions]);
```

### Root Cause in Design System Code

1. **Line 227**: The `value` prop (array of strings) is mapped over:
   ```typescript
   const updatedSelectedOptions = value.map((option) => {
     const value = options[prefix(option)];
     return value;  // This can return undefined if option is not found
   });
   ```

2. **Line 228**: If `option` (from the `value` array) is `undefined` or `null`:
   - `prefix(undefined)` or `prefix(null)` is called
   - `options[prefix(undefined)]` returns `undefined`
   - So `updatedSelectedOptions` becomes an array like `[Option, undefined, Option]`

3. **Line 236**: The `reduce` function tries to access `value.value`:
   ```typescript
   acc[prefix(value.value)] = value;  // If value is undefined, this throws
   ```
   - When `value` is `undefined`, accessing `undefined.value` throws: `"can't access property 'value', value is undefined"`

### Option Type Structure
From `useCombobox.tsx` (lines 17-22):
```typescript
export type Option = {
  value: string;
  label: string;
  displayValue?: string;
  description?: string;
};
```

The Combobox expects `Option` objects with a `value` property, but when the lookup fails (due to undefined/null in the input array), it receives `undefined` instead.

### Why Commenting Out `value` Prop Fixes It

When the `value` prop is commented out (as in `references-table.tsx` lines 267 and 296):
- The Combobox uses `initialValue` or manages its own internal state
- The problematic `useEffect` (lines 225-241) doesn't run with invalid data
- The component works in an uncontrolled mode

However, this is **not a proper fix** because:
- The component loses controlled behavior
- Form state synchronization breaks
- The underlying data issue remains

## Additional Findings from references-table.tsx

The same error was occurring in `apps/dataset-catalog/components/dataset-form/components/relations-section/references-table.tsx`:

1. **Line 267**: `value={values?.referenceType ? [values?.referenceType] : []}` was commented out
2. **Line 296**: `value={values?.source && !isEmpty(values.source) ? [values.source] : []}` was commented out

This confirms the issue affects **all Combobox instances** that receive potentially undefined/null values, not just the theme section.

### Debug Output Analysis
From the console.log in `references-table.tsx` (line 246):
```typescript
console.log('debug', values, values.referenceType);
// output: debug Object { source: "", referenceType: "" } <empty string>
```

This shows that even empty strings can cause issues if not properly handled, though the primary issue is with `undefined`/`null` values.

## Conclusion

This is a **data sanitization problem** where arrays containing undefined/null values are being passed to a component that doesn't handle them gracefully. The fix requires filtering out falsy values before passing them to the Combobox component, both at the initial values stage and potentially at the component level for runtime safety.

### Design System Issue
The Combobox component in `@digdir/designsystemet-react` has a **defensive coding gap** in its `useEffect` hook (lines 225-241). It should filter out undefined/null values before processing, or add a guard clause to check if `value` exists before accessing `value.value`.

**⚠️ Important Constraint**: We **cannot modify** the Combobox component in the design system. All fixes must be implemented at the application level.

### Recommended Actions (Application-Level Only)

1. **Immediate Fix**: Filter and validate values at the component level in all Combobox usages
2. **Data Layer Fix**: Clean initial values in `dataset-initial-values.tsx`
3. **Value Validation**: Ensure all values passed to Combobox exist in available options before passing them
4. **Defensive Wrappers**: Consider creating wrapper components or utility functions to safely handle Combobox values

---

## Specific Fix Plan for references-table.tsx

### File: `apps/dataset-catalog/components/dataset-form/components/relations-section/references-table.tsx`

#### Issues Identified

1. **Line 267**: `value` prop is commented out for the referenceType Combobox
   - Current: `// value={values?.referenceType ? [values?.referenceType] : []}`
   - Problem: Component is uncontrolled, loses form state synchronization

2. **Line 296**: `value` prop is commented out for the source Combobox
   - Current: `// value={values?.source && !isEmpty(values.source) ? [values.source] : []}`
   - Problem: Component is uncontrolled, loses form state synchronization

3. **Line 266**: `onValueChange` handler uses `.toString()` on array
   - Current: `onValueChange={(value) => setFieldValue('referenceType', value.toString())}`
   - Problem: `value` is already a `string[]` from Combobox, `.toString()` converts array to comma-separated string

4. **Line 291-293**: `onValueChange` handler uses `.toString()` on array
   - Current: `onValueChange={(value) => { setSelectedUri(value.toString()); setFieldValue('source', value.toString()); }}`
   - Problem: Same issue - `value` is `string[]`, should extract first element

5. **Line 246**: Debug console.log should be removed in production

6. **Line 191-194**: `useEffect` dependency array missing `selectedValue`
   - Current: `}, [selectedUri, searchHits, initialDatasets]);`
   - Problem: Missing `selectedValue` in dependencies could cause stale state

### Specific Fixes

#### Fix 1: Restore and Fix referenceType Combobox (Line 265-284)

```typescript
<Combobox
  onValueChange={(value) => {
    // value is string[], extract first element for single selection
    const selectedValue = Array.isArray(value) && value.length > 0 ? value[0] : '';
    setFieldValue('referenceType', selectedValue);
  }}
  value={values?.referenceType && values.referenceType.trim() !== '' 
    ? [values.referenceType] 
    : []}
  placeholder={`${localization.datasetForm.fieldLabel.choseRelation}...`}
  portal={false}
  data-size='sm'
  error={errors?.referenceType}
  virtual
>
```

**Changes:**
- Restore `value` prop with proper sanitization (check for empty strings)
- Fix `onValueChange` to properly extract string from array
- Ensure empty strings are treated as no selection

#### Fix 2: Restore and Fix source Combobox (Line 289-317)

```typescript
<Combobox
  onChange={(input: any) => setSearchQuery(input.target.value)}
  onValueChange={(value) => {
    // value is string[], extract first element for single selection
    const selectedUriValue = Array.isArray(value) && value.length > 0 ? value[0] : '';
    setSelectedUri(selectedUriValue);
    setFieldValue('source', selectedUriValue);
  }}
  loading={searching}
  value={values?.source && values.source.trim() !== '' ? [values.source] : []}
  placeholder={`${localization.search.search}...`}
  portal={false}
  data-size='sm'
  error={errors?.source}
>
```

**Changes:**
- Restore `value` prop with proper sanitization (check for empty strings)
- Fix `onValueChange` to properly extract string from array
- Use `.trim()` to handle whitespace-only strings

#### Fix 3: Remove Debug Console.log (Line 246)

```typescript
// Remove this line:
// console.log('debug', values, values.referenceType);
```

#### Fix 4: Fix useEffect Dependency Array (Line 191-194)

```typescript
useEffect(() => {
  const allDatasets = [...(searchHits ?? []), ...initialDatasets, ...(selectedValue ? [selectedValue] : [])];
  setSelectedValue(allDatasets.find((dataset) => dataset.uri === selectedUri));
}, [selectedUri, searchHits, initialDatasets, selectedValue]); // Add selectedValue to dependencies
```

**Note:** Adding `selectedValue` might cause re-renders. Consider using `useCallback` or restructuring if performance issues occur.

### Complete Fixed Code Sections

#### Section 1: referenceType Combobox (Lines 263-285)

```typescript
<Fieldset data-size='sm'>
  <Fieldset.Legend>{localization.datasetForm.fieldLabel.relationType}</Fieldset.Legend>
  <Combobox
    onValueChange={(value) => {
      const selectedValue = Array.isArray(value) && value.length > 0 ? value[0] : '';
      setFieldValue('referenceType', selectedValue);
    }}
    value={values?.referenceType && values.referenceType.trim() !== '' 
      ? [values.referenceType] 
      : []}
    placeholder={`${localization.datasetForm.fieldLabel.choseRelation}...`}
    portal={false}
    data-size='sm'
    error={errors?.referenceType}
    virtual
  >
    <Combobox.Empty>{localization.search.noHits}</Combobox.Empty>
    {relations.map((relation) => (
      <Combobox.Option
        key={relation?.code}
        value={relation?.code}
        description={`${relation?.uriAsPrefix} (${relation?.uri})`}
      >
        {getTranslateText(relation?.label)}
      </Combobox.Option>
    ))}
  </Combobox>
</Fieldset>
```

#### Section 2: source Combobox (Lines 287-318)

```typescript
<Fieldset data-size='sm'>
  <Fieldset.Legend>{localization.datasetForm.fieldLabel.dataset}</Fieldset.Legend>
  <Combobox
    onChange={(input: any) => setSearchQuery(input.target.value)}
    onValueChange={(value) => {
      const selectedUriValue = Array.isArray(value) && value.length > 0 ? value[0] : '';
      setSelectedUri(selectedUriValue);
      setFieldValue('source', selectedUriValue);
    }}
    loading={searching}
    value={values?.source && values.source.trim() !== '' ? [values.source] : []}
    placeholder={`${localization.search.search}...`}
    portal={false}
    data-size='sm'
    error={errors?.source}
  >
    <Combobox.Empty>{localization.search.noHits}</Combobox.Empty>
    {comboboxOptions?.map((dataset) => {
      return (
        <Combobox.Option
          key={dataset.uri}
          value={dataset.uri}
          displayValue={dataset.title ? getTranslateText(dataset.title) : dataset.uri}
        >
          <div className={styles.comboboxOptionTwoColumns}>
            <div>{dataset.title ? getTranslateText(dataset.title) : dataset.uri}</div>
            <div>{getTranslateText(dataset.organization?.prefLabel) ?? ''}</div>
          </div>
        </Combobox.Option>
      );
    })}
  </Combobox>
</Fieldset>
```

### Testing Checklist

After implementing fixes, verify:

1. ✅ Reference Type Combobox:
   - [ ] Displays selected value when editing existing reference
   - [ ] Updates form state when value changes
   - [ ] Clears properly when value is removed
   - [ ] Shows error state when validation fails

2. ✅ Source/Dataset Combobox:
   - [ ] Displays selected dataset when editing existing reference
   - [ ] Updates form state when value changes
   - [ ] Clears properly when value is removed
   - [ ] Shows error state when validation fails
   - [ ] Search functionality still works
   - [ ] Loading state displays correctly

3. ✅ Form Submission:
   - [ ] Both fields submit correctly
   - [ ] Validation works as expected
   - [ ] Auto-save functionality works

4. ✅ Edge Cases:
   - [ ] Empty strings are handled correctly
   - [ ] Undefined/null values don't cause errors
   - [ ] Modal can be opened/closed without errors

---

## Additional Issue Discovered: Value Not Found in Options

### Error After Initial Fix
After implementing the fixes, a new error occurred:

**Error Location:** `references-table.tsx:260` (referenceType Combobox)

**Error Message:** `can't access property "value", value is undefined`

### Root Cause Analysis

The issue occurs because:

1. **Value Validation Missing**: The `value` prop is being set to `[values.referenceType]` without verifying that `values.referenceType` actually exists in the available options (the `relations` array).

2. **Combobox Internal Lookup Failure**: 
   - The Combobox's internal `useEffect` (lines 225-241 in design system) tries to look up the value in its options map
   - If `values.referenceType` doesn't match any `relation.code` in the `relations` array, the lookup returns `undefined`
   - When the reduce function tries to access `value.value` on `undefined`, it throws the error

3. **Possible Scenarios**:
   - `values.referenceType` might be an old/invalid value that no longer exists in relations
   - `values.referenceType` might be `undefined` or an empty string that passes the `.trim() !== ''` check but doesn't exist in options
   - The value might be from a different data source that doesn't match the relations codes

### The Problem in Code

Current code (line 266-268):
```typescript
value={values?.referenceType && values.referenceType.trim() !== '' 
  ? [values.referenceType] 
  : []}
```

**Issue**: This checks if the value is non-empty, but doesn't verify it exists in the `relations` array.

### Required Fix: Validate Value Against Available Options

The `value` prop should only be set if the value exists in the available options. For the referenceType Combobox, we need to check if `values.referenceType` matches any `relation.code` in the `relations` array.

#### Fix for referenceType Combobox

```typescript
value={
  values?.referenceType && 
  values.referenceType.trim() !== '' &&
  relations.some((relation) => relation.code === values.referenceType)
    ? [values.referenceType] 
    : []
}
```

Or using a helper function for clarity:

```typescript
const isValidReferenceType = (refType: string | undefined): boolean => {
  if (!refType || refType.trim() === '') return false;
  return relations.some((relation) => relation.code === refType);
};

// Then in the component:
value={isValidReferenceType(values?.referenceType) ? [values.referenceType] : []}
```

#### Fix for source Combobox

Similarly, for the source Combobox, we should validate that the URI exists in `comboboxOptions`:

```typescript
value={
  values?.source && 
  values.source.trim() !== '' &&
  comboboxOptions.some((option) => option.uri === values.source)
    ? [values.source] 
    : []
}
```

Or using a helper:

```typescript
const isValidSourceUri = (uri: string | undefined): boolean => {
  if (!uri || uri.trim() === '') return false;
  return comboboxOptions.some((option) => option.uri === uri);
};

// Then in the component:
value={isValidSourceUri(values?.source) ? [values.source] : []}
```

### Why This Happens

1. **Data Inconsistency**: The form might have a `referenceType` value that was valid when saved, but the relations list might have changed, or the value might be from a different source.

2. **Initial Render Timing**: When the modal first opens, `comboboxOptions` might not be fully populated yet, causing the lookup to fail.

3. **Form State vs Options State**: The form values might be set before the options are available, or the options might change after the form values are set.

### Complete Fixed Code

#### Updated referenceType Combobox (Lines 260-285)

```typescript
<Combobox
  onValueChange={(value) => {
    // value is string[], extract first element for single selection
    const selectedValue = Array.isArray(value) && value.length > 0 ? value[0] : '';
    setFieldValue('referenceType', selectedValue);
  }}
  value={
    values?.referenceType && 
    values.referenceType.trim() !== '' &&
    relations.some((relation) => relation.code === values.referenceType)
      ? [values.referenceType] 
      : []
  }
  placeholder={`${localization.datasetForm.fieldLabel.choseRelation}...`}
  portal={false}
  data-size='sm'
  error={errors?.referenceType}
  virtual
>
  <Combobox.Empty>{localization.search.noHits}</Combobox.Empty>
  {relations.map((relation) => (
    <Combobox.Option
      key={relation?.code}
      value={relation?.code}
      description={`${relation?.uriAsPrefix} (${relation?.uri})`}
    >
      {getTranslateText(relation?.label)}
    </Combobox.Option>
  ))}
</Combobox>
```

#### Updated source Combobox (Lines 290-304)

```typescript
<Combobox
  onChange={(input: any) => setSearchQuery(input.target.value)}
  onValueChange={(value) => {
    // value is string[], extract first element for single selection
    const selectedUriValue = Array.isArray(value) && value.length > 0 ? value[0] : '';
    setSelectedUri(selectedUriValue);
    setFieldValue('source', selectedUriValue);
  }}
  loading={searching}
  value={
    values?.source && 
    values.source.trim() !== '' &&
    comboboxOptions.some((option) => option.uri === values.source)
      ? [values.source] 
      : []
  }
  placeholder={`${localization.search.search}...`}
  portal={false}
  data-size='sm'
  error={errors?.source}
>
  <Combobox.Empty>{localization.search.noHits}</Combobox.Empty>
  {comboboxOptions?.map((dataset) => {
    return (
      <Combobox.Option
        key={dataset.uri}
        value={dataset.uri}
        displayValue={dataset.title ? getTranslateText(dataset.title) : dataset.uri}
      >
        <div className={styles.comboboxOptionTwoColumns}>
          <div>{dataset.title ? getTranslateText(dataset.title) : dataset.uri}</div>
          <div>{getTranslateText(dataset.organization?.prefLabel) ?? ''}</div>
        </div>
      </Combobox.Option>
    );
  })}
</Combobox>
```

### Alternative Approach: Use useMemo for Validation

For better performance and cleaner code, consider using `useMemo` to compute valid values:

```typescript
const validReferenceType = useMemo(() => {
  if (!values?.referenceType || values.referenceType.trim() === '') return null;
  const exists = relations.some((relation) => relation.code === values.referenceType);
  return exists ? values.referenceType : null;
}, [values?.referenceType]);

const validSourceUri = useMemo(() => {
  if (!values?.source || values.source.trim() === '') return null;
  const exists = comboboxOptions.some((option) => option.uri === values.source);
  return exists ? values.source : null;
}, [values?.source, comboboxOptions]);

// Then in the Comboboxes:
value={validReferenceType ? [validReferenceType] : []}
value={validSourceUri ? [validSourceUri] : []}
```

### Application-Level Workaround Strategy

Since we **cannot modify the design system component**, we must implement all fixes in our application code:

1. **Always validate values exist in options** before passing to Combobox
2. **Filter out undefined/null values** at the data preparation stage
3. **Use defensive checks** at every Combobox usage point
4. **Consider creating wrapper components** that handle validation automatically
5. **Document the pattern** so all developers follow the same approach

### Recommended Wrapper Component Pattern

To avoid repeating validation logic, consider creating a safe wrapper:

```typescript
// components/SafeCombobox.tsx
import { Combobox, ComboboxProps } from '@digdir/designsystemet-react';
import { useMemo } from 'react';

type SafeComboboxProps = ComboboxProps & {
  validateValue?: boolean;
  availableValues?: string[];
};

export const SafeCombobox = ({ 
  value, 
  validateValue = true, 
  availableValues = [],
  ...props 
}: SafeComboboxProps) => {
  const safeValue = useMemo(() => {
    if (!value || !Array.isArray(value)) return [];
    
    // Filter out undefined/null values
    const filtered = value.filter(Boolean);
    
    // If validation is enabled, check values exist in available options
    if (validateValue && availableValues.length > 0) {
      return filtered.filter((v) => availableValues.includes(v));
    }
    
    return filtered;
  }, [value, validateValue, availableValues]);

  return <Combobox {...props} value={safeValue} />;
};
```

### Testing Checklist for This Fix

1. ✅ Value Validation:
   - [ ] Invalid referenceType values are ignored (empty array passed)
   - [ ] Valid referenceType values are displayed correctly
   - [ ] Invalid source URIs are ignored (empty array passed)
   - [ ] Valid source URIs are displayed correctly

2. ✅ Edge Cases:
   - [ ] Form opens with invalid stored values (should not crash)
   - [ ] Form opens with valid stored values (should display correctly)
   - [ ] Options load after form values are set (should update correctly)
   - [ ] Value changes from valid to invalid (should clear selection)

3. ✅ Performance:
   - [ ] Validation doesn't cause unnecessary re-renders
   - [ ] useMemo approach (if used) works correctly

---

## Critical Issue: SafeCombobox Still Failing

### Error After SafeCombobox Implementation

**Error Location:** `references-table.tsx:65` (SafeCombobox return statement)

**Error Message:** `can't access property "value", value is undefined`

### Root Cause Analysis

Even with SafeCombobox filtering and validating values, the error persists. This indicates:

1. **Timing Issue**: The Combobox's internal `useEffect` (lines 225-241 in design system) runs **before** the options are fully registered in the Combobox's internal options map.

2. **Options Registration Order**: The Combobox builds its options map from the `children` (Combobox.Option components), but the `value` prop is processed in a `useEffect` that may run before all options are registered.

3. **Race Condition**: When `safeValue` contains a valid value (exists in `availableValues`), but the Combobox hasn't finished processing its children yet, the lookup `options[prefix(value)]` returns `undefined`.

### The Problem

The SafeCombobox validates that values exist in our `availableValues` array, but the Combobox component has its own internal options map that it builds from `children`. There's a timing mismatch:

1. SafeCombobox validates: ✅ Value exists in `availableValues`
2. SafeCombobox passes to Combobox: `value={safeValue}`
3. Combobox's useEffect runs: Tries to look up value in internal options map
4. Options map not ready: Returns `undefined`
5. Error: Tries to access `undefined.value`

### Required Fix: Delay Value Setting Until Options Are Ready

We need to ensure the `value` prop is only set when:
1. The value is valid (exists in availableValues) ✅ (already done)
2. The Combobox has finished processing its children/options ⚠️ (missing)

### Solution Options

#### Option 1: Conditional Rendering with useEffect (Recommended)

Only set the value after options are confirmed to be available:

```typescript
const SafeCombobox = ({ value, availableValues = [], children, ...props }: SafeComboboxProps) => {
  const [isOptionsReady, setIsOptionsReady] = useState(false);
  const [delayedValue, setDelayedValue] = useState<string[]>([]);

  const safeValue = useMemo(() => {
    if (!value || !Array.isArray(value)) return [];

    // Filter out undefined/null/falsy values
    const filtered = value.filter((v) => v != null && v !== '' && String(v).trim() !== '');

    // If validation is enabled and we have available values, check values exist in options
    if (availableValues.length > 0) {
      return filtered.filter((v) => availableValues.includes(String(v)));
    }

    return filtered;
  }, [value, availableValues]);

  // Delay setting value until after initial render (allows options to register)
  useEffect(() => {
    // Small delay to ensure Combobox has processed its children
    const timer = setTimeout(() => {
      setIsOptionsReady(true);
      setDelayedValue(safeValue);
    }, 0);

    return () => clearTimeout(timer);
  }, [safeValue]);

  // Only set value after options are ready
  const finalValue = isOptionsReady ? delayedValue : [];

  return <Combobox {...props} value={finalValue}>{children}</Combobox>;
};
```

#### Option 2: Only Set Value When Options Are Available

Check if options exist before setting value:

```typescript
const SafeCombobox = ({ value, availableValues = [], ...props }: SafeComboboxProps) => {
  const safeValue = useMemo(() => {
    if (!value || !Array.isArray(value)) return [];

    const filtered = value.filter((v) => v != null && v !== '' && String(v).trim() !== '');

    if (availableValues.length > 0) {
      return filtered.filter((v) => availableValues.includes(String(v)));
    }

    return filtered;
  }, [value, availableValues]);

  // Only set value if we have available values (indicating options are ready)
  // For referenceType: relations are static, so always available
  // For source: only set when comboboxOptions has items
  const shouldSetValue = availableValues.length > 0 || safeValue.length === 0;

  return <Combobox {...props} value={shouldSetValue ? safeValue : []} />;
};
```

#### Option 3: Use initialValue Instead of value (Uncontrolled Initially)

Start uncontrolled, then switch to controlled:

```typescript
const SafeCombobox = ({ value, availableValues = [], ...props }: SafeComboboxProps) => {
  const safeValue = useMemo(() => {
    if (!value || !Array.isArray(value)) return [];
    const filtered = value.filter((v) => v != null && v !== '' && String(v).trim() !== '');
    if (availableValues.length > 0) {
      return filtered.filter((v) => availableValues.includes(String(v)));
    }
    return filtered;
  }, [value, availableValues]);

  const [useInitialValue, setUseInitialValue] = useState(true);

  useEffect(() => {
    // After first render, switch to controlled mode
    if (useInitialValue && safeValue.length > 0) {
      setUseInitialValue(false);
    }
  }, [safeValue, useInitialValue]);

  if (useInitialValue && safeValue.length > 0) {
    return <Combobox {...props} initialValue={safeValue} />;
  }

  return <Combobox {...props} value={safeValue} />;
};
```

#### Option 4: Don't Set Value Until Options Are Confirmed (Simplest)

For the source Combobox specifically, only set value when `comboboxOptions` has items:

```typescript
// In FieldModal component, for source Combobox:
value={
  comboboxOptions.length > 0 && 
  values?.source && 
  values.source.trim() !== '' &&
  comboboxOptions.some((option) => option.uri === values.source)
    ? [values.source] 
    : []
}
```

### Recommended Approach

**For referenceType Combobox**: Use Option 2 or Option 4 - relations are static, so options are always available immediately.

**For source Combobox**: Use Option 4 - only set value when `comboboxOptions.length > 0`, ensuring options are loaded.

### Updated SafeCombobox Implementation

```typescript
const SafeCombobox = ({ 
  value, 
  availableValues = [], 
  requireOptionsReady = false,
  ...props 
}: SafeComboboxProps & { requireOptionsReady?: boolean }) => {
  const safeValue = useMemo(() => {
    if (!value || !Array.isArray(value)) return [];

    const filtered = value.filter((v) => v != null && v !== '' && String(v).trim() !== '');

    if (availableValues.length > 0) {
      return filtered.filter((v) => availableValues.includes(String(v)));
    }

    return filtered;
  }, [value, availableValues]);

  // If requireOptionsReady is true, only set value when options are available
  const finalValue = requireOptionsReady && availableValues.length === 0 ? [] : safeValue;

  return <Combobox {...props} value={finalValue} />;
};
```

Then use it like:
```typescript
// For referenceType (static options, always ready):
<SafeCombobox ... availableValues={availableRelationCodes} />

// For source (dynamic options, wait until ready):
<SafeCombobox ... availableValues={availableDatasetUris} requireOptionsReady />
```
