import { expect, test, type ConsoleMessage, type Page } from '@playwright/test';

const AUTH_ME_PATH = '/cloudchat/auth/me';
const CHAT_PAGE_PATH = '/deepseek_chat/';
const THEME_STORAGE_KEY = 'preferred_theme';
const THEME_PALETTE_STORAGE_KEY = 'preferred_palette';

const blockingWarningPatterns = [
  /hydration/i,
  /mismatch/i,
  /server rendered html/i,
  /content security policy/i,
  /refused to execute/i,
  /refused to frame/i,
  /postmessage/i,
  /sentry/i
];

function attachConsoleAudit(page: Page, label: string) {
  const issues: string[] = [];

  const onConsole = (message: ConsoleMessage) => {
    const text = message.text();

    if (message.type() === 'error') {
      issues.push(`${label} console.error: ${text}`);
      return;
    }

    if (
      message.type() === 'warning' &&
      blockingWarningPatterns.some((pattern) => pattern.test(text))
    ) {
      issues.push(`${label} console.warning: ${text}`);
    }
  };

  const onPageError = (error: Error) => {
    issues.push(`${label} pageerror: ${error.message}`);
  };

  page.on('console', onConsole);
  page.on('pageerror', onPageError);

  return {
    async assertClean() {
      await page.waitForTimeout(300);
      expect(issues, `${label} should not emit blocking browser console errors`).toEqual([]);
    }
  };
}

async function settlePage(page: Page): Promise<void> {
  try {
    await page.waitForLoadState('networkidle', { timeout: 8_000 });
  } catch {
    // Some third-party static assets can keep the page busy; DOM assertions are the gate.
  }
  await page.waitForTimeout(250);
}

async function routeLoggedOutAuthProbe(page: Page): Promise<() => number> {
  let authProbeRequests = 0;

  await page.route(`**${AUTH_ME_PATH}`, async (route) => {
    authProbeRequests += 1;
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Unauthorized' })
    });
  });

  return () => authProbeRequests;
}

test('homepage loads without blocking browser console errors', async ({ page }) => {
  const authProbeCount = await routeLoggedOutAuthProbe(page);
  const audit = attachConsoleAudit(page, 'homepage');

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', /^(light|dark)$/);
  await expect(page.locator('html')).toHaveAttribute('data-palette', /^(default|aurora|forest)$/);
  await expect(page.locator('main')).toBeVisible();
  await expect(page.locator('#heroHeading')).toBeVisible();
  await expect(page.locator('.c-hero-summary')).toBeVisible();
  await expect(page.getByRole('button', { name: /Open Assistant/i })).toBeVisible();
  await expect(page.locator('.c-home-proof-path')).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const proofPathTop = document
          .querySelector('.c-home-proof-path')
          ?.getBoundingClientRect().top;
        return {
          nextSectionVisible: typeof proofPathTop === 'number' && proofPathTop < window.innerHeight,
          overflowX: document.documentElement.scrollWidth > window.innerWidth
        };
      })
    )
    .toEqual({ nextSectionVisible: true, overflowX: false });
  await settlePage(page);

  expect(authProbeCount(), 'logged-out homepage should not probe auth/me').toBe(0);
  await audit.assertClean();
});

test('homepage work links route visitors to public destinations', async ({ page }) => {
  const authProbeCount = await routeLoggedOutAuthProbe(page);
  const audit = attachConsoleAudit(page, 'homepage proof path');

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.c-hero-action-primary')).toHaveAttribute('href', '/docs');
  await expect(page.locator('.c-hero-action-secondary')).toHaveAttribute('href', '#proof-path');
  await expect(page.locator('#proof-path')).toBeVisible();
  await expect(page.locator('#proof-path a[href="/docs"]')).toBeVisible();
  await expect(page.locator('#proof-path a[href="/certifications"]')).toBeVisible();
  await expect(page.locator('#proof-path a[href="/deepseek_chat"]')).toBeVisible();
  await expect(page.locator('#proof-path a[href="#contact"]')).toBeVisible();
  await expect(page.locator('#proof-path .c-home-proof-path-link-copy em')).toHaveCount(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('.c-hero-actions')).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const primary = document.querySelector('.c-hero-action-primary')?.getBoundingClientRect();
        const proofPath = document.querySelector('#proof-path')?.getBoundingClientRect();

        return {
          primaryInViewport: primary
            ? primary.top >= 0 && primary.bottom <= window.innerHeight
            : false,
          proofPathHintVisible: proofPath ? proofPath.top < window.innerHeight : false,
          overflowX: document.documentElement.scrollWidth > window.innerWidth
        };
      })
    )
    .toEqual({ primaryInViewport: true, proofPathHintVisible: true, overflowX: false });
  await settlePage(page);

  expect(authProbeCount(), 'logged-out homepage proof path should not probe auth/me').toBe(0);
  await audit.assertClean();
});

test('/deepseek_chat/ loads without hydration mismatch signals', async ({ page }) => {
  const authProbeCount = await routeLoggedOutAuthProbe(page);
  const audit = attachConsoleAudit(page, 'deepseek_chat');

  await page.goto(CHAT_PAGE_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.c-chat-wrapper')).toBeVisible();
  await expect(page.locator('.c-message-input')).toBeEnabled();
  await expect(page.locator('.c-chat-widget-toggle')).toHaveCount(0);
  await settlePage(page);

  expect(authProbeCount(), 'logged-out chat page should not probe auth/me').toBe(0);
  await audit.assertClean();
});

test('/deepseek_chat/ preset click sends guide metadata and keeps dark answers readable', async ({
  page
}) => {
  const authProbeCount = await routeLoggedOutAuthProbe(page);
  const audit = attachConsoleAudit(page, 'deepseek_chat preset');
  let requestBody: Record<string, unknown> | null = null;

  await page.addInitScript(() => {
    window.localStorage.setItem('preferred_theme', JSON.stringify('dark'));
  });
  await page.route('**/cloudchat/deepseek_chat', async (route) => {
    requestBody = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: 'application/x-ndjson',
      body: `${JSON.stringify({ text: 'A concise public answer about PersonalWeb.' })}\n`
    });
  });

  await page.goto(CHAT_PAGE_PATH, { waitUntil: 'domcontentloaded' });
  const preset = page.getByRole('button', { name: 'Renda 在 PersonalWeb 里做了什么？' });
  await expect(preset).toBeVisible();
  await preset.click();

  await expect(page.locator('.c-user-message')).toHaveText('Renda 在 PersonalWeb 里做了什么？');
  await expect(page.locator('.c-ai-message')).toContainText(
    'A concise public answer about PersonalWeb.'
  );
  await expect(page.locator('.c-message-input')).toHaveValue('');
  await expect(page.getByLabel('用于支持此导览回答的公开页面')).toContainText(
    'PersonalWeb 构建说明'
  );
  expect(requestBody).toEqual({
    message: 'Renda 在 PersonalWeb 里做了什么？',
    guideMode: 'public_site',
    presetId: 'personalweb_proof',
    locale: 'zh'
  });

  const contrastRatios = await page.locator('.c-ai-message').evaluate((message) => {
    const container = message.closest('.c-chat-container');
    const sourceHint = message.querySelector('.c-chat-source-hint-link');
    const messageStyle = window.getComputedStyle(message);
    const containerStyle = container ? window.getComputedStyle(container) : messageStyle;
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return { answer: 0, sourceHint: 0 };

    const paint = (x: number, colors: string[]) => {
      context.clearRect(x, 0, 1, 1);
      for (const color of colors) {
        context.fillStyle = color;
        context.fillRect(x, 0, 1, 1);
      }
      return context.getImageData(x, 0, 1, 1).data;
    };
    const luminance = (pixel: Uint8ClampedArray) => {
      const channels = [pixel[0], pixel[1], pixel[2]].map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    };
    const ratio = (backgroundColors: string[], foregroundColor: string) => {
      const background = paint(0, backgroundColors);
      const foreground = paint(1, [...backgroundColors, foregroundColor]);
      const foregroundLuminance = luminance(foreground);
      const backgroundLuminance = luminance(background);

      return (
        (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
        (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
      );
    };
    const messageBackgrounds = [containerStyle.backgroundColor, messageStyle.backgroundColor];
    const sourceHintStyle = sourceHint ? window.getComputedStyle(sourceHint) : null;

    return {
      answer: ratio(messageBackgrounds, messageStyle.color),
      sourceHint: sourceHintStyle
        ? ratio([...messageBackgrounds, sourceHintStyle.backgroundColor], sourceHintStyle.color)
        : 0
    };
  });

  expect(contrastRatios.answer).toBeGreaterThanOrEqual(4.5);
  expect(contrastRatios.sourceHint).toBeGreaterThanOrEqual(4.5);
  expect(authProbeCount(), 'logged-out preset flow should not probe auth/me').toBe(0);
  await audit.assertClean();
});

test('Chat Widget opens a same-origin iframe and reaches ready UI', async ({ page }) => {
  const authProbeCount = await routeLoggedOutAuthProbe(page);
  const audit = attachConsoleAudit(page, 'chat widget');

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await settlePage(page);
  const toggle = page.getByRole('button', { name: /Open Assistant/i });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(page.getByRole('button', { name: /Close Assistant/i })).toHaveAttribute(
    'aria-expanded',
    'true'
  );

  const frameWrapper = page.locator('.c-chat-widget-frame-wrapper');
  const iframe = page.locator('iframe.c-chat-widget-iframe');
  await expect(frameWrapper).toHaveAttribute('aria-busy', 'true');
  await expect(iframe).toHaveAttribute('src', CHAT_PAGE_PATH);
  expect(new URL((await iframe.getAttribute('src')) ?? '', page.url()).origin).toBe(
    new URL(page.url()).origin
  );

  const chatFrame = page.frameLocator('iframe[title="AI Chat"]');
  await expect(chatFrame.locator('.c-chat-wrapper')).toBeVisible();
  await expect(chatFrame.locator('.c-message-input')).toBeEnabled({ timeout: 30_000 });
  await expect(frameWrapper).toHaveAttribute('aria-busy', 'false', { timeout: 30_000 });
  await expect(iframe).toHaveClass(/is-loaded/);
  await page.getByRole('button', { name: /Close Assistant/i }).click();
  await expect(frameWrapper).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Open Assistant/i })).toHaveAttribute(
    'aria-expanded',
    'false'
  );
  await settlePage(page);

  expect(authProbeCount(), 'logged-out Chat Widget path should not probe auth/me').toBe(0);
  await audit.assertClean();
});

test('theme controls keep DOM state, selected state, and storage coherent', async ({ page }) => {
  const authProbeCount = await routeLoggedOutAuthProbe(page);
  const audit = attachConsoleAudit(page, 'theme toggle');

  await page.addInitScript(
    ({ paletteStorageKey, themeStorageKey }) => {
      window.localStorage.setItem(themeStorageKey, JSON.stringify('light'));
      window.localStorage.setItem(paletteStorageKey, JSON.stringify('default'));
    },
    {
      paletteStorageKey: THEME_PALETTE_STORAGE_KEY,
      themeStorageKey: THEME_STORAGE_KEY
    }
  );

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('html')).toHaveAttribute('data-palette', 'default');

  const themeButton = page.getByRole('button', { name: /^(Theme|切换主题)$/ });
  await themeButton.click();
  await page.getByRole('button', { name: /^(Switch to Dark Mode|切换到深色模式)$/ }).click();

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect
    .poll(async () =>
      page.evaluate((storageKey) => {
        const raw = window.localStorage.getItem(storageKey);
        return raw ? (JSON.parse(raw) as unknown) : null;
      }, THEME_STORAGE_KEY)
    )
    .toBe('dark');

  await themeButton.click();
  await page.getByRole('button', { name: /^(Switch to Forest Palette|切换到森林调色板)$/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-palette', 'forest');
  await expect
    .poll(async () =>
      page.evaluate((storageKey) => {
        const raw = window.localStorage.getItem(storageKey);
        return raw ? (JSON.parse(raw) as unknown) : null;
      }, THEME_PALETTE_STORAGE_KEY)
    )
    .toBe('forest');

  await themeButton.click();
  await expect(
    page.getByRole('button', { name: /^(Switch to Dark Mode|切换到深色模式)$/ })
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(
    page.getByRole('button', { name: /^(Switch to Light Mode|切换到浅色模式)$/ })
  ).toHaveAttribute('aria-pressed', 'false');
  await expect(
    page.getByRole('button', { name: /^(Switch to Forest Palette|切换到森林调色板)$/ })
  ).toHaveAttribute('aria-pressed', 'true');
  await settlePage(page);

  expect(authProbeCount(), 'logged-out theme control path should not probe auth/me').toBe(0);
  await audit.assertClean();
});
