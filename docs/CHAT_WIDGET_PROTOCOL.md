<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Chat Widget 协议说明](#chat-widget-%E5%8D%8F%E8%AE%AE%E8%AF%B4%E6%98%8E)
  - [文档目的](#%E6%96%87%E6%A1%A3%E7%9B%AE%E7%9A%84)
  - [参与方](#%E5%8F%82%E4%B8%8E%E6%96%B9)
    - [父页面外壳](#%E7%88%B6%E9%A1%B5%E9%9D%A2%E5%A4%96%E5%A3%B3)
    - [父级 Widget](#%E7%88%B6%E7%BA%A7-widget)
    - [iframe 内 Chat 页面](#iframe-%E5%86%85-chat-%E9%A1%B5%E9%9D%A2)
    - [Chat 服务层](#chat-%E6%9C%8D%E5%8A%A1%E5%B1%82)
  - [当前消息类型](#%E5%BD%93%E5%89%8D%E6%B6%88%E6%81%AF%E7%B1%BB%E5%9E%8B)
  - [Origin 与 Source 校验](#origin-%E4%B8%8E-source-%E6%A0%A1%E9%AA%8C)
  - [加载生命周期](#%E5%8A%A0%E8%BD%BD%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)
    - [初始关闭](#%E5%88%9D%E5%A7%8B%E5%85%B3%E9%97%AD)
    - [首次打开](#%E9%A6%96%E6%AC%A1%E6%89%93%E5%BC%80)
    - [子页面 ready](#%E5%AD%90%E9%A1%B5%E9%9D%A2-ready)
    - [父级显示 iframe](#%E7%88%B6%E7%BA%A7%E6%98%BE%E7%A4%BA-iframe)
    - [关闭与再次打开](#%E5%85%B3%E9%97%AD%E4%B8%8E%E5%86%8D%E6%AC%A1%E6%89%93%E5%BC%80)
  - [当前失败与超时行为](#%E5%BD%93%E5%89%8D%E5%A4%B1%E8%B4%A5%E4%B8%8E%E8%B6%85%E6%97%B6%E8%A1%8C%E4%B8%BA)
  - [CSP 与 iframe 约束](#csp-%E4%B8%8E-iframe-%E7%BA%A6%E6%9D%9F)
  - [后续重构约束](#%E5%90%8E%E7%BB%AD%E9%87%8D%E6%9E%84%E7%BA%A6%E6%9D%9F)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Chat Widget 协议说明

- **作者**: 张人大
- **最后更新**: June 16, 2026, 22:13 (UTC+08:00)

## 文档目的

本文记录当前浮动 Chat Widget 与 `/deepseek_chat/` 同源 iframe 之间的
`postMessage` 协议、加载生命周期和安全边界，用于后续 Chat controller 拆分、服务层整理和评审。

本文只描述当前代码已经实现的行为，不记录目标设计，不包含私有服务器信息、密钥、内部主机、生产凭据或一次性运维细节。

## 参与方

### 父页面外壳

`src/layouts/BaseLayout.astro` 拥有全站文档 shell、metadata、全局样式入口和顶层 islands。默认情况下，layout 会把 `ChatWidget` 作为全局浮动 island 挂载，并使用 `client:visible` 延后水合。

当页面传入 `showChatWidget={false}` 时，layout 不挂载浮动 widget。`src/pages/deepseek_chat.astro` 当前使用该开关，避免 Chat 页面在 iframe 内再次加载全局浮动 widget。

### 父级 Widget

`src/components/chat/widgets/ChatWidget.tsx` 拥有浮动按钮、面板、iframe 容器、骨架屏和父级消息监听。它负责：

- 懒加载 `STYLE_PATHS.CHAT_WIDGET`。
- 在首次打开时创建 `/deepseek_chat/` iframe。
- 通过同源 `postMessage` ready 消息判断 iframe 内增强能力是否完成。
- 在打开状态变化时发布 `setChatWidgetOpen(open)` 到 UI preference store。
- 关闭时重置本次 iframe ready 状态。

### iframe 内 Chat 页面

`src/pages/deepseek_chat.astro` 是 iframe 加载的同源路由。它使用 `BaseLayout`，但关闭全局 Chat Widget，并以 `client:load` 挂载 `DeepseekChatContent`。

`src/components/chat/DeepseekChat/DeepseekChatContent.tsx` 只是 `Chat` 的内容包装层。实际 readiness 消息由 `src/components/chat/Chat.tsx` 发送。

### Chat 服务层

`src/services/chatService.ts` 拥有当前 Chat 流式请求和 reset 请求。它不是 iframe `postMessage` 协议的一部分，也不应接收或解释 widget ready 消息。

## 当前消息类型

当前协议使用浏览器 `window.postMessage`。方向目前只有 iframe 内 Chat 页面到父级 widget。

| 方向 | 发送方 | 接收方 | 消息结构 | 当前含义 | 父级处理 |
| --- | --- | --- | --- | --- | --- |
| 子页面到父页面 | `/deepseek_chat/` 中的 `Chat.tsx` | `ChatWidget.tsx` | `{ type: 'chat-page-ready' }` | Chat 历史记录已进入可渲染状态。 | 当前不处理。 |
| 子页面到父页面 | `/deepseek_chat/` 中的 `Chat.tsx` | `ChatWidget.tsx` | `{ type: 'chat-enhancement-ready' }` | Chat 页面和 Markdown 增强库已完成当前 ready 条件。 | 校验通过后设置 `iframeLoaded=true`，隐藏骨架屏并显示 iframe。 |

当前没有父页面到子页面的 widget 控制消息，也没有 resize、error、close、auth 或 streaming 消息。

## Origin 与 Source 校验

父级 `ChatWidget` 只在以下条件全部满足时接受消息：

- `event.origin === window.location.origin`
- `event.source === iframeRef.current?.contentWindow`
- `event.data?.type === 'chat-enhancement-ready'`

这意味着：

- iframe 必须保持同源。
- 来自其他窗口、其他 iframe、浏览器扩展或跨域页面的消息会被忽略。
- 即使同源页面发送 `chat-enhancement-ready`，只要不是当前 iframe 的 `contentWindow`，也不会触发 ready 状态。
- `chat-page-ready` 当前会被监听器看到，但不会改变父级 widget 状态。

子页面发送消息时使用 `window.parent.postMessage({ type }, window.location.origin)`。不要把目标 origin 放宽为 `'*'`。

## 加载生命周期

### 初始关闭

`ChatWidget` 初始状态由 `defaultOpen` 决定，默认关闭。默认关闭时：

- `open=false`
- `shouldLoad=false`
- `iframeLoaded=false`
- 面板和 iframe 不渲染
- 浮动按钮可见

### 首次打开

用户点击浮动按钮后，`open` 变为 `true`。如果此前没有加载过 iframe，`shouldLoad` 被设置为 `true`，随后面板渲染 iframe：

- iframe `src` 为 `${CHAT_PAGE_PATH}/`，当前对应 `/deepseek_chat/`。
- iframe 使用 `loading="lazy"`。
- iframe 外层 `.c-chat-widget-frame-wrapper` 设置 `aria-busy={!iframeLoaded}`。
- iframe 在 ready 前没有 `is-loaded` class，透明度为 0。
- `.c-chat-widget-skeleton` 在 ready 前覆盖在 iframe 容器内。

### 子页面 ready

iframe 内 `Chat.tsx` 在以下条件下发送 readiness 消息：

- `chat-page-ready`：Chat 历史状态进入 ready，或消息列表完成一次渲染回调。
- `chat-enhancement-ready`：Chat 历史状态 ready、增强库 `highlight.js` 与 `mermaid` 动态导入完成，并且当前还没有发送过 enhancement ready。

当消息列表存在时，`ChatMessageList` 完成渲染后会调用 `onRendered`，`Chat.tsx` 也会在该路径上尝试发送 ready 消息。`pageReadyRef` 和 `enhancementReadyRef` 确保每种 ready 消息在当前 React 组件生命周期内只发送一次。

### 父级显示 iframe

父级 widget 只处理 `chat-enhancement-ready`。校验通过后：

- `iframeLoaded=true`
- `.c-chat-widget-frame-wrapper` 的 `aria-busy` 变为 `false`
- iframe 获得 `is-loaded` class
- iframe 透明度切换为 1
- 骨架屏被移除

父级不使用 iframe `onLoad` 作为 ready 信号，因为 `onLoad` 可能早于 Markdown、高亮和 Mermaid 增强完成。

### 关闭与再次打开

用户再次点击浮动按钮，或在打开状态下点击面板和按钮以外区域，会关闭 widget：

- `open=false`
- 面板从 React 树中移除
- `iframeLoaded=false`
- `shouldLoad` 保持为 `true`
- UI preference store 收到 `setChatWidgetOpen(false)`

再次打开时，面板会重新渲染 iframe，并等待新的 `chat-enhancement-ready` 消息。组件卸载时也会发布 `setChatWidgetOpen(false)`。

## 当前失败与超时行为

当前代码没有实现显式 ready 超时、错误提示或降级按钮。

如果 iframe 内页面没有发送有效的 `chat-enhancement-ready`：

- 父级 widget 会保持 `iframeLoaded=false`。
- 骨架屏会继续显示。
- iframe 外层会继续保持 `aria-busy=true`。
- iframe 本身不会因为 ready 失败而自动卸载。

如果增强库动态导入失败，`Chat.tsx` 会设置内部 `loadError=true` 并更新 Chat 输入占位文案，但不会向父级发送专门的 error 消息。关闭后再次打开会重新创建 iframe，从而重新走一次 iframe 页面初始化流程。

## CSP 与 iframe 约束

Chat Widget iframe 依赖同源加载。当前约束是：

- Widget iframe 来源保持 `/deepseek_chat/` 同源。
- 父级必须继续同时校验 `event.origin` 和 `event.source`。
- 子页面必须继续使用 `window.location.origin` 作为 `postMessage` 目标 origin。
- `/deepseek_chat/` 必须继续关闭全局 Chat Widget，避免 iframe 内递归挂载浮动 widget。
- 不要为该协议新增跨域 iframe 来源，除非先重新设计 CSP、origin 校验、认证边界和文档。

Credly badge iframe 是独立例外，不属于 Chat Widget 协议。Credly 相关约束见 [前端架构约定](./FRONTEND_ARCHITECTURE.md) 中的 iframe 说明。

## 后续重构约束

当前 Chat controller 和后续 API client 重构应遵守以下约束：

- `postMessage` 协议不是后端 API，不应放入 `chatService.ts` 的流式请求路径。
- 新增消息类型前，先在本文记录方向、结构、触发条件、接收方处理和失败语义。
- 父页面到子页面的消息如果被引入，必须指定当前 iframe `contentWindow`，并使用同源 target origin。
- 消息 payload 不应携带访问令牌、cookie、会话内容、内部 URL 或其他敏感信息。
- Chat streaming 状态仍由 Chat 页面和后续 controller 边界处理，不应塞进 `uiPreferencesStore`。
- 修改 ready 时序时，需要回归 BUG-054 中的骨架屏闪烁问题，确保父级不会早于 Markdown 增强完成而显示 iframe。
