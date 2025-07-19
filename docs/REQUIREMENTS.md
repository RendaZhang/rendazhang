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
- **最后更新**: July 19, 2025, 04:50 (UTC+8)
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
- [ ] 主题切换（深色 / 浅色）

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
- [ ] 统一配置管理：集中放置 API 基础路径、聊天限制常量等，避免在各处硬编码路径和数字。
- [ ] 引入端到端测试，确保主要页面稳定

---

## 🌱 未来计划

- 丰富项目展示模块，支持动态加载项目数据
- 提供离线访问能力（PWA）
- 持续完善 SEO / GEO 优化
- 实施文件指纹技术
- 使用轻量级方案做一个登录注册功能
