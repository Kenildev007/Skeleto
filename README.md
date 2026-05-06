# skeleton-auto

Zero-config, auto-generated skeleton loaders for React, React Native, and Expo.

```tsx
import { AutoSkeleton } from 'skeleton-auto';

<AutoSkeleton loading={isLoading}>
  <UserCard user={user} />
</AutoSkeleton>
```

That's it. No fixtures. No CLI. No build step.

## Install

```bash
# React (web)
npm install skeleton-auto

# Expo
npx expo install skeleton-auto react-native-reanimated

# Bare React Native
npm install skeleton-auto react-native-reanimated
```

## Monorepo

| Package | Purpose |
|---|---|
| `packages/core` | Platform-agnostic types, role inference, theme |
| `packages/web` | DOM measurement + CSS animation |
| `packages/native` | RN/Expo measurement + Reanimated 3 |
| `packages/react` | Unified entry (auto-resolves per platform) |

See `01-skeleton-auto.md` for the full design doc.

## Local development

```bash
pnpm install
pnpm build
pnpm dev:web      # Vite + React example
pnpm dev:docs     # Next.js docs site
```
