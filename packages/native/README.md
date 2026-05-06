# @kenildev007/skeleto-native

React Native / Expo renderer for Skeleto. Measures your real UI and generates Reanimated 3 skeleton overlays.

> Most users should install [`@kenildev007/skeleto`](https://www.npmjs.com/package/@kenildev007/skeleto) instead — it auto-resolves web or native.

## Install

```bash
# Expo
npx expo install @kenildev007/skeleto-native react-native-reanimated

# Bare React Native
npm install @kenildev007/skeleto-native react-native-reanimated
```

## Usage

```tsx
import { AutoSkeleton, SkeletonProvider } from '@kenildev007/skeleto-native';

<SkeletonProvider>
  <AutoSkeleton loading={isLoading}>
    <YourComponent />
  </AutoSkeleton>
</SkeletonProvider>
```

## Docs

[kenildev007.github.io/Skeleto](https://kenildev007.github.io/Skeleto)

## License

MIT
