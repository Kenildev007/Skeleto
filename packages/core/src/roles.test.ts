import { describe, it, expect } from 'vitest';
import { inferRole } from './roles';
import type { RoleSignals } from './types';

const baseSignals: RoleSignals = {
  componentType: 'view',
  hasTextContent: false,
  width: 200,
  height: 100,
  borderRadius: 0,
  hasBackgroundImage: false,
};

describe('inferRole', () => {
  it('explicit role overrides everything', () => {
    expect(
      inferRole({
        ...baseSignals,
        explicitRole: 'image',
        componentType: 'text',
        hasTextContent: true,
      }),
    ).toBe('image');
  });

  it('text component with text content infers text', () => {
    expect(
      inferRole({
        ...baseSignals,
        componentType: 'text',
        hasTextContent: true,
        height: 18,
      }),
    ).toBe('text');
  });

  it('square small box with full radius infers circle', () => {
    expect(
      inferRole({
        ...baseSignals,
        width: 40,
        height: 40,
        borderRadius: 20,
      }),
    ).toBe('circle');
  });

  it('image element infers image', () => {
    expect(inferRole({ ...baseSignals, componentType: 'image' })).toBe('image');
  });

  it('view with background-image infers image', () => {
    expect(inferRole({ ...baseSignals, hasBackgroundImage: true })).toBe('image');
  });

  it('svg infers icon', () => {
    expect(inferRole({ ...baseSignals, componentType: 'svg', width: 24, height: 24 })).toBe('icon');
  });

  it('plain rectangle defaults to rect', () => {
    expect(inferRole({ ...baseSignals, width: 200, height: 60 })).toBe('rect');
  });

  it('short heightless box still falls back to rect', () => {
    expect(inferRole({ ...baseSignals, width: 100, height: 0 })).toBe('rect');
  });
});
