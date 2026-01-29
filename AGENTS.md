# AGENTS.md

NX monorepo with Next.js 16 (App Router), Yarn 4, Keycloak auth via NextAuth.js, Digdir Designsystemet UI.

## Commands

```bash
yarn start <app>              # Dev server (concept-catalog, service-catalog, dataset-catalog, data-service-catalog)
yarn build <app>              # Build specific app
yarn lint / yarn lint-all     # Lint affected / all
yarn test / yarn test-all     # Test affected / all
yarn nx e2e <app>-e2e         # E2E tests (add --ui --debug for dev)
yarn graphql:codegen          # Regenerate GraphQL types after changing .graphql files
```

## Structure

```
apps/
  concept-catalog, service-catalog, dataset-catalog, data-service-catalog/  # Next.js apps
  catalog-portal, catalog-admin/     # Portal and admin
  *-e2e/                             # Playwright E2E tests
libs/
  data-access/    # API clients (libs/data-access/src/lib/<domain>/api/index.ts)
  ui/             # Shared components (wrap Digdir Designsystemet)
  types/          # Shared TypeScript types
  utils/          # Auth, localization, validation
```

## Import Aliases

```typescript
import { ... } from '@catalog-frontend/data-access';  // API functions
import { ... } from '@catalog-frontend/ui';           // UI components
import { ... } from '@catalog-frontend/types';        // TypeScript types
import { ... } from '@catalog-frontend/utils';        // Utilities, localization
import { ... } from '@concept-catalog/...';           // App-specific imports
```

## App Architecture

Each app: `app/` (layout, actions/, api/, catalogs/[catalogId]/), `components/`, `hooks/`, `utils/auth.ts`

### Page Protection (apps/<catalog>/utils/auth.ts)

```typescript
const MyPage = withReadProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/path`,
  async ({ catalogId, session, hasWritePermission, hasAdminPermission }) => <MyPageClient {...props} />,
);
```

### Server Actions (apps/<catalog>/app/actions/)

```typescript
"use server";
export async function updateConcept(initialConcept, values) {
  const session = await getValidSession();
  if (!session) return redirectToSignIn();
  const diff = compare(initialConcept, values); // JSON Patch via fast-json-patch
  await patchConceptApi(id, diff, session.accessToken);
  updateTag("concepts"); // Always invalidate cache after mutations
}
```

### Data Fetching

`Component → useQuery (hooks/) → API Route (app/api/) → Data-Access (libs/data-access) → Backend`

Data-access: accept `accessToken`, validate inputs (`validateUUID`, `validateOrganizationNumber`), return raw `Response`.

## Authentication

```typescript
const session = await getValidSession(); // Server components/actions
const session = await getServerSession(authOptions); // API routes
hasOrganizationReadPermission(token, catalogId); // Permission checks (also Write/Admin)
```

## Localization

Single language (Norwegian Bokmål). Use `localization` from `@catalog-frontend/utils`:
`localization.catalogType.concept`, `localization.alert.fail`, `localization.conceptForm.fieldName`

## UI Components (libs/ui)

- CSS/SCSS Modules, design tokens: `var(--fds-spacing-2)`
- Compound components: `FormLayout.Section`, `InfoCard.Item`
- Formik: `useFormikContext<FormType>()`
- New: `libs/ui/src/lib/<name>/index.tsx` + `.module.css`, export in `libs/ui/src/index.ts`

## Key Conventions

1. **Params are Promises**: `const { catalogId } = await params;` (Next.js 15+)
2. **forwardRef for inputs**: Use `forwardRef` with `displayName` for form components
3. **Validation before API calls**: Always validate UUIDs and org numbers
4. **Error messages**: Use `localization.alert.*`, never hardcoded text
5. **Cache invalidation**: Call `updateTag()` after every mutation
6. **Spread props**: Components accept and spread additional props

## Local Development

```bash
corepack enable && yarn && yarn start concept-catalog  # http://localhost:4200
```

Catalog apps need catalog ID in URL. If redirected to portal, select a catalog and replace domain with localhost:4200.

## TypeScript Guidelines

Hard rules (do not violate):

1. **Never use `any`** - Model types properly. Prefer generics, unions, or `unknown` + narrowing.
2. **Do not hide type errors** - Avoid `@ts-ignore`, `@ts-nocheck`, broad ESLint disables. If exception required, document _why_ and add removal condition.
3. **No unsafe type assertions** - Avoid `as SomeType` unless at a trusted boundary with justifying comment.
