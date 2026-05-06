import { useMemo, type ReactNode } from 'react';
import {
  DEFAULT_CONTEXT,
  SkeletonContext,
  type AnimationType,
  type SkeletonTheme,
} from '@skeleton-auto/core';

export interface SkeletonProviderProps {
  theme?: Partial<SkeletonTheme>;
  respectReducedMotion?: boolean;
  defaultAnimation?: AnimationType;
  defaultSpeed?: number;
  children: ReactNode;
}

export function SkeletonProvider({
  theme,
  respectReducedMotion,
  defaultAnimation,
  defaultSpeed,
  children,
}: SkeletonProviderProps) {
  const value = useMemo(
    () => ({
      theme: { ...DEFAULT_CONTEXT.theme, ...theme },
      respectReducedMotion: respectReducedMotion ?? DEFAULT_CONTEXT.respectReducedMotion,
      defaultAnimation: defaultAnimation ?? DEFAULT_CONTEXT.defaultAnimation,
      defaultSpeed: defaultSpeed ?? DEFAULT_CONTEXT.defaultSpeed,
    }),
    [theme, respectReducedMotion, defaultAnimation, defaultSpeed],
  );

  return <SkeletonContext.Provider value={value}>{children}</SkeletonContext.Provider>;
}
