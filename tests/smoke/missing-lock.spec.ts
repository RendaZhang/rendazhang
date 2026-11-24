import { expect, test, type Locator } from '@playwright/test';

const casePath = '/cases/missing-lock/';
const articleSource = 'https://blog.csdn.net/qq_40286307/article/details/148540386';

async function expectTouchTarget(control: Locator) {
  const box = await control.boundingBox();
  if (!box) throw new Error('Expected a visible case control');
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);
}

test('opens the case from writing in either homepage language', async ({ page }) => {
  const html = page.locator('html');
  const entry = page.locator(`#blog a[href="${casePath}"]:visible`);
  await page.goto('/#blog', { waitUntil: 'domcontentloaded' });
  await expect(html).toHaveAttribute('lang', /^zh(?:-|$)/);
  await expect(entry).toHaveAccessibleName(/试玩|失踪的锁/);
  await entry.press('Enter');
  await expect(page).toHaveURL(new RegExp(`${casePath}$`));
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(/失踪的锁/);

  await page.goto('/#blog', { waitUntil: 'domcontentloaded' });
  const navbar = page.locator('astro-island[component-export="NavBarWrapper"]');
  await expect(navbar).not.toHaveAttribute('ssr', '', { timeout: 40_000 });
  await page.getByRole('button', { name: 'Switch to English', exact: true }).press('Enter');
  await expect(html).toHaveAttribute('lang', /^en(?:-|$)/);
  await expect(entry).toHaveAccessibleName(/Explore|Missing Lock/i);
  await entry.press('Enter');
  await expect(page).toHaveURL(new RegExp(`${casePath}$`));
  await expect(html).toHaveAttribute('lang', /^en(?:-|$)/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(/Missing Lock/i);
});

test('keyboard inspection changes the visible relation and preserves the selected task', async ({
  page
}) => {
  await page.goto(casePath, { waitUntil: 'domcontentloaded' });
  const diagram = page.locator('[data-lock-case]');
  const note = diagram.locator('[data-lock-note]');
  const laneOne = diagram.locator('[data-lock-select="lane-1"]');
  const laneTwo = diagram.locator('[data-lock-select="lane-2"]');
  const laneOneRelation = diagram.locator('[data-lock-link="lane-1"]');
  const laneTwoRelation = diagram.locator('[data-lock-link="lane-2"]');
  const incident = diagram.locator('[data-lock-mode="incident"]');
  const recovered = diagram.locator('[data-lock-mode="recovered"]');

  await expect(diagram).toHaveAttribute('data-mode', 'incident');
  await expect(diagram).toHaveAttribute('data-selection', 'none');
  await expect(diagram.locator('[data-lock-select^="lane-"]')).toHaveCount(4);
  await expect(note).toBeEmpty();
  await expect(laneOneRelation).toHaveCSS('visibility', 'hidden');

  await expect(laneOne).toHaveAccessibleName(/\S/);
  await laneOne.focus();
  await expect(laneOne).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(diagram).toHaveAttribute('data-selection', 'lane-1');
  await expect(laneOne).toHaveAttribute('aria-pressed', 'true');
  await expect(laneOne.and(page.locator(':focus-visible'))).toHaveCount(1);
  await expect(laneOneRelation).toHaveCSS('visibility', 'visible');
  await expect(laneTwoRelation).toHaveCSS('visibility', 'hidden');
  await expect(note).toHaveRole('status');
  await expect(note).toBeVisible();
  await expect(note).toHaveText(/\S/);

  await laneTwo.press('Space');
  await expect(diagram).toHaveAttribute('data-selection', 'lane-2');
  await expect(laneOne).toHaveAttribute('aria-pressed', 'false');
  await expect(laneTwo).toHaveAttribute('aria-pressed', 'true');
  await expect(laneOneRelation).toHaveCSS('visibility', 'hidden');
  await expect(laneTwoRelation).toHaveCSS('visibility', 'visible');

  await recovered.press('Enter');
  await expect(recovered).toBeFocused();
  await expect(recovered).toHaveAttribute('aria-pressed', 'true');
  await expect(diagram).toHaveAttribute('data-mode', 'recovered');
  await expect(diagram).toHaveAttribute('data-selection', 'lane-2');
  await expect(laneTwo).toHaveAttribute('aria-pressed', 'true');

  await incident.press('Enter');
  await expect(incident).toHaveAttribute('aria-pressed', 'true');
  await expect(diagram).toHaveAttribute('data-mode', 'incident');
  await expect(diagram).toHaveAttribute('data-selection', 'lane-2');
  await expect(laneTwoRelation).toHaveCSS('visibility', 'visible');
});

test.describe('case at 390 px with reduced motion', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    colorScheme: 'dark',
    contextOptions: { reducedMotion: 'reduce' }
  });

  test('the awakened task remains selected while its position changes and returns', async ({
    page
  }) => {
    await page.goto(casePath, { waitUntil: 'domcontentloaded' });
    const diagram = page.locator('[data-lock-case]');
    const awakened = diagram.locator('[data-lock-select="awakened"]');
    const task = diagram.locator('[data-lock-task="awakened"]');
    const incident = diagram.locator('[data-lock-mode="incident"]');
    const recovered = diagram.locator('[data-lock-mode="recovered"]');
    const note = diagram.locator('[data-lock-note]');
    const lanes = diagram.locator('[data-lock-select^="lane-"]');

    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(
      true
    );
    await expect(task).toHaveAttribute('data-position', 'queue');
    await expect(lanes).toHaveCount(4);
    for (const control of [awakened, incident, recovered, ...(await lanes.all())]) {
      await expectTouchTarget(control);
    }
    await awakened.tap();
    await expect(diagram).toHaveAttribute('data-selection', 'awakened');
    await expect(awakened).toHaveAttribute('aria-pressed', 'true');
    await expect(note).toBeVisible();
    await expect(note).toHaveText(/\S/);

    await recovered.tap();
    await expect(diagram).toHaveAttribute('data-mode', 'recovered');
    await expect(diagram).toHaveAttribute('data-selection', 'awakened');
    await expect(awakened).toHaveAttribute('aria-pressed', 'true');
    await expect(task).toHaveAttribute('data-position', 'lane-1');

    await incident.tap();
    await expect(diagram).toHaveAttribute('data-mode', 'incident');
    await expect(diagram).toHaveAttribute('data-selection', 'awakened');
    await expect(awakened).toHaveAttribute('aria-pressed', 'true');
    await expect(task).toHaveAttribute('data-position', 'queue');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true
    );
  });
});

test.describe('case without scripts', () => {
  test.use({ javaScriptEnabled: false });

  test('its share URL opens the static diagram and original article link', async ({ page }) => {
    await page.goto(casePath, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(/失踪的锁/);
    const diagram = page.locator('[data-lock-case]');
    await expect(diagram).toBeVisible();
    await expect(diagram).toHaveAttribute('data-mode', 'incident');
    await expect(diagram.locator('[data-lock-task="awakened"]')).toHaveAttribute(
      'data-position',
      'queue'
    );
    const source = page.locator('[data-lock-source]');
    await expect(source).toBeVisible();
    await expect(source).toHaveRole('link');
    await expect(source).toHaveAccessibleName(/中文原文/);
    await expect(source).toHaveAttribute('href', articleSource);
  });
});
