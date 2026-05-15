'use client';

import { useState } from 'react';
import { AutoSkeleton } from '@kenildev007/skeleto';
import { CodeBlock } from '../../components/CodeBlock';
import { UserCard } from '../../components/sample/UserCard';

const RLS_CODE = `// react-loading-skeleton — manual parallel tree (~22 lines)
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function UserCard({ user, loading }) {
  if (loading) {
    return (
      <div className="card">
        <Skeleton circle width={64} height={64} />
        <div className="body">
          <Skeleton width={140} height={20} />
          <Skeleton width={280} height={14} count={2} />
          <div className="row">
            <Skeleton width={56} height={24} borderRadius={12} />
            <Skeleton width={72} height={24} borderRadius={12} />
          </div>
        </div>
      </div>
    );
  }
  return <RealUserCard user={user} />;
}`;

const SA_CODE = `// Skeleto — wrap and forget (3 lines)
import { AutoSkeleton } from '@kenildev007/skeleto';

function UserCard({ user, loading }) {
  return (
    <AutoSkeleton loading={loading}>
      <RealUserCard user={user} />
    </AutoSkeleton>
  );
}`;

const RLS_LOC = 22;
const SA_LOC = 6;

export default function ComparePage() {
  const [loading, setLoading] = useState(true);

  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Side-by-side</h1>
        <p className="text-ink-700 leading-relaxed mt-3">
          Same UserCard. Same loading flag. Same visual output. One is
          hand-authored placeholders ({RLS_LOC} lines), the other is a wrapper ({SA_LOC} lines).
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setLoading((l) => !l)}
          className="px-4 py-2 rounded-md bg-accent-600 text-white text-sm font-medium hover:bg-accent-500"
        >
          {loading ? 'Show real content' : 'Show skeleton'}
        </button>
        <button
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1500);
          }}
          className="px-4 py-2 rounded-md border border-ink-200 bg-white text-sm hover:bg-ink-100"
        >
          Simulate fetch
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Pane
          title="react-loading-skeleton"
          subtitle={`${RLS_LOC} lines · maintains parallel skeleton tree`}
          tone="muted"
        >
          {loading ? <FauxRLSSkeleton /> : <UserCard />}
        </Pane>

        <Pane
          title="@kenildev007/skeleto"
          subtitle={`${SA_LOC} lines · auto-generated from real DOM`}
          tone="accent"
        >
          <AutoSkeleton loading={loading}>
            <UserCard />
          </AutoSkeleton>
        </Pane>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <CodeBlock code={RLS_CODE} />
        <CodeBlock code={SA_CODE} />
      </div>

      <Stats />

      <div className="rounded-xl border border-ink-200 bg-white p-6">
        <h2 className="text-xl font-semibold">What you save</h2>
        <ul className="mt-4 space-y-3 text-ink-700">
          <li>
            <strong className="text-ink-900">{RLS_LOC - SA_LOC} lines per component</strong> — that's <strong>{Math.round(((RLS_LOC - SA_LOC) / RLS_LOC) * 100)}%</strong> less skeleton code per file
          </li>
          <li>
            <strong className="text-ink-900">Zero drift</strong> — when the real component changes its layout, the skeleton updates automatically. With the manual approach you forget to update the skeleton tree and it goes stale.
          </li>
          <li>
            <strong className="text-ink-900">One API for web + RN + Expo</strong> — react-loading-skeleton is web-only; for React Native you'd install <em>react-native-skeleton-placeholder</em> separately and write yet another parallel tree.
          </li>
          <li>
            <strong className="text-ink-900">A11y baked in</strong> — <code className="bg-ink-100 px-1 rounded">aria-busy</code>, <code className="bg-ink-100 px-1 rounded">aria-live</code>, <code className="bg-ink-100 px-1 rounded">prefers-reduced-motion</code>, <code className="bg-ink-100 px-1 rounded">inert</code> focus trap — handled. With the manual approach you wire each yourself.
          </li>
        </ul>
      </div>
    </article>
  );
}

function Pane({
  title,
  subtitle,
  tone,
  children,
}: {
  title: string;
  subtitle: string;
  tone: 'muted' | 'accent';
  children: React.ReactNode;
}) {
  const ringClass = tone === 'accent' ? 'ring-2 ring-accent-500' : 'ring-1 ring-ink-200';
  return (
    <div className={`rounded-xl bg-white ${ringClass} overflow-hidden`}>
      <div className="px-5 py-3 border-b border-ink-200 bg-ink-50">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-ink-500 mt-0.5">{subtitle}</div>
      </div>
      <div className="p-5 min-h-[160px] flex items-center">{children}</div>
    </div>
  );
}

function FauxRLSSkeleton() {
  // Hand-authored placeholder — what you'd write with react-loading-skeleton.
  // Implemented as bare divs to avoid pulling the dep into the docs site.
  return (
    <div className="flex gap-4 p-1 w-full">
      <div className="w-16 h-16 rounded-full bg-ink-200 animate-pulse" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="w-36 h-5 rounded bg-ink-200 animate-pulse" />
        <div className="w-72 h-3.5 rounded bg-ink-200 animate-pulse" />
        <div className="w-64 h-3.5 rounded bg-ink-200 animate-pulse" />
        <div className="flex gap-2 mt-2">
          <div className="w-14 h-6 rounded-full bg-ink-200 animate-pulse" />
          <div className="w-20 h-6 rounded-full bg-ink-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function Stats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Stat label="Lines of code" rls={`${RLS_LOC}`} sa={`${SA_LOC}`} better="sa" />
      <Stat label="Web" rls="✓" sa="✓" better="tie" />
      <Stat label="React Native" rls="✗" sa="✓" better="sa" />
      <Stat label="Expo Go" rls="✗" sa="✓" better="sa" />
      <Stat label="Auto-measure" rls="✗" sa="✓" better="sa" />
      <Stat label="Drift-proof" rls="✗" sa="✓" better="sa" />
      <Stat label="SSR no-flash" rls="manual" sa="built-in" better="sa" />
      <Stat label="Bundle (gzip)" rls="3.0 KB" sa="5.3 KB (web+core)" better="rls" />
    </div>
  );
}

function Stat({ label, rls, sa, better }: { label: string; rls: string; sa: string; better: 'sa' | 'rls' | 'tie' }) {
  return (
    <div className="rounded-lg border border-ink-200 bg-white p-3">
      <div className="text-xs uppercase tracking-wide text-ink-500">{label}</div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <div className={better === 'rls' ? 'font-semibold' : 'text-ink-500'}>
          <div className="text-[10px] uppercase">RLS</div>
          {rls}
        </div>
        <div className={better === 'sa' ? 'font-semibold text-accent-600' : 'text-ink-500'}>
          <div className="text-[10px] uppercase">SA</div>
          {sa}
        </div>
      </div>
    </div>
  );
}
