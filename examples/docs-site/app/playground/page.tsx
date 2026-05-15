'use client';

import { useEffect, useMemo, useState } from 'react';
import * as React from 'react';
import { AutoSkeleton } from '@kenildev007/skeleto';
import * as Babel from '@babel/standalone';

const PRESETS: Record<string, string> = {
  'User card': `<div className="flex gap-4 p-5 rounded-xl bg-white border">
  <img src="https://i.pravatar.cc/96?u=ada" alt="" className="w-16 h-16 rounded-full" />
  <div className="flex-1 flex flex-col gap-2">
    <span className="text-lg font-semibold">Ada Lovelace</span>
    <span className="text-sm text-gray-500">
      Mathematician, writer, and arguably the first computer programmer.
    </span>
  </div>
</div>`,
  'Stat tiles': `<div className="grid grid-cols-3 gap-3">
  {[1,2,3].map(i => (
    <div key={i} className="p-4 rounded-lg bg-white border">
      <div className="text-3xl font-bold">{i*1234}</div>
      <div className="text-xs text-gray-500 mt-1">METRIC {i}</div>
    </div>
  ))}
</div>`,
  'Login form': `<form className="flex flex-col gap-3 p-5 rounded-xl bg-white border max-w-sm">
  <h3 className="font-semibold">Sign in</h3>
  <label className="text-xs text-gray-500">Email</label>
  <input className="px-3 py-2 rounded border text-sm" defaultValue="ada@example.com" readOnly />
  <label className="text-xs text-gray-500">Password</label>
  <input className="px-3 py-2 rounded border text-sm" type="password" defaultValue="hidden" readOnly />
  <button type="button" className="mt-2 px-4 py-2 rounded bg-indigo-600 text-white text-sm">Continue</button>
</form>`,
};

export default function Page() {
  const [src, setSrc] = useState(PRESETS['User card']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const Component = useMemo(() => {
    try {
      const compiled = Babel.transform(`(${src})`, { presets: ['react'] }).code ?? '';
      const fn = new Function('React', `return ${compiled}`);
      const result = fn(React);
      setError(null);
      return result;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
      return null;
    }
  }, [src]);

  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Playground</h1>
      <p className="text-ink-700 leading-relaxed">
        Paste any JSX. Toggle loading. See the skeleton. This is the fastest way to verify
        Skeleto works for <em>your</em> component before installing.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setLoading((l) => !l)}
          className="px-3 py-1.5 rounded-md bg-accent-600 text-white text-sm font-medium"
        >
          {loading ? 'Show real' : 'Show skeleton'}
        </button>
        {Object.keys(PRESETS).map((name) => (
          <button
            key={name}
            onClick={() => setSrc(PRESETS[name]!)}
            className="px-3 py-1.5 rounded-md border border-ink-200 bg-white text-sm hover:bg-ink-100"
          >
            {name}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs uppercase font-semibold text-ink-500 mb-2">JSX</div>
          <textarea
            value={src}
            onChange={(e) => setSrc(e.target.value)}
            aria-label="JSX source code editor"
            className="w-full h-96 p-3 rounded-lg border border-ink-200 font-mono text-xs bg-white"
            spellCheck={false}
          />
          {error ? (
            <div className="mt-2 text-xs text-red-600 p-2 bg-red-50 rounded border border-red-200">
              {error}
            </div>
          ) : null}
        </div>
        <div>
          <div className="text-xs uppercase font-semibold text-ink-500 mb-2">Preview</div>
          <div className="h-96 p-4 rounded-lg border border-ink-200 bg-ink-50 overflow-auto">
            {Component ? (
              <AutoSkeleton loading={loading}>{Component}</AutoSkeleton>
            ) : (
              <div className="text-sm text-ink-500">Fix the JSX to see a preview.</div>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-ink-500">
        Note: this in-browser compiler accepts JSX with React.createElement / Fragment shorthand.
        Component names referenced in your JSX must be defined globally — for the playground,
        stick to host elements (div, img, span, etc.).
      </p>
    </article>
  );
}
