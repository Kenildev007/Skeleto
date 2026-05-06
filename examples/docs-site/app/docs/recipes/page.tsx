'use client';

import { AutoSkeleton } from 'skeleton-auto';
import { CodeBlock } from '../../../components/CodeBlock';
import { DemoFrame } from '../../../components/DemoFrame';
import { UserCard } from '../../../components/sample/UserCard';
import { Feed } from '../../../components/sample/Feed';
import { LoginForm } from '../../../components/sample/LoginForm';

export default function Page() {
  return (
    <article className="space-y-10">
      <h1 className="text-3xl font-semibold tracking-tight">Recipes</h1>
      <p className="text-ink-700 leading-relaxed">
        Real-world component patterns. Each shows the source component and the auto-generated
        skeleton — same DOM, no duplication.
      </p>

      <section id="profile">
        <h2 className="text-xl font-semibold">Profile card</h2>
        <p className="text-ink-700 mb-3">
          Avatar, name, bio, action buttons. Border radius is inferred per leaf —
          the avatar becomes a circle, the buttons stay pill-shaped.
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
      </section>

      <section id="feed">
        <h2 className="text-xl font-semibold">Social feed</h2>
        <p className="text-ink-700 mb-3">
          Repeating post structure. <code className="bg-ink-100 px-1 rounded">staggerChildren</code> creates
          a wave-like reveal across rows.
        </p>
        <DemoFrame
          code={`<AutoSkeleton loading={loading} staggerChildren={60}>
  <Feed />
</AutoSkeleton>`}
          preview={(loading) => (
            <AutoSkeleton loading={loading} staggerChildren={60}>
              <Feed />
            </AutoSkeleton>
          )}
        />
      </section>

      <section id="form">
        <h2 className="text-xl font-semibold">Form</h2>
        <p className="text-ink-700 mb-3">
          Labels become text bones, inputs become rect bones, the primary button
          keeps its rounded shape.
        </p>
        <DemoFrame
          code={`<AutoSkeleton loading={loading}>
  <LoginForm />
</AutoSkeleton>`}
          preview={(loading) => (
            <AutoSkeleton loading={loading}>
              <LoginForm />
            </AutoSkeleton>
          )}
        />
      </section>

      <section id="grid">
        <h2 className="text-xl font-semibold">Image grid</h2>
        <DemoFrame
          code={`<AutoSkeleton loading={loading}>
  <ImageGrid />
</AutoSkeleton>`}
          preview={(loading) => (
            <AutoSkeleton loading={loading}>
              <ImageGrid />
            </AutoSkeleton>
          )}
        />
      </section>

      <section id="virtualized">
        <h2 className="text-xl font-semibold">Virtualized list</h2>
        <p className="text-ink-700 mb-3">
          For lists with 50+ rows, use <code className="bg-ink-100 px-1 rounded">AutoSkeleton.List</code> —
          it bypasses measurement entirely.
        </p>
        <CodeBlock
          code={`{loading ? (
  <AutoSkeleton.List count={20} estimatedItemHeight={64} gap={8} />
) : (
  <FlatList data={items} renderItem={renderRow} />
)}`}
        />
      </section>
    </article>
  );
}

function ImageGrid() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: 9 }).map((_, i) => (
        <img
          key={i}
          src={`https://picsum.photos/seed/sa-${i}/200/200`}
          alt=""
          className="w-full aspect-square object-cover rounded-lg"
        />
      ))}
    </div>
  );
}
