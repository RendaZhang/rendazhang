<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [前端体验平台 RFC](#%E5%89%8D%E7%AB%AF%E4%BD%93%E9%AA%8C%E5%B9%B3%E5%8F%B0-rfc)
  - [文档目的](#%E6%96%87%E6%A1%A3%E7%9B%AE%E7%9A%84)
  - [当前基础](#%E5%BD%93%E5%89%8D%E5%9F%BA%E7%A1%80)
  - [目标](#%E7%9B%AE%E6%A0%87)
  - [非目标](#%E9%9D%9E%E7%9B%AE%E6%A0%87)
  - [为什么先做浏览器与 hydration smoke](#%E4%B8%BA%E4%BB%80%E4%B9%88%E5%85%88%E5%81%9A%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%8E-hydration-smoke)
  - [主题模式与调色板分离](#%E4%B8%BB%E9%A2%98%E6%A8%A1%E5%BC%8F%E4%B8%8E%E8%B0%83%E8%89%B2%E6%9D%BF%E5%88%86%E7%A6%BB)
  - [所有权边界](#%E6%89%80%E6%9C%89%E6%9D%83%E8%BE%B9%E7%95%8C)
    - [Store](#store)
    - [Provider](#provider)
    - [CSS Token](#css-token)
    - [React Islands](#react-islands)
    - [文档](#%E6%96%87%E6%A1%A3)
  - [建议切片顺序](#%E5%BB%BA%E8%AE%AE%E5%88%87%E7%89%87%E9%A1%BA%E5%BA%8F)
    - [8.1 Hydration and Browser Smoke Harness](#81-hydration-and-browser-smoke-harness)
    - [8.2 Theme Palette Token Design](#82-theme-palette-token-design)
    - [8.3 Global Theme Palette Store](#83-global-theme-palette-store)
    - [8.4 Theme Color Switcher MVP](#84-theme-color-switcher-mvp)
    - [8.5 Interaction Component Standards](#85-interaction-component-standards)
  - [未来切片验证门禁](#%E6%9C%AA%E6%9D%A5%E5%88%87%E7%89%87%E9%AA%8C%E8%AF%81%E9%97%A8%E7%A6%81)
  - [公开安全边界](#%E5%85%AC%E5%BC%80%E5%AE%89%E5%85%A8%E8%BE%B9%E7%95%8C)
  - [与现有文档的关系](#%E4%B8%8E%E7%8E%B0%E6%9C%89%E6%96%87%E6%A1%A3%E7%9A%84%E5%85%B3%E7%B3%BB)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 前端体验平台 RFC

- **作者**: 张人大
- **最后更新**: June 28, 2026, 17:07 (UTC+08:00)

## 文档目的

本文是 Phase 8: Frontend Experience Platform 的公开安全 RFC。它用于在实现主题调色板、复杂交互和浏览器 smoke 覆盖前，先定义本仓库可接受的体验平台边界、切片顺序和验证门禁。

本文不记录私有服务器细节、密钥、内部主机、生产凭据、临时运维状态或用户数据。它描述下一阶段的工程方向，不直接改变运行时代码、CSS、UI、依赖、后端、Nginx 或生产服务器状态。

## 当前基础

Phase 8 建立在以下已完成基础上：

- 前端运行时已切换到 Node 24.17.0 / npm 11.13.0。
- Astro 6、React 19、Sentry source map 上传、CSP 外部初始化脚本和 GitHub Actions 静态部署路径已经稳定。
- `docs/FRONTEND_ARCHITECTURE.md` 记录了 Astro 页面、`BaseLayout`、React islands、服务层、CSP、iframe 和 hydration 约定。
- `docs/DIRECTORY_OWNERSHIP.md` 记录了 `src/components`、`src/services`、`src/utils`、`src/styles`、`src/content`、`src/stores` 和 `src/controllers` 的目录所有权。
- `src/stores/uiPreferencesStore.ts` 和 `src/hooks/useUiPreferences.ts` 已提供小型跨 island UI/preference 状态边界。
- `src/styles/core/tokens.css`、`src/styles/core/theme-tokens.css` 和 `src/styles/core/_gradients.css` 已分离基础 token、主题语义 token 和渐变 token。
- `docs/THEME_PALETTE_TOKEN_MODEL.md` 已定义 theme mode、palette 和 accent 的 token/DOM/storage 边界。
- Chat Widget 同源 iframe ready 协议、Chat controller、统一 API client 和服务层边界已经文档化并落地。
- import-boundary lint 已覆盖当前低误报的目录所有权子集。
- 最小浏览器/hydration smoke harness 已落地为 `npm run smoke:browser`，使用 Playwright Chromium 验证首页、`/deepseek_chat/`、Chat Widget iframe ready、当前主题 mode 切换和 palette 切换。

剩余安全/audit 状态是已接受的低级 `astro` / `esbuild` 残余；它不应驱动 Phase 8 的用户体验切片，除非上游发布安全的非 force 修复路径。

## 目标

Phase 8 的目标是让后续用户体验工作可以在可验证边界内迭代：

- 在新增更多视觉/交互能力前，先建立浏览器和 hydration smoke 覆盖。
- 明确 `theme mode` 与 `palette/accent` 的模型区别，避免把调色板状态塞进当前 light/dark 模式。
- 让主题调色板、交互状态、CSS token 和 React islands 继续遵循既有所有权。
- 为复杂交互建立最小共享标准，包括 loading、状态提示、focus、键盘行为和可访问性检查。
- 保持每个切片小而可验证，避免把浏览器测试、token 设计、store 扩展和 UI 控制同时混在一个提交中。

## 非目标

Phase 8 不是以下工作的入口：

- Astro 7 升级或 Astro 7 预检。
- 后端 Chat 产品能力、模型能力或 API 合约重构。
- 批量依赖升级、ESLint/TypeScript/Vitest major migration 或 Node/Python runtime 再升级。
- 生产服务器、Nginx、Redis、PostgreSQL、PgBouncer、systemd 或 SSH 状态变更。
- 大范围 UI redesign、品牌重做、页面信息架构重写或新 landing page。
- 在没有验证门禁的情况下直接添加主题调色板 UI。

## 为什么先做浏览器与 hydration smoke

主题调色板和复杂交互都容易影响浏览器真实行为，而这些风险不能完全靠单元测试发现：

- `BaseLayout` 的渲染前初始化、`data-theme`、`data-lang`、`data-logged-in` 和 CSP 外部脚本需要在真实页面加载时验证。
- React islands 的 `client:load` / `client:visible` 水合顺序可能影响首屏状态、导航、Chat Widget 和认证表单。
- Chat Widget 依赖同源 iframe、`postMessage` source/origin 校验、ready message 和关闭/重开生命周期。
- 主题切换风险包括首屏闪烁、DOM attribute 不一致、storage fallback、按钮状态错读和深色模式 token 漏映射。
- CSP 相关问题通常表现为浏览器 console error，而不是 TypeScript 或 Vitest 失败。

因此 Slice 8.1 应先建立最小浏览器 smoke harness。后续主题调色板或交互切片必须能证明没有新增 hydration mismatch、CSP inline-script error、iframe ready regression 或关键 console error。

## 主题模式与调色板分离

当前主题模型是 light/dark `theme mode`。后续调色板能力应引入独立概念：

| 概念 | 说明 | 当前所有者 | Phase 8 预期 |
| --- | --- | --- | --- |
| `theme mode` | 明暗模式，例如 `light` / `dark` / 跟随系统默认 | `ThemeProvider`、`data-theme`、主题存储 | 保持现有行为，避免破坏预渲染初始化 |
| `palette` | 一组基础品牌色、强调色、渐变和可读性约束 | `uiPreferencesStore`、`ThemeProvider`、`data-palette`、主题 token | 不直接等同于 light/dark；使用独立 DOM 表达和 fallback |
| `accent` | 可选的局部强调色或小范围交互色 | 未来 token 设计切片决定 | 只有在 token 模型明确后再进入 store/UI |

基本原则：

- 不把 palette 名称塞进 `data-theme`，除非后续设计证明这比独立属性更安全。
- 不让调色板 UI 直接写大量 CSS custom property；应优先通过 token、DOM attribute 和样式层解析。
- 不为了新颜色绕过现有对比度、OKLCH、sRGB fallback 和组件 class 约定。
- 不用 palette 状态承担语言、认证、Chat 消息或后端数据职责。

## 所有权边界

### Store

`src/stores` 只能保存小型客户端 UI/preference 状态。当前 palette 状态已加入；后续
palette/accent 状态扩展应满足：

- framework-neutral，不导入 React、React DOM、组件、页面、服务或样式文件。
- 提供明确默认值、snapshot、subscribe 和可测试持久化 helper。
- 不拥有 `data-theme` 写入，除非后续切片明确移动该职责并更新架构文档。
- 不保存敏感数据、用户输入、Chat 内容、auth session 或 API request 状态。

### Provider

`ThemeProvider` 继续拥有现有主题 mode 的解析、context、DOM `data-theme` 同步和存储写入；当前也同步 `data-palette` 与 `preferred_palette`。后续如果添加 palette provider 或扩展现有 provider，必须说明：

- SSR 初始状态和客户端恢复顺序。
- 与 `/js/base-layout-init.js` 的关系。
- 是否需要新的 DOM attribute；当前 palette 使用 `data-palette`。
- 如何避免 hydration 前后按钮状态不一致。

### CSS Token

CSS token 继续遵循当前层级：

- 基础设计值：`src/styles/core/tokens.css`。
- 主题语义别名和 `data-theme` 覆盖：`src/styles/core/theme-tokens.css`。
- 渐变 token：`src/styles/core/_gradients.css`。
- 组件局部 token：对应组件样式文件。

后续 palette token 设计应先定义命名、fallback、对比度和覆盖策略，再实现 UI。组件样式应读取语义 token，不应硬编码新的品牌色或把调色板逻辑散落到组件 CSS。

### React Islands

React islands 负责交互，不负责整页文档 shell 或 token 定义。后续主题/交互 island 应满足：

- 继续使用当前允许的 hydration 指令，新增指令前更新架构文档。
- 浏览器 API 在挂载后访问，避免 SSR 阶段读取 `window`、`document` 或 storage。
- 交互 UI 的状态读取通过 provider、hook 或 store 边界，不重复维护独立 storage。
- 修改 Chat Widget、iframe、认证表单或导航交互时，必须跑浏览器 smoke 覆盖。

### 文档

Phase 8 切片应在行为改变的同一提交中更新相关文档：

- 架构边界变化：`docs/FRONTEND_ARCHITECTURE.md`。
- 目录所有权变化：`docs/DIRECTORY_OWNERSHIP.md`。
- token 或样式约定变化：`docs/STYLE_GUIDE.md`。
- smoke、测试或验证命令变化：`docs/TESTING.md`。
- Chat Widget protocol 变化：`docs/CHAT_WIDGET_PROTOCOL.md`。

## 建议切片顺序

### 8.1 Hydration and Browser Smoke Harness

已建立最小浏览器 smoke 工作流。当前工具选择是 Playwright Chromium，因为本阶段需要真实浏览器 console、iframe、storage 和 hydration 行为；纯 HTTP 或 jsdom 无法覆盖这些风险。

可运行命令：

```bash
npm run smoke:browser
```

当前覆盖：

- 首页加载无阻塞 console error。
- `/deepseek_chat/` 页面加载无 hydration mismatch，并确认 iframe 内页不会递归挂载全局 Chat Widget。
- Chat Widget 打开后加载同源 `/deepseek_chat/` iframe，并在收到 `chat-enhancement-ready` 后到达 ready UI。
- 主题 mode 切换后 DOM `data-theme`、按钮选中态和 `preferred_theme` storage 保持一致。

该命令会以 `SKIP_SENTRY=true` 构建静态产物，并在本地 smoke 中 mock `/cloudchat/auth/me` 为最小合法用户，避免没有后端时的资源错误污染 console。它不覆盖 Chat streaming、auth 表单提交、联系表单提交或生产 Nginx CSP header；这些仍按对应切片和部署只读检查验证。

后续调色板或交互切片不应绕过该 smoke 门禁，也不应把调色板 UI 与 smoke harness 维护混在同一提交中。

### 8.2 Theme Palette Token Design

已完成 theme palette/accent token 设计，不做用户控件。设计说明见：
[主题调色板 Token 模型](./THEME_PALETTE_TOKEN_MODEL.md)。

该模型记录：

- palette/accent 的命名和 DOM 表达建议。
- token 文件归属和 cascade layer 影响。
- light/dark 与 palette 的组合规则。
- sRGB fallback、OKLCH、对比度和可访问性检查要求。
- 哪些现有组件会在 MVP 中读取新 token。

### 8.3 Global Theme Palette Store

在 8.2 的设计基础上扩展 store 边界。当前已落地：

- `default` palette 枚举、默认值和 `preferred_palette` 持久化 helper。
- store 单元测试覆盖默认值、非法存储值回退和类型收窄。
- readiness 继续复用现有偏好 readiness；provider 与 `/js/base-layout-init.js` 职责未变化。
- 不新增用户可见 palette UI、`data-palette` DOM 同步或 runtime CSS palette 覆盖。

### 8.4 Theme Color Switcher MVP

已添加第一个用户可见的调色板控制。当前边界：

- palette 数量保持为 `default`、`aurora` 和 `forest`。
- 控制位于现有导航 `ThemeToggle` 弹层中，使用 swatch 按钮，不新增顶层导航项。
- 通过 `html[data-palette]`、`preferred_palette` 和语义 token 映射实现，不复用
  `data-theme`。
- 浏览器 smoke 验证 storage、DOM attribute、选中态、hydration console 和 Chat Widget iframe
  ready 路径。
- 不修改 Chat 流式消息状态、后端 API 或 iframe protocol。

### 8.5 Interaction Component Standards

为后续复杂交互建立标准。候选范围：

- modal/dialog、toast/status、menu/command、loading、empty/error state。
- keyboard、focus trap、escape、aria、reduced motion。
- 共享 primitive 与局部组件状态的选择规则。
- 交互组件的单元测试和浏览器 smoke 要求。

## 未来切片验证门禁

所有 Phase 8 实现切片至少需要：

- `git diff --check`
- `npm run sync`
- `npm run lint`
- `npm run typecheck`
- `npm run check`
- 与改动范围匹配的 Vitest 覆盖或现有 `npm run test:coverage`
- `pre-commit run --all-files`

后续影响主题、导航、Chat Widget、iframe、认证表单或水合顺序的切片还必须运行 `npm run smoke:browser`。如果切片只改文档或非浏览器代码，可以在最终报告中说明该命令不适用。

如果切片改变 CSP 敏感输出、inline script、Sentry 构建行为、iframe 来源或 `postMessage`，还必须在最终报告中列出浏览器 console / workflow log / 线上只读检查结果。

## 公开安全边界

Phase 8 文档和代码不得包含：

- 真实密钥、token、cookie、session、生产环境变量值或私有主机信息。
- 用户 email、phone、display name、聊天内容、联系表单内容或认证凭据。
- 服务器内部 IP、一次性 incident 细节或无法公开的运维状态。

Sentry 相关体验切片只允许继续使用当前安全用户上下文和低敏 operation breadcrumb 模型。不得因为交互标准化而扩大 PII 收集范围。

## 与现有文档的关系

- 高层架构约定见：[前端架构约定](./FRONTEND_ARCHITECTURE.md)。
- 目录职责边界见：[前端目录所有权地图](./DIRECTORY_OWNERSHIP.md)。
- CSS token 和样式层级见：[样式说明](./STYLE_GUIDE.md)。
- theme mode、palette 和 accent 的 token/DOM/storage 设计见：[主题调色板 Token 模型](./THEME_PALETTE_TOKEN_MODEL.md)。
- 测试和静态检查见：[测试指南](./TESTING.md)。
- Chat Widget 同源 iframe 协议见：[Chat Widget 协议说明](./CHAT_WIDGET_PROTOCOL.md)。
