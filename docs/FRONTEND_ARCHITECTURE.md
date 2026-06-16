<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [前端架构约定](#%E5%89%8D%E7%AB%AF%E6%9E%B6%E6%9E%84%E7%BA%A6%E5%AE%9A)
  - [文档目的](#%E6%96%87%E6%A1%A3%E7%9B%AE%E7%9A%84)
  - [分层职责](#%E5%88%86%E5%B1%82%E8%81%8C%E8%B4%A3)
    - [BaseLayout](#baselayout)
    - [Astro 页面](#astro-%E9%A1%B5%E9%9D%A2)
    - [React Islands](#react-islands)
  - [渲染与 Hydration](#%E6%B8%B2%E6%9F%93%E4%B8%8E-hydration)
    - [服务端标记优先](#%E6%9C%8D%E5%8A%A1%E7%AB%AF%E6%A0%87%E8%AE%B0%E4%BC%98%E5%85%88)
    - [当前允许的 client 指令](#%E5%BD%93%E5%89%8D%E5%85%81%E8%AE%B8%E7%9A%84-client-%E6%8C%87%E4%BB%A4)
  - [状态所有权](#%E7%8A%B6%E6%80%81%E6%89%80%E6%9C%89%E6%9D%83)
  - [服务与 API 所有权](#%E6%9C%8D%E5%8A%A1%E4%B8%8E-api-%E6%89%80%E6%9C%89%E6%9D%83)
  - [工具函数所有权](#%E5%B7%A5%E5%85%B7%E5%87%BD%E6%95%B0%E6%89%80%E6%9C%89%E6%9D%83)
  - [样式与 Token 所有权](#%E6%A0%B7%E5%BC%8F%E4%B8%8E-token-%E6%89%80%E6%9C%89%E6%9D%83)
  - [CSP、iframe 与 postMessage](#cspiframe-%E4%B8%8E-postmessage)
    - [CSP 敏感改动](#csp-%E6%95%8F%E6%84%9F%E6%94%B9%E5%8A%A8)
    - [Chat Widget iframe 契约](#chat-widget-iframe-%E5%A5%91%E7%BA%A6)
    - [Credly iframe 例外](#credly-iframe-%E4%BE%8B%E5%A4%96)
  - [新增或修改功能时的检查项](#%E6%96%B0%E5%A2%9E%E6%88%96%E4%BF%AE%E6%94%B9%E5%8A%9F%E8%83%BD%E6%97%B6%E7%9A%84%E6%A3%80%E6%9F%A5%E9%A1%B9)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 前端架构约定

- **作者**: 张人大
- **最后更新**: June 16, 2026, 22:13 (UTC+08:00)

## 文档目的

本文记录当前 Astro + React 前端的实际架构约定，用于后续维护、评审和重构切片对齐。它描述的是当前代码库已经采用的边界，不是新的目标架构。

本文只覆盖前端公开仓库内的约定，不记录私有服务器细节、密钥、内部 IP、生产凭据或临时运维信息。

目录级职责边界见：[前端目录所有权地图](./DIRECTORY_OWNERSHIP.md)。

## 分层职责

### BaseLayout

`src/layouts/BaseLayout.astro` 是全站页面外壳，负责以下边界：

- 文档结构，包括 `<html>`、`<head>`、`<body>`、页面主区域、页脚和命名 slot。
- 页面级元数据、SEO、Open Graph、Twitter Card、结构化数据和资源 hint。
- 全局样式入口 `src/styles/theme.css`。
- 主题、语言、页面标题和登录状态的渲染前初始化。
- 全局导航，通过 `NavBarWrapper` 使用 `client:load` 水合。
- 可选的 `ChatWidget`，通过 `showChatWidget` 控制，并使用 `client:visible` 延后水合。
- 页面内容 slot 和 `bodyEnd` slot。

`/js/base-layout-init.js` 由 `src/scripts/base-layout-init.ts` 编译生成。该脚本在页面渲染前同步主题、语言、标题和登录状态，避免首屏闪烁，并让 404/500 等静态页面复用同一套初始化逻辑。

### Astro 页面

`src/pages` 下的 Astro 页面拥有路由级职责：

- 设置当前路由的标题、描述、语言、布局开关和其他 `BaseLayout` props。
- 产出优先可静态渲染的 HTML 标记。
- 选择当前页面需要的 React island。
- 管理页面专属的结构和样式入口。
- 仅在页面确实需要交互时添加水合组件。

页面不应把全站状态、跨页面 API 契约或通用样式规则内联在路由文件中。可复用逻辑应进入 `src/components`、`src/services`、`src/utils` 或 `src/styles` 的对应层。

### React Islands

React 组件只承担需要浏览器交互的部分，例如导航、登录表单、页面内容交互、文档/证书页效果、Chat 页面和全局浮动 Chat Widget。

React island 应满足以下约定：

- 优先让 Astro 输出稳定的服务端标记，再在需要时水合。
- 不接管整页布局职责。
- 不复制 `BaseLayout` 已经拥有的文档 shell、metadata、全局初始化和全局样式入口职责。
- 与后端交互时走服务层，避免在展示组件中散落 fetch 细节。
- 对浏览器专属 API 做挂载后访问，避免服务端渲染阶段读取 `window`、`document` 或存储对象。

## 渲染与 Hydration

### 服务端标记优先

默认选择 Astro 静态标记。只有在用户交互、浏览器 API、实时状态、第三方 iframe 或动态效果确实需要客户端 JavaScript 时，才使用 React island。

首屏关键内容应尽量由 Astro 直接输出，React 负责补充交互，而不是把静态内容整体转为客户端渲染。

### 当前允许的 client 指令

当前代码中实际使用的水合指令只有 `client:load` 和 `client:visible`。

`client:load` 用于页面打开后立即需要的交互：

- 全局导航和返回顶部按钮。
- 页面主要交互内容 island。
- 文档页和证书页需要立即绑定的效果。
- 登录、注册、个人资料、密码重置等认证相关表单。
- `/deepseek_chat/` 页面主体。

`client:visible` 用于优先级较低、可等待进入视口后再水合的全局组件：

- 当前典型用例是 `ChatWidget`。

新增 `client:idle`、`client:media`、`client:only` 或其他水合方式前，应先确认现有指令无法满足需求，并同步更新本文或相关设计说明。

## 状态所有权

当前 provider 状态仍由 `src/components/layouts/NavBarWrapper.tsx` 挂载：

- `ThemeProvider` 负责主题状态、`data-theme` 同步和主题存储。
- `I18nProvider` 负责初始语言、语言切换、`documentElement.lang` 和 `langChanged` 事件。
- `AuthProvider` 负责登录状态、`data-logged-in` 同步、用户信息探测和未授权状态清理。

Slice 3.1 引入 `src/stores/uiPreferencesStore.ts` 作为轻量、本地、无额外依赖的客户端 UI/preference store。当前范围只包括：

- 当前主题 mode。
- Chat Widget 打开/关闭状态。
- 偏好状态是否已经由客户端 provider 同步完成。

该 store 是跨 island 读取边界，不替代现有 provider：

- `ThemeProvider` 仍拥有主题 context、DOM `data-theme` 同步和主题存储写入，同时把已解析主题发布到 store。
- `ThemeToggle` 等主题控制组件读取 store snapshot 判断当前选中状态，但主题切换写入仍通过 `ThemeProvider` 统一执行。
- `ChatWidget` 仍拥有 iframe、lazy load、点击关闭和 ready message 处理，同时把打开/关闭状态发布到 store。
- React island 如需读取这类偏好状态，应通过 `src/hooks/useUiPreferences.ts` 或 store 的订阅接口读取，不应复制 provider 状态。

当前没有引入 `nanostores` 或其他状态库。store 范围应保持小型、客户端、UI/preference 导向；Chat 流式消息状态、认证 session、API request 状态和复杂流程控制不属于该 store。

如果组件只需要读取语言，可使用现有语言工具和 provider 暴露的接口，不应绕过它们直接维护另一份语言状态。

## 服务与 API 所有权

`src/services/apiClient.ts` 是 typed JSON API 的默认入口。普通 JSON 端点应通过该客户端处理：

- 基础 URL 和端点拼接。
- `credentials: include`。
- JSON 请求/响应解析。
- HTTP 错误对象。
- 未授权跳转或跳过未授权跳转的显式选项。

服务模块应暴露领域语义清晰的函数，而不是让 React 组件直接拼 URL、设置通用请求头或重复解析错误结构。

`src/controllers/chatController.ts` 是当前 Chat 交互编排边界。它负责发送消息时的本地历史更新、首个 chunk 状态回调、assistant 消息 upsert/finalize、reset 后清理回调，以及可测试的 active request abort 边界；它不渲染 JSX，也不直接处理 iframe ready protocol。

`src/services/chatService.ts` 仍是 Chat 流式响应的专用 transport 路径。它负责 `/deepseek_chat/` 相关的 `fetch`、`credentials: include`、流式 NDJSON 读取、可选 `AbortSignal`、401 跳转和 reset endpoint 调用。该路径在后续 API client 重构切片前保持独立，不应被普通 JSON API 调用复用。

## 工具函数所有权

`src/utils` 放置不直接拥有 UI 的通用工具。当前主要职责包括：

- 环境变量快照、别名解析和 CDN URL 辅助。
- 本地存储、会话存储、cookie、IndexedDB 和内存 fallback。
- 语言读取、语言规范化和默认语言判断。
- 日志与 Sentry 辅助。
- 密码策略、认证辅助和输入校验。
- 图片路径、响应式图片和占位图辅助。

工具函数可以被页面、组件和服务复用，但不应隐式改变 UI 状态、发起页面跳转或承担业务流程控制。需要副作用时，应让调用方显式触发。

## 样式与 Token 所有权

全局样式入口是 `src/styles/theme.css`。它负责按 cascade layer 聚合 reset、tokens、base、components、utilities 和 overrides。

样式维护遵循以下约定：

- 基础设计 token 属于 `src/styles/core/tokens.css`；主题语义别名和 `data-theme` 覆盖属于 `src/styles/core/theme-tokens.css`；渐变 token 属于 `src/styles/core/_gradients.css`。
- 布局基础规则属于 `src/styles/layout.css` 等 base/layout 文件。
- 可复用组件样式放在 `src/styles/components`。
- 通用工具类放在 `src/styles/utilities`。
- 页面或组件新增样式应优先复用现有 token、语义颜色、间距、层级和类名前缀。
- 组件类名继续使用既有 `c-`、`u-`、`is-`、`js-` 等约定。
- media query 和 container query 条件中不要使用 CSS custom property。

React 组件不应通过大量内联样式绕过 token 系统。确实需要运行时计算的样式，应控制在局部，并保留可维护的 class 结构。

## CSP、iframe 与 postMessage

### CSP 敏感改动

生产 CSP 由 Nginx 配置控制。前端代码应避免新增内联可执行脚本，除非已经明确评审 CSP 影响并更新相关文档。

`BaseLayout` 当前保留的初始化路径是外部脚本 `/js/base-layout-init.js`。该脚本是主题、语言、标题和认证状态渲染前初始化的一部分，修改时应同时验证静态错误页、主题首屏状态和语言首屏状态。

### Chat Widget iframe 契约

`ChatWidget` 使用同源 iframe 加载 `/deepseek_chat/`。当前契约如下：

- iframe 来源保持同源。
- 父页面只接受来自当前 iframe `contentWindow` 的消息。
- Chat 页面使用 `window.location.origin` 作为 `postMessage` 目标 origin。
- iframe 内页面通过 ready 消息通知父页面增强能力已就绪。
- 不要把 Chat Widget 改成跨域 iframe，除非先重新设计 CSP、消息 origin 校验和认证边界。

消息类型、ready 生命周期、失败行为和后续重构约束见：[Chat Widget 协议说明](./CHAT_WIDGET_PROTOCOL.md)。

### Credly iframe 例外

证书页允许 Credly badge iframe。该例外依赖 CSP 中允许 `https://www.credly.com` 的 iframe 来源。

Credly iframe 组件使用显式 load/error/timeout 处理，并在清理时移除监听和重置 iframe。修改该区域时，应验证证书页 iframe 能加载、失败状态可恢复，且不会扩大 iframe 来源范围。

## 新增或修改功能时的检查项

- 能用 Astro 静态标记完成的内容，不新增 React island。
- 需要交互时，优先选择现有 `client:load` 或 `client:visible` 约定。
- 页面只拥有路由级 metadata、布局 props、静态结构和页面 island 选择。
- API 请求优先进入 `src/services/apiClient.ts` 或已有服务模块。
- 跨 island UI/preference 状态优先进入 `src/stores/uiPreferencesStore.ts`，React 读取放在 `src/hooks/useUiPreferences.ts`。
- Chat 流式路径继续留在 `chatService.ts`，直到后续重构切片处理。
- 样式优先使用 `theme.css` 聚合的 token、layer、组件类和工具类。
- 新增 iframe、`postMessage`、脚本或 CSP 敏感逻辑前，先评审 origin、权限边界和文档更新需求。
