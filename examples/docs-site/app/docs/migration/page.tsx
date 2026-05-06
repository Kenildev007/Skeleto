import { CodeBlock } from '../../../components/CodeBlock';

export default function Page() {
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Migration guide</h1>
      <p className="text-ink-700 leading-relaxed">
        From hand-authored @kenildev007/skeleton libraries to <code className="bg-ink-100 px-1 rounded">@kenildev007/skeleto</code>.
      </p>

      <h2 className="text-xl font-semibold mt-8">From react-loading-@kenildev007/skeleton</h2>
      <p className="text-ink-700 mb-3">Before:</p>
      <CodeBlock
        code={`import Skeleton from 'react-loading-@kenildev007/skeleton';
import 'react-loading-@kenildev007/skeleton/dist/@kenildev007/skeleton.css';

function UserCard({ user, loading }) {
  if (loading) {
    return (
      <div className="card">
        <Skeleton circle width={64} height={64} />
        <Skeleton width={200} height={20} />
        <Skeleton width={300} height={14} count={2} />
      </div>
    );
  }
  return <RealUserCard user={user} />;
}`}
      />
      <p className="text-ink-700 mb-3">After:</p>
      <CodeBlock
        code={`import { AutoSkeleton } from '@kenildev007/skeleto';
import '@kenildev007/skeleto/styles.css';

function UserCard({ user, loading }) {
  return (
    <AutoSkeleton loading={loading}>
      <RealUserCard user={user} />
    </AutoSkeleton>
  );
}`}
      />
      <p className="text-ink-700">
        That's the whole migration. You delete the parallel @kenildev007/skeleton tree and let the library
        infer it. If a specific shape is wrong, use the
        <code className="bg-ink-100 px-1 rounded"> data-@kenildev007/skeleton-role</code> escape hatch.
      </p>

      <h2 className="text-xl font-semibold mt-8">From react-native-@kenildev007/skeleton-placeholder</h2>
      <p className="text-ink-700 mb-3">Before:</p>
      <CodeBlock
        code={`import SkeletonPlaceholder from 'react-native-@kenildev007/skeleton-placeholder';

function UserCard({ user, loading }) {
  if (loading) {
    return (
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
          <SkeletonPlaceholder.Item width={64} height={64} borderRadius={32} />
          <SkeletonPlaceholder.Item marginLeft={20}>
            <SkeletonPlaceholder.Item width={120} height={20} />
            <SkeletonPlaceholder.Item marginTop={6} width={200} height={14} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    );
  }
  return <RealUserCard user={user} />;
}`}
      />
      <p className="text-ink-700 mb-3">After:</p>
      <CodeBlock
        code={`import { AutoSkeleton } from '@kenildev007/skeleto';

function UserCard({ user, loading }) {
  return (
    <AutoSkeleton loading={loading}>
      <RealUserCard user={user} />
    </AutoSkeleton>
  );
}`}
      />

      <h2 className="text-xl font-semibold mt-8">Map of common props</h2>
      <div className="max-w-full overflow-x-auto rounded-lg border border-ink-200">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="bg-ink-100">
            <tr>
              <th className="text-left p-3">react-loading-@kenildev007/skeleton</th>
              <th className="text-left p-3">Skeleto</th>
            </tr>
          </thead>
          <tbody>
            <Row a="baseColor" b="baseColor (or via SkeletonProvider)" />
            <Row a="highlightColor" b="highlightColor" />
            <Row a="duration" b="speed (seconds)" />
            <Row a="circle" b="auto-detected; or data-@kenildev007/skeleton-role='circle'" />
            <Row a="count" b="just render N children - they're auto-measured" />
            <Row a="enableAnimation={false}" b="animation='none'" />
          </tbody>
        </table>
      </div>
    </article>
  );
}

function Row({ a, b }: { a: string; b: string }) {
  return (
    <tr className="border-t border-ink-200">
      <td className="p-3 font-mono text-xs">{a}</td>
      <td className="p-3 font-mono text-xs text-emerald-700">{b}</td>
    </tr>
  );
}
