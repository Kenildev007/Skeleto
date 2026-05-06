import { createContext, useContext } from 'react';
import type { SkeletonTheme } from './types';

export const DEFAULT_THEME: SkeletonTheme = {
  baseColor: '#e5e7eb',
  highlightColor: '#f3f4f6',
  darkMode: {
    baseColor: '#27272a',
    highlightColor: '#3f3f46',
  },
};

export interface SkeletonContextValue {
  theme: SkeletonTheme;
  respectReducedMotion: boolean;
  defaultAnimation: 'shimmer' | 'pulse' | 'wave' | 'none';
  defaultSpeed: number;
}

export const DEFAULT_CONTEXT: SkeletonContextValue = {
  theme: DEFAULT_THEME,
  respectReducedMotion: true,
  defaultAnimation: 'shimmer',
  defaultSpeed: 1.4,
};

export const SkeletonContext = createContext<SkeletonContextValue>(DEFAULT_CONTEXT);

export function useSkeletonContext(): SkeletonContextValue {
  return useContext(SkeletonContext);
}

export function resolveColors(
  theme: SkeletonTheme,
  override?: { baseColor?: string; highlightColor?: string },
  prefersDark = false,
): { baseColor: string; highlightColor: string } {
  const palette = prefersDark && theme.darkMode ? theme.darkMode : theme;
  return {
    baseColor: override?.baseColor ?? palette.baseColor,
    highlightColor: override?.highlightColor ?? palette.highlightColor,
  };
}
