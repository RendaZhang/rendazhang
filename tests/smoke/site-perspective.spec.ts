import { expect, test, type Locator, type Page } from '@playwright/test';

async function guardChatRequests(page: Page) {
  const writes: string[] = [];
  await page.route('**/cloudchat/**', (route) => {
    const request = route.request();
    if (request.method() === 'GET' || request.method() === 'HEAD') return route.continue();

    writes.push(request.url());
    return route.abort();
  });
  return writes;
}

async function openChat(page: Page, activate: () => Promise<void>, loadingText: string) {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const chatDocument = /\/deepseek_chat\/$/;
  await page.route(
    chatDocument,
    async (route) => {
      await gate;
      await route.continue();
    },
    { times: 1 }
  );

  try {
    await activate();
    await expect(page.getByRole('status').filter({ hasText: loadingText })).toBeVisible();
    await expect(page.locator('.c-chat-widget-frame-wrapper')).toHaveAttribute('aria-busy', 'true');
  } finally {
    release();
  }
  await expect(page.locator('.c-chat-widget-frame-wrapper')).toHaveAttribute('aria-busy', 'false');
}

async function expectStatusBesideLauncher(page: Page) {
  const card = page.locator('.c-site-perspective-chat-status');
  await expect(card).toBeInViewport({ ratio: 1 });
  const note = await card.boundingBox();
  const chat = await page.locator('#chat-widget-toggle').boundingBox();
  if (!note || !chat) throw new Error('The chat annotation and launcher must both be visible');
  const gap = chat.x - (note.x + note.width);
  expect(gap).toBeGreaterThanOrEqual(0);
  expect(gap).toBeLessThanOrEqual(32);
  expect(note.y + note.height).toBeGreaterThan(chat.y);
  expect(chat.y + chat.height).toBeGreaterThan(note.y);
}

function brandColors(page: Page) {
  return page
    .locator('.c-showcase-explore, .c-showcase-architecture, .c-chat-widget-toggle')
    .evaluateAll((elements) =>
      elements.map((element) => {
        const style = getComputedStyle(element);
        return [style.color, style.backgroundColor, style.backgroundImage, style.borderColor].join(
          ' '
        );
      })
    );
}

test('desktop keyboard can inspect brand and chat, then exit to the opener', async ({ page }) => {
  const writes = await guardChatRequests(page);
  await page.goto('/');
  const perspective = page.locator('#showcase [data-site-perspective]');
  const opener = perspective.getByRole('button', { name: '拆开这一页' });
  const brand = perspective.getByRole('button', { name: '墨与朱' });
  const chat = perspective.getByRole('button', { name: '聊天气泡', exact: true });
  const launcher = page.locator('#chat-widget-toggle');
  const status = perspective.getByRole('status');
  for (const control of [opener, launcher]) {
    await expect(control.locator('xpath=ancestor::astro-island[1]')).not.toHaveAttribute('ssr', '');
  }
  const originalColors = await brandColors(page);
  await expect(opener.locator('svg')).toBeVisible();
  await expect(opener).toHaveAttribute('aria-expanded', 'false');
  await expect(brand).toBeHidden();

  await opener.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(brand).toBeFocused();
  await page.keyboard.press('Space');
  const start = page.locator('.c-showcase-explore');
  await expect(start).toHaveCSS('outline-style', 'solid');

  await page.keyboard.press('Tab');
  await expect(perspective.getByRole('button', { name: '切换主题' })).toBeFocused();
  await page.keyboard.press('Enter');
  for (let index = 0; index < 4; index += 1) await page.keyboard.press('Tab');
  await expect(perspective.getByRole('button', { name: '银与钴蓝' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-palette', 'aurora');
  const nextColors = await brandColors(page);
  expect(nextColors).toHaveLength(3);
  nextColors.forEach((color, index) => expect(color).not.toBe(originalColors[index]));
  await expect(start).toHaveCSS('outline-style', 'solid');

  await page.keyboard.press('Tab');
  await expect(perspective.getByRole('link', { name: '查看配色源码' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(chat).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(status).toContainText('已关闭');
  await expectStatusBesideLauncher(page);
  await expect(launcher).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Tab');
  await expect(perspective.getByRole('button', { name: '定位聊天气泡' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(launcher).toBeFocused();
  await openChat(page, () => page.keyboard.press('Enter'), '加载中…');
  await expect(status).toContainText('已就绪');
  await expect(page.locator('#chat-widget-panel iframe')).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(opener).toBeFocused();
  await expect(opener).toHaveAttribute('aria-expanded', 'false');
  await expect(start).toHaveCSS('outline-style', 'none');
  await expect(launcher).toHaveAttribute('aria-expanded', 'true');
  expect(writes).toEqual([]);
});

test.describe('at 390px with touch', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  async function tapTarget(locator: Locator) {
    await expect(locator).toBeVisible();
    const box = await locator.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
    await locator.tap();
  }

  test('palette, localized state and chat reopening stay usable', async ({ page }) => {
    const writes = await guardChatRequests(page);
    await page.goto('/');
    const language = page.getByRole('button', { name: '切换语言' });
    await expect(language.locator('xpath=ancestor::astro-island[1]')).not.toHaveAttribute(
      'ssr',
      ''
    );
    await language.tap();
    await page.getByRole('button', { name: 'English' }).tap();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    const perspective = page.locator('#showcase [data-site-perspective]');
    const opener = perspective.getByRole('button', { name: 'Look inside', exact: true });
    const brand = perspective.getByRole('button', { name: 'Ink and vermilion', exact: true });
    const annotation = perspective.getByRole('button', { name: 'Chat bubble', exact: true });
    const launcher = page.locator('#chat-widget-toggle');
    const status = perspective.getByRole('status');
    for (const control of [opener, launcher]) {
      await expect(control.locator('xpath=ancestor::astro-island[1]')).not.toHaveAttribute(
        'ssr',
        ''
      );
    }
    await tapTarget(opener);
    await tapTarget(brand);
    await tapTarget(perspective.getByRole('button', { name: 'Theme' }));
    await tapTarget(perspective.getByRole('button', { name: 'Graphite And Pine' }));
    await expect(page.locator('html')).toHaveAttribute('data-palette', 'forest');
    await tapTarget(annotation);
    await expect(status).toContainText('Closed');
    await expectStatusBesideLauncher(page);
    await expect(launcher).toHaveAccessibleName('Open Assistant');

    await openChat(page, () => launcher.tap(), 'Loading…');
    await expect(status).toContainText('Ready');
    await expectStatusBesideLauncher(page);
    await expect(launcher).toHaveAccessibleName('Close Assistant');
    await launcher.tap();
    await expect(status).toContainText('Closed');
    await openChat(page, () => launcher.tap(), 'Loading…');
    await expect(status).toContainText('Ready');

    await tapTarget(perspective.getByRole('button', { name: 'Exit view' }));
    await expect(opener).toBeFocused();
    await expect(opener).toHaveAttribute('aria-expanded', 'false');
    await expect(status).toBeHidden();
    await expect(launcher).toHaveAttribute('aria-expanded', 'true');
    expect(writes).toEqual([]);
  });
});
