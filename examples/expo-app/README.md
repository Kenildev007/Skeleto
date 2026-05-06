# skeleton-auto Expo example

Expo SDK 54 + RN 0.76 + Reanimated 3.16 + new architecture, demoing every shipped
`<AutoSkeleton>` feature on iOS, Android, and web.

## Run it

```bash
# Web (verified, fast)
pnpm export:web
# → dist/index.html + 1.0 MB JS bundle, includes skeleton-auto code

# Web dev server
pnpm web

# iOS (needs Xcode + CocoaPods)
pnpm ios          # or: npx expo run:ios
# This runs `expo prebuild`, generates an iOS native project,
# pod-installs, builds via xcodebuild, installs on simulator.

# Android (needs Android Studio + emulator booted)
pnpm android      # or: npx expo run:android
```

## What's verified

| Path | Status |
|---|---|
| `expo export --platform web` builds cleanly | ✅ — 465 modules, 1.0 MB bundle, skeleton-auto code present |
| iOS bundle generation via Metro (`http://localhost:8081/examples/expo-app/index.bundle?platform=ios`) | ✅ — 1384 modules, 11.6 MB, skeleton-auto + Reanimated 3 worklets in the output |
| `expo prebuild --platform ios` (generates native project) | ✅ — `ios/` directory, podfile, xcworkspace all created |
| `pod install` for the generated native project | ❌ blocked by **Xcode 15.0 in this dev env** — RN 0.76's `use_react_native!` macro requires Xcode 15.4+ |
| App renders on iOS sim end-to-end | ⚠ blocked by the above. Update Xcode → 15.4+ and `pnpm ios` should complete the build. |
| App renders on Android emulator | ⚠ untested in this session — same Metro path that produced the iOS bundle, expected to work |

The JS path (Metro bundle) is fully verified. The native build requires a newer Xcode than this machine has installed; that's an environment issue, not a library bug.

## Why pnpm + Expo needs special config

This example runs from a pnpm workspace. Two non-default config pieces are required:

### 1. Workspace `.npmrc` hoists Expo / RN transitive deps

```
public-hoist-pattern[]=*expo*
public-hoist-pattern[]=*react-native*
public-hoist-pattern[]=metro*
public-hoist-pattern[]=@react-native*
public-hoist-pattern[]=@babel/runtime
public-hoist-pattern[]=invariant
public-hoist-pattern[]=fbjs
# ... see workspace .npmrc for the full list
```

Without this, RN's transitive deps live inside `.pnpm/...` and Metro can't find them.

### 2. `metro.config.js` enables hierarchical lookup + maps workspace packages

```js
config.resolver.disableHierarchicalLookup = false;     // walk up to find hoisted deps
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Honor the package.json `exports` field with the react-native condition,
// so `skeleton-auto` resolves to its native entry instead of the web ESM build.
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['react-native', 'require', 'import'];

// Workspace packages — point Metro at source so it picks .native.ts files.
config.resolver.extraNodeModules = {
  '@skeleton-auto/core':   path.resolve(workspaceRoot, 'packages/core/src'),
  '@skeleton-auto/web':    path.resolve(workspaceRoot, 'packages/web/src'),
  '@skeleton-auto/native': path.resolve(workspaceRoot, 'packages/native/src'),
  'skeleton-auto':         path.resolve(workspaceRoot, 'packages/native/src'),
};
```

## Issues fixed during setup (and what they look like)

| Symptom | Root cause | Fix |
|---|---|---|
| `Unable to resolve module ./index from /workspace-root/.` | Metro's serverRoot is the workspace root; default `index.bundle` URL resolves from there | Hit `examples/expo-app/index.bundle` (workspace-relative) instead, or override Metro's `serverRoot` |
| `Unable to resolve module @babel/runtime from .pnpm/react-native-web/...` | RN's transitive deps live under `.pnpm/` and aren't reachable | Add `@babel/runtime` (and friends) to `.npmrc` `public-hoist-pattern` |
| `Unable to resolve module invariant` | Same as above for `invariant`, `fbjs`, `event-target-shim`, etc. | Add each to the hoist patterns |
| `Unable to resolve module @skeleton-auto/native from packages/react/dist/index.native.js` | Workspace packages aren't auto-resolvable across the symlink | Add to `extraNodeModules` map in `metro.config.js` |
| Bundle resolves to web entry instead of native | Metro reads `module` field by default | Enable `unstable_enablePackageExports` + `unstable_conditionNames: ['react-native', ...]` |

## What the app shows

Four scrollable demos using the production `<AutoSkeleton>` component:
1. Single user card (default shimmer)
2. Pulse animation
3. Stagger reveal (3 cards, `staggerChildren={80}`)
4. `<AutoSkeleton.List>` — bypasses measurement for fixed-height rows

Toggle controls: "Show real / Show skeleton" + "Simulate fetch (1.5s)".
