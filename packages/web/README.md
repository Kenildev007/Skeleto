# @kenildev007/skeleto-web

Web (DOM) renderer for Skeleto. Measures your real UI and generates CSS-animated skeleton overlays.

> Most users should install [`@kenildev007/skeleto`](https://www.npmjs.com/package/@kenildev007/skeleto) instead — it auto-resolves web or native.

## Install

```bash
npm install @kenildev007/skeleto-web
```

## Usage

```tsx
import { AutoSkeleton, SkeletonProvider } from '@kenildev007/skeleto-web';
import '@kenildev007/skeleto-web/styles.css';

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
