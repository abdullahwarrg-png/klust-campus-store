const { chromium } = require('playwright');
const fs = require('node:fs/promises');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const shots = root + '/docs/screenshots';
const url = process.argv[2] || 'http://localhost:8082';
const checks = [];
const key = '@klust/campus-store/v1';
async function main() {
  await fs.mkdir(shots, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 900 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const button = (name) => page.getByRole('button', { name, exact: true });
  const waitText = (text) =>
    page.getByText(text, { exact: true }).filter({ visible: true }).first().waitFor();
  const top = () =>
    page.evaluate(() => {
      document.querySelectorAll('div').forEach((el) => {
        if (el.scrollTop) el.scrollTop = 0;
      });
      document.activeElement?.blur();
    });
  const saved = () => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), key);
  await page.goto(url);
  await waitText('Campus essentials');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: shots + '/shop.png' });
  await waitText('Block 9 Foyer');
  for (const category of ['Pens', 'Caps']) {
    await button(`Filter ${category} — Coming soon`).click();
    await waitText(`${category} are coming soon`);
    assert.equal(await page.getByRole('button', { name: /^View The / }).count(), 0);
    await button('Browse available items').click();
    await waitText('12 items');
  }
  checks.push('Pens and Caps coming soon, no purchases, and available-catalog recovery');
  await button('Filter Mugs').click();
  await waitText('4 items');
  await button('Sort products').click();
  await button('Price: low to high').click();
  const cards = await page.getByRole('button', { name: /^View The / }).allTextContents();
  assert.match(cards[0], /The Daily Mug/);
  assert.match(cards[3], /The Two Tone Mug/);
  checks.push('Mug category and ascending price order');
  await page.getByRole('textbox', { name: 'Search products' }).fill('not-a-product');
  await waitText('No campus finds just yet');
  await button('Reset search and filters').click();
  await waitText('12 items');
  checks.push('Combined search filters and no-results recovery');
  await button('View The Heritage Tee, RM 49.00').click();
  await button('Add to bag  ·  RM 49.00').click();
  await waitText('Choose a size before adding this T-shirt.');
  assert.equal((await saved())?.cart?.length ?? 0, 0);
  await button('Size M').click();
  await top();
  await page.screenshot({ path: shots + '/product-details.png' });
  await button('Add to bag  ·  RM 49.00').click();
  await button('Add to bag  ·  RM 49.00').click();
  await button('Size L').click();
  await button('Add to bag  ·  RM 49.00').click();
  await button('Colour Navy').click();
  await button('Add to bag  ·  RM 49.00').click();
  await button('View cart').click();
  await waitText('RM 196.00');
  let state = await saved();
  assert.equal(state.cart.length, 3);
  assert.equal(state.cart[0].quantity, 2);
  await button('Increase quantity').first().click();
  await waitText('RM 245.00');
  await button('Decrease quantity').first().click();
  await button('Remove The Heritage Tee, Navy, L').click();
  await button('Remove The Heritage Tee, Cloud, L').click();
  await waitText('RM 98.00');
  checks.push(
    'Required size, variant merging, size/colour separation, quantity updates, removal, MYR totals',
  );
  await button('Continue shopping').click();
  await button('View The Campus Mug, RM 29.00').click();
  assert.equal(await page.getByRole('button', { name: /^Size / }).count(), 0);
  await waitText('350 ml · Ceramic');
  await button('Colour Blue').click();
  await button('Add to bag  ·  RM 29.00').click();
  await button('View cart').click();
  await waitText('RM 127.00');
  await page.reload();
  await waitText('Campus essentials');
  await page.getByRole('tab', { name: 'Cart tab' }).click();
  await waitText('RM 127.00');
  checks.push('Mug-specific controls and persisted bag after reload');
  await waitText('Pickup · Block 9 Foyer');
  await button('Continue to checkout').click();
  await waitText('Pickup · Block 9 Foyer');
  await button('Place demo order').click();
  await waitText('Enter your full name (at least 2 characters).');
  await page.getByRole('textbox', { name: 'Full name', exact: true }).fill('Aina Rahman');
  await page.getByRole('textbox', { name: 'Email address', exact: true }).fill('oops');
  await page.getByRole('textbox', { name: 'Phone number', exact: true }).fill('123');
  await button('Place demo order').click();
  await waitText('Enter a valid email address.');
  await waitText('Enter a phone number with 9–15 digits.');
  await page
    .getByRole('textbox', { name: 'Email address', exact: true })
    .fill('aina.rahman@example.com');
  await page.getByRole('textbox', { name: 'Phone number', exact: true }).fill('012 345 6789');
  await top();
  await page.screenshot({ path: shots + '/checkout.png' });
  checks.push('Required-field, email, and phone validation with correction');
  await page.evaluate((key) => {
    window.originalStorageSet = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      if (k === key) throw new Error('Simulated storage failure');
      return window.originalStorageSet.call(this, k, v);
    };
  }, key);
  await button('Place demo order').click();
  await waitText('We could not save this order. Your bag is unchanged; please try again.');
  state = await saved();
  assert.equal(state.cart.length, 2);
  assert.equal(state.orders.length, 0);
  await page.evaluate(() => {
    Storage.prototype.setItem = window.originalStorageSet;
  });
  checks.push('Failed order save preserves the bag and allows retry');
  await button('Place demo order').click({ clickCount: 2, delay: 10 });
  await waitText('Good choice, Aina.');
  await waitText('Pickup · Block 9 Foyer');
  state = await saved();
  assert.equal(state.orders.length, 1);
  assert.equal(state.cart.length, 0);
  assert.equal(state.orders[0].total, 12700);
  const orderId = state.orders[0].id;
  checks.push('Repeated submission creates one durable order and clears the bag');
  await button('View my orders').click();
  await button('View order ' + orderId).click();
  await waitText('Good choice, Aina.');
  await button('View my orders').click();
  await page.reload();
  await waitText('Campus essentials');
  await page.getByRole('tab', { name: 'Orders tab' }).click();
  await button('View order ' + orderId).waitFor();
  checks.push('Receipt, order history links, and history persistence after reload');
  await page.getByRole('tab', { name: 'Cart tab' }).click();
  await waitText('Your bag is taking a break');
  await button('Explore the collection').click();
  await page.setViewportSize({ width: 320, height: 760 });
  await waitText('Campus essentials');
  await page.screenshot({ path: root + '/docs/screenshots/small-phone-check.png' });
  await fs.unlink(root + '/docs/screenshots/small-phone-check.png');
  const overflow = await page.evaluate(() => ({
    body: document.body.scrollWidth,
    viewport: innerWidth,
    bad: [...document.querySelectorAll('button,input')]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.left >= 0 && r.right > innerWidth + 1;
      })
      .map((el) => el.getAttribute('aria-label') || el.textContent),
  }));
  console.log('SMALL SCREEN', JSON.stringify(overflow));
  assert.equal(overflow.bad.length, 0);
  checks.push('320 px layout has no horizontally clipped visible controls');
  assert.deepEqual(errors, []);
  checks.push('No browser runtime errors');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.reload();
  await waitText('Campus essentials');
  await page.keyboard.press('Tab');
  assert.ok(await page.evaluate(() => document.activeElement !== document.body));
  assert.ok(await page.getByRole('textbox', { name: 'Search products' }).isVisible());
  checks.push('Desktop layout and keyboard focus remain usable');
  checks.push('Block 9 Foyer shown on shop, bag, checkout, and receipt');
  await fs.writeFile(
    root + '/docs/verification.json',
    JSON.stringify(
      {
        viewport: '390 × 900, DPR 2; narrow check 320 × 760',
        checks,
        errors,
        order: state.orders[0],
      },
      null,
      2,
    ),
  );
  console.log(JSON.stringify({ passed: checks.length, checks, errors }, null, 2));
  await browser.close();
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
