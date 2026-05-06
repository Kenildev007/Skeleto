import type { CSSProperties } from 'react';

export interface AutoSkeletonSSRProps {
  shape?: 'card' | 'row' | 'circle' | 'rect';
  count?: number;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  gap?: number;
  className?: string;
  style?: CSSProperties;
}

export function AutoSkeletonSSR({
  shape = 'rect',
  count = 1,
  width,
  height,
  borderRadius,
  gap = 8,
  className,
  style,
}: AutoSkeletonSSRProps) {
  const dims = resolveShape(shape, { width, height, borderRadius });

  return (
    <div
      className={className}
      style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px`, ...style }}
      aria-busy
      aria-live="polite"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="sa-bone sa-bone--shimmer"
          style={{
            position: 'relative',
            width: dims.width,
            height: dims.height,
            borderRadius: `${dims.borderRadius}px`,
          }}
        />
      ))}
    </div>
  );
}

function resolveShape(
  shape: AutoSkeletonSSRProps['shape'],
  override: { width?: number | string; height?: number | string; borderRadius?: number },
): { width: string; height: string; borderRadius: number } {
  const w = (v?: number | string) => (typeof v === 'number' ? `${v}px` : v ?? '100%');
  switch (shape) {
    case 'card':
      return { width: w(override.width), height: w(override.height ?? 120), borderRadius: override.borderRadius ?? 12 };
    case 'row':
      return { width: w(override.width), height: w(override.height ?? 16), borderRadius: override.borderRadius ?? 4 };
    case 'circle': {
      const size = typeof override.width === 'number' ? override.width : 40;
      return { width: `${size}px`, height: `${size}px`, borderRadius: size / 2 };
    }
    case 'rect':
    default:
      return { width: w(override.width), height: w(override.height ?? 60), borderRadius: override.borderRadius ?? 8 };
  }
}
