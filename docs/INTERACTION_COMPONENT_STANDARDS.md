<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [交互组件标准](#%E4%BA%A4%E4%BA%92%E7%BB%84%E4%BB%B6%E6%A0%87%E5%87%86)
  - [文档目的](#%E6%96%87%E6%A1%A3%E7%9B%AE%E7%9A%84)
  - [当前事实](#%E5%BD%93%E5%89%8D%E4%BA%8B%E5%AE%9E)
  - [状态所有权](#%E7%8A%B6%E6%80%81%E6%89%80%E6%9C%89%E6%9D%83)
  - [组件模式](#%E7%BB%84%E4%BB%B6%E6%A8%A1%E5%BC%8F)
    - [Button 和 Icon Button](#button-%E5%92%8C-icon-button)
    - [Disclosure、Popover 和 Menu](#disclosurepopover-%E5%92%8C-menu)
    - [Dialog 和 Modal](#dialog-%E5%92%8C-modal)
    - [Toast、Status 和 Inline Feedback](#toaststatus-%E5%92%8C-inline-feedback)
    - [Loading、Disabled、Empty 和 Error State](#loadingdisabledempty-%E5%92%8C-error-state)
  - [键盘与 Focus](#%E9%94%AE%E7%9B%98%E4%B8%8E-focus)
  - [Motion 与 Reduced Motion](#motion-%E4%B8%8E-reduced-motion)
  - [样式与 Token](#%E6%A0%B7%E5%BC%8F%E4%B8%8E-token)
  - [Browser Smoke 门禁](#browser-smoke-%E9%97%A8%E7%A6%81)
  - [共享 Primitive 判断](#%E5%85%B1%E4%BA%AB-primitive-%E5%88%A4%E6%96%AD)
  - [与现有文档的关系](#%E4%B8%8E%E7%8E%B0%E6%9C%89%E6%96%87%E6%A1%A3%E7%9A%84%E5%85%B3%E7%B3%BB)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 交互组件标准

- **作者**: 张人大
- **最后更新**: June 30, 2026, 11:46 (UTC+08:00)

## 文档目的

本文记录当前 Astro + React 前端中交互组件的公开安全标准，用于后续新增 modal、menu、
toast、loading、empty/error state、键盘行为和 focus 管理前统一评审口径。

本文描述当前代码已经采用的模式，并给出新增交互时的最低门槛。它不引入新的组件库、
不改变运行时代码、不记录私有服务器信息、密钥、用户数据、聊天内容或表单内容。

## 当前事实

当前交互主要由 React islands 承担：

- `NavBar`、`HamburgerMenu`、`LanguageSelector` 和 `ThemeToggle` 负责导航、抽屉和紧凑
  dropdown 控制。
- `ThemeProvider`、`I18nProvider` 和 `AuthProvider` 继续拥有主题、语言和认证 provider
  状态。
- `uiPreferencesStore` 只保存小型 UI/preference 状态，包括 theme mode、palette、Chat
  Widget open state 和 preference readiness。
- `ChatWidget` 拥有同源 iframe、ready skeleton、outside click close 和
  `chat-enhancement-ready` 接收逻辑。
- 认证表单和联系表单使用局部 `idle` / `loading` / `success` / `error` 状态，表单字段与
  validation 不进入全局 store。
- `Modal` / `ConfirmDialog` 当前只覆盖轻量确认对话框场景；它们没有完整 focus trap、
  Escape close、initial focus 或 restore focus 行为。
- `LoadingIndicator` 使用 `role="status"` 和 `aria-live="polite"`；装饰性 skeleton 使用
  `aria-hidden="true"`。
- 样式层已经提供 `--focus-ring`、`--duration-*`、`--easing-*`、`--radius-*`、
  `--shadow-elevation-*`、success/error/warning token 和 `prefers-reduced-motion` 约束。

## 状态所有权

交互状态先按作用范围选择所有权，不要先引入共享 primitive 或全局 store。

| 状态范围 | 应放位置 | 当前例子 | 不应放入 |
| --- | --- | --- | --- |
| 单个组件内的打开、关闭、输入、hover/focus 派生状态 | 组件局部 `useState` / `useRef` | theme dropdown open、language dropdown open、表单字段、密码显示切换 | `uiPreferencesStore` |
| 多个 island 需要读取的小型 UI/preference 状态 | `src/stores/uiPreferencesStore.ts` + `src/hooks/useUiPreferences.ts` | theme mode、palette、Chat Widget open、preferences ready | Chat 消息、表单字段、auth session |
| 全站 provider 语义状态 | `src/components/providers` | theme DOM/storage 同步、语言切换、auth 探测 | 普通组件局部显示状态 |
| 复杂流程编排且不渲染 UI | `src/controllers` | Chat send/reset controller | JSX、CSS、DOM iframe protocol |
| 网络请求和 API transport | `src/services` | `apiClient`、`chatService`、`contactService` | React 生命周期、按钮状态 |

新增交互前先回答：

- 这个状态是否只影响一个组件实例？
- 是否需要跨 island 或跨页面读取？
- 是否涉及网络请求、流程编排、iframe protocol 或 provider DOM 同步？
- 是否可以用现有组件局部状态解决，而不扩大 store 面？

只有当状态需要跨 island 可读，且属于 UI/preference，而不是业务数据或用户输入时，才进入
`src/stores`。

## 组件模式

### Button 和 Icon Button

- 优先使用原生 `<button>`；提交按钮使用 `type="submit"`，其他交互按钮显式使用
  `type="button"`。
- 图标按钮必须有可读名称，例如 `aria-label`、可见文本或 `LocalizedSection`。
- 纯装饰 SVG 使用 `aria-hidden="true"` 和 `focusable="false"`。
- 选中态或切换态使用 `aria-pressed`，不要只依赖颜色或 `is-active` class。
- 禁用态使用 `disabled`，并确保禁用时不会继续触发请求、导航或重复提交；样式上也应抑制 hover/
  active 提升、使用 `cursor: not-allowed`，并保留可读的禁用文本或图标状态。
- 新增按钮样式优先复用 `c-btn-*`、`--focus-ring`、`--radius-*`、`--duration-*` 和语义颜色
  token。

### Disclosure、Popover 和 Menu

当前已有三类轻量 disclosure：

- `HamburgerMenu`：按钮 `aria-expanded`，portal 渲染侧边菜单，outside click 关闭。
- `LanguageSelector`：按钮 `aria-expanded`，选项容器使用 `role="listbox"`。
- `ThemeToggle`：按钮 `aria-expanded`，mode/palette 分组按钮使用 `aria-pressed`。

后续新增 disclosure/popover/menu 时：

- 触发器必须暴露 `aria-expanded`；如果语义明确，可补充 `aria-haspopup`。
- 选中态必须同时体现在 DOM 状态和可访问属性中。
- 点击外部关闭逻辑必须清理事件监听。
- 选择选项后应关闭临时面板，除非用户需要多选。
- 如果使用 `role="menu"`、`role="listbox"` 或复杂 roving tabindex，就必须实现并测试
  Escape、Tab、Arrow key 和 focus 移动；不要只加 ARIA role 却缺少键盘行为。
- 简单的导航链接列表可以保持普通 `<a>` 列表，不强行升级为 menu role。

### Dialog 和 Modal

当前 `Modal` / `ConfirmDialog` 是轻量确认对话框，用于导航登出确认。它提供：

- portal 到 `document.body`。
- overlay click close。
- `role="dialog"` 和 `aria-modal="true"`。

它当前不提供完整 dialog primitive。后续如果新增非简单确认类 modal，必须先补齐或新建共享
dialog primitive，并覆盖：

- 可访问名称：`aria-labelledby` 或 `aria-label`。
- 初始 focus、Tab focus trap、Escape close、关闭后 restore focus。
- body scroll 处理和移动端视口约束。
- backdrop click 是否关闭的明确规则。
- `npm run smoke:browser` 或 focused Playwright interaction proof。

在这些能力补齐前，不要把当前 `Modal` 当作通用复杂 dialog、表单 modal 或 nested modal 使用。

### Toast、Status 和 Inline Feedback

当前没有共享 toast 系统。优先使用靠近触发点的 inline feedback：

- 表单字段错误使用 `.c-invalid-feedback`。
- 表单成功/失败状态使用 `.c-form-message`、`.u-text-success`、`.u-text-error`。
- Chat loading 使用 `role="status"` 和 `aria-live="polite"`。
- 装饰性 skeleton 不应被屏幕阅读器重复读取。

只有当同一种短暂状态提示被两个以上页面或 island 复用，且 inline feedback 不适合时，才评审
共享 toast primitive。新增 toast 必须定义：

- 是否自动消失。
- `aria-live` politeness。
- 是否可手动关闭。
- 多条消息的堆叠、去重和超时规则。
- 是否允许包含操作按钮。

### Loading、Disabled、Empty 和 Error State

- 发起异步操作时应禁用会重复触发同一请求的按钮。
- loading 状态需要可读文本、`role="status"`，或可由上下文明确理解；不要只显示无文本 spinner。
- 只有装饰用途的 skeleton 使用 `aria-hidden="true"`。
- 空状态应说明“没有内容”以及下一步可执行动作；不要留下空白容器。
- 错误状态应靠近失败区域显示，并避免泄漏后端内部错误、URL、token 或用户输入内容。
- 认证跳转前的全屏 overlay 继续用于防止重复提交；新增 overlay 必须确认是否阻断键盘和屏幕
  阅读器路径。

## 键盘与 Focus

新增交互必须优先依赖原生可聚焦元素：

- `<button>`、`<a>`、`input`、`select`、`textarea` 优先于 `div role="button"`。
- `:focus-visible` 必须使用 `box-shadow: var(--focus-ring)` 或等效 token。
- 紧凑按钮和选项控件应有稳定的 touch target，并用 min-size、padding 或固定 aspect-ratio 避免
  hover/focus/loading 状态改变布局。
- 自定义 Enter/Space handler 只在原生行为不足时添加；如果添加，必须避免重复触发。
- 不要移除 outline 后不提供替代 focus 样式。
- 关闭 disclosure、modal 或 overlay 后，应评估是否需要把 focus 返回触发按钮。
- 影响 Tab 顺序、focus trap 或 keyboard close 的改动必须有组件测试或 browser smoke 证明。

当前部分轻量 dropdown 和 modal 还没有完整 keyboard primitive；后续如果提高语义角色复杂度，应先
补行为，再补 ARIA。

## Motion 与 Reduced Motion

- 动效时长继续使用 `--duration-fast`、`--duration-normal`、`--duration-slow`。
- 缓动继续使用 `--easing-standard`、`--easing-entrance`、`--easing-exit`。
- 大面积移动、overlay、drawer、iframe reveal、spinner/skeleton shimmer 必须考虑
  `prefers-reduced-motion: reduce`。
- JS 触发的动画如果不能通过 CSS reduced-motion token 控制，需要在组件中显式读取
  `matchMedia('(prefers-reduced-motion: reduce)')` 或避免强依赖动画。
- 动效不能成为唯一的状态表达；必须有文本、ARIA 状态、DOM attribute 或 class 状态辅助。

## 样式与 Token

交互组件样式继续遵循 `docs/STYLE_GUIDE.md`：

- 使用 `c-` 组件类、`u-` 工具类、`is-` 状态类和 `js-` 脚本钩子类。
- 新增颜色、边框、阴影、motion 和 focus 样式先找现有 token。
- 不在组件 CSS 中硬编码 palette 颜色；palette 逻辑通过 `data-palette` 和语义 token 映射。
- 固定格式控件应有稳定尺寸，避免 hover、loading、文字切换或 icon 切换导致布局跳动。
- 响应式布局优先使用容器查询；`@container` / `@media` 条件不要使用 CSS custom property。

## Browser Smoke 门禁

文档-only 或测试-only 改动不需要运行 browser smoke；最终报告应明确说明不适用。

以下改动必须运行 `npm run smoke:browser`：

- 导航、theme mode、palette、language selector、hamburger menu 或 top-level provider 行为。
- Chat Widget、`/deepseek_chat/`、iframe、`postMessage` 或 ready skeleton。
- `BaseLayout` 预绘制脚本、`data-theme`、`data-palette`、`data-lang` 或 hydration 指令。
- 影响 public page console health、CSP、Sentry browser 初始化或 inline/external script 输出。
- 新增或修改需要真实键盘/focus 验证的 dialog、popover、menu、toast 或 overlay。

如果 smoke 暴露既有问题，应先记录 blocker，不要把文档 slice 扩大成行为修复 slice。

## 共享 Primitive 判断

只有满足以下任一条件时，才新增共享 primitive：

- 同一种交互被两个以上页面或 island 复用。
- 交互需要 focus trap、roving tabindex、Escape close、restore focus 或复杂 keyboard support。
- 状态、样式、ARIA、motion 和测试门槛已经在局部组件中重复出现。
- 没有共享 primitive 会导致 iframe、provider、store 或 API 边界被重复实现。

不满足这些条件时，优先保留局部组件实现，并在组件附近保持清晰状态命名和测试。

新增共享 primitive 时，默认放置建议：

| 类型 | 位置 | 说明 |
| --- | --- | --- |
| 展示/输入小组件 | `src/components/ui` | 不拥有页面流程或网络请求。 |
| 复杂流程编排 | `src/controllers` | 不渲染 JSX，不操作 CSS。 |
| React 读取 store 的 hook | `src/hooks` | 包装 `src/stores`，保持 store framework-neutral。 |
| 组件样式 | `src/styles/components` | 使用 token、layer 和现有类名前缀。 |
| 浏览器 smoke | `tests/smoke` | 只覆盖真实浏览器才能证明的行为。 |

## 与现有文档的关系

- 架构与 hydration 边界见：[前端架构约定](./FRONTEND_ARCHITECTURE.md)。
- 目录放置和 import 方向见：[前端目录所有权地图](./DIRECTORY_OWNERSHIP.md)。
- 样式 token、focus ring、motion 和 class 约定见：[样式说明](./STYLE_GUIDE.md)。
- browser smoke 和测试命令见：[测试指南](./TESTING.md)。
- Phase 8 切片顺序见：[前端体验平台 RFC](./FRONTEND_EXPERIENCE_PLATFORM.md)。
- Chat Widget iframe ready 协议见：[Chat Widget 协议说明](./CHAT_WIDGET_PROTOCOL.md)。
