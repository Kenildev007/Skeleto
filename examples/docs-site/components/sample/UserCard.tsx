export function UserCard() {
  return (
    <div className="flex gap-4 p-5 rounded-xl bg-white border border-ink-200">
      <img
        src="https://i.pravatar.cc/96?u=ada"
        alt=""
        className="w-16 h-16 rounded-full object-cover"
      />
      <div className="flex-1 flex flex-col gap-2">
        <span className="text-lg font-semibold">Ada Lovelace</span>
        <span className="text-sm text-ink-500 leading-snug">
          Mathematician, writer, and arguably the first computer programmer.
          Worked with Charles Babbage on the Analytical Engine.
        </span>
        <div className="flex gap-2 mt-2">
          <button className="text-xs px-3 py-1 rounded-full bg-ink-100">Follow</button>
          <button className="text-xs px-3 py-1 rounded-full border border-ink-200">Message</button>
        </div>
      </div>
    </div>
  );
}
