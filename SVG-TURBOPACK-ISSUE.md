# SVG Runtime Error with Turbopack - Issue Documentation

## Problem Summary

After merging `main` into `feat/el/dataset-ds-upgrade-merge`, the application encounters a persistent runtime error when trying to render SVG files imported as React components in the header component.

**Error Message:**
```
Runtime InvalidCharacterError: String contains an invalid character at /_next/static/media/fdk-publishing-logo-negative.3223c51d2312407704c9685338a33d0d.svg (unknown:0:0) at Header
```

**Console Warning:**
```
NX: Next.js SVGR support is deprecated. If used with turbopack, it may not work as expected and is not recommended. Please configure SVGR manually.
```

## Affected Files

- **Component:** `libs/ui/src/lib/header/index.tsx`
- **SVG Files:**
  - `libs/ui/src/lib/header/images/fdk-publishing-logo-negative.svg`
  - `libs/ui/src/lib/header/images/fdk-publishing-logo-negative-demo.svg`
- **Import Statement:**
  ```typescript
  import FDKLogo from './images/fdk-publishing-logo-negative.svg';
  import FDKLogoDemo from './images/fdk-publishing-logo-negative-demo.svg';
  ```
- **Usage:**
  ```typescript
  {useDemoLogo ? <FDKLogoDemo /> : <FDKLogo />}
  ```

## Current Configuration

### `apps/dataset-catalog/next.config.js`
```javascript
const nextConfig = {
  env: {
    DATASET_CATALOG_BASE_URI: process.env.DATASET_CATALOG_BASE_URI,
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    );

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  turbopack: {
    root: path.join(__dirname, "../.."),
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
```

### `apps/dataset-catalog/project.json`
```json
{
  "serve": {
    "executor": "@nx/next:server",
    "options": {
      "buildTarget": "dataset-catalog:build",
      "dev": true,
      "turbo": false
    }
  }
}
```

### TypeScript Declaration (`apps/dataset-catalog/index.d.ts`)
```typescript
declare module "*.svg" {
  const content: any;
  export const ReactComponent: any;
  export default content;
}
```

## What We've Tried

1. ✅ **Added webpack SVG configuration** - Configured `@svgr/webpack` loader
2. ✅ **Added turbopack SVG rules** - Configured `turbopack.rules` for SVG handling
3. ✅ **Disabled Turbopack in NX** - Set `"turbo": false` in `project.json`
4. ✅ **Simplified webpack config** - Removed complex SVGO options
5. ✅ **Restored SVG files from main** - Verified files are identical (13,970 bytes, no BOM)
6. ✅ **Cleared all caches** - Removed `.next` and `node_modules/.cache`
7. ✅ **Verified SVG file validity** - Files are valid XML, no encoding issues

**Result:** Issue persists. Turbopack deprecation warning still appears, indicating Turbopack is still active despite `turbo: false` setting.

## Root Cause Analysis

### Why It's Not Working

1. **Turbopack is Still Active**
   - The deprecation warning confirms Turbopack is running
   - The `"turbo": false` option in `project.json` may not be working as expected
   - Next.js 15.5.3 may default to Turbopack regardless of NX settings

2. **Turbopack SVG Processing Issue**
   - Turbopack's SVG handling with `@svgr/webpack` appears to be broken or incompatible
   - The "String contains an invalid character" error suggests Turbopack is not properly transforming the SVG to a React component
   - The deprecated SVGR support in Turbopack is known to have issues

3. **Configuration Conflict**
   - Both webpack and turbopack configs exist, but Turbopack takes precedence
   - Webpack config is ignored when Turbopack is active

### Technical Details

- **Next.js Version:** 15.5.3 (this branch) / 16.1.1 (main branch)
- **NX Version:** 21.5.2
- **SVGR Webpack Version:** ^8.1.0
- **SVG File Size:** 13,970 bytes
- **SVG Encoding:** UTF-8, no BOM, valid XML

### Next.js Version Discrepancy

**Important Note:** This feature branch (`feat/el/dataset-ds-upgrade-merge`) is currently using **Next.js 15.5.3**, while the remote `main` branch has been upgraded to **Next.js 16.1.1**.

**Why the discrepancy exists:**
- This feature branch was created before the Next.js 16 upgrade was merged into `main`
- The branch focuses on design system upgrades and UI improvements, not Next.js version upgrades
- During the merge of `main` into this branch, the Next.js version from `main` (16.1.1) was not adopted to avoid introducing breaking changes and additional complexity
- The merge strategy prioritized keeping the branch's working Next.js 15.5.3 configuration to maintain stability during the design system migration

**Impact on this issue:**
- **Important**: The main branch (with Next.js 16.1.1) has been tested and is currently in production, working fine with its SVGs
- This strongly suggests the SVG issue is related to the version downgrade, not a fundamental problem
- Next.js 16 likely has improved Turbopack SVG handling that resolves this issue
- The issue may be resolved in Next.js 16, but upgrading would require:
  - Testing all design system changes with Next.js 16
  - Resolving any breaking changes introduced by the upgrade
  - Ensuring compatibility with all dependencies
- For now, we're working within the constraints of Next.js 15.5.3

**Future consideration:**
- After this branch is merged and the design system upgrades are stable, consider upgrading to Next.js 16 to potentially resolve this SVG/Turbopack issue
- Next.js 16 may have better Turbopack support and could eliminate the need for workarounds

## Assessment: Revert Fixes and Upgrade Dependencies First?

### Should We Revert All SVG Fix Attempts and Upgrade Dependencies?

**Current Situation:**
- Multiple fix attempts have been made (webpack config, turbopack rules, disabling turbo, etc.)
- None have resolved the issue
- Branch is using Next.js 15.5.3 while main has Next.js 16.1.1
- Many other dependencies were downgraded during merge (see `MERGE-PLAN.md` for complete list)

### Arguments FOR Reverting and Upgrading First

1. **Next.js 16 May Fix the Issue**
   - **Critical**: The main branch (Next.js 16.1.1) is in production and SVGs work correctly there
   - This strongly indicates the issue is version-related, not a configuration problem
   - Next.js 16.1.1 has improved Turbopack SVG handling that resolves this issue
   - The issue might be a known bug fixed in Next.js 16
   - Upgrading could eliminate the need for workarounds entirely

2. **Dependency Compatibility**
   - React 19.2.3 (main) vs 19.1.1 (branch) may have fixes
   - NX 22.3.3 (main) vs 21.5.2 (branch) may have better Next.js/Turbopack integration
   - Other dependency upgrades may include relevant bug fixes

3. **Clean Slate Approach**
   - Reverting fixes removes potentially conflicting configurations
   - Starting fresh with correct versions may reveal the issue was version-related
   - Less technical debt from workarounds

4. **Alignment with Main**
   - Upgrading now aligns branch with main's dependency versions
   - Reduces merge complexity later
   - Ensures compatibility with main's codebase

### Arguments AGAINST Reverting and Upgrading First

1. **Risk of Breaking Changes**
   - Next.js 16 may introduce breaking changes that affect design system upgrades
   - NX 22.3.3 is a major version upgrade (21.5.2 → 22.3.3)
   - React 19.2.3 may have subtle behavior changes
   - Could break existing functionality beyond SVG issue

2. **Time Investment**
   - Upgrading all dependencies requires:
     - Testing all design system components
     - Resolving any breaking changes
     - Fixing compatibility issues
     - Comprehensive regression testing
   - May take significant time before we can verify if SVG issue is resolved

3. **Uncertainty**
   - No guarantee Next.js 16 fixes the SVG issue
   - Issue might persist even after upgrade
   - Would need to implement fixes anyway if upgrade doesn't help

4. **Current Fixes May Still Be Needed**
   - Even with Next.js 16, SVG configuration might still be required
   - The webpack/turbopack configs added might be necessary regardless of version

### Recommended Approach

**Option A: Upgrade Dependencies First (Recommended if time permits)**

**Steps:**
1. Revert all SVG-related configuration changes:
   - Remove webpack SVG config from `next.config.js`
   - Remove turbopack SVG rules
   - Remove `"turbo": false` from `project.json`
   - Restore original `next.config.js` from before merge

2. Upgrade all dependencies to match main:
   - Accept main's `package.json` version for all downgraded dependencies
   - See `MERGE-PLAN.md` section "⚠️ IMPORTANT: Version Upgrades from Main" for complete list
   - Key upgrades: Next.js 16.1.1, React 19.2.3, NX 22.3.3, etc.

3. Test with upgraded dependencies:
   - Run dev server and check if SVG issue persists
   - If resolved, no further action needed
   - If persists, implement fixes with correct dependency versions

4. If issue persists after upgrade:
   - Implement SVG fixes with Next.js 16 in mind
   - May need different configuration for Next.js 16

**Pros:**
- Addresses root cause (version mismatch) first
- Aligns with main branch
- May resolve issue without workarounds
- Cleaner long-term solution

**Cons:**
- Requires significant testing effort
- Risk of breaking changes
- Time investment before knowing if it helps

**Option B: Keep Current Fixes, Upgrade Later (Pragmatic)**

**Steps:**
1. Keep current SVG configuration attempts
2. Implement workaround (Solution 2: Use SVG as image URL) to unblock development
3. Upgrade dependencies after branch is merged and stable
4. Revisit SVG issue post-upgrade

**Pros:**
- Unblocks development immediately
- Lower risk approach
- Can address upgrade separately

**Cons:**
- Technical debt from workarounds
- Issue may persist after upgrade anyway
- More complex merge later

### Final Recommendation

**If you have time and resources:**
✅ **Revert fixes and upgrade dependencies first** (Option A)
- **Strong evidence**: Main branch (Next.js 16.1.1) is in production with working SVGs
- The issue is almost certainly version-related, not a configuration problem
- Next.js 16 likely resolves it (as proven in production)
- Cleaner solution long-term
- Aligns branch with main

**If you need to unblock development quickly:**
✅ **Implement workaround, upgrade later** (Option B)
- Use SVG as image URL (Solution 2) to unblock
- Document the workaround clearly
- Plan dependency upgrade as separate task

### Implementation Checklist (If Choosing Option A)

- [ ] Revert `apps/dataset-catalog/next.config.js` to pre-fix state
- [ ] Revert `apps/dataset-catalog/project.json` (remove `"turbo": false`)
- [ ] Accept main's `package.json` for all downgraded dependencies
- [ ] Run `yarn install` to update dependencies
- [ ] Test build: `yarn nx build dataset-catalog`
- [ ] Test dev server: `yarn nx serve dataset-catalog`
- [ ] Verify SVG rendering works
- [ ] If issue persists, implement fixes with Next.js 16 configuration
- [ ] Document any breaking changes encountered during upgrade

## Suggested Solutions

### Solution 1: Force Webpack Mode (Recommended)

**Option A: Use NX command flag**
```bash
yarn nx serve dataset-catalog --no-turbo
```

**Option B: Update project.json to explicitly disable Turbopack**
```json
{
  "serve": {
    "executor": "@nx/next:server",
    "options": {
      "buildTarget": "dataset-catalog:build",
      "dev": true,
      "turbo": false,
      "experimental": {
        "turbo": false
      }
    }
  }
}
```

**Option C: Add to package.json scripts**
```json
{
  "scripts": {
    "serve:dataset-catalog": "nx serve dataset-catalog --no-turbo"
  }
}
```

### Solution 2: Use SVG as Image URL (Workaround)

Modify the header component to use SVG as a regular image instead of a React component:

**In `libs/ui/src/lib/header/index.tsx`:**
```typescript
// Change from:
import FDKLogo from './images/fdk-publishing-logo-negative.svg';
import FDKLogoDemo from './images/fdk-publishing-logo-negative-demo.svg';

// To:
import FDKLogoUrl from './images/fdk-publishing-logo-negative.svg?url';
import FDKLogoDemoUrl from './images/fdk-publishing-logo-negative-demo.svg?url';

// And in JSX:
<img 
  src={useDemoLogo ? FDKLogoDemoUrl : FDKLogoUrl} 
  alt="FDK Logo" 
  className={styles.logo}
/>
```

**Pros:**
- Bypasses SVGR processing entirely
- Works with both webpack and Turbopack
- Simple, reliable solution

**Cons:**
- Loses ability to style SVG with CSS
- Cannot pass props to SVG component
- Less flexible than React component

### Solution 3: Use Inline SVG (Alternative Workaround)

Embed the SVG directly in the component:

```typescript
const FDKLogoSVG = () => (
  <svg id="logoer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 248.07 56.4">
    {/* SVG content */}
  </svg>
);
```

**Pros:**
- Full control over SVG
- No build-time processing issues
- Can be styled and customized

**Cons:**
- Large component file
- Harder to maintain
- Duplicates SVG content

### Solution 4: Wait for Turbopack Fix

- Monitor Next.js/Turbopack updates for SVG support improvements
- Track issue: [Next.js GitHub - Turbopack SVG Support](https://github.com/vercel/next.js/issues)
- Consider upgrading to Next.js 16+ when stable (may have better Turbopack support)

### Solution 5: Use a Different SVG Library

Consider using `next-svg` or `react-svg` as alternatives:

```bash
yarn add react-svg
```

```typescript
import { ReactSVG } from 'react-svg';
<ReactSVG src="./images/fdk-publishing-logo-negative.svg" />
```

## Recommended Action Plan

1. **Immediate Fix (Solution 2):** Use SVG as image URL to unblock development
2. **Short-term:** Try Solution 1 (force webpack mode) to see if webpack handles SVGs correctly
3. **Long-term:** Monitor Next.js/Turbopack updates and consider upgrading when SVG support improves

## Testing Checklist

After implementing a solution:

- [ ] Dev server starts without errors
- [ ] No Turbopack deprecation warning (if using webpack)
- [ ] Header component renders correctly
- [ ] Logo displays properly
- [ ] No runtime errors in browser console
- [ ] Production build works (`yarn nx build dataset-catalog`)

## Related Issues

- Next.js 15 Turbopack SVG handling is known to be problematic
- NX integration with Next.js Turbopack may have configuration gaps
- `@svgr/webpack` compatibility with Turbopack is limited

## References

- [Next.js Turbopack Documentation](https://nextjs.org/docs/app/api-reference/next-config-js/turbopack)
- [SVGR Documentation](https://react-svgr.com/docs/next/)
- [NX Next.js Executor Options](https://nx.dev/technologies/react/next/api/executors/server)

---

**Last Updated:** 2026-01-19  
**Status:** Issue persists - awaiting solution implementation  
**Priority:** High (blocks development)
