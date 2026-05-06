'use client';

import { useEffect, useState } from 'react';
import { AutoSkeleton } from '@kenildev007/skeleto';
import { CodeBlock } from '../../../components/CodeBlock';

export default function Page() {
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Performance</h1>
      <p className="text-ink-700 leading-relaxed">
        60 FPS is non-negotiable. The library is built around that contract.
      </p>

      <h2 className="text-xl font-semibold mt-8">What runs where</h2>
      <table className="w-full text-sm border border-ink-200 rounded-lg overflow-hidden">
        <thead className="bg-ink-100">
          <tr>
            <th className="text-left p-3">Platform</th>
            <th className="text-left p-3">Animation runs on</th>
          </tr>
        </thead>
        <tbody>
          <Row a="Web" b="Compositor (CSS @keyframes, transform + opacity only)" />
          <Row a="RN New Architecture" b="UI thread via Reanimated 3 worklets" />
          <Row a="RN Old Architecture" b="Native driver (useNativeDriver: true)" />
          <Row a="Expo Go" b="Reanimated 3 (bundled with Expo SDK 48+)" />
        </tbody>
      </table>
      <p className="text-ink-700 mt-3">
        We never animate <code className="bg-ink-100 px-1 rounded">width / height / top / left</code>.
        Only <code className="bg-ink-100 px-1 rounded">transform</code> and <code className="bg-ink-100 px-1 rounded">opacity</code>.
      </p>

      <h2 className="text-xl font-semibold mt-8">Budgets</h2>
      <ul className="list-disc pl-6 space-y-2 text-ink-700">
        <li>Initial measurement pass: &lt; 4ms for ≤100 leaf nodes</li>
        <li>Re-measure on resize: debounced to next animation frame, &lt; 2ms</li>
        <li>Bundle size (web, gzipped): &lt; 4 KB</li>
        <li>Bundle size (native, gzipped, excl. Reanimated): &lt; 8 KB</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8">Live frame counter</h2>
      <FrameCounter />

      <h2 className="text-xl font-semibold mt-8">Big list benchmark</h2>
      <p className="text-ink-700">
        100 @kenildev007/skeletons rendered, animated, scrolled. Watch the FPS — should hold at 60.
      </p>
      <BigList />

      <h2 className="text-xl font-semibold mt-8">CI regression suite</h2>
      <p className="text-ink-700">
        Every PR runs a 500-item FlashList benchmark on an iPhone 12 simulator and asserts:
      </p>
      <CodeBlock
        code={`expect(p95FrameTime).toBeLessThan(16.67);  // ms
expect(initialMeasurePass).toBeLessThan(4); // ms`}
      />
    </article>
  );
}

function Row({ a, b }: { a: string; b: string }) {
  return (
    <tr className="border-t border-ink-200">
      <td className="p-3 font-medium">{a}</td>
      <td className="p-3 text-ink-700">{b}</td>
    </tr>
  );
}

function FrameCounter() {
  const [fps, setFps] = useState(0);
  useEffect(() => {
    let frames = 0;
    let last = performance.now();
    let rafId = 0;
    const tick = (now: number) => {
      frames += 1;
      if (now - last >= 1000) {
        setFps(frames);
        frames = 0;
        last = now;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);
  return (
    <div className="my-4 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-emerald-700 font-medium">
        {fps} FPS
      </span>
    </div>
  );
}

function BigList() {
  return (
    <div className="my-6 rounded-2xl border border-ink-200 bg-white overflow-hidden max-h-96 overflow-y-auto">
      <AutoSkeleton loading>
        <div className="flex flex-col gap-2 p-4">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="flex gap-3 p-3 bg-white border border-ink-200 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-ink-200" />
              <div className="flex-1">
                <div className="h-4 w-1/3 bg-ink-200 rounded" />
                <div className="h-3 w-2/3 bg-ink-200 rounded mt-1" />
              </div>
            </div>
          ))}
        </div>
      </AutoSkeleton>
    </div>
  );
}
