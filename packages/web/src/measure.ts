import { inferRole, type MeasuredNode, type RoleSignals, type SkeletonRole } from '@skeleto/core';

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'META', 'LINK']);
const TEXT_TAGS = new Set(['P', 'SPAN', 'A', 'LABEL', 'STRONG', 'EM', 'B', 'I', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'DT', 'DD', 'TIME', 'CODE', 'CITE', 'SMALL', 'SUB', 'SUP']);
const IMAGE_TAGS = new Set(['IMG', 'PICTURE', 'VIDEO', 'CANVAS']);
const SVG_TAGS = new Set(['SVG']);
const VOID_LEAF_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'IMG', 'VIDEO', 'CANVAS', 'SVG', 'IFRAME', 'HR']);

const TEXT_NODE = 3;
const ELEMENT_NODE = 1;

export interface MeasureOptions {
  container: HTMLElement;
  rootRect: DOMRect;
  maxDepth?: number;
}

export function measureTree({ container, rootRect, maxDepth = 12 }: MeasureOptions): MeasuredNode[] {
  const nodes: MeasuredNode[] = [];
  let counter = 0;
  const rootLeft = rootRect.left;
  const rootTop = rootRect.top;

  function walk(el: Element, depth: number): void {
    if (depth > maxDepth) return;
    const tag = el.tagName;
    if (SKIP_TAGS.has(tag)) return;

    // Skip skeleton-internal elements (sr-only label, layer).
    // String indexOf is faster than classList.contains for the common case.
    const cn = (el as HTMLElement).className;
    if (typeof cn === 'string' && (cn.indexOf('sa-sr-only') >= 0 || cn.indexOf('sa-layer') >= 0)) return;

    // Direct attribute access avoids the `dataset` proxy object allocation.
    let explicitRole: SkeletonRole | undefined;
    if (el.hasAttribute('data-skeleton-ignore')) return;
    if (el.hasAttribute('data-skeleton-role')) {
      explicitRole = el.getAttribute('data-skeleton-role') as SkeletonRole;
    }

    const children = el.children;
    const childCount = children.length;

    if (isLeafFast(el, tag, childCount)) {
      const measured = measureElement(el, rootLeft, rootTop, counter++, tag, explicitRole);
      if (measured) nodes.push(measured);
      return;
    }

    // Index loop avoids Array.from allocation per non-leaf.
    for (let i = 0; i < childCount; i++) {
      walk(children[i]!, depth + 1);
    }
  }

  const rootChildren = container.children;
  for (let i = 0; i < rootChildren.length; i++) {
    walk(rootChildren[i]!, 0);
  }

  return nodes;
}

function isLeafFast(el: Element, tag: string, childCount: number): boolean {
  if (VOID_LEAF_TAGS.has(tag)) return true;
  if (childCount === 0) return true;

  // Element has element children. Treat as a "text leaf" only if every element
  // child is empty AND the parent has visible text. Manual loop avoids Array.from.
  const nodes = el.childNodes;
  let sawNonEmptyText = false;
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i]!;
    if (n.nodeType === TEXT_NODE) {
      const text = n.textContent;
      if (text && text.trim().length > 0) sawNonEmptyText = true;
    } else if (n.nodeType === ELEMENT_NODE) {
      const e = n as Element;
      if (e.children.length > 0) return false;
      const t = e.textContent;
      if (t && t.trim().length > 0) return false;
    }
  }
  return sawNonEmptyText;
}

function measureElement(
  el: Element,
  rootLeft: number,
  rootTop: number,
  id: number,
  tag: string,
  explicitRole?: SkeletonRole,
): MeasuredNode | null {
  const rect = el.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;

  const styles = window.getComputedStyle(el);
  if (styles.display === 'none') return null;

  const borderRadius = parseRadius(styles.borderRadius, rect.width, rect.height);
  const componentType = detectComponentType(tag);

  const text = el.textContent;
  const hasText = !!text && text.length > 0 && (TEXT_TAGS.has(tag) || el.children.length === 0);

  const bg = styles.backgroundImage;
  const hasBgImage = bg !== 'none' && bg !== '';

  const signals: RoleSignals = {
    componentType,
    hasTextContent: hasText,
    width: rect.width,
    height: rect.height,
    borderRadius,
    hasBackgroundImage: hasBgImage,
    explicitRole,
  };

  return {
    id: `node-${id}`,
    role: inferRole(signals),
    x: rect.left - rootLeft,
    y: rect.top - rootTop,
    width: rect.width,
    height: rect.height,
    borderRadius,
  };
}

function detectComponentType(tag: string): RoleSignals['componentType'] {
  if (TEXT_TAGS.has(tag)) return 'text';
  if (IMAGE_TAGS.has(tag)) return 'image';
  if (SVG_TAGS.has(tag)) return 'svg';
  return 'view';
}

function parseRadius(raw: string, w: number, h: number): number {
  if (!raw) return 0;
  const space = raw.indexOf(' ');
  const first = space >= 0 ? raw.slice(0, space) : raw;
  const last = first.charCodeAt(first.length - 1);
  if (last === 37 /* % */) {
    const pct = parseFloat(first) / 100;
    return Math.min(w, h) * pct;
  }
  const px = parseFloat(first);
  return Number.isFinite(px) ? px : 0;
}
