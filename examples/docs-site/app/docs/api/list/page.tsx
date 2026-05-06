'use client';

import { useState } from 'react';
import { AutoSkeleton } from 'skeleto';
import { CodeBlock } from '../../../../components/CodeBlock';

export default function Page() {
  const [loading, setLoading] = useState(true);
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">&lt;AutoSkeleton.List&gt;</h1>
      <p className="text-ink-700 leading-relaxed">
        Optimized for virtualized lists (FlatList, FlashList, react-window, etc.). Skips
        per-item DOM measurement entirely — instead, you provide a fixed item height and a
        count. This is the right choice for &gt;50 row lists where measurement would cost more
        than just rendering rectangles.
      </p>

      <CodeBlock
        code={`<AutoSkeleton.List
  count={8}
  estimatedItemHeight={72}
  gap={12}
/>`}
      />

      <div className="my-6 rounded-2xl border border-ink-200 bg-white overflow-hidden">
        <div className="px-5 py-3 border-b border-ink-200 bg-ink-50">
          <button
            onClick={() => setLoading((l) => !l)}
            className="px-3 py-1.5 rounded-md bg-accent-600 text-white text-sm"
          >
            Toggle
          </button>
        </div>
        <div className="p-5">
          {loading ? (
            <AutoSkeleton.List count={6} estimatedItemHeight={64} gap={10} />
          ) : (
            <div className="flex flex-col gap-2.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-white border border-ink-200 p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-ink-200" />
                  <div className="text-sm font-medium">Row {i + 1}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-8">With FlashList (React Native)</h2>
      <CodeBlock
        code={`<FlashList
  data={isLoading ? [] : items}
  estimatedItemSize={72}
  ListEmptyComponent={
    <AutoSkeleton.List
      count={8}
      estimatedItemHeight={72}
      renderItem={() => <UserRowSkeleton />}
    />
  }
/>`}
      />
    </article>
  );
}
