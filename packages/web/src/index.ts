import { AutoSkeleton as AutoSkeletonRoot } from './AutoSkeleton';
import { AutoSkeletonList } from './AutoSkeletonList';
import { AutoSkeletonCustom } from './AutoSkeletonCustom';
import { AutoSkeletonSSR } from './AutoSkeletonSSR';

type AutoSkeletonComponent = typeof AutoSkeletonRoot & {
  List: typeof AutoSkeletonList;
  Custom: typeof AutoSkeletonCustom;
  SSR: typeof AutoSkeletonSSR;
};

const AutoSkeleton = AutoSkeletonRoot as AutoSkeletonComponent;
AutoSkeleton.List = AutoSkeletonList;
AutoSkeleton.Custom = AutoSkeletonCustom;
AutoSkeleton.SSR = AutoSkeletonSSR;

export { AutoSkeleton };
export { SkeletonProvider, type SkeletonProviderProps } from './SkeletonProvider';
export { useSkeleton, type UseSkeletonOptions, type UseSkeletonResult } from './useSkeleton';
export { measureTree } from './measure';

export type {
  AutoSkeletonProps,
  MeasuredNode,
  SkeletonRole,
  SkeletonTheme,
  AnimationType,
  Direction,
} from '@skeleto/core';
