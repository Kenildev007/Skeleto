import { Children, cloneElement, createRef, isValidElement, type ReactElement, type ReactNode, type RefObject } from 'react';
import { Image, Text, View, type ImageProps, type TextProps, type ViewProps } from 'react-native';
import { inferRole, type MeasuredNode, type RoleSignals, type SkeletonRole } from '@kenildev007/skeleto-core';
import { isFabricView, measureSync } from './measure.fabric';

type MeasurableRef = RefObject<View | Text | Image | null>;

interface CollectedNode {
  ref: MeasurableRef;
  signals: Partial<RoleSignals>;
  explicitRole?: SkeletonRole;
  ignore: boolean;
  borderRadius: number;
}

export interface AnnotatedTree {
  element: ReactNode;
  collected: CollectedNode[];
}

interface AnnotateOptions {
  maxDepth: number;
}

let idCounter = 0;
function nextKey(): string {
  idCounter += 1;
  return `sa-${idCounter}`;
}

export function annotateTree(children: ReactNode, options: AnnotateOptions = { maxDepth: 12 }): AnnotatedTree {
  const collected: CollectedNode[] = [];
  const element = walk(children, 0, options.maxDepth, collected);
  return { element, collected };
}

function walk(node: ReactNode, depth: number, maxDepth: number, collected: CollectedNode[]): ReactNode {
  if (depth > maxDepth) return node;

  return Children.map(node, (child) => {
    if (!isValidElement(child)) return child;
    return annotateElement(child as ReactElement, depth, maxDepth, collected);
  });
}

function annotateElement(
  el: ReactElement,
  depth: number,
  maxDepth: number,
  collected: CollectedNode[],
): ReactElement {
  const props = (el.props ?? {}) as Record<string, unknown> & {
    children?: ReactNode;
    style?: unknown;
    skeletonIgnore?: boolean;
    skeletonRole?: SkeletonRole;
  };

  if (props.skeletonIgnore) {
    return el;
  }

  const componentType = detectComponentType(el);
  const isLeafCandidate = componentType === 'text' || componentType === 'image' || (componentType === 'view' && !hasChildElements(props.children));

  if (isLeafCandidate) {
    const ref = createRef<View | Text | Image>();
    const flatStyle = flattenStyle(props.style);
    const borderRadius = readNumber(flatStyle, 'borderRadius') ?? 0;

    const signals: Partial<RoleSignals> = {
      componentType,
      hasTextContent: componentType === 'text',
      borderRadius,
    };

    collected.push({
      ref,
      signals,
      explicitRole: props.skeletonRole,
      ignore: false,
      borderRadius,
    });

    return cloneElement(el, {
      ref: mergeRef(el.props.ref, ref),
      key: el.key ?? nextKey(),
    } as object);
  }

  const newChildren = walk(props.children, depth + 1, maxDepth, collected);
  return cloneElement(el, { key: el.key ?? nextKey() } as object, newChildren);
}

function detectComponentType(el: ReactElement): 'text' | 'image' | 'view' {
  const t = el.type as unknown as { displayName?: string; name?: string };
  if (el.type === Text) return 'text';
  if (el.type === Image) return 'image';
  if (el.type === View) return 'view';
  if (typeof el.type !== 'string') {
    const name = t?.displayName ?? t?.name ?? '';
    if (name.includes('Text')) return 'text';
    if (name.includes('Image')) return 'image';
  }
  return 'view';
}

function hasChildElements(children: ReactNode): boolean {
  let found = false;
  Children.forEach(children, (c) => {
    if (isValidElement(c)) found = true;
  });
  return found;
}

function flattenStyle(style: unknown): Record<string, unknown> {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.reduce<Record<string, unknown>>((acc, s) => ({ ...acc, ...flattenStyle(s) }), {});
  }
  if (typeof style === 'object') return { ...(style as Record<string, unknown>) };
  return {};
}

function readNumber(obj: Record<string, unknown>, key: string): number | undefined {
  const v = obj[key];
  return typeof v === 'number' ? v : undefined;
}

function mergeRef<T>(a: unknown, b: RefObject<T>) {
  return (instance: T | null) => {
    if (typeof a === 'function') a(instance);
    else if (a && typeof a === 'object' && 'current' in a) (a as { current: T | null }).current = instance;
    (b as { current: T | null }).current = instance;
  };
}

export interface MeasureCollectedOptions {
  rootRef: RefObject<View | null>;
  collected: CollectedNode[];
}

export async function measureCollected({ rootRef, collected }: MeasureCollectedOptions): Promise<MeasuredNode[]> {
  const root = rootRef.current;
  if (!root) return [];

  if (isFabricView(root)) {
    const rootRect = measureSync(root);
    if (!rootRect) return [];
    const measurements = collected
      .map((node, i) => measureNodeSync(node, rootRect, i))
      .filter((m): m is MeasuredNode => m !== null);
    return measurements;
  }

  const rootRect = await measureSingle(root);
  if (!rootRect) return [];

  const measurements = await Promise.all(collected.map((node, i) => measureNode(node, rootRect, i)));
  return measurements.filter((m): m is MeasuredNode => m !== null);
}

function measureNodeSync(
  node: CollectedNode,
  rootRect: { x: number; y: number; width: number; height: number },
  i: number,
): MeasuredNode | null {
  const view = node.ref.current;
  if (!view) return null;
  const rect = measureSync(view);
  if (!rect || rect.width <= 0 || rect.height <= 0) return null;

  const signals: RoleSignals = {
    componentType: node.signals.componentType,
    hasTextContent: node.signals.hasTextContent ?? false,
    width: rect.width,
    height: rect.height,
    borderRadius: node.borderRadius,
    hasBackgroundImage: false,
    explicitRole: node.explicitRole,
  };

  return {
    id: `node-${i}`,
    role: inferRole(signals),
    x: rect.x - rootRect.x,
    y: rect.y - rootRect.y,
    width: rect.width,
    height: rect.height,
    borderRadius: node.borderRadius,
  };
}

async function measureNode(
  node: CollectedNode,
  rootRect: { x: number; y: number; width: number; height: number },
  i: number,
): Promise<MeasuredNode | null> {
  const view = node.ref.current;
  if (!view) return null;

  const rect = await measureSingle(view);
  if (!rect || rect.width <= 0 || rect.height <= 0) return null;

  const signals: RoleSignals = {
    componentType: node.signals.componentType,
    hasTextContent: node.signals.hasTextContent ?? false,
    width: rect.width,
    height: rect.height,
    borderRadius: node.borderRadius,
    hasBackgroundImage: false,
    explicitRole: node.explicitRole,
  };

  return {
    id: `node-${i}`,
    role: inferRole(signals),
    x: rect.x - rootRect.x,
    y: rect.y - rootRect.y,
    width: rect.width,
    height: rect.height,
    borderRadius: node.borderRadius,
  };
}

function measureSingle(view: View | Text | Image): Promise<{ x: number; y: number; width: number; height: number } | null> {
  return new Promise((resolve) => {
    const v = view as unknown as { measureInWindow?: (cb: (x: number, y: number, w: number, h: number) => void) => void };
    if (typeof v.measureInWindow !== 'function') {
      resolve(null);
      return;
    }
    v.measureInWindow((x, y, width, height) => resolve({ x, y, width, height }));
  });
}
