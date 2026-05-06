import { useStableLoading } from '@kenildev007/skeleto-core';

export interface UseSkeletonOptions {
  loading: boolean;
  minDuration?: number;
}

export interface UseSkeletonResult {
  isSkeleton: boolean;
  bind: {
    'aria-busy': boolean | undefined;
    'aria-live': 'polite' | undefined;
  };
}

export function useSkeleton(options: UseSkeletonOptions): UseSkeletonResult {
  const isSkeleton = useStableLoading(options);
  return {
    isSkeleton,
    bind: {
      'aria-busy': isSkeleton || undefined,
      'aria-live': isSkeleton ? 'polite' : undefined,
    },
  };
}
