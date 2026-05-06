import { useStableLoading } from '@skeleton-auto/core';

export interface UseSkeletonOptions {
  loading: boolean;
  minDuration?: number;
}

export interface UseSkeletonResult {
  isSkeleton: boolean;
  bind: {
    accessibilityState: { busy: boolean };
  };
}

export function useSkeleton(options: UseSkeletonOptions): UseSkeletonResult {
  const isSkeleton = useStableLoading(options);
  return {
    isSkeleton,
    bind: {
      accessibilityState: { busy: isSkeleton },
    },
  };
}
