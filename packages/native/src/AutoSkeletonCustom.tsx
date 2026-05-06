import type { ReactNode } from 'react';
import { useStableLoading } from '@skeleto/core';

export interface AutoSkeletonCustomProps {
  loading: boolean;
  minDuration?: number;
  render: () => ReactNode;
  children: ReactNode;
}

export function AutoSkeletonCustom({ loading, minDuration, render, children }: AutoSkeletonCustomProps) {
  const isSkeleton = useStableLoading({ loading, minDuration });
  return <>{isSkeleton ? render() : children}</>;
}
