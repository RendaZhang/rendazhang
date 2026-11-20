import { expect, test, type Locator, type Page } from '@playwright/test';

const playerChunk = /\/RequestJourney\.[^/.]+\.js(?:\?.*)?$/;

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

async function expectFirstWireInViewport(showcase: Locator) {
  const wire = showcase.locator('.c-showcase-wire[data-wire="1"] .c-showcase-signal');
  expect(
    await wire.evaluate((element) => {
      const path = element as SVGPathElement;
      const matrix = path.getScreenCTM();
      if (!matrix) return false;
      const point = path.getPointAtLength(path.getTotalLength() / 2).matrixTransform(matrix);
      return point.x >= 0 && point.x <= innerWidth && point.y >= 0 && point.y <= innerHeight;
    })
  ).toBe(true);
}

test('a cold keyboard activation sends the request before the player code arrives', async ({
  page
}) => {
  test.setTimeout(120_000);
  const realChat = await guardRealChat(page);
  const playerRequests: string[] = [];
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  let releaseBootstrap!: () => void;
  const bootstrapGate = new Promise<void>((resolve) => {
    releaseBootstrap = resolve;
  });
  await page.route(/\/RequestJourney\.astro_astro_type_script[^/]+\.js$/, async (route) => {
    await bootstrapGate;
    await route.continue();
  });

  let releasePlayer!: () => void;
  const playerGate = new Promise<void>((resolve) => {
    releasePlayer = resolve;
  });
  await page.route(playerChunk, async (route) => {
    playerRequests.push(route.request().url());
    await playerGate;
    await route.continue();
  });

  await page.goto('/', { waitUntil: 'commit' });
  const showcase = page.locator('#showcase');
  const start = showcase.getByRole('link', { name: '发出请求' });
  const progress = showcase.locator('.c-showcase-progress');
  await expect(page.locator('.c-home-signature')).toBeInViewport();
  await expect(showcase.getByRole('heading', { name: '请求旅程' })).toBeInViewport();
  await expect(start).toBeInViewport({ ratio: 1 });
  expect(playerRequests).toEqual([]);

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: '跳到正文' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(start).toBeFocused();

  try {
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#showcase-start$/);
    await expect(showcase.locator('.c-showcase-wire[data-wire="1"]')).toHaveCSS('opacity', '1');
    await expect(progress).toBeVisible();
    expect(playerRequests).toEqual([]);
    releaseBootstrap();
    await expect(showcase).toHaveAttribute('data-step', '1');
    await expect(progress).toBeVisible();
    await expect(progress).toHaveText(/1\s*\/\s*6/);
    await expect(progress.locator('[data-stage="1"]')).toBeVisible();
    await expectFirstWireInViewport(showcase);
    await expect.poll(() => playerRequests.length).toBe(1);
    await expect(showcase.locator('.c-showcase-play')).toHaveCount(0);
  } finally {
    releaseBootstrap();
    releasePlayer();
  }

  const play = showcase.locator('.c-showcase-play');
  const step = showcase.locator('.c-showcase-next');
  const track = showcase.getByRole('slider', { name: '旅程轨道' });
  await expect(play).toHaveAccessibleName('暂停');
  await track.press('End');
  await expect(showcase).toHaveAttribute('data-step', '6');
  await expect(track).toHaveValue('6');
  await expect(track).toHaveAttribute('aria-valuetext', /^6\s*\/\s*6/);
  await expect(showcase.locator('[data-reply-piece="2"]')).toBeVisible();

  await track.press('ArrowLeft');
  await expect(showcase).toHaveAttribute('data-step', '5');
  await expect(play).toHaveAccessibleName('继续');
  await expect(showcase.locator('[data-reply-piece="1"]')).toBeVisible();
  await expect(showcase.locator('[data-reply-piece="2"]')).toBeHidden();

  await track.press('ArrowLeft');
  await expect(showcase).toHaveAttribute('data-step', '4');
  await expect(showcase.locator('[data-station="model"]')).toHaveAttribute('aria-current', 'step');
  await expect(showcase.locator('[data-reply-piece="1"]')).toBeHidden();
  await track.press('ArrowRight');
  await expect(track).toHaveValue('5');
  await expect(showcase.locator('[data-reply-piece="1"]')).toBeVisible();
  await showcase.locator('[data-tick="2"]').press('Enter');
  await expect(track).toHaveValue('2');
  await expect(showcase.locator('[data-tick="2"]')).toHaveAttribute('aria-current', 'step');
  for (const expected of ['3', '4', '5']) {
    await step.press('Enter');
    await expect(showcase).toHaveAttribute('data-step', expected);
  }
  await expect(showcase.locator('[data-reply-piece="1"]')).toBeVisible();
  await expect(showcase.locator('[data-reply-piece="2"]')).toBeHidden();
  await play.press('Enter');
  await expect(showcase).toHaveAttribute('data-step', '6');
  await expect(showcase.locator('[data-reply-piece="2"]')).toBeVisible();

  await showcase.getByRole('button', { name: '重玩' }).press('Enter');
  await expect(showcase).toHaveAttribute('data-step', '1');
  await expect(showcase.locator('[data-reply-piece="1"]')).toBeHidden();
  const architecture = showcase.getByRole('link', { name: '架构笔记' });
  await expect(architecture).toHaveAttribute('href', '/docs/');
  await architecture.press('Enter');
  await expect(page).toHaveURL(/\/docs\/$/);
  expect(realChat).toEqual([]);
  expect(errors).toEqual([]);
});

async function dragJourneyThumb(page: Page, showcase: Locator, target: number) {
  const thumb = showcase.locator('.c-showcase-range-thumb');
  await thumb.scrollIntoViewIfNeeded();
  const handle = await thumb.boundingBox();
  const tick = await showcase.locator(`[data-tick="${target}"]`).boundingBox();
  if (!handle || !tick) throw new Error('The journey thumb and target tick must be visible');

  const startX = handle.x + handle.width / 2;
  const endX = tick.x + tick.width / 2;
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
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: []
    });
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

  test('first tap sets off the request and keeps progress across language and theme changes', async ({
    page
  }) => {
    test.setTimeout(120_000);
    const realChat = await guardRealChat(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const showcase = page.locator('#showcase');
    const start = showcase.getByRole('link', { name: '发出请求' });
    await expect(page.locator('.c-home-signature')).toBeInViewport();
    await expect(showcase.getByRole('heading', { name: '请求旅程' })).toBeInViewport();
    await expect(start).toBeInViewport({ ratio: 1 });
    await expectFirstWireInViewport(showcase);
    await start.tap();
    await expect(showcase).toHaveAttribute('data-step', '1');
    await expect(showcase.locator('[data-wire="1"] .c-showcase-signal')).toHaveCSS(
      'animation-name',
      'none'
    );

    const play = showcase.locator('.c-showcase-play');
    await expect(play).toHaveAccessibleName('暂停');
    await play.tap();
    await expect(play).toHaveAccessibleName('继续');
    const pausedStep = await showcase.getAttribute('data-step');

    const navbar = page.locator('astro-island[component-export="NavBarWrapper"]');
    await expect(navbar).not.toHaveAttribute('ssr', '', { timeout: 40_000 });
    await page.locator('.c-language-selector-main').tap();
    await page.getByRole('button', { name: 'English', exact: true }).tap();
    await expect(showcase.getByRole('heading', { name: 'Request Journey' })).toBeVisible();
    await expect(showcase).toHaveAttribute('data-step', pausedStep!);

    const theme = page.locator('.c-nav-container .c-theme-toggle-main');
    await theme.tap();
    await page.locator('.c-theme-option.is-dark').tap();
    await theme.tap();
    await page.locator('.c-theme-option.is-palette-forest').tap();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('html')).toHaveAttribute('data-palette', 'forest');
    await expect(showcase).toHaveAttribute('data-step', pausedStep!);

    const track = showcase.getByRole('slider', { name: 'Journey track' });
    await expect(track).toHaveValue(pausedStep!);
    await play.tap();
    await expect(play).toHaveAccessibleName('Pause');
    await dragJourneyThumb(page, showcase, 5);
    await expect(track).toHaveValue('5');
    await expect(play).toHaveAccessibleName('Resume');

    await dragJourneyThumb(page, showcase, 6);
    await expect(track).toHaveValue('6');
    await expect(showcase.locator('[data-reply-piece="2"]')).toBeVisible();

    await dragJourneyThumb(page, showcase, 4);
    await expect(track).toHaveValue('4');
    await expect(showcase).toHaveAttribute('data-step', '4');
    await expect(showcase.locator('[data-tick="4"]')).toHaveAttribute('aria-current', 'step');
    await expect(showcase.locator('[data-reply-piece="1"]')).toBeHidden();
    await expect(play).toHaveAccessibleName('Resume');

    await showcase.locator('[data-tick="5"]').tap();
    await expect(track).toHaveValue('5');
    await expect(showcase.locator('[data-reply-piece="1"]')).toBeVisible();
    await expect(showcase.locator('[data-reply-piece="2"]')).toBeHidden();
    await showcase.getByRole('button', { name: 'Step', exact: true }).tap();
    await expect(track).toHaveValue('6');
    await expect(showcase.locator('[data-reply-piece="2"]')).toBeVisible();
    await expect(showcase.getByRole('link', { name: 'Architecture notes' })).toHaveAttribute(
      'href',
      '/docs/'
    );
    await showcase.getByRole('button', { name: 'Replay' }).tap();
    await expect(showcase).toHaveAttribute('data-step', '1');
    expect(realChat).toEqual([]);
  });
});

test('mobile journey controls retain 44 by 44 CSS pixel targets', async ({ page }) => {
  await page.goto('/#showcase-route', { waitUntil: 'domcontentloaded' });
  const showcase = page.locator('#showcase');
  await expect(page.locator('#showcase-route:target')).toBeVisible();
  await expect(showcase).not.toHaveAttribute('data-step', /^[1-6]$/);

  await showcase.getByRole('link', { name: '发出请求' }).click();
  await expect(showcase.locator('.c-showcase-controls')).toBeVisible();
  await showcase.locator('.c-showcase-reference > summary').click();
  for (const summary of await showcase.locator('.c-showcase-node > summary').all()) {
    await summary.click();
  }

  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true
    );
    const sizes = await showcase
      .locator('a:visible, summary:visible, button:visible, .c-showcase-range-thumb:visible')
      .evaluateAll((controls) =>
        controls.map((control) => {
          const { width, height } = control.getBoundingClientRect();
          return { label: control.textContent?.trim(), width, height };
        })
      );
    expect(sizes.length).toBeGreaterThanOrEqual(12);
    expect(sizes.filter((control) => control.width < 44 || control.height < 44)).toEqual([]);
  }
});

test.describe('static showcase', () => {
  test.use({ javaScriptEnabled: false });

  test('cover, old anchors, nodes and sources remain usable without JavaScript', async ({
    page
  }) => {
    await page.goto('/#showcase', { waitUntil: 'domcontentloaded' });
    const showcase = page.locator('#showcase:target');
    await expect(showcase.getByRole('heading', { name: '请求旅程' })).toBeVisible();
    await showcase.getByRole('link', { name: '发出请求' }).press('Enter');
    await expect(page.locator('#showcase-start:target')).toBeAttached();
    await expect(page.locator('#showcase-route')).toBeVisible();
    await expect(page.locator('.c-showcase-controls')).toHaveCount(0);

    await page.goto('/#proof-path');
    await expect(page.locator('#proof-path:target')).toBeInViewport();
    await expect(page.locator('#proof-path a[href="/docs/"]')).toBeVisible();
    await expect(page.locator('#proof-path a[href="/certifications/"]')).toBeVisible();
    await expect(page.locator('#proof-path a[href="/deepseek_chat/"]')).toBeVisible();
    await expect(page.locator('#proof-path a[href="#contact"]')).toBeVisible();

    const reference = page.locator('#showcase-response');
    await reference.locator('summary').first().click();
    const details = reference.locator('.c-showcase-node');
    await expect(details).toHaveCount(4);
    for (const node of await details.all()) {
      await node.locator('summary').click();
      await expect(node.getByRole('link')).toHaveAttribute(
        'href',
        /github\.com\/RendaZhang\/.*\/blob\/[a-f\d]{40}\//
      );
    }
    await expect(page.locator('#showcase-response')).toContainText('聊天由独立后端处理');
  });
});
