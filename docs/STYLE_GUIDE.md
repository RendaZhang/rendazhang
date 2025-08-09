<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [样式说明](#%E6%A0%B7%E5%BC%8F%E8%AF%B4%E6%98%8E)
  - [简介](#%E7%AE%80%E4%BB%8B)
  - [当前架构](#%E5%BD%93%E5%89%8D%E6%9E%B6%E6%9E%84)
  - [目录结构](#%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84)
  - [CSS / 浏览器基线（2024/2025）](#css--%E6%B5%8F%E8%A7%88%E5%99%A8%E5%9F%BA%E7%BA%BF20242025)
    - [必备特性](#%E5%BF%85%E5%A4%87%E7%89%B9%E6%80%A7)
    - [渐进增强](#%E6%B8%90%E8%BF%9B%E5%A2%9E%E5%BC%BA)
  - [PostCSS 集成](#postcss-%E9%9B%86%E6%88%90)
  - [配色方案](#%E9%85%8D%E8%89%B2%E6%96%B9%E6%A1%88)
  - [扩展与约定](#%E6%89%A9%E5%B1%95%E4%B8%8E%E7%BA%A6%E5%AE%9A)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 样式说明

- **作者**: 张人大 (Renda Zhang)
- **最后更新**: August 09, 2025, 17:29 (UTC+08:00)

---

## 简介

本指南概述了项目当前的样式体系、构建工具链、配色方案以及未来可扩展的方向。

---

## 当前架构

项目的样式位于 `src/styles/` 目录，按职责划分为以下几个部分：

- `core/`：定义全局颜色、间距、渐变等基础变量。
- `utilities/`：提供布局、工具类等复用样式。
- `components/`：存放各页面或组件的独立样式文件。
- `theme.css`：作为入口文件，统一导入上述基础与工具样式并声明全局 CSS 变量，并在内部定义 `@layer reset, tokens, base, components, utilities, overrides;` 来管理层叠顺序。

各目录与层级的对应关系如下：

- `reset`：浏览器重置与基础清理样式。
- `tokens`：`core/` 中的设计令牌及派生变量。
- `base`：基础排版和语言辅助等全局元素样式（如 `layout.css`）。
- `components`：组件级样式文件。
- `utilities`：工具类与布局系统。
- `overrides`：最终的特殊覆盖（如 `dark-mode.css`）。

这种分层结构使得核心设计令牌与业务样式解耦，便于维护和扩展。

---

## 目录结构

```
src/
└── styles/
    ├── core/
    ├── utilities/
    ├── components/
    └── theme.css
```

---

## CSS / 浏览器基线（2024/2025）

本项目以 [Web Platform Baseline 2024](https://web.dev/baseline/2024/) 为基础，确保主要功能在现代浏览器中可用，并将随 [Baseline 2025](https://web.dev/baseline/2025/) 持续迭代。

### 必备特性
- [容器查询](https://developer.mozilla.org/docs/Web/CSS/CSS_container_queries) — [Can I Use](https://caniuse.com/css-container-queries)
- [CSS Cascade Layers `@layer`](https://developer.mozilla.org/docs/Web/CSS/@layer) — [Can I Use](https://caniuse.com/css-cascade-layers)
- [CSS Nesting](https://developer.mozilla.org/docs/Web/CSS/CSS_Nesting_Rules) — [Can I Use](https://caniuse.com/css-nesting)

### 渐进增强
- [Subgrid](https://developer.mozilla.org/docs/Web/CSS/CSS_Grid_Layout/Subgrid) — [Can I Use](https://caniuse.com/css-subgrid)
- [`:has()` 选择器](https://developer.mozilla.org/docs/Web/CSS/:has) — [Can I Use](https://caniuse.com/css-has)

---

## PostCSS 集成

为了在编译阶段合并样式，本项目新增了 PostCSS 配置并启用了 [`postcss-import`](https://github.com/postcss/postcss-import) 插件：

- `postcss.config.cjs` 仅包含 `require('postcss-import')`，在构建时解析 `@import` 语句。
- 在 `package.json` 中将 `postcss` 与 `postcss-import` 声明为开发依赖，确保编译流程可用。

构建时，`theme.css` 中的 `@import` 会被内联为单一样式表，消除了运行时的额外请求，有利于提升页面加载性能。

---

## 配色方案

**统一管理**：
- 浏览器控件适配主题（`color-scheme`）
- 公共组件样式统一由 `theme.css` 管理
- Markdown 深色模式拥有独立的颜色 Token，可在 `src/styles/core/tokens.css` 中统一维护。
- 叠加层和阴影相关的颜色通过 `--color-base-black` 与 `--color-base-white` Token 设置，便于调整透明度并适配主题切换。

**样式架构分层**：
- `src/styles/core/`: 定义基础设计 Token，包括颜色、间距和渐变等变量
- `src/styles/components/`: 组件级样式（如 `about.css`、`chat_widget.css` 等）
- `src/styles/utilities/`: 布局与通用工具类，内含 `.debug` 调试轮廓
- `src/styles/theme.css`: 样式入口文件，自动引入 `core/` 和 `utilities/`

**变量依赖图**：
```mermaid
graph TD
  A[基础变量] --> B[语义变量]
  B --> C[组件变量]
  C --> D[实际应用]
```

**色彩情感评估**：
- 深紫色：传达专业、创新
- 活力蓝：象征科技、信任
- 组合效果：专业中不失活力，适合技术型产品

**对比度保障**：
| 组合         | 对比度   | 适用性    |
|--------------|---------|-----------|
| 主色 + 白文本 | 7.2 : 1 | ✅ 完美   |
| 强调色 + 深灰 | 5.1 : 1 | ✅ 良好   |
| 主色 + 强调色 | 2.8 : 1 | ⚠️ 仅装饰 |

**主色**：
- 深紫罗兰色 `#6a11cb`
- 作为 **核心渐变色** 的起始色，具有强烈的视觉识别度
- 可以应用到 导航栏、核心按钮、重要标题等地方
- 辅助色值：
  - #5a0eb7 (悬停状态)
  - #7a24df (激活状态)

**强调色**：
- 活力蓝色 `#2575fc`
- 与 **主色** 形成完美渐变过渡，提供视觉焦点
- 可以应用到 交互元素、悬浮按钮、进度指示器
- 辅助色值：
  - #1c68e8 (悬停状态)
  - #3e86ff (激活状态)

**核心渐变色** 由深紫 `#6a11cb` 到活力蓝 `#2575fc` 过渡，配合 **衍生色** 增强层次。

**主次关系**：
```mermaid
graph LR
    A[主色 #6a11cb] --> B[导航/标题]
    C[强调色 #2575fc] --> D[按钮/交互]
    E[衍生色 #4e54c8] --> F[背景/边框]
```

**配色测试**：
1. 可访问性验证：使用 [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) 测试文本可读性
2. 视觉层次测试：
   ```
   /* 调试用灰度模式 */
   .grayscale-mode {
     filter: grayscale(100%);
   }
   ```

---

## 扩展与约定

当前样式体系已经覆盖基础变量、工具类与组件样式。后续可以根据需要加入设计令牌、响应式策略或多主题支持等内容，不断完善本指南。

- 新增样式文件应按上述目录分类放置，并使用 `@layer` 与 `@import ... layer(name)` 将其引入，遵循 `reset → tokens → base → components → utilities → overrides` 的层级顺序。
- 所有 `@import` 语句需置于文件顶部（除 `@layer` 声明外），以避免 PostCSS 报 `@import must precede all other statements` 警告。
- 如需使用其他 PostCSS 插件，可在 `postcss.config.cjs` 中统一配置。
- 欢迎补充更多的架构说明、最佳实践或样式约定到本文件。
