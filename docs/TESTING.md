<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [测试指南](#%E6%B5%8B%E8%AF%95%E6%8C%87%E5%8D%97)
  - [简介](#%E7%AE%80%E4%BB%8B)
  - [先决条件](#%E5%85%88%E5%86%B3%E6%9D%A1%E4%BB%B6)
  - [运行测试](#%E8%BF%90%E8%A1%8C%E6%B5%8B%E8%AF%95)
  - [视觉与交互 QA](#%E8%A7%86%E8%A7%89%E4%B8%8E%E4%BA%A4%E4%BA%92-qa)
  - [静态检查](#%E9%9D%99%E6%80%81%E6%A3%80%E6%9F%A5)
  - [构建体积与 chunk warning](#%E6%9E%84%E5%BB%BA%E4%BD%93%E7%A7%AF%E4%B8%8E-chunk-warning)
  - [测试用例说明](#%E6%B5%8B%E8%AF%95%E7%94%A8%E4%BE%8B%E8%AF%B4%E6%98%8E)
    - [`src/__tests__/env.test.ts`](#src__tests__envtestts)
    - [`src/__tests__/storage.test.ts`](#src__tests__storagetestts)
    - [`src/__tests__/langUtils.test.ts`](#src__tests__langutilstestts)
    - [`src/__tests__/ChatSession.test.ts`](#src__tests__chatsessiontestts)
    - [`src/__tests__/useFormValidation.test.tsx`](#src__tests__useformvalidationtesttsx)
  - [编写测试](#%E7%BC%96%E5%86%99%E6%B5%8B%E8%AF%95)
    - [示例](#%E7%A4%BA%E4%BE%8B)
  - [Ink Palette Regression](#ink-palette-regression)
    - [Docs Diagram Geometry](#docs-diagram-geometry)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 测试指南

- **作者**: 张人大 (Renda Zhang)
- **最后更新**: October 07, 2026, 12:10 (UTC+08:00)

---

## 简介

本项目使用 [Vitest](https://vitest.dev/) 作为测试框架，并辅以以下工具：

- [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)：用于编写 React 组件与 Hook 测试。
- [jsdom](https://github.com/jsdom/jsdom)：提供浏览器 API 的模拟环境。
- [@vitest/coverage-v8](https://vitest.dev/guide/coverage.html)：生成覆盖率报告。
- [Playwright](https://playwright.dev/)：运行最小浏览器 smoke，覆盖真实 Chromium console、hydration、Chat Widget iframe ready、主题 mode 和 palette 切换状态。

Phase 8 的浏览器和 hydration smoke 规划见：[前端体验平台 RFC](./FRONTEND_EXPERIENCE_PLATFORM.md)。Phase 9 的视觉与交互 polish 验证边界见：[外观与交互 Polish](./VISUAL_INTERACTION_POLISH.md)。交互组件的键盘、focus、ARIA、状态和 browser smoke 门禁见：[交互组件标准](./INTERACTION_COMPONENT_STANDARDS.md)。当前最小 smoke harness 已落地为 `npm run smoke:browser`，用于在后续主题、导航、Chat Widget、iframe 或 hydration-sensitive 改动前后提供可重复浏览器验证。

已有仓库应使用提交的锁文件安装，不要用未指定版本的命令重新选择测试工具版本：

```bash
node_bin="$(mise which node)"
npm_cli="$(mise where node)/lib/node_modules/npm/bin/npm-cli.js"
export PATH="$(dirname "$node_bin"):$PATH"
"$node_bin" --version
"$node_bin" "$npm_cli" --version
"$node_bin" "$npm_cli" ci
```

## 先决条件

- Node/npm 以 `.mise.toml`、`.nvmrc` 和 `package.json` 为准；当前是 Node `24.17.0` /
  npm `11.13.0`，构建基线是 Astro 7 / Vite 8。上面的 PATH 设置也约束测试脚本的子进程，
  避免桌面 shell 的 npm shebang 使用另一个 Node。以下 npm 命令均应通过上述显式 CLI 调用。
- 在仓库根目录执行上述 `npm ci`，保留锁文件及 Vitest 家族版本一致性。
- 部分测试（例如 `src/__tests__/env.test.ts`）通过 `node --import tsx` 运行 TypeScript 子进程，也必须使用项目固定的 Node。
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
  - 未登录且没有本地登录信号时，公共页面不会主动请求 `/cloudchat/auth/me`。
  - `/deepseek_chat/` 页面加载时无 hydration mismatch 信号，且不会挂载全局 Chat Widget。
  - Chat Widget 打开后加载同源 `/deepseek_chat/` iframe，等待 `chat-enhancement-ready` 后隐藏 skeleton。
  - 宽屏导航直接显示现有公共目的地；移动抽屉覆盖关闭态 Tab 顺序、初始 focus、双向 Tab 边界、
    Escape/backdrop/关闭按钮、滚动锁、桌面断点清理、Chat 表面层级与首屏 launcher 留白。
  - 语言与主题 disclosure 覆盖 labelled selection state、Escape、focus 返回和双语切换。
  - `/docs/` 首次加载会渲染当前可见语言的 Mermaid 图表；中文与英文页面内双向切换后，新可见语言的当前两张图表会在无需刷新时完成渲染。
  - 主题 mode 切换后 `html[data-theme]`、选中态 `aria-pressed` 和 `preferred_theme` storage 保持一致。
  - theme palette 切换后 `html[data-palette]`、swatch 选中态 `aria-pressed` 和 `preferred_palette` storage 保持一致。

  该 smoke 以非拦截式 request listener 断言 logged-out 公共页面不会发起
  `/cloudchat/auth/me` 探测请求，避免因 Playwright routing 关闭浏览器缓存并扭曲生产资源加载时序。
  对 `client:load` 交互区，测试会等待对应 Astro island 移除 `ssr` 标记后再执行点击，从而验证已
  水合的交互行为，而不是把网络相关的水合时序误报为功能失败。它不发送真实用户信息，也不覆盖
  真实 Chat streaming、auth 表单提交或后端 API 行为。

`src/__tests__/MarkdownRenderingSecurity.test.tsx` 使用真实 DOMPurify 验证字符串/Markdown
净化，覆盖 script、事件属性、编码后的不安全 URL，以及安全文本、代码和链接。Mermaid 的单元
用例使用 mock 检查失败回退，不能替代真实浏览器证据。

`tests/smoke/markdown-security.spec.ts` 仅允许 loopback 地址，在隔离的 Chromium 上下文中
拦截本地合成 Chat 响应，禁止请求其他 Chat API；不调用付费模型，也不向生产发送测试内容。
桌面和移动端用例通过实际应用管线及打包后的 DOMPurify/Mermaid，检查最终 DOM 中不存在
script、事件属性或不安全 URL，并检查无害执行标记。正向事件对照确认不能仅凭 CSP 阻止执行
就误判净化成功。真实图表、良性数学标签和畸形图表代码回退均有覆盖。每个用例结束后销毁
浏览器上下文；这不是 IN_PLACE 漏洞复现、KaTeX 修复证明或后端流式协议测试。
现有部署工作流运行 Vitest coverage 和构建；Playwright 是本地发布前门禁，不宣称已在 CI 运行。

`src/__tests__/SharpNativeImages.test.ts` 使用真实原生库，检查根依赖与 Astro 共用 Sharp，
并记录平台、架构、Node 和完整 `sharp.versions`。当前要求 Sharp `0.35.5`、libvips
`8.18.7`、librsvg `2.63.2`、libheif `1.23.5`，本机 macOS 与部署前 Linux CI 都必须通过。
JPEG/WebP/AVIF 的小图解码、缩放、像素及非法输入测试保留；新增自包含 16x12 SVG 的
栅格化、8x6 缩放和像素检查。畸形 SVG 由五秒硬超时子进程检查 metadata/resize 拒绝，
没有脚本、外部资源、字体或实体，不生成 hero 资源、不访问生产、不使用攻击或压力样本。
良性回归不是 RCE 复现或完整 SVG 安全证明；修复证据还必须包括实际固定原生版本和告警 ID。

`src/__tests__/BuildDataCompatibility.test.ts` 在 Node 环境使用真实 devalue、Astro
frontmatter helper、TOML 和 PostCSS/source-map-js，检查共享依赖解析、数据往返、内容保留/移除、
null-prototype 对象、默认日期语义和源映射兼容性。`fixtures/build-data-bounded.mjs` 只由这些
Vitest 用例启动，以五秒硬超时和严格未处理拒绝策略隔离小型异常输入；不使用巨大数组、资源
压力循环、动态求值、原型修改或外部流量。现有 `test:coverage` 会在本机及部署前 Linux CI
发现该测试，无需新 harness。它不证明所有内嵌依赖均已修复；Magicast 的内嵌副本限制见
[依赖风险登记](./DEPENDENCY_SECURITY_RISK_REGISTER.md)。

`src/__tests__/BuildQueryCompatibility.test.ts` 使用真实 ESLint、Sentry/glob 和
typescript-estree 消费路径，覆盖两条 minimatch/brace-expansion 主版本、有限文件匹配与忽略规则，
以及 Babel/Browserslist 固定目标、Baseline 结果形状和中间数据兼容性。
`fixtures/build-query-bounded.mjs` 由现有 Vitest 启动，以五秒硬超时隔离小型异常输入：降低 brace
深度/重写限制来检查字面量回退，检查 stats 与原型完整性，并以 501 个小查询验证已审查的
500 项结果缓存淘汰及重复查询正确性，不做资源压力测试。parse cache 上限另以源码审查确认。
mapping 两个 API 的非法选项必须抛出可捕获错误，子进程还必须输出 after-checks 标记，不能仅
凭退出码 0 判定成功。测试不修改全局原型、不访问外部网络，也不运行真实 Sentry 上传。

`src/__tests__/SvgToolingCompatibility.test.ts` 通过现有 Vitest 启动
`fixtures/svg-tooling-bounded.mjs`，以五秒硬超时检查真实 Astro/SVGO 包解析、优化 wrapper、
XAST 选择器与 inlineStyles、严格 XML 异常及合法 Unicode 边界。ESM/CommonJS 入口和现有
SVG logo 都有覆盖。`removeScripts` 仅在隔离用例中启用，检查 foreignObject、命名空间前缀、
控制字符混淆 URL 和可执行 data URL，同时保留安全文本、几何与链接。输出只用结构化 XML
解析器检查，不执行脚本、不加载资源、不发出外部请求；每个子进程必须返回 after-checks 标记。
站点配置仍不启用 SVG optimizer 或该插件。SVGO 不是完整净化器，这些测试不替代 DOMPurify
及真实 Chromium 的 Markdown 安全门禁，也不证明站点当前存在这些 opt-in 漏洞的公开输入路径。

`src/__tests__/LintDependencyCompatibility.test.ts` 在现有 Vitest 中启动
`fixtures/lint-dependency-bounded.mjs`，验证 ESLint/HumanFS、两条 Ajv 8 路径、Stylelint
颜色规则和 Astro 未使用 CSS 选择器规则的真实依赖解析。每个子进程有五秒硬超时和
after-checks 标记；临时目录由父进程创建并在 finally 清理，超时也不能遗留测试文件。
HumanFS copy/copyAll 覆盖普通文件、递归目录及指向同一临时根内合成文件/目录的符号链接，
通过 lstat/readlink 检查链接本身，不把保留链接误解为安全沙箱，也不读取真实私人文件。
macOS 与 Linux CI 均须执行这些用例，不能只凭告警消失判定修复。
URI、颜色插件和选择器测试只用小型离线数据；Ajv 不获取外部 schema，异常解析必须可捕获，
选择器深度测试采用较低显式限制，不使用压力输入、原型修改或脆弱的耗时阈值。
测试日志记录实际平台和 Node 版本，`test:coverage` 自动包含该文件，无需新增 harness。

`src/__tests__/VitestDependencyCompatibility.test.ts` 与
`fixtures/vitest-dependency-bounded.mjs` 验证十个 Vitest 家族节点和实际消费者解析。
真实 Vite/interceptorPlugin 仅监听 `127.0.0.1` 的临时端口，不加载项目配置或环境文件。
允许的普通模块与 redirect 正常读取；不透明 scheme 的越界路径和 `fs.deny` 文件不能注册
或返回合成标记。关闭原始 WebSocket 注册后，受控预填 registry 仍可使用；不 mock 文件访问
检查，也不将该测试描述为未安装 browser provider 的认证证明或生产网站漏洞复现。
每个子进程有十五秒硬超时，请求/socket 另有限时，server/socket 在 finally 关闭；父进程负责
临时根目录清理。所有文件都是测试创建的，不读取私人文件、不访问外部服务。

同一测试覆盖 Chai 去重 keys、deep include oneOf、可调用 iterator 和有意失败的断言；
`expectTypeOf` 正/负关系与 overload thisParameter 同时由 `npm run typecheck` 检查，运行时
通过不等于类型验证。隔离的本地/GitHub Actions 合成环境检查 std-env；颜色测试检查禁用/强制、
嵌套、RGB/hex 输出。tinyrainbow 强制着色时直接传入 Symbol 会抛 TypeError，禁用时仍能
字符串化；这不是任意输入兼容承诺。一个隔离、预期退出 1 的真实 Vitest 子运行验证 Symbol
断言失败可以正常生成诊断，不将报告器崩溃当作预期失败。现有 jsdom/React mocks 保留。
Vitest UI 只做短暂 loopback 检查后关闭，不安装 browser mode，不留下 watch 服务。

## 视觉与交互 QA

视觉或交互 polish slice 需要保留足够证据，证明改动没有引入首屏、主题、Chat Widget、移动端或
console 回归：

- 优先使用 Browser 插件检查真实页面；如果 Browser 控制超时或不可用，可以使用 Playwright
  fallback。
- 截图和临时 trace 只保存在 `/tmp` 等临时目录，不提交到仓库，除非任务明确要求沉淀视觉基线。
- 默认至少检查桌面 `1366x900` 和移动端 `390x844`；若改动影响特定断点，应补充对应视口。
- 记录首页首屏、导航/主题菜单、palette 切换、Chat Widget 打开/ready 状态，以及被改页面的核心
  交互。
- 检查 `html[data-theme]`、`html[data-palette]`、关键 `aria-*` / `aria-pressed` 状态和浏览器
  console warning/error。
- 影响主题、导航、Chat Widget、iframe、hydration 或 CSP 的实现 slice 必须运行
  `npm run smoke:browser`。
- 文档-only 或计划-only slice 不需要 `npm run test:coverage` 或 `npm run smoke:browser`，但最终报告
  必须说明不适用原因。

## 静态检查

- `npm run lint`：运行 ESLint flat config，覆盖 `src`、`astro.config.ts` 和 `eslint.config.ts`。当前配置启用 TypeScript project service，以便对 Promise 使用做类型感知检查。
- Promise 必须被 `await`、带 rejection handler，或用 `void` 明确标记为有意忽略；React effect 内的异步初始化、事件回调触发的异步流程和第三方 API 调用都应显式处理。
- `target="_blank"` 链接必须保留安全的 `rel` 属性；`@ts-ignore`、`@ts-expect-error` 等 TypeScript 抑制注释必须带足够说明。
- ESLint 同时强制当前低误报的 import-boundary 子集：services、controllers、stores、utils、content、components 和 hooks 不能跨越 `docs/DIRECTORY_OWNERSHIP.md` 中已经落地的稳定所有权边界。
- 当前未引入 `eslint-plugin-react-hooks` 或 `eslint-plugin-jsx-a11y`。Hooks exhaustive deps 与更广泛的 JSX a11y 规则仍按代码评审检查，是否新增依赖留给后续切片决策。
- 影响主题、导航、Chat Widget、iframe、认证表单、modal/popover/menu、overlay、focus/keyboard 行为或 hydration 顺序的切片应把 `npm run smoke:browser` 加入验证清单。该命令是浏览器行为门禁，不替代 Vitest、Astro check、TypeScript 或 ESLint。

## 构建体积与 chunk warning

`npm run build` 可能继续输出 Vite 的 “Some chunks are larger than 500 kB after minification”
提示。当前已确认：

- 旧的最大 chunk 来自全量 `highlight.js` 语言包；代码现在通过
  `src/utils/highlight.ts` 使用 `highlight.js/lib/common`，并补注册站点文档需要的 `nginx`
  语言。
- `src/utils/highlight.ts` 是 lazy-only 模块，刻意不再由生成的 `src/utils/index.ts` barrel
  静态导出。`scripts/generateIndex.ts` 保留这个例外，避免 Vite 8/Rolldown 把高亮模块提前拉回
  主入口并触发 ineffective dynamic import warning。
- Docs 页面增强逻辑在 `DocsEffects` 挂载后动态加载 `marked`、project highlighter 和
  `mermaid`，首页不应因为 sections barrel 提前加载 Markdown 增强库。
- 剩余超过 500 kB raw minified 阈值的 chunk 来自 Mermaid 自身的动态模块，例如
  `mermaid.core` 和 `wardley` parser。Vite 8/Rolldown 的提示可能建议
  `build.rolldownOptions.output.codeSplitting`；当前仍按来源和加载路径评估，而不是直接提高
  warning 阈值。gzip 后体积明显低于 raw warning，且只在 docs 或 Chat Markdown 增强路径需要
  Mermaid 时加载。

后续如果改动 Markdown、Docs、Chat 消息渲染或 Mermaid 逻辑，应至少重新运行：

```bash
npm run build
find dist/_astro -type f -name '*.js' -exec ls -lh {} + | awk '{print $5, $9}' | sort -hr | head -20
npm run smoke:browser
```

不要仅通过提高 `build.chunkSizeWarningLimit` 来隐藏 warning；只有在确认 warning 来源、加载路径和
gzip 体积后，才记录为可接受残余风险。

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
## Ink Palette Regression

`themePaletteTokens.test.ts` invokes the existing contrast checker against parsed CSS, not a
duplicated documentation color table. The checker covers 146 Ink light/dark and legacy on-primary
pairs, including status backgrounds, placeholders, focus/control edges, code/comments, disabled
text, 72% composites and the hero scrim. `ThemeToggle` tests keep bilingual default naming and
the unchanged stored IDs separate from the alternative names.

Browser smoke reads real computed colors through the rendered homepage, Docs highlighter,
intercepted local Chat answer and isolated form-state fixture. It checks solid keyboard focus,
the white Mermaid paper, first-open/reopen Widget preferences, raw/JSON/invalid pre-paint storage,
unavailable-storage fallback, and legacy palette gradients. No real Chat or account write is used.
Existing sanitizer, malformed-diagram, navigation and iframe assertions remain in place.

Use an isolated production preview for visual acceptance at 1366x900 and 390x844 in both languages.
Development-only SocialIcons metadata warnings do not establish a production hydration defect:
check a fresh `SKIP_SENTRY=true` build before changing dimension ownership. Keep third-party Credly
frame diagnostics separate from first-party console errors. If Astro preview is already running
on a dedicated loopback port, set `SMOKE_PORT` to that port; the smoke workflow can reuse it.

### Docs Diagram Geometry

Count SVGs and inspect their geometry, not just console output. A very short global transition
can still change Mermaid's intermediate measurements when reduced motion is enabled. Docs uses
an inert, aria-hidden, fixed-position staging area with transitions disabled for measurement;
the existing Mermaid API and security settings are unchanged. The staging area stays measurable
when a live language switch hides the original locale. Successful nodes are moved back once;
failures retain source code, and the temporary area is removed after success, rejection or
completion after unmount. No hidden locale is rendered proactively.

The browser tests cover both motion preferences at 1366x900 and 390x844, light/dark modes, and
zh/en/zh switching with bounded viewBox dimensions and non-collapsed labels. A local delayed
diagram-module response exercises a real language switch during rendering. Unit tests also cover
cleanup, rejection, one-time Markdown/highlighting, deduplication and remounts. Keep the real
sanitizer and malformed-diagram tests; mocked Mermaid alone cannot validate layout or safety.
