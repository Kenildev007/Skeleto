# @kenildev007/skeleto

**Zero-config skeleton loaders for React, React Native, and Expo.**  
One component. Web, iOS, Android, Expo. 60 FPS. Zero config.

**[Live docs → kenildev007.github.io/Skeleto](https://kenildev007.github.io/Skeleto)**

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
function App() {
  return (
    <SkeletonProvider>
      <YourApp />
    </SkeletonProvider>
  );
}

// Wrap any component — skeleton is generated automatically
function UserProfile({ userId }) {
  const { user, loading } = useUser(userId);

  return (
    <AutoSkeleton loading={loading}>
      <UserCard user={user} />
    </AutoSkeleton>
  );
}
```

Skeleto reads your real component's DOM/layout and generates a pixel-matching skeleton — no fixture files, no CLI, no configuration needed.

## Features

- **Zero config** — wrap and forget, no fixture files
- **Web + Native** — same API on React DOM, React Native, and Expo
- **60 FPS** — CSS compositor on web, Reanimated 3 on native
- **SSR safe** — works with Next.js app router and server components
- **Accessible** — correct ARIA roles and reduced-motion support
- **Tiny** — ~6 KB gzipped (web), ~8 KB gzipped (native)

## Docs

Full documentation, API reference, playground, and migration guide:  
**[kenildev007.github.io/Skeleto](https://kenildev007.github.io/Skeleto)**

## License

MIT — [github.com/Kenildev007/Skeleto](https://github.com/Kenildev007/Skeleto)
