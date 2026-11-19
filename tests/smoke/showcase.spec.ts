import { expect, test } from '@playwright/test';

test('homepage request journey loads on demand and completes without a dynamic request', async ({
  page
}) => {
  const playerScripts: string[] = [];
  const dynamicRequests: string[] = [];
  const sockets: string[] = [];
  const errors: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('ShowcasePlayer.')) playerScripts.push(request.url());
    if (['fetch', 'xhr', 'eventsource', 'ping'].includes(request.resourceType())) {
      dynamicRequests.push(request.url());
    }
  });
  page.on('websocket', (socket) => sockets.push(socket.url()));
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');
  await page.locator('.c-hero-action-secondary').click();
  await expect(page).toHaveURL(/#proof-path$/);
  await page.getByRole('link', { name: '探索 PersonalWeb' }).click();
  const showcase = page.locator('#showcase');
  const first = showcase.locator('details').first();
  await first.locator('summary').press('Space');
  await expect(first).toHaveAttribute('open', '');
  await expect(first.getByRole('link')).toHaveAttribute(
    'href',
    /\/src\/services\/chatService.ts#L48-L83$/
  );
  expect(playerScripts).toEqual([]);

  await showcase.getByRole('link', { name: '探索这个作品' }).press('Enter');
  const group = showcase.getByRole('group', { name: '模拟演示' });
  const start = group.getByRole('button', { name: '开始' });
  await expect(start).toBeEnabled();
  expect(playerScripts).toHaveLength(1);
  const status = showcase.getByRole('status');
  await expect(status).toContainText('就绪');
  await start.press('Enter');
  await group.getByRole('button', { name: '暂停' }).click();
  const paused = await status.innerText();
  await page.waitForTimeout(1200);
  await expect(status).toHaveText(paused, { useInnerText: true });
  await group.getByRole('button', { name: '单步' }).click();
  await expect(status).toContainText('2/6');
  await group.getByRole('button', { name: '继续' }).click();
  await expect(status).toContainText('完成 · 回答补全', { timeout: 8500 });
  await expect(showcase.locator('.c-showcase-reply')).toContainText('聊天由独立后端处理');
  await expect(showcase.locator('[aria-current="step"]')).toHaveCount(1);
  await expect(first).toHaveAttribute('open', '');
  await group.getByRole('button', { name: '重置' }).click();
  await expect(status).toContainText('就绪');
  await expect(showcase.locator('.c-showcase-reply')).toContainText('等待回程');
  await start.click();
  await expect(status).toContainText('1/6');
  await group.getByRole('button', { name: '重置' }).click();
  await expect(showcase.getByRole('link', { name: '打开真实 Chat' })).toHaveAttribute(
    'href',
    '/deepseek_chat'
  );
  expect(dynamicRequests).toEqual([]);
  expect(sockets).toEqual([]);
  expect(errors).toEqual([]);
});

test('narrow reduced-motion journey keeps progress across language and theme changes', async ({
  page
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('link', { name: '探索 PersonalWeb' }).click();
  const showcase = page.locator('#showcase');
  await showcase.getByRole('link', { name: '探索这个作品' }).click();
  await showcase.getByRole('button', { name: '单步' }).click();
  await showcase.getByRole('button', { name: '单步' }).click();
  await expect(showcase.getByRole('status')).toContainText('2/6');
  await page.locator('.c-language-selector-main').click();
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await expect(showcase.getByRole('status')).toHaveText('2/6 · Nginx forwards it to Flask', {
    useInnerText: true
  });
  await page.locator('.c-theme-toggle-main').click();
  await page.locator('.c-theme-option.is-dark').click();
  await page.locator('.c-theme-toggle-main').click();
  await page.locator('.c-theme-option.is-palette-forest').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveAttribute('data-palette', 'forest');
  await page.setViewportSize({ width: 320, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const step = showcase.getByRole('button', { name: 'Step', exact: true });
  for (let i = 0; i < 3; i++) await step.click();
  await expect(showcase.locator('.c-showcase-reply')).toHaveText(
    'PersonalWeb is Renda’s personal site,',
    { useInnerText: true }
  );
  await step.click();
  await expect(showcase.getByRole('status')).toContainText('Complete');
  await expect(showcase.locator('.c-showcase-reply')).toContainText('a separate backend for chat');
  await showcase.getByRole('link', { name: 'View the reply' }).click();
  await expect(page).toHaveURL(/#showcase-response$/);
});

test('mobile showcase links have touch targets of at least 44 by 44 CSS pixels', async ({
  page
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/#showcase-route');
  const showcase = page.locator('#showcase');
  for (const summary of await showcase.locator('summary').all()) await summary.click();
  const step = showcase.getByRole('button', { name: '单步' });
  for (let index = 0; index < 6; index++) await step.click();
  await expect(showcase.getByRole('link', { name: '查看回答' })).toBeVisible();

  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    const sizes = await showcase.getByRole('link').evaluateAll((links) =>
      links.map((link) => {
        const { width, height } = link.getBoundingClientRect();
        return { label: link.textContent?.trim(), width, height };
      })
    );
    expect(sizes.filter((link) => link.width < 44 || link.height < 44)).toEqual([]);
  }
});

test.describe('static showcase', () => {
  test.use({ javaScriptEnabled: false });

  test('nodes, sample and sources remain readable without JavaScript', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: '探索 PersonalWeb' }).click();
    const showcase = page.locator('#showcase');
    await expect(showcase.locator('details')).toHaveCount(4);
    for (const node of await showcase.locator('details').all()) {
      await node.locator('summary').click();
      await expect(node.getByRole('link')).toHaveAttribute(
        'href',
        /github\.com\/RendaZhang\/.*\/blob\/[a-f\d]{40}\//
      );
    }
    await expect(showcase.locator('.c-showcase-reply')).toContainText('聊天由独立后端处理');
    await expect(showcase.locator('.c-showcase-controls')).toHaveCount(0);
  });
});
