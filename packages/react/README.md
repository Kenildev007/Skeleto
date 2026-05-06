# @kenildev007/skeleto

Zero-config skeleton loaders for React, React Native, and Expo. One component. Web, iOS, Android, Expo. 60 FPS. Zero config.

## Install

```bash
# Web / Next.js
npm install @kenildev007/skeleto

# Expo
npx expo install @kenildev007/skeleto react-native-reanimated

# Bare React Native
npm install @kenildev007/skeleto react-native-reanimated
```

## Usage

```tsx
import { AutoSkeleton, SkeletonProvider } from '@kenildev007/skeleto';
import '@kenildev007/skeleto/styles.css'; // web only

// Wrap your app once
<SkeletonProvider>
  <App />
</SkeletonProvider>

// Wrap any component — skeleton is generated automatically
<AutoSkeleton loading={isLoading}>
  <UserCard user={user} />
</AutoSkeleton>
```

Skeleto reads your real UI's DOM/layout and generates a pixel-matching skeleton — no fixture files, no CLI, no configuration.

## Docs

[kenildev007.github.io/Skeleto](https://kenildev007.github.io/Skeleto)

## License

MIT
