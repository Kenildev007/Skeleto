'use client';

import { AutoSkeleton } from 'skeleto';
import { CodeBlock } from '../../../components/CodeBlock';
import { DemoFrame } from '../../../components/DemoFrame';
import { UserCard } from '../../../components/sample/UserCard';

export default function Page() {
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Getting started</h1>
      <p className="text-ink-700 leading-relaxed">
        Sixty seconds from <code className="bg-ink-100 px-1 rounded">npm install</code> to a
        working skeleton.
      </p>

      <h2 className="text-xl font-semibold mt-8">1. Install</h2>
      <CodeBlock code={`npm install skeleto`} language="bash" />

      <h2 className="text-xl font-semibold mt-8">2. Import the stylesheet (web only)</h2>
      <CodeBlock code={`// app/layout.tsx or _app.tsx
import 'skeleto/styles.css';`} />

      <h2 className="text-xl font-semibold mt-8">3. Wrap your component</h2>
      <CodeBlock
        code={`import { AutoSkeleton } from 'skeleto';

function UserProfile({ userId }) {
  const { data, isLoading } = useUser(userId);
  return (
    <AutoSkeleton loading={isLoading}>
      <UserCard user={data} />
    </AutoSkeleton>
  );
}`}
      />

      <h2 className="text-xl font-semibold mt-8">That's it</h2>
      <p className="text-ink-700">
        No fixtures. No CLI. No build step. Try it live below — the skeleton is generated from
        the same UserCard DOM that's used when loaded.
      </p>

      <DemoFrame
        code={`<AutoSkeleton loading={loading}>
  <UserCard />
</AutoSkeleton>`}
        preview={(loading) => (
          <AutoSkeleton loading={loading}>
            <UserCard />
          </AutoSkeleton>
        )}
      />
    </article>
  );
}
