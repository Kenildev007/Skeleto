import { CodeBlock } from '../../../components/CodeBlock';

export default function Page() {
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Installation</h1>
      <p className="text-ink-700 leading-relaxed">
        Single npm package — same import on every platform. The right renderer is picked at
        bundle time via <code className="bg-ink-100 px-1 rounded">package.json</code> exports +
        React Native's <code className="bg-ink-100 px-1 rounded">.native.ts</code> resolver.
      </p>

      <h2 className="text-xl font-semibold mt-8">React (web)</h2>
      <CodeBlock code={`npm install @kenildev007/skeleto`} language="bash" />
      <CodeBlock code={`// once, at the root of your app
import '@kenildev007/skeleto/styles.css';`} />

      <h2 className="text-xl font-semibold mt-8">Expo (managed workflow)</h2>
      <CodeBlock code={`npx expo install @kenildev007/skeleto react-native-reanimated`} language="bash" />
      <p className="text-ink-700">
        No <code className="bg-ink-100 px-1 rounded">expo prebuild</code>. No
        <code className="bg-ink-100 px-1 rounded"> pod install</code>. Reanimated is bundled with
        Expo Go since SDK 48 — so the library works inside Expo Go too.
      </p>

      <h2 className="text-xl font-semibold mt-8">Bare React Native</h2>
      <CodeBlock code={`npm install @kenildev007/skeleto react-native-reanimated
cd ios && pod install`} language="bash" />

      <h2 className="text-xl font-semibold mt-8">Next.js</h2>
      <CodeBlock code={`// app/layout.tsx
import '@kenildev007/skeleto/styles.css';

export default function Layout({ children }) {
  return <html><body>{children}</body></html>;
}`} />

      <h2 className="text-xl font-semibold mt-8">Compatibility</h2>
      <table className="w-full text-sm border border-ink-200 rounded-lg overflow-hidden">
        <thead className="bg-ink-100">
          <tr>
            <th className="text-left p-3">Environment</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Notes</th>
          </tr>
        </thead>
        <tbody>
          <Row env="React 18+" status="Full" notes="Native Suspense interop" />
          <Row env="React Native 0.70+" status="Full" notes="Old + New Architecture" />
          <Row env="Expo SDK 50+" status="Full" notes="Dev build + Expo Go" />
          <Row env="Next.js App Router" status="Full" notes="No hydration flash" />
          <Row env="React Native Web" status="Full" notes="—" />
          <Row env="Vite / CRA / Remix" status="Full" notes="—" />
        </tbody>
      </table>
    </article>
  );
}

function Row({ env, status, notes }: { env: string; status: string; notes: string }) {
  return (
    <tr className="border-t border-ink-200">
      <td className="p-3 font-medium">{env}</td>
      <td className="p-3 text-emerald-700">{status}</td>
      <td className="p-3 text-ink-500">{notes}</td>
    </tr>
  );
}
