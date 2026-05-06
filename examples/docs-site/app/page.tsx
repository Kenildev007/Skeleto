'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AutoSkeleton } from 'skeleton-auto';
import { UserCard } from '../components/sample/UserCard';
import { CodeBlock } from '../components/CodeBlock';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setLoading((l) => !l), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-b from-white to-ink-50 border-b border-ink-200">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-accent-500/10 text-accent-600 font-medium">
              v0.1 — React, React Native, Expo
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mt-6 leading-[1.05]">
              The last skeleton loader you'll install.
            </h1>
            <p className="text-lg text-ink-500 mt-6 leading-relaxed">
              <code className="text-ink-900 bg-ink-100 px-1.5 py-0.5 rounded">skeleton-auto</code> reads
              your real UI and generates pixel-matching skeletons on the fly. One component. Web,
              iOS, Android, Expo. 60 FPS. Zero config.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/docs/getting-started"
                className="px-5 py-2.5 rounded-md bg-accent-600 text-white font-medium hover:bg-accent-500"
              >
                Get started →
              </Link>
              <Link
                href="/playground"
                className="px-5 py-2.5 rounded-md border border-ink-200 bg-white hover:bg-ink-100 font-medium"
              >
                Try in browser
              </Link>
            </div>
            <div className="mt-6">
              <CodeBlock code={`npm install skeleton-auto`} language="bash" />
            </div>
          </div>

          <div>
            <div className="text-xs text-ink-500 uppercase tracking-wide mb-2">
              Live: same component, toggling every 2 seconds
            </div>
            <AutoSkeleton loading={loading} transition={250}>
              <UserCard />
            </AutoSkeleton>
            <div className="text-xs text-ink-500 mt-4">
              ↑ This skeleton is generated from the actual UserCard's DOM.
              No fixture file. No CLI. We just measure.
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          <Card
            title="One API"
            body="Same <AutoSkeleton> on web, iOS, Android, and Expo Go. We pick the right renderer per platform."
          />
          <Card
            title="No build step"
            body="No Playwright. No CLI. No fixture files. Just wrap your component."
          />
          <Card
            title="60 FPS guaranteed"
            body="Animation runs on the compositor (web) or UI thread (native). Never on JS."
          />
          <Card
            title="Auto role inference"
            body="Score-based detection of text, image, circle, icon, rect — works on any tree of primitives."
          />
          <Card
            title="A11y by default"
            body="aria-busy, aria-live, prefers-reduced-motion handled out of the box."
          />
          <Card
            title="SSR-safe"
            body="Next.js App Router with no hydration flash. Verified under 6× CPU throttle."
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-ink-200">
        <h2 className="text-3xl font-semibold tracking-tight mb-2">Three lines.</h2>
        <p className="text-ink-500 mb-6">Wrap your component. Pass loading. That's the whole API.</p>
        <CodeBlock
          code={`import { AutoSkeleton } from 'skeleton-auto';

<AutoSkeleton loading={isLoading}>
  <UserCard user={user} />
</AutoSkeleton>`}
        />
      </section>
    </div>
  );
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="p-5 rounded-xl border border-ink-200 bg-white">
      <div className="font-semibold mb-1">{title}</div>
      <div className="text-sm text-ink-500 leading-relaxed">{body}</div>
    </div>
  );
}
