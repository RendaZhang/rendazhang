import { expect, test, type Locator, type Page } from '@playwright/test';
import { DOCS_DEMO_FRAGMENTS } from '../../src/content/docsCaseStudyContent';

const docsPath = '/docs/';
const zhArchitecture = '#zh-参考架构';
const enArchitecture = '#en-reference-architecture';
const referenceDetails = 'details[data-docs-reference]';
const { zh: zhFragments, en: enFragments } = DOCS_DEMO_FRAGMENTS;
const zhStreamRecords = zhFragments.map((text) => JSON.stringify({ text }));

const nginxReadme = 'https://github.com/RendaZhang/nginx-conf/blob/master/README.md';
const flaskStream =
  'https://github.com/RendaZhang/python-cloud-chat/blob/master/docs/API.md#deepseek-多轮对话流式--post-deepseek_chat';

async function guardChat(page: Page) {
  const requests: string[] = [];
  await page.route('**/cloudchat/**', async (route) => {
    requests.push(new URL(route.request().url()).pathname);
    await route.abort();
  });
  return requests;
}

async function openNode(plate: Locator, id: string, touch = false) {
  const details = plate.locator(`details[data-docs-node="${id}"]`);
  const summary = details.locator(':scope > summary');
  if (touch) await summary.tap();
  else await summary.press('Enter');
  await expect(details).toHaveAttribute('open', '');
  if (!touch) await expect(summary).toBeFocused();
  return details;
}

function note(node: Locator, route: 'page' | 'chat') {
  return node.locator(`[data-docs-note="${route}"]`);
}

async function expectSource(panel: Locator, destination: string) {
  const source = panel.locator('a.c-docs-node-source').filter({ visible: true });
  await expect(source).toBeVisible();
  await expect(source).toHaveAccessibleName(/\S/);
  const href = await source.getAttribute('href');
  expect(decodeURIComponent(href ?? '')).toBe(destination);
  return source;
}

async function expectFragments(node: Locator, fragments: readonly string[]) {
  const demo = note(node, 'chat').locator('.c-docs-demo').filter({ visible: true });
  await expect(demo).toBeVisible();
  await expect(demo.locator('.c-docs-fragment').filter({ visible: true })).toHaveText([
    ...fragments
  ]);
  return demo;
}

function mapGeometry(plate: Locator) {
  return plate.locator('.c-docs-route-diagram').evaluate((map) => {
    const origin = map.getBoundingClientRect();
    const parts = map.querySelectorAll('[data-docs-position], .c-docs-node-connector');
    return {
      width: origin.width,
      height: origin.height,
      parts: Array.from(parts, (part) => {
        const box = part.getBoundingClientRect();
        return [box.x - origin.x, box.y - origin.y, box.width, box.height];
      })
    };
  });
}

test('homepage Docs leads to two distinct readings and the same synthetic reply at every node', async ({
  page
}) => {
  const requests = await guardChat(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const docsEntry = page.locator('.c-nav-primary-links').getByRole('link', {
    name: '文档',
    exact: true
  });
  await expect(docsEntry).toHaveAttribute('href', docsPath);
  await docsEntry.press('Enter');
  await expect(page).toHaveURL(/\/docs\/$/);

  const plate = page.locator('.c-docs-plate');
  const pageRoute = plate.getByRole('radio', { name: '打开页面', exact: true });
  const chatRoute = plate.getByRole('radio', { name: '发送问题', exact: true });
  await expect(pageRoute).toBeChecked();
  await expect(page.locator(referenceDetails)).not.toHaveAttribute('open', '');
  expect(await plate.evaluate((figure) => figure.getAnimations({ subtree: true }).length)).toBe(0);

  const staticNode = await openNode(plate, 'static');
  const staticNote = note(staticNode, 'page');
  await expect(staticNote.locator('.c-docs-demo')).toBeVisible();
  await expect(staticNote.locator('.c-docs-demo')).toContainText(/<\/?(?:html|main|p|h1)\b/i);
  await expectSource(staticNote, '#docs-built-html-zh');

  // Capture the first paint state rather than letting an assertion retry through a delay.
  await plate.locator('[data-docs-node="browser"]').evaluate((details) => {
    details.addEventListener(
      'toggle',
      () => {
        const control = details.querySelector<HTMLElement>('.c-docs-demo-control');
        if (control) control.dataset.initialOpacity = getComputedStyle(control).opacity;
      },
      { once: true }
    );
  });
  const browser = await openNode(plate, 'browser');
  await expect(staticNode).not.toHaveAttribute('open', '');
  await expect(note(browser, 'page')).toContainText('浏览器先显示 HTML 正文');
  await expect(note(browser, 'page').locator('.c-docs-demo')).toBeVisible();
  await expect(note(browser, 'chat')).toBeHidden();
  await expectSource(note(browser, 'page'), '#docs-hydration-zh');
  const sampleControl = note(browser, 'page').locator('.c-docs-demo-control');
  await expect(sampleControl).toHaveAttribute('data-initial-opacity', '1');
  await page.keyboard.press('Tab');
  await expect(sampleControl.locator('summary')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(sampleControl).toHaveAttribute('open', '');

  const nginx = await openNode(plate, 'nginx');
  await expect(note(nginx, 'page')).toContainText('发回已经构建好的 HTML 文件');
  await expect(note(nginx, 'page').locator('.c-docs-demo')).toBeVisible();
  await expect(note(nginx, 'chat')).toBeHidden();
  await expectSource(note(nginx, 'page'), nginxReadme + '#static-delivery');
  await expect(nginx.locator('a[href="/certifications/"]').filter({ visible: true })).toBeVisible();

  await pageRoute.focus();
  await page.keyboard.press('ArrowRight');
  await expect(chatRoute).toBeFocused();
  await expect(chatRoute).toBeChecked();
  await expect(nginx).toHaveAttribute('open', '');
  await expect(note(nginx, 'page')).toBeHidden();
  await expect(note(nginx, 'chat')).toContainText('响应随到随转');
  await expectSource(note(nginx, 'chat'), nginxReadme + '#chat-streaming');
  const proxy = await expectFragments(nginx, zhStreamRecords);
  await expect(proxy.locator('.c-docs-demo-transfer')).toContainText(
    'POST /cloudchat/deepseek_chat'
  );
  await expect(proxy.locator('.c-docs-demo-transfer')).toContainText('POST /deepseek_chat');
  await expect(proxy.locator('.c-docs-demo-response')).toContainText('响应 · Flask → 浏览器');
  await expect(proxy.locator('.c-docs-demo-response')).toContainText('proxy_buffering off');

  const flask = await openNode(plate, 'flask');
  await expect(note(flask, 'chat')).toContainText('带 text 字段的 JSON 行');
  await expectFragments(flask, zhStreamRecords);
  await expectSource(note(flask, 'chat'), flaskStream);
  await expect(
    flask.locator('a[href="/deepseek_chat/?preset=personalweb_proof"]').filter({ visible: true })
  ).toBeVisible();

  const model = await openNode(plate, 'model');
  await expect(note(model, 'chat')).toContainText('一边生成回答，一边返回文字片段');
  await expectFragments(model, zhFragments);
  await expectSource(note(model, 'chat'), '#docs-model-zh');

  const receiver = await openNode(plate, 'browser');
  await expect(note(receiver, 'chat')).toContainText('接到同一个回答气泡');
  await expectFragments(receiver, zhFragments);
  const append = await expectSource(note(receiver, 'chat'), '#docs-append-zh');
  await append.press('Enter');
  const appendHeading = page.locator('#docs-append-zh:target');
  await expect(appendHeading).toBeInViewport({ ratio: 1 });
  await expect(appendHeading).toBeFocused();
  const returnLink = appendHeading.locator('xpath=..').locator('a[data-docs-return]');
  await expect(returnLink).toHaveAccessibleName('回到架构图');
  await returnLink.press('Enter');
  await expect(receiver.locator(':scope > summary')).toBeFocused();
  await expect(receiver).toHaveAttribute('open', '');
  await expect(chatRoute).toBeChecked();
  expect(requests).toEqual([]);
});

test('same-origin script policy supports map selection and restores it after external Back', async ({
  page,
  baseURL
}) => {
  const requests = await guardChat(page);
  const docsUrl = new URL(docsPath, baseURL).href;
  const externalUrl = new URL(flaskStream);
  const demoDestination = new URL(externalUrl.href);
  demoDestination.hash = '';
  let docsDocuments = 0;

  await page.route(docsUrl, async (route) => {
    const request = route.request();
    if (!request.isNavigationRequest() || request.frame() !== page.mainFrame()) {
      await route.continue();
      return;
    }
    const response = await route.fetch();
    docsDocuments += 1;
    await route.fulfill({
      response,
      headers: {
        ...response.headers(),
        'cache-control': 'no-store',
        'content-security-policy': "script-src 'self'; style-src 'self' 'unsafe-inline'"
      }
    });
  });
  await page.route(demoDestination.href, (route) =>
    route.fulfill({ contentType: 'text/html', body: '<title>Streaming API reference</title>' })
  );

  const response = await page.goto(docsPath, { waitUntil: 'domcontentloaded' });
  expect(response?.headers()['content-security-policy']).toContain("script-src 'self'");
  const plate = page.locator('.c-docs-plate');
  const pageRadio = plate.getByRole('radio', { name: '打开页面', exact: true });
  const chatRadio = plate.getByRole('radio', { name: '发送问题', exact: true });
  await expect(plate).toHaveAttribute('data-docs-readout', '');
  await expect(pageRadio).toBeChecked();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  const restingMap = await mapGeometry(plate);
  expect(restingMap.height).toBeGreaterThan(0);

  const flask = await openNode(plate, 'flask');
  await expect(chatRadio).toBeChecked();
  await expect(note(flask, 'chat')).toBeVisible();
  expect(await mapGeometry(plate)).toEqual(restingMap);

  await pageRadio.press('Space');
  await expect(pageRadio).toBeChecked();
  await expect(flask).not.toHaveAttribute('open', '');
  expect(await mapGeometry(plate)).toEqual(restingMap);

  await openNode(plate, 'flask');
  const source = await expectSource(note(flask, 'chat'), flaskStream);
  await source.press('Enter');
  await expect(page).toHaveURL(externalUrl.href);
  await page.goBack({ waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(docsUrl);
  await expect.poll(() => docsDocuments).toBe(2);
  await expect(chatRadio).toBeChecked();
  await expect(flask).toHaveAttribute('open', '');
  await expect(note(flask, 'chat')).toBeVisible();
  await expect(source).toBeFocused();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  expect(await mapGeometry(plate)).toEqual(restingMap);
  expect(requests).toEqual([]);
});

test.describe('Docs at 390 px', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    colorScheme: 'dark',
    contextOptions: { reducedMotion: 'reduce' }
  });

  test('switching language keeps the selected route and model note usable by touch', async ({
    page
  }) => {
    const requests = await guardChat(page);
    await page.goto(docsPath, { waitUntil: 'domcontentloaded' });
    const navbar = page.locator('astro-island[component-export="NavBarWrapper"]');
    await expect(navbar).not.toHaveAttribute('ssr', '', { timeout: 40_000 });
    const plate = page.locator('.c-docs-plate');
    const chatRadio = plate.locator('[name="docs-route"][value="chat"]');
    const chatTarget = plate.locator('label[for="docs-route-chat"]');
    await chatTarget.tap();
    await expect(chatRadio).toBeChecked();
    await expect(plate).toHaveAttribute('data-docs-readout', '');
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    const restingMap = await mapGeometry(plate);

    const model = await openNode(plate, 'model', true);
    await expectFragments(model, zhFragments);
    expect(await mapGeometry(plate)).toEqual(restingMap);
    await expectSource(note(model, 'chat'), '#docs-model-zh');
    await page.getByRole('button', { name: 'Switch to English', exact: true }).tap();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(plate.getByRole('radio', { name: 'Send a question', exact: true })).toBeChecked();
    await expect(model).toHaveAttribute('open', '');
    await expectFragments(model, enFragments);
    const modelSource = await expectSource(note(model, 'chat'), '#docs-model-en');

    for (const control of [chatTarget, model.locator('summary'), modelSource]) {
      const box = await control.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true
    );
    expect(requests).toEqual([]);
  });
});

test('reference stays optional and retains its contents and source when diagrams fail to load', async ({
  page
}) => {
  const requests = await guardChat(page);
  const blocked: string[] = [];
  await page.route(/\/_astro\/(?:flowDiagram-|mermaid\.core\.)[^/]+\.js$/, async (route) => {
    blocked.push(route.request().url());
    await route.abort();
  });
  await page.goto(docsPath, { waitUntil: 'domcontentloaded' });

  const plate = page.locator('.c-docs-plate');
  const reference = page.locator(referenceDetails);
  const contents = reference.locator('#content-zh');
  await expect(reference).not.toHaveAttribute('open', '');
  await expect(contents).toBeHidden();
  await expect(plate).toBeVisible();
  await openNode(plate, 'static');
  await expect(plate.locator('[data-docs-node="static"] .c-docs-demo')).toBeVisible();

  const summary = reference.locator(':scope > summary');
  await expect(summary).toContainText('完整参考');
  await summary.press('Enter');
  await expect(reference).toHaveAttribute('open', '');
  await expect(contents).toBeVisible();
  await expect.poll(() => blocked.length, { timeout: 30_000 }).toBeGreaterThan(0);
  const graph = contents.locator('code.language-mermaid').first();
  await expect(graph).toBeVisible();
  await expect(graph).toContainText(/graph|flowchart/i);
  const ci = contents.getByRole('link', { name: 'CI/CD 工作流', exact: true }).first();
  await expect(ci).toBeVisible();
  await ci.press('Enter');
  await expect(page.locator('#zh-cicd-工作流:target')).toBeInViewport({ ratio: 1 });
  expect(requests).toEqual([]);
});

test('certificate fragments land in primary reading while a legacy reference fragment opens the reference', async ({
  page,
  context
}) => {
  await page.goto(docsPath + zhArchitecture, { waitUntil: 'domcontentloaded' });
  await expect(page.locator(zhArchitecture)).toHaveCount(1);
  await expect(page.locator(zhArchitecture + ':target')).toBeInViewport({ ratio: 1 });
  await expect(page.locator(referenceDetails)).not.toHaveAttribute('open', '');

  await expect(page.locator('astro-island[component-export="NavBarWrapper"]')).not.toHaveAttribute(
    'ssr',
    '',
    { timeout: 40_000 }
  );
  await page.getByRole('button', { name: 'Switch to English', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  const shared = await context.newPage();
  try {
    await shared.goto(docsPath + enArchitecture, { waitUntil: 'domcontentloaded' });
    await expect(shared.locator(enArchitecture)).toHaveCount(1);
    await expect(shared.locator(enArchitecture + ':target')).toBeInViewport({ ratio: 1 });
    await expect(shared.locator(referenceDetails)).not.toHaveAttribute('open', '');
    await shared.goto(docsPath + '#en-backend', { waitUntil: 'domcontentloaded' });
    await expect(shared.locator(referenceDetails)).toHaveAttribute('open', '');
    await expect(shared.locator('#en-backend:target')).toBeInViewport({ ratio: 1 });
  } finally {
    await shared.close();
  }
});

test.describe('Docs without scripts', () => {
  test.use({ javaScriptEnabled: false });

  test('both native routes, node notes and build-time article links remain usable', async ({
    page
  }) => {
    const requests = await guardChat(page);
    await page.goto(docsPath, { waitUntil: 'domcontentloaded' });
    const plate = page.locator('.c-docs-plate');
    const staticNode = await openNode(plate, 'static');
    const htmlSource = await expectSource(note(staticNode, 'page'), '#docs-built-html-zh');
    await htmlSource.press('Enter');
    await expect(page.locator('#docs-built-html-zh:target')).toBeInViewport({ ratio: 1 });

    const chatRoute = plate.getByRole('radio', { name: '发送问题', exact: true });
    await chatRoute.press('Space');
    await expect(chatRoute).toBeChecked();
    await expectFragments(await openNode(plate, 'model'), zhFragments);
    expect(requests).toEqual([]);
  });
});
