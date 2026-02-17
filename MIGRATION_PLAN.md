# Migrate concept-catalog to designsystemet v1.11.1

## Context

`apps/concept-catalog` uses `libs/ui` (built on designsystemet v0.63.1). The goal is to switch to `libs/ui-v2` (built on v1.11.1) and update all direct `@digdir/designsystemet-react` imports to the new API. The concept-catalog `package.json` already declares `@digdir/designsystemet-react: 1.11.1`.

**Two types of changes needed:**

1. **~35 files**: Swap `@catalog-frontend/ui` → `@catalog-frontend/ui-v2` (most have identical APIs)
2. **~45 files**: Update direct `@digdir/designsystemet-react` usage to v1.11.1 API

---

## Prioritized Component Groups (simple → complex)

### Group 1: `@catalog-frontend/ui` → `@catalog-frontend/ui-v2` import swap

**Change**: Find-and-replace import path across all concept-catalog files.
**Note**: The `Spinner` wrapper changed size values: `"medium"` → `"md"`, `"large"` → `"lg"`, `"small"` → `"sm"`. Adjust any `Spinner` prop values after swapping.

Files with `@catalog-frontend/ui` imports: ~35 files across `app/` and `components/`.

---

### Group 2: Link, Box — no API changes

No prop changes needed for: `Link`, `Box`.

**Files**: `definition/index.tsx`, `codelist-code-links/index.tsx`, all `related-concepts/*`, `term-section.tsx`, `remark-section.tsx`, `example-section.tsx`, `version-section.tsx`, `status-section.tsx`

**Tag and Card**: `Tag` needs `size` → `data-size`, `color` → `data-color` (in `definition-section.tsx`: `<Tag size="sm" color="second">` → `<Tag data-size="sm" data-color="second">`). `Card` has no breaking changes for our usage.

---

### Group 3: Prop renames (`size`→`data-size`, `color`→`data-color`)

Global pattern: `size="value"` → `data-size="newValue"` for all DS components.

#### Heading (8 usages in 7 files)

| Old              | New                                                      |
| ---------------- | -------------------------------------------------------- |
| `size="small"`   | `data-size="sm"`                                         |
| `size="xsmall"`  | `data-size="xs"`                                         |
| `size="xxsmall"` | `data-size="2xs"`                                        |
| `spacing`        | Remove (all `spacing` props removed per migration guide) |

**Files**: `signout/page.tsx`, `notfound/page.tsx`, `no-access/page.tsx`, `change-requests-page-client.tsx`, `concept-activity-log.tsx`, `comment-activity-log.tsx`, `activity-log.tsx`, `definition-section.tsx`, `subject-section.tsx`

#### Paragraph

| Old         | New              |
| ----------- | ---------------- |
| `size="sm"` | `data-size="sm"` |

**Files**: `subject-section.tsx`, `concept-form/index.tsx`

#### Button (direct DS import)

| Old         | New              |
| ----------- | ---------------- |
| `size="sm"` | `data-size="sm"` |
| `variant`   | stays as-is      |

**Files**: `accept-concept-form-client.tsx`, `definition-section.tsx`, `relation-section.tsx`, `source-description-fieldset/index.tsx`, `subject-section.tsx`, `checkbox-tree-filter/index.tsx`, `import-modal/index.tsx`, `definition-modal/index.tsx`, `relation-modal/index.tsx`

#### Alert

| Old                  | New                    |
| -------------------- | ---------------------- |
| `size="sm"`          | `data-size="sm"`       |
| `severity="warning"` | `data-color="warning"` |

**Files**: `subject-section.tsx`

#### Spinner (direct import, 2 files)

| Old            | New                |
| -------------- | ------------------ |
| `title="..."`  | `aria-label="..."` |
| `size="sm"`    | `data-size="sm"`   |
| `size="large"` | `data-size="lg"`   |

**Files**: `concept-form/index.tsx`, `import-modal/index.tsx`

#### Textfield

| Old              | New                 |
| ---------------- | ------------------- |
| `size="sm"`      | `data-size="sm"`    |
| `htmlSize`       | `size` (if used)    |
| `characterLimit` | `counter` (if used) |

**Files**: `period-section.tsx`, `version-fieldset/index.tsx`, `relation-fieldset/index.tsx`, `value-range-section.tsx`, `source-for-definition/index.tsx`, `contact-section.tsx`, `internal-section/index.tsx`

#### Switch

| Old                | New              |
| ------------------ | ---------------- |
| `size="small"`     | `data-size="sm"` |
| `position="right"` | `position="end"` |

**Files**: `concept-page-client.tsx`

#### Textarea (direct DS)

| Old                                                | New                                                |
| -------------------------------------------------- | -------------------------------------------------- |
| No label/error props used, just `value`/`onChange` | Likely minimal changes, maybe `size` → `data-size` |

**Files**: `concept-page-client.tsx`, `internal-section/index.tsx`

---

### Group 4: Tabs — `Tabs.Content` → `Tabs.Panel`

Simple rename of compound component.

**Files** (4):

- `search-page-client.tsx`
- `change-requests-page-client.tsx`
- `activity-log-page-client.tsx`
- `concept-page-client.tsx`

---

### Group 5: NativeSelect → Select

Rename the import. `label` prop may be removed (use `<Label>` component if needed). `size` → `data-size`.

**Files** (2):

- `import-results-page-client.tsx`
- `change-request-sort/index.tsx`

---

### Group 6: Chip

| Old                              | New                                                   |
| -------------------------------- | ----------------------------------------------------- |
| `Chip.Group size="small"`        | `Chip.Group data-size="sm"`                           |
| `Chip.Toggle` (clickable action) | `Chip.Button` (exists in v1.11.1, used by ui-v2)      |
| `Chip.Toggle` (form toggle)      | `Chip.Radio` or `Chip.Checkbox` (per migration guide) |
| `Chip.Removable`                 | stays                                                 |

Migration guide says `Chip.Toggle` → `Chip.Radio`/`Chip.Checkbox`, but v1.11.1 also has `Chip.Button` (confirmed in `libs/ui-v2/src/lib/formik-multivalue-textfield/index.tsx`). For our click-action use cases (`onClick` navigation), `Chip.Button` is the right replacement.

**Files** (4):

- `search-page-client.tsx` — `Chip.Group` + `Chip.Removable`
- `import-results-page-client.tsx` — `Chip.Group` + `Chip.Removable`
- `concept-page-client.tsx` — `Chip.Toggle` with `onClick` → `Chip.Button`
- `concept-search-hits/index.tsx` — `Chip.Group` + `Chip.Toggle` with `onClick` → `Chip.Button`

---

### Group 7: ErrorMessage → ValidationMessage

Rename import. `size` → `data-size`.

**Files** (4):

- `version-fieldset/index.tsx`
- `contact-section.tsx`
- `definition-section.tsx`
- `source-description-fieldset/index.tsx`

---

### Group 8: Fieldset — compound component migration

`legend` prop removed → use `<Fieldset.Legend>`. `size` → `data-size`. `description`/`error` props removed.

**Before:**

```tsx
<Fieldset
  size="sm"
  legend={<TitleWithHelpTextAndTag>...</TitleWithHelpTextAndTag>}
>
  ...
</Fieldset>
```

**After:**

```tsx
<Fieldset data-size="sm">
  <Fieldset.Legend>
    <TitleWithHelpTextAndTag>...</TitleWithHelpTextAndTag>
  </Fieldset.Legend>
  ...
</Fieldset>
```

**Files** (6):

- `period-section.tsx`
- `version-fieldset/index.tsx`
- `relation-fieldset/index.tsx`
- `definition-section.tsx`
- `relation-section.tsx`
- `source-description-fieldset/index.tsx`

---

### Group 9: Radio.Group → Fieldset + useRadioGroup

`Radio.Group` removed. Replace with `<Fieldset>` + `useRadioGroup` hook from designsystemet.

**Before:**

```tsx
<Radio.Group legend="..." size="sm" value={value} onChange={handler}>
  <Radio value="a">A</Radio>
</Radio.Group>
```

**After:**

```tsx
<Fieldset data-size="sm">
  <Fieldset.Legend>...</Fieldset.Legend>
  <Radio {...getRadioProps({ value: "a" })}>A</Radio>
</Fieldset>
```

Use `const { getRadioProps } = useRadioGroup({ value, onChange })`.

**Files** (5):

- `change-request-filter/index.tsx`
- `activity-log-filter/index.tsx`
- `status-section.tsx`
- `relation-fieldset/index.tsx`
- `source-description-fieldset/index.tsx`

---

### Group 10: Checkbox.Group / CheckboxGroup → Fieldset + useCheckboxGroup

Same pattern as Radio.Group. Use `useCheckboxGroup` hook.

**Files** (3):

- `contact-section.tsx` — uses `<CheckboxGroup>` with legend/value/onChange
- `change-request-filter/index.tsx` — uses `<Checkbox.Group>`
- `internal-section/index.tsx` — uses `<Checkbox.Group>`

---

### Group 11: Accordion → Details

Complete rename. `border` prop → removed. Wrap in `<Card>` to preserve bordered appearance.

| Old                            | New                                   |
| ------------------------------ | ------------------------------------- |
| `<Accordion border>`           | `<Card><Details>...</Details></Card>` |
| `<Accordion>` (no border)      | `<Details>`                           |
| `<Accordion.Item>`             | `<Details>`                           |
| `<Accordion.Item defaultOpen>` | `<Details open>`                      |
| `<Accordion.Header level={3}>` | `<Details.Summary>`                   |
| `<Accordion.Content>`          | `<Details.Content>`                   |

**Note**: ui-v2's `AccordionItem` already uses `Details` internally, so files using `AccordionItem` from `@catalog-frontend/ui` only need the import swap (Group 1).

**Files needing direct Accordion→Details migration** (5):

- `import-results-page-client.tsx` — `<Accordion border={true}>`
- `concept-page-client.tsx` — `<Accordion>` with `Accordion.Item/Header/Content`
- `change-request-filter/index.tsx` — `<Accordion border>` with items
- `activity-log-filter/index.tsx` — `<Accordion border>`
- `search-filter/index.tsx` — `<Accordion border={true}>`

---

### Group 12: Modal → Dialog

Most complex migration. Complete restructuring of modal pattern.

| Old                     | New                                           |
| ----------------------- | --------------------------------------------- |
| `Modal.Root`            | removed                                       |
| `Modal.Trigger asChild` | Manual trigger via `ref.current?.showModal()` |
| `Modal.Dialog`          | `<Dialog ref={dialogRef}>`                    |
| `Modal.Header`          | `<Dialog.Block>`                              |
| `Modal.Content`         | `<Dialog.Block>`                              |
| `Modal.Footer`          | `<Dialog.Block>`                              |

**Reference implementation**: `libs/ui-v2/src/lib/confirm-modal/index.tsx`

**Files** (3):

- `import-modal/index.tsx` — complex multi-step modal
- `definition-modal/index.tsx` — form modal with trigger
- `relation-modal/index.tsx` — form modal with trigger

---

### Group 13: Remaining components

#### Combobox

Deprecated in v1.11.1 (migration guide says use `Suggestion`/`MultiSuggestion`) but still available and used by ui-v2. Keep `Combobox` for now; only update `size` → `data-size` if applicable.
**Files**: `relation-fieldset/index.tsx`, `subject-section.tsx`, `internal-section/index.tsx`

#### Skeleton

`Skeleton.Rectangle` → `<Skeleton variant="rectangle">`. Actual usage: `<Skeleton.Rectangle height="100px" width="100%" />` → `<Skeleton variant="rectangle" style={{ height: "100px", width: "100%" }} />` (or use `height`/`width` props if supported).
**File**: `relation-section.tsx`

#### Table

`size="sm"` → `data-size="sm"`. No `sortable` prop used (only basic table). Minimal change.
**File**: `relation-section.tsx`

#### Popover — significant restructuring

**Before** (v0.x):

```tsx
<Popover
  open={open}
  onClose={handler}
  placement="top"
  size="md"
  variant="default"
>
  <Popover.Trigger asChild>{trigger}</Popover.Trigger>
  <Popover.Content>{content}</Popover.Content>
</Popover>
```

**After** (v1.11.1, verified from `libs/ui-v2/src/lib/help-markdown/index.tsx`):

```tsx
<Popover.TriggerContext>
  <Popover.Trigger>{trigger}</Popover.Trigger>
  <Popover data-size="md" placement="top" data-color="default">
    {content}
  </Popover>
</Popover.TriggerContext>
```

Note: `open`/`onClose` → different pattern (TriggerContext manages state). `variant` → `data-color`. `size` → `data-size`. `Popover.Content` → just `Popover`.
**File**: `definition-section.tsx`

---

## Verification

After each group:

```bash
yarn build concept-catalog
```

Must compile with zero TypeScript errors before moving to the next group.

After all groups:

```bash
yarn lint concept-catalog
yarn test concept-catalog
yarn nx e2e concept-catalog-e2e
```
