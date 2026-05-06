'use client';

import { useEffect, useState } from 'react';
import { AutoSkeleton } from 'skeleton-auto';
import { CodeBlock } from '../../../components/CodeBlock';
import { UserCard } from '../../../components/sample/UserCard';

export default function Page() {
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Accessibility</h1>
      <p className="text-ink-700 leading-relaxed">
        A11y is built in, not bolted on. Every <code className="bg-ink-100 px-1 rounded">&lt;AutoSkeleton&gt;</code>
        does the right thing for screen readers, keyboard users, and people with reduced-motion preferences.
      </p>

      <h2 className="text-xl font-semibold mt-8">What we set automatically</h2>
      <ul className="list-disc pl-6 space-y-2 text-ink-700">
        <li><code className="bg-ink-100 px-1 rounded">aria-busy=&quot;true&quot;</code> on the wrapper while loading</li>
        <li><code className="bg-ink-100 px-1 rounded">aria-live=&quot;polite&quot;</code> announces "loading content"</li>
        <li>Skeleton layer is <code className="bg-ink-100 px-1 rounded">aria-hidden=&quot;true&quot;</code> — readers skip it</li>
        <li>Real (invisible) content is hidden from a11y tree while loading</li>
        <li>Keyboard focus is trapped away from the invisible real content</li>
        <li>RN: <code className="bg-ink-100 px-1 rounded">accessibilityState=&#123;&#123; busy: true &#125;&#125;</code></li>
      </ul>

      <h2 className="text-xl font-semibold mt-8">Reduced motion</h2>
      <p className="text-ink-700 leading-relaxed">
        When <code className="bg-ink-100 px-1 rounded">prefers-reduced-motion: reduce</code> is set, shimmer
        and wave are downgraded to a slower pulse. Toggle "Reduce Motion" in your OS settings
        to see this work live.
      </p>
      <ReducedMotionDemo />

      <h2 className="text-xl font-semibold mt-8">Disable behavior</h2>
      <CodeBlock
        code={`<SkeletonProvider respectReducedMotion={false}>
  {/* shimmer always on, even with reduce-motion enabled */}
</SkeletonProvider>`}
      />

      <h2 className="text-xl font-semibold mt-8">Custom announcement</h2>
      <CodeBlock
        code={`<AutoSkeleton loading aria-label="Loading user profile">
  <UserCard />
</AutoSkeleton>`}
      />
    </article>
  );
}

function ReducedMotionDemo() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="my-6 rounded-2xl border border-ink-200 bg-white overflow-hidden">
      <div className="px-5 py-3 border-b border-ink-200 bg-ink-50 text-sm">
        prefers-reduced-motion: <strong>{reduced ? 'reduce (pulse)' : 'no-preference (shimmer)'}</strong>
      </div>
      <div className="p-5">
        <AutoSkeleton loading>
          <UserCard />
        </AutoSkeleton>
      </div>
    </div>
  );
}
