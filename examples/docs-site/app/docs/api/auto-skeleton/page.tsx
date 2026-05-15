'use client';

import { useState } from 'react';
import { AutoSkeleton } from '@kenildev007/skeleto';
import { CodeBlock } from '../../../../components/CodeBlock';
import { DemoFrame } from '../../../../components/DemoFrame';
import { UserCard } from '../../../../components/sample/UserCard';
import { Feed } from '../../../../components/sample/Feed';

export default function Page() {
  return (
    <article className="space-y-8">
      <h1 className="text-3xl font-semibold tracking-tight">&lt;AutoSkeleton&gt;</h1>
      <p className="text-ink-700 leading-relaxed">
        The main component. Wrap any subtree, pass <code className="bg-ink-100 px-1 rounded">loading</code>, done.
      </p>

      <h2 className="text-xl font-semibold mt-8">Full prop reference</h2>
      <CodeBlock
        code={`type AutoSkeletonProps = {
  loading: boolean;
  children: React.ReactNode;

  // Animation
  animation?: 'shimmer' | 'pulse' | 'wave' | 'none';  // default 'shimmer'
  speed?: number;                    // seconds per cycle, default 1.4
  direction?: 'ltr' | 'rtl';         // default 'ltr'

  // Appearance
  baseColor?: string;
  highlightColor?: string;
  borderRadius?: number | 'inherit'; // default 'inherit'
  opacity?: number;                  // default 1

  // Behavior
  transition?: number;               // ms fade, default 200
  staggerChildren?: number;          // ms between child reveals, default 0
  minDuration?: number;              // ms minimum skeleton display, default 0

  // Advanced
  preserveLayout?: boolean;          // default true
  maxDepth?: number;                 // default 12
  onMeasure?: (nodes: MeasuredNode[]) => void;
};`}
      />

      <h2 id="animation" className="text-xl font-semibold mt-12">animation</h2>
      <p className="text-ink-700">
        Choose the visual style. All four are 60 FPS — animation runs on the compositor.
      </p>
      <AnimationDemo />

      <h2 id="speed" className="text-xl font-semibold mt-12">speed</h2>
      <p className="text-ink-700">Seconds per animation cycle. Lower = faster.</p>
      <SpeedDemo />

      <h2 id="stagger" className="text-xl font-semibold mt-12">staggerChildren</h2>
      <p className="text-ink-700">
        Stagger the start of each leaf's animation by N milliseconds. Creates a wave-style reveal.
      </p>
      <DemoFrame
        code={`<AutoSkeleton loading={loading} staggerChildren={80}>
  <Feed />
</AutoSkeleton>`}
        preview={(loading) => (
          <AutoSkeleton loading={loading} staggerChildren={80}>
            <Feed />
          </AutoSkeleton>
        )}
      />

      <h2 id="min-duration" className="text-xl font-semibold mt-12">minDuration</h2>
      <p className="text-ink-700">
        Prevents skeleton flicker. If your data resolves in 50ms, the skeleton would otherwise
        flash for one frame and disappear — looking like a glitch. Set
        <code className="bg-ink-100 px-1 rounded"> minDuration={`{400}`}</code> and the skeleton
        is held visible for at least 400ms regardless of how fast the network responds.
      </p>
      <MinDurationDemo />

      <h2 id="transition" className="text-xl font-semibold mt-12">transition</h2>
      <p className="text-ink-700">Cross-fade duration in ms when toggling.</p>
      <TransitionDemo />

      <h2 id="theming" className="text-xl font-semibold mt-12">baseColor & highlightColor</h2>
      <p className="text-ink-700">Override colors per-instance.</p>
      <DemoFrame
        code={`<AutoSkeleton
  loading={loading}
  baseColor="#1e293b"
  highlightColor="#334155"
>
  <UserCard />
</AutoSkeleton>`}
        preview={(loading) => (
          <div style={{ background: '#0f172a', padding: 16, borderRadius: 12 }}>
            <AutoSkeleton loading={loading} baseColor="#1e293b" highlightColor="#475569">
              <DarkUserCard />
            </AutoSkeleton>
          </div>
        )}
      />
    </article>
  );
}

function AnimationDemo() {
  const animations = ['shimmer', 'pulse', 'wave', 'none'] as const;
  const [loading, setLoading] = useState(true);
  return (
    <div className="my-6 rounded-2xl border border-ink-200 bg-white overflow-hidden">
      <div className="px-5 py-3 border-b border-ink-200 bg-ink-50">
        <button
          onClick={() => setLoading((l) => !l)}
          className="px-3 py-1.5 rounded-md bg-accent-600 text-white text-sm font-medium hover:bg-accent-500"
        >
          Toggle loading
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
        {animations.map((a) => (
          <div key={a}>
            <div className="text-xs font-semibold uppercase text-ink-500 mb-2">
              animation=&quot;{a}&quot;
            </div>
            <AutoSkeleton loading={loading} animation={a}>
              <UserCard />
            </AutoSkeleton>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpeedDemo() {
  const [speed, setSpeed] = useState(1.4);
  return (
    <div className="my-6 rounded-2xl border border-ink-200 bg-white overflow-hidden">
      <div className="px-5 py-3 border-b border-ink-200 bg-ink-50 flex items-center gap-3">
        <label className="text-sm">speed: {speed.toFixed(1)}s</label>
        <input
          type="range"
          aria-label="Animation speed in seconds"
          min="0.4"
          max="3"
          step="0.1"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
        />
      </div>
      <div className="p-5">
        <AutoSkeleton loading speed={speed}>
          <UserCard />
        </AutoSkeleton>
      </div>
    </div>
  );
}

function MinDurationDemo() {
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState<number | null>(null);

  const fakeFetch = (ms: number) => {
    const start = Date.now();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLast(Date.now() - start);
    }, ms);
  };

  return (
    <div className="my-6 rounded-2xl border border-ink-200 bg-white overflow-hidden">
      <div className="px-5 py-3 border-b border-ink-200 bg-ink-50 flex flex-wrap gap-2 items-center">
        <button onClick={() => fakeFetch(50)} className="px-3 py-1.5 rounded-md border border-ink-200 bg-white text-sm">
          Fast fetch (50ms)
        </button>
        <button onClick={() => fakeFetch(1500)} className="px-3 py-1.5 rounded-md border border-ink-200 bg-white text-sm">
          Slow fetch (1500ms)
        </button>
        {last !== null ? <span className="text-xs text-ink-500">Last fetch: {last}ms</span> : null}
      </div>
      <div className="grid md:grid-cols-2 gap-4 p-5">
        <div>
          <div className="text-xs font-semibold uppercase text-ink-500 mb-2">No minDuration</div>
          <AutoSkeleton loading={loading}>
            <UserCard />
          </AutoSkeleton>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase text-ink-500 mb-2">minDuration={`{600}`}</div>
          <AutoSkeleton loading={loading} minDuration={600}>
            <UserCard />
          </AutoSkeleton>
        </div>
      </div>
    </div>
  );
}

function TransitionDemo() {
  const [transition, setTransition] = useState(200);
  const [loading, setLoading] = useState(true);
  return (
    <div className="my-6 rounded-2xl border border-ink-200 bg-white overflow-hidden">
      <div className="px-5 py-3 border-b border-ink-200 bg-ink-50 flex flex-wrap items-center gap-3">
        <button onClick={() => setLoading((l) => !l)} className="px-3 py-1.5 rounded-md bg-accent-600 text-white text-sm">
          Toggle
        </button>
        <label className="text-sm">transition: {transition}ms</label>
        <input type="range" aria-label="Transition duration in milliseconds" min="0" max="800" step="50" value={transition} onChange={(e) => setTransition(parseInt(e.target.value))} />
      </div>
      <div className="p-5">
        <AutoSkeleton loading={loading} transition={transition}>
          <UserCard />
        </AutoSkeleton>
      </div>
    </div>
  );
}

function DarkUserCard() {
  return (
    <div className="flex gap-4 p-4 rounded-lg" style={{ background: '#0f172a', color: '#f1f5f9' }}>
      <img src="https://i.pravatar.cc/96?u=ada" alt="" className="w-14 h-14 rounded-full" />
      <div className="flex flex-col gap-1">
        <span className="font-semibold">Ada Lovelace</span>
        <span className="text-sm text-slate-400">Mathematician, programmer.</span>
      </div>
    </div>
  );
}
