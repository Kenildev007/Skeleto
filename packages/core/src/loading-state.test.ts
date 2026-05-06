import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStableLoading } from './loading-state';

describe('useStableLoading', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns true when loading is true', () => {
    const { result } = renderHook(() => useStableLoading({ loading: true }));
    expect(result.current).toBe(true);
  });

  it('returns false immediately when loading=false and no minDuration', () => {
    const { result, rerender } = renderHook(
      ({ loading }: { loading: boolean }) => useStableLoading({ loading, minDuration: 0 }),
      { initialProps: { loading: true } },
    );
    expect(result.current).toBe(true);
    rerender({ loading: false });
    expect(result.current).toBe(false);
  });

  it('holds true for at least minDuration even after loading flips false', () => {
    const { result, rerender } = renderHook(
      ({ loading }: { loading: boolean }) =>
        useStableLoading({ loading, minDuration: 500 }),
      { initialProps: { loading: true } },
    );
    expect(result.current).toBe(true);

    // Quickly flip to false after only 100ms
    act(() => {
      vi.advanceTimersByTime(100);
    });
    rerender({ loading: false });

    // Should still be true because minDuration is 500
    expect(result.current).toBe(true);

    // Advance the rest of the way
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe(false);
  });
});
