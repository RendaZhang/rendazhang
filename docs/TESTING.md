<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [测试指南](#%E6%B5%8B%E8%AF%95%E6%8C%87%E5%8D%97)
  - [简介](#%E7%AE%80%E4%BB%8B)
  - [先决条件](#%E5%85%88%E5%86%B3%E6%9D%A1%E4%BB%B6)
  - [运行测试](#%E8%BF%90%E8%A1%8C%E6%B5%8B%E8%AF%95)
  - [静态检查](#%E9%9D%99%E6%80%81%E6%A3%80%E6%9F%A5)
  - [测试用例说明](#%E6%B5%8B%E8%AF%95%E7%94%A8%E4%BE%8B%E8%AF%B4%E6%98%8E)
    - [`src/__tests__/env.test.ts`](#src__tests__envtestts)
    - [`src/__tests__/storage.test.ts`](#src__tests__storagetestts)
    - [`src/__tests__/langUtils.test.ts`](#src__tests__langutilstestts)
    - [`src/__tests__/ChatSession.test.ts`](#src__tests__chatsessiontestts)
    - [`src/__tests__/useFormValidation.test.tsx`](#src__tests__useformvalidationtesttsx)
  - [编写测试](#%E7%BC%96%E5%86%99%E6%B5%8B%E8%AF%95)
    - [示例](#%E7%A4%BA%E4%BE%8B)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 测试指南

- **作者**: 张人大 (Renda Zhang)
- **最后更新**: June 27, 2026, 22:41 (UTC+08:00)

---

## 简介

本项目使用 [Vitest](https://vitest.dev/) 作为测试框架，并辅以以下工具：

- [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)：用于编写 React 组件与 Hook 测试。
- [jsdom](https://github.com/jsdom/jsdom)：提供浏览器 API 的模拟环境。
- [@vitest/coverage-v8](https://vitest.dev/guide/coverage.html)：生成覆盖率报告。
- [Playwright](https://playwright.dev/)：运行最小浏览器 smoke，覆盖真实 Chromium console、hydration、Chat Widget iframe ready 和主题切换状态。

Phase 8 的浏览器和 hydration smoke 规划见：[前端体验平台 RFC](./FRONTEND_EXPERIENCE_PLATFORM.md)。当前最小 smoke harness 已落地为 `npm run smoke:browser`，用于在后续主题、导航、Chat Widget、iframe 或 hydration-sensitive 改动前后提供可重复浏览器验证。

如需手动安装，可执行：

```bash
npm install -D vitest @testing-library/react @vitest/coverage-v8 jsdom
```

## 先决条件

- 已安装 [Node.js](https://nodejs.org/)（推荐与 `.nvmrc` 中一致的版本）。当前项目基线使用
  Node.js 24 LTS；Astro 6 / Vite 7 的最低要求仍低于该版本。
- 在仓库根目录执行 `npm install` 安装依赖。
- 部分测试（例如 `src/__tests__/env.test.ts`）会通过 `node --import tsx` 在子进程中运行 TypeScript 文件，请确保 Node.js 版本支持该标志（建议 Node.js 20 及以上）。
- 测试默认在 [jsdom](https://github.com/jsdom/jsdom) 环境中运行，部分用例（如 `src/__tests__/storage.test.ts`）依赖它提供的 `window.localStorage`、`document.cookie` 等浏览器 API。
- 若需编写 React 组件或 Hook 测试，请确保已安装 `@testing-library/react`（见上文）。
- 首次运行浏览器 smoke 前，需要安装本机 Playwright Chromium 缓存：

  ```bash
  npx playwright install chromium
  ```

  浏览器缓存写入用户级 Playwright cache，不提交到仓库。CI 或新机器如果尚未安装浏览器，也需要先运行该命令。
- `vitest.config.ts` 使用独立的 `vitest/config` 最小配置，而不是复用 Astro 的完整
  `getViteConfig()`。这是 Astro 6 / `@astrojs/react` 5 后的测试边界：生产构建继续由
  `astro.config.ts` 管理，单元测试只需要 jsdom、React/ReactDOM 去重和 TS/TSX transform，
  避免把 Astro React integration 的客户端优化配置带入 Vitest 后触发重复 React dispatcher。
- `tests/smoke/**` 是 Playwright 专用浏览器 smoke 目录，已从 Vitest coverage 中排除；
  该目录通过 `npm run smoke:browser` 单独运行。

## 运行测试

- `npm test`：以一次性模式运行所有测试。
- `npm run test:watch`：在监听模式下运行测试，适合开发时使用。
- `npm run test:coverage`：生成测试覆盖率报告，输出至 `coverage/` 目录，可打开 `coverage/index.html` 查看详细结果。
- `npm run test:ui`：启动 Vitest 提供的 Web UI。
- `npm run smoke:browser`：先以 `SKIP_SENTRY=true` 构建静态产物，再启动 `astro preview` 并通过 Playwright Chromium 执行浏览器 smoke。当前覆盖：
  - 首页加载时无阻塞 console error。
  - `/deepseek_chat/` 页面加载时无 hydration mismatch 信号，且不会挂载全局 Chat Widget。
  - Chat Widget 打开后加载同源 `/deepseek_chat/` iframe，等待 `chat-enhancement-ready` 后隐藏 skeleton。
  - 主题 mode 切换后 `html[data-theme]`、选中态 `aria-pressed` 和 `preferred_theme` storage 保持一致。

  该 smoke 会 mock `/cloudchat/auth/me` 为最小合法登录用户，避免本地静态 preview 因没有后端而产生资源错误；它不发送真实用户信息，也不覆盖 Chat streaming、auth 表单提交或后端 API 行为。

## 静态检查

- `npm run lint`：运行 ESLint flat config，覆盖 `src`、`astro.config.ts` 和 `eslint.config.ts`。当前配置启用 TypeScript project service，以便对 Promise 使用做类型感知检查。
- Promise 必须被 `await`、带 rejection handler，或用 `void` 明确标记为有意忽略；React effect 内的异步初始化、事件回调触发的异步流程和第三方 API 调用都应显式处理。
- `target="_blank"` 链接必须保留安全的 `rel` 属性；`@ts-ignore`、`@ts-expect-error` 等 TypeScript 抑制注释必须带足够说明。
- ESLint 同时强制当前低误报的 import-boundary 子集：services、controllers、stores、utils、content、components 和 hooks 不能跨越 `docs/DIRECTORY_OWNERSHIP.md` 中已经落地的稳定所有权边界。
- 当前未引入 `eslint-plugin-react-hooks` 或 `eslint-plugin-jsx-a11y`。Hooks exhaustive deps 与更广泛的 JSX a11y 规则仍按代码评审检查，是否新增依赖留给后续切片决策。
- 影响主题、导航、Chat Widget、iframe、认证表单或 hydration 顺序的切片应把 `npm run smoke:browser` 加入验证清单。该命令是浏览器行为门禁，不替代 Vitest、Astro check、TypeScript 或 ESLint。

## 测试用例说明

### `src/__tests__/env.test.ts`

- **resolves aliases and provides fallback**：在子进程中调用 `getEnv`/`refreshEnv`，确认公共变量别名解析及未知变量的默认值。
- **refreshEnv refreshes cache for helpers**：通过两次运行子进程，分别设置不同 `PUBLIC_NODE_ENV` 和 `PUBLIC_CDN_BASE`，验证 `isProduction` 和 `getCdnUrl` 能在 `refreshEnv` 后反映最新环境。

```ts
// src/__tests__/env.test.ts
const out = spawnSync('node', ['--import', 'tsx', '-e', code], {
  env: { ...process.env, PUBLIC_TAG_NAME: 'from-public' },
  encoding: 'utf-8'
}).stdout.trim();
```

### `src/__tests__/storage.test.ts`

- **handles JSON parse, string fallback and remove in localStorage**：向 `localStorage` 写入对象与普通字符串，验证 JSON 序列化/反序列化、字符串回退及删除逻辑。
- **respects cookie expiration parameter**：使用虚拟时间校验 `set` 时的 `expires` 参数，并验证读取与删除 cookie。
- **falls back to memory storage when localStorage is unavailable**：人为移除 `localStorage`，确认内存兜底逻辑、错误日志输出以及 Sentry 捕获。
- **logs and captures errors when operations throw**：模拟 `getItem`/`setItem`/`removeItem` 抛出异常，检查 logger 与 Sentry 的调用次数。

```ts
// src/__tests__/storage.test.ts
storage.set('obj', { a: 1 });
expect(storage.get<{ a: number }>('obj')).toEqual({ a: 1 });
```

### `src/__tests__/langUtils.test.ts`

- **returns document language before storage**：设置 `document.documentElement.lang` 验证其优先级高于存储值。
- **uses stored language when document lang missing**：模拟 `storage.get` 返回值并检查日志输出。
- **falls back to default when storage empty**：`storage.get` 返回 `null` 时回退到 `zh-CN`。
- **logs and captures errors when storage access fails**：`storage.get` 抛异常时记录错误并上报 Sentry。

```ts
// src/__tests__/langUtils.test.ts
document.documentElement.lang = 'en-US';
storageMock.get.mockReturnValue('fr-FR');
expect(getCurrentLang()).toBe('en-US');
```

### `src/__tests__/ChatSession.test.ts`

- **trims messages beyond token limit**：通过 mock 常量使 `MAX_TOKENS` 较小，添加多条消息后仅保留最近记录。
- **setHistory/getHistory/clear 管理历史记录**：设置初始历史并清空，确认返回拷贝及清除效果。

```ts
// src/__tests__/ChatSession.test.ts
for (let i = 0; i < 10; i++) {
  session.addMessage('user', `msg${i}-` + 'a'.repeat(46));
}
expect(session.getHistory()).toHaveLength(7);
```

### `src/__tests__/useFormValidation.test.tsx`

- **handleChange updates values and errors**：字段变更时同步更新 `values` 与 `errors`。
- **validateAll triggers validators and returns status**：运行所有验证器并返回布尔结果。
- **reset restores initial state**：重置为初始值并清空错误。

```tsx
// src/__tests__/useFormValidation.test.tsx
const { result } = renderHook(() => useFormValidation(initialValues, validators));
act(() => result.current.handleChange('username', 'Alice'));
expect(result.current.errors.username).toBe('');
```

## 编写测试

- 测试文件命名为 `*.test.ts` 或 `*.spec.ts`。
- 可以与被测代码位于同一目录或 `__tests__` 子目录。
- 采用 Vitest 提供的 `describe`、`it`/`test` 与 `expect` API。
- React 组件或 Hook 测试可使用 `@testing-library/react` 的 `render`、`renderHook` 等方法。

### 示例

```ts
// src/utils/sum.test.ts
import { describe, it, expect } from 'vitest';
import { sum } from './sum';

describe('sum', () => {
  it('adds two numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
```

编写好测试后，执行 `npm test` 即可验证结果。
