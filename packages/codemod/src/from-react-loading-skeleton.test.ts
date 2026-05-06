import { describe, it, expect } from 'vitest';
import { applyTransform } from 'jscodeshift/src/testUtils';
import transform from '../transforms/from-react-loading-skeleton';

function run(source: string): string {
  const result = applyTransform(transform, {}, { source, path: 'test.tsx' }, { parser: 'tsx' });
  return result;
}

describe('from-react-loading-skeleton codemod', () => {
  it('rewrites the import package', () => {
    const out = run(`import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function X() { return <Skeleton width={100} height={20} />; }`);
    expect(out).toMatch(/from ["']skeleton-auto["']/);
    expect(out).toContain('skeleto/styles.css');
    expect(out).toContain('AutoSkeleton');
    expect(out).not.toContain('react-loading-skeleton');
  });

  it('wraps loading ternaries with AutoSkeleton', () => {
    const out = run(`import Skeleton from 'react-loading-skeleton';

export function UserCard({ user, loading }) {
  return (
    <div>
      {loading
        ? (<><Skeleton circle width={64} height={64} /><Skeleton width={200} /></>)
        : <RealUserCard user={user} />}
    </div>
  );
}`);
    expect(out).toContain('<AutoSkeleton');
    expect(out).toContain('loading={loading}');
    expect(out).toContain('<RealUserCard');
    expect(out).not.toMatch(/<Skeleton[^A]/); // no remaining bare Skeleton
  });

  it('returns empty (no change) for unrelated files', () => {
    const out = run(`import { useState } from 'react';
export function X() { return <div>nothing to do</div>; }`);
    // applyTransform returns '' when the transform returns null (no changes made)
    expect(out).toBe('');
  });
});
