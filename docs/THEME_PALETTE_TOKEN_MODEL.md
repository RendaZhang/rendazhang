<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [主题调色板 Token 模型](#%E4%B8%BB%E9%A2%98%E8%B0%83%E8%89%B2%E6%9D%BF-token-%E6%A8%A1%E5%9E%8B)
  - [文档目的](#%E6%96%87%E6%A1%A3%E7%9B%AE%E7%9A%84)
  - [当前事实](#%E5%BD%93%E5%89%8D%E4%BA%8B%E5%AE%9E)
  - [术语边界](#%E6%9C%AF%E8%AF%AD%E8%BE%B9%E7%95%8C)
  - [DOM、存储与 readiness 模型](#dom%E5%AD%98%E5%82%A8%E4%B8%8E-readiness-%E6%A8%A1%E5%9E%8B)
    - [DOM attribute](#dom-attribute)
    - [Storage key](#storage-key)
    - [Readiness](#readiness)
  - [Token 所有权](#token-%E6%89%80%E6%9C%89%E6%9D%83)
    - [`tokens.css`](#tokenscss)
    - [`theme-tokens.css`](#theme-tokenscss)
    - [`_gradients.css`](#_gradientscss)
    - [组件样式](#%E7%BB%84%E4%BB%B6%E6%A0%B7%E5%BC%8F)
  - [颜色格式与 fallback](#%E9%A2%9C%E8%89%B2%E6%A0%BC%E5%BC%8F%E4%B8%8E-fallback)
  - [对比度、动效与可访问性](#%E5%AF%B9%E6%AF%94%E5%BA%A6%E5%8A%A8%E6%95%88%E4%B8%8E%E5%8F%AF%E8%AE%BF%E9%97%AE%E6%80%A7)
  - [MVP 影响范围](#mvp-%E5%BD%B1%E5%93%8D%E8%8C%83%E5%9B%B4)
  - [后续切片契约](#%E5%90%8E%E7%BB%AD%E5%88%87%E7%89%87%E5%A5%91%E7%BA%A6)
  - [非目标](#%E9%9D%9E%E7%9B%AE%E6%A0%87)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 主题调色板 Token 模型

- **作者**: 张人大
- **最后更新**: June 28, 2026, 17:07 (UTC+08:00)

## 文档目的

本文定义 Phase 8 后续主题 palette/accent 工作的设计模型。它记录当前 Astro + React
前端已经存在的 theme mode、store、provider、CSS token 和浏览器 smoke 边界，并为 Slice
8.3 之后的 store、provider、CSS 和控制 UI 提供约束。

本文是公开安全文档，不记录私有服务器细节、密钥、生产凭据、内部主机、用户数据或临时运维状态。
本文记录当前已经落地的 palette MVP 边界，不记录私有部署状态。

## 当前事实

- 当前 theme mode 仍只有 light/dark，由 `BaseLayout` 预绘制脚本、`ThemeProvider`、
  `html[data-theme]`、`preferred_theme` storage 和 `uiPreferencesStore` 共同维护。
- 当前 palette 支持 `default`、`aurora` 和 `forest`，由 `BaseLayout` 预绘制脚本、
  `ThemeProvider`、`html[data-palette]`、`preferred_palette` storage 和
  `uiPreferencesStore` 共同维护。
- `ThemeProvider` 仍拥有 DOM `data-theme` 与 `data-palette` 同步和主题偏好存储写入；
  store 是跨 island 读取边界。
- `src/styles/theme.css` 负责聚合 `reset`、`tokens`、`base`、`components`、
  `utilities` 和 `overrides` cascade layer。
- `src/styles/core/tokens.css` 放基础颜色、状态色、中性色、Markdown/page 专用色、间距、
  字体、motion、阴影和 overlay token。
- `src/styles/core/theme-tokens.css` 放当前主题语义别名、`html[data-theme='dark']` 覆盖
  和 `html[data-palette]` 语义映射。
- `src/styles/core/_gradients.css` 放基于基础色和语义覆盖的渐变 token。
- `npm run smoke:browser` 已覆盖首页、`/deepseek_chat/`、Chat Widget iframe ready、主题
  mode 切换和 palette 切换的 DOM/storage/console 行为。

## 术语边界

| 概念 | 当前状态 | 后续边界 |
| --- | --- | --- |
| `theme mode` | 已存在，值为 `light` 或 `dark`。无存储值时预绘制脚本可跟随系统偏好解析为有效 light/dark。 | 继续由 `data-theme` 表达，不塞入 palette 名称。 |
| `palette` | 已实现 `default`、`aurora` 和 `forest`。当前品牌紫、蓝、渐变和语义色是 `default` palette 基线。 | 表达一组品牌色、强调色、语义映射和渐变约束；独立于 light/dark。 |
| `accent` | 尚未实现。当前 `--color-accent` 是基础色 token，不是用户可选 accent 状态。 | 只在后续确实需要局部强调色选择时加入；不提前扩大 DOM/storage/UI 面。 |

基本原则：

- `data-theme` 只表示 light/dark mode。
- palette/accent 不承担语言、认证、Chat 消息、后端数据或 API request 状态。
- 组件继续读取语义 token，不直接根据 palette 名称写硬编码颜色。
- 用户可见控制应保持紧凑，并继续通过 browser smoke gate 验证。

## DOM、存储与 readiness 模型

### DOM attribute

palette 的 DOM 表达是 `html[data-palette]`。默认 palette 命名为 `default`；非默认
MVP 值是 `aurora` 和 `forest`。`data-theme` 仍只表示 light/dark mode。

推荐组合方式：

```css
:root {
  /* default palette fallback */
}

html[data-palette='default'] {
  /* 只有需要显式覆盖时才添加 */
}

html[data-palette='aurora'] {
  /* palette raw/semantic overrides */
}

html[data-theme='dark'][data-palette='aurora'] {
  /* dark mode + palette 组合需要的语义覆盖 */
}
```

`data-accent` 暂未实现。只有当 palette 内需要多个局部强调色，且
CSS token 无法通过 palette 语义变量表达时，才评审是否添加 `html[data-accent]`。

### Storage key

当前存储键 `preferred_theme` 保持不变。后续建议：

| 状态 | 推荐 key | 默认值 | 说明 |
| --- | --- | --- | --- |
| theme mode | `preferred_theme` | 当前逻辑：无值时按系统偏好解析 | 已存在，不改名。 |
| palette | `preferred_palette` | `default` | 当前支持 `default`、`aurora` 和 `forest`，只保存公开安全枚举值。 |
| accent | `preferred_accent` | 待定 | 不建议在没有 UI/需求前实现。 |

存储值必须是短枚举字符串，不保存用户输入、颜色自由文本、PII、token、聊天内容或服务端数据。

### Readiness

当前 `uiPreferencesStore` 的 `preferencesReady` 表示 provider 已完成客户端偏好同步。palette
MVP 复用该 readiness，没有新增 `paletteReady`。后续如果拆出更明确的 `paletteReady`，必须先满足：

- SSR/预绘制脚本和 React 首次水合读取同一默认值。
- 按钮选中态不会在 hydration 前后读到冲突状态。
- `npm run smoke:browser` 仍能验证 DOM attribute、storage 和 console 行为。

如果 palette DOM attribute 需要预绘制阶段设置，应扩展 `src/scripts/base-layout-init.ts`
的外部脚本，而不是新增 inline executable script。

## Token 所有权

### `tokens.css`

`src/styles/core/tokens.css` 继续拥有基础值：

- 现有 `--color-brand`、`--color-accent`、`--color-brand-secondary`、
  `--color-brand-tertiary`、`--color-brand-blue`。
- 状态色、中性色、Markdown/page 专用色。
- spacing、typography、motion、shadow、overlay token。

palette 原始值放在这里，并保持清晰分组，例如：

```css
--palette-default-brand: ...;
--palette-default-accent: ...;
--palette-aurora-brand: ...;
--palette-aurora-accent: ...;
```

组件不应直接读取 `--palette-*` 原始值；组件应读取 `theme-tokens.css` 暴露的语义 token。

### `theme-tokens.css`

`src/styles/core/theme-tokens.css` 是语义解析层。当前它拥有：

- `--color-bg`
- `--color-text`
- `--color-nav-bg`
- `--color-nav-text`
- `--color-surface`
- `--shadow-login`
- Markdown legacy alias
- `html[data-theme='dark']` 覆盖

palette 在这一层把原始 palette 值映射到语义变量，例如：

```css
html[data-palette='aurora'] {
  --color-brand: var(--palette-aurora-brand);
  --color-accent: var(--palette-aurora-accent);
}
```

light/dark 组合需要改变语义时，使用组合 selector：

```css
html[data-theme='dark'][data-palette='aurora'] {
  --color-nav-bg: ...;
  --color-surface: ...;
}
```

不要把组件选择器放进 `theme-tokens.css`。该文件只负责全局语义 token 和 DOM attribute
映射。

### `_gradients.css`

`src/styles/core/_gradients.css` 继续拥有渐变 token：

- `--gradient-primary`
- `--gradient-dark`
- 404/50x 页面渐变

palette 改变渐变时，应优先让渐变引用语义或 palette 原始 token，而不是在按钮、
Chat Widget 或导航样式中重复写 `linear-gradient(...)`。

### 组件样式

组件样式只拥有局部呈现和组件级变量：

- 导航和 theme control：`src/styles/components/navigation/navigation.css`
- 按钮：`src/styles/components/button/button.css`
- 表单：`src/styles/components/form/form.css`
- Chat Widget：`src/styles/components/chat_widget.css`
- Chat 页面：`src/styles/components/deepseek_chat.css`
- Markdown、docs、certifications、profile 等页面相关样式

组件样式可以组合语义 token，例如 `--color-bg`、`--color-text`、`--gradient-primary`、
`--focus-ring`，但不应定义全局 palette 值或依赖未记录的 DOM attribute。

## 颜色格式与 fallback

当前颜色 token 使用 OKLCH 为主，并通过 `color-mix(in srgb, ...)` 和
`@supports (color: oklch(...))` 维护现代浏览器表现。后续 palette 需要遵循同一原则：

- 每个新增颜色 token 必须有用途注释。
- 同一 palette 的色相、明度和彩度应成组设计，不只替换一个品牌色。
- 高彩度颜色应限制使用面积，避免把页面推成单一强饱和色主题。
- 不要只依赖渐变表达 palette；纯色 fallback、focus ring 和禁用态也要可读。
- 如新增 OKLCH 值，需要检查 sRGB 显示是否仍可接受。

## 对比度、动效与可访问性

palette/accent 实现必须满足：

- 正文文本对比度不低于 4.5:1。
- UI 文本、图标、边框和 focus ring 对比度不低于 3:1。
- 深色模式和浅色模式都要检查，不只检查默认 mode。
- 主题切换不应新增不可关闭的大范围动效；已有 motion token 会在
  `prefers-reduced-motion: reduce` 下被压缩。
- 组件 hover、active、disabled、loading、error、success 和 focus-visible 状态都要能读清。
- 影响主题、导航、Chat Widget、iframe 或 hydration 顺序时，必须运行 `npm run smoke:browser`。

如果后续 palette 切片修改 CSS token，应优先补跑：

```bash
npm run test:ui-contrast
npm run smoke:browser
```

`test:ui-contrast` 不能替代人工检查或浏览器 smoke，但可以作为批量色值回归的辅助信号。

## MVP 影响范围

第一个用户可见 palette MVP 应优先控制影响面。当前最小关注范围：

| 区域 | 文件或组件 | 风险 |
| --- | --- | --- |
| 导航与主题控制 | `ThemeToggle.tsx`、`navigation.css` | 控制 UI、按钮状态、移动端宽度、focus ring。 |
| 全局按钮 | `button.css` | `--gradient-primary`、hover、disabled、白字对比度。 |
| 表单 | `form.css` 和认证表单组件 | focus ring、错误/成功状态、输入背景。 |
| Chat Widget | `ChatWidget.tsx`、`chat_widget.css` | 同源 iframe ready、浮动按钮渐变、skeleton 可读性。 |
| Chat 页面 | `deepseek_chat.css`、Markdown 样式 | 消息气泡、输入框、代码块、Mermaid/Highlight 增强。 |
| Markdown/docs/certifications/profile | 对应 `components/*.css` | 页面专用色和旧 alias 可能绕过语义 token。 |

MVP 不应同时重做页面布局、Chat 流程、auth 流程或后端 API。

## 后续切片契约

Slice 8.4 已按本文约束落地第一个 palette 控制 MVP。后续进入更复杂 palette/accent 前，应继续满足：

- `src/stores/uiPreferencesStore.ts` 已包含 `default` / `aurora` / `forest` palette 枚举、
  默认值、读取和持久化 helper；新增 palette 值必须先扩展该枚举并补测试。
- store 必须保持 framework-neutral，不导入 React、services、components、styles 或 DOM-only 模块。
- React 读取层继续放在 `src/hooks/useUiPreferences.ts` 或同层 hook。
- `ThemeProvider` 当前同步 `data-palette`；如需拆分 palette provider，应先更新架构文档。
- 预绘制写入 `data-palette` 走外部 `base-layout-init` 路径，避免新增 inline executable script。
- 当前用户可见控制位于导航的 `ThemeToggle` 弹层，使用 swatch 按钮，不扩展为大范围主题面板。
- 任一实现切片都要更新 `docs/FRONTEND_ARCHITECTURE.md`、`docs/DIRECTORY_OWNERSHIP.md`、
  `docs/STYLE_GUIDE.md` 或 `docs/TESTING.md` 中被改变的事实。

## 非目标

本文不批准以下改动：

- 大范围 theme redesign。
- 新 accent store 状态实现。
- 运行时 CSS token 大规模改名。
- Astro、React、Vite、Vitest、ESLint、TypeScript、Node 或 Python 升级。
- Chat Widget iframe 协议、Chat streaming、auth/session、contact form 或 API 合约变化。
- 后端、Nginx、SSH、生产服务重启或生产服务器状态变更。
