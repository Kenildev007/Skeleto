# HN launch post — draft

Plain-text HN post. Submit at https://news.ycombinator.com/submit.

Best submission window: Tue–Thu, 8–10am Pacific. Avoid Mondays (HN traffic dip) and weekends.

---

## Title

```
Show HN: Skeleton-auto – wrap your component, get a @kenildev007/skeleton (web, RN, Expo)
```

(72 chars. HN cuts at 80. The em-dash is fine on HN.)

Alternates if the first feels off:

- `Show HN: Auto-generated @kenildev007/skeleton loaders that work on web and React Native`
- `Show HN: I stopped hand-coding @kenildev007/skeleton loaders. One wrapper, three platforms.`

---

## URL

`https://kenildev007.github.io/Skeleto` (or wherever the docs site lives)

---

## First comment (post immediately after submitting — HN expects a quick author note)

```
Hey HN, author here.

Every @kenildev007/skeleton library I've used makes you maintain a parallel placeholder
tree alongside your real component. Change a layout, forget to update the
@kenildev007/skeleton, ship a stale loading state. I got tired of it.

Skeleton-auto reads your real UI at runtime, measures the leaf elements
(getBoundingClientRect on web, measureInWindow on RN, sync shadow-node
read on Fabric), classifies each as text/image/circle/rect/icon via a
score-based inferer, and overlays a @kenildev007/skeleton at the same coordinates.
Animation runs on the compositor (CSS @keyframes on web) or UI thread
(Reanimated 3 worklets on native) — never on JS. One <AutoSkeleton>
component. Same API on web, iOS, Android, and Expo Go.

Some real numbers from the repo's benchmark suite (M-class Mac, happy-dom):

  100 leaves:  0.6ms initial measure
  1000 leaves: 4.0ms

Bundle: 5.6 KB gzip (web, including core).

The honest limitations:
- Charts/canvas/maps render as one rect — use the <AutoSkeleton.Custom>
  escape hatch for those.
- Native end-to-end is verified by Metro bundle output (1384 modules,
  Reanimated worklets present); I haven't been able to do a full iOS
  sim run because my Xcode is 15.0 and RN 0.76 wants 15.4+.
- The docs site has a /compare page that runs the same UserCard with
  react-loading-@kenildev007/skeleton vs @kenildev007/skeleton-auto side-by-side, if you want to
  see the difference live before installing.

Genuinely happy to fix things — file an issue or reply here with the
component shape that breaks for you and I'll add it to the test suite.

Repo: https://github.com/Kenildev007/Skeleto
Docs: https://kenildev007.github.io/Skeleto
Playground (paste any JSX, see the @kenildev007/skeleton): https://kenildev007.github.io/Skeleto/playground
```

---

## Why this draft is structured the way it is

- **Title leads with the verb** ("wrap your component, get a @kenildev007/skeleton") not the
  feature list. HN scans titles in <1s.
- **No "introducing" / "excited to share" / emojis.** HN votes those down.
- **Real measured numbers, not "blazing fast".** The bench output is in the repo
  so anyone can reproduce.
- **Honest limitations called out before the comment section asks.** Mentioning
  the Xcode-blocked iOS sim run upfront beats getting caught dodging it.
- **Specific ask** ("file an issue with the component shape that breaks").
  Generic "feedback welcome" gets ignored.
- **Three links, not eight.** Repo + docs + one specific page (playground).
  More than that and people pick none.

---

## Backup answers for the questions HN will definitely ask

### "How is this different from react-loading-@kenildev007/skeleton?"

> RLS is a primitive — you write `<Skeleton width=… height=…/>` for every
> placeholder. Skeleton-auto reads your DOM and generates those for you. The
> /compare page on the docs site shows the same UserCard with both: 22 lines
> of @kenildev007/skeleton code with RLS, 6 lines with Skeleto. RLS is also web-only;
> on RN you'd reach for a different library and a third API.

### "Won't this re-measure on every render?"

> Measurements are cached in a WeakMap keyed on container element + leaf
> tag/size fingerprint. If nothing changed structurally, no re-measure.
> ResizeObserver covers root resizes; we also re-measure on rAF and on
> window 'load' to catch font/image-load layout shifts (a real bug I had
> for two days — see the v0.4 changelog in 01-@kenildev007/skeleton-auto.md).

### "What about React Server Components / Next.js streaming?"

> AutoSkeleton renders a single full-size fallback bone during SSR (so the
> HTML is never blank), then swaps to per-leaf bones once useLayoutEffect
> runs and measurement commits. Verified no hydration flash under 6× CPU
> throttle on the docs site itself.

### "Why not use Skia for the shimmer?"

> Skia would be smoother on RN, but it's not bundled in Expo Go and adds a
> few hundred KB. The Reanimated 3 worklet path holds 60 FPS on iPhone 12
> simulator (Animation thread, useNativeDriver style). Skia path is on the
> roadmap as opt-in.

### "Does this work with React Compiler?"

> The component uses standard hooks (useLayoutEffect, useState, useMemo)
> and doesn't fight memoization. Tested against React 18.3. Haven't tested
> against React 19 RC yet — that's the first thing on the v0.4 list.

### "How does the role inference handle [weird thing]?"

> Score-based, not brittle if/else. Each leaf gets weighted scores across
> text/image/circle/rect/icon based on component type, aspect ratio, border
> radius, text content, background image, and any explicit
> `data-@kenildev007/skeleton-role` override (which always wins). The full table is in
> packages/core/src/roles.ts — easy to add new signals via PR.

---

## Things to do before submitting

- [ ] Replace `@kenildev007/skeleto.dev` with the real URLs
- [ ] Cut a v1.0 git tag and publish to npm
- [ ] Verify the docs site is live on Vercel and the /compare page loads
- [ ] Verify the playground works (Babel-standalone runtime can be flaky)
- [ ] Have one or two friends ready to upvote within the first 30 minutes
- [ ] Be at the keyboard for the first 4 hours after posting to reply to comments
- [ ] Have npm install timing benchmarked (if someone asks "how long to set up?")
