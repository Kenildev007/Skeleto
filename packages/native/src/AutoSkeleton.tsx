import { useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, View, type LayoutChangeEvent } from 'react-native';
import {
  resolveColors,
  useSkeletonContext,
  useStableLoading,
  type AutoSkeletonProps,
  type MeasuredNode,
} from '@skeleto/core';
import { annotateTree, measureCollected } from './measure';
import { Shimmer } from './Shimmer';

export function AutoSkeleton(props: AutoSkeletonProps) {
  const {
    loading,
    children,
    animation,
    speed,
    baseColor,
    highlightColor,
    borderRadius: radiusOverride,
    opacity = 1,
    transition = 200,
    staggerChildren = 0,
    minDuration = 0,
    maxDepth = 12,
    onMeasure,
    loadingLabel = 'Loading content',
    trapFocus = true,
  } = props;

  const ctx = useSkeletonContext();
  const stableLoading = useStableLoading({ loading, minDuration });
  const [reduceMotion, setReduceMotion] = useState(false);

  const colors = useMemo(
    () => resolveColors(ctx.theme, { baseColor, highlightColor }, false),
    [ctx.theme, baseColor, highlightColor],
  );

  const effectiveAnim = animation ?? ctx.defaultAnimation;
  const effectiveSpeed = speed ?? ctx.defaultSpeed;
  const animKey = ctx.respectReducedMotion && reduceMotion ? 'pulse' : effectiveAnim;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => sub.remove();
  }, []);

  const annotated = useMemo(() => annotateTree(children, { maxDepth }), [children, maxDepth]);

  const rootRef = useRef<View>(null);
  const [nodes, setNodes] = useState<MeasuredNode[]>([]);
  const childOpacity = useRef(new Animated.Value(stableLoading ? 0 : 1)).current;
  const layerOpacity = useRef(new Animated.Value(stableLoading ? opacity : 0)).current;
  const [layerMounted, setLayerMounted] = useState(stableLoading);

  const remeasure = () => {
    if (!stableLoading) return;
    measureCollected({ rootRef, collected: annotated.collected }).then((m) => {
      setNodes(m);
      onMeasure?.(m);
    });
  };

  useEffect(() => {
    if (!stableLoading) return;
    const id = requestAnimationFrame(remeasure);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stableLoading, annotated]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(childOpacity, { toValue: stableLoading ? 0 : 1, duration: transition, useNativeDriver: true }),
      Animated.timing(layerOpacity, { toValue: stableLoading ? opacity : 0, duration: transition, useNativeDriver: true }),
    ]).start(() => {
      if (!stableLoading) setLayerMounted(false);
    });
    if (stableLoading) setLayerMounted(true);
  }, [stableLoading, transition, opacity, childOpacity, layerOpacity]);

  const handleLayout = (_e: LayoutChangeEvent) => {
    requestAnimationFrame(remeasure);
  };

  return (
    <View
      ref={rootRef}
      onLayout={handleLayout}
      accessibilityState={{ busy: stableLoading }}
      accessibilityLiveRegion={stableLoading ? 'polite' : 'none'}
      accessibilityLabel={stableLoading ? loadingLabel : undefined}
    >
      <Animated.View
        style={{ opacity: childOpacity }}
        pointerEvents={stableLoading ? 'none' : 'auto'}
        importantForAccessibility={
          stableLoading && trapFocus ? 'no-hide-descendants' : 'auto'
        }
        accessibilityElementsHidden={stableLoading && trapFocus}
      >
        {annotated.element}
      </Animated.View>

      {layerMounted ? (
        <Animated.View
          pointerEvents="none"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: layerOpacity }}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {nodes.map((n, i) => (
            <View key={n.id} style={{ position: 'absolute', left: n.x, top: n.y }}>
              <Shimmer
                width={n.width}
                height={n.height}
                borderRadius={resolveRadius(n, radiusOverride)}
                baseColor={colors.baseColor}
                highlightColor={colors.highlightColor}
                speed={effectiveSpeed}
                animation={animKey}
                delayMs={staggerChildren > 0 ? i * staggerChildren : 0}
              />
            </View>
          ))}
        </Animated.View>
      ) : null}
    </View>
  );
}

function resolveRadius(node: MeasuredNode, override: number | 'inherit' | undefined): number {
  if (node.role === 'circle') return Math.min(node.width, node.height) / 2;
  if (override === 'inherit' || override === undefined) return node.borderRadius;
  return override;
}
