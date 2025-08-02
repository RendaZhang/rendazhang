import{r as C}from"./index.pfvYgJkG.js";import{c as pt}from"./certifications.910c74d5.BZ58Wm7U.js";(function(){var t=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{};t.SENTRY_RELEASE={id:"cdbe794aebf30b0b301471d37673765e9e9c69b7"}})();try{(function(){var t=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{},e=new t.Error().stack;e&&(t._sentryDebugIds=t._sentryDebugIds||{},t._sentryDebugIds[e]="a7b6810a-436b-4a36-b47c-1fc2cfa6f0de",t._sentryDebugIdIdentifier="sentry-dbid-a7b6810a-436b-4a36-b47c-1fc2cfa6f0de")})()}catch{}var he={exports:{}},W={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var xe;function gt(){if(xe)return W;xe=1;var t=Symbol.for("react.transitional.element"),e=Symbol.for("react.fragment");function n(s,r,a){var i=null;if(a!==void 0&&(i=""+a),r.key!==void 0&&(i=""+r.key),"key"in r){a={};for(var o in r)o!=="key"&&(a[o]=r[o])}else a=r;return r=a.ref,{$$typeof:t,type:s,key:i,ref:r!==void 0?r:null,props:a}}return W.Fragment=e,W.jsx=n,W.jsxs=n,W}var Ce;function _t(){return Ce||(Ce=1,he.exports=gt()),he.exports}var j=_t();const yt="/_astro/hero-main-hero-1000w.CwI4Ea7c.jpeg",vt="/_astro/hero-main-hero-1000w.CqVTy0Jp.webp",Et="/_astro/hero-main-hero-1280w.Bo6MeUKI.jpeg",bt="/_astro/hero-main-hero-1280w.BxJQXdBF.webp",At="/_astro/hero-main-hero-1920w.BV56bCT5.jpeg",wt="/_astro/hero-main-hero-1920w.BCupeR80.webp",xt="/_astro/hero-main-hero-2560w.CUz3Uzhd.jpeg",Ct="/_astro/hero-main-hero-2560w.nyS4qkce.webp",kt="/_astro/hero-main-hero-3840w.B-UrMI38.jpeg",Tt="/_astro/hero-main-hero-3840w.DnWjk4lW.webp",Rt="/_astro/hero-main-hero-400w.Bm4zjiV0.jpeg",St="/_astro/hero-main-hero-400w.DmIsEKOv.webp",It="/_astro/hero-main-hero-800w.CnacmyNJ.jpeg",Bt="/_astro/hero-main-hero-800w.C2ZX7OIc.webp",Nt="/_astro/marked.min.122AZrAC.js",Ot="/_astro/purify.min.DgXv1qLT.js",Dt="/_astro/highlight.min.ByCsmve4.js",Lt="/_astro/mermaid.min.BvYY4srm.js",Zt="/_astro/Resume_RendaZhang.DCUZYFnc.pdf",Mt="/_astro/%E4%B8%AA%E4%BA%BA%E7%AE%80%E5%8E%86_%E5%BC%A0%E4%BA%BA%E5%A4%A7.BuAZwOrY.pdf",Pt="/_astro/qrcode-wechat-medium-square-258x258.Ds94gEha.jpg",Ht=`<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [张人大 · 轻量级网站](#%E5%BC%A0%E4%BA%BA%E5%A4%A7-%C2%B7-%E8%BD%BB%E9%87%8F%E7%BA%A7%E7%BD%91%E7%AB%99)
  - [简介](#%E7%AE%80%E4%BB%8B)
  - [技术栈](#%E6%8A%80%E6%9C%AF%E6%A0%88)
    - [目录结构](#%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84)
    - [参考架构](#%E5%8F%82%E8%80%83%E6%9E%B6%E6%9E%84)
  - [前端](#%E5%89%8D%E7%AB%AF)
    - [本地开发和预览](#%E6%9C%AC%E5%9C%B0%E5%BC%80%E5%8F%91%E5%92%8C%E9%A2%84%E8%A7%88)
      - [GitHub Actions](#github-actions)
      - [使用说明](#%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E)
    - [网站功能](#%E7%BD%91%E7%AB%99%E5%8A%9F%E8%83%BD)
      - [页面功能](#%E9%A1%B5%E9%9D%A2%E5%8A%9F%E8%83%BD)
      - [页面跳转](#%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC)
      - [页面内容](#%E9%A1%B5%E9%9D%A2%E5%86%85%E5%AE%B9)
      - [页面优化](#%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96)
      - [配色方案](#%E9%85%8D%E8%89%B2%E6%96%B9%E6%A1%88)
  - [**后端**](#%E5%90%8E%E7%AB%AF)
  - [**Nginx 服务器**](#nginx-%E6%9C%8D%E5%8A%A1%E5%99%A8)
  - [文档说明](#%E6%96%87%E6%A1%A3%E8%AF%B4%E6%98%8E)
    - [BUG 记录](#bug-%E8%AE%B0%E5%BD%95)
    - [开发需求](#%E5%BC%80%E5%8F%91%E9%9C%80%E6%B1%82)
    - [原生到 Astro + React 升级](#%E5%8E%9F%E7%94%9F%E5%88%B0-astro--react-%E5%8D%87%E7%BA%A7)
    - [静态资源命名验证](#%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90%E5%91%BD%E5%90%8D%E9%AA%8C%E8%AF%81)
    - [响应式图片系统维护](#%E5%93%8D%E5%BA%94%E5%BC%8F%E5%9B%BE%E7%89%87%E7%B3%BB%E7%BB%9F%E7%BB%B4%E6%8A%A4)
    - [错误跟踪](#%E9%94%99%E8%AF%AF%E8%B7%9F%E8%B8%AA)
  - [🤝 贡献指南](#-%E8%B4%A1%E7%8C%AE%E6%8C%87%E5%8D%97)
  - [🔒 开源许可证](#-%E5%BC%80%E6%BA%90%E8%AE%B8%E5%8F%AF%E8%AF%81)
  - [📬 联系方式](#-%E8%81%94%E7%B3%BB%E6%96%B9%E5%BC%8F)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 张人大 · 轻量级网站

- **作者**: 张人大
- **最后更新**: August 02, 2025, 00:57 (UTC+8)
- **[Click here to view the English Version in Github](https://github.com/RendaZhang/rendazhang/blob/master/README_EN.md)**

---

## 简介

这是我个人维护的 **轻量级** 网站，作为我的技术能力的在线展示平台。

**网站链接**: 🌐 [www.rendazhang.com](https://www.rendazhang.com)

本网站已进行 SEO / GEO 优化。

> 如果您需要更重量级的服务器解决方案，可以参考我的云原生项目：📁 [Renda Cloud LAB](https://github.com/RendaZhang/renda-cloud-lab)。该项目提供了基于云原生的完整架构设计，适用于大规模和高可用性场景。

---

## 技术栈

| 分类     | 技术                                               |
| -------- | -------------------------------------------------- |
| 前端      | **Astro**, **React**, TypeScript                  |
| 状态管理  | React \`useState\`、\`useContext\`（可扩展 Zustand 等） |
| 构建工具  | Astro 内置 (基于 Vite)                              |
| 后端     | Flask + OpenAI API                                  |
| 部署     | GitHub Actions + Nginx                              |

### 目录结构

\`\`\`bash
src/
├── assets/
├── constants/           # 路径常量与 API 端点
├── features/            # 按业务划分的模块
│   ├── chat/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   └── auth/
│       ├── components/
│       ├── hooks/
│       └── services/
├── hooks/               # 业务逻辑自定义 hooks
├── styles/
│   ├── core/               # 核心变量
│   │   ├── _colors.css     # 颜色系统
│   │   ├── _spacing.css    # 间距系统
│   │   └── _gradients.css  # 渐变系统
│   ├── components/         # 组件样式
│   ├── utilities/          # 工具类
│   └── theme.css           # 主入口文件
├── scripts/
├── utils/               # 通用工具函数
├── models/              # 领域模型
├── services/           # API interaction layer
└── components/
    ├── ui/
    ├── layouts/
    ├── forms/
    ├── chat/
    ├── sections/
    └── providers/
\`\`\`

### 参考架构

ASCII 图示：

\`\`\`bash
Web Application Architecture
============================

Frontend (
   Astro + React
   - 负责用户界面和交互
) → CI/CD (
   GitHub Actions 自动构建部署
) → Server (
   Ubuntu (操作系统)
   ↓
   Nginx (静态文件服务)
   ↓
   systemd 服务 (进程管理)
   ↓
   Gunicorn + Gevent (WSGI 服务器)
   ↓
   Backend: Flask App (处理业务逻辑和 API 请求)
)
\`\`\`

Mermaid Flow 图示：

\`\`\`mermaid
flowchart TD
    A[Web] --> B[Frontend: Astro + React]
    A --> C[Server]
    B -->|负责用户界面和交互| C

    subgraph Server
        direction TB
        D[Ubuntu: 操作系统] --> E[Nginx: 静态服务]
        E --> F[systemd 服务: 进程管理]
        F --> G[Gunicorn + Gevent: WSGI 服务器]
        G --> H[Backend: Flask App: 处理业务逻辑和 API 请求]
    end
\`\`\`

---

## 前端

本仓库就是前端项目：📁 [Renda Zhang WEB](https://github.com/RendaZhang/rendazhang)

### 本地开发和预览

1. 安装依赖并启用 pre-commit：

   \`\`\`bash
   npm install
   pip install pre-commit
   pre-commit install
   \`\`\`

2. 运行本地开发服务器：

   \`\`\`bash
   npm run dev
   \`\`\`

3. 构建并预览生产版本：

   \`\`\`bash
   npm run build
   npm run preview
   \`\`\`

4. 如需连接自定义后端接口，可在根目录创建 \`.env\` 文件并设置 \`PUBLIC_API_BASE_URL\`：

   \`\`\`bash
   PUBLIC_API_BASE_URL=https://api.example.com
   \`\`\`

   Sentry integration also requires the following variables:

   \`\`\`bash
   SENTRY_DSN=<server dsn>
   PUBLIC_SENTRY_DSN=<browser dsn>
   SENTRY_PROJECT=<your project>
   SENTRY_AUTH_TOKEN=<auth token>
   \`\`\`

执行 \`npm run build\` 后，\`dist/_astro\` 目录会生成带有哈希后缀的静态文件，方便浏览器长时间缓存。

浏览器访问 \`http://localhost:4321\` 查看效果。

构建后的静态文件可使用 \`npm run preview\` 验证。

#### GitHub Actions

Push 到 \`master\` 分支会触发 GitHub Actions 自动部署：

1. 检出代码并安装依赖
2. 执行 \`npm run build\` 生成静态文件
3. 通过 \`appleboy/scp-action\` 将 \`dist/\` 内容上传到服务器指定目录（如 \`/var/www/html\`）
4. 部署完成后即可通过 Nginx 提供服务

需要在仓库 Secrets 中配置服务器 IP、SSH 用户和私钥等信息。详情见 📄 [配置 GitHub Actions](https://github.com/RendaZhang/rendazhang/blob/master/docs/NATIVE_TO_ASTRO_REACT_UPGRADE.md#%E9%85%8D%E7%BD%AE-github-actions)。

#### 使用说明

部署完成后可直接访问各模块页面。

如下是我的网站的每个页面的链接：

- 🌐 [主页](https://www.rendazhang.com/)
- 🌐 [AI 聊天页面](https://www.rendazhang.com/deepseek_chat/)
- 🌐 [证书页面](https://www.rendazhang.com/certifications/)
- 🌐 [基于本文档渲染后的技术文档页面](https://www.rendazhang.com/docs/)
- 🌐 [登录页面](https://www.rendazhang.com/login/)
- 🌐 [注册页面](https://www.rendazhang.com/register/)

### 网站功能

关于网站的核心功能体系，请参考以下文档链接：📄 [核心功能体系](https://github.com/RendaZhang/rendazhang/blob/master/docs/REQUIREMENTS.md#-%E6%A0%B8%E5%BF%83%E5%8A%9F%E8%83%BD%E4%BD%93%E7%B3%BB)。该文档详细描述了网站的核心功能模块，包括功能设计和技术实现，是开发与维护的重要参考。

- 主题切换（浅色 / 深色）
- 语言切换（中文 / 英文）
- 与 AI 在线对话
- 浮动 AI 聊天窗口
- 技术文档渲染展示页 (docs/)
- 登录与注册表单
- 联系表单
- 内容平台链接
- 证书展示
- 简历下载

#### 页面功能

各页面核心职责如下（均由 \`.astro\` 文件生成）：

- \`index.astro\`：个人介绍页，展示个人信息、教育、技能、博客及工作经验，并预置 ChatWidget 浮标。
- \`certifications.astro\`：证书列表页。
- \`deepseek_chat.astro\`：AI 聊天界面。
- \`docs.astro\`：技术文档页面。
- \`login.astro\`：登录页。
- \`register.astro\`：注册页。

其他页面：

- \`404.html\`，\`50x.html\`：错误提示页面。

#### 页面跳转

1. **返回主页**
   - 所有页面均包含导航栏中的“主页”按钮，点击后可返回主页。

2. **导航栏菜单跳转**
   - 通过点击导航栏的“汉堡菜单”按钮，用户可选择跳转到以下四个页面：
     - 首页
     - AI 聊天页
     - 证书页
     - 技术文档页

3. **登录页面跳转**
   - 通过点击导航栏的“人像图标”按钮，用户可跳转到登录页面。

Mermaid Flow 图示：

\`\`\`mermaid
flowchart TD
    A[主页] -->|汉堡菜单| B[AI 聊天页]
    A -->|汉堡菜单| C[证书页]
    A -->|汉堡菜单| D[技术文档页]
    A -->|人像图标| E[登录页面]
    B -->|主页按钮| A
    C -->|主页按钮| A
    D -->|主页按钮| A
    E -->|主页按钮| A

    style A fill:#9f9,stroke:#333
    style B fill:#f9f,stroke:#333
    style C fill:#ff9,stroke:#333
    style D fill:#99f,stroke:#333
    style E fill:#f99,stroke:#333
\`\`\`

#### 页面内容

- \`index.astro\`：多 Section 主页，包含 "Hero"、"自我介绍"、"教育"、"博客"、"技能与能力"、"经历"、"联系我吧" 等模块，并默认悬挂 \`ChatWidget\` 浮标。
- \`certifications.astro\`：栅格卡片形式展示证书，并嵌入 Credly 验证链接。
- \`deepseek_chat.astro\`：由聊天记录区域与输入框组成的对话界面，支持流式输出并实时渲染 AI 返回的 Markdown 内容，提供一键复制原始内容的功能，并在页面刷新后自动保留历史记录，同时加载 \`github.min.css\` 和 \`github-markdown-light.min.css\` 以保持代码高亮与排版一致。聊天组件已拆分为 \`ChatMessageList\`、\`ChatInput\` 等子组件，方便复用与维护。
- \`docs.astro\`：技术文档页面，使用同样的两份 GitHub 样式表配合 highlight.js 渲染 Markdown 与代码。
- \`login.astro\`：登录表单页。
- \`register.astro\`：注册表单页。
- \`404.html / 50x.html\`：用于处理页面不存在（404）和服务器内部错误（50x）的定制化错误提示页面，提供清晰的错误信息、友好的用户引导和返回主页的链接，以提升用户体验。

#### 页面优化

**自适应布局**：优化页面在不同设备上的显示效果，减少不必要的资源加载和布局计算，从而提高性能。确保页面在不同屏幕尺寸（如桌面、平板、手机）上都能良好显示，提升用户体验。

**懒加载**：所有图片开启了懒加载 + Loading 动画，其中，针对高清图片采用 LQIP 懒加载优化（比如主页的 Hero 区域）

#### 配色方案

**统一管理**：
- 浏览器控件适配主题（\`color-scheme\`）
- 公共组件样式统一由 \`theme.css\` 管理
- Markdown 深色模式和错误页面也拥有独立的颜色 Token，可在 \`src/styles/core/_colors.css\` 中统一维护。
- 叠加层和阴影相关的颜色同样通过 \`--color-black-rgb\` 与 \`--color-white-rgb\` Token 设置，便于调整透明度并适配主题切换。
- 错误页面渐变也依赖这些 Token，在 \`src/styles/core/_gradients.css\` 统一定义。
- Markdown 深色模式和错误页面也拥有独立的颜色 Token，可在 \`src/styles/core/_colors.css\` 中统一维护。
- 叠加层和阴影相关的颜色同样通过 \`--color-black-rgb\` 与 \`--color-white-rgb\` Token 设置，便于调整透明度并适配主题切换。
错误页面渐变也依赖这些 Token，在 \`src/styles/core/_gradients.css\` 统一定义。

**样式架构分层**：
- \`src/styles/core/\`: 定义基础设计 Token，包括颜色、间距和渐变等变量
- \`src/styles/components/\`: 组件级样式（如 \`about.css\`、\`chat_widget.css\` 等）
- \`src/styles/utilities/\`: 布局与通用工具类，内含 \`.debug\` 调试轮廓
- \`src/styles/theme.css\`: 样式入口文件，自动引入 \`core/\` 和 \`utilities/\`

**变量依赖图**：
\`\`\`mermaid
graph TD
  A[基础变量] --> B[语义变量]
  B --> C[组件变量]
  C --> D[实际应用]
\`\`\`

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
- 深紫罗兰色 \`#6a11cb\`
- 作为 **核心渐变色** 的起始色，具有强烈的视觉识别度
- 可以应用到 导航栏、核心按钮、重要标题等地方
- 辅助色值：
  - #5a0eb7 (悬停状态)
  - #7a24df (激活状态)

**强调色**：
- 活力蓝色 \`#2575fc\`
- 与 **主色** 形成完美渐变过渡，提供视觉焦点
- 可以应用到 交互元素、悬浮按钮、进度指示器
- 辅助色值：
  - #1c68e8 (悬停状态)
  - #3e86ff (激活状态)

**核心渐变色** 由深紫 \`#6a11cb\` 到活力蓝 \`#2575fc\` 过渡，配合 **衍生色** 增强层次。

**主次关系**：
\`\`\`mermaid
graph LR
    A[主色 #6a11cb] --> B[导航/标题]
    C[强调色 #2575fc] --> D[按钮/交互]
    E[衍生色 #4e54c8] --> F[背景/边框]
\`\`\`

**配色测试**：
1. 可访问性验证：使用 [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) 测试文本可读性
2. 视觉层次测试：
   \`\`\`
   /* 调试用灰度模式 */
   .grayscale-mode {
     filter: grayscale(100%);
   }
   \`\`\`

---

## **后端**

> 后端部署的具体步骤和配置，请参考以下项目：📁 [Python Cloud Chat](https://github.com/RendaZhang/python-cloud-chat)。该项目提供了完整的后端实现和部署指南，帮助您快速搭建和运行后端服务。

---

## **Nginx 服务器**

> 前端项目通过 GitHub Actions 自动化构建后，会直接推送到服务器的 \`/var/www/html\` 目录，并由 Nginx 提供静态资源服务。

> 关于 Nginx 的详细配置和操作说明，请查看以下仓库：📁 [Nginx Conf](https://github.com/RendaZhang/nginx-conf)。该仓库包含了常用的 Nginx 配置文件和使用示例，方便您快速上手。

> 为充分利用构建生成的指纹文件，可在 Nginx 中为 \`/_astro/\` 路径添加长效缓存配置：

\`\`\`nginx
location /_astro/ {
    access_log off;
    add_header Cache-Control "public, max-age=31536000, immutable";
}
\`\`\`

> 如果您需要更重量级的服务器解决方案，可以参考我的云原生项目：📁 [Renda Cloud LAB](https://github.com/RendaZhang/renda-cloud-lab)。该项目提供了基于云原生的完整架构设计，适用于大规模和高可用性场景。

---

## 文档说明

### BUG 记录

> 前端开发过程中遇到的 BUG 及其解决方案，请参考以下文档：📄 [前端 BUG 跟踪数据库](https://github.com/RendaZhang/rendazhang/blob/master/docs/TROUBLESHOOTING.md#%E5%89%8D%E7%AB%AF-bug-%E8%B7%9F%E8%B8%AA%E6%95%B0%E6%8D%AE%E5%BA%93)。该文档详细记录了 BUG 的描述、复现步骤、解决方案以及相关开发者的处理记录，帮助您快速定位和解决问题。

### 开发需求

> 项目的功能需求、优先级以及开发计划，请参考以下文档：📄 [项目需求清单](https://github.com/RendaZhang/rendazhang/blob/master/docs/REQUIREMENTS.md#%E9%A1%B9%E7%9B%AE%E9%9C%80%E6%B1%82%E6%B8%85%E5%8D%95)。该文档列出了当前版本的所有需求，并提供了需求的详细描述和开发状态，方便您了解项目进展和规划开发任务。

### 原生到 Astro + React 升级

前端目前采用 **Astro** + **React** 的架构，基于分层设计理念，通过 **GitHub Actions** 实现自动化构建，并将构建产物部署到服务器 Nginx 的指定目录下。

具体的从原生前端升级的操作步骤，请参考以下文档内容：📄 [升级计划](https://github.com/RendaZhang/rendazhang/blob/master/docs/NATIVE_TO_ASTRO_REACT_UPGRADE.md#%E6%97%A7%E7%89%88%E5%8E%9F%E7%94%9F%E5%89%8D%E7%AB%AF%E5%88%B0-astro--react-%E6%96%B0%E5%89%8D%E7%AB%AF%E7%9A%84%E6%B8%90%E8%BF%9B%E5%8D%87%E7%BA%A7%E8%AE%A1%E5%88%92)。该文档详细描述了从旧版原生前端逐步迁移到基于 Astro 和 React 的新前端架构的完整计划与实施步骤。

开发环境准备的具体步骤，请参考以下文档内容：📄 [环境准备](https://github.com/RendaZhang/rendazhang/blob/master/docs/NATIVE_TO_ASTRO_REACT_UPGRADE.md#%E9%98%B6%E6%AE%B5-1%E7%8E%AF%E5%A2%83%E5%87%86%E5%A4%87%E4%B8%8E-astro-%E9%A1%B9%E7%9B%AE%E5%88%9D%E5%A7%8B%E5%8C%96)。该文档详细说明了如何完成开发环境的配置以及 Astro 项目的初始化工作，确保您能够顺利开始后续的开发任务。

### 静态资源命名验证

执行 \`npm run validate-assets\` 检查图片与音乐文件命名。

文档详见：📄 [静态资源命名验证脚本](https://github.com/RendaZhang/rendazhang/blob/master/docs/ASSET_VALIDATION.md#%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90%E5%91%BD%E5%90%8D%E9%AA%8C%E8%AF%81%E8%84%9A%E6%9C%AC)

### 响应式图片系统维护

网站图片通过自动化脚本生成响应式版本并内置 LQIP 占位效果，方便在不同设备上快速加载。

详细操作流程与扩展指南请参阅：📄 [通用响应式图片处理系统维护文档](https://github.com/RendaZhang/rendazhang/blob/master/docs/RESPONSIVE_IMAGE_SYSTEM_MAINTENANCE.md#%E9%80%9A%E7%94%A8%E5%93%8D%E5%BA%94%E5%BC%8F%E5%9B%BE%E7%89%87%E5%A4%84%E7%90%86%E7%B3%BB%E7%BB%9F%E7%BB%B4%E6%8A%A4%E6%96%87%E6%A1%A3)

### 错误跟踪

Sentry 用于收集运行时异常与网络错误。配置步骤请见 📄 [错误跟踪集成](docs/ERROR_TRACKING.md).

---

## 🤝 贡献指南

- Fork 并克隆这个仓库。
- 进入虚拟环境：
   \`\`\`bash
   # 如果还没安装虚拟环境，执行命令：python -m venv venv
   source venv/bin/activate
   \`\`\`
- 安装依赖并启用 **pre-commit**:
   \`\`\`bash
   pip install pre-commit
   pre-commit install
   \`\`\`
- 在每次提交前，钩子会自动运行，并执行操作：
  - 将根目录的 README 与 README_EN 同步到 \`src/assets/\` 目录下。
  - README 和 docs 下的文档会自动更新 Doctoc 目录（若本地未安装则跳过）。
  - 执行静态资源命名验证脚本，确保 \`src/assets\` 下的命名规范。
- 你也可以手动触发：
   \`\`\`bash
   pre-commit run --all-files
   \`\`\`

> ✅ 所有提交必须通过 pre-commit 检查；CI 会阻止不符合规范的 PR。

---

## 🔒 开源许可证

本项目以 **MIT 许可证** 发布，你可以自由使用与修改。请在分发时保留原始许可证声明。

---

## 📬 联系方式

* 联系人：张人大（Renda Zhang）
* 📧 邮箱：[952402967@qq.com](mailto:952402967@qq.com)

> ⏰ **维护者**：@张人大 — 如果本项目对你有帮助，请不要忘了点亮 ⭐️ Star 支持我们！
`,jt=`<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Renda Zhang · Lightweight Website](#renda-zhang--lightweight-website)
  - [Introduction](#introduction)
  - [Tech Stack](#tech-stack)
    - [Directory Structure](#directory-structure)
    - [Reference Architecture](#reference-architecture)
  - [Frontend](#frontend)
    - [Local Development \\& Preview](#local-development--preview)
      - [GitHub Actions](#github-actions)
      - [Usage Guide](#usage-guide)
    - [Website Features](#website-features)
      - [Page Functionality](#page-functionality)
      - [Page Navigation](#page-navigation)
      - [Page Content](#page-content)
      - [Page Optimization](#page-optimization)
      - [Color Scheme](#color-scheme)
  - [**Backend**](#backend)
  - [**Nginx Server**](#nginx-server)
  - [Documentation](#documentation)
    - [BUG Tracking](#bug-tracking)
    - [Development Requirements](#development-requirements)
    - [Native to Astro + React Migration](#native-to-astro--react-migration)
    - [Static Asset Naming Validation](#static-asset-naming-validation)
    - [Responsive Image System Maintenance](#responsive-image-system-maintenance)
    - [Error Tracking](#error-tracking)
  - [🤝 Contribution Guidelines](#-contribution-guidelines)
  - [🔒 Open Source License](#-open-source-license)
  - [📬 Contact](#-contact)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Renda Zhang · Lightweight Website

- **Author**: Renda Zhang
- **Last Updated**: August 02, 2025, 00:57 (UTC+8)
- **[点击这里查看 Github 上的中文版](https://github.com/RendaZhang/rendazhang/blob/master/README.md)**

---

## Introduction

This is my personally maintained **lightweight** technical showcase website, serving as an online portfolio of my technical capabilities.

**Live Site**: 🌐 [www.rendazhang.com](https://www.rendazhang.com)

The website is optimized for SEO and GEO.

> If you need a more robust server solution, you can refer to my cloud-native project: 📁 [Renda Cloud LAB](https://github.com/RendaZhang/renda-cloud-lab). This project provides a complete cloud-native architecture design, suitable for large-scale and high-availability scenarios.

---

## Tech Stack

| Category         | Technologies                                        |
| ---------------- | --------------------------------------------------- |
| Frontend         | **Astro**, **React**, TypeScript                    |
| State Management | React \`useState\`, \`useContext\` (Zustand compatible) |
| Build Tools      | Astro built-in (Vite-based)                         |
| Backend          | Flask + OpenAI API                                  |
| Deployment       | GitHub Actions + Nginx                              |

### Directory Structure

\`\`\`text
src/
├── assets/
├── constants/           # Path constants and API endpoints
├── features/            # Feature-based modules
│   ├── chat/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   └── auth/
│       ├── components/
│       ├── hooks/
│       └── services/
├── hooks/               # Custom hooks for business logic
├── styles/
│   ├── core/               # Core variables
│   │   ├── _colors.css     # Color system
│   │   ├── _spacing.css    # Spacing system
│   │   └── _gradients.css  # Gradient system
│   ├── components/         # Component styles
│   ├── utilities/          # Utility classes
│   └── theme.css           # Main entry file
├── scripts/
├── utils/               # Utility helpers
├── models/              # Domain models
├── services/           # API interaction layer
└── components/
    ├── ui/
    ├── layouts/
    ├── forms/
    ├── chat/
    ├── sections/
    └── providers/
\`\`\`

### Reference Architecture

ASCII Diagram:

\`\`\`text
Web Application Architecture
============================

Frontend (
   Astro + React
   - Handles UI and interactions
) → CI/CD (
   GitHub Actions auto-build & deploy
) → Server (
   Ubuntu (OS)
   ↓
   Nginx (static file serving)
   ↓
   systemd service (process management)
   ↓
   Gunicorn + Gevent (WSGI server)
   ↓
   Backend: Flask App (business logic & API handling)
)
\`\`\`

Mermaid Flow Diagram:

\`\`\`mermaid
flowchart TD
    A[Web] --> B[Frontend: Astro + React]
    A --> C[Server]
    B -->|Handles UI and interactions| C

    subgraph Server
        direction TB
        D[Ubuntu: OS] --> E[Nginx: Static serving]
        E --> F[systemd: Process management]
        F --> G[Gunicorn + Gevent: WSGI server]
        G --> H[Backend: Flask App: Business logic & APIs]
    end
\`\`\`

---

## Frontend

This repository contains the frontend project: 📁 [Renda Zhang WEB](https://github.com/RendaZhang/rendazhang)

### Local Development & Preview

1. Install dependencies and enable pre-commit:

   \`\`\`bash
   npm install
   pip install pre-commit
   pre-commit install
   \`\`\`

2. Start local dev server:

   \`\`\`bash
   npm run dev
   \`\`\`

3. Build and preview production version:

   \`\`\`bash
   npm run build
   npm run preview
   \`\`\`

4. To point the frontend at a custom backend, create a \`.env\` file and set \`PUBLIC_API_BASE_URL\`:

   \`\`\`bash
   PUBLIC_API_BASE_URL=https://api.example.com
   \`\`\`

   Sentry integration also requires:

   \`\`\`bash
   SENTRY_DSN=<server dsn>
   PUBLIC_SENTRY_DSN=<browser dsn>
   SENTRY_PROJECT=<your project>
   SENTRY_AUTH_TOKEN=<auth token>
   \`\`\`

After running \`npm run build\`, the \`dist/_astro\` directory will contain fingerprinted files with hash suffixes, allowing browsers to cache them long-term.

Access via \`http://localhost:4321\`.

Verify builds using \`npm run preview\`.

#### GitHub Actions

Pushing to \`master\` triggers GitHub Actions Auto-Deployment:

1. Code checkout & dependency installation
2. \`npm run build\` generates static files
3. \`appleboy/scp-action\` deploys \`dist/\` to server (e.g., \`/var/www/html\`)
4. Nginx serves content post-deployment

Configure server IP, SSH user, and private key in Repository Secrets. Details: 📄 [GitHub Actions Setup](https://github.com/RendaZhang/rendazhang/blob/master/docs/NATIVE_TO_ASTRO_REACT_UPGRADE.md#%E9%85%8D%E7%BD%AE-github-actions)

#### Usage Guide

Access all modules post-deployment:

- 🌐 [Homepage](https://www.rendazhang.com/)
- 🌐 [AI Chat](https://www.rendazhang.com/deepseek_chat/)
- 🌐 [Certifications](https://www.rendazhang.com/certifications/)
- 🌐 [Tech Docs](https://www.rendazhang.com/docs/)
- 🌐 [Login](https://www.rendazhang.com/login/)
- 🌐 [Register](https://www.rendazhang.com/register/)

### Website Features

For details on the core functionality system of the website, please refer to the following documentation link: 📄 [Core Functionality System](https://github.com/RendaZhang/rendazhang/blob/master/docs/REQUIREMENTS.md#-%E6%A0%B8%E5%BF%83%E5%8A%9F%E8%83%BD%E4%BD%93%E7%B3%BB). This document provides a detailed description of the website's core functional modules, including feature design and technical implementation. It serves as an essential reference for development and maintenance.

- Theme switching (light / dark)
- Language toggle (Chinese / English)
- Real-time AI chat
- Floating AI chat widget
- Tech documentation rendering (docs/)
- Login/registration forms
- Contact form
- Content platform links
- Certification showcase
- Resume download

#### Page Functionality

Core responsibilities (generated from \`.astro\` files):

- \`index.astro\`: Personal intro with ChatWidget
- \`certifications.astro\`: Certification gallery
- \`deepseek_chat.astro\`: AI chat interface
- \`docs.astro\`: Technical documentation page
- \`404.html\`, \`50x.html\`: Error pages
- \`login.astro\`：Login page
- \`register.astro\`：Registration page

#### Page Navigation

1. **Return to Homepage**
   All pages have "Home" button in navigation

2. **Menu Navigation**
   Hamburger menu provides access to:
   - Homepage
   - AI Chat
   - Certifications
   - Tech Docs

3. **Login Page Access**
   Profile icon in nav redirects to login

\`\`\`mermaid
flowchart TD
    A[Home] -->|Hamburger| B[AI Chat]
    A -->|Hamburger| C[Certifications]
    A -->|Hamburger| D[Tech Docs]
    A -->|Profile Icon| E[Login]
    B -->|Home Button| A
    C -->|Home Button| A
    D -->|Home Button| A
    E -->|Home Button| A

    style A fill:#9f9,stroke:#333
    style B fill:#f9f,stroke:#333
    style C fill:#ff9,stroke:#333
    style D fill:#99f,stroke:#333
    style E fill:#f99,stroke:#333
\`\`\`

#### Page Content

- \`index.astro\`: A multi-section homepage containing modules such as "Hero", "About Me", "Education", "Blog", "Skills & Abilities", "Experience", and "Contact Me", with a default floating \`ChatWidget\` badge.
- \`certifications.astro\`: Grid-based certification cards with Credly verification
- \`deepseek_chat.astro\`: A conversational interface consisting of a chat history area and an input box, supporting streaming output and real-time rendering of AI-generated Markdown content. It provides a one-click copy feature for the original content and automatically retains the chat history upon page refresh, and loads both \`github.min.css\` and \`github-markdown-light.min.css\` for consistent GitHub-style code highlighting. The chat UI has been refactored into reusable components such as \`ChatMessageList\` and \`ChatInput\` for better maintainability.
- \`docs.astro\`: Technical documentation page that loads both \`github.min.css\` and \`github-markdown-light.min.css\` together with highlight.js for GitHub-style Markdown layout and code highlighting.
- \`login.astro\`: Login form page.
- \`register.astro\`: Register form page.
- \`404.html/50x.html\`: Custom error pages designed to handle Page Not Found (404) and Internal Server Error (50x) scenarios. These pages provide clear error messages, user-friendly guidance, and a link to return to the homepage, enhancing the overall user experience.

#### Page Optimization

**Adaptive Layout**: Optimizes the display effect of the page on different devices, reduces unnecessary resource loading and layout calculations, and thereby improves performance. Ensures that the page displays well on various screen sizes (e.g., desktop, tablet, mobile), enhancing user experience.

**Lazy Loading**: All images have lazy loading enabled with a loading animation. For high-definition images, LQIP (Low-Quality Image Placeholder) lazy loading optimization is applied (e.g., the Hero section on the homepage).

#### Color Scheme

**Unified Management**:

- Browser controls adapt to the theme (\`color-scheme\`).
- Public component styles are uniformly managed by \`theme.css\`.
- Markdown dark mode and error pages also have independent color tokens, which can be maintained in \`src/styles/core/_colors.css\`.
- Overlay and shadow-related colors are also set via \`--color-black-rgb\` and \`--color-white-rgb\` tokens, facilitating transparency adjustments and theme switching.
- Error page gradients also rely on these tokens, defined uniformly in \`src/styles/core/_gradients.css\`.

**Style Architecture Layering**:

- \`src/styles/core/\`: Defines foundational design tokens, including variables for colors, spacing, gradients, etc.
- \`src/styles/components/\`: Component-level styles (e.g., \`about.css\`, \`chat_widget.css\`, etc.).
- \`src/styles/utilities/\`: Layout and general utility classes, including \`.debug\` for debugging outlines.
- \`src/styles/theme.css\`: The entry point for styles, automatically importing \`core/\` and \`utilities/\`.

**Variable Dependency Diagram**:

\`\`\`mermaid
graph TD
  A[Foundational Variables] --> B[Semantic Variables]
  B --> C[Component Variables]
  C --> D[Practical Application]
\`\`\`

**Color Emotion Evaluation**:

- Deep Purple: Conveys professionalism and innovation.
- Vibrant Blue: Symbolizes technology and trust.
- Combined Effect: Professional yet vibrant, suitable for tech products.

**Contrast Assurance**:
| Combination | Contrast Ratio | Suitability |
|----------------------|----------------|-------------|
| Primary + White Text | 7.2 : 1 | ✅ Perfect |
| Accent + Dark Gray | 5.1 : 1 | ✅ Good |
| Primary + Accent | 2.8 : 1 | ⚠️ Decorative Only |

**Primary Color**:

- Deep Violet \`#6a11cb\`
- Serves as the **core gradient** starting color, with strong visual recognition.
- Can be applied to navigation bars, core buttons, important headings, etc.
- Auxiliary values:
  - #5a0eb7 (hover state)
  - #7a24df (active state)

**Accent Color**:

- Vibrant Blue \`#2575fc\`
- Forms a perfect gradient transition with the **primary color**, providing visual focus.
- Can be applied to interactive elements, floating buttons, progress indicators.
- Auxiliary values:
  - #1c68e8 (hover state)
  - #3e86ff (active state)

**Core Gradient** transitions from Deep Purple \`#6a11cb\` to Vibrant Blue \`#2575fc\`, enhanced by **derived colors** for added depth.

**Primary-Secondary Relationship**:

\`\`\`mermaid
graph LR
    A[Primary #6a11cb] --> B[Navigation/Headings]
    C[Accent #2575fc] --> D[Buttons/Interactions]
    E[Derived #4e54c8] --> F[Backgrounds/Borders]
\`\`\`

**Color Testing**:

1. Accessibility Verification: Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to test text readability.
2. Visual Hierarchy Test:
   \`\`\`
   /* Debug grayscale mode */
   .grayscale-mode {
     filter: grayscale(100%);
   }
   \`\`\`

---

## **Backend**

> For detailed steps and configurations on backend deployment, please refer to the following project: 📁 [Python Cloud Chat](https://github.com/RendaZhang/python-cloud-chat). This project provides a complete backend implementation and deployment guide, helping you quickly set up and run backend services.

---

## **Nginx Server**

> The frontend project is automatically built via GitHub Actions and pushed to the \`/var/www/html\` directory on the server, where Nginx serves the static resources.

> For detailed Nginx configurations and operational instructions, please check the following repository: 📁 [Nginx Conf](https://github.com/RendaZhang/nginx-conf). This repository includes commonly used Nginx configuration files and examples, making it easy for you to get started.

> To fully leverage the hashed assets under \`/_astro\`, add a long-term cache rule in Nginx:

\`\`\`nginx
location /_astro/ {
    access_log off;
    add_header Cache-Control "public, max-age=31536000, immutable";
}
\`\`\`

> If you need a more robust server solution, you can refer to my cloud-native project: 📁 [Renda Cloud LAB](https://github.com/RendaZhang/renda-cloud-lab). This project provides a complete cloud-native architecture design, suitable for large-scale and high-availability scenarios.

---

## Documentation

### BUG Tracking

> For BUGs encountered during frontend development and their solutions, please refer to the following document: 📄 [Frontend BUG Tracking Database](https://github.com/RendaZhang/rendazhang/blob/master/docs/TROUBLESHOOTING.md#%E5%89%8D%E7%AB%AF-bug-%E8%B7%9F%E8%B8%AA%E6%95%B0%E6%8D%AE%E5%BA%93). This document provides detailed records of BUG descriptions, reproduction steps, solutions, and developer notes, helping you quickly identify and resolve issues.

### Development Requirements

> For project feature requirements, priorities, and development plans, please refer to the following document: 📄 [Project Requirements List](https://github.com/RendaZhang/rendazhang/blob/master/docs/REQUIREMENTS.md#%E9%A1%B9%E7%9B%AE%E9%9C%80%E6%B1%82%E6%B8%85%E5%8D%95). This document lists all requirements for the current version, along with detailed descriptions and development statuses, making it easy for you to track project progress and plan development tasks.

### Native to Astro + React Migration

The front-end currently adopts an architecture based on **Astro** + **React**, following a layered design philosophy. It utilizes **GitHub Actions** for automated builds and deploys the build artifacts to a specified directory on the server's **Nginx**.

For detailed steps on upgrading from native frontend, please refer to the following documentation: 📄 [Upgrade Plan](https://github.com/RendaZhang/rendazhang/blob/master/docs/NATIVE_TO_ASTRO_REACT_UPGRADE.md#%E6%97%A7%E7%89%88%E5%8E%9F%E7%94%9F%E5%89%8D%E7%AB%AF%E5%88%B0-astro--react-%E6%96%B0%E5%89%8D%E7%AB%AF%E7%9A%84%E6%B8%90%E8%BF%9B%E5%8D%87%E7%BA%A7%E8%AE%A1%E5%88%92). This document provides a comprehensive plan and implementation steps for gradually migrating from the old native frontend to a new frontend architecture based on Astro and React.

For detailed steps on setting up the development environment, please refer to the following documentation: 📄 [Environment Preparation](https://github.com/RendaZhang/rendazhang/blob/master/docs/NATIVE_TO_ASTRO_REACT_UPGRADE.md#%E9%98%B6%E6%AE%B5-1%E7%8E%AF%E5%A2%83%E5%87%86%E5%A4%87%E4%B8%8E-astro-%E9%A1%B9%E7%9B%AE%E5%88%9D%E5%A7%8B%E5%8C%96). This document provides a comprehensive guide on configuring the development environment and initializing an Astro project, ensuring you can smoothly proceed with subsequent development tasks.

### Static Asset Naming Validation

Run \`npm run validate-assets\` for image/music file validation.

Details: 📄 [Asset Validation Script](https://github.com/RendaZhang/rendazhang/blob/master/docs/ASSET_VALIDATION.md#%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90%E5%91%BD%E5%90%8D%E9%AA%8C%E8%AF%81%E8%84%9A%E6%9C%AC)

### Responsive Image System Maintenance

The website uses an automated pipeline to generate responsive images with built-in LQIP placeholders. For maintenance and extension instructions, see 📄 [Responsive Image System Maintenance](https://github.com/RendaZhang/rendazhang/blob/master/docs/RESPONSIVE_IMAGE_SYSTEM_MAINTENANCE.md#%E9%80%9A%E7%94%A8%E5%93%8D%E5%BA%94%E5%BC%8F%E5%9B%BE%E7%89%87%E5%A4%84%E7%90%86%E7%B3%BB%E7%BB%9F%E7%BB%B4%E6%8A%A4%E6%96%87%E6%A1%A3) _(Chinese)_.

### Error Tracking

Sentry collects runtime and network errors. See 📄 [Error Tracking Integration](docs/ERROR_TRACKING.md) for configuration.

---

## 🤝 Contribution Guidelines

- Fork and clone repository
- Enter virtual environment:
  \`\`\`bash
  python -m venv venv  # If not created
  source venv/bin/activate
  \`\`\`
- Install pre-commit:
  \`\`\`bash
  pip install pre-commit
  pre-commit install
  \`\`\`
- Pre-commit hooks automatically:
  - Sync root README/README_EN to \`src/assets/\`
  - Update Doctoc TOC for docs
  - Validate naming inside \`src/assets\`
- Manual trigger:
  \`\`\`bash
  pre-commit run --all-files
  \`\`\`

> ✅ All commits must pass pre-commit checks; CI blocks non-compliant PRs

---

## 🔒 Open Source License

Released under **MIT License** - free for use and modification. Retain original license notices when redistributing.

---

## 📬 Contact

- Contact: Renda Zhang
- 📧 Email: [952402967@qq.com](mailto:952402967@qq.com)

> ⏰ **Maintainer**: @RendaZhang — If this project helps you, please give it a ⭐️!
`;function Ft(t){return t.replace(/\r\n|\r(?!\n)|\n/g,`
`)}function Vt(t,e){if(!e||e.line===void 0||e.column===void 0)return"";const n=Ft(t).split(`
`).map(i=>i.replace(/\t/g,"  ")),s=[];for(let i=-2;i<=2;i++)n[e.line+i]&&s.push(e.line+i);let r=0;for(const i of s){let o=`> ${i}`;o.length>r&&(r=o.length)}let a="";for(const i of s){const o=i===e.line-1;a+=o?"> ":"  ",a+=`${i+1} | ${n[i]}
`,o&&(a+=`${Array.from({length:r}).join(" ")}  | ${Array.from({length:e.column}).join(" ")}^
`)}return a}class Ut extends Error{loc;title;hint;frame;type="AstroError";constructor(e,n){const{name:s,title:r,message:a,stack:i,location:o,hint:d,frame:l}=e;super(a,n),this.title=r,this.name=s,a&&(this.message=a),this.stack=i||this.stack,this.loc=o,this.hint=d,this.frame=l}setLocation(e){this.loc=e}setName(e){this.name=e}setMessage(e){this.message=e}setHint(e){this.hint=e}setFrame(e,n){this.frame=Vt(e,n)}static is(e){return e.type==="AstroError"}}const ke={name:"InvalidComponentArgs",title:"Invalid component arguments.",message:t=>`Invalid arguments passed to${t?` <${t}>`:""} component.`,hint:"Astro components cannot be rendered directly via function call, such as `Component()` or `{items.map(Component)}`."};function zt(t){return!(t.length!==3||!t[0]||typeof t[0]!="object")}function Xe(t,e,n){const s=e?.split("/").pop()?.replace(".astro","")??"",r=(...a)=>{if(!zt(a))throw new Ut({...ke,message:ke.message(s)});return t(...a)};return Object.defineProperty(r,"name",{value:s,writable:!1}),r.isAstroComponentFactory=!0,r.moduleId=e,r.propagation=n,r}function Gt(t){return Xe(t.factory,t.moduleId,t.propagation)}function $t(t,e,n){return typeof t=="function"?Xe(t,e,n):Gt(t)}typeof process<"u"&&process.stdout&&process.stdout.isTTY;const{replace:qt}="",Wt=/[&<>'"]/g,Yt={"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"},Jt=t=>Yt[t],Qt=t=>qt.call(t,Wt,Jt);function F(t){return!!t&&typeof t=="object"&&"then"in t&&typeof t.then=="function"}async function*Kt(t){const e=t.getReader();try{for(;;){const{done:n,value:s}=await e.read();if(n)return;yield s}}finally{e.releaseLock()}}const Xt=Qt;class et extends Uint8Array{}Object.defineProperty(et.prototype,Symbol.toStringTag,{get(){return"HTMLBytes"}});class ae extends String{get[Symbol.toStringTag](){return"HTMLString"}}const A=t=>t instanceof ae?t:typeof t=="string"?new ae(t):t;function en(t){return Object.prototype.toString.call(t)==="[object HTMLString]"}function tn(t){return new et(t)}function tt(t){return typeof t.getReader=="function"}async function*Te(t){if(tt(t))for await(const e of Kt(t))yield Q(e);else for await(const e of t)yield Q(e)}function*nn(t){for(const e of t)yield Q(e)}function Q(t){if(t&&typeof t=="object"){if(t instanceof Uint8Array)return tn(t);if(t instanceof Response&&t.body){const e=t.body;return Te(e)}else{if(typeof t.then=="function")return Promise.resolve(t).then(e=>Q(e));if(t[Symbol.for("astro:slot-string")])return t;if(Symbol.iterator in t)return nn(t);if(Symbol.asyncIterator in t||tt(t))return Te(t)}}return A(t)}function nt(t){var e,n,s="";if(typeof t=="string"||typeof t=="number")s+=t;else if(typeof t=="object")if(Array.isArray(t)){var r=t.length;for(e=0;e<r;e++)t[e]&&(n=nt(t[e]))&&(s&&(s+=" "),s+=n)}else for(n in t)t[n]&&(s&&(s+=" "),s+=n);return s}function sn(){for(var t,e,n=0,s="",r=arguments.length;n<r;n++)(t=arguments[n])&&(e=nt(t))&&(s&&(s+=" "),s+=e);return s}const rn=/^(?:allowfullscreen|async|autofocus|autoplay|checked|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|inert|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|selected|itemscope)$/i,an=/&/g,on=/"/g,cn=new Set(["set:html","set:text"]),Z=(t,e=!0)=>e?String(t).replace(an,"&#38;").replace(on,"&#34;"):t,dn=t=>t.toLowerCase()===t?t:t.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`),Re=t=>Object.entries(t).filter(([e,n])=>typeof n=="string"&&n.trim()||typeof n=="number").map(([e,n])=>e[0]!=="-"&&e[1]!=="-"?`${dn(e)}:${n}`:`${e}:${n}`).join(";");function ln(t){return t.includes("-")}function fe(t,e,n,s){return s&&ln(s)?A(` ${t}="${Z(e,n)}"`):A(e?` ${t}`:"")}function un(t,e,n=!0,s=""){if(t==null)return"";if(cn.has(e))return console.warn(`[astro] The "${e}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${e}={value}\`) instead of the dynamic spread syntax (\`{...{ "${e}": value }}\`).`),"";if(e==="class:list"){const r=Z(sn(t),n);return r===""?"":A(` ${e.slice(0,-5)}="${r}"`)}if(e==="style"&&!(t instanceof ae)){if(Array.isArray(t)&&t.length===2)return A(` ${e}="${Z(`${Re(t[0])};${t[1]}`,n)}"`);if(typeof t=="object")return A(` ${e}="${Z(Re(t),n)}"`)}return e==="className"?A(` class="${Z(t,n)}"`):typeof t=="string"&&t.includes("&")&&pn(t)?A(` ${e}="${Z(t,!1)}"`):rn.test(e)?fe(e,t,n,s):t===""?A(` ${e}`):e==="popover"&&typeof t=="boolean"||e==="download"&&typeof t=="boolean"?fe(e,t,n,s):A(` ${e}="${Z(t,n)}"`)}const hn=()=>{};class fn{chunks=[];renderPromise;destination;flushed=!1;constructor(e,n){this.destination=e,this.renderPromise=n(this),F(this.renderPromise)&&Promise.resolve(this.renderPromise).catch(hn)}write(e){this.flushed?this.destination.write(e):this.chunks.push(e)}flush(){if(this.flushed)throw new Error("The render buffer has already been flushed.");this.flushed=!0;for(const e of this.chunks)this.destination.write(e);return this.renderPromise}}function st(t,e){return new fn(t,e)}typeof process<"u"&&Object.prototype.toString.call(process);const mn=["http:","https:"];function pn(t){try{const e=new URL(t);return mn.includes(e.protocol)}catch{return!1}}var Se;(function(t){t[t.Include=0]="Include",t[t.None=1]="None"})(Se||(Se={}));var Ie;(function(t){t[t.Required=0]="Required",t[t.Ignore=1]="Ignore"})(Ie||(Ie={}));var Be;(function(t){t[t.Include=0]="Include",t[t.None=1]="None"})(Be||(Be={}));var Ne;(function(t){t[t.Required=0]="Required",t[t.Ignore=1]="Ignore"})(Ne||(Ne={}));var v;(function(t){t.assertEqual=r=>{};function e(r){}t.assertIs=e;function n(r){throw new Error}t.assertNever=n,t.arrayToEnum=r=>{const a={};for(const i of r)a[i]=i;return a},t.getValidEnumValues=r=>{const a=t.objectKeys(r).filter(o=>typeof r[r[o]]!="number"),i={};for(const o of a)i[o]=r[o];return t.objectValues(i)},t.objectValues=r=>t.objectKeys(r).map(function(a){return r[a]}),t.objectKeys=typeof Object.keys=="function"?r=>Object.keys(r):r=>{const a=[];for(const i in r)Object.prototype.hasOwnProperty.call(r,i)&&a.push(i);return a},t.find=(r,a)=>{for(const i of r)if(a(i))return i},t.isInteger=typeof Number.isInteger=="function"?r=>Number.isInteger(r):r=>typeof r=="number"&&Number.isFinite(r)&&Math.floor(r)===r;function s(r,a=" | "){return r.map(i=>typeof i=="string"?`'${i}'`:i).join(a)}t.joinValues=s,t.jsonStringifyReplacer=(r,a)=>typeof a=="bigint"?a.toString():a})(v||(v={}));var Oe;(function(t){t.mergeShapes=(e,n)=>({...e,...n})})(Oe||(Oe={}));const h=v.arrayToEnum(["string","nan","number","integer","float","boolean","date","bigint","symbol","function","undefined","null","array","object","unknown","promise","void","never","map","set"]),B=t=>{switch(typeof t){case"undefined":return h.undefined;case"string":return h.string;case"number":return Number.isNaN(t)?h.nan:h.number;case"boolean":return h.boolean;case"function":return h.function;case"bigint":return h.bigint;case"symbol":return h.symbol;case"object":return Array.isArray(t)?h.array:t===null?h.null:t.then&&typeof t.then=="function"&&t.catch&&typeof t.catch=="function"?h.promise:typeof Map<"u"&&t instanceof Map?h.map:typeof Set<"u"&&t instanceof Set?h.set:typeof Date<"u"&&t instanceof Date?h.date:h.object;default:return h.unknown}},c=v.arrayToEnum(["invalid_type","invalid_literal","custom","invalid_union","invalid_union_discriminator","invalid_enum_value","unrecognized_keys","invalid_arguments","invalid_return_type","invalid_date","invalid_string","too_small","too_big","invalid_intersection_types","not_multiple_of","not_finite"]);class I extends Error{get errors(){return this.issues}constructor(e){super(),this.issues=[],this.addIssue=s=>{this.issues=[...this.issues,s]},this.addIssues=(s=[])=>{this.issues=[...this.issues,...s]};const n=new.target.prototype;Object.setPrototypeOf?Object.setPrototypeOf(this,n):this.__proto__=n,this.name="ZodError",this.issues=e}format(e){const n=e||function(a){return a.message},s={_errors:[]},r=a=>{for(const i of a.issues)if(i.code==="invalid_union")i.unionErrors.map(r);else if(i.code==="invalid_return_type")r(i.returnTypeError);else if(i.code==="invalid_arguments")r(i.argumentsError);else if(i.path.length===0)s._errors.push(n(i));else{let o=s,d=0;for(;d<i.path.length;){const l=i.path[d];d===i.path.length-1?(o[l]=o[l]||{_errors:[]},o[l]._errors.push(n(i))):o[l]=o[l]||{_errors:[]},o=o[l],d++}}};return r(this),s}static assert(e){if(!(e instanceof I))throw new Error(`Not a ZodError: ${e}`)}toString(){return this.message}get message(){return JSON.stringify(this.issues,v.jsonStringifyReplacer,2)}get isEmpty(){return this.issues.length===0}flatten(e=n=>n.message){const n={},s=[];for(const r of this.issues)if(r.path.length>0){const a=r.path[0];n[a]=n[a]||[],n[a].push(e(r))}else s.push(e(r));return{formErrors:s,fieldErrors:n}}get formErrors(){return this.flatten()}}I.create=t=>new I(t);const ge=(t,e)=>{let n;switch(t.code){case c.invalid_type:t.received===h.undefined?n="Required":n=`Expected ${t.expected}, received ${t.received}`;break;case c.invalid_literal:n=`Invalid literal value, expected ${JSON.stringify(t.expected,v.jsonStringifyReplacer)}`;break;case c.unrecognized_keys:n=`Unrecognized key(s) in object: ${v.joinValues(t.keys,", ")}`;break;case c.invalid_union:n="Invalid input";break;case c.invalid_union_discriminator:n=`Invalid discriminator value. Expected ${v.joinValues(t.options)}`;break;case c.invalid_enum_value:n=`Invalid enum value. Expected ${v.joinValues(t.options)}, received '${t.received}'`;break;case c.invalid_arguments:n="Invalid function arguments";break;case c.invalid_return_type:n="Invalid function return type";break;case c.invalid_date:n="Invalid date";break;case c.invalid_string:typeof t.validation=="object"?"includes"in t.validation?(n=`Invalid input: must include "${t.validation.includes}"`,typeof t.validation.position=="number"&&(n=`${n} at one or more positions greater than or equal to ${t.validation.position}`)):"startsWith"in t.validation?n=`Invalid input: must start with "${t.validation.startsWith}"`:"endsWith"in t.validation?n=`Invalid input: must end with "${t.validation.endsWith}"`:v.assertNever(t.validation):t.validation!=="regex"?n=`Invalid ${t.validation}`:n="Invalid";break;case c.too_small:t.type==="array"?n=`Array must contain ${t.exact?"exactly":t.inclusive?"at least":"more than"} ${t.minimum} element(s)`:t.type==="string"?n=`String must contain ${t.exact?"exactly":t.inclusive?"at least":"over"} ${t.minimum} character(s)`:t.type==="number"?n=`Number must be ${t.exact?"exactly equal to ":t.inclusive?"greater than or equal to ":"greater than "}${t.minimum}`:t.type==="bigint"?n=`Number must be ${t.exact?"exactly equal to ":t.inclusive?"greater than or equal to ":"greater than "}${t.minimum}`:t.type==="date"?n=`Date must be ${t.exact?"exactly equal to ":t.inclusive?"greater than or equal to ":"greater than "}${new Date(Number(t.minimum))}`:n="Invalid input";break;case c.too_big:t.type==="array"?n=`Array must contain ${t.exact?"exactly":t.inclusive?"at most":"less than"} ${t.maximum} element(s)`:t.type==="string"?n=`String must contain ${t.exact?"exactly":t.inclusive?"at most":"under"} ${t.maximum} character(s)`:t.type==="number"?n=`Number must be ${t.exact?"exactly":t.inclusive?"less than or equal to":"less than"} ${t.maximum}`:t.type==="bigint"?n=`BigInt must be ${t.exact?"exactly":t.inclusive?"less than or equal to":"less than"} ${t.maximum}`:t.type==="date"?n=`Date must be ${t.exact?"exactly":t.inclusive?"smaller than or equal to":"smaller than"} ${new Date(Number(t.maximum))}`:n="Invalid input";break;case c.custom:n="Invalid input";break;case c.invalid_intersection_types:n="Intersection results could not be merged";break;case c.not_multiple_of:n=`Number must be a multiple of ${t.multipleOf}`;break;case c.not_finite:n="Number must be finite";break;default:n=e.defaultError,v.assertNever(t)}return{message:n}};let gn=ge;function _n(){return gn}const yn=t=>{const{data:e,path:n,errorMaps:s,issueData:r}=t,a=[...n,...r.path||[]],i={...r,path:a};if(r.message!==void 0)return{...r,path:a,message:r.message};let o="";const d=s.filter(l=>!!l).slice().reverse();for(const l of d)o=l(i,{data:e,defaultError:o}).message;return{...r,path:a,message:o}};function u(t,e){const n=_n(),s=yn({issueData:e,data:t.data,path:t.path,errorMaps:[t.common.contextualErrorMap,t.schemaErrorMap,n,n===ge?void 0:ge].filter(r=>!!r)});t.common.issues.push(s)}class w{constructor(){this.value="valid"}dirty(){this.value==="valid"&&(this.value="dirty")}abort(){this.value!=="aborted"&&(this.value="aborted")}static mergeArray(e,n){const s=[];for(const r of n){if(r.status==="aborted")return m;r.status==="dirty"&&e.dirty(),s.push(r.value)}return{status:e.value,value:s}}static async mergeObjectAsync(e,n){const s=[];for(const r of n){const a=await r.key,i=await r.value;s.push({key:a,value:i})}return w.mergeObjectSync(e,s)}static mergeObjectSync(e,n){const s={};for(const r of n){const{key:a,value:i}=r;if(a.status==="aborted"||i.status==="aborted")return m;a.status==="dirty"&&e.dirty(),i.status==="dirty"&&e.dirty(),a.value!=="__proto__"&&(typeof i.value<"u"||r.alwaysSet)&&(s[a.value]=i.value)}return{status:e.value,value:s}}}const m=Object.freeze({status:"aborted"}),Y=t=>({status:"dirty",value:t}),k=t=>({status:"valid",value:t}),De=t=>t.status==="aborted",Le=t=>t.status==="dirty",V=t=>t.status==="valid",ie=t=>typeof Promise<"u"&&t instanceof Promise;var f;(function(t){t.errToObj=e=>typeof e=="string"?{message:e}:e||{},t.toString=e=>typeof e=="string"?e:e?.message})(f||(f={}));class O{constructor(e,n,s,r){this._cachedPath=[],this.parent=e,this.data=n,this._path=s,this._key=r}get path(){return this._cachedPath.length||(Array.isArray(this._key)?this._cachedPath.push(...this._path,...this._key):this._cachedPath.push(...this._path,this._key)),this._cachedPath}}const Ze=(t,e)=>{if(V(e))return{success:!0,data:e.value};if(!t.common.issues.length)throw new Error("Validation failed but no issues detected.");return{success:!1,get error(){if(this._error)return this._error;const n=new I(t.common.issues);return this._error=n,this._error}}};function _(t){if(!t)return{};const{errorMap:e,invalid_type_error:n,required_error:s,description:r}=t;if(e&&(n||s))throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);return e?{errorMap:e,description:r}:{errorMap:(i,o)=>{const{message:d}=t;return i.code==="invalid_enum_value"?{message:d??o.defaultError}:typeof o.data>"u"?{message:d??s??o.defaultError}:i.code!=="invalid_type"?{message:o.defaultError}:{message:d??n??o.defaultError}},description:r}}class y{get description(){return this._def.description}_getType(e){return B(e.data)}_getOrReturnCtx(e,n){return n||{common:e.parent.common,data:e.data,parsedType:B(e.data),schemaErrorMap:this._def.errorMap,path:e.path,parent:e.parent}}_processInputParams(e){return{status:new w,ctx:{common:e.parent.common,data:e.data,parsedType:B(e.data),schemaErrorMap:this._def.errorMap,path:e.path,parent:e.parent}}}_parseSync(e){const n=this._parse(e);if(ie(n))throw new Error("Synchronous parse encountered promise.");return n}_parseAsync(e){const n=this._parse(e);return Promise.resolve(n)}parse(e,n){const s=this.safeParse(e,n);if(s.success)return s.data;throw s.error}safeParse(e,n){const s={common:{issues:[],async:n?.async??!1,contextualErrorMap:n?.errorMap},path:n?.path||[],schemaErrorMap:this._def.errorMap,parent:null,data:e,parsedType:B(e)},r=this._parseSync({data:e,path:s.path,parent:s});return Ze(s,r)}"~validate"(e){const n={common:{issues:[],async:!!this["~standard"].async},path:[],schemaErrorMap:this._def.errorMap,parent:null,data:e,parsedType:B(e)};if(!this["~standard"].async)try{const s=this._parseSync({data:e,path:[],parent:n});return V(s)?{value:s.value}:{issues:n.common.issues}}catch(s){s?.message?.toLowerCase()?.includes("encountered")&&(this["~standard"].async=!0),n.common={issues:[],async:!0}}return this._parseAsync({data:e,path:[],parent:n}).then(s=>V(s)?{value:s.value}:{issues:n.common.issues})}async parseAsync(e,n){const s=await this.safeParseAsync(e,n);if(s.success)return s.data;throw s.error}async safeParseAsync(e,n){const s={common:{issues:[],contextualErrorMap:n?.errorMap,async:!0},path:n?.path||[],schemaErrorMap:this._def.errorMap,parent:null,data:e,parsedType:B(e)},r=this._parse({data:e,path:s.path,parent:s}),a=await(ie(r)?r:Promise.resolve(r));return Ze(s,a)}refine(e,n){const s=r=>typeof n=="string"||typeof n>"u"?{message:n}:typeof n=="function"?n(r):n;return this._refinement((r,a)=>{const i=e(r),o=()=>a.addIssue({code:c.custom,...s(r)});return typeof Promise<"u"&&i instanceof Promise?i.then(d=>d?!0:(o(),!1)):i?!0:(o(),!1)})}refinement(e,n){return this._refinement((s,r)=>e(s)?!0:(r.addIssue(typeof n=="function"?n(s,r):n),!1))}_refinement(e){return new z({schema:this,typeName:p.ZodEffects,effect:{type:"refinement",refinement:e}})}superRefine(e){return this._refinement(e)}constructor(e){this.spa=this.safeParseAsync,this._def=e,this.parse=this.parse.bind(this),this.safeParse=this.safeParse.bind(this),this.parseAsync=this.parseAsync.bind(this),this.safeParseAsync=this.safeParseAsync.bind(this),this.spa=this.spa.bind(this),this.refine=this.refine.bind(this),this.refinement=this.refinement.bind(this),this.superRefine=this.superRefine.bind(this),this.optional=this.optional.bind(this),this.nullable=this.nullable.bind(this),this.nullish=this.nullish.bind(this),this.array=this.array.bind(this),this.promise=this.promise.bind(this),this.or=this.or.bind(this),this.and=this.and.bind(this),this.transform=this.transform.bind(this),this.brand=this.brand.bind(this),this.default=this.default.bind(this),this.catch=this.catch.bind(this),this.describe=this.describe.bind(this),this.pipe=this.pipe.bind(this),this.readonly=this.readonly.bind(this),this.isNullable=this.isNullable.bind(this),this.isOptional=this.isOptional.bind(this),this["~standard"]={version:1,vendor:"zod",validate:n=>this["~validate"](n)}}optional(){return N.create(this,this._def)}nullable(){return G.create(this,this._def)}nullish(){return this.nullable().optional()}array(){return R.create(this)}promise(){return le.create(this,this._def)}or(e){return ce.create([this,e],this._def)}and(e){return de.create(this,e,this._def)}transform(e){return new z({..._(this._def),schema:this,typeName:p.ZodEffects,effect:{type:"transform",transform:e}})}default(e){const n=typeof e=="function"?e:()=>e;return new ye({..._(this._def),innerType:this,defaultValue:n,typeName:p.ZodDefault})}brand(){return new Fn({typeName:p.ZodBranded,type:this,..._(this._def)})}catch(e){const n=typeof e=="function"?e:()=>e;return new ve({..._(this._def),innerType:this,catchValue:n,typeName:p.ZodCatch})}describe(e){const n=this.constructor;return new n({...this._def,description:e})}pipe(e){return be.create(this,e)}readonly(){return Ee.create(this)}isOptional(){return this.safeParse(void 0).success}isNullable(){return this.safeParse(null).success}}const vn=/^c[^\s-]{8,}$/i,En=/^[0-9a-z]+$/,bn=/^[0-9A-HJKMNP-TV-Z]{26}$/i,An=/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i,wn=/^[a-z0-9_-]{21}$/i,xn=/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,Cn=/^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/,kn=/^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i,Tn="^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";let me;const Rn=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,Sn=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,In=/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,Bn=/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,Nn=/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,On=/^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,rt="((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))",Dn=new RegExp(`^${rt}$`);function at(t){let e="[0-5]\\d";t.precision?e=`${e}\\.\\d{${t.precision}}`:t.precision==null&&(e=`${e}(\\.\\d+)?`);const n=t.precision?"+":"?";return`([01]\\d|2[0-3]):[0-5]\\d(:${e})${n}`}function Ln(t){return new RegExp(`^${at(t)}$`)}function Zn(t){let e=`${rt}T${at(t)}`;const n=[];return n.push(t.local?"Z?":"Z"),t.offset&&n.push("([+-]\\d{2}:?\\d{2})"),e=`${e}(${n.join("|")})`,new RegExp(`^${e}$`)}function Mn(t,e){return!!((e==="v4"||!e)&&Rn.test(t)||(e==="v6"||!e)&&In.test(t))}function Pn(t,e){if(!xn.test(t))return!1;try{const[n]=t.split(".");if(!n)return!1;const s=n.replace(/-/g,"+").replace(/_/g,"/").padEnd(n.length+(4-n.length%4)%4,"="),r=JSON.parse(atob(s));return!(typeof r!="object"||r===null||"typ"in r&&r?.typ!=="JWT"||!r.alg||e&&r.alg!==e)}catch{return!1}}function Hn(t,e){return!!((e==="v4"||!e)&&Sn.test(t)||(e==="v6"||!e)&&Bn.test(t))}class M extends y{_parse(e){if(this._def.coerce&&(e.data=String(e.data)),this._getType(e)!==h.string){const a=this._getOrReturnCtx(e);return u(a,{code:c.invalid_type,expected:h.string,received:a.parsedType}),m}const s=new w;let r;for(const a of this._def.checks)if(a.kind==="min")e.data.length<a.value&&(r=this._getOrReturnCtx(e,r),u(r,{code:c.too_small,minimum:a.value,type:"string",inclusive:!0,exact:!1,message:a.message}),s.dirty());else if(a.kind==="max")e.data.length>a.value&&(r=this._getOrReturnCtx(e,r),u(r,{code:c.too_big,maximum:a.value,type:"string",inclusive:!0,exact:!1,message:a.message}),s.dirty());else if(a.kind==="length"){const i=e.data.length>a.value,o=e.data.length<a.value;(i||o)&&(r=this._getOrReturnCtx(e,r),i?u(r,{code:c.too_big,maximum:a.value,type:"string",inclusive:!0,exact:!0,message:a.message}):o&&u(r,{code:c.too_small,minimum:a.value,type:"string",inclusive:!0,exact:!0,message:a.message}),s.dirty())}else if(a.kind==="email")kn.test(e.data)||(r=this._getOrReturnCtx(e,r),u(r,{validation:"email",code:c.invalid_string,message:a.message}),s.dirty());else if(a.kind==="emoji")me||(me=new RegExp(Tn,"u")),me.test(e.data)||(r=this._getOrReturnCtx(e,r),u(r,{validation:"emoji",code:c.invalid_string,message:a.message}),s.dirty());else if(a.kind==="uuid")An.test(e.data)||(r=this._getOrReturnCtx(e,r),u(r,{validation:"uuid",code:c.invalid_string,message:a.message}),s.dirty());else if(a.kind==="nanoid")wn.test(e.data)||(r=this._getOrReturnCtx(e,r),u(r,{validation:"nanoid",code:c.invalid_string,message:a.message}),s.dirty());else if(a.kind==="cuid")vn.test(e.data)||(r=this._getOrReturnCtx(e,r),u(r,{validation:"cuid",code:c.invalid_string,message:a.message}),s.dirty());else if(a.kind==="cuid2")En.test(e.data)||(r=this._getOrReturnCtx(e,r),u(r,{validation:"cuid2",code:c.invalid_string,message:a.message}),s.dirty());else if(a.kind==="ulid")bn.test(e.data)||(r=this._getOrReturnCtx(e,r),u(r,{validation:"ulid",code:c.invalid_string,message:a.message}),s.dirty());else if(a.kind==="url")try{new URL(e.data)}catch{r=this._getOrReturnCtx(e,r),u(r,{validation:"url",code:c.invalid_string,message:a.message}),s.dirty()}else a.kind==="regex"?(a.regex.lastIndex=0,a.regex.test(e.data)||(r=this._getOrReturnCtx(e,r),u(r,{validation:"regex",code:c.invalid_string,message:a.message}),s.dirty())):a.kind==="trim"?e.data=e.data.trim():a.kind==="includes"?e.data.includes(a.value,a.position)||(r=this._getOrReturnCtx(e,r),u(r,{code:c.invalid_string,validation:{includes:a.value,position:a.position},message:a.message}),s.dirty()):a.kind==="toLowerCase"?e.data=e.data.toLowerCase():a.kind==="toUpperCase"?e.data=e.data.toUpperCase():a.kind==="startsWith"?e.data.startsWith(a.value)||(r=this._getOrReturnCtx(e,r),u(r,{code:c.invalid_string,validation:{startsWith:a.value},message:a.message}),s.dirty()):a.kind==="endsWith"?e.data.endsWith(a.value)||(r=this._getOrReturnCtx(e,r),u(r,{code:c.invalid_string,validation:{endsWith:a.value},message:a.message}),s.dirty()):a.kind==="datetime"?Zn(a).test(e.data)||(r=this._getOrReturnCtx(e,r),u(r,{code:c.invalid_string,validation:"datetime",message:a.message}),s.dirty()):a.kind==="date"?Dn.test(e.data)||(r=this._getOrReturnCtx(e,r),u(r,{code:c.invalid_string,validation:"date",message:a.message}),s.dirty()):a.kind==="time"?Ln(a).test(e.data)||(r=this._getOrReturnCtx(e,r),u(r,{code:c.invalid_string,validation:"time",message:a.message}),s.dirty()):a.kind==="duration"?Cn.test(e.data)||(r=this._getOrReturnCtx(e,r),u(r,{validation:"duration",code:c.invalid_string,message:a.message}),s.dirty()):a.kind==="ip"?Mn(e.data,a.version)||(r=this._getOrReturnCtx(e,r),u(r,{validation:"ip",code:c.invalid_string,message:a.message}),s.dirty()):a.kind==="jwt"?Pn(e.data,a.alg)||(r=this._getOrReturnCtx(e,r),u(r,{validation:"jwt",code:c.invalid_string,message:a.message}),s.dirty()):a.kind==="cidr"?Hn(e.data,a.version)||(r=this._getOrReturnCtx(e,r),u(r,{validation:"cidr",code:c.invalid_string,message:a.message}),s.dirty()):a.kind==="base64"?Nn.test(e.data)||(r=this._getOrReturnCtx(e,r),u(r,{validation:"base64",code:c.invalid_string,message:a.message}),s.dirty()):a.kind==="base64url"?On.test(e.data)||(r=this._getOrReturnCtx(e,r),u(r,{validation:"base64url",code:c.invalid_string,message:a.message}),s.dirty()):v.assertNever(a);return{status:s.value,value:e.data}}_regex(e,n,s){return this.refinement(r=>e.test(r),{validation:n,code:c.invalid_string,...f.errToObj(s)})}_addCheck(e){return new M({...this._def,checks:[...this._def.checks,e]})}email(e){return this._addCheck({kind:"email",...f.errToObj(e)})}url(e){return this._addCheck({kind:"url",...f.errToObj(e)})}emoji(e){return this._addCheck({kind:"emoji",...f.errToObj(e)})}uuid(e){return this._addCheck({kind:"uuid",...f.errToObj(e)})}nanoid(e){return this._addCheck({kind:"nanoid",...f.errToObj(e)})}cuid(e){return this._addCheck({kind:"cuid",...f.errToObj(e)})}cuid2(e){return this._addCheck({kind:"cuid2",...f.errToObj(e)})}ulid(e){return this._addCheck({kind:"ulid",...f.errToObj(e)})}base64(e){return this._addCheck({kind:"base64",...f.errToObj(e)})}base64url(e){return this._addCheck({kind:"base64url",...f.errToObj(e)})}jwt(e){return this._addCheck({kind:"jwt",...f.errToObj(e)})}ip(e){return this._addCheck({kind:"ip",...f.errToObj(e)})}cidr(e){return this._addCheck({kind:"cidr",...f.errToObj(e)})}datetime(e){return typeof e=="string"?this._addCheck({kind:"datetime",precision:null,offset:!1,local:!1,message:e}):this._addCheck({kind:"datetime",precision:typeof e?.precision>"u"?null:e?.precision,offset:e?.offset??!1,local:e?.local??!1,...f.errToObj(e?.message)})}date(e){return this._addCheck({kind:"date",message:e})}time(e){return typeof e=="string"?this._addCheck({kind:"time",precision:null,message:e}):this._addCheck({kind:"time",precision:typeof e?.precision>"u"?null:e?.precision,...f.errToObj(e?.message)})}duration(e){return this._addCheck({kind:"duration",...f.errToObj(e)})}regex(e,n){return this._addCheck({kind:"regex",regex:e,...f.errToObj(n)})}includes(e,n){return this._addCheck({kind:"includes",value:e,position:n?.position,...f.errToObj(n?.message)})}startsWith(e,n){return this._addCheck({kind:"startsWith",value:e,...f.errToObj(n)})}endsWith(e,n){return this._addCheck({kind:"endsWith",value:e,...f.errToObj(n)})}min(e,n){return this._addCheck({kind:"min",value:e,...f.errToObj(n)})}max(e,n){return this._addCheck({kind:"max",value:e,...f.errToObj(n)})}length(e,n){return this._addCheck({kind:"length",value:e,...f.errToObj(n)})}nonempty(e){return this.min(1,f.errToObj(e))}trim(){return new M({...this._def,checks:[...this._def.checks,{kind:"trim"}]})}toLowerCase(){return new M({...this._def,checks:[...this._def.checks,{kind:"toLowerCase"}]})}toUpperCase(){return new M({...this._def,checks:[...this._def.checks,{kind:"toUpperCase"}]})}get isDatetime(){return!!this._def.checks.find(e=>e.kind==="datetime")}get isDate(){return!!this._def.checks.find(e=>e.kind==="date")}get isTime(){return!!this._def.checks.find(e=>e.kind==="time")}get isDuration(){return!!this._def.checks.find(e=>e.kind==="duration")}get isEmail(){return!!this._def.checks.find(e=>e.kind==="email")}get isURL(){return!!this._def.checks.find(e=>e.kind==="url")}get isEmoji(){return!!this._def.checks.find(e=>e.kind==="emoji")}get isUUID(){return!!this._def.checks.find(e=>e.kind==="uuid")}get isNANOID(){return!!this._def.checks.find(e=>e.kind==="nanoid")}get isCUID(){return!!this._def.checks.find(e=>e.kind==="cuid")}get isCUID2(){return!!this._def.checks.find(e=>e.kind==="cuid2")}get isULID(){return!!this._def.checks.find(e=>e.kind==="ulid")}get isIP(){return!!this._def.checks.find(e=>e.kind==="ip")}get isCIDR(){return!!this._def.checks.find(e=>e.kind==="cidr")}get isBase64(){return!!this._def.checks.find(e=>e.kind==="base64")}get isBase64url(){return!!this._def.checks.find(e=>e.kind==="base64url")}get minLength(){let e=null;for(const n of this._def.checks)n.kind==="min"&&(e===null||n.value>e)&&(e=n.value);return e}get maxLength(){let e=null;for(const n of this._def.checks)n.kind==="max"&&(e===null||n.value<e)&&(e=n.value);return e}}M.create=t=>new M({checks:[],typeName:p.ZodString,coerce:t?.coerce??!1,..._(t)});function jn(t,e){const n=(t.toString().split(".")[1]||"").length,s=(e.toString().split(".")[1]||"").length,r=n>s?n:s,a=Number.parseInt(t.toFixed(r).replace(".","")),i=Number.parseInt(e.toFixed(r).replace(".",""));return a%i/10**r}class K extends y{constructor(){super(...arguments),this.min=this.gte,this.max=this.lte,this.step=this.multipleOf}_parse(e){if(this._def.coerce&&(e.data=Number(e.data)),this._getType(e)!==h.number){const a=this._getOrReturnCtx(e);return u(a,{code:c.invalid_type,expected:h.number,received:a.parsedType}),m}let s;const r=new w;for(const a of this._def.checks)a.kind==="int"?v.isInteger(e.data)||(s=this._getOrReturnCtx(e,s),u(s,{code:c.invalid_type,expected:"integer",received:"float",message:a.message}),r.dirty()):a.kind==="min"?(a.inclusive?e.data<a.value:e.data<=a.value)&&(s=this._getOrReturnCtx(e,s),u(s,{code:c.too_small,minimum:a.value,type:"number",inclusive:a.inclusive,exact:!1,message:a.message}),r.dirty()):a.kind==="max"?(a.inclusive?e.data>a.value:e.data>=a.value)&&(s=this._getOrReturnCtx(e,s),u(s,{code:c.too_big,maximum:a.value,type:"number",inclusive:a.inclusive,exact:!1,message:a.message}),r.dirty()):a.kind==="multipleOf"?jn(e.data,a.value)!==0&&(s=this._getOrReturnCtx(e,s),u(s,{code:c.not_multiple_of,multipleOf:a.value,message:a.message}),r.dirty()):a.kind==="finite"?Number.isFinite(e.data)||(s=this._getOrReturnCtx(e,s),u(s,{code:c.not_finite,message:a.message}),r.dirty()):v.assertNever(a);return{status:r.value,value:e.data}}gte(e,n){return this.setLimit("min",e,!0,f.toString(n))}gt(e,n){return this.setLimit("min",e,!1,f.toString(n))}lte(e,n){return this.setLimit("max",e,!0,f.toString(n))}lt(e,n){return this.setLimit("max",e,!1,f.toString(n))}setLimit(e,n,s,r){return new K({...this._def,checks:[...this._def.checks,{kind:e,value:n,inclusive:s,message:f.toString(r)}]})}_addCheck(e){return new K({...this._def,checks:[...this._def.checks,e]})}int(e){return this._addCheck({kind:"int",message:f.toString(e)})}positive(e){return this._addCheck({kind:"min",value:0,inclusive:!1,message:f.toString(e)})}negative(e){return this._addCheck({kind:"max",value:0,inclusive:!1,message:f.toString(e)})}nonpositive(e){return this._addCheck({kind:"max",value:0,inclusive:!0,message:f.toString(e)})}nonnegative(e){return this._addCheck({kind:"min",value:0,inclusive:!0,message:f.toString(e)})}multipleOf(e,n){return this._addCheck({kind:"multipleOf",value:e,message:f.toString(n)})}finite(e){return this._addCheck({kind:"finite",message:f.toString(e)})}safe(e){return this._addCheck({kind:"min",inclusive:!0,value:Number.MIN_SAFE_INTEGER,message:f.toString(e)})._addCheck({kind:"max",inclusive:!0,value:Number.MAX_SAFE_INTEGER,message:f.toString(e)})}get minValue(){let e=null;for(const n of this._def.checks)n.kind==="min"&&(e===null||n.value>e)&&(e=n.value);return e}get maxValue(){let e=null;for(const n of this._def.checks)n.kind==="max"&&(e===null||n.value<e)&&(e=n.value);return e}get isInt(){return!!this._def.checks.find(e=>e.kind==="int"||e.kind==="multipleOf"&&v.isInteger(e.value))}get isFinite(){let e=null,n=null;for(const s of this._def.checks){if(s.kind==="finite"||s.kind==="int"||s.kind==="multipleOf")return!0;s.kind==="min"?(n===null||s.value>n)&&(n=s.value):s.kind==="max"&&(e===null||s.value<e)&&(e=s.value)}return Number.isFinite(n)&&Number.isFinite(e)}}K.create=t=>new K({checks:[],typeName:p.ZodNumber,coerce:t?.coerce||!1,..._(t)});class X extends y{constructor(){super(...arguments),this.min=this.gte,this.max=this.lte}_parse(e){if(this._def.coerce)try{e.data=BigInt(e.data)}catch{return this._getInvalidInput(e)}if(this._getType(e)!==h.bigint)return this._getInvalidInput(e);let s;const r=new w;for(const a of this._def.checks)a.kind==="min"?(a.inclusive?e.data<a.value:e.data<=a.value)&&(s=this._getOrReturnCtx(e,s),u(s,{code:c.too_small,type:"bigint",minimum:a.value,inclusive:a.inclusive,message:a.message}),r.dirty()):a.kind==="max"?(a.inclusive?e.data>a.value:e.data>=a.value)&&(s=this._getOrReturnCtx(e,s),u(s,{code:c.too_big,type:"bigint",maximum:a.value,inclusive:a.inclusive,message:a.message}),r.dirty()):a.kind==="multipleOf"?e.data%a.value!==BigInt(0)&&(s=this._getOrReturnCtx(e,s),u(s,{code:c.not_multiple_of,multipleOf:a.value,message:a.message}),r.dirty()):v.assertNever(a);return{status:r.value,value:e.data}}_getInvalidInput(e){const n=this._getOrReturnCtx(e);return u(n,{code:c.invalid_type,expected:h.bigint,received:n.parsedType}),m}gte(e,n){return this.setLimit("min",e,!0,f.toString(n))}gt(e,n){return this.setLimit("min",e,!1,f.toString(n))}lte(e,n){return this.setLimit("max",e,!0,f.toString(n))}lt(e,n){return this.setLimit("max",e,!1,f.toString(n))}setLimit(e,n,s,r){return new X({...this._def,checks:[...this._def.checks,{kind:e,value:n,inclusive:s,message:f.toString(r)}]})}_addCheck(e){return new X({...this._def,checks:[...this._def.checks,e]})}positive(e){return this._addCheck({kind:"min",value:BigInt(0),inclusive:!1,message:f.toString(e)})}negative(e){return this._addCheck({kind:"max",value:BigInt(0),inclusive:!1,message:f.toString(e)})}nonpositive(e){return this._addCheck({kind:"max",value:BigInt(0),inclusive:!0,message:f.toString(e)})}nonnegative(e){return this._addCheck({kind:"min",value:BigInt(0),inclusive:!0,message:f.toString(e)})}multipleOf(e,n){return this._addCheck({kind:"multipleOf",value:e,message:f.toString(n)})}get minValue(){let e=null;for(const n of this._def.checks)n.kind==="min"&&(e===null||n.value>e)&&(e=n.value);return e}get maxValue(){let e=null;for(const n of this._def.checks)n.kind==="max"&&(e===null||n.value<e)&&(e=n.value);return e}}X.create=t=>new X({checks:[],typeName:p.ZodBigInt,coerce:t?.coerce??!1,..._(t)});class Me extends y{_parse(e){if(this._def.coerce&&(e.data=!!e.data),this._getType(e)!==h.boolean){const s=this._getOrReturnCtx(e);return u(s,{code:c.invalid_type,expected:h.boolean,received:s.parsedType}),m}return k(e.data)}}Me.create=t=>new Me({typeName:p.ZodBoolean,coerce:t?.coerce||!1,..._(t)});class oe extends y{_parse(e){if(this._def.coerce&&(e.data=new Date(e.data)),this._getType(e)!==h.date){const a=this._getOrReturnCtx(e);return u(a,{code:c.invalid_type,expected:h.date,received:a.parsedType}),m}if(Number.isNaN(e.data.getTime())){const a=this._getOrReturnCtx(e);return u(a,{code:c.invalid_date}),m}const s=new w;let r;for(const a of this._def.checks)a.kind==="min"?e.data.getTime()<a.value&&(r=this._getOrReturnCtx(e,r),u(r,{code:c.too_small,message:a.message,inclusive:!0,exact:!1,minimum:a.value,type:"date"}),s.dirty()):a.kind==="max"?e.data.getTime()>a.value&&(r=this._getOrReturnCtx(e,r),u(r,{code:c.too_big,message:a.message,inclusive:!0,exact:!1,maximum:a.value,type:"date"}),s.dirty()):v.assertNever(a);return{status:s.value,value:new Date(e.data.getTime())}}_addCheck(e){return new oe({...this._def,checks:[...this._def.checks,e]})}min(e,n){return this._addCheck({kind:"min",value:e.getTime(),message:f.toString(n)})}max(e,n){return this._addCheck({kind:"max",value:e.getTime(),message:f.toString(n)})}get minDate(){let e=null;for(const n of this._def.checks)n.kind==="min"&&(e===null||n.value>e)&&(e=n.value);return e!=null?new Date(e):null}get maxDate(){let e=null;for(const n of this._def.checks)n.kind==="max"&&(e===null||n.value<e)&&(e=n.value);return e!=null?new Date(e):null}}oe.create=t=>new oe({checks:[],coerce:t?.coerce||!1,typeName:p.ZodDate,..._(t)});class Pe extends y{_parse(e){if(this._getType(e)!==h.symbol){const s=this._getOrReturnCtx(e);return u(s,{code:c.invalid_type,expected:h.symbol,received:s.parsedType}),m}return k(e.data)}}Pe.create=t=>new Pe({typeName:p.ZodSymbol,..._(t)});class He extends y{_parse(e){if(this._getType(e)!==h.undefined){const s=this._getOrReturnCtx(e);return u(s,{code:c.invalid_type,expected:h.undefined,received:s.parsedType}),m}return k(e.data)}}He.create=t=>new He({typeName:p.ZodUndefined,..._(t)});class je extends y{_parse(e){if(this._getType(e)!==h.null){const s=this._getOrReturnCtx(e);return u(s,{code:c.invalid_type,expected:h.null,received:s.parsedType}),m}return k(e.data)}}je.create=t=>new je({typeName:p.ZodNull,..._(t)});class ee extends y{constructor(){super(...arguments),this._any=!0}_parse(e){return k(e.data)}}ee.create=t=>new ee({typeName:p.ZodAny,..._(t)});class Fe extends y{constructor(){super(...arguments),this._unknown=!0}_parse(e){return k(e.data)}}Fe.create=t=>new Fe({typeName:p.ZodUnknown,..._(t)});class D extends y{_parse(e){const n=this._getOrReturnCtx(e);return u(n,{code:c.invalid_type,expected:h.never,received:n.parsedType}),m}}D.create=t=>new D({typeName:p.ZodNever,..._(t)});class Ve extends y{_parse(e){if(this._getType(e)!==h.undefined){const s=this._getOrReturnCtx(e);return u(s,{code:c.invalid_type,expected:h.void,received:s.parsedType}),m}return k(e.data)}}Ve.create=t=>new Ve({typeName:p.ZodVoid,..._(t)});class R extends y{_parse(e){const{ctx:n,status:s}=this._processInputParams(e),r=this._def;if(n.parsedType!==h.array)return u(n,{code:c.invalid_type,expected:h.array,received:n.parsedType}),m;if(r.exactLength!==null){const i=n.data.length>r.exactLength.value,o=n.data.length<r.exactLength.value;(i||o)&&(u(n,{code:i?c.too_big:c.too_small,minimum:o?r.exactLength.value:void 0,maximum:i?r.exactLength.value:void 0,type:"array",inclusive:!0,exact:!0,message:r.exactLength.message}),s.dirty())}if(r.minLength!==null&&n.data.length<r.minLength.value&&(u(n,{code:c.too_small,minimum:r.minLength.value,type:"array",inclusive:!0,exact:!1,message:r.minLength.message}),s.dirty()),r.maxLength!==null&&n.data.length>r.maxLength.value&&(u(n,{code:c.too_big,maximum:r.maxLength.value,type:"array",inclusive:!0,exact:!1,message:r.maxLength.message}),s.dirty()),n.common.async)return Promise.all([...n.data].map((i,o)=>r.type._parseAsync(new O(n,i,n.path,o)))).then(i=>w.mergeArray(s,i));const a=[...n.data].map((i,o)=>r.type._parseSync(new O(n,i,n.path,o)));return w.mergeArray(s,a)}get element(){return this._def.type}min(e,n){return new R({...this._def,minLength:{value:e,message:f.toString(n)}})}max(e,n){return new R({...this._def,maxLength:{value:e,message:f.toString(n)}})}length(e,n){return new R({...this._def,exactLength:{value:e,message:f.toString(n)}})}nonempty(e){return this.min(1,e)}}R.create=(t,e)=>new R({type:t,minLength:null,maxLength:null,exactLength:null,typeName:p.ZodArray,..._(e)});function H(t){if(t instanceof E){const e={};for(const n in t.shape){const s=t.shape[n];e[n]=N.create(H(s))}return new E({...t._def,shape:()=>e})}else return t instanceof R?new R({...t._def,type:H(t.element)}):t instanceof N?N.create(H(t.unwrap())):t instanceof G?G.create(H(t.unwrap())):t instanceof P?P.create(t.items.map(e=>H(e))):t}class E extends y{constructor(){super(...arguments),this._cached=null,this.nonstrict=this.passthrough,this.augment=this.extend}_getCached(){if(this._cached!==null)return this._cached;const e=this._def.shape(),n=v.objectKeys(e);return this._cached={shape:e,keys:n},this._cached}_parse(e){if(this._getType(e)!==h.object){const l=this._getOrReturnCtx(e);return u(l,{code:c.invalid_type,expected:h.object,received:l.parsedType}),m}const{status:s,ctx:r}=this._processInputParams(e),{shape:a,keys:i}=this._getCached(),o=[];if(!(this._def.catchall instanceof D&&this._def.unknownKeys==="strip"))for(const l in r.data)i.includes(l)||o.push(l);const d=[];for(const l of i){const g=a[l],b=r.data[l];d.push({key:{status:"valid",value:l},value:g._parse(new O(r,b,r.path,l)),alwaysSet:l in r.data})}if(this._def.catchall instanceof D){const l=this._def.unknownKeys;if(l==="passthrough")for(const g of o)d.push({key:{status:"valid",value:g},value:{status:"valid",value:r.data[g]}});else if(l==="strict")o.length>0&&(u(r,{code:c.unrecognized_keys,keys:o}),s.dirty());else if(l!=="strip")throw new Error("Internal ZodObject error: invalid unknownKeys value.")}else{const l=this._def.catchall;for(const g of o){const b=r.data[g];d.push({key:{status:"valid",value:g},value:l._parse(new O(r,b,r.path,g)),alwaysSet:g in r.data})}}return r.common.async?Promise.resolve().then(async()=>{const l=[];for(const g of d){const b=await g.key,se=await g.value;l.push({key:b,value:se,alwaysSet:g.alwaysSet})}return l}).then(l=>w.mergeObjectSync(s,l)):w.mergeObjectSync(s,d)}get shape(){return this._def.shape()}strict(e){return f.errToObj,new E({...this._def,unknownKeys:"strict",...e!==void 0?{errorMap:(n,s)=>{const r=this._def.errorMap?.(n,s).message??s.defaultError;return n.code==="unrecognized_keys"?{message:f.errToObj(e).message??r}:{message:r}}}:{}})}strip(){return new E({...this._def,unknownKeys:"strip"})}passthrough(){return new E({...this._def,unknownKeys:"passthrough"})}extend(e){return new E({...this._def,shape:()=>({...this._def.shape(),...e})})}merge(e){return new E({unknownKeys:e._def.unknownKeys,catchall:e._def.catchall,shape:()=>({...this._def.shape(),...e._def.shape()}),typeName:p.ZodObject})}setKey(e,n){return this.augment({[e]:n})}catchall(e){return new E({...this._def,catchall:e})}pick(e){const n={};for(const s of v.objectKeys(e))e[s]&&this.shape[s]&&(n[s]=this.shape[s]);return new E({...this._def,shape:()=>n})}omit(e){const n={};for(const s of v.objectKeys(this.shape))e[s]||(n[s]=this.shape[s]);return new E({...this._def,shape:()=>n})}deepPartial(){return H(this)}partial(e){const n={};for(const s of v.objectKeys(this.shape)){const r=this.shape[s];e&&!e[s]?n[s]=r:n[s]=r.optional()}return new E({...this._def,shape:()=>n})}required(e){const n={};for(const s of v.objectKeys(this.shape))if(e&&!e[s])n[s]=this.shape[s];else{let a=this.shape[s];for(;a instanceof N;)a=a._def.innerType;n[s]=a}return new E({...this._def,shape:()=>n})}keyof(){return it(v.objectKeys(this.shape))}}E.create=(t,e)=>new E({shape:()=>t,unknownKeys:"strip",catchall:D.create(),typeName:p.ZodObject,..._(e)});E.strictCreate=(t,e)=>new E({shape:()=>t,unknownKeys:"strict",catchall:D.create(),typeName:p.ZodObject,..._(e)});E.lazycreate=(t,e)=>new E({shape:t,unknownKeys:"strip",catchall:D.create(),typeName:p.ZodObject,..._(e)});class ce extends y{_parse(e){const{ctx:n}=this._processInputParams(e),s=this._def.options;function r(a){for(const o of a)if(o.result.status==="valid")return o.result;for(const o of a)if(o.result.status==="dirty")return n.common.issues.push(...o.ctx.common.issues),o.result;const i=a.map(o=>new I(o.ctx.common.issues));return u(n,{code:c.invalid_union,unionErrors:i}),m}if(n.common.async)return Promise.all(s.map(async a=>{const i={...n,common:{...n.common,issues:[]},parent:null};return{result:await a._parseAsync({data:n.data,path:n.path,parent:i}),ctx:i}})).then(r);{let a;const i=[];for(const d of s){const l={...n,common:{...n.common,issues:[]},parent:null},g=d._parseSync({data:n.data,path:n.path,parent:l});if(g.status==="valid")return g;g.status==="dirty"&&!a&&(a={result:g,ctx:l}),l.common.issues.length&&i.push(l.common.issues)}if(a)return n.common.issues.push(...a.ctx.common.issues),a.result;const o=i.map(d=>new I(d));return u(n,{code:c.invalid_union,unionErrors:o}),m}}get options(){return this._def.options}}ce.create=(t,e)=>new ce({options:t,typeName:p.ZodUnion,..._(e)});function _e(t,e){const n=B(t),s=B(e);if(t===e)return{valid:!0,data:t};if(n===h.object&&s===h.object){const r=v.objectKeys(e),a=v.objectKeys(t).filter(o=>r.indexOf(o)!==-1),i={...t,...e};for(const o of a){const d=_e(t[o],e[o]);if(!d.valid)return{valid:!1};i[o]=d.data}return{valid:!0,data:i}}else if(n===h.array&&s===h.array){if(t.length!==e.length)return{valid:!1};const r=[];for(let a=0;a<t.length;a++){const i=t[a],o=e[a],d=_e(i,o);if(!d.valid)return{valid:!1};r.push(d.data)}return{valid:!0,data:r}}else return n===h.date&&s===h.date&&+t==+e?{valid:!0,data:t}:{valid:!1}}class de extends y{_parse(e){const{status:n,ctx:s}=this._processInputParams(e),r=(a,i)=>{if(De(a)||De(i))return m;const o=_e(a.value,i.value);return o.valid?((Le(a)||Le(i))&&n.dirty(),{status:n.value,value:o.data}):(u(s,{code:c.invalid_intersection_types}),m)};return s.common.async?Promise.all([this._def.left._parseAsync({data:s.data,path:s.path,parent:s}),this._def.right._parseAsync({data:s.data,path:s.path,parent:s})]).then(([a,i])=>r(a,i)):r(this._def.left._parseSync({data:s.data,path:s.path,parent:s}),this._def.right._parseSync({data:s.data,path:s.path,parent:s}))}}de.create=(t,e,n)=>new de({left:t,right:e,typeName:p.ZodIntersection,..._(n)});class P extends y{_parse(e){const{status:n,ctx:s}=this._processInputParams(e);if(s.parsedType!==h.array)return u(s,{code:c.invalid_type,expected:h.array,received:s.parsedType}),m;if(s.data.length<this._def.items.length)return u(s,{code:c.too_small,minimum:this._def.items.length,inclusive:!0,exact:!1,type:"array"}),m;!this._def.rest&&s.data.length>this._def.items.length&&(u(s,{code:c.too_big,maximum:this._def.items.length,inclusive:!0,exact:!1,type:"array"}),n.dirty());const a=[...s.data].map((i,o)=>{const d=this._def.items[o]||this._def.rest;return d?d._parse(new O(s,i,s.path,o)):null}).filter(i=>!!i);return s.common.async?Promise.all(a).then(i=>w.mergeArray(n,i)):w.mergeArray(n,a)}get items(){return this._def.items}rest(e){return new P({...this._def,rest:e})}}P.create=(t,e)=>{if(!Array.isArray(t))throw new Error("You must pass an array of schemas to z.tuple([ ... ])");return new P({items:t,typeName:p.ZodTuple,rest:null,..._(e)})};class Ue extends y{get keySchema(){return this._def.keyType}get valueSchema(){return this._def.valueType}_parse(e){const{status:n,ctx:s}=this._processInputParams(e);if(s.parsedType!==h.map)return u(s,{code:c.invalid_type,expected:h.map,received:s.parsedType}),m;const r=this._def.keyType,a=this._def.valueType,i=[...s.data.entries()].map(([o,d],l)=>({key:r._parse(new O(s,o,s.path,[l,"key"])),value:a._parse(new O(s,d,s.path,[l,"value"]))}));if(s.common.async){const o=new Map;return Promise.resolve().then(async()=>{for(const d of i){const l=await d.key,g=await d.value;if(l.status==="aborted"||g.status==="aborted")return m;(l.status==="dirty"||g.status==="dirty")&&n.dirty(),o.set(l.value,g.value)}return{status:n.value,value:o}})}else{const o=new Map;for(const d of i){const l=d.key,g=d.value;if(l.status==="aborted"||g.status==="aborted")return m;(l.status==="dirty"||g.status==="dirty")&&n.dirty(),o.set(l.value,g.value)}return{status:n.value,value:o}}}}Ue.create=(t,e,n)=>new Ue({valueType:e,keyType:t,typeName:p.ZodMap,..._(n)});class te extends y{_parse(e){const{status:n,ctx:s}=this._processInputParams(e);if(s.parsedType!==h.set)return u(s,{code:c.invalid_type,expected:h.set,received:s.parsedType}),m;const r=this._def;r.minSize!==null&&s.data.size<r.minSize.value&&(u(s,{code:c.too_small,minimum:r.minSize.value,type:"set",inclusive:!0,exact:!1,message:r.minSize.message}),n.dirty()),r.maxSize!==null&&s.data.size>r.maxSize.value&&(u(s,{code:c.too_big,maximum:r.maxSize.value,type:"set",inclusive:!0,exact:!1,message:r.maxSize.message}),n.dirty());const a=this._def.valueType;function i(d){const l=new Set;for(const g of d){if(g.status==="aborted")return m;g.status==="dirty"&&n.dirty(),l.add(g.value)}return{status:n.value,value:l}}const o=[...s.data.values()].map((d,l)=>a._parse(new O(s,d,s.path,l)));return s.common.async?Promise.all(o).then(d=>i(d)):i(o)}min(e,n){return new te({...this._def,minSize:{value:e,message:f.toString(n)}})}max(e,n){return new te({...this._def,maxSize:{value:e,message:f.toString(n)}})}size(e,n){return this.min(e,n).max(e,n)}nonempty(e){return this.min(1,e)}}te.create=(t,e)=>new te({valueType:t,minSize:null,maxSize:null,typeName:p.ZodSet,..._(e)});class ze extends y{get schema(){return this._def.getter()}_parse(e){const{ctx:n}=this._processInputParams(e);return this._def.getter()._parse({data:n.data,path:n.path,parent:n})}}ze.create=(t,e)=>new ze({getter:t,typeName:p.ZodLazy,..._(e)});class Ge extends y{_parse(e){if(e.data!==this._def.value){const n=this._getOrReturnCtx(e);return u(n,{received:n.data,code:c.invalid_literal,expected:this._def.value}),m}return{status:"valid",value:e.data}}get value(){return this._def.value}}Ge.create=(t,e)=>new Ge({value:t,typeName:p.ZodLiteral,..._(e)});function it(t,e){return new U({values:t,typeName:p.ZodEnum,..._(e)})}class U extends y{_parse(e){if(typeof e.data!="string"){const n=this._getOrReturnCtx(e),s=this._def.values;return u(n,{expected:v.joinValues(s),received:n.parsedType,code:c.invalid_type}),m}if(this._cache||(this._cache=new Set(this._def.values)),!this._cache.has(e.data)){const n=this._getOrReturnCtx(e),s=this._def.values;return u(n,{received:n.data,code:c.invalid_enum_value,options:s}),m}return k(e.data)}get options(){return this._def.values}get enum(){const e={};for(const n of this._def.values)e[n]=n;return e}get Values(){const e={};for(const n of this._def.values)e[n]=n;return e}get Enum(){const e={};for(const n of this._def.values)e[n]=n;return e}extract(e,n=this._def){return U.create(e,{...this._def,...n})}exclude(e,n=this._def){return U.create(this.options.filter(s=>!e.includes(s)),{...this._def,...n})}}U.create=it;class $e extends y{_parse(e){const n=v.getValidEnumValues(this._def.values),s=this._getOrReturnCtx(e);if(s.parsedType!==h.string&&s.parsedType!==h.number){const r=v.objectValues(n);return u(s,{expected:v.joinValues(r),received:s.parsedType,code:c.invalid_type}),m}if(this._cache||(this._cache=new Set(v.getValidEnumValues(this._def.values))),!this._cache.has(e.data)){const r=v.objectValues(n);return u(s,{received:s.data,code:c.invalid_enum_value,options:r}),m}return k(e.data)}get enum(){return this._def.values}}$e.create=(t,e)=>new $e({values:t,typeName:p.ZodNativeEnum,..._(e)});class le extends y{unwrap(){return this._def.type}_parse(e){const{ctx:n}=this._processInputParams(e);if(n.parsedType!==h.promise&&n.common.async===!1)return u(n,{code:c.invalid_type,expected:h.promise,received:n.parsedType}),m;const s=n.parsedType===h.promise?n.data:Promise.resolve(n.data);return k(s.then(r=>this._def.type.parseAsync(r,{path:n.path,errorMap:n.common.contextualErrorMap})))}}le.create=(t,e)=>new le({type:t,typeName:p.ZodPromise,..._(e)});class z extends y{innerType(){return this._def.schema}sourceType(){return this._def.schema._def.typeName===p.ZodEffects?this._def.schema.sourceType():this._def.schema}_parse(e){const{status:n,ctx:s}=this._processInputParams(e),r=this._def.effect||null,a={addIssue:i=>{u(s,i),i.fatal?n.abort():n.dirty()},get path(){return s.path}};if(a.addIssue=a.addIssue.bind(a),r.type==="preprocess"){const i=r.transform(s.data,a);if(s.common.async)return Promise.resolve(i).then(async o=>{if(n.value==="aborted")return m;const d=await this._def.schema._parseAsync({data:o,path:s.path,parent:s});return d.status==="aborted"?m:d.status==="dirty"||n.value==="dirty"?Y(d.value):d});{if(n.value==="aborted")return m;const o=this._def.schema._parseSync({data:i,path:s.path,parent:s});return o.status==="aborted"?m:o.status==="dirty"||n.value==="dirty"?Y(o.value):o}}if(r.type==="refinement"){const i=o=>{const d=r.refinement(o,a);if(s.common.async)return Promise.resolve(d);if(d instanceof Promise)throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");return o};if(s.common.async===!1){const o=this._def.schema._parseSync({data:s.data,path:s.path,parent:s});return o.status==="aborted"?m:(o.status==="dirty"&&n.dirty(),i(o.value),{status:n.value,value:o.value})}else return this._def.schema._parseAsync({data:s.data,path:s.path,parent:s}).then(o=>o.status==="aborted"?m:(o.status==="dirty"&&n.dirty(),i(o.value).then(()=>({status:n.value,value:o.value}))))}if(r.type==="transform")if(s.common.async===!1){const i=this._def.schema._parseSync({data:s.data,path:s.path,parent:s});if(!V(i))return m;const o=r.transform(i.value,a);if(o instanceof Promise)throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");return{status:n.value,value:o}}else return this._def.schema._parseAsync({data:s.data,path:s.path,parent:s}).then(i=>V(i)?Promise.resolve(r.transform(i.value,a)).then(o=>({status:n.value,value:o})):m);v.assertNever(r)}}z.create=(t,e,n)=>new z({schema:t,typeName:p.ZodEffects,effect:e,..._(n)});z.createWithPreprocess=(t,e,n)=>new z({schema:e,effect:{type:"preprocess",transform:t},typeName:p.ZodEffects,..._(n)});class N extends y{_parse(e){return this._getType(e)===h.undefined?k(void 0):this._def.innerType._parse(e)}unwrap(){return this._def.innerType}}N.create=(t,e)=>new N({innerType:t,typeName:p.ZodOptional,..._(e)});class G extends y{_parse(e){return this._getType(e)===h.null?k(null):this._def.innerType._parse(e)}unwrap(){return this._def.innerType}}G.create=(t,e)=>new G({innerType:t,typeName:p.ZodNullable,..._(e)});class ye extends y{_parse(e){const{ctx:n}=this._processInputParams(e);let s=n.data;return n.parsedType===h.undefined&&(s=this._def.defaultValue()),this._def.innerType._parse({data:s,path:n.path,parent:n})}removeDefault(){return this._def.innerType}}ye.create=(t,e)=>new ye({innerType:t,typeName:p.ZodDefault,defaultValue:typeof e.default=="function"?e.default:()=>e.default,..._(e)});class ve extends y{_parse(e){const{ctx:n}=this._processInputParams(e),s={...n,common:{...n.common,issues:[]}},r=this._def.innerType._parse({data:s.data,path:s.path,parent:{...s}});return ie(r)?r.then(a=>({status:"valid",value:a.status==="valid"?a.value:this._def.catchValue({get error(){return new I(s.common.issues)},input:s.data})})):{status:"valid",value:r.status==="valid"?r.value:this._def.catchValue({get error(){return new I(s.common.issues)},input:s.data})}}removeCatch(){return this._def.innerType}}ve.create=(t,e)=>new ve({innerType:t,typeName:p.ZodCatch,catchValue:typeof e.catch=="function"?e.catch:()=>e.catch,..._(e)});class qe extends y{_parse(e){if(this._getType(e)!==h.nan){const s=this._getOrReturnCtx(e);return u(s,{code:c.invalid_type,expected:h.nan,received:s.parsedType}),m}return{status:"valid",value:e.data}}}qe.create=t=>new qe({typeName:p.ZodNaN,..._(t)});class Fn extends y{_parse(e){const{ctx:n}=this._processInputParams(e),s=n.data;return this._def.type._parse({data:s,path:n.path,parent:n})}unwrap(){return this._def.type}}class be extends y{_parse(e){const{status:n,ctx:s}=this._processInputParams(e);if(s.common.async)return(async()=>{const a=await this._def.in._parseAsync({data:s.data,path:s.path,parent:s});return a.status==="aborted"?m:a.status==="dirty"?(n.dirty(),Y(a.value)):this._def.out._parseAsync({data:a.value,path:s.path,parent:s})})();{const r=this._def.in._parseSync({data:s.data,path:s.path,parent:s});return r.status==="aborted"?m:r.status==="dirty"?(n.dirty(),{status:"dirty",value:r.value}):this._def.out._parseSync({data:r.value,path:s.path,parent:s})}}static create(e,n){return new be({in:e,out:n,typeName:p.ZodPipeline})}}class Ee extends y{_parse(e){const n=this._def.innerType._parse(e),s=r=>(V(r)&&(r.value=Object.freeze(r.value)),r);return ie(n)?n.then(r=>s(r)):s(n)}unwrap(){return this._def.innerType}}Ee.create=(t,e)=>new Ee({innerType:t,typeName:p.ZodReadonly,..._(e)});function We(t,e){const n=typeof t=="function"?t(e):typeof t=="string"?{message:t}:t;return typeof n=="string"?{message:n}:n}function ot(t,e={},n){return t?ee.create().superRefine((s,r)=>{const a=t(s);if(a instanceof Promise)return a.then(i=>{if(!i){const o=We(e,s),d=o.fatal??n??!0;r.addIssue({code:"custom",...o,fatal:d})}});if(!a){const i=We(e,s),o=i.fatal??n??!0;r.addIssue({code:"custom",...i,fatal:o})}}):ee.create()}var p;(function(t){t.ZodString="ZodString",t.ZodNumber="ZodNumber",t.ZodNaN="ZodNaN",t.ZodBigInt="ZodBigInt",t.ZodBoolean="ZodBoolean",t.ZodDate="ZodDate",t.ZodSymbol="ZodSymbol",t.ZodUndefined="ZodUndefined",t.ZodNull="ZodNull",t.ZodAny="ZodAny",t.ZodUnknown="ZodUnknown",t.ZodNever="ZodNever",t.ZodVoid="ZodVoid",t.ZodArray="ZodArray",t.ZodObject="ZodObject",t.ZodUnion="ZodUnion",t.ZodDiscriminatedUnion="ZodDiscriminatedUnion",t.ZodIntersection="ZodIntersection",t.ZodTuple="ZodTuple",t.ZodRecord="ZodRecord",t.ZodMap="ZodMap",t.ZodSet="ZodSet",t.ZodFunction="ZodFunction",t.ZodLazy="ZodLazy",t.ZodLiteral="ZodLiteral",t.ZodEnum="ZodEnum",t.ZodEffects="ZodEffects",t.ZodNativeEnum="ZodNativeEnum",t.ZodOptional="ZodOptional",t.ZodNullable="ZodNullable",t.ZodDefault="ZodDefault",t.ZodCatch="ZodCatch",t.ZodPromise="ZodPromise",t.ZodBranded="ZodBranded",t.ZodPipeline="ZodPipeline",t.ZodReadonly="ZodReadonly"})(p||(p={}));ee.create;D.create;R.create;ce.create;de.create;P.create;const Vn=U.create;le.create;N.create;G.create;const ct={"SHA-256":"sha256-","SHA-384":"sha384-","SHA-512":"sha512-"},Un=Object.values(ct);Vn(Object.keys(ct)).optional().default("SHA-256");ot(t=>typeof t!="string"?!1:Un.some(e=>t.startsWith(e)));const zn=["base-uri","child-src","connect-src","default-src","fenced-frame-src","font-src","form-action","frame-ancestors","frame-src","img-src","manifest-src","media-src","object-src","referrer","report-to","report-uri","require-trusted-types-for","sandbox","trusted-types","upgrade-insecure-requests","worker-src"];ot(t=>typeof t!="string"?!1:zn.some(e=>t.startsWith(e)));new TextEncoder;new TextDecoder;const dt=Symbol.for("astro.renderTemplateResult");class Gn{[dt]=!0;htmlParts;expressions;error;constructor(e,n){this.htmlParts=e,this.error=void 0,this.expressions=n.map(s=>F(s)?Promise.resolve(s).catch(r=>{if(!this.error)throw this.error=r,r}):s)}render(e){const n=this.expressions.map(a=>st(e,i=>{if(a||a===0)return $(i,a)}));let s=0;const r=()=>{for(;s<this.htmlParts.length;){const a=this.htmlParts[s],i=n[s];if(s++,a&&e.write(A(a)),i){const o=i.flush();if(F(o))return o.then(r)}}};return r()}}function $n(t){return typeof t=="object"&&t!==null&&!!t[dt]}function qn(t,...e){return new Gn(t,e)}const Ye=Symbol.for("astro:slot-string");class Wn extends ae{instructions;[Ye];constructor(e,n){super(e),this.instructions=n,this[Ye]=!0}}A(`async function replaceServerIsland(id, r) {
	let s = document.querySelector(\`script[data-island-id="\${id}"]\`);
	// If there's no matching script, or the request fails then return
	if (!s || r.status !== 200 || r.headers.get('content-type')?.split(';')[0].trim() !== 'text/html') return;
	// Load the HTML before modifying the DOM in case of errors
	let html = await r.text();
	// Remove any placeholder content before the island script
	while (s.previousSibling && s.previousSibling.nodeType !== 8 && s.previousSibling.data !== '[if astro]>server-island-start<![endif]')
		s.previousSibling.remove();
	s.previousSibling?.remove();
	// Insert the new HTML
	s.before(document.createRange().createContextualFragment(html));
	// Remove the script. Prior to v5.4.2, this was the trick to force rerun of scripts.  Keeping it to minimize change to the existing behavior.
	s.remove();
}`.split(`
`).map(t=>t.trim()).filter(t=>t&&!t.startsWith("//")).join(" "));new TextEncoder;new TextDecoder;function Yn(t){return!!t&&typeof t=="object"&&"render"in t&&typeof t.render=="function"}function $(t,e){if(F(e))return e.then(n=>$(t,n));if(e instanceof Wn){t.write(e);return}if(en(e)){t.write(e);return}if(Array.isArray(e))return Jn(t,e);if(typeof e=="function")return $(t,e());if(!(!e&&e!==0)){if(typeof e=="string"){t.write(A(Xt(e)));return}if(Yn(e)||$n(e)||es(e))return e.render(t);if(ArrayBuffer.isView(e)){t.write(e);return}if(typeof e=="object"&&(Symbol.asyncIterator in e||Symbol.iterator in e))return Symbol.asyncIterator in e?Kn(t,e):Qn(t,e);t.write(e)}}function Jn(t,e){const s=e.map(a=>st(t,i=>$(i,a)))[Symbol.iterator](),r=()=>{for(;;){const{value:a,done:i}=s.next();if(i)break;const o=a.flush();if(F(o))return o.then(r)}};return r()}function Qn(t,e){const n=e[Symbol.iterator](),s=()=>{for(;;){const{value:r,done:a}=n.next();if(a)break;const i=$(t,r);if(F(i))return i.then(s)}};return s()}async function Kn(t,e){for await(const n of e)await $(t,n)}const Xn=Symbol.for("astro.componentInstance");function es(t){return typeof t=="object"&&t!==null&&!!t[Xn]}/*! https://mths.be/cssesc v3.0.0 by @mathias */var pe,Je;function ts(){if(Je)return pe;Je=1;var t={},e=t.hasOwnProperty,n=function(d,l){if(!d)return l;var g={};for(var b in l)g[b]=e.call(d,b)?d[b]:l[b];return g},s=/[ -,\.\/:-@\[-\^`\{-~]/,r=/[ -,\.\/:-@\[\]\^`\{-~]/,a=/(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g,i=function o(d,l){l=n(l,o.options),l.quotes!="single"&&l.quotes!="double"&&(l.quotes="single");for(var g=l.quotes=="double"?'"':"'",b=l.isIdentifier,se=d.charAt(0),T="",q=0,Ae=d.length;q<Ae;){var x=d.charAt(q++),S=x.charCodeAt(),L=void 0;if(S<32||S>126){if(S>=55296&&S<=56319&&q<Ae){var we=d.charCodeAt(q++);(we&64512)==56320?S=((S&1023)<<10)+(we&1023)+65536:q--}L="\\"+S.toString(16).toUpperCase()+" "}else l.escapeEverything?s.test(x)?L="\\"+x:L="\\"+S.toString(16).toUpperCase()+" ":/[\t\n\f\r\x0B]/.test(x)?L="\\"+S.toString(16).toUpperCase()+" ":x=="\\"||!b&&(x=='"'&&g==x||x=="'"&&g==x)||b&&r.test(x)?L="\\"+x:L=x;T+=L}return b&&(/^-[-\d]/.test(T)?T="\\-"+T.slice(1):/\d/.test(se)&&(T="\\3"+se+" "+T.slice(1))),T=T.replace(a,function(ft,ue,mt){return ue&&ue.length%2?ft:(ue||"")+mt}),!b&&l.wrap?g+T+g:T};return i.options={escapeEverything:!1,isIdentifier:!1,quotes:"single",wrap:!1},i.version="3.0.0",pe=i,pe}ts();"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_".split("").reduce((t,e)=>(t[e.charCodeAt(0)]=e,t),[]);"-0123456789_".split("").reduce((t,e)=>(t[e.charCodeAt(0)]=e,t),[]);function ns(t={},e,{class:n}={}){let s="";n&&(typeof t.class<"u"?t.class+=` ${n}`:typeof t["class:list"]<"u"?t["class:list"]=[t["class:list"],n]:t.class=n);for(const[r,a]of Object.entries(t))s+=un(a,r,!0,e);return A(s)}function ne({meta:t,attributes:e,children:n}){const s=$t((r,a)=>{const i=is(e,a);return qn`<svg${ns(i)}>${Q(n)}</svg>`});return Object.assign(s,t)}const ss=["xmlns","xmlns:xlink","version"],rs={};function as(t){for(const e of ss)delete t[e];return t}function is(t,e){return as({...rs,...t,...e})}const os=ne({meta:{src:"/_astro/wechat-logo.VKjKmcRY.svg",width:800,height:800,format:"svg"},attributes:{width:"800px",height:"800px",viewBox:"0 0 300 300"},children:`
\r<path fill="#2DC100" d="M300 255c0 24.854-20.147 45-45 45H45c-24.854 0-45-20.146-45-45V45C0 20.147 20.147 0 45 0h210c24.853 0 45 20.147 45 45v210z" />
\r<g fill="#FFF">
\r<path d="M200.803 111.88c-24.213 1.265-45.268 8.605-62.362 25.188-17.271 16.754-25.155 37.284-23 62.734-9.464-1.172-18.084-2.462-26.753-3.192-2.994-.252-6.547.106-9.083 1.537-8.418 4.75-16.488 10.113-26.053 16.092 1.755-7.938 2.891-14.889 4.902-21.575 1.479-4.914.794-7.649-3.733-10.849-29.066-20.521-41.318-51.232-32.149-82.85 8.483-29.25 29.315-46.989 57.621-56.236 38.635-12.62 82.054.253 105.547 30.927 8.485 11.08 13.688 23.516 15.063 38.224zm-111.437-9.852c.223-5.783-4.788-10.993-10.74-11.167-6.094-.179-11.106 4.478-11.284 10.483-.18 6.086 4.475 10.963 10.613 11.119 6.085.154 11.186-4.509 11.411-10.435zm58.141-11.171c-5.974.11-11.022 5.198-10.916 11.004.109 6.018 5.061 10.726 11.204 10.652 6.159-.074 10.83-4.832 10.772-10.977-.051-6.032-4.981-10.79-11.06-10.679z" />
\r<path d="M255.201 262.83c-7.667-3.414-14.7-8.536-22.188-9.318-7.459-.779-15.3 3.524-23.104 4.322-23.771 2.432-45.067-4.193-62.627-20.432-33.397-30.89-28.625-78.254 10.014-103.568 34.341-22.498 84.704-14.998 108.916 16.219 21.129 27.24 18.646 63.4-7.148 86.284-7.464 6.623-10.15 12.073-5.361 20.804.884 1.612.985 3.653 1.498 5.689zm-87.274-84.499c4.881.005 8.9-3.815 9.085-8.636.195-5.104-3.91-9.385-9.021-9.406-5.06-.023-9.299 4.318-9.123 9.346.166 4.804 4.213 8.69 9.059 8.696zm56.261-18.022c-4.736-.033-8.76 3.844-8.953 8.629-.205 5.117 3.772 9.319 8.836 9.332 4.898.016 8.768-3.688 8.946-8.562.19-5.129-3.789-9.364-8.829-9.399z" />
\r</g>
\r`}),cs=ne({meta:{src:"/_astro/zhihu-logo.D9VgesC6.svg",width:64,height:30,format:"svg"},attributes:{viewBox:"0 0 200 91",width:"64",height:"30",style:"fill: rgb(15, 136, 235)"},children:`
<path d="M53.29 80.035l7.32.002 2.41 8.24 13.128-8.24h15.477v-67.98H53.29v67.978zm7.79-60.598h22.756v53.22h-8.73l-8.718 5.473-1.587-5.46-3.72-.012v-53.22zM46.818 43.162h-16.35c.545-8.467.687-16.12.687-22.955h15.987s.615-7.05-2.68-6.97H16.807c1.09-4.1 2.46-8.332 4.1-12.708 0 0-7.523 0-10.085 6.74-1.06 2.78-4.128 13.48-9.592 24.41 1.84-.2 7.927-.37 11.512-6.94.66-1.84.785-2.08 1.605-4.54h9.02c0 3.28-.374 20.9-.526 22.95H6.51c-3.67 0-4.863 7.38-4.863 7.38H22.14C20.765 66.11 13.385 79.24 0 89.62c6.403 1.828 12.784-.29 15.937-3.094 0 0 7.182-6.53 11.12-21.64L43.92 85.18s2.473-8.402-.388-12.496c-2.37-2.788-8.768-10.33-11.496-13.064l-4.57 3.627c1.363-4.368 2.183-8.61 2.46-12.71H49.19s-.027-7.38-2.372-7.38zm128.752-.502c6.51-8.013 14.054-18.302 14.054-18.302s-5.827-4.625-8.556-1.27c-1.874 2.548-11.51 15.063-11.51 15.063l6.012 4.51zm-46.903-18.462c-2.814-2.577-8.096.667-8.096.667s12.35 17.2 12.85 17.953l6.08-4.29s-8.02-11.752-10.83-14.33zM199.99 46.5c-6.18 0-40.908.292-40.953.292v-31.56c1.503 0 3.882-.124 7.14-.376 12.773-.753 21.914-1.25 27.427-1.504 0 0 3.817-8.496-.185-10.45-.96-.37-7.24 1.43-7.24 1.43s-51.63 5.153-72.61 5.64c.5 2.756 2.38 5.336 4.93 6.11 4.16 1.087 7.09.53 15.36.277 7.76-.5 13.65-.76 17.66-.76v31.19h-41.71s.88 6.97 7.97 7.14h33.73v22.16c0 4.364-3.498 6.87-7.65 6.6-4.4.034-8.15-.36-13.027-.566.623 1.24 1.977 4.496 6.035 6.824 3.087 1.502 5.054 2.053 8.13 2.053 9.237 0 14.27-5.4 14.027-14.16V53.93h38.235c3.026 0 2.72-7.432 2.72-7.432z" />
`}),ds=ne({meta:{src:"/_astro/toutiao-logo.Df5nxUWz.svg",width:100,height:28,format:"svg"},attributes:{width:"100",height:"28",viewBox:"0 0 100 28",fill:"none"},children:`
<path fill-rule="evenodd" clip-rule="evenodd" d="M1.93164 10.3317V14.3837C7.2482 11.6854 10.9948 8.95192 13.5672 5.83526C16.4925 9.25265 21.2519 12.1941 25.445 14.3489V10.2969C20.8296 7.79219 17.4523 5.1598 15.6771 2.73546C15.8509 2.41916 16.0156 2.09858 16.1715 1.77344H12.0732C10.1282 4.91728 6.89822 7.64194 1.93164 10.3317ZM63.5469 2.54248H67.02C66.9408 9.13806 66.8182 13.0816 65.8616 16.1294H73.0975V19.2383H64.4141C63.0302 21.3962 60.8847 23.3886 57.5383 26.1911H52.0508C52.2598 26.041 52.4689 25.865 52.6558 25.7075L52.6559 25.7074L52.656 25.7074L52.7454 25.6322C56.141 22.8738 58.4589 20.9661 60.0326 19.2383H51.2168V16.1294H62.1548C63.3744 13.3737 63.4436 9.46882 63.5469 2.54248ZM32.1126 3.31002H48.1237V3.31006H48.1261V26.2252H48.1236V26.2261H28.5352V23.1172H28.5353V16.1291V13.0202V6.41893V3.31002H32.1126ZM44.5488 23.1172V6.41893H32.1126V13.0202H43.0182V16.1291H32.1126V23.1172H44.5488ZM60.9736 7.88609V4.42787L53.2285 3.31006V6.76828L60.9736 7.88609ZM53.2285 9.17944V12.6377L60.9736 13.7555V10.2973L53.2285 9.17944ZM12.0762 26.1899C14.9935 23.2048 17.2623 20.7787 18.666 19.2384H3.83976V16.1295H19.856V16.0947H23.4333V19.2735L22.9818 19.7975C22.9784 19.8009 22.9546 19.8278 22.911 19.8773L22.9107 19.8776C22.5086 20.3331 20.4253 22.6934 17.0428 26.1899H12.0762ZM85.2871 16.1294H76.1523V19.2383H85.2871V26.2256H88.8644V19.2383H98.0331V16.1294H88.8644V14.3838H85.2871V16.1294ZM83.3736 3.31006H93.6222H96.8171H96.8175V6.90801C95.8151 7.80593 94.3112 9.10167 91.7005 10.4621C93.5225 10.9345 95.6276 11.3867 98.0701 11.7985V15.117C93.361 14.3424 89.7809 13.4156 87.0144 12.4622C84.2175 13.4423 80.675 14.3703 76.1523 15.1169V11.7984C78.5246 11.3971 80.5802 10.9592 82.3662 10.5026C80.4516 9.51195 79.2141 8.58917 78.2732 7.88615C78.1689 7.80749 77.3992 7.1974 77.0219 6.89803L76.7754 6.73372L80.0749 1.77344L83.3736 3.31006ZM92.3616 6.41897C91.2031 7.20845 89.5661 8.12305 87.1176 9.03688C84.6722 8.12375 83.0174 7.20852 81.8092 6.41897H92.3616ZM69.6947 20.7769H65.4922L68.8611 26.2262H73.0984L69.6947 20.7769ZM90.4941 20.7769H94.6966L98.0656 26.2262H93.8631L90.4941 20.7769ZM83.7589 20.7769H79.5564L76.1875 26.2262H80.39L83.7589 20.7769ZM10.791 10.158V13.6162L17.251 14.5244V11.0662L10.791 10.158Z" fill="#F04142" />
`}),ls=ne({meta:{src:"/_astro/csdn-logo.BHwrb1Wb.svg",width:500,height:114,format:"svg"},attributes:{"xmlns:dc":"http://purl.org/dc/elements/1.1/","xmlns:cc":"http://creativecommons.org/ns#","xmlns:rdf":"http://www.w3.org/1999/02/22-rdf-syntax-ns#","xmlns:svg":"http://www.w3.org/2000/svg",height:"113.54473",width:"500",id:"svg2",viewBox:"0 0 500 113.54473"},children:`
  <metadata id="metadata12">
    <rdf:RDF>
      <cc:Work rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
        <dc:title></dc:title>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <defs id="defs10" />
  <path style="fill:#262626" id="path4" d="m 129.51179,83.4172 c 9.30714,3.40291 28.7193,6.78583 44.41737,6.78583 16.91482,0 26.32967,-4.68345 27.08366,-11.95203 0.68617,-6.6303 -6.23934,-7.5279 -25.34032,-12.05181 C 149.279,59.72847 132.43997,49.71122 134.09156,33.70198 136.01044,15.11563 160.884,1.06914 199.05006,1.06914 c 18.6063,0 36.64612,1.3125 45.99316,4.37631 l -3.20744,23.4374 c -6.06779,-2.11036 -29.29376,-5.04253 -45.0038,-5.04253 -15.92945,0 -24.17542,5.01062 -24.7459,10.50395 -0.71808,6.95343 7.55981,7.27656 28.25254,12.78585 28.02116,7.10901 40.27243,17.11828 38.66872,32.63683 -1.87898,18.25528 -24.25921,33.77778 -68.94785,33.77778 -18.60231,0 -34.63549,-3.3949 -43.4679,-6.7899 L 129.5078,83.42119 Z M 392.11041,6.89758 c 101.74823,-19.18476 110.52878,15.28717 107.38518,45.78969 l -5.92418,56.42926 -32.29773,0 5.40556,-51.46651 c 1.16888,-11.33373 8.44544,-33.50252 -26.68473,-32.67273 -12.15952,0.29521 -18.18742,1.96275 -18.18742,1.96275 0,0 -1.05718,13.69542 -2.33776,23.81639 l -6.12364,58.3601 -31.6754,0 6.28721,-57.51835 4.15291,-44.7006 z M 263.59766,4.2287 c 7.2606,-0.78989 18.41481,-1.59174 33.76581,-1.59174 25.62755,0 46.34821,4.46008 59.17794,13.83903 11.52123,8.74465 19.18875,22.90283 17.06642,43.41604 -1.95877,19.08902 -11.88426,32.4533 -26.33367,40.7192 -13.22069,7.7952 -29.88019,11.1263 -54.93327,11.1263 -14.77255,0 -28.86291,-0.7978 -39.57829,-2.3856 L 263.60165,4.2287 Z m 21.17544,84.22704 c 2.4694,0.47872 5.71673,0.95345 12.11963,0.95345 25.63553,0 43.71125,-12.59835 45.5264,-30.31104 2.63696,-25.60361 -13.39622,-34.5557 -40.40807,-34.40012 -3.49866,0 -8.36167,0 -10.9348,0.47074 l -6.30715,63.28298 z" />
  <path style="fill:#ca0c16" id="path6" d="m 111.14086,109.99823 c -6.07577,2.1063 -18.662147,3.5425 -36.247187,3.5425 -50.56893,0 -77.8640296,-23.7366 -74.63664955,-55.11678 C 4.1187134,21.03581 44.554713,0 88.828463,0 105.97466,0 116.07169,1.38031 125.53043,3.69413 l -3.03589,25.18872 c -6.2912,-2.11834 -21.03582,-4.06514 -32.971937,-4.06514 -26.05042,0 -48.17532,7.75928 -50.71255,32.30572 -2.26196,21.94937 13.26856,32.4413 42.57429,32.4413 10.20075,0 25.240577,-1.46005 32.194007,-3.57042 l -2.43749,24.00392 z" />
`}),us=ne({meta:{src:"/_astro/medium-logo.CibtbSZb.svg",width:24,height:24,format:"svg"},attributes:{role:"img",viewBox:"0 0 24 24"},children:'<title>Medium</title><path d="M4.21 0A4.201 4.201 0 0 0 0 4.21v15.58A4.201 4.201 0 0 0 4.21 24h15.58A4.201 4.201 0 0 0 24 19.79v-1.093c-.137.013-.278.02-.422.02-2.577 0-4.027-2.146-4.09-4.832a7.592 7.592 0 0 1 .022-.708c.093-1.186.475-2.241 1.105-3.022a3.885 3.885 0 0 1 1.395-1.1c.468-.237 1.127-.367 1.664-.367h.023c.101 0 .202.004.303.01V4.211A4.201 4.201 0 0 0 19.79 0Zm.198 5.583h4.165l3.588 8.435 3.59-8.435h3.864v.146l-.019.004c-.705.16-1.063.397-1.063 1.254h-.003l.003 10.274c.06.676.424.885 1.063 1.03l.02.004v.145h-4.923v-.145l.019-.005c.639-.144.994-.353 1.054-1.03V7.267l-4.745 11.15h-.261L6.15 7.569v9.445c0 .857.358 1.094 1.063 1.253l.02.004v.147H4.405v-.147l.019-.004c.705-.16 1.065-.397 1.065-1.253V6.987c0-.857-.358-1.094-1.064-1.254l-.018-.004zm19.25 3.668c-1.086.023-1.733 1.323-1.813 3.124H24V9.298a1.378 1.378 0 0 0-.342-.047Zm-1.862 3.632c-.1 1.756.86 3.239 2.204 3.634v-3.634z" />'}),hs={};var Qe={};const fs="/cloudchat",J=typeof import.meta<"u"&&hs?"/cloudchat":typeof process<"u"&&Qe.PUBLIC_API_BASE_URL?Qe.PUBLIC_API_BASE_URL:fs,ms={CHAT:`${J}/deepseek_chat`,RESET:`${J}/reset_chat`,IMAGE_GENERATION:`${J}/generate_image`},As={"Content-Type":"application/json"},ps=Object.assign({"./assets/heroes/hero-main-hero-1000w.jpeg":yt,"./assets/heroes/hero-main-hero-1000w.webp":vt,"./assets/heroes/hero-main-hero-1280w.jpeg":Et,"./assets/heroes/hero-main-hero-1280w.webp":bt,"./assets/heroes/hero-main-hero-1920w.jpeg":At,"./assets/heroes/hero-main-hero-1920w.webp":wt,"./assets/heroes/hero-main-hero-2560w.jpeg":xt,"./assets/heroes/hero-main-hero-2560w.webp":Ct,"./assets/heroes/hero-main-hero-3840w.jpeg":kt,"./assets/heroes/hero-main-hero-3840w.webp":Tt,"./assets/heroes/hero-main-hero-400w.jpeg":Rt,"./assets/heroes/hero-main-hero-400w.webp":St,"./assets/heroes/hero-main-hero-800w.jpeg":It,"./assets/heroes/hero-main-hero-800w.webp":Bt}),gs={};for(const[t,e]of Object.entries(ps)){const n=t.split("/").pop();gs[n]=e}const ws="https://www.rendazhang.com",xs="/deepseek_chat",Cs="/certifications",ks="/docs",Ts="/login",Rs="/register",Ss={README_ZH:Ht,README_EN:jt},Is="/",Bs="AI Chat",Ns={ZH:"加载中...",EN:"Loading..."},Os="deepseek_chat_history",Ke="preferred_theme",re="preferred_lang",Ds=15e3,Ls=4,Zs=1.5,Ms={USER:"user",AI:"ai",ASSISTANT:"assistant",SYSTEM:"system"},Ps={DEFAULT:1e4,HIGHLIGHT:3e4,MERMAID:6e4},Hs={HINT:2e3,FADE:300,COPY_FEEDBACK:1e3,ERROR_HIDE_DELAY:2e3},js={DEFAULT:24,LARGE:28},Fs={LOGIN_REQUEST:1e3,LOGIN_REDIRECT:3e3,REGISTER_VALIDATE:500,REGISTER_PROGRESS_INTERVAL:500,REGISTER_PROGRESS_TOTAL:1600,REGISTER_REDIRECT:5e3,REGISTER_PROGRESS_STEP:33},Vs="register_draft",Us={MARKED:Nt,PURIFY:Ot,HIGHLIGHT:Dt,MERMAID:Lt},zs={CHAT_WIDGET:pt},Gs={WECHAT_QR:Pt,RESUME_EN:Zt,RESUME_ZH:Mt},$s={WECHAT:os,ZHIHU:cs,TOUTIAO:ds,CSDN:ls,MEDIUM:us},qs="Resume_RendaZhang_20250622.pdf",Ws="个人简历_张人大_20250622.pdf",Ys="https://formspree.io/xlepgene",Js="952402967@qq.com",Qs="13925067232",Ks="+86-13925067232",Xs={ZHIHU:"https://www.zhihu.com/people/RendaZhang",TOUTIAO:"https://www.toutiao.com/c/user/50248851377/###",CSDN:"https://blog.csdn.net/qq_40286307",MEDIUM:"https://rendazhang.medium.com"},er={JAVA_21_LOCK:"https://blog.csdn.net/qq_40286307/article/details/148540386"},tr={QUANT_TRADING_AI_BOT:"https://rendazhang.medium.com/quantitative-trading-101-building-your-ai-trading-bot-from-scratch-cb928c834fc1"},nr={CREDLY:"https://www.credly.com/badges/8a7e15fc-374b-4335-a86e-e30e5255836d/public_url",AWS:"https://aws.amazon.com/verification"},sr="https://www.credly.com",rr="8a7e15fc-374b-4335-a86e-e30e5255836d",ar={WIDTH:"150",HEIGHT:"270"},_s=`${J}/chat`,ys=30,vs={API_BASE_URL:J,ENDPOINTS:ms,LEGACY_CHAT_ENDPOINT:_s,TYPING_INTERVAL:ys};typeof window<"u"&&(window.config=vs);const lt=C.createContext();function ir({children:t,initialLang:e}){const n=C.useRef(!1),[s,r]=C.useState(e||"zh-CN");C.useEffect(()=>{if(!(typeof window>"u")){if(!n.current){n.current=!0;const i=document.documentElement.dataset.initialLang||document.documentElement.lang||e||"zh-CN";let o=null;try{o=localStorage.getItem(re)}catch{}const d=o||i;r(d),document.documentElement.lang=d;try{localStorage.setItem(re,d)}catch{}window.dispatchEvent(new CustomEvent("langChanged",{detail:d}));return}document.documentElement.lang=s;try{localStorage.setItem(re,s)}catch{}window.dispatchEvent(new CustomEvent("langChanged",{detail:s}))}},[s,e]);const a=i=>{r(i)};return j.jsx(lt.Provider,{value:{lang:s,updateLang:a},children:t})}function or(){const t=C.useContext(lt),e=()=>typeof document>"u"?"zh-CN":document.documentElement.dataset.initialLang||document.documentElement.lang||"zh-CN",[n,s]=C.useState(()=>t?.lang||e());C.useEffect(()=>{if(t){s(t.lang);return}const a=i=>s(i.detail);return window.addEventListener("langChanged",a),()=>window.removeEventListener("langChanged",a)},[t]);const r=t?.updateLang||(a=>{if(s(a),typeof document<"u"){document.documentElement.lang=a;try{localStorage.setItem(re,a)}catch{}window.dispatchEvent(new CustomEvent("langChanged",{detail:a}))}});return{lang:n,updateLang:r}}const ut={darkMode:!1,toggle:()=>{},setTheme:()=>{}},ht=C.createContext(ut),cr=()=>C.useContext(ht)||ut;function dr({children:t}){const e=C.useRef(!1),[n,s]=C.useState(()=>typeof window<"u"?document.documentElement.dataset.initialTheme==="dark":!1);C.useEffect(()=>{if(!(typeof window>"u")){if(!e.current){e.current=!0;const i=document.documentElement.classList.contains("dark-mode");let o=!1;try{o=localStorage.getItem(Ke)==="dark"}catch{}const d=i||o;s(d),document.documentElement.classList.toggle("dark-mode",d);return}document.documentElement.classList.toggle("dark-mode",n);try{localStorage.setItem(Ke,n?"dark":"light")}catch{}}},[n]);const r=()=>s(i=>!i),a=i=>s(!!i);return j.jsx(ht.Provider,{value:{darkMode:n,toggle:r,setTheme:a},children:t})}function lr({zhContent:t,enContent:e}){return j.jsxs(j.Fragment,{children:[j.jsx("span",{className:"lang-zh",children:t}),j.jsx("span",{className:"lang-en",children:e})]})}export{Fs as A,Ms as B,Qs as C,Ss as D,ms as E,Ps as F,cr as G,Is as H,Gs as I,As as J,Cs as K,lr as L,tr as M,ks as N,ir as O,Rs as R,$s as S,dr as T,Hs as U,nr as V,Js as a,Ks as b,er as c,ar as d,sr as e,rr as f,ws as g,Xs as h,Ys as i,j,Ns as k,Vs as l,Ts as m,Bs as n,xs as o,js as p,zs as q,gs as r,Ws as s,qs as t,or as u,Us as v,Ls as w,Zs as x,Ds as y,Os as z};
//# sourceMappingURL=LocalizedSection.CYpjQipL.js.map
