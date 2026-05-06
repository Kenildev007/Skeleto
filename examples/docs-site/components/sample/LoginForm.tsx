export function LoginForm() {
  return (
    <form className="flex flex-col gap-3 p-5 rounded-xl bg-white border border-ink-200 max-w-sm">
      <h3 className="font-semibold">Sign in</h3>
      <label className="text-xs text-ink-500">Email</label>
      <input className="px-3 py-2 rounded border border-ink-200 text-sm" defaultValue="ada@example.com" readOnly />
      <label className="text-xs text-ink-500">Password</label>
      <input className="px-3 py-2 rounded border border-ink-200 text-sm" type="password" defaultValue="hidden" readOnly />
      <button type="button" className="mt-2 px-4 py-2 rounded bg-accent-600 text-white text-sm">Continue</button>
    </form>
  );
}
