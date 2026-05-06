export default function Page() {
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">How it works</h1>
      <p className="text-ink-700 leading-relaxed">
        Skeleton-auto runs at runtime — there is no build step, no fixture file, no Playwright job.
        It works in three phases:
      </p>

      <ol className="list-decimal pl-6 space-y-3 text-ink-700">
        <li>
          <strong>Render invisibly.</strong> When <code className="bg-ink-100 px-1 rounded">loading</code> becomes
          true, your real children are rendered with <code className="bg-ink-100 px-1 rounded">visibility: hidden</code> and
          <code className="bg-ink-100 px-1 rounded"> pointer-events: none</code>, so the browser still computes layout but
          paints nothing.
        </li>
        <li>
          <strong>Measure.</strong> The library walks the rendered tree (DOM on web,
          React element + ref tree on native), filters to leaf nodes, and reads their
          bounding rect. Each node is classified — text, image, circle, icon, rect — using
          a score-based role inferer.
        </li>
        <li>
          <strong>Overlay & animate.</strong> A skeleton layer is rendered above the children
          at the exact measured coordinates. Animation runs on the compositor (CSS keyframes
          on web) or the UI thread (Reanimated 3 on native) — never on JS.
        </li>
      </ol>

      <h2 className="text-xl font-semibold mt-8">Why measure at runtime?</h2>
      <p className="text-ink-700 leading-relaxed">
        Build-time approaches like Boneyard snapshot the DOM with Playwright in CI.
        That works once, but layouts drift the moment content changes. And there's no
        equivalent for React Native at all. Runtime measurement is ~1–3ms for a typical
        screen with ≤100 leaves — well below a frame budget — and stays correct as your
        UI evolves.
      </p>

      <h2 className="text-xl font-semibold mt-8">Role inference</h2>
      <p className="text-ink-700 leading-relaxed">
        Each leaf gets weighted scores across five roles. The highest score wins.
        Signals include: component type (Text vs Image vs View), aspect ratio,
        border radius, presence of text content, presence of background image,
        and an explicit
        <code className="bg-ink-100 px-1 rounded"> data-skeleton-role</code> attribute that always wins.
      </p>
      <p className="text-ink-700 leading-relaxed">
        This is extensible — new signals are just additions to one scoring table.
      </p>
    </article>
  );
}
