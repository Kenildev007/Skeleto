// Minimal RN mock — enough surface area to test annotateTree + role inference logic.
// Component identity matters (so element.type === Text comparisons work).

export const View = ((props: unknown) => null) as unknown as { displayName?: string };
(View as { displayName?: string }).displayName = 'View';

export const Text = ((props: unknown) => null) as unknown as { displayName?: string };
(Text as { displayName?: string }).displayName = 'Text';

export const Image = ((props: unknown) => null) as unknown as { displayName?: string };
(Image as { displayName?: string }).displayName = 'Image';

export class Animated {
  static View = View;
  static Value = class {
    constructor(public _v: number) {}
  };
  static timing = () => ({ start: () => {}, stop: () => {} });
  static parallel = () => ({ start: () => {}, stop: () => {} });
  static loop = () => ({ start: () => {}, stop: () => {} });
  static sequence = () => ({ start: () => {} });
  static delay = () => ({});
}

export const StyleSheet = {
  absoluteFillObject: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  flatten: (s: unknown) => s,
  create: <T>(s: T): T => s,
};

export const Easing = {
  inOut: (fn: unknown) => fn,
  ease: () => 0,
};

export const AccessibilityInfo = {
  isReduceMotionEnabled: () => Promise.resolve(false),
  addEventListener: () => ({ remove: () => {} }),
};

export type ImageProps = unknown;
export type TextProps = unknown;
export type ViewProps = unknown;
export type LayoutChangeEvent = unknown;
