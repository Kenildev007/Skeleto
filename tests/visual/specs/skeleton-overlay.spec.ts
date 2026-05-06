import { test, expect } from '@playwright/test';

test.describe('@kenildev007/skeleton overlay correctness', () => {
  test('@kenildev007/skeleton bones cover the visible UserCard leaves', async ({ page }) => {
    await page.goto('/docs/getting-started');
    // The DemoFrame here starts with loading=true. Wait for measurement.
    await page.waitForSelector('.sa-bone', { timeout: 5000 });
    // Wait for measurement to settle on realistic dims (i.e., styles + fonts loaded).
    await page.waitForFunction(
      () => {
        const root = document.querySelector('.sa-root');
        if (!root) return false;
        const bones = Array.from(root.querySelectorAll('.sa-layer .sa-bone'));
        if (bones.length < 1) return false;
        // At least one bone should be wider than 50px (real measurement, not 1x1)
        return bones.some((b) => (b as HTMLElement).getBoundingClientRect().width > 50);
      },
      { timeout: 10000 },
    );

    // Look at the first AutoSkeleton on the page
    const root = page.locator('.sa-root').first();

    const leafBoxes = await root.locator('.sa-children-fade *').evaluateAll((els) =>
      els
        .filter((e) => e.children.length === 0)
        .map((e) => {
          const r = e.getBoundingClientRect();
          return { x: r.x, y: r.y, w: r.width, h: r.height };
        })
        .filter((b) => b.w > 0 && b.h > 0),
    );
    const boneBoxes = await root.locator('.sa-layer .sa-bone').evaluateAll((els) =>
      els.map((e) => {
        const r = e.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height };
      }),
    );

    expect(leafBoxes.length).toBeGreaterThan(0);
    expect(boneBoxes.length).toBeGreaterThan(0);

    console.log('leaves:', JSON.stringify(leafBoxes.slice(0, 8)));
    console.log('bones:', JSON.stringify(boneBoxes.slice(0, 8)));

    // Each leaf should have a bone within ~5px of its bbox
    let matched = 0;
    for (const leaf of leafBoxes) {
      const found = boneBoxes.find(
        (b) =>
          Math.abs(b.x - leaf.x) < 5 &&
          Math.abs(b.y - leaf.y) < 5 &&
          Math.abs(b.w - leaf.w) < 5 &&
          Math.abs(b.h - leaf.h) < 5,
      );
      if (found) matched += 1;
    }
    const ratio = matched / leafBoxes.length;
    expect(ratio).toBeGreaterThan(0.7);
  });

  test('a11y: aria-busy and SR label present on loading wrapper', async ({ page }) => {
    await page.goto('/docs/getting-started');
    // Click the toggle to ensure loading=true
    const root = page.locator('.sa-root').first();
    await expect(root).toHaveAttribute('aria-busy', 'true');
    // Hidden SR label
    const srLabel = await page.locator('.sa-sr-only').first().textContent();
    expect(srLabel?.length).toBeGreaterThan(0);
  });

  test('inert applied to children wrapper while loading', async ({ page }) => {
    await page.goto('/docs/getting-started');
    const wrap = page.locator('.sa-children-fade').first();
    const inert = await wrap.evaluate((el) => el.hasAttribute('inert'));
    expect(inert).toBe(true);
  });
});

test.describe('snapshot: key demos', () => {
  test('home hero — bones present', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.sa-bone', { timeout: 5000 });
    const bones = await page.locator('.sa-bone').count();
    expect(bones).toBeGreaterThan(0);
  });

  test('animation gallery — all 4 animation classes present', async ({ page }) => {
    await page.goto('/docs/api/auto-@kenildev007/skeleton');
    await page.waitForSelector('.sa-bone', { timeout: 5000 });
    for (const a of ['shimmer', 'pulse', 'wave', 'none']) {
      const found = await page.locator(`.sa-bone--${a}`).count();
      expect(found, `expected at least one bone with .sa-bone--${a}`).toBeGreaterThan(0);
    }
  });
});
