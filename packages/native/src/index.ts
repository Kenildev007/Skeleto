import { AutoSkeleton as AutoSkeletonRoot } from './AutoSkeleton';
import { AutoSkeletonList } from './AutoSkeletonList';
import { AutoSkeletonCustom } from './AutoSkeletonCustom';

type AutoSkeletonComponent = typeof AutoSkeletonRoot & {
  List: typeof AutoSkeletonList;
  Custom: typeof AutoSkeletonCustom;
};

const AutoSkeleton = AutoSkeletonRoot as AutoSkeletonComponent;
AutoSkeleton.List = AutoSkeletonList;
AutoSkeleton.Custom = AutoSkeletonCustom;

export { AutoSkeleton };
export { SkeletonProvider, type SkeletonProviderProps } from './SkeletonProvider';
export { useSkeleton, type UseSkeletonOptions, type UseSkeletonResult } from './useSkeleton';
export { Shimmer, type ShimmerProps } from './Shimmer';

export type {
  AutoSkeletonProps,
  MeasuredNode,
  SkeletonRole,
  SkeletonTheme,
  AnimationType,
  Direction,
} from '@kenildev007/skeleto-core';
