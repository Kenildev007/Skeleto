'use client';

import { useState } from 'react';
import { useSkeleton } from 'skeleton-auto';
import { CodeBlock } from '../../../../components/CodeBlock';

export default function Page() {
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">useSkeleton()</h1>
      <p className="text-ink-700 leading-relaxed">
        For when you want to render a custom skeleton — not the auto-measured one — but still
        want the lifecycle helpers: stable loading state with <code className="bg-ink-100 px-1 rounded">minDuration</code>,
        a11y bindings, etc.
      </p>

      <CodeBlock
        code={`import { useSkeleton } from 'skeleton-auto';

function MyComponent({ loading }) {
  const { isSkeleton, bind } = useSkeleton({ loading, minDuration: 400 });

  return (
    <div {...bind}>
      {isSkeleton ? <MyCustomBones /> : <RealContent />}
    </div>
  );
}`}
      />

      <h2 className="text-xl font-semibold mt-8">Returns</h2>
      <ul className="list-disc pl-6 text-ink-700 space-y-2">
        <li><code className="bg-ink-100 px-1 rounded">isSkeleton</code> — true while loading (respects minDuration)</li>
        <li><code className="bg-ink-100 px-1 rounded">bind</code> — props to spread on your wrapper for a11y (aria-busy, aria-live)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8">Live demo</h2>
      <Demo />
    </article>
  );
}

function Demo() {
  const [loading, setLoading] = useState(true);
  const { isSkeleton, bind } = useSkeleton({ loading, minDuration: 600 });

  return (
    <div className="my-6 rounded-2xl border border-ink-200 bg-white overflow-hidden">
      <div className="px-5 py-3 border-b border-ink-200 bg-ink-50">
        <button onClick={() => setLoading((l) => !l)} className="px-3 py-1.5 rounded-md bg-accent-600 text-white text-sm">
          Toggle
        </button>
      </div>
      <div {...bind} className="p-6">
        {isSkeleton ? (
          <div className="flex flex-col gap-2">
            <div className="h-6 w-1/2 rounded bg-ink-200 animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-ink-200 animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-ink-200 animate-pulse" />
          </div>
        ) : (
          <div>
            <h3 className="font-semibold">Hand-crafted skeleton</h3>
            <p className="text-ink-700">When you need full control over the placeholder shape.</p>
          </div>
        )}
      </div>
    </div>
  );
}
