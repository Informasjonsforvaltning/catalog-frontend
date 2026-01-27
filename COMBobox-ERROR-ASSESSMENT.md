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

## Recommended Fix Strategy

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

### Recommended Actions

1. **Immediate Fix**: Filter values at the component level in all Combobox usages
2. **Data Layer Fix**: Clean initial values in `dataset-initial-values.tsx`
3. **Long-term**: Consider contributing a fix to the design system to handle undefined/null values gracefully
