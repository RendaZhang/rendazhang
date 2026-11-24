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

const revealedOwner =
  /锁已释放|(?:没有|无)持有者|持有者为空|无人持(?:有|锁)|(?:no|without an?) (?:owner|holder)|lock is free/i;

async function expectWaitingLines(diagram: Locator, visibility: 'visible' | 'hidden') {
  const relations = diagram.locator('[data-lock-link^="lane-"]');
  await expect(relations).toHaveCount(4);
  for (const relation of await relations.all()) {
    await expect(relation).toHaveCSS('visibility', visibility);
  }
}

async function expectOwnerUndiscovered(diagram: Locator) {
  await expect(diagram).toHaveAttribute('data-owner', 'unknown');
  await expect(diagram.locator('[data-lock-holder]')).toBeVisible();
  await expect(diagram.getByText(revealedOwner).filter({ visible: true })).toHaveCount(0);
  await expect(diagram.locator('[data-lock-select="lock"]')).not.toHaveAccessibleName(
    revealedOwner
  );
}

test('keyboard inspection separates thread evidence from discovering the lock owner', async ({
  page
}) => {
  await page.goto(casePath, { waitUntil: 'domcontentloaded' });
  const diagram = page.locator('[data-lock-case]');
  const note = diagram.locator('[data-lock-note]');
  const holder = diagram.locator('[data-lock-holder]');
  const lock = diagram.locator('[data-lock-select="lock"]');
  const laneOne = diagram.locator('[data-lock-select="lane-1"]');
  const laneTwo = diagram.locator('[data-lock-select="lane-2"]');
  const awakened = diagram.locator('[data-lock-select="awakened"]');
  const result = diagram.locator('[data-lock-result]');
  const recovered = diagram.locator('[data-lock-mode="recovered"]');
  const incident = diagram.locator('[data-lock-mode="incident"]');

  await expect(diagram).toHaveAttribute('data-mode', 'incident');
  await expect(diagram).toHaveAttribute('data-selection', 'none');
  await expect(diagram).not.toHaveAttribute('data-thread-checked', /.*/);
  await expect(diagram).not.toHaveAttribute('data-task-checked', /.*/);
  await expect(diagram.locator('[data-lock-select^="lane-"]')).toHaveCount(4);
  await expect(note).toHaveRole('status');
  await expect(note).toBeVisible();
  await expect(note).toContainText('新请求排在队列里，队列迟迟没有向前。');
  await expect(result).toBeHidden();
  await expectOwnerUndiscovered(diagram);
  await expectWaitingLines(diagram, 'hidden');
  await expect(holder).toHaveText('持有者未知', { useInnerText: true });

  await expect(laneOne).toHaveAccessibleName(/执行位置 01.*任务 A/);
  await laneOne.focus();
  await expect(laneOne).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(diagram).toHaveAttribute('data-selection', 'lane-1');
  await expect(diagram).toHaveAttribute('data-thread-checked', /.*/);
  await expect(diagram).not.toHaveAttribute('data-task-checked', /.*/);
  await expect(laneOne).toHaveAttribute('aria-pressed', 'true');
  await expect(laneOne.and(page.locator(':focus-visible'))).toHaveCount(1);
  await expect(note).toContainText('线程快照');
  await expect(note).toContainText(/等.*锁|锁.*等待/);
  await expect(holder).toHaveText('持有者未知', { useInnerText: true });
  await expectOwnerUndiscovered(diagram);
  await expectWaitingLines(diagram, 'visible');

  await lock.press('Enter');
  await expect(lock).toBeFocused();
  await expect(lock).toHaveAttribute('aria-pressed', 'true');
  await expect(diagram).toHaveAttribute('data-selection', 'lock');
  await expect(diagram).toHaveAttribute('data-owner', 'none');
  await expect(note).toContainText('堆转储');
  await expect(holder).toHaveText('持有者为空', { useInnerText: true });
  await expectWaitingLines(diagram, 'visible');

  await laneTwo.press('Space');
  await expect(diagram).toHaveAttribute('data-selection', 'lane-2');
  await expect(diagram).toHaveAttribute('data-owner', 'none');
  await expect(laneOne).toHaveAttribute('aria-pressed', 'false');
  await expect(lock).toHaveAttribute('aria-pressed', 'false');
  await expect(laneTwo).toHaveAttribute('aria-pressed', 'true');
  await expectWaitingLines(diagram, 'visible');

  await awakened.press('Enter');
  await expect(diagram).toHaveAttribute('data-selection', 'awakened');
  await expect(diagram).toHaveAttribute('data-owner', 'none');
  await expect(diagram).toHaveAttribute('data-task-checked', /.*/);
  await expect(note).toContainText(/载体/);
  await expect(result).toBeHidden();

  await recovered.press('Enter');
  await expect(recovered).toBeFocused();
  await expect(recovered).toHaveAttribute('aria-pressed', 'true');
  await expect(diagram).toHaveAttribute('data-mode', 'recovered');
  await expect(diagram).toHaveAttribute('data-selection', 'awakened');
  await expect(diagram).toHaveAttribute('data-owner', 'none');
  await expect(result).toBeVisible();
  await expect(result).toContainText('原文报告');
  await expect(result).toContainText('压测恢复正常');

  await incident.press('Enter');
  await expect(incident).toBeFocused();
  await expect(incident).toHaveAttribute('aria-pressed', 'true');
  await expect(diagram).toHaveAttribute('data-mode', 'incident');
  await expect(diagram).toHaveAttribute('data-selection', 'awakened');
  await expect(diagram).toHaveAttribute('data-owner', 'none');
  await expect(result).toBeHidden();
});

test('the heap dump can be inspected first', async ({ page }) => {
  await page.goto(casePath, { waitUntil: 'domcontentloaded' });
  const diagram = page.locator('[data-lock-case]');
  const lock = diagram.locator('[data-lock-select="lock"]');
  await expectOwnerUndiscovered(diagram);
  await expectWaitingLines(diagram, 'hidden');

  await lock.press('Enter');
  await expect(diagram).toHaveAttribute('data-selection', 'lock');
  await expect(diagram).toHaveAttribute('data-owner', 'none');
  await expect(diagram.locator('[data-lock-note]')).toContainText('堆转储');
  await expectWaitingLines(diagram, 'visible');
});

test.describe('case at 390 px with reduced motion', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    colorScheme: 'dark',
    contextOptions: { reducedMotion: 'reduce' }
  });

  test('inspecting the signalled task first avoids spoilers and the comparison preserves clues', async ({
    page
  }) => {
    await page.goto(casePath, { waitUntil: 'domcontentloaded' });
    const html = page.locator('html');
    const navbar = page.locator('astro-island[component-export="NavBarWrapper"]');
    const diagram = page.locator('[data-lock-case]');
    const awakened = diagram.locator('[data-lock-select="awakened"]');
    const task = diagram.locator('[data-lock-task="awakened"]');
    const incident = diagram.locator('[data-lock-mode="incident"]');
    const recovered = diagram.locator('[data-lock-mode="recovered"]');
    const lock = diagram.locator('[data-lock-select="lock"]');
    const holder = diagram.locator('[data-lock-holder]');
    const note = diagram.locator('[data-lock-note]');
    const lanes = diagram.locator('[data-lock-select^="lane-"]');
    const result = diagram.locator('[data-lock-result]');

    await expect(navbar).not.toHaveAttribute('ssr', '', { timeout: 40_000 });
    await page.getByRole('button', { name: 'Switch to English', exact: true }).tap();
    await expect(html).toHaveAttribute('lang', /^en(?:-|$)/);
    await expect(note).toContainText('New requests are queued, and the queue has stopped moving.');
    await expectOwnerUndiscovered(diagram);
    await expect(holder).toHaveText('Owner unknown', { useInnerText: true });
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(
      true
    );
    await expect(task).toHaveAttribute('data-position', 'queue');
    await expect(lanes).toHaveCount(4);
    for (const control of [awakened, lock, incident, recovered, ...(await lanes.all())]) {
      await expectTouchTarget(control);
    }

    await awakened.tap();
    await expect(diagram).toHaveAttribute('data-selection', 'awakened');
    await expect(diagram).toHaveAttribute('data-thread-checked', /.*/);
    await expect(diagram).toHaveAttribute('data-task-checked', /.*/);
    await expect(awakened).toHaveAttribute('aria-pressed', 'true');
    await expect(note).toContainText('Scheduling clue');
    await expect(note).toContainText(/carrier/i);
    await expectOwnerUndiscovered(diagram);
    await expectWaitingLines(diagram, 'visible');
    await expect(result).toBeHidden();

    await lock.tap();
    await expect(diagram).toHaveAttribute('data-owner', 'none');
    await expect(note).toContainText('Heap dump');
    await expect(holder).toHaveText('No owner', { useInnerText: true });
    await awakened.tap();
    await expect(diagram).toHaveAttribute('data-selection', 'awakened');
    await expect(diagram).toHaveAttribute('data-owner', 'none');

    await page.getByRole('button', { name: '切换到中文', exact: true }).tap();
    await expect(html).toHaveAttribute('lang', /^zh(?:-|$)/);
    await expect(diagram).toHaveAttribute('data-owner', 'none');
    await expect(diagram).toHaveAttribute('data-selection', 'awakened');
    await expect(note).toContainText('调度线索');
    await expect(note).toContainText(/载体/);
    await expect(holder).toHaveText('持有者为空', { useInnerText: true });
    await expect(awakened).toHaveAttribute('aria-pressed', 'true');

    await recovered.tap();
    await expect(diagram).toHaveAttribute('data-mode', 'recovered');
    await expect(diagram).toHaveAttribute('data-selection', 'awakened');
    await expect(diagram).toHaveAttribute('data-owner', 'none');
    await expect(awakened).toHaveAttribute('aria-pressed', 'true');
    await expect(task).toHaveAttribute('data-position', 'lane-1');
    await expect(result).toBeVisible();
    await expect(result).toContainText('压测恢复正常');

    await incident.tap();
    await expect(diagram).toHaveAttribute('data-mode', 'incident');
    await expect(diagram).toHaveAttribute('data-selection', 'awakened');
    await expect(diagram).toHaveAttribute('data-owner', 'none');
    await expect(diagram).toHaveAttribute('data-thread-checked', /.*/);
    await expect(diagram).toHaveAttribute('data-task-checked', /.*/);
    await expect(awakened).toHaveAttribute('aria-pressed', 'true');
    await expect(task).toHaveAttribute('data-position', 'queue');
    await expectWaitingLines(diagram, 'visible');
    await expect(result).toBeHidden();
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
    await expect(diagram.locator('[data-lock-note]')).toContainText(/新请求排在队列/);
    await expectOwnerUndiscovered(diagram);
    const details = diagram.locator('.c-lock-details');
    await details.locator('summary').press('Enter');
    await expect(details).toHaveAttribute('open', '');
    await expectOwnerUndiscovered(diagram);
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
