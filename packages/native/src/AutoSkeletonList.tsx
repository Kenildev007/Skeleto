import { View, type ViewStyle } from 'react-native';
import { useSkeletonContext, resolveColors } from '@kenildev007/skeleto-core';
import { Shimmer } from './Shimmer';
import type { ReactElement } from 'react';

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
  style?: ViewStyle;
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
  style,
}: AutoSkeletonListProps) {
  const ctx = useSkeletonContext();
  const colors = resolveColors(ctx.theme, { baseColor, highlightColor });
  const finalSpeed = speed ?? ctx.defaultSpeed;
  const finalAnim = animation ?? ctx.defaultAnimation;

  return (
    <View style={[{ flexDirection: 'column' }, style]} accessibilityState={{ busy: true }}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={{ marginBottom: i === count - 1 ? 0 : gap }}>
          {renderItem ? (
            renderItem(i)
          ) : (
            <Shimmer
              width={9999}
              height={estimatedItemHeight}
              borderRadius={borderRadius}
              baseColor={colors.baseColor}
              highlightColor={colors.highlightColor}
              speed={finalSpeed}
              animation={finalAnim}
              style={{ width: '100%' as unknown as number }}
            />
          )}
        </View>
      ))}
    </View>
  );
}
