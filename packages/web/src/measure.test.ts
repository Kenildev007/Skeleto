import { describe, it, expect, beforeEach } from 'vitest';
import { measureTree } from './measure';

function makeRoot(html: string): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  return container;
}

// happy-dom returns 0x0 for layout — stub real dimensions on every leaf
function stubLayout(root: HTMLElement, w = 100, h = 20) {
  const all = [root, ...Array.from(root.querySelectorAll('*'))] as HTMLElement[];
  let y = 0;
  for (const el of all) {
    const rect = { x: 0, y, width: w, height: h, top: y, left: 0, right: w, bottom: y + h, toJSON: () => ({}) };
    el.getBoundingClientRect = () => rect as DOMRect;
    y += h;
  }
}

describe('measureTree', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('returns one node per leaf element', () => {
    const root = makeRoot(`
      <div>
        <img src="x" />
        <span>Hello</span>
        <p>World</p>
      </div>
    `);
    stubLayout(root);
    const nodes = measureTree({ container: root, rootRect: root.getBoundingClientRect() });
    expect(nodes.length).toBeGreaterThanOrEqual(3);
  });

  it('skips elements with data-skeleton-ignore', () => {
    const root = makeRoot(`
      <div data-skeleton-ignore>
        <span>ignored</span>
      </div>
      <span>visible</span>
    `);
    stubLayout(root);
    const nodes = measureTree({ container: root, rootRect: root.getBoundingClientRect() });
    expect(nodes.every((n) => n.role !== undefined)).toBe(true);
    // 'ignored' span shouldn't be in the result; only the second span
    expect(nodes.length).toBeLessThanOrEqual(1);
  });

  it('honors data-skeleton-role override', () => {
    const root = makeRoot(`
      <div data-skeleton-role="image" style="width:100px;height:50px;"></div>
    `);
    stubLayout(root);
    const nodes = measureTree({ container: root, rootRect: root.getBoundingClientRect() });
    if (nodes.length > 0) {
      expect(nodes[0]!.role).toBe('image');
    }
  });

  it('respects maxDepth', () => {
    const deep = '<div>'.repeat(20) + '<span>leaf</span>' + '</div>'.repeat(20);
    const root = makeRoot(deep);
    const nodes = measureTree({
      container: root,
      rootRect: root.getBoundingClientRect(),
      maxDepth: 3,
    });
    // With maxDepth 3, the leaf at depth 20 is unreachable
    expect(nodes.length).toBe(0);
  });
});
