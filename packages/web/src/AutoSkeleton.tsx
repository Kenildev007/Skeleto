import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import {
  resolveColors,
  useSkeletonContext,
  useStableLoading,
  usePrefersReducedMotion,
  usePrefersDark,
  type AutoSkeletonProps,
  type MeasuredNode,
} from '@kenildev007/skeleto-core';
import { measureTree } from './measure';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface CacheEntry {
  fingerprint: string;
  nodes: MeasuredNode[];
}
const measurementCache = new WeakMap<HTMLElement, CacheEntry>();

function fingerprintTree(root: HTMLElement): string {
  const leaves: string[] = [];
  const walk = (el: Element) => {
    if (el.children.length === 0) {
      leaves.push(`${el.tagName}:${(el as HTMLElement).offsetWidth}x${(el as HTMLElement).offsetHeight}`);
    } else {
      for (const c of Array.from(el.children)) walk(c);
    }
  };
  for (const c of Array.from(root.children)) walk(c);
  return leaves.join('|');
}

export function AutoSkeleton(props: AutoSkeletonProps) {
  const {
    loading,
    children,
    animation,
    speed,
    direction = 'ltr',
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
  const prefersDark = usePrefersDark();
  const reducedMotion = usePrefersReducedMotion();

  const stableLoading = useStableLoading({ loading, minDuration });
  const containerRef = useRef<HTMLDivElement>(null);
  const childrenWrapRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<MeasuredNode[]>([]);
  const [layerVisible, setLayerVisible] = useState(stableLoading);

  const colors = useMemo(
    () => resolveColors(ctx.theme, { baseColor, highlightColor }, prefersDark),
    [ctx.theme, baseColor, highlightColor, prefersDark],
  );

  const effectiveAnim = animation ?? ctx.defaultAnimation;
  const effectiveSpeed = speed ?? ctx.defaultSpeed;
  const animationClass = ctx.respectReducedMotion && reducedMotion ? 'pulse' : effectiveAnim;

  useIsoLayoutEffect(() => {
    if (!stableLoading || !containerRef.current) return;
    const root = containerRef.current;

    const run = () => {
      const fingerprint = fingerprintTree(root);
      const cached = measurementCache.get(root);
      if (cached && cached.fingerprint === fingerprint) {
        setNodes(cached.nodes);
        onMeasure?.(cached.nodes);
        return;
      }
      const rect = root.getBoundingClientRect();
      const measured = measureTree({ container: root, rootRect: rect, maxDepth });
      measurementCache.set(root, { fingerprint, nodes: measured });
      setNodes(measured);
      onMeasure?.(measured);
    };

    run();

    // Async layout settles (web fonts, images) can shift sizes after first paint
    // without changing the root's bounds — ResizeObserver on the root won't fire.
    // Re-run after one frame and again after the document is fully loaded.
    const rafId = requestAnimationFrame(run);
    let onLoad: (() => void) | null = null;
    if (typeof window !== 'undefined' && document.readyState !== 'complete') {
      onLoad = () => requestAnimationFrame(run);
      window.addEventListener('load', onLoad, { once: true });
    }

    if (typeof ResizeObserver === 'undefined') {
      return () => {
        cancelAnimationFrame(rafId);
        if (onLoad) window.removeEventListener('load', onLoad);
      };
    }
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(run);
    });
    ro.observe(root);
    // Also observe direct children so per-leaf reflows trigger remeasure.
    for (const child of Array.from(root.children)) ro.observe(child);
    return () => {
      cancelAnimationFrame(rafId);
      if (onLoad) window.removeEventListener('load', onLoad);
      ro.disconnect();
    };
  }, [stableLoading, maxDepth, onMeasure]);

  useEffect(() => {
    if (stableLoading) {
      setLayerVisible(true);
      return;
    }
    const totalStagger = staggerChildren * Math.max(0, nodes.length - 1);
    const t = setTimeout(() => setLayerVisible(false), transition + totalStagger);
    return () => clearTimeout(t);
  }, [stableLoading, transition, staggerChildren, nodes.length]);

  // Apply `inert` to invisible real content so keyboard focus skips it.
  useEffect(() => {
    if (!trapFocus) return;
    const el = childrenWrapRef.current;
    if (!el) return;
    if (stableLoading) {
      el.setAttribute('inert', '');
    } else {
      el.removeAttribute('inert');
    }
  }, [stableLoading, trapFocus]);

  const wrapperStyle: CSSProperties = { position: 'relative' };
  const childrenStyle: CSSProperties = {
    opacity: stableLoading ? 0 : 1,
    transitionDuration: `${transition}ms`,
    visibility: stableLoading ? 'hidden' : 'visible',
    pointerEvents: stableLoading ? 'none' : undefined,
  };
  const layerStyle: CSSProperties = {
    ['--sa-base' as string]: colors.baseColor,
    ['--sa-highlight' as string]: colors.highlightColor,
    ['--sa-speed' as string]: `${effectiveSpeed}s`,
  };

  return (
    <div
      ref={containerRef}
      className="sa-root"
      style={wrapperStyle}
      aria-busy={stableLoading || undefined}
      aria-live={stableLoading ? 'polite' : 'off'}
    >
      <span className="sa-sr-only">{stableLoading ? loadingLabel : ''}</span>
      <div
        ref={childrenWrapRef}
        className="sa-children-fade"
        style={childrenStyle}
        aria-hidden={stableLoading || undefined}
        tabIndex={stableLoading && trapFocus ? -1 : undefined}
      >
        {children}
      </div>
      {layerVisible ? (
        <div className="sa-layer" style={layerStyle} aria-hidden="true">
          {nodes.length === 0 && stableLoading ? (
            <div
              className={`sa-bone sa-bone--${animationClass}`}
              style={{
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                borderRadius: typeof radiusOverride === 'number' ? `${radiusOverride}px` : '8px',
                opacity,
                transitionProperty: 'opacity',
                transitionDuration: `${transition}ms`,
                transitionTimingFunction: 'ease-out',
              }}
            />
          ) : null}
          {nodes.map((n, i) => {
            const r = radiusOverride === 'inherit' || radiusOverride === undefined ? n.borderRadius : radiusOverride;
            const finalRadius = roleRadius(n, r);
            const animDelay = staggerChildren > 0 ? `${(i * staggerChildren) / 1000}s` : '0s';
            const fadeDelay = stableLoading
              ? `${(i * staggerChildren) / 1000}s`
              : `${(i * staggerChildren) / 1000}s`;
            const className = `sa-bone sa-bone--${animationClass} ${direction === 'rtl' ? 'sa-rtl' : ''}`.trim();
            return (
              <div
                key={n.id}
                className={className}
                style={{
                  left: `${n.x}px`,
                  top: `${n.y}px`,
                  width: `${n.width}px`,
                  height: `${n.height}px`,
                  borderRadius: `${finalRadius}px`,
                  animationDelay: animDelay,
                  opacity: stableLoading ? opacity : 0,
                  transitionProperty: 'opacity',
                  transitionDuration: `${transition}ms`,
                  transitionTimingFunction: 'ease-out',
                  transitionDelay: fadeDelay,
                }}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function roleRadius(node: MeasuredNode, fallback: number): number {
  if (node.role === 'circle') return Math.min(node.width, node.height) / 2;
  if (node.role === 'text') return Math.max(fallback, 4);
  if (node.role === 'icon') return Math.max(fallback, 4);
  return fallback;
}
