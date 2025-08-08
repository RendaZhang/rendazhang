<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [测试指南](#%E6%B5%8B%E8%AF%95%E6%8C%87%E5%8D%97)
  - [简介](#%E7%AE%80%E4%BB%8B)
  - [先决条件](#%E5%85%88%E5%86%B3%E6%9D%A1%E4%BB%B6)
  - [运行测试](#%E8%BF%90%E8%A1%8C%E6%B5%8B%E8%AF%95)
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
- **最后更新**: August 09, 2025, 03:52 (UTC+08:00)

---

## 简介

本项目使用 [Vitest](https://vitest.dev/) 作为测试框架，并辅以以下工具：

- [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)：用于编写 React 组件与 Hook 测试。
- [jsdom](https://github.com/jsdom/jsdom)：提供浏览器 API 的模拟环境。
- [@vitest/coverage-v8](https://vitest.dev/guide/coverage.html)：生成覆盖率报告。

如需手动安装，可执行：

```bash
npm install -D vitest @testing-library/react @vitest/coverage-v8 jsdom
```

## 先决条件

- 已安装 [Node.js](https://nodejs.org/)（推荐与 `.nvmrc` 中一致的版本）。
- 在仓库根目录执行 `npm install` 安装依赖。
- 部分测试（例如 `src/__tests__/env.test.ts`）会通过 `node --import tsx` 在子进程中运行 TypeScript 文件，请确保 Node.js 版本支持该标志（建议 Node.js 20 及以上）。
- 测试默认在 [jsdom](https://github.com/jsdom/jsdom) 环境中运行，部分用例（如 `src/__tests__/storage.test.ts`）依赖它提供的 `window.localStorage`、`document.cookie` 等浏览器 API。
- 若需编写 React 组件或 Hook 测试，请确保已安装 `@testing-library/react`（见上文）。

## 运行测试

- `npm test`：以一次性模式运行所有测试。
- `npm run test:watch`：在监听模式下运行测试，适合开发时使用。
- `npm run test:coverage`：生成测试覆盖率报告，输出至 `coverage/` 目录，可打开 `coverage/index.html` 查看详细结果。
- `npm run test:ui`：启动 Vitest 提供的 Web UI。

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
