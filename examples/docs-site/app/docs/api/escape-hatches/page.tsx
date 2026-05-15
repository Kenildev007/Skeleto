'use client';

import { useState } from 'react';
import { AutoSkeleton } from '@kenildev007/skeleto';
import { CodeBlock } from '../../../../components/CodeBlock';

export default function Page() {
  return (
    <article className="space-y-8">
      <h1 className="text-3xl font-semibold tracking-tight">Escape hatches</h1>
      <p className="text-ink-700 leading-relaxed">
        For the 10% of cases where automatic role inference doesn't reach: charts on canvas,
        custom native modules, gradient banners that should be one rect, etc.
      </p>

      <h2 id="role" className="text-xl font-semibold mt-8">Force a role</h2>
      <p className="text-ink-700">
        Pass <code className="bg-ink-100 px-1 rounded">data-skeleton-role</code> on web,
        or <code className="bg-ink-100 px-1 rounded">skeletonRole</code> on RN, to override inference.
      </p>
      <CodeBlock
        code={`// web
<div data-skeleton-role="image" />

// React Native
<View skeletonRole="image" />`}
      />
      <RoleDemo />

      <h2 id="ignore" className="text-xl font-semibold mt-12">Ignore a subtree</h2>
      <p className="text-ink-700">
        Wrap any subtree that shouldn't be skeletonized — error banners, sticky toolbars, etc.
      </p>
      <CodeBlock
        code={`<div data-skeleton-ignore>
  <ErrorBanner />
</div>

// React Native
<View skeletonIgnore>
  <ErrorBanner />
</View>`}
      />
      <IgnoreDemo />

      <h2 id="custom" className="text-xl font-semibold mt-12">&lt;AutoSkeleton.Custom&gt;</h2>
      <p className="text-ink-700">
        Replace a single subtree with a hand-crafted skeleton. Useful for charts, maps,
        videos — anything the measurement engine can't introspect meaningfully.
      </p>
      <CodeBlock
        code={`<AutoSkeleton.Custom
  loading={loading}
  render={() => <ChartPlaceholder />}
>
  <ComplexChart data={data} />
</AutoSkeleton.Custom>`}
      />
      <CustomDemo />
    </article>
  );
}

function RoleDemo() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="my-6 rounded-2xl border border-ink-200 bg-white overflow-hidden">
      <div className="px-5 py-3 border-b border-ink-200 bg-ink-50">
        <button onClick={() => setLoading((l) => !l)} className="px-3 py-1.5 rounded-md bg-accent-600 text-white text-sm">
          Toggle
        </button>
      </div>
      <div className="p-5">
        <AutoSkeleton loading={loading}>
          <div className="flex gap-3">
            <div data-skeleton-role="circle" className="w-12 h-12 rounded-full bg-ink-200" />
            <div data-skeleton-role="image" className="flex-1 h-20 rounded-lg bg-ink-200" />
          </div>
        </AutoSkeleton>
      </div>
    </div>
  );
}

function IgnoreDemo() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="my-6 rounded-2xl border border-ink-200 bg-white overflow-hidden">
      <div className="px-5 py-3 border-b border-ink-200 bg-ink-50">
        <button onClick={() => setLoading((l) => !l)} className="px-3 py-1.5 rounded-md bg-accent-600 text-white text-sm">
          Toggle
        </button>
      </div>
      <div className="p-5">
        <AutoSkeleton loading={loading}>
          <div className="flex flex-col gap-3">
            <div data-skeleton-ignore className="px-3 py-2 rounded bg-amber-100 text-amber-700 text-sm">
              ⚠ This banner is always visible — wrapped in data-skeleton-ignore
            </div>
            <div className="flex gap-3 p-3 bg-white border border-ink-200 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-ink-200" />
              <div className="flex-1">
                <div className="font-semibold">Ada Lovelace</div>
                <div className="text-sm text-ink-500">Skeletonized normally</div>
              </div>
            </div>
          </div>
        </AutoSkeleton>
      </div>
    </div>
  );
}

function CustomDemo() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="my-6 rounded-2xl border border-ink-200 bg-white overflow-hidden">
      <div className="px-5 py-3 border-b border-ink-200 bg-ink-50">
        <button onClick={() => setLoading((l) => !l)} className="px-3 py-1.5 rounded-md bg-accent-600 text-white text-sm">
          Toggle
        </button>
      </div>
      <div className="p-5">
        <AutoSkeleton.Custom
          loading={loading}
          render={() => (
            <div className="h-40 rounded-lg bg-gradient-to-r from-ink-200 via-ink-100 to-ink-200 animate-pulse flex items-end justify-around p-4">
              {[40, 70, 30, 90, 55, 65].map((h, i) => (
                <div key={i} style={{ height: `${h}%` }} className="w-6 rounded-t bg-ink-300" />
              ))}
            </div>
          )}
        >
          <FakeChart />
        </AutoSkeleton.Custom>
      </div>
    </div>
  );
}

function FakeChart() {
  return (
    <div className="h-40 rounded-lg bg-white border border-ink-200 flex items-end justify-around p-4">
      {[40, 70, 30, 90, 55, 65].map((h, i) => (
        <div key={i} style={{ height: `${h}%` }} className="w-6 rounded-t bg-accent-500" />
      ))}
    </div>
  );
}
