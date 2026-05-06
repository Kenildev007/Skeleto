# Skeleto

Zero-config, auto-generated skeleton loaders for React, React Native, and Expo.

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

## Packages

| Package | Purpose |
|---|---|
| [`@kenildev007/skeleto`](packages/react) | Unified entry — auto-resolves web or native |
| [`@kenildev007/skeleto-web`](packages/web) | DOM measurement + CSS animation |
| [`@kenildev007/skeleto-native`](packages/native) | RN/Expo measurement + Reanimated 3 |
| [`@kenildev007/skeleto-core`](packages/core) | Platform-agnostic types, role inference, theme |
| [`@kenildev007/skeleto-migrate`](packages/codemod) | Codemod — migrate from react-loading-skeleton |

## Docs

[kenildev007.github.io/Skeleto](https://kenildev007.github.io/Skeleto)

## Local development

```bash
pnpm install
pnpm build
pnpm dev:web      # Vite + React example
pnpm dev:docs     # Next.js docs site
```

## License

MIT
