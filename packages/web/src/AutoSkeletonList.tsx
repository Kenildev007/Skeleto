import type { CSSProperties, ReactElement } from 'react';
import { useSkeletonContext, resolveColors, usePrefersDark } from '@skeleto/core';

export interface AutoSkeletonListProps {
  count: number;
  estimatedItemHeight: number;
  gap?: number;
  renderItem?: (index: number) => ReactElement;
  baseColor?: string;
  highlightColor?: string;
  borderRadius?: number;
  speed?: number;
  animation?: 'shimmer' | 'pulse' | 'wave' | 'none';
  className?: string;
  style?: CSSProperties;
}

export function AutoSkeletonList({
  count,
  estimatedItemHeight,
  gap = 8,
  renderItem,
  baseColor,
  highlightColor,
  borderRadius = 8,
  speed,
  animation,
  className,
  style,
}: AutoSkeletonListProps) {
  const ctx = useSkeletonContext();
  const prefersDark = usePrefersDark();
  const colors = resolveColors(ctx.theme, { baseColor, highlightColor }, prefersDark);

  const finalSpeed = speed ?? ctx.defaultSpeed;
  const finalAnim = animation ?? ctx.defaultAnimation;

  const wrapStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: `${gap}px`,
    ['--sa-base' as string]: colors.baseColor,
    ['--sa-highlight' as string]: colors.highlightColor,
    ['--sa-speed' as string]: `${finalSpeed}s`,
    ...style,
  };

  return (
    <div className={className} style={wrapStyle} aria-busy aria-live="polite">
      {Array.from({ length: count }).map((_, i) => {
        if (renderItem) return <div key={i}>{renderItem(i)}</div>;
        return (
          <div
            key={i}
            className={`sa-bone sa-bone--${finalAnim}`}
            style={{
              position: 'relative',
              width: '100%',
              height: `${estimatedItemHeight}px`,
              borderRadius: `${borderRadius}px`,
            }}
          />
        );
      })}
    </div>
  );
}
