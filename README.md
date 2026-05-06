# Skeleto

Zero-config, auto-generated @kenildev007/skeleton loaders for React, React Native, and Expo.

```tsx
import { AutoSkeleton } from '@kenildev007/skeleto';

<AutoSkeleton loading={isLoading}>
  <UserCard user={user} />
</AutoSkeleton>
```

That's it. No fixtures. No CLI. No build step.

## Install

```bash
# React (web)
npm install @kenildev007/skeleto

# Expo
npx expo install @kenildev007/skeleto react-native-reanimated

# Bare React Native
npm install @kenildev007/skeleto react-native-reanimated
```

## Monorepo

| Package | Purpose |
|---|---|
| `packages/core` | Platform-agnostic types, role inference, theme |
| `packages/web` | DOM measurement + CSS animation |
| `packages/native` | RN/Expo measurement + Reanimated 3 |
| `packages/react` | Unified entry (auto-resolves per platform) |

See `01-@kenildev007/skeleton-auto.md` (design doc) for the full design doc.

## Local development

```bash
pnpm install
pnpm build
pnpm dev:web      # Vite + React example
pnpm dev:docs     # Next.js docs site
```
