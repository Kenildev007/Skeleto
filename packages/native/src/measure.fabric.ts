import type { Image, Text, View } from 'react-native';

/**
 * On Fabric (RN New Architecture), every host component instance exposes a
 * synchronous `getBoundingClientRect()` that reads from the shadow tree on
 * the UI thread. On the legacy renderer this method does not exist.
 *
 * We sniff for it on the first measurement call and cache the result.
 */
let fabricEnabled: boolean | null = null;

type Measurable = View | Text | Image;
type ViewWithSync = Measurable & {
  getBoundingClientRect?: () => { x: number; y: number; width: number; height: number };
};

export function isFabricView(view: Measurable | null): boolean {
  if (!view) return false;
  if (fabricEnabled !== null) return fabricEnabled;
  fabricEnabled = typeof (view as ViewWithSync).getBoundingClientRect === 'function';
  return fabricEnabled;
}

export function measureSync(
  view: Measurable,
): { x: number; y: number; width: number; height: number } | null {
  const v = view as ViewWithSync;
  if (typeof v.getBoundingClientRect !== 'function') return null;
  try {
    const rect = v.getBoundingClientRect();
    if (!rect) return null;
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  } catch {
    return null;
  }
}
