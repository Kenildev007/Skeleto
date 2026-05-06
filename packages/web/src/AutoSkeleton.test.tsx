import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AutoSkeleton } from './AutoSkeleton';

describe('<AutoSkeleton>', () => {
  it('renders children with aria-busy when loading', () => {
    const { container } = render(
      <AutoSkeleton loading>
        <div>real content</div>
      </AutoSkeleton>,
    );
    const root = container.querySelector('.sa-root');
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute('aria-busy', 'true');
  });

  it('omits aria-busy when not loading', () => {
    const { container } = render(
      <AutoSkeleton loading={false}>
        <div>real content</div>
      </AutoSkeleton>,
    );
    const root = container.querySelector('.sa-root');
    expect(root).not.toHaveAttribute('aria-busy');
  });

  it('renders the loadingLabel for screen readers', () => {
    render(
      <AutoSkeleton loading loadingLabel="Loading Ada's profile">
        <div>x</div>
      </AutoSkeleton>,
    );
    expect(screen.getByText("Loading Ada's profile")).toBeInTheDocument();
  });

  it('applies inert to children wrapper while loading + trapFocus', () => {
    const { container } = render(
      <AutoSkeleton loading trapFocus>
        <button>focusable</button>
      </AutoSkeleton>,
    );
    const wrap = container.querySelector('.sa-children-fade');
    expect(wrap).toBeTruthy();
    expect(wrap?.hasAttribute('inert')).toBe(true);
  });

  it('renders the SSR fallback bone before measurement commits', () => {
    const { container } = render(
      <AutoSkeleton loading>
        <div>x</div>
      </AutoSkeleton>,
    );
    const layer = container.querySelector('.sa-layer');
    expect(layer).toBeTruthy();
    // Fallback bone always uses 100% width/height when nodes is empty
    const bones = layer?.querySelectorAll('.sa-bone');
    expect(bones && bones.length >= 1).toBe(true);
  });

  it('hides children visually but keeps them in the DOM while loading', () => {
    const { getByText, container } = render(
      <AutoSkeleton loading>
        <div>important text</div>
      </AutoSkeleton>,
    );
    const text = getByText('important text');
    expect(text).toBeInTheDocument();
    const wrap = container.querySelector('.sa-children-fade') as HTMLElement;
    expect(wrap.style.visibility).toBe('hidden');
  });
});
