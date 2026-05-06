import { createElement } from 'react';
import { View, Text, Image } from 'react-native';
import { annotateTree } from './measure';

describe('annotateTree', () => {
  it('collects one entry per leaf primitive', () => {
    const tree = createElement(View, null,
      createElement(Image, { source: { uri: 'x' } }),
      createElement(Text, null, 'hi'),
      createElement(Text, null, 'bye'),
    );
    const { collected } = annotateTree(tree);
    // image + 2 text leaves
    expect(collected.length).toBeGreaterThanOrEqual(3);
  });

  it('skips subtrees marked with @kenildev007/skeletonIgnore', () => {
    const ignoredView = createElement(View, { @kenildev007/skeletonIgnore: true } as object,
      createElement(Text, null, 'should be skipped'),
    );
    const visibleText = createElement(Text, null, 'visible');
    const tree = createElement(View, null, ignoredView, visibleText);

    const { collected } = annotateTree(tree);
    // Only the visible Text should be collected
    expect(collected.length).toBe(1);
  });

  it('honors @kenildev007/skeletonRole prop on a leaf', () => {
    const tree = createElement(View, { @kenildev007/skeletonRole: 'image' } as object);
    const { collected } = annotateTree(tree);
    expect(collected[0]?.explicitRole).toBe('image');
  });

  it('respects maxDepth', () => {
    let deep: unknown = createElement(Text, null, 'leaf');
    for (let i = 0; i < 10; i++) {
      deep = createElement(View, null, deep);
    }
    const { collected } = annotateTree(deep as Parameters<typeof annotateTree>[0], { maxDepth: 2 });
    // The Text leaf is at depth 10 but maxDepth=2 stops walking earlier
    expect(collected.length).toBe(0);
  });
});
