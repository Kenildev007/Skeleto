'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const NAV = [
  {
    title: 'Get started',
    items: [
      { href: '/docs/getting-started', label: 'Getting started' },
      { href: '/docs/installation', label: 'Installation' },
      { href: '/docs/concepts', label: 'How it works' },
    ],
  },
  {
    title: 'API',
    items: [
      { href: '/docs/api/auto-skeleton', label: '<AutoSkeleton>' },
      { href: '/docs/api/list', label: '<AutoSkeleton.List>' },
      { href: '/docs/api/use-skeleton', label: 'useSkeleton()' },
      { href: '/docs/api/provider', label: '<SkeletonProvider>' },
      { href: '/docs/api/escape-hatches', label: 'Escape hatches' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { href: '/docs/recipes', label: 'Recipes' },
      { href: '/docs/ssr', label: 'SSR & hydration' },
      { href: '/docs/accessibility', label: 'Accessibility' },
      { href: '/docs/performance', label: 'Performance' },
      { href: '/docs/migration', label: 'Migration' },
    ],
  },
  {
    title: 'Live',
    items: [
      { href: '/playground', label: 'Playground' },
      { href: '/compare', label: 'vs react-loading-skeleton' },
    ],
  },
];

export function SiteShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const isHome = path === '/';

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg tracking-tight">
            <span className="text-accent-600">Skeleto</span>
          </Link>
          <nav className="flex gap-6 text-sm items-center">
            <Link href="/docs/getting-started">Docs</Link>
            <Link href="/compare">Compare</Link>
            <Link href="/playground">Playground</Link>
            <a
              href="https://github.com/Kenildev007/Skeleto"
              className="text-ink-500 hover:text-ink-900"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {isHome ? (
        <main>{children}</main>
      ) : (
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-10">
          <aside className="min-w-0">
            <nav className="space-y-6">
              {NAV.map((section) => (
                <div key={section.title}>
                  <div className="text-xs font-semibold uppercase text-ink-500 tracking-wide mb-2">
                    {section.title}
                  </div>
                  <ul className="space-y-1">
                    {section.items.map((item) => {
                      const active = path === item.href;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={`block px-2 py-1 rounded text-sm ${
                              active
                                ? 'bg-accent-500/10 text-accent-600 font-medium'
                                : 'text-ink-700 hover:bg-ink-100'
                            }`}
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>
          <main className="prose-content min-w-0">{children}</main>
        </div>
      )}
    </div>
  );
}
