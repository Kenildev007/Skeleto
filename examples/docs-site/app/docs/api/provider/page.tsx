'use client';

import { useState } from 'react';
import { AutoSkeleton, SkeletonProvider } from 'skeleto';
import { CodeBlock } from '../../../../components/CodeBlock';
import { UserCard } from '../../../../components/sample/UserCard';

const THEMES = {
  default: { baseColor: '#e5e7eb', highlightColor: '#f3f4f6' },
  warm: { baseColor: '#fde68a', highlightColor: '#fef3c7' },
  cool: { baseColor: '#bfdbfe', highlightColor: '#dbeafe' },
  dark: { baseColor: '#27272a', highlightColor: '#3f3f46' },
};

export default function Page() {
  const [theme, setTheme] = useState<keyof typeof THEMES>('default');

  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">&lt;SkeletonProvider&gt;</h1>
      <p className="text-ink-700 leading-relaxed">
        App-wide defaults for color, animation, speed, and reduced-motion behavior.
        Wrap your app once.
      </p>

      <CodeBlock
        code={`import { SkeletonProvider } from 'skeleto';

<SkeletonProvider
  theme={{
    baseColor: '#e5e7eb',
    highlightColor: '#f3f4f6',
    darkMode: {
      baseColor: '#27272a',
      highlightColor: '#3f3f46',
    },
  }}
  defaultAnimation="shimmer"
  defaultSpeed={1.4}
  respectReducedMotion
>
  <App />
</SkeletonProvider>`}
      />

      <h2 className="text-xl font-semibold mt-8">Live theme switcher</h2>
      <div className="my-6 rounded-2xl border border-ink-200 bg-white overflow-hidden">
        <div className="px-5 py-3 border-b border-ink-200 bg-ink-50 flex flex-wrap gap-2">
          {(Object.keys(THEMES) as (keyof typeof THEMES)[]).map((k) => (
            <button
              key={k}
              onClick={() => setTheme(k)}
              className={`px-3 py-1.5 rounded-md text-sm ${
                theme === k ? 'bg-accent-600 text-white' : 'border border-ink-200 bg-white'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
        <div className="p-5" style={theme === 'dark' ? { background: '#0f172a' } : undefined}>
          <SkeletonProvider theme={THEMES[theme]} key={theme}>
            <AutoSkeleton loading>
              <UserCard />
            </AutoSkeleton>
          </SkeletonProvider>
        </div>
      </div>
    </article>
  );
}
