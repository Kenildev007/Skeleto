import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = [
  '/',
  '/docs/getting-started',
  '/docs/installation',
  '/docs/api/auto-skeleton',
  '/docs/api/list',
  '/docs/api/escape-hatches',
  '/docs/recipes',
  '/docs/accessibility',
  '/playground',
];

for (const url of PAGES) {
  test(`a11y: ${url} has no critical or serious violations`, async ({ page }) => {
    await page.goto(url, { waitUntil: 'networkidle' });
    // Let client-side rendering settle (esp. /playground does babel compile)
    await page.waitForTimeout(1000);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    const seriousOrCritical = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );
    if (seriousOrCritical.length > 0) {
      console.log(JSON.stringify(seriousOrCritical, null, 2));
    }
    expect(seriousOrCritical).toHaveLength(0);
  });
}
