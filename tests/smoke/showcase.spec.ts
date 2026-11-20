import { expect, test, type Locator, type Page } from '@playwright/test';

async function guardRealChat(page: Page) {
  const requests: string[] = [];
  await page.route(
    (url) => url.pathname.startsWith('/cloudchat/') || /^\/deepseek_chat\/?$/.test(url.pathname),
    (route) => {
      requests.push(new URL(route.request().url()).pathname);
      return route.abort();
    }
  );
  return requests;
}

async function expectStep(showcase: Locator, step: number) {
  await expect(showcase).toHaveAttribute('data-step', String(step));
  await expect(showcase.locator('.c-showcase-range')).toHaveValue(String(step));
  await expect(showcase.locator('.c-showcase-progress')).toContainText(
    new RegExp(`${step}\\s*/\\s*6`),
    { useInnerText: true }
  );
  const announcement = showcase.locator('[data-journey-stage-copy]');
  await expect(announcement).toHaveCSS('clip-path', 'inset(50%)');
  if (step > 0) {
    const stage = showcase.getByRole('status').locator(`[data-stage="${step}"]`);
    await expect(stage).not.toHaveAttribute('hidden', '');
    await expect(stage).toContainText(/\S/);
    await expect(showcase.locator('.c-showcase-question')).toBeVisible();
  }
}

async function expectIdle(showcase: Locator, language: 'zh' | 'en') {
  await expectStep(showcase, 0);
  await expect(showcase).toHaveAttribute('data-journey-state', 'idle');
  await expect(showcase).not.toHaveAttribute('data-journey-flow', /.+/);
  await expect(showcase.locator('.c-showcase-range')).toHaveAttribute('min', '0');
  await expect(showcase.locator('.c-showcase-range')).toHaveAttribute(
    'aria-valuetext',
    language === 'zh' ? '0/6 · 起点' : '0/6 · Start'
  );
  await expect(showcase.locator('[data-journey-primary]')).toHaveAccessibleName(
    language === 'zh' ? '发出请求' : 'Send request'
  );
  await expect(showcase.locator('.c-showcase-question')).toBeHidden();
  await expect(showcase.locator('.c-showcase-live-reply')).toBeHidden();
  await expect(showcase.locator('[data-station][aria-current="step"]')).toHaveCount(0);
}

test('one keyboard control starts, pauses, resumes and replays the journey', async ({ page }) => {
  const realChat = await guardRealChat(page);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const showcase = page.locator('#showcase');
  const play = showcase.locator('[data-journey-primary]');
  const next = showcase.locator('[data-journey-next]');
  const track = showcase.getByRole('slider', { name: '旅程轨道', exact: true });
  const firstReply = showcase.locator('[data-reply-piece="1"]');
  const secondReply = showcase.locator('[data-reply-piece="2"]');

  await expect(page.locator('.c-home-signature')).toBeVisible();
  await expect(showcase.getByRole('heading', { name: '请求旅程', exact: true })).toBeAttached();
  await expect(play).toHaveCount(1);
  await expect(play).toBeEnabled();
  await expectIdle(showcase, 'zh');
  await expect(showcase.locator('.c-showcase-zero-stop')).toHaveText('0');
  const primary = await play.elementHandle();

  await play.focus();
  await page.keyboard.press('Enter');
  await expect(play).toHaveAccessibleName('暂停');
  await expect(showcase).toHaveAttribute('data-journey-state', 'playing');
  await expectStep(showcase, 1);
  await expect(play).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(play).toHaveAccessibleName('继续');
  await expect(showcase).toHaveAttribute('data-journey-state', 'paused');
  await track.press('Home');
  await expectIdle(showcase, 'zh');
  await expect(track).toBeFocused();

  await next.press('Enter');
  await expectStep(showcase, 1);
  await expect(showcase).toHaveAttribute('data-journey-state', 'paused');
  await next.press('Enter');
  await expectStep(showcase, 2);
  await next.press('Enter');
  await expectStep(showcase, 3);
  await expect(showcase).toHaveAttribute('data-journey-flow', 'outbound');
  await expect(showcase.locator('[data-station="flask"]')).toHaveAttribute('aria-current', 'step');
  await expect(track).toHaveAttribute('aria-valuetext', /^3\s*\/\s*6/);
  await expect(firstReply).toBeHidden();
  await expect(secondReply).toBeHidden();

  await play.press('Enter');
  await expect(play).toHaveAccessibleName('暂停');
  await expectStep(showcase, 6);
  await expect(showcase).toHaveAttribute('data-journey-flow', 'return');
  await expect(showcase).toHaveAttribute('data-journey-state', 'complete');
  await expect(firstReply).toBeVisible();
  await expect(firstReply).toContainText('模型边生成，Flask 边转发。', { useInnerText: true });
  await expect(secondReply).toBeVisible();
  await expect(secondReply).toContainText('Nginx 逐段转发，浏览器把片段接成完整回答。', {
    useInnerText: true
  });
  await expect(play).toHaveAccessibleName('重玩');
  await expect(play).toBeFocused();

  await track.press('ArrowLeft');
  await expectStep(showcase, 5);
  await expect(firstReply).toBeVisible();
  await expect(secondReply).toBeHidden();
  await track.press('ArrowLeft');
  await expectStep(showcase, 4);
  await expect(showcase.locator('[data-station="model"]')).toHaveAttribute('aria-current', 'step');
  await expect(firstReply).toBeHidden();
  await track.press('ArrowRight');
  await expectStep(showcase, 5);
  const range = await track.boundingBox();
  if (!range) throw new Error('The native journey track must be visible');
  await track.click({ position: { x: range.width * 0.5, y: range.height / 2 } });
  await expectStep(showcase, 3);
  await track.press('End');
  await expectStep(showcase, 6);
  await track.press('Home');
  await expectIdle(showcase, 'zh');
  await expect(track).toBeFocused();
  await track.press('End');
  await expectStep(showcase, 6);

  await play.press('Enter');
  await expectStep(showcase, 1);
  await expect(play).toHaveAccessibleName('暂停');
  await expect(play).toBeFocused();
  expect(await play.evaluate((current, original) => current === original, primary)).toBe(true);
  expect(realChat).toEqual([]);
  expect(errors).toEqual([]);
});

async function dragJourneyThumb(page: Page, showcase: Locator, target: number) {
  const thumb = showcase.locator('.c-showcase-range-thumb');
  await thumb.scrollIntoViewIfNeeded();
  const handle = await thumb.boundingBox();
  const stop = showcase.locator(target === 0 ? '.c-showcase-zero-stop' : `[data-tick="${target}"]`);
  const marker = await stop.boundingBox();
  if (!handle || !marker) throw new Error('The journey thumb and target stop must be visible');

  const startX = handle.x + handle.width / 2;
  const endX = marker.x + marker.width / 2;
  const y = handle.y + handle.height / 2;
  const session = await page.context().newCDPSession(page);
  try {
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: startX, y }]
    });
    for (const progress of [0.35, 0.7, 1]) {
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: startX + (endX - startX) * progress, y }]
      });
    }
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } finally {
    await session.detach();
  }
}

test.describe('request journey on a touch screen', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    contextOptions: { reducedMotion: 'reduce' }
  });

  test('can seek by touch and keeps progress after language, palette and mode changes', async ({
    page
  }) => {
    const realChat = await guardRealChat(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const showcase = page.locator('#showcase');
    const play = showcase.locator('[data-journey-primary]');
    await expect(showcase.getByRole('heading', { name: '请求旅程', exact: true })).toBeAttached();
    await expect(play).toBeEnabled();
    await expectIdle(showcase, 'zh');
    await play.tap();
    await expectStep(showcase, 1);
    await expect(showcase.locator('[data-wire="1"] .c-showcase-signal')).toHaveCSS(
      'animation-name',
      'none'
    );
    await expect(play).toHaveAccessibleName('暂停');
    await play.tap();
    await expect(play).toHaveAccessibleName('继续');

    await showcase.locator('[data-tick="3"]').tap();
    await expectStep(showcase, 3);
    await expect(showcase).toHaveAttribute('data-journey-state', 'paused');

    const navbar = page.locator('astro-island[component-export="NavBarWrapper"]');
    await expect(navbar).not.toHaveAttribute('ssr', '', { timeout: 40_000 });
    await page.locator('.c-language-selector-main').tap();
    await page.getByRole('button', { name: 'English', exact: true }).tap();
    await expect(
      showcase.getByRole('heading', { name: 'Request Journey', exact: true })
    ).toBeAttached();
    await expectStep(showcase, 3);
    await expect(play).toHaveAccessibleName('Resume');

    const theme = page.locator('.c-nav-container .c-theme-toggle-main');
    await theme.tap();
    await page.locator('.c-theme-option.is-dark').tap();
    await theme.tap();
    await page.locator('.c-theme-option.is-palette-forest').tap();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('html')).toHaveAttribute('data-palette', 'forest');
    await expectStep(showcase, 3);
    await expect(play).toHaveAccessibleName('Resume');

    const track = showcase.getByRole('slider', { name: 'Journey track', exact: true });
    await expect(track).toHaveAttribute('aria-valuetext', /^3\s*\/\s*6/);
    await dragJourneyThumb(page, showcase, 6);
    await expectStep(showcase, 6);
    await expect(showcase.locator('[data-reply-piece="2"]')).toBeVisible();
    await expect(play).toHaveAccessibleName('Replay');

    await dragJourneyThumb(page, showcase, 4);
    await expectStep(showcase, 4);
    await expect(showcase.locator('[data-tick="4"]')).toHaveAttribute('aria-current', 'step');
    await expect(showcase.locator('[data-reply-piece="1"]')).toBeHidden();
    await expect(play).toHaveAccessibleName('Resume');

    await showcase.locator('[data-tick="5"]').tap();
    await expectStep(showcase, 5);
    await expect(showcase.locator('[data-reply-piece="1"]')).toBeVisible();
    await expect(showcase.locator('[data-reply-piece="2"]')).toBeHidden();
    await showcase.getByRole('button', { name: 'Step', exact: true }).tap();
    await expectStep(showcase, 6);
    await expect(showcase.getByRole('link', { name: 'Architecture notes' })).toHaveAttribute(
      'href',
      '/docs/'
    );
    await play.tap();
    await expectStep(showcase, 1);
    await showcase.locator('[data-tick="6"]').tap();
    await expectStep(showcase, 6);
    await dragJourneyThumb(page, showcase, 0);
    await expectIdle(showcase, 'en');
    expect(realChat).toEqual([]);
  });

  test('interactive controls retain 44 by 44 CSS pixel targets at 320 and 390', async ({
    page
  }) => {
    await page.goto('/#showcase-route', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#showcase-route:target')).toBeVisible();
    const showcase = page.locator('#showcase');
    await showcase.locator('[data-journey-primary]').tap();
    await expect(showcase.locator('.c-showcase-controls')).toBeVisible();
    await showcase.locator('.c-showcase-reference > summary').tap();
    for (const summary of await showcase.locator('.c-showcase-node > summary').all()) {
      await summary.tap();
    }

    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true
      );
      const controls = showcase.locator(
        'a:visible, summary:visible, button:visible, input[type="range"]:visible'
      );
      const sizes = await controls.evaluateAll((elements) =>
        elements.map((element) => {
          const { width, height } = element.getBoundingClientRect();
          return {
            label: element.getAttribute('aria-label') ?? element.textContent?.trim(),
            width,
            height
          };
        })
      );
      expect(sizes.length).toBeGreaterThanOrEqual(12);
      expect(sizes.filter((control) => control.width < 44 || control.height < 44)).toEqual([]);
    }
  });
});

test.describe('static showcase', () => {
  test.use({ javaScriptEnabled: false });

  test('cover, old anchors, nodes and sources remain usable without JavaScript', async ({
    page
  }) => {
    await page.goto('/#showcase', { waitUntil: 'domcontentloaded' });
    const showcase = page.locator('#showcase:target');
    await expect(showcase.getByRole('heading', { name: '请求旅程', exact: true })).toBeAttached();
    await expect(showcase).not.toHaveAttribute('data-step', /^[1-6]$/);
    await expect(showcase.locator('.c-showcase-range')).toHaveValue('0');
    await expect(showcase.locator('[data-journey-count]')).toHaveText('0');
    await expect(showcase.locator('.c-showcase-question')).toBeHidden();

    await page.goto('/#showcase-start', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#showcase-start:target')).toBeAttached();
    await expect(page.locator('#showcase-route')).toBeVisible();

    await page.goto('/#proof-path', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#proof-path:target')).toBeInViewport();
    await expect(page.locator('#proof-path a[href="/docs/"]')).toBeVisible();
    await expect(page.locator('.c-nav-primary-links a[href="/certifications"]')).toBeVisible();
    await expect(page.locator('.c-nav-primary-links a[href="/deepseek_chat"]')).toBeVisible();
    await expect(page.locator('#proof-path a[href="#contact"]')).toBeVisible();

    const reference = page.locator('#showcase-response');
    const stageNotes = reference.locator('.c-showcase-stage-notes');
    await expect(stageNotes).toBeHidden();
    await reference.locator('summary').first().press('Enter');
    await expect(stageNotes).toBeVisible();
    await expect(stageNotes.locator('li')).toHaveCount(6);
    const details = reference.locator('.c-showcase-node');
    await expect(details).toHaveCount(4);
    for (const node of await details.all()) {
      await node.locator('summary').press('Enter');
      await expect(node.getByRole('link')).toHaveAttribute(
        'href',
        /github\.com\/RendaZhang\/.*\/blob\/[a-f\d]{40}\//
      );
    }
    await expect(reference.getByText(/Flask 校验消息/)).toBeVisible();
  });
});
