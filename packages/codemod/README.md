# @kenildev007/skeleto-migrate

Codemod CLI to migrate from `react-loading-skeleton` to `@kenildev007/skeleto`.

## Usage

```bash
npx @kenildev007/skeleto-migrate react-loading-skeleton 'src/**/*.{ts,tsx}'
```

### What it does

- Rewrites the import from `react-loading-skeleton` → `@kenildev007/skeleto`
- Converts `{loading ? <SkeletonTree /> : <RealContent />}` patterns to `<AutoSkeleton loading={loading}><RealContent /></AutoSkeleton>`
- Standalone `<Skeleton>` usages outside the common ternary pattern are flagged for manual review

## Docs

[kenildev007.github.io/Skeleto](https://kenildev007.github.io/Skeleto)

## License

MIT
