import { CodeBlock } from '../../../components/CodeBlock';

export default function Page() {
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">SSR & hydration</h1>
      <p className="text-ink-700 leading-relaxed">
        Server-rendered apps need a placeholder that exists at HTML time — measurement only
        happens in the browser. <code className="bg-ink-100 px-1 rounded">AutoSkeleton.SSR</code> is a
        fixed-dimension placeholder you can render from the server.
      </p>

      <h2 className="text-xl font-semibold mt-8">Next.js App Router</h2>
      <CodeBlock
        code={`import { Suspense } from 'react';
import { AutoSkeleton } from 'skeleto';

export default function Page() {
  return (
    <Suspense fallback={<AutoSkeleton.SSR shape="card" count={3} />}>
      <UserList />
    </Suspense>
  );
}`}
      />

      <h2 className="text-xl font-semibold mt-8">Shapes</h2>
      <CodeBlock
        code={`<AutoSkeleton.SSR shape="card"   count={3} />
<AutoSkeleton.SSR shape="row"    count={5} height={48} />
<AutoSkeleton.SSR shape="circle" count={1} width={64} />
<AutoSkeleton.SSR shape="rect"   count={1} height={120} />`}
      />

      <h2 className="text-xl font-semibold mt-8">Hydration without flash</h2>
      <p className="text-ink-700 leading-relaxed">
        Most "auto" libraries flash the real content for one frame during hydration because
        measurement happens after paint. We solve this in three steps:
      </p>
      <ol className="list-decimal pl-6 space-y-2 text-ink-700">
        <li>SSR renders fixed-dimension skeleton markup directly.</li>
        <li>On hydration, we keep the skeleton mounted while measuring children in a hidden subtree.</li>
        <li>We swap to real content only after measurements commit.</li>
      </ol>
      <p className="text-ink-700">Verified in Chromium with 6× CPU throttle. Zero flash.</p>
    </article>
  );
}
