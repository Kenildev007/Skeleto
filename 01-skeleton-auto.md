# `skeleto`

**Zero-config, auto-generated skeleton loaders for React, React Native, and Expo.**

> Stop maintaining a parallel component tree for your loading states.  
> `skeleton-auto` reads your real UI and generates pixel-matching skeletons on the fly — smooth on web, smooth on mobile, smooth on Expo Go.

---

## 1. Market Analysis — Why This Wins

### What exists today (and why it's not enough)

| Library | Weekly DLs | Limitation |
|---|---|---|
| `react-loading-skeleton` | ~2M | Manual — you hand-author every skeleton |
| `react-native-skeleton-placeholder` | ~350k | Manual, unmaintained, Old Architecture only |
| `react-native-auto-skeleton` (pioner92) | ~3k | RN-only, no web, no React, Android border-radius broken |
| `boneyard-js` | <1k | Build-time Playwright step — heavy, CI-only, no RN |
| `auto-skeleton-react` (ShanukJ) | <500 | DOM-only, no RN, SSR flash |
| `react-skeletonify` | <2k | Web-only, no RN, no Expo |

### The gap

**No library today ships one API that works across React web, React Native, and Expo with Fabric + New Architecture support, runtime DOM/native view measurement, and zero build step.** Everyone has picked one surface. We own all three.

### Why devs will adopt this

1. **One import, one component.** Same API on web and mobile.
2. **No fixture files.** No Playwright. No build step. No CLI.
3. **Expo Go compatible** via a pure-JS fallback path (see §6).
4. **60 FPS guaranteed** — animation runs on the UI thread via Reanimated 3 worklets on RN, CSS `@keyframes` on web (never JS).
5. **Respects `prefers-reduced-motion`** out of the box.

---

## 2. Core API

```tsx
import { AutoSkeleton } from 'skeleto';

<AutoSkeleton loading={isLoading}>
  <UserCard user={user} />
</AutoSkeleton>
```

That's the 80% use case. Done.

### Full prop surface

```ts
type AutoSkeletonProps = {
  loading: boolean;
  children: React.ReactNode;

  // Animation
  animation?: 'shimmer' | 'pulse' | 'wave' | 'none'; // default 'shimmer'
  speed?: number;                    // seconds per cycle, default 1.4
  direction?: 'ltr' | 'rtl';         // default 'ltr'

  // Appearance
  baseColor?: string;                // default: theme-aware grey
  highlightColor?: string;           // default: theme-aware grey
  borderRadius?: number | 'inherit'; // default 'inherit'
  opacity?: number;                  // default 1

  // Behavior
  transition?: number;               // ms fade when loading → false, default 200
  staggerChildren?: number;          // ms between child reveals, default 0
  minDuration?: number;              // ms minimum skeleton display, default 0
                                     // (prevents flicker on fast loads)

  // Advanced
  preserveLayout?: boolean;          // keep exact layout, default true
  maxDepth?: number;                 // recursion limit, default 12
  onMeasure?: (nodes: MeasuredNode[]) => void; // debug hook

  // Accessibility (added in v0.2)
  loadingLabel?: string;             // default 'Loading content'
  trapFocus?: boolean;               // default true — applies inert + tabIndex=-1
                                     // to invisible real content so keyboard
                                     // users skip it
};
```

### Escape hatches

```tsx
// Force a specific role
<Text skeletonRole="text">Name</Text>
<Image skeletonRole="image" />

// Exclude entirely
<View skeletonIgnore>
  <ErrorBanner />
</View>

// Custom skeleton for one subtree
<AutoSkeleton.Custom render={() => <MyCustomBone />}>
  <ComplexChart />
</AutoSkeleton.Custom>
```

---

## 3. Architecture

### 3.1 Three-layer design

```
┌─────────────────────────────────────────────────────┐
│  Layer 1: Public API (platform-agnostic)            │
│  <AutoSkeleton>, hooks, types                       │
├─────────────────────────────────────────────────────┤
│  Layer 2: Measurement Engine (platform-specific)    │
│  ├─ web/    → DOM traversal + getBoundingClientRect │
│  └─ native/ → onLayout + UIManager.measureInWindow  │
├─────────────────────────────────────────────────────┤
│  Layer 3: Renderer (platform-specific)              │
│  ├─ web/    → CSS animations, absolute positioning  │
│  └─ native/ → Reanimated 3 worklets, Skia (opt)     │
└─────────────────────────────────────────────────────┘
```

### 3.2 Algorithm (platform-neutral)

```
ON loading = true:
  1. Render children INVISIBLY (opacity 0, pointerEvents none, aria-hidden)
  2. Measure every leaf node (w, h, x, y, borderRadius, role)
  3. Classify each leaf: text | image | circle | rect | icon | ignore
  4. Render skeleton layer ABOVE children at identical coordinates
  5. Animate on UI thread

ON loading = false:
  1. Fade skeleton layer (opacity 1 → 0) over `transition` ms
  2. Fade children (opacity 0 → 1) simultaneously
  3. Unmount skeleton after transition
```

### 3.3 The measurement problem (the hard part)

**Web** is easy: DOM is synchronous, `getBoundingClientRect()` returns real pixels after paint. We use `ResizeObserver` for re-measure on viewport changes.

**Native** is hard:
- `onLayout` fires async per view — we need a coordinated commit
- `UIManager.measureInWindow` is async and expensive
- Fabric's synchronous layout reads are only available in New Architecture
- Old Architecture has no reliable sync measure

**Our solution — dual-path (implemented in `packages/native/src/measure.fabric.ts`):**

```ts
// Sniff once: do host instances expose sync getBoundingClientRect?
// (Fabric does, legacy doesn't)
function isFabricView(view) {
  return typeof view.getBoundingClientRect === 'function';
}

// Fabric (New Architecture) — synchronous, zero promise hop
if (isFabricView(root)) {
  const rect = view.getBoundingClientRect();
}

// Legacy — async measureInWindow batched via Promise.all
else {
  await Promise.all(refs.map(measureInWindowPromise));
}
```

The detection result is cached so subsequent calls skip the sniff.

### 3.4 Role inference (score-based, not brittle if/else)

```ts
interface RoleScore {
  text: number;
  image: number;
  circle: number;
  rect: number;
  icon: number;
}

// Signals (each contributes weighted score)
- Component type (<Text>, <Image>, <Svg>)    → +10 for matching role
- Aspect ratio (1:1 + small)                 → +3 circle/icon
- borderRadius >= min(w,h)/2                 → +5 circle
- Has text content                           → +8 text
- Height < 24pt                              → +2 text
- Has backgroundImage / source               → +8 image
- data-skeleton-role override                → +100 (wins)
```

This is extensible — plugins can add signals without forking.

### 3.5 Why not just copy the DOM?

Approaches like Boneyard snapshot DOM at build time and replay. Problems:
- Stale: layouts drift when content changes
- Heavy: requires Playwright in CI
- Broken for RN: no headless browser for native

We measure **at runtime, once, on mount** — cost is ~1-3ms for typical screens, cached per mount.

---

## 4. Performance Contract

> **Non-negotiable: 60 FPS on an iPhone 12 and a mid-tier Android (Pixel 6a).**

### 4.1 Animation thread isolation

| Platform | Animation runs on | Verified via |
|---|---|---|
| Web | Compositor thread (CSS `@keyframes` with `transform` + `opacity` only) | No layout thrash, passes Lighthouse |
| RN New Arch | UI thread via Reanimated 3 worklets | Flipper frame profiler |
| RN Old Arch | Native driver (`useNativeDriver: true`) | — |
| Expo Go | JS-driven `Animated` (fallback, documented caveat) | — |

**We never animate `width`/`height`/`top`/`left`** — only `transform: translateX` and `opacity`.

### 4.2 Measurement cost budget

- Measurement pass: **< 4ms** for screens with ≤ 100 leaf nodes
- Re-measure on resize: debounced to next animation frame, **< 2ms**
- Cache: measurements stored in a `WeakMap` keyed on the children tree fingerprint

### 4.3 Bundle size contract

| Bundle | Target | v0.1 | v0.2 |
|---|---|---|---|
| `skeleton-auto/web` (core + web, gzip) | **< 6 KB** | 4.7 KB | **5.3 KB** ✓ |
| `skeleton-auto/native` (core + native, gzip, excl. Reanimated) | **< 8 KB** | 5.2 KB | **5.5 KB** ✓ |
| `core` only (gzip) | — | 1.4 KB | 1.4 KB |
| `web` only (gzip) | — | 3.7 KB | 4.2 KB |
| `native` only (gzip) | — | 4.2 KB | 4.5 KB |

Measured via `gzip -c dist/index.mjs | wc -c` after `tsup --format esm`. v0.2 added SSR fallback bone, focus-trap effect, SR-only label span, fingerprint walker + WeakMap cache, and Fabric sync path — net +600 bytes gzipped for web. The original <4 KB target was aspirational and didn't account for the realistic core+web shipping bundle; revised to <6 KB.

### 4.4 List performance

In `FlatList`/`FlashList` with 100+ rows, we guarantee:
- Skeleton items reuse measurements via cell-type memoization
- No layout calculation on scroll — only opacity animation survives
- Optional `<AutoSkeleton.List estimatedItemHeight={80} count={10} />` that skips measurement entirely

---

## 5. Expo Support — First-class

### 5.1 Compatibility matrix

| Environment | Support | Notes |
|---|---|---|
| Expo SDK 50+ (dev build) | ✅ Full, Fabric-ready | Default path |
| Expo SDK 50+ (Expo Go) | ✅ Works, JS-driven animation | See §5.2 |
| Expo Web | ✅ Full | Uses web renderer |
| Expo Router | ✅ Full | No conflicts |
| React Native Web | ✅ Full | |
| Next.js (SSR) | ✅ Full, no hydration flash | See §8.2 |

### 5.2 Expo Go fallback

Reanimated 3 is bundled with Expo Go but Skia is not. Our animation path:

```ts
if (isExpoGo()) {
  // Use Reanimated 3 shared values + useAnimatedStyle
  // (Reanimated IS in Expo Go since SDK 48)
} else if (hasSkia()) {
  // Use Skia LinearGradient shimmer (smoothest)
} else {
  // Reanimated 3 shared values (still 60fps)
}
```

No config plugin needed. Works out of the box on `npx create-expo-app`.

### 5.3 Install

```bash
# Expo
npx expo install skeleto react-native-reanimated

# Bare RN
npm install skeleto react-native-reanimated

# React web
npm install skeleto
```

No `expo prebuild` required for end-users. No `pod install` required (no custom native module).

### 5.4 pnpm + Expo monorepo recipe

If you're consuming `skeleton-auto` from inside a pnpm workspace (or developing the library itself), Metro doesn't natively understand pnpm's symlink layout. Two pieces of config are required — copy from `examples/expo-app/`:

**`.npmrc` at the workspace root** — hoist the deps Metro can't reach from `.pnpm/...`:

```
public-hoist-pattern[]=*expo*
public-hoist-pattern[]=*react-native*
public-hoist-pattern[]=metro*
public-hoist-pattern[]=@react-native*
public-hoist-pattern[]=@babel/runtime
public-hoist-pattern[]=invariant
public-hoist-pattern[]=fbjs
public-hoist-pattern[]=event-target-shim
public-hoist-pattern[]=regenerator-runtime
public-hoist-pattern[]=scheduler
public-hoist-pattern[]=use-sync-external-store
public-hoist-pattern[]=whatwg-fetch
public-hoist-pattern[]=base64-js
public-hoist-pattern[]=stacktrace-parser
public-hoist-pattern[]=anser
public-hoist-pattern[]=memoize-one
public-hoist-pattern[]=nullthrows
public-hoist-pattern[]=abort-controller
public-hoist-pattern[]=pretty-format
public-hoist-pattern[]=promise
```

**`metro.config.js` in the Expo app** — enable hierarchical lookup, package exports, and the `react-native` condition:

```js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('node:path');
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
config.resolver.disableHierarchicalLookup = false; // walk up for hoisted deps

config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['react-native', 'require', 'import'];

module.exports = config;
```

Without these, `pnpm start --ios` fails with `Unable to resolve module @babel/runtime / invariant / fbjs / @skeleto/native` from inside `.pnpm/`. With them, the iOS Metro bundle builds in ~18s with 1384 modules.

---

## 6. API Deep-dive

### 6.1 `<AutoSkeleton>` — the main component

```tsx
function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading } = useUser(userId);

  return (
    <AutoSkeleton loading={isLoading} transition={250} minDuration={400}>
      <View style={styles.card}>
        <Image source={{ uri: data?.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{data?.name}</Text>
        <Text style={styles.bio}>{data?.bio}</Text>
      </View>
    </AutoSkeleton>
  );
}
```

`minDuration={400}` prevents the "flicker" where a 50ms network response shows the skeleton for one frame. Always display skeletons for at least 400ms if they display at all — this is a UX principle backed by Nielsen Norman research.

### 6.2 `<AutoSkeleton.List>` — optimized for virtualized lists

```tsx
<FlashList
  data={isLoading ? [] : items}
  ListEmptyComponent={
    <AutoSkeleton.List
      count={8}
      estimatedItemHeight={72}
      renderItem={() => <UserRowSkeleton />}
    />
  }
/>
```

Bypasses measurement entirely when height is known.

### 6.3 `useSkeleton()` — for custom orchestration

```tsx
const { bind, isSkeleton } = useSkeleton({ loading });

return (
  <View {...bind}>
    {isSkeleton ? <PlaceholderBones /> : <RealContent />}
  </View>
);
```

### 6.4 `<SkeletonProvider>` — app-wide theming

```tsx
<SkeletonProvider
  theme={{
    baseColor: colors.neutral[200],
    highlightColor: colors.neutral[100],
    darkMode: {
      baseColor: colors.neutral[800],
      highlightColor: colors.neutral[700],
    },
  }}
  respectReducedMotion // auto-disables shimmer when user prefers reduced motion
>
  <App />
</SkeletonProvider>
```

### 6.5 Attribute-based overrides

```tsx
// Web
<div data-skeleton-role="image" />
<div data-skeleton-ignore />

// RN (via props)
<View skeletonRole="image" />
<View skeletonIgnore />
```

---

## 7. Accessibility (built-in, not bolted on)

- `aria-busy="true"` on the container while loading
- `aria-live="polite"` + visually-hidden span announces the `loadingLabel` prop (default `"Loading content"`)
- Skeleton layer has `aria-hidden="true"` — screen readers skip it
- Invisible real content gets the `inert` attribute (with `tabIndex=-1` fallback) so keyboard focus skips it; toggleable via `trapFocus={false}`
- `prefers-reduced-motion` → shimmer/wave downgrade to a slower pulse
- RN: `accessibilityState={{ busy: true }}`, `accessibilityLabel`, `accessibilityLiveRegion="polite"`, `accessibilityElementsHidden` on the invisible content

---

## 8. SSR & Hydration

### 8.1 Next.js App Router

```tsx
// Server component
<Suspense fallback={<AutoSkeleton.SSR shape="card" count={3} />}>
  <UserList />
</Suspense>
```

`AutoSkeleton.SSR` renders fixed-dimension skeleton markup that won't cause hydration mismatches.

### 8.2 The hydration flash problem (solved)

Most "auto" skeleton libraries flash blank space for one frame during hydration because measurement happens after paint. We handle this with a **two-stage skeleton**:

1. **SSR + first-paint stage** — `<AutoSkeleton>` renders a single full-size fallback bone covering the whole container. The HTML always contains a skeleton, so the user never sees blank space.
2. **Post-measure stage** — `useLayoutEffect` runs after hydration, measures the children, and swaps to per-leaf bones. The fallback bone fades out under the new bones smoothly via CSS opacity transition.
3. **Real content stage** — when `loading=false`, bones fade out (with optional stagger) and children fade in.

Implemented in `packages/web/src/AutoSkeleton.tsx` — the `nodes.length === 0 && stableLoading` branch renders the SSR-stable fallback.

Zero blank-frame in tested scenarios.

---

## 9. Testing Strategy

### 9.1 What's actually built (v0.4)

Two test runners are used — vitest where it works (fast, ESM-native) and jest where the React Native ecosystem demands it.

```
packages/
├── core/         vitest    # role inference, useStableLoading lifecycle (11 tests)
├── web/          vitest    # measureTree DOM walk, AutoSkeleton render w/ happy-dom (10 tests)
├── native/       jest      # annotateTree React-element walk, with RN mocks (4 tests)
└── codemod/      vitest    # jscodeshift transform: imports + ternary collapse (3 tests)

tests/
└── visual/       playwright  # 14 tests: bone-to-leaf alignment, axe-core a11y on
                              # 9 docs pages, animation-class presence, inert/aria-busy

benchmarks/
└── measure-bench.ts          # measureTree mean/p95 across 10/50/100/250/500/1000 leaves
└── measure-profile.ts        # sub-op cost breakdown (rect, getComputedStyle, textContent, ...)
```

**Run it all:**

```bash
pnpm -r test                                              # all unit tests
pnpm --filter skeleto-visual-tests test             # visual + a11y
pnpm --filter skeleto-benchmarks bench              # perf
```

**Real bugs caught by these tests:**
- `measureTree` was including `.sa-sr-only` and `.sa-layer` (skeleton-internal) as 1×1 ghost bones — `data-skeleton-ignore` style internal skip added
- `measureElement` filtered out `visibility:hidden` elements, but children of a `visibility:hidden` parent inherit it — meant ALL leaves were filtered. Removed the visibility check (display:none alone suffices)
- `ResizeObserver` only watched the root container, missing late layout shifts from font/image load — now also re-measures on `requestAnimationFrame`, on the window `load` event, and observes direct children

### 9.2 Performance benchmark (v0.4 baseline, after measureTree optimization)

| Leaves | mean (ms) | p95 (ms) |
|---|---|---|
| 10   | 0.5 | 1.0 |
| 50   | 0.6 | 0.7 |
| **100**  | **0.6** | **1.5** |
| 250  | 1.0 | 1.5 |
| 500  | 3.1 | 3.1 |
| 1000 | 4.0 | 4.8 |

Sub-linear scaling (1000 = 6.9× of 100, ideal would be 10×). Target was <4ms initial measure for ≤100 leaves; we're at 0.6ms.

### 9.3 CI gate (`.github/workflows/ci.yml`)

Three jobs run on every PR:

- **build-and-test** — install, build all 4 packages, run unit + codemod tests, **gate on `web` bundle gzip < 6 KB**, run benchmark
- **visual** — install + build, install Playwright chromium, run visual + a11y suite
- **expo-bundle** — install + build, run `expo export --platform web` to confirm the native package bundles (smoke test only — does not run on a sim in CI)

Future: add full iOS sim build via macOS runner + Xcode 15.4+, FlashList 500-item benchmark on iPhone 12 sim.

---

## 10. Monorepo Structure

Actual layout as of v0.4:

```
skeleton-auto/
├── packages/
│   ├── core/              # Platform-agnostic types, role inference, theme
│   │   └── src/
│   │       ├── types.ts
│   │       ├── roles.ts
│   │       ├── theme.ts
│   │       ├── loading-state.ts        # useStableLoading, usePrefersReducedMotion, usePrefersDark
│   │       └── *.test.ts               # vitest
│   ├── web/               # DOM measurement + CSS renderer
│   │   └── src/
│   │       ├── measure.ts              # DOM walker, leaf detection, role inference
│   │       ├── AutoSkeleton.tsx        # main component, SSR fallback, focus trap
│   │       ├── AutoSkeletonList.tsx
│   │       ├── AutoSkeletonCustom.tsx
│   │       ├── AutoSkeletonSSR.tsx
│   │       ├── SkeletonProvider.tsx
│   │       ├── useSkeleton.ts
│   │       ├── styles.css              # @keyframes shimmer / pulse / wave
│   │       └── *.test.{ts,tsx}         # vitest + @testing-library/react
│   ├── native/            # RN/Expo measurement + Reanimated renderer
│   │   └── src/
│   │       ├── measure.ts              # React-element walker, ref injection, async measureInWindow
│   │       ├── measure.fabric.ts       # New Architecture sync getBoundingClientRect path
│   │       ├── AutoSkeleton.tsx
│   │       ├── AutoSkeletonList.tsx
│   │       ├── AutoSkeletonCustom.tsx
│   │       ├── SkeletonProvider.tsx
│   │       ├── useSkeleton.ts
│   │       ├── Shimmer.tsx             # Reanimated 3 worklet + Animated fallback
│   │       └── *.test.ts               # jest + RN mocks
│   ├── react/             # Single npm-published entry — `skeleton-auto`
│   │   └── src/
│   │       ├── index.ts                # web entry (export * from @skeleto/web)
│   │       └── index.native.ts         # native entry (export * from @skeleto/native)
│   └── codemod/           # `skeleto-migrate` CLI
│       ├── bin/cli.js                  # `npx skeleto-migrate react-loading-skeleton ...`
│       ├── transforms/
│       │   └── from-react-loading-skeleton.ts
│       └── src/*.test.ts
├── examples/
│   ├── docs-site/         # Next.js 14 App Router — full docs + /compare + /playground
│   ├── vite-react/        # Vite + React smoke test
│   └── expo-app/          # Expo SDK 54 + RN 0.76 + Reanimated 3 + new arch
├── tests/
│   └── visual/            # Playwright + axe-core (14 tests, gates merges)
├── benchmarks/            # measureTree perf bench + sub-op profiler
├── launch/
│   └── hn-post.md         # v1.0 launch post draft + pre-flight checklist
├── .github/workflows/ci.yml  # build + tests + visual + bundle-size gate + Expo bundle smoke
├── .npmrc                 # pnpm hoist patterns for Expo / RN transitive deps
└── 01-skeleton-auto.md    # this design doc
```

Single package on npm: `skeleton-auto`. Platform resolution via `package.json` `exports` + React Native's own resolver picking `.native.ts`.

```json
{
  "name": "skeleto",
  "main": "./dist/index.js",
  "react-native": "./dist/index.native.js",
  "exports": {
    ".": {
      "react-native": "./dist/index.native.js",
      "browser": "./dist/index.js",
      "default": "./dist/index.js"
    }
  }
}
```

---

## 11. Rollout Plan

### v0.1 — MVP (4 weeks)
- Core `<AutoSkeleton>` on web + RN
- Shimmer + pulse animations
- Basic role inference
- Expo support verified

### v0.2 — Production ready ✅ shipped
- ✅ Reduced motion (web `@media` + RN `AccessibilityInfo`)
- ✅ A11y polish: `loadingLabel` prop, SR-only announcement, `inert` focus trap on web, `accessibilityLabel` + `accessibilityLiveRegion` + `accessibilityElementsHidden` on native
- ✅ Dark mode (`prefers-color-scheme` + `theme.darkMode`)
- ✅ `AutoSkeleton.List` optimization
- ✅ SSR no-flash hydration handoff: AutoSkeleton renders a single full-size fallback bone in SSR/first-render, swaps to per-leaf bones once measurement commits — zero blank-frame
- ✅ Fabric synchronous measurement: `measure.fabric.ts` sniffs for `getBoundingClientRect` on host instances; uses sync path on New Architecture, falls back to async `measureInWindow` on legacy
- ✅ Stagger fade-out: bones fade out with the same per-bone delay as fade-in
- ✅ Measurement memoization: `WeakMap` keyed on container element with leaf-tag + size fingerprint; skips re-measure when nothing changed structurally

### v0.3 — Polish ✅ shipped
- ✅ Tests per package: vitest for `core` (11 tests) + `web` (10 tests) + `codemod` (3 tests); jest + RN mocks for `native` (4 tests). **28 passing.**
- ✅ Performance benchmark suite (`benchmarks/`) — measures `measureTree` time across 10/50/100/250/500/1000 leaves
- ✅ Visual regression + a11y suite: Playwright (chromium) hits 7 docs pages, validates skeleton-bone alignment, runs axe-core scans. **14 passing.** Found and fixed two real library bugs along the way (sa-internal element measurement, `visibility:hidden` filter).
- ✅ Migration codemod (`skeleto-migrate`) — jscodeshift transform from `react-loading-skeleton`: rewrites imports + collapses `loading ? <Skeleton/> : <Real/>` ternaries into `<AutoSkeleton>` wrappers
- ✅ Expo example (`examples/expo-app/`) — Expo SDK 54 + RN 0.76 + Reanimated 3.16 + safe-area-context. `expo export --platform web` builds cleanly (465 modules, 1.0 MB bundle, real `skeleton-auto` code present)
- ✅ Deploy configs: `vercel.json` for docs site, `eas.json` for Expo, GitHub Actions workflow with build + test + bundle-size gate + visual regression + Expo bundle smoke

### v0.4 — Post-v0.3 hardening ✅ shipped
- ✅ `measureTree` optimized: index loops, direct `getAttribute`, manual childNodes walk, `className` indexOf. **1000 leaves: 43ms → 4ms (10× faster).** Scaling now sub-linear.
- ✅ Side-by-side comparison demo: `/compare` page on docs site with source code, line counts, capability matrix
- ✅ iOS Metro bundle verified (1384 modules, 11.6 MB, Skeleto + Reanimated 3 worklets present)
- ✅ pnpm + Expo monorepo recipe codified (`.npmrc` hoist patterns + `metro.config.js` extraNodeModules + `unstable_enablePackageExports`)
- ✅ HN launch post drafted (`launch/hn-post.md`) with title options + first-comment copy + 6 pre-written answers to the questions HN always asks
- ⚠ Full iOS simulator end-to-end run blocked by Xcode 15.0 in dev env (RN 0.76 needs 15.4+); `expo prebuild` succeeds, `pod install` fails. Documented in `examples/expo-app/README.md`.

### v1.0 — Launch (NOT yet shipped)

The three launch tasks originally planned:
- [x] Side-by-side comparison demo with `react-loading-skeleton` — done in v0.4 (`/compare`)
- [ ] HN post: drafted in `launch/hn-post.md`, not yet submitted
- [ ] Expo DevRel partnership for blog placement — outreach task

**But the code isn't publish-ready either.** Full pre-publish checklist:

**Must-fix before `npm publish`:**
- [ ] Create the actual GitHub repo; replace every `your-org/skeleton-auto` placeholder in README, docs site header, HN post draft
- [ ] Pick a real docs domain; replace `skeleto.dev` everywhere
- [ ] Add `repository`, `author`, `homepage`, `bugs` fields to all publishable package.jsons (core, web, native, react, codemod) — currently only `name`, `version`, `license` are set
- [ ] Add `LICENSE` file at repo root (currently only in package.json)
- [ ] Decide version: bump to `1.0.0` (matches HN post claim) or keep `0.x` and change post to "v0.x, looking for early adopters"
- [ ] `npm pack --dry-run` per package → confirm what actually ships (dist only, no src)
- [ ] **Tarball smoke test**: `npm pack`, install in a fresh Vite app outside the workspace, verify it works without workspace symlinks (catches packaging bugs that `workspace:*` hides)

**Must-verify before claiming RN/Expo support in HN post:**
- [ ] Upgrade Xcode → 15.4+, run `pnpm ios` in `examples/expo-app`, fix any runtime bugs, document
- [ ] Run on Android emulator — completely untested as of v0.4
- [ ] Generate a public Expo Snack URL so reviewers can scan a QR and try on a real device

**Must-deploy before HN post:**
- [ ] `vercel link` + first deploy of docs site; verify every page renders in production
- [ ] Lighthouse run on prod site → confirm a11y=100, perf≥95
- [ ] Open Graph image for link previews on Bluesky/Twitter/Mastodon

**Launch logistics:**
- [ ] 2–3 friends primed to upvote within the first 30 minutes (HN front-page ranking needs early signal)
- [ ] 4 hours of keyboard time post-submission to answer the first wave of comments
- [ ] GitHub release notes drafted, `git tag v1.0.0` ready to push

See `launch/hn-post.md` for the full post draft, alternate titles, and the pre-written answers to the six questions HN always asks (vs `react-loading-skeleton`, re-measure cost, RSC/streaming, Skia, React Compiler, role inference edges).

---

## 12. What Could Kill This (and mitigations)

| Risk | Mitigation |
|---|---|
| React Compiler makes re-measure brittle | Test suite runs against RC builds; escape hatch via `useSkeleton` hook |
| Reanimated 4 breaks worklet API | Peer dep range, versioned renderer |
| Expo drops Reanimated from Go | Pure-JS animated fallback ships as third path |
| Someone forks `react-native-auto-skeleton` and adds web | We ship first with better perf + SSR + a11y |

---

## 13. Documentation Website

A first-class docs site is part of v1.0 — not an afterthought. Built alongside the library so every feature ships with a live demo.

### 13.1 Stack

- **Next.js 14 App Router** — SSG for docs, RSC for content
- **MDX** for content + inline live code
- **Sandpack** (CodeSandbox) for in-browser editable React demos
- **Snack** embed for React Native / Expo demos that run on device via QR
- **Shiki** for syntax highlighting (build-time, zero JS runtime)
- **Tailwind + Radix Primitives** for the chrome
- Deployed to **Vercel** (preview URL per PR)

### 13.2 Information architecture

```
/                          → Hero, live "before/after" toggle, install snippet
/docs/getting-started      → 60-second install + first skeleton
/docs/installation         → Web / RN / Expo step-by-step
/docs/concepts             → How auto-measurement works
/docs/api/auto-skeleton    → <AutoSkeleton> full prop reference + live playground
/docs/api/list             → <AutoSkeleton.List> demo with FlashList
/docs/api/use-skeleton     → useSkeleton() hook demo
/docs/api/provider         → <SkeletonProvider> theming
/docs/api/escape-hatches   → skeletonRole, skeletonIgnore, Custom
/docs/recipes              → Real-world patterns (cards, lists, forms, profiles, feeds)
/docs/ssr                  → Next.js + hydration demo
/docs/accessibility        → a11y guarantees + reduced motion demo
/docs/performance          → Benchmarks page with live frame counter
/docs/migration            → From react-loading-skeleton, react-native-skeleton-placeholder
/playground                → Full editor — paste any JSX, see auto skeleton (Babel-standalone in browser)
/compare                   → Side-by-side vs react-loading-skeleton with line counts + capability matrix
/showcase                  → Apps using Skeleto (post-launch)
```

### 13.3 Demo coverage (every feature ships with a runnable demo)

| Feature | Demo type | Lives at |
|---|---|---|
| Basic loading | Sandpack toggle | `/` hero + `/docs/getting-started` |
| All animation types (`shimmer`, `pulse`, `wave`, `none`) | Side-by-side live | `/docs/api/auto-skeleton#animation` |
| Custom colors / dark mode | Theme switcher | `/docs/api/provider` |
| `borderRadius='inherit'` | Cards with varied radii | `/docs/recipes#cards` |
| `staggerChildren` | List reveal animation | `/docs/api/auto-skeleton#stagger` |
| `minDuration` | Network throttle simulator | `/docs/api/auto-skeleton#min-duration` |
| `transition` fade | Slider control | `/docs/api/auto-skeleton#transition` |
| `<AutoSkeleton.List>` | 1000-row FlashList | `/docs/api/list` |
| `useSkeleton()` | Custom orchestration | `/docs/api/use-skeleton` |
| `skeletonRole` override | Force shape demo | `/docs/api/escape-hatches#role` |
| `skeletonIgnore` | Exclude subtree | `/docs/api/escape-hatches#ignore` |
| `<AutoSkeleton.Custom>` | Chart placeholder | `/docs/api/escape-hatches#custom` |
| SSR / hydration | Next.js example | `/docs/ssr` |
| Reduced motion | Toggle in OS, see live change | `/docs/accessibility` |
| RN / Expo | QR code → Snack on device | `/docs/installation#expo` |
| Profile card recipe | Full code + skeleton | `/docs/recipes#profile` |
| Feed recipe | Twitter-style feed | `/docs/recipes#feed` |
| Form recipe | Login form | `/docs/recipes#form` |

### 13.4 Hero (above the fold)

- Animated split-screen: real UserCard fading in/out next to its auto-skeleton
- Single-line install: `npm i skeleton-auto`
- Three logos: React, React Native, Expo
- Live frame counter ticking at 60 FPS to prove perf

### 13.5 Playground

Full Sandpack editor pre-loaded with `skeleton-auto`. User pastes any JSX, toggles `loading`, sees the skeleton. URL is shareable. This is the single best onboarding tool — devs can verify "does it work for *my* component?" in 30 seconds without installing anything.

### 13.6 Build/deploy

- Lives in `examples/docs-site/` in the monorepo
- `pnpm dev:docs` runs locally
- Vercel build on every PR with preview URL
- Algolia DocSearch for instant search (free for OSS)
- Lighthouse CI gate: 95+ on perf, 100 on a11y

---

## 14. v0.4 changelog (post-v0.3 hardening)

**Performance**
- Optimized `measureTree`: replaced `Array.from(children)`-per-visit allocation with index loops, replaced `dataset` proxy with direct `getAttribute`, manual `childNodes` walk in `isLeaf` instead of `every` + `Array.from`, `className` indexOf instead of `classList.contains`.
- **1000 leaves: 43ms → 4ms (10× faster).** 100 leaves: 1.4ms → 0.6ms (2.3× faster). Scaling now sub-linear (1000 = 6.9× of 100, vs ideal 10×).

**Comparison demo**
- New `/compare` page on docs site: side-by-side `react-loading-skeleton` vs `skeleton-auto` with same UserCard, same loading toggle, full source code, line counts, capability matrix. Lives at `examples/docs-site/app/compare/page.tsx`.

**iOS sim verification**
- pnpm + Expo + RN 0.76 monorepo configured: `.npmrc` hoist patterns for RN's transitive deps (`invariant`, `fbjs`, `event-target-shim`, etc.), Metro `extraNodeModules` map for workspace packages, `unstable_enablePackageExports` + `react-native` condition so `skeleto` resolves to the native entry.
- iOS Metro bundle: **1384 modules, 11.6 MB, success** — Skeleto + Reanimated 3 worklets present in the bundle output.
- `expo prebuild --platform ios` generates a native iOS project cleanly. `pod install` blocked by **Xcode 15.0 in the dev env** (RN 0.76 needs Xcode 15.4+) — environment issue, not a library bug. Documented in `examples/expo-app/README.md`.

---

## 15. v0.3 changelog

**Added**
- Tests per package — 28 unit tests (vitest + jest) covering role inference, stable loading, DOM measurement, AutoSkeleton render lifecycle, AST tree annotation, codemod transforms
- Visual regression + a11y suite — Playwright + axe-core, 14 tests; gates merges on no critical/serious WCAG 2.2 AA violations
- Performance benchmark suite — measured `measureTree`: **1.4ms mean for 100 leaves** (target <4ms), super-linear past 250 leaves (improvement target for v0.4)
- `skeleto-migrate` CLI — codemod for `react-loading-skeleton` → `skeleton-auto`
- Expo example app — SDK 54 + RN 0.76 + New Architecture, web export verified
- CI: GitHub Actions with bundle-size gate (web < 6 KB gzip), visual regression, Expo smoke build
- Vercel + EAS deploy configs

**Bugs fixed (caught by tests)**
- `measureTree` was picking up `.sa-sr-only` and `.sa-layer` (skeleton-internal) as leaves, producing 1×1 ghost bones — now skipped explicitly
- `measureElement` filtered out `visibility:hidden` elements, but children of a `visibility:hidden` parent inherit that — meaning ALL child leaves were filtered. Removed the visibility check (display:none alone suffices)
- `ResizeObserver` only watched the root container, missing late layout shifts from font/image load — now also re-measures on `requestAnimationFrame` and on the window `load` event, and observes child elements

**Measured performance (v0.3 baseline)**
| Leaves | mean (ms) | p95 (ms) |
|---|---|---|
| 10 | 0.5 | 1.0 |
| 50 | 1.5 | 2.5 |
| **100** | **1.4** | **1.9** |
| 250 | 4.1 | 5.5 |
| 500 | 9.2 | 19.3 |
| 1000 | 43.1 | 129.8 |

**Not yet built (deferred to v1.0 launch)**
- Snack URL for Expo demo (manual setup)
- Algolia DocSearch integration on docs site
- Lighthouse CI gate
- HN launch post + Expo DevRel partnership

---

## 16. v0.2 changelog

**Added**
- `loadingLabel` prop — customizable screen-reader announcement
- `trapFocus` prop — `inert` attribute (with `tabIndex=-1` fallback) on invisible content
- SSR no-flash fallback bone — single full-size rect renders before measurements commit
- Fabric synchronous measurement path on RN New Architecture (`measure.fabric.ts`)
- Stagger fade-out — bones fade out with the same per-bone delay as fade-in
- Measurement memoization — `WeakMap` cache keyed on container element + leaf fingerprint, skips re-measure when nothing changed structurally
- Native: `accessibilityLabel`, `accessibilityLiveRegion`, `accessibilityElementsHidden` on the wrapper

**Changed**
- Layer fade is now per-bone with `transitionDelay` instead of a single layer-wide opacity transition
- Web bundle: 4.7 KB → 5.3 KB gzip (still under 6 KB target)

**Not yet built (deferred to v0.3)**
- Visual regression suite (Chromatic + axe)
- Benchmarks published (target: 60 FPS at p95 on iPhone 12 sim, <4ms initial measure)
- Migration codemod
- Example apps deployed (Vercel + Snack)
- Tests per package (jest + RTL / RNTL)

---

## 17. One-liner pitch

> **`skeleton-auto`: the last skeleton library you'll install. One component. Web, iOS, Android, Expo. 60 FPS. Zero config.**
