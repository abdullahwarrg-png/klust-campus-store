const { chromium, webkit, devices } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const url = process.argv[2] || 'http://localhost:8082';

async function main() {
  const checks = [];
  for (const [name, engine] of Object.entries({ chromium, webkit })) {
    const browser = await engine.launch({ headless: true });
    try {
      for (const width of [320, 390, 430, 600]) {
        const context = await browser.newContext({
          ...devices['iPhone 13'],
          viewport: { width, height: 844 },
        });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto(url);
        await page.getByText('Products', { exact: true }).first().waitFor();
        await page.evaluate(() => document.fonts.ready);
        const assertViewport = async () => {
          const metrics = await page.evaluate(() => ({
            width: innerWidth,
            scroll: document.documentElement.scrollWidth,
            scale: visualViewport.scale,
            app: document.querySelector('[data-testid="store-app"]').getBoundingClientRect().width,
          }));
          assert.equal(metrics.width, width);
          assert.equal(metrics.scroll, width);
          assert.equal(metrics.app, width);
          assert.equal(metrics.scale, 1);
        };
        await assertViewport();
        assert.equal(
          await page
            .getByTestId('store-app')
            .evaluate((el) => getComputedStyle(el).backgroundColor),
          'rgb(14, 24, 41)',
        );
        const search = page.getByRole('textbox', { name: 'Search products' });
        assert.equal(await search.evaluate((el) => getComputedStyle(el).fontSize), '16px');
        await search.focus();
        await assertViewport();
        await search.blur();
        await page.getByRole('tab', { name: 'Cart tab' }).click();
        await page.getByText('Your bag is empty', { exact: true }).waitFor();
        if (process.env.VERIFY_OUTPUT_DIR) {
          await fs.mkdir(process.env.VERIFY_OUTPUT_DIR, { recursive: true });
          await page.screenshot({
            path: path.join(process.env.VERIFY_OUTPUT_DIR, `${name}-${width}-bag.png`),
          });
        }
        await page.getByRole('button', { name: 'Browse products', exact: true }).click();
        await page
          .getByRole('button', { name: 'View The Heritage Tee, RM 49.00', exact: true })
          .click();
        await page.getByRole('button', { name: 'Size M', exact: true }).click();
        await page.getByRole('button', { name: 'Add to bag  ·  RM 49.00', exact: true }).click();
        await page.getByRole('button', { name: 'View cart', exact: true }).click();
        await page.getByRole('button', { name: 'Continue to checkout', exact: true }).click();
        const input = page.getByRole('textbox', { name: 'Full name' });
        assert.equal(await input.evaluate((el) => getComputedStyle(el).fontSize), '16px');
        await input.focus();
        await assertViewport();
        assert.deepEqual(errors, []);
        checks.push(
          `${name}: ${width}px full-width dark layout, bag, checkout, and input focus at 1×`,
        );
        await context.close();
      }
    } finally {
      await browser.close();
    }
  }
  console.log(JSON.stringify({ passed: checks.length, checks }, null, 2));
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
