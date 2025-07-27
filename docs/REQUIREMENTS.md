<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [项目需求清单](#%E9%A1%B9%E7%9B%AE%E9%9C%80%E6%B1%82%E6%B8%85%E5%8D%95)
  - [简介](#%E7%AE%80%E4%BB%8B)
  - [🚀 核心功能](#-%E6%A0%B8%E5%BF%83%E5%8A%9F%E8%83%BD)
  - [🔧 技术需求](#-%E6%8A%80%E6%9C%AF%E9%9C%80%E6%B1%82)
  - [🌱 未来计划](#-%E6%9C%AA%E6%9D%A5%E8%AE%A1%E5%88%92)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 项目需求清单

- **负责人**: 张人大（Renda Zhang）
- **最后更新**: July 19, 2025, 16:18 (UTC+8)
- **项目状态**: 稳定运行，持续开发中

---

## 简介

此仓库是网站的前端代码，采用 **Astro** + **React** 架构，通过 GitHub Actions 自动构建并部署到 Nginx 服务器。网站提供中英文双语界面，用于展示简历、证书及技术文档，并集成 AI 聊天功能。

---

## 🚀 核心功能

- [x] AI 聊天界面，支持 Markdown 渲染，Mermaid 图表渲染与对话历史本地存储
- [x] 主页集成 ChatWidget 浮动按钮，可随时开启 AI 聊天
- [x] 中文和英文主页，包含简历下载与技能介绍
- [x] 证书展示页，嵌入 Credly 验证链接
- [x] 联系表单，使用前端验证并提交信息
- [x] 图片懒加载与移动端适配
- [x] 背景音乐开关
- [x] 技术文档页面，动态加载 Markdown 内容
- [x] 社交媒体和内容平台链接
- [x] 主题切换（深色 / 浅色）
- [ ] 给所有页面都加上导航栏

---

## 🔧 技术需求

- [x] GitHub Actions 自动部署到服务器
- [x] pre-commit 钩子（ESLint、Prettier、Astro Check 等）
- [x] 提交前自动运行 doctoc 更新文档目录
- [x] 让 根目录下的 `README.md` 文件 自动 覆盖 `public/` 目录下的 `README.md` 文件
- [x] 已完成基础 SEO / GEO 优化配置
- [x] 封装 ChatWidget 组件：在 Chat.jsx 外层创建一个新组件 ChatWidget.jsx，内部引用 Chat；该组件提供浮标按钮以及显示/隐藏聊天面板的逻辑（控制 Chat 组件的挂载）。
- [x] 抽取共享样式与资源：Chat.jsx 依赖的 CSS 可在 ChatWidget.jsx 挂载时按需加载，或在公共布局中引用一次以便复用。
- [x] 在 index.astro 引入 ChatWidget
- [x] 导航栏上显示主页/登录/注册按钮，点击跳转到主页/登录/注册页面。
- [x] 持续优化文档：现有 `pre-commit` 钩子会同步 README 和生成目录，应保持脚本可用并在开发文档中说明使用方法。需同步更新文档内容，方便贡献者理解项目结构。
- [x] 统一配置管理：集中放置 API 基础路径、聊天限制常量等，避免在各处硬编码路径和数字。
- [x] 主题切换可将状态存入 localStorage，在 ThemeProvider 初始化时读取，保持用户偏好。
- [ ] 实施文件指纹技术：解决缓存更新问题。使用版本化或文件指纹以减少缓存问题。
- [ ] 使用 TypeScript：将现有 .jsx 文件逐步转换为 .tsx，补充类型声明和接口。在 tsconfig.json 已启用的情况下，引入类型更能在编译期发现问题。为服务层和自定义 Hooks 添加类型声明。
- [ ] 拆分大型组件：Chat.jsx 内部状态与逻辑较多，可按功能拆成更小的组件或自定义 hook（例如消息列表、输入区域、加载状态等）。避免单个文件过于庞大，提升可维护性。提供统一的服务层 API。可将输入框、消息列表、历史管理等拆分为独立组件或自定义 hooks，并提炼接口请求逻辑，便于未来接入新的 AI 服务或改变传输方式。
- [ ] 状态管理扩展：当前仅用 useState 与 useContext 管理主题，随着页面或组件增多，可引入轻量级库（如 Zustand）集中管理共享状态。这样不同页面或“岛”之间也能更容易共享数据。如有更多共享状态，可评估使用 Zustand 或 Redux。
- [ ] 异步资源加载优化：现有 loadScript 函数通过 document.createElement('script') 注入，可以改为 import() 动态导入，在打包时按需分离资源。也可配合懒加载组件，让非核心脚本在用户真正需要时再加载。
- [ ] 重新改造 about.zh.astro 页面 和 about.en.astro 页面，让它们和主页的样式一致。
- [ ] 公共页面模板与组件化：例如 about.zh.astro 页面中包含大量相似的 HTML 片段，建议拆分为复用组件（如 HeroSection, SkillsSection 等），以后新增语言版本或页面时更方便组合。
- [ ] 统一 SEO/GEO 信息配置。
- [ ] 创建 `<Head>` 或布局模板，减少重复代码。多个 .astro 页面（如 index.astro、about.zh.astro、about.en.astro 等）在 `<head>` 中重复声明大量 meta 标签和脚本。建议在 src/layouts 新建或扩展 BaseLayout，将这些公共内容集中维护，并通过自定义的 `<Head>` 组件或配置文件管理站点信息，以便后续扩展和多语言切换。
- [ ] 国际化与主题持久化：目前页面通过跳转到不同 URL 实现中英文内容，可考虑引入 i18n 解决方案统一管理文案。
- [ ] 自动化测试与持续集成：代码库已经配置了 ESLint 和 Prettier，但缺少单元测试或端到端测试。可结合 React Testing Library 做组件测试，Playwright/Chromium 做简单的页面跳转或聊天流程验证。引入端到端测试框架，覆盖主要页面。若需要，也可补充单元测试（如 vitest/react-testing-library）。

---

## 🌱 未来计划

- 丰富项目展示模块，支持动态加载项目数据
- 提供离线访问能力（PWA）
- 持续完善 SEO / GEO 优化
- 实施文件指纹技术
- 使用轻量级方案做一个登录注册功能
