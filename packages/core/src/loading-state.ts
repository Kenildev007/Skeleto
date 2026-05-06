import { useEffect, useRef, useState } from 'react';

export interface LoadingStateOptions {
  loading: boolean;
  minDuration?: number;
}

export function useStableLoading({ loading, minDuration = 0 }: LoadingStateOptions): boolean {
  const [stable, setStable] = useState(loading);
  const startedAt = useRef<number | null>(loading ? Date.now() : null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (loading) {
      if (startedAt.current === null) startedAt.current = Date.now();
      if (timer.current) clearTimeout(timer.current);
      setStable(true);
      return;
    }

    const elapsed = startedAt.current ? Date.now() - startedAt.current : minDuration;
    const remaining = Math.max(0, minDuration - elapsed);

    if (remaining === 0) {
      setStable(false);
      startedAt.current = null;
    } else {
      timer.current = setTimeout(() => {
        setStable(false);
        startedAt.current = null;
      }, remaining);
    }

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [loading, minDuration]);

  return stable;
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}

export function usePrefersDark(): boolean {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return dark;
}
