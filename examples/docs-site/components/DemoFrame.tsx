'use client';

import { useState, type ReactNode } from 'react';
import { CodeBlock } from './CodeBlock';

export interface DemoFrameProps {
  title?: string;
  description?: string;
  code: string;
  preview: (loading: boolean) => ReactNode;
  defaultLoading?: boolean;
  controls?: ReactNode;
}

export function DemoFrame({ title, description, code, preview, defaultLoading = true, controls }: DemoFrameProps) {
  const [loading, setLoading] = useState(defaultLoading);

  return (
    <div className="my-6 rounded-2xl border border-ink-200 overflow-hidden bg-white">
      {title ? (
        <div className="px-5 py-4 border-b border-ink-200">
          <div className="font-medium">{title}</div>
          {description ? <div className="text-sm text-ink-500 mt-1">{description}</div> : null}
        </div>
      ) : null}
      <div className="p-5 bg-ink-50 flex flex-wrap items-center gap-3 border-b border-ink-200">
        <button
          onClick={() => setLoading((l) => !l)}
          className="px-3 py-1.5 rounded-md bg-accent-600 text-white text-sm font-medium hover:bg-accent-500"
        >
          {loading ? 'Show real content' : 'Show skeleton'}
        </button>
        <button
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1500);
          }}
          className="px-3 py-1.5 rounded-md border border-ink-200 bg-white text-sm hover:bg-ink-100"
        >
          Simulate fetch (1.5s)
        </button>
        {controls}
      </div>
      <div className="p-6">{preview(loading)}</div>
      <details className="border-t border-ink-200">
        <summary className="px-5 py-3 cursor-pointer text-sm text-ink-500 hover:text-ink-700">
          Show code
        </summary>
        <div className="px-5 pb-5">
          <CodeBlock code={code} />
        </div>
      </details>
    </div>
  );
}
