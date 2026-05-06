const POSTS = [
  { author: 'Grace Hopper', text: 'Just shipped a new feature using Skeleto. Wild.', img: true },
  { author: 'Alan Turing', text: 'The whole point of a @kenildev007/skeleton loader is to communicate shape, not detail.', img: false },
  { author: 'Margaret Hamilton', text: 'Loaded my new feed in 12ms. Skeleton barely had time to flash.', img: true },
];

export function Feed() {
  return (
    <div className="flex flex-col gap-3">
      {POSTS.map((p, i) => (
        <div key={i} className="flex gap-3 p-4 rounded-lg bg-white border border-ink-200">
          <div className="w-10 h-10 rounded-full bg-ink-200" />
          <div className="flex-1">
            <div className="font-semibold text-sm">{p.author}</div>
            <div className="text-sm text-ink-700 mt-1">{p.text}</div>
            {p.img ? <div className="mt-3 h-32 rounded-lg bg-ink-200" /> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
