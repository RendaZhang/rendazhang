<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [项目需求清单](#%E9%A1%B9%E7%9B%AE%E9%9C%80%E6%B1%82%E6%B8%85%E5%8D%95)
  - [简介](#%E7%AE%80%E4%BB%8B)
  - [🚀 核心功能](#-%E6%A0%B8%E5%BF%83%E5%8A%9F%E8%83%BD)
  - [🔧 技术需求](#-%E6%8A%80%E6%9C%AF%E9%9C%80%E6%B1%82)
    - [已完成需求 ✅](#%E5%B7%B2%E5%AE%8C%E6%88%90%E9%9C%80%E6%B1%82-)
    - [待完成需求 ⏳](#%E5%BE%85%E5%AE%8C%E6%88%90%E9%9C%80%E6%B1%82-)
    - [关键改进说明 🔍](#%E5%85%B3%E9%94%AE%E6%94%B9%E8%BF%9B%E8%AF%B4%E6%98%8E-)
  - [🌱 未来计划](#-%E6%9C%AA%E6%9D%A5%E8%AE%A1%E5%88%92)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 项目需求清单

- **负责人**: 张人大（Renda Zhang）
- **最后更新**: July 29, 2025, 16:18 (UTC+8)
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
- [x] 给所有页面都加上导航栏
- [x] 主题切换（深色 / 浅色）
- [X] 启用全局中英文多语言支持

---

## 🔧 技术需求

### 已完成需求 ✅

- [x] **自动化部署**
  通过 GitHub Actions 实现代码自动部署到生产服务器
- [x] **代码质量保障**
  配置 pre-commit 钩子（ESLint、Prettier、Astro Check）
- [x] **文档自动化**
  提交前自动运行 doctoc 更新文档目录结构
- [x] **README 同步**
  自动将根目录 `README.md` 同步到 `public/` 目录
- [x] **SEO/GEO 基础优化**
  已完成基础搜索引擎和地理定位优化配置
- [x] **聊天组件封装**
  创建 ChatWidget 组件（浮标按钮 + 面板显示逻辑）
- [x] **资源加载优化**
  按需加载 Chat 组件 CSS 资源
- [x] **主页集成聊天**
  在 index.astro 引入 ChatWidget 组件
- [x] **导航基础功能**
  导航栏包含主页/登录/注册跳转功能
- [x] **文档持续优化**
  完善 pre-commit 文档同步流程和使用说明
- [x] **配置中心化**
  集中管理 API 路径、常量等配置项
- [x] **主题持久化**
  主题偏好存入 localStorage 保持用户设置
- [x] **国际化架构实现**
  完成多语言支持框架（双内容渲染 + CSS 切换）

### 待完成需求 ⏳

- [ ] **所有页面国际化**
  实现所有页面的多语言动态切换
- [ ] **文档页面国际化**
  实现 docs.astro 多语言支持（双 Markdown 渲染）
- [ ] **导航栏重构**
  实现从左到右布局：汉堡菜单 → 首页图标 → 主题/语言切换 → 头像图标
- [ ] **主页替换**
  将 About 页面设为主页并移除现有主页
- [ ] **聊天组件全局化**
  除 deepseek_chat 外，在所有页面展示 ChatWidget
- [ ] **缓存优化方案**
  实施文件指纹技术解决缓存更新问题
- [ ] **TypeScript 迁移**
  逐步将 .jsx 转为 .tsx 并添加类型声明
- [ ] **组件拆分优化**
  将 Chat.jsx 拆分为：消息列表、输入区、加载状态等独立组件
- [ ] **状态管理升级**
  引入 Zustand 管理跨组件共享状态
- [ ] **异步加载优化**
  将脚本注入改为 import() 动态导入
- [ ] **页面风格统一**
  重新设计 about.astro 与主页风格一致
- [ ] **组件化重构**
  创建复用组件（HeroSection, SkillsSection 等）
- [ ] **SEO/GEO 统一配置**
  集中管理所有页面的搜索引擎优化设置
- [ ] **Head 组件封装**
  创建复用 `<Head>` 组件管理公共 meta 标签
- [ ] **测试体系建设**
  引入 React Testing Library + Playwright 测试框架
- [ ] **i18n 方案升级**
  评估引入专业 i18n 库管理多语言内容

### 关键改进说明 🔍

- **国际化实现细节**：
   - 采用双内容同步渲染技术
   - 通过 `html[lang]` 属性控制内容显隐
   - CSS 规则：
      ```css
      html[lang^='en'] .lang-zh {
        display: none;
      }
      html[lang^='zh'] .lang-en {
        display: none;
      }
      ```

- **文档页面特殊处理**：
   - 同时渲染 `README.md` 和 `README.EN.md`
   - 保持章节结构完全一致
   - 图片本地化方案：
     ```html
     <img src="diagram_zh.png" class="img-zh">
     <img src="diagram_en.png" class="img-en">
     ```

- **状态管理规划**：
   ```mermaid
   graph TD
     A[组件状态] --> B(useState)
     C[跨组件状态] --> D(useContext)
     E[应用级状态] --> F(Zustand)
   ```

- **TypeScript 迁移策略**：
   ```mermaid
   timeline
     阶段1 ： 新增组件使用 TSX
     阶段2 ： 核心组件迁移
     阶段3 ： 工具函数添加类型
     阶段4 ： 全量类型检查
   ```
---

## 🌱 未来计划

- 丰富项目展示模块，支持动态加载项目数据
- 提供离线访问能力（PWA）
- 持续完善 SEO / GEO 优化
- 实施文件指纹技术
- 使用轻量级方案做一个登录注册功能
