import { expect, test, type ConsoleMessage, type Page } from '@playwright/test';

const AUTH_ME_PATH = '/cloudchat/auth/me';
const CHAT_PAGE_PATH = '/deepseek_chat/';
const DOCS_PAGE_PATH = '/docs/';
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

async function expectDesktopNavigationFits(page: Page, expectedLinkCount: number): Promise<void> {
  await expect(page.locator('.c-nav-primary-links a')).toHaveCount(4);
  await expect(page.locator('.c-nav-primary-links a:visible')).toHaveCount(expectedLinkCount);
  await expect(page.locator('.c-nav-primary-links a[href="/"]')).toHaveCount(0);
  await expect(page.locator('.c-nav-primary-links')).toBeVisible();
  await expect(page.locator('.c-hamburger-btn')).toBeHidden();

  await expect
    .poll(() =>
      page.evaluate(() => {
        const nav = document.querySelector('.c-nav-container > nav');
        const left = document.querySelector('.c-nav-left');
        const primary = document.querySelector('.c-nav-primary-links');
        const right = document.querySelector('.c-nav-right');
        if (!nav || !left || !primary || !right) return null;

        const navRect = nav.getBoundingClientRect();
        const leftRect = left.getBoundingClientRect();
        const primaryRect = primary.getBoundingClientRect();
        const rightRect = right.getBoundingClientRect();

        return {
          desktopMediaMatches: window.matchMedia('(min-width: 64.0625rem)').matches,
          drawerExists: Boolean(document.querySelector('.c-side-menu')),
          duplicateHome: primary.querySelectorAll('a[href="/"]').length > 0,
          leftRightOverlap: leftRect.right > rightRect.left,
          primaryRightOverlap: primaryRect.right > rightRect.left,
          clipped:
            leftRect.left < navRect.left ||
            rightRect.right > navRect.right ||
            leftRect.top < navRect.top ||
            rightRect.bottom > navRect.bottom,
          overflowX: document.documentElement.scrollWidth > window.innerWidth
        };
      })
    )
    .toEqual({
      desktopMediaMatches: true,
      drawerExists: false,
      duplicateHome: false,
      leftRightOverlap: false,
      primaryRightOverlap: false,
      clipped: false,
      overflowX: false
    });
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

test('navigation and compact disclosures preserve keyboard, scroll, and stacking boundaries', async ({
  page
}) => {
  const authProbeCount = await routeLoggedOutAuthProbe(page);
  const audit = attachConsoleAudit(page, 'navigation interactions');

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.c-nav-primary-links a')).toHaveCount(4);
  await expect(page.locator('.c-nav-primary-links a:visible')).toHaveCount(3);
  await expect(page.locator('.c-nav-primary-links a[href="/"]')).toHaveCount(0);
  await expect(page.locator('.c-nav-primary-links a[href="/deepseek_chat"]')).toBeVisible();
  await expect(page.locator('.c-nav-primary-links a[href="/certifications"]')).toBeVisible();
  await expect(page.locator('.c-nav-primary-links a[href="/docs"]')).toBeVisible();
  await expect(page.locator('.c-hamburger-btn')).toBeHidden();

  const desktopThemeButton = page.getByRole('button', { name: '切换主题' });
  await desktopThemeButton.click();
  await expect(page.getByRole('button', { name: '切换到深色模式' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(desktopThemeButton).toHaveAttribute('aria-expanded', 'false');
  await expect(desktopThemeButton).toBeFocused();

  const desktopLanguageButton = page.getByRole('button', { name: '切换语言' });
  await desktopLanguageButton.click();
  await expect(page.getByRole('group', { name: '语言' })).toBeVisible();
  await expect(page.getByRole('button', { name: '中文' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(desktopLanguageButton).toHaveAttribute('aria-expanded', 'false');
  await expect(desktopLanguageButton).toBeFocused();

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('.c-nav-primary-links')).toBeHidden();
  const hamburger = page.locator('.c-hamburger-btn');
  await expect(hamburger).toBeVisible();
  await expect(page.locator('.c-side-menu-link')).toHaveCount(0);

  await page.evaluate(() => window.scrollTo(0, 0));
  await hamburger.click();
  const drawer = page.getByRole('dialog', { name: '菜单' });
  const closeButton = page.getByRole('button', { name: '关闭导航' });
  await expect(drawer).toBeVisible();
  await expect(closeButton).toBeFocused();
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
  await expect(page.locator('html')).toHaveCSS('overflow', 'hidden');
  expect(
    await drawer.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).transitionDuration)
    )
  ).toBeLessThanOrEqual(0.001);

  await page.mouse.wheel(0, 500);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

  const drawerLinks = page.locator('.c-side-menu-link');
  await page.keyboard.press('Shift+Tab');
  await expect(drawerLinks.last()).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(closeButton).toBeFocused();

  await page.locator('.c-nav-logo').evaluate((element) => (element as HTMLElement).focus());
  await expect(page.locator('.c-nav-logo')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(closeButton).toBeFocused();

  const mobileGeometry = await page.evaluate(() => {
    const drawerElement = document.querySelector('.c-side-menu');
    const overlay = document.querySelector('.c-side-menu-overlay');
    const launcher = document.querySelector('.c-chat-widget-toggle');
    const summary = document.querySelector('.c-home-proof-path-summary');
    if (!drawerElement || !overlay || !launcher || !summary) return null;

    const launcherRect = launcher.getBoundingClientRect();
    const summaryRect = summary.getBoundingClientRect();
    const hitTarget = document.elementFromPoint(
      launcherRect.left + launcherRect.width / 2,
      launcherRect.top + launcherRect.height / 2
    );

    return {
      drawerZ: Number.parseInt(getComputedStyle(drawerElement).zIndex, 10),
      overlayZ: Number.parseInt(getComputedStyle(overlay).zIndex, 10),
      chatZ: Number.parseInt(getComputedStyle(launcher).zIndex, 10),
      hitTargetClass: hitTarget?.className,
      intersects: !(
        launcherRect.right <= summaryRect.left ||
        launcherRect.left >= summaryRect.right ||
        launcherRect.bottom <= summaryRect.top ||
        launcherRect.top >= summaryRect.bottom
      ),
      overflowX: document.documentElement.scrollWidth > window.innerWidth
    };
  });

  expect(mobileGeometry).not.toBeNull();
  expect(mobileGeometry?.drawerZ).toBeGreaterThan(mobileGeometry?.chatZ ?? 0);
  expect(mobileGeometry?.overlayZ).toBeGreaterThan(mobileGeometry?.chatZ ?? 0);
  expect(String(mobileGeometry?.hitTargetClass)).toContain('c-side-menu-overlay');
  expect(mobileGeometry?.intersects).toBe(false);
  expect(mobileGeometry?.overflowX).toBe(false);

  await page.keyboard.press('Escape');
  await expect(drawer).toHaveCount(0);
  await expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  await expect(hamburger).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
  await expect.poll(() => page.evaluate(() => document.documentElement.style.overflow)).toBe('');

  await hamburger.click();
  await page.locator('.c-side-menu-overlay').click({ position: { x: 380, y: 600 } });
  await expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  await expect(hamburger).toBeFocused();

  await hamburger.click();
  await page.getByRole('button', { name: '关闭导航' }).click();
  await expect(hamburger).toHaveAttribute('aria-expanded', 'false');

  const chatToggle = page.getByRole('button', { name: /Open Assistant/i });
  await chatToggle.click();
  await expect(page.locator('.c-chat-widget-frame-wrapper')).toHaveAttribute('aria-busy', 'false', {
    timeout: 30_000
  });
  await hamburger.evaluate((element) => (element as HTMLElement).click());
  await expect(drawer).toBeVisible();

  const panelStacking = await page.evaluate(() => {
    const drawerElement = document.querySelector('.c-side-menu');
    const overlay = document.querySelector('.c-side-menu-overlay');
    const launcher = document.querySelector('.c-chat-widget-toggle');
    const panel = document.querySelector('.c-chat-widget-panel');
    if (!drawerElement || !overlay || !launcher || !panel) return null;

    const launcherRect = launcher.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const hitClassAt = (rect: DOMRect) =>
      document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)?.className;

    return {
      drawerZ: Number.parseInt(getComputedStyle(drawerElement).zIndex, 10),
      overlayZ: Number.parseInt(getComputedStyle(overlay).zIndex, 10),
      launcherZ: Number.parseInt(getComputedStyle(launcher).zIndex, 10),
      panelZ: Number.parseInt(getComputedStyle(panel).zIndex, 10),
      launcherHitClass: hitClassAt(launcherRect),
      panelHitClass: document.elementFromPoint(
        panelRect.right - 8,
        panelRect.top + panelRect.height / 2
      )?.className
    };
  });

  expect(panelStacking).not.toBeNull();
  expect(panelStacking?.drawerZ).toBeGreaterThan(panelStacking?.launcherZ ?? 0);
  expect(panelStacking?.drawerZ).toBeGreaterThan(panelStacking?.panelZ ?? 0);
  expect(panelStacking?.overlayZ).toBeGreaterThan(panelStacking?.launcherZ ?? 0);
  expect(panelStacking?.overlayZ).toBeGreaterThan(panelStacking?.panelZ ?? 0);
  expect(String(panelStacking?.launcherHitClass)).toContain('c-side-menu-overlay');
  expect(String(panelStacking?.panelHitClass)).toContain('c-side-menu-overlay');

  await page.keyboard.press('Escape');
  await expect(drawer).toHaveCount(0);
  await expect(page.locator('.c-chat-widget-panel')).toBeVisible();
  await page.getByRole('button', { name: /Close Assistant/i }).click();
  await expect(page.locator('.c-chat-widget-panel')).toHaveCount(0);

  await hamburger.click();
  await expect(drawer).toBeVisible();
  await page.setViewportSize({ width: 1025, height: 900 });
  await expect(drawer).toHaveCount(0);
  await expectDesktopNavigationFits(page, 3);
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
  await expect.poll(() => page.evaluate(() => document.documentElement.style.overflow)).toBe('');
  await page.keyboard.press('Tab');
  await expect(page.locator('.c-side-menu-link')).toHaveCount(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(hamburger).toBeVisible();
  await expect(page.locator('.c-nav-primary-links')).toBeHidden();

  const mobileLanguageButton = page.getByRole('button', { name: '切换语言' });
  await mobileLanguageButton.click();
  await page.getByRole('button', { name: 'English' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  const englishLanguageButton = page.getByRole('button', { name: 'Change language' });
  await expect(englishLanguageButton).toBeFocused();
  await englishLanguageButton.click();
  await page.keyboard.press('Escape');
  await expect(englishLanguageButton).toHaveAttribute('aria-expanded', 'false');
  await expect(englishLanguageButton).toBeFocused();

  const mobileThemeButton = page.getByRole('button', { name: 'Theme' });
  await mobileThemeButton.click();
  await page.keyboard.press('Escape');
  await expect(mobileThemeButton).toHaveAttribute('aria-expanded', 'false');
  await expect(mobileThemeButton).toBeFocused();

  await page.setViewportSize({ width: 1025, height: 900 });
  await expect(page.locator('.c-nav-logo')).toHaveAttribute('aria-label', 'Home');
  await expectDesktopNavigationFits(page, 3);
  await page.setViewportSize({ width: 1100, height: 900 });
  await expectDesktopNavigationFits(page, 3);

  await page.unroute(`**${AUTH_ME_PATH}`);
  await page.route(`**${AUTH_ME_PATH}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        user: {
          id: 7,
          uid: 'smoke-user-7',
          email: null,
          phone: null,
          display_name: 'Smoke User',
          is_active: true
        }
      })
    });
  });
  await page.evaluate(() => window.localStorage.setItem('logged_in', JSON.stringify(true)));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-logged-in', 'true');
  await expect(page.locator('.c-nav-home-logged-in')).toBeVisible();
  await expectDesktopNavigationFits(page, 4);
  await expect(page.locator('.c-nav-primary-links a[href="/profile"]')).toBeVisible();
  await page.setViewportSize({ width: 1025, height: 900 });
  await expectDesktopNavigationFits(page, 4);
  await settlePage(page);

  expect(authProbeCount(), 'logged-out navigation paths should not probe auth/me').toBe(0);
  await audit.assertClean();
});

test('/docs/ renders Mermaid diagrams after live language changes', async ({ page }) => {
  const authProbeCount = await routeLoggedOutAuthProbe(page);
  const audit = attachConsoleAudit(page, 'docs language switch');

  await page.goto(DOCS_PAGE_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.locator('#content-zh')).toBeVisible();
  await expect(
    page.locator('#content-zh .language-mermaid[data-processed="true"] svg')
  ).toHaveCount(2, { timeout: 30_000 });

  await page.getByRole('button', { name: '切换语言' }).click();
  await page.getByRole('button', { name: 'English' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('#content-en')).toBeVisible();
  await expect(
    page.locator('#content-en .language-mermaid[data-processed="true"] svg')
  ).toHaveCount(2, { timeout: 30_000 });

  await page.getByRole('button', { name: 'Change language' }).click();
  await page.getByRole('button', { name: '中文' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.locator('#content-zh')).toBeVisible();
  await expect(
    page.locator('#content-zh .language-mermaid[data-processed="true"] svg')
  ).toHaveCount(2);
  await settlePage(page);

  expect(authProbeCount(), 'logged-out docs path should not probe auth/me').toBe(0);
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
