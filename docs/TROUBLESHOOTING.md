<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [前端 BUG 跟踪数据库](#%E5%89%8D%E7%AB%AF-bug-%E8%B7%9F%E8%B8%AA%E6%95%B0%E6%8D%AE%E5%BA%93)
  - [文档说明](#%E6%96%87%E6%A1%A3%E8%AF%B4%E6%98%8E)
    - [BUG 记录模板](#bug-%E8%AE%B0%E5%BD%95%E6%A8%A1%E6%9D%BF)
  - [BUG 详情](#bug-%E8%AF%A6%E6%83%85)
    - [BUG-001: Mermaid 图表渲染异常](#bug-001-mermaid-%E5%9B%BE%E8%A1%A8%E6%B8%B2%E6%9F%93%E5%BC%82%E5%B8%B8)
    - [BUG-002: highlight.js 与 Mermaid 冲突](#bug-002-highlightjs-%E4%B8%8E-mermaid-%E5%86%B2%E7%AA%81)
    - [BUG-003: `CONTACT_FORM_ENDPOINT` 未定义](#bug-003-contact_form_endpoint-%E6%9C%AA%E5%AE%9A%E4%B9%89)
    - [BUG-004: jQuery.validator 加载顺序错误](#bug-004-jqueryvalidator-%E5%8A%A0%E8%BD%BD%E9%A1%BA%E5%BA%8F%E9%94%99%E8%AF%AF)
    - [BUG-005: jQuery.easing 插件缺失](#bug-005-jqueryeasing-%E6%8F%92%E4%BB%B6%E7%BC%BA%E5%A4%B1)
    - [BUG-006: BaseLayout 中文乱码](#bug-006-baselayout-%E4%B8%AD%E6%96%87%E4%B9%B1%E7%A0%81)
    - [BUG-007: ThemeToggle context undefined](#bug-007-themetoggle-context-undefined)
    - [BUG-008: Dark mode hydration error](#bug-008-dark-mode-hydration-error)
    - [BUG-009: Certifications card overflow on small screens](#bug-009-certifications-card-overflow-on-small-screens)
    - [BUG-010: Certifications page overlaps nav on short screens](#bug-010-certifications-page-overlaps-nav-on-short-screens)
    - [BUG-011: Verify buttons not responsive on small screens](#bug-011-verify-buttons-not-responsive-on-small-screens)
    - [BUG-012: Dark mode flashes before applying](#bug-012-dark-mode-flashes-before-applying)
    - [BUG-013: Hydration mismatch when dark mode is enabled](#bug-013-hydration-mismatch-when-dark-mode-is-enabled)
    - [BUG-014: Chat widget panel flashes in dark mode](#bug-014-chat-widget-panel-flashes-in-dark-mode)
    - [BUG-015: Enhancement progress stuck when scripts load from memory cache](#bug-015-enhancement-progress-stuck-when-scripts-load-from-memory-cache)
    - [BUG-016: document is not defined during build](#bug-016-document-is-not-defined-during-build)
    - [BUG-017: NavBar hydration mismatch when language differs](#bug-017-navbar-hydration-mismatch-when-language-differs)
    - [BUG-018: About page hydration mismatch and flicker](#bug-018-about-page-hydration-mismatch-and-flicker)
    - [BUG-019: Contact form placeholders flicker on first render](#bug-019-contact-form-placeholders-flicker-on-first-render)
    - [BUG-020: `THEME_STORAGE_KEY` 读取为 null](#bug-020-theme_storage_key-%E8%AF%BB%E5%8F%96%E4%B8%BA-null)
    - [BUG-021: Chat input placeholder flickers when switching languages](#bug-021-chat-input-placeholder-flickers-when-switching-languages)
    - [BUG-022: Docs page Mermaid errors when hidden diagrams render](#bug-022-docs-page-mermaid-errors-when-hidden-diagrams-render)
    - [BUG-023: Invalid image src value in SocialIcon](#bug-023-invalid-image-src-value-in-socialicon)
    - [BUG-024: Homepage QR code fails to load](#bug-024-homepage-qr-code-fails-to-load)
    - [BUG-025: Scripts run before React hydration](#bug-025-scripts-run-before-react-hydration)
    - [BUG-026: Docs page fails to render README](#bug-026-docs-page-fails-to-render-readme)
    - [BUG-027: Page title does not switch languages](#bug-027-page-title-does-not-switch-languages)
    - [BUG-028: Markdown styles inconsistent between pages](#bug-028-markdown-styles-inconsistent-between-pages)
    - [BUG-029: DOMPurify source map warning during dev](#bug-029-dompurify-source-map-warning-during-dev)
    - [BUG-030: highlight.js 缺少 nginx 语言模块](#bug-030-highlightjs-%E7%BC%BA%E5%B0%91-nginx-%E8%AF%AD%E8%A8%80%E6%A8%A1%E5%9D%97)
    - [BUG-031: 浏览器控件未随主题切换](#bug-031-%E6%B5%8F%E8%A7%88%E5%99%A8%E6%8E%A7%E4%BB%B6%E6%9C%AA%E9%9A%8F%E4%B8%BB%E9%A2%98%E5%88%87%E6%8D%A2)
    - [BUG-032: Hero 模糊占位图不会消失](#bug-032-hero-%E6%A8%A1%E7%B3%8A%E5%8D%A0%E4%BD%8D%E5%9B%BE%E4%B8%8D%E4%BC%9A%E6%B6%88%E5%A4%B1)
    - [BUG-033: Build fails with "Could not import ../../hooks"](#bug-033-build-fails-with-could-not-import-hooks)
    - [BUG-034: CDN 缓存清理失败](#bug-034-cdn-%E7%BC%93%E5%AD%98%E6%B8%85%E7%90%86%E5%A4%B1%E8%B4%A5)
    - [BUG-035: 客户端环境变量未注入](#bug-035-%E5%AE%A2%E6%88%B7%E7%AB%AF%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F%E6%9C%AA%E6%B3%A8%E5%85%A5)
    - [BUG-036: 版本标签创建冲突](#bug-036-%E7%89%88%E6%9C%AC%E6%A0%87%E7%AD%BE%E5%88%9B%E5%BB%BA%E5%86%B2%E7%AA%81)
    - [BUG-037: Sentry source map 上传失败](#bug-037-sentry-source-map-%E4%B8%8A%E4%BC%A0%E5%A4%B1%E8%B4%A5)
    - [BUG-038: 开发环境错误上报污染](#bug-038-%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E9%94%99%E8%AF%AF%E4%B8%8A%E6%8A%A5%E6%B1%A1%E6%9F%93)
    - [BUG-039: 敏感数据泄露风险](#bug-039-%E6%95%8F%E6%84%9F%E6%95%B0%E6%8D%AE%E6%B3%84%E9%9C%B2%E9%A3%8E%E9%99%A9)
    - [BUG-040: Source map 版本不匹配](#bug-040-source-map-%E7%89%88%E6%9C%AC%E4%B8%8D%E5%8C%B9%E9%85%8D)
    - [BUG-041: Sentry CORS 403 on localhost](#bug-041-sentry-cors-403-on-localhost)
    - [BUG-042: GitHub Actions 环境变量未绑定导致 tag undefined](#bug-042-github-actions-%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F%E6%9C%AA%E7%BB%91%E5%AE%9A%E5%AF%BC%E8%87%B4-tag-undefined)
    - [BUG-043: LocalStorage 新旧格式兼容性问题](#bug-043-localstorage-%E6%96%B0%E6%97%A7%E6%A0%BC%E5%BC%8F%E5%85%BC%E5%AE%B9%E6%80%A7%E9%97%AE%E9%A2%98)
    - [BUG-044: 主题初始化脚本执行延迟导致闪烁](#bug-044-%E4%B8%BB%E9%A2%98%E5%88%9D%E5%A7%8B%E5%8C%96%E8%84%9A%E6%9C%AC%E6%89%A7%E8%A1%8C%E5%BB%B6%E8%BF%9F%E5%AF%BC%E8%87%B4%E9%97%AA%E7%83%81)
    - [BUG-045: 存储工具全局注册执行冲突](#bug-045-%E5%AD%98%E5%82%A8%E5%B7%A5%E5%85%B7%E5%85%A8%E5%B1%80%E6%B3%A8%E5%86%8C%E6%89%A7%E8%A1%8C%E5%86%B2%E7%AA%81)
    - [BUG-046: 输入时 Mermaid 图表频繁重渲染](#bug-046-%E8%BE%93%E5%85%A5%E6%97%B6-mermaid-%E5%9B%BE%E8%A1%A8%E9%A2%91%E7%B9%81%E9%87%8D%E6%B8%B2%E6%9F%93)
    - [BUG-047: 构建后 env.ts 无法读取环境变量](#bug-047-%E6%9E%84%E5%BB%BA%E5%90%8E-envts-%E6%97%A0%E6%B3%95%E8%AF%BB%E5%8F%96%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F)
    - [BUG-048: 404/500 页面主题和语言初始化失败](#bug-048-404500-%E9%A1%B5%E9%9D%A2%E4%B8%BB%E9%A2%98%E5%92%8C%E8%AF%AD%E8%A8%80%E5%88%9D%E5%A7%8B%E5%8C%96%E5%A4%B1%E8%B4%A5)
    - [BUG-049: Vite 报错 `@import must precede all other statements`](#bug-049-vite-%E6%8A%A5%E9%94%99-import-must-precede-all-other-statements)
    - [BUG-050: Auth form containers use fixed top margin](#bug-050-auth-form-containers-use-fixed-top-margin)
    - [BUG-051: Certification page styles bound to body element](#bug-051-certification-page-styles-bound-to-body-element)
    - [BUG-052: Docs 页面标题 ID 重复导致 GitHub Actions 锚点失效](#bug-052-docs-%E9%A1%B5%E9%9D%A2%E6%A0%87%E9%A2%98-id-%E9%87%8D%E5%A4%8D%E5%AF%BC%E8%87%B4-github-actions-%E9%94%9A%E7%82%B9%E5%A4%B1%E6%95%88)
    - [BUG-053: 导航栏遮挡主体内容](#bug-053-%E5%AF%BC%E8%88%AA%E6%A0%8F%E9%81%AE%E6%8C%A1%E4%B8%BB%E4%BD%93%E5%86%85%E5%AE%B9)
    - [BUG-054: Chat Widget 打开时 Mermaid 与代码高亮渲染闪烁](#bug-054-chat-widget-%E6%89%93%E5%BC%80%E6%97%B6-mermaid-%E4%B8%8E%E4%BB%A3%E7%A0%81%E9%AB%98%E4%BA%AE%E6%B8%B2%E6%9F%93%E9%97%AA%E7%83%81)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 前端 BUG 跟踪数据库

- **作者**: 张人大 (Renda Zhang)
- **最后更新**: August 11, 2025, 03:02 (UTC+08:00)

---

## 文档说明

1. **目的**：建立可追溯的 BUG 知识库，避免重复问题
2. **更新流程**：
   - 新 BUG 发现后 24 小时内记录
   - 解决后更新状态和解决方案
3. **严重等级**：
   - ⚠️ 紧急（阻塞核心功能）
   - ⚠️ 高（影响用户体验）
   - ⚠️ 中（非核心功能问题）
   - ⚠️ 低（视觉/文案问题）

### BUG 记录模板

统一的记录格式便于后续检索和统计，可以参考如下的模版：
```markdown
### BUG-<编号>: <标题>

- **问题状态**：新建 (New) | 已确认 (Confirmed) | 进行中 (In Progress) | 已解决 (Resolved) | 已验证 (Verified) | 重新打开 (Reopened) | 已关闭 (Closed) | 已拒绝 (Rejected) | 已延期 (Deferred) | 已阻塞 (Blocked) | 已取消 (Cancelled)
- **发现日期**：YYYY-MM-DD
- **重现环境**：浏览器版本、系统环境
- **问题现象**：
  - 描述 1
  - 描述 2
- **根本原因**：
  - 原因 1
- **解决方案**：
  - 步骤 1
- **验证结果**：✅/❌
- **经验总结**：可选的额外说明
```

---

## BUG 详情

状态跟踪通过在「问题状态」中的勾选框体现：`[ ]` 表示未解决，`[x]` 表示已修复。

### BUG-001: Mermaid 图表渲染异常

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-17
- **重现环境**：Chrome 115+, macOS Ventura
- **问题现象**：
  - Mermaid 图表成功渲染后 1 秒内被还原为原始代码
  - 仅影响图表渲染，代码高亮功能正常
- **根本原因**：
  - React 重渲染覆盖了 Mermaid 生成的 SVG DOM
  - 状态更新导致组件重新渲染原始 Markdown
- **解决方案**：
  - 使用 ref 直接管理图表容器 DOM
  - 将 Mermaid 渲染移出 React 生命周期控制
  - 添加渲染状态持久化机制
- **相关代码**：
  ```tsx
  // AIMessage 组件修改
  const contentRef = useRef(null);
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = html;
      // Mermaid 渲染逻辑...
    }
  }, [html]);
  ```
- **验证结果**：✅ 所有图表渲染稳定
- **经验总结**：第三方 DOM 操作库需要与 React 渲染机制解耦

### BUG-002: highlight.js 与 Mermaid 冲突

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-18
- **重现环境**：Chrome 138.0.7204.101, Windows 11
- **问题现象**：
  - 控制台出现 `WARN: Could not find the language 'mermaid'` 提示
- **根本原因**：
  - highlight.js 尝试解析 `language-mermaid` 代码块，但未加载对应语言模块
- **解决方案**：
  - 在高亮逻辑中忽略 `.language-mermaid` 区块
- **验证结果**：✅ WARN 消失，Mermaid 渲染正常
- **相关代码**：
  ```tsx
  document.querySelectorAll('pre code:not(.language-mermaid)').forEach(block => {
    hljs.highlightElement(block);
  });
  ```

### BUG-003: `CONTACT_FORM_ENDPOINT` 未定义

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-18
- **重现环境**：Chrome 最新版，macOS Ventura
- **问题现象**：
  - 打开 About 页面后，控制台报 `CONTACT_FORM_ENDPOINT is not defined`
- **根本原因**：
  - 在页面脚本中直接使用常量名，未在浏览器端声明
- **解决方案**：
  - 使用 `define:vars` 在脚本中注入常量
  - 示例：
    ```astro
    <script define:vars={{ CONTACT_FORM_ENDPOINT }}>
      window.CONTACT_FORM_ENDPOINT = CONTACT_FORM_ENDPOINT;
    </script>
    ```
- **验证结果**：✅ 页面不再抛出错误，表单正常提交

### BUG-004: jQuery.validator 加载顺序错误

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-25
- **重现环境**：Chrome 最新版，开发服务器
  - **问题现象**：
    - 打开 About 页面时控制台报 `$(...).validator is not a function`
  - **根本原因**：
    - 在 about 页面中先加载 `contact.js`，再加载 `validator.min.js`
  - jQuery 插件未在脚本执行前初始化
- **解决方案**：
  - 调整脚本顺序，先引入 `validator.min.js` 后引入 `contact.js`
- **验证结果**：✅ 控制台不再报错，表单校验正常

### BUG-005: jQuery.easing 插件缺失

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-25
- **重现环境**：Chrome 最新版，开发服务器
  - **问题现象**：
    - About 页面报 `E.easing[this.easing] is not a function`
  - **根本原因**：
    - 页面未加载 `jquery.easing.min.js`，但 `switcher.min.js` 依赖该插件
  - **解决方案**：
    - 在 about 页面中引入 `SCRIPT_PATHS.JQUERY_EASING`，置于 jQuery 之后
- **验证结果**：✅ 控制台不再报错，动画正常

### BUG-006: BaseLayout 中文乱码

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-26
- **重现环境**：Chrome 最新版，开发服务器
- **问题现象**：
  - 登录页面引入 BaseLayout 后中文字符变成乱码
- **根本原因**：
  - `<html>` 标签被包装在 `<ThemeProvider>` 内，Astro 构建时丢失 `lang` 与 `charset`
- **解决方案**：
  - 将 `<ThemeProvider>` 移至 `<body>` 中，保持 `<html lang>` 为顶级元素
- **验证结果**：✅ 页面可正常显示中文

### BUG-007: ThemeToggle context undefined

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-26
- **重现环境**：Chrome 最新版，开发服务器
- **问题现象**：
  - 打开 login 或 register 页面时报 `Cannot destructure property 'darkMode'` 错误
  - ThemeToggle 组件无法获取主题上下文
- **根本原因**：
  - 组件未包裹在 ThemeProvider 中时，`useTheme()` 返回 `undefined`
- **解决方案**：
  - 为 `createContext` 提供默认值并在 useTheme 中兜底
  - 修改 `ThemeContext` 默认值结构防止解构报错
- **验证结果**：✅ 未包裹 Provider 时按钮失效但不崩溃
- **相关代码**：
  ```tsx
  // 修改前
  const defaultContext = undefined;

  // 修改后
  const defaultContext = {
    darkMode: false,
    toggle: () => {}
  };
  ```

### BUG-008: Dark mode hydration error

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-27
- **重现环境**：Chrome 最新版，登录/注册页面
- **问题现象**：
  - 暗色模式刷新后报 `Minified React error #418`
  - 控制台显示 hydration 不匹配警告
- **根本原因**：
  - 服务端始终渲染亮色主题，客户端通过 `storage` 工具读取初始主题
  - SSR 与客户端初始状态不一致
- **解决方案**：
  - 初始状态固定为 false
  - useEffect 中通过 `storage` 读取并更新状态
- **验证结果**：✅ 刷新不再报错，主题切换正常
- **经验总结**：SSR 应用必须保证初始渲染一致性

### BUG-009: Certifications card overflow on small screens

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-27
- **重现环境**：Chrome 开发工具，375px 宽度
- **问题现象**：
  - 当屏幕宽度小于 400px 时，证书卡片最小宽度 320px，导致父容器右侧出现空白
- **根本原因**：
  - `.cert-grid` 的 `grid-template-columns` 使用 `minmax(320px, 1fr)`，无法在更窄屏幕收缩
- **解决方案**：
  - 调整为 `repeat(auto-fit, minmax(min(320px, 100%), 1fr))`，保证卡片在窄屏下不会超出容器
- **验证结果**：✅ 页面在 375px 及以下宽度无溢出

### BUG-010: Certifications page overlaps nav on short screens

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-27
- **重现环境**：Chrome 115+, 浏览器高度 600px
- **问题现象**：
  - 证书页顶部内容被固定导航遮挡
- **根本原因**：
  - `index.css` 全局设置 `body` 为 `display:flex; height:100vh;`
    且取消了顶部间距，导致非首页也沿用该布局
- **解决方案**：
  - 为证书页添加 `<div class="cert-page">` 包裹并在 `certifications.css`
    中恢复 `padding-top` 和常规布局
- **改进**：已将 `certifications.css` 中基于视口的 `@media` 改为容器查询；
  `.cert-page` 现设置 `container-type: inline-size` 并使用 `@container`
  控制 `padding-top`，使页面可在侧栏或弹窗内复用。
- **验证结果**：✅ 调整后在 600px 高度下页面不再与导航重叠

### BUG-011: Verify buttons not responsive on small screens

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-27
- **重现环境**：Chrome 开发工具，380px 宽度
- **问题现象**：
  - 两个验证按钮在窄屏下无法并排显示
- **根本原因**：
  - `.c-verify-btn` 仅使用 margin-right，缺乏弹性布局导致按钮宽度固定
- **解决方案**：
  - 将按钮容器设为 flex 布局并给予按钮 `flex:1`，同时统一 margin
  - 样式已移至 `theme.css`，便于在其他页面复用
- **验证结果**：✅ 在 380px 宽度下按钮可均匀收缩，无溢出

### BUG-012: Dark mode flashes before applying

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-27
- **重现环境**：所有页面启用深色主题后刷新
- **问题现象**：
  - 页面加载时先显示亮色主题，短暂闪烁后切换暗色
  - 用户体验不连贯
- **根本原因**：
  - 主题脚本在 React Hydration 后执行
  - 初始渲染无主题类，依赖客户端 JS 添加
- **解决方案**：
  - 在 `<head>` 注入行内脚本提前设置主题
  - 使用 `useLayoutEffect` 确保渲染前同步状态
- **验证结果**：✅ 完全消除主题切换闪烁
- **关键脚本**：
  ```html
  <script is:inline type="module">
    import storage from '/src/utils/storage';
    try {
      const stored = storage.get('${THEME_STORAGE_KEY}');
      if (stored === 'dark') document.documentElement.classList.add('is-dark-mode');
    } catch {}
  </script>
  ```

### BUG-013: Hydration mismatch when dark mode is enabled

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-27
- **重现环境**：暗色模式下刷新任意页面
- **问题现象**：
  - 控制台报 `Hydration failed` 错误
  - 页面在亮/暗色间闪烁
- **根本原因**：
  - ThemeContext 依赖 DOM 状态初始化
  - 服务端无 DOM 访问能力，始终返回 false
- **解决方案**：
  1. 服务端/客户端统一初始值（false）
  2. 使用 `useLayoutEffect` 读取 DOM/LocalStorage
  3. 添加 mounted ref 跳过首次副作用
- **验证结果**：✅ 无闪烁无水合错误
- **核心逻辑**：
  ```tsx
  const [darkMode, setDarkMode] = useState(false); // SSR统一值
  const mounted = useRef(false);

  useLayoutEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      const isDark = document.documentElement.classList.contains('is-dark-mode');
      setDarkMode(isDark);
    }
  }, []);
  ```

### BUG-014: Chat widget panel flashes in dark mode

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-27
- **重现环境**：深色主题下的首页
- **问题现象**：
  - 点击右下角聊天按钮时，弹出面板先显示白色再变黑色
- **根本原因**：
  - `chat_widget.css` 默认背景为白色，未针对 `.is-dark-mode` 提供样式
- **解决方案**：
  - 在样式表中添加 `.is-dark-mode .chat-widget-panel { background:#1e1e1e; }`
- **验证结果**：✅ 弹窗不再闪烁

### BUG-015: Enhancement progress stuck when scripts load from memory cache

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-28
- **重现环境**：Chrome 最新版，重复打开聊天页面
- **问题现象**：
  - highlight.min.js 和 mermaid.min.js 从 memory cache 加载时，“正在优化阅读体验...” 提示不会消失
- **根本原因**：
  - 脚本瞬间完成加载，Promise 回调早于进度元素渲染执行，导致 `enhancementProgressRef.current` 为 `null`，后续样式修改抛错
- **解决方案**：
  - 在修改进度元素样式前检查 `enhancementProgressRef.current` 是否存在
- **验证结果**：✅ 提示正常淡出
- **经验总结**：在状态驱动的 UI 中操作 DOM 前应做好空值判断

### BUG-016: document is not defined during build

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-28
- **重现环境**：Astro `astro build`
- **问题现象**：
  - 构建日志报 `document is not defined`
  - 终止于 `/about/index.html`
- **根本原因**：
  - `ContactSection.tsx` 在服务端渲染阶段调用 `document` 和 `window`
- **解决方案**：
  - 检查 `document` 和 `window` 是否存在后再访问
  - 服务器端返回空内容，客户端加载后再根据语言注入数据
- **验证结果**：✅ 构建成功，无报错

### BUG-017: NavBar hydration mismatch when language differs

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-28
- **重现环境**：Chrome 最新版，切换语言后刷新页面
- **问题现象**：
  - 控制台报 "Hydration failed" 警告
  - 页面初始显示中文导航文字后迅速切换为英文，产生闪烁
- **根本原因**：
  - `NavBar` 组件在服务端调用 `getCurrentLang()`，默认返回中文
  - 客户端根据 `<html lang>` 或 `storage` 工具得到英文，导致首屏内容不一致
- **解决方案**：
  1. 将页面 `lang` 属性通过 props 传递给 `NavBar` 和 `ThemeToggle`
  2. 初始化语言脚本优先读取页面 lang 属性
  3. 导航栏和主题切换同时渲染中英文文本，通过 CSS 根据 `html[lang]` 隐藏未选语言
- **验证结果**：✅ 中英文模式下刷新页面均无闪烁，也无 Hydration 报错
- **经验总结**：SSR 组件需共享同一语言来源并同时渲染多语言文本，以避免渲染不一致

### BUG-018: About page hydration mismatch and flicker

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-28
- **重现环境**：Chrome 最新版，切换语言后刷新 About 页面
- **问题现象**：
  - 首次加载时先显示中文内容后切换为英文，页面发生闪烁
  - 控制台报 `Hydration failed` 错误
- **根本原因**：
  - 服务端无法访问浏览器存储，默认返回中文
  - AboutContent 仅渲染当前语言文本，服务端与客户端标记不一致
- **解决方案**：
  1. About 页面同时渲染中英文内容，CSS 根据 `html[lang]` 隐藏未选语言
  2. `data-initial-lang` 保持与服务器输出一致，避免 React 水合差异
- **验证结果**：✅ 切换和刷新 About 页面均无闪烁，也无 Hydration 报错
- **经验总结**：多语言页面在 SSR 场景下应让服务端获得初始语言，并同时输出所有语言版本以保持 DOM 一致

### BUG-019: Contact form placeholders flicker on first render

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-29
- **重现环境**：About 页面，切换语言后刷新
- **问题现象**：
  - ContactForm 按钮和占位符先显示默认语言后切换，出现闪烁
- **根本原因**：
  - 服务端仅渲染当前语言文本，客户端初始化后替换为用户语言导致水合差异
  - 占位符在语言未确定前已渲染
- **解决方案**：
  1. ContactSection 同时传递中英文表单文本并双语渲染按钮与提示
  2. 占位符在检测到语言后再设置
- **验证结果**：✅ 刷新页面无闪烁，表单文本一致
- **经验总结**：SSR 多语言表单应输出所有语言，延迟注入占位符以避免闪烁

### BUG-020: `THEME_STORAGE_KEY` 读取为 null

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-29
- **重现环境**：Chrome 最新版
- **问题现象**：
  - 在 BaseLayout 主题初始化脚本中使用 `storage.get('${THEME_STORAGE_KEY}')` 时返回 null
- **根本原因**：
  - 该字符串在构建阶段被 Astro 当作模板字符串处理，无法在脚本运行时得到常量值
- **解决方案**：
  - 通过 `define:vars={{ themeKey: THEME_STORAGE_KEY }}` 将常量值注入行内脚本
  - 使用 `storage.get(themeKey)` 读取存储值
- **验证结果**：✅ 控制台能够正确获取主题值

### BUG-021: Chat input placeholder flickers when switching languages

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-29
- **重现环境**：DeepSeek Chat 页面，切换语言后刷新
- **问题现象**：
  - 聊天输入框占位文本先显示上一次语言的内容再切换
- **根本原因**：
  - `Chat` 组件在渲染时直接根据 `langKey` 设置 placeholder，语言尚未确定时会渲染默认值
- **解决方案**：
  - 新增 `placeholder` 状态，待语言和加载状态确定后再更新
- **验证结果**：✅ 切换语言时占位符不再闪烁

### BUG-022: Docs page Mermaid errors when hidden diagrams render

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-30
- **重现环境**：Docs 页面，默认语言与另一语种同时渲染
- **问题现象**：
  - 控制台报 `translate(undefined, NaN)` 和 `Could not find a suitable point for the given distance`
  - Mermaid 图表未显示
- **根本原因**：
  - 初始化 Mermaid 时同时处理被 `display:none` 的隐藏语言容器，元素尺寸为 0 导致布局计算失败
- **解决方案**：
  - 根据 `document.documentElement.lang` 仅选择可见语言容器内的 `.language-mermaid` 代码块渲染
- **验证结果**：✅ 页面加载不再报错，图表正确呈现

### BUG-023: Invalid image src value in SocialIcon

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-30
- **重现环境**：Index 页面，React 控制台
- **问题现象**：
  - 控制台报 `Invalid value for prop \`src\` on <img> tag`
- **根本原因**：
  - `SocialIcon` 直接将 Vite 资源对象传给 `src`，并非字符串 URL
- **解决方案**：
  - 使用 `src.src`、`src.width`、`src.height` 赋值给 `<img>`
- **验证结果**：✅ 控制台无报错

### BUG-024: Homepage QR code fails to load

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-30
- **重现环境**：Index 页面，Chrome 开发者工具
- **问题现象**：
  - 控制台报 `[object Object]:1 GET http://localhost:4321/[object%20Object] 404`
- **根本原因**：
  - WeChat QR 图片通过 Vite 资源对象传递，`data-src` 变成 `[object Object]`
- **解决方案**：
  - 使用 `?url` 导入 `qrcode-wechat-medium-square-258x258.jpg`，确保得到字符串 URL
- **验证结果**：✅ 图片成功加载

### BUG-025: Scripts run before React hydration

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-30
- **重现环境**：Home 与 Docs 页面
- **问题现象**：
  - 点击或悬停微信图标无反应
  - 文档页面始终显示加载文本
- **根本原因**：
  - 页脚脚本在 DOMContentLoaded 触发时执行，而 React 组件尚未完成挂载
- **解决方案**：
  - 改用 `window.addEventListener('load', ...)` 确保脚本在组件挂载后运行
  - **验证结果**：✅ 模态框与文档内容均正常显示

### BUG-026: Docs page fails to render README

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-30
- **重现环境**：Docs 页面，生产环境
- **问题现象**：
  - 页面只显示 "Loading..."，控制台无明显报错
- **根本原因**：
  - jQuery 异步加载导致请求被阻塞，README 内容未能返回
- **解决方案**：
  - 移除对 jQuery 的依赖，在构建阶段通过 `import` 静态加载 README
    内容
- **验证结果**：✅ 页面渲染正常，文档内容显示完整

### BUG-027: Page title does not switch languages

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-30
- **重现环境**：Home 和 DeepSeek Chat 页面，切换语言后观察标题
- **问题现象**：
  - 切换语言后浏览器标签标题仍保持初始语言
- **根本原因**：
  - BaseLayout 仅接收单一 `title`，未监听语言变更
- **解决方案**：
  1. 新增 `titleZh`、`titleEn` 可选属性并在初始语言下渲染对应标题
  2. 行内脚本定义 `setTitle` 函数，根据 `document.documentElement.lang` 更新 `document.title`
  3. 监听 `langChanged` 事件在语言切换时更新标题
  4. 页面传入 `titleZh`、`titleEn`，未提供则回退到单一 `title`
- **验证结果**：✅ 切换语言后标题即时切换

### BUG-028: Markdown styles inconsistent between pages

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-30
- **重现环境**：Docs 页面与 DeepSeek Chat 页面
- **问题现象**：
  - Chat 页面代码块无语法着色
  - Docs 页面排版不具备 GitHub 风格
- **根本原因**：
  - Chat 页面仅引入 `github-markdown-light.css`
  - Docs 页面仅引入 `github.css`
- **解决方案**：
  - 两个页面同时加载 `github.css` 与 `github-markdown-light.css`
- **验证结果**：✅ 两页面的代码高亮与排版均保持一致

### BUG-029: DOMPurify source map warning during dev

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-30
- **重现环境**：`vite dev` 过程中加载 `src/scripts/purify.min.js`
- **问题现象**：
  - 终端与浏览器控制台提示 `Failed to load source map for purify.min.js`
  - 日志显示 `ENOENT: no such file or directory, open 'purify.min.js.map'`
- **根本原因**：
  - `purify.min.js` 末尾包含 `//# sourceMappingURL=purify.min.js.map`
  - 仓库未提供对应的 `.map` 文件，Vite 在调试阶段尝试读取失败
- **解决方案**：
  - 警告不影响运行，可忽略
  - 若需消除警告，可从 DOMPurify 发布包下载 `purify.min.js.map` 并放入 `src/scripts/`
  - 或移除 `purify.min.js` 中的 `sourceMappingURL` 注释
- **验证结果**：✅ 添加 `.map` 后警告消失

### BUG-030: highlight.js 缺少 nginx 语言模块

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-31
- **重现环境**：Chat 页面加载 nginx 配置代码块
- **问题现象**：
  - 控制台出现 `WARN: Could not find the language 'nginx'`
  - 随后提示 `Falling back to no-highlight mode for this block`
- **根本原因**：
  - `highlight.min.js` 未包含 nginx 语法模块
- **解决方案**：
  - 使用 `node_modules/highlight.js/tools/build.js` 重新构建，加入 `nginx` 语言
- **验证结果**：✅ 页面不再报 WARN，nginx 语法高亮正常

### BUG-031: 浏览器控件未随主题切换

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-31
- **重现环境**：切换暗色主题后查看表单与滚动条
- **问题现象**：
  - 部分浏览器默认控件仍显示亮色样式
- **根本原因**：
  - 未在 CSS 中声明 `color-scheme`
- **解决方案**：
  - 在 `:root` 设置 `color-scheme: light` 并在 `.is-dark-mode` 设置 `color-scheme: dark`
- **验证结果**：✅ 主题切换后控件样式一致

### BUG-032: Hero 模糊占位图不会消失

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-07-31
- **重现环境**：主页 hero 图片懒加载
- **问题现象**：
  - 高清图加载完成后占位图仍然显示
  - 过渡效果未触发
- **根本原因**：
  - 图片已缓存导致 `onLoad` 未触发
  - 缺少备用检测加载完成的逻辑
- **解决方案**：
  - 在 `useEffect` 中检查 `img.complete` 状态
  - 加载完成后切换 CSS class 触发过渡
- **验证结果**：✅ 模糊占位图顺利淡出

### BUG-033: Build fails with "Could not import ../../hooks"

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-08-01
- **重现环境**：项目重构后执行 `astro dev`
- **问题现象**：
  - 终端报错 `Could not import '../../hooks'`
- **根本原因**：
  - 表单组件位于 `src/components/forms/...`，相对路径应为 `../../../hooks`
  - 重构后遗漏更新，导致导入路径错误
- **解决方案**：
  - 更新 `LoginForm.tsx` 与 `RegisterForm.tsx` 中的导入路径
  - 检查其他文件确保路径正确
- **验证结果**：✅ 路径修正后构建通过

### BUG-034: CDN 缓存清理失败

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-08-02
- **重现环境**：GitHub Actions 部署流程
- **问题现象**：
  - 部署后 CDN 缓存未更新，用户访问旧资源
  - `Purge CDN cache` 步骤返回非 200 状态码
- **根本原因**：
  - jsDelivr 对 GitHub 仓库的缓存更新有延迟
  - 清理请求未正确覆盖所有资源路径
- **解决方案**：
  1. 添加重试机制和延迟等待
  2. 增加清理整个版本目录的请求
  3. 使用 `curl -X PURGE "https://purge.jsdelivr.net/gh/${{ github.repository }}@${{ env.PUBLIC_TAG_NAME }}"` 清理整个版本
- **验证结果**：✅ 缓存清理成功率提高到 100%
- **相关代码**：
  ```yaml
  - name: Purge CDN cache
    run: |
      # 清理整个版本目录
      curl -X PURGE "https://purge.jsdelivr.net/gh/${{ github.repository }}@${{ env.PUBLIC_TAG_NAME }}"

      # 清理特定资源
      url="https://cdn.jsdelivr.net/gh/${{ github.repository }}@${{ env.PUBLIC_TAG_NAME }}/release/build.tar.gz"
      for i in {1..3}; do
        response=$(curl -s -o /dev/null -w "%{http_code}" -X PURGE "$url")
        [ "$response" -eq 200 ] && break
        sleep 5 # 等待 5 秒后重试
      done
  ```

### BUG-035: 客户端环境变量未注入

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-08-02
- **重现环境**：生产环境
- **问题现象**：
  - 客户端代码访问 `getEnv('TAG_NAME')` 返回 undefined
  - CDN 资源路径未正确生成
- **根本原因**：
  - `astro.config.mjs` 中的 `vite.define` 配置未生效
  - 环境变量未在构建时正确传递
- **解决方案**：
  1. 使用 `src/utils/env.ts` 提供的 `getEnv()` 接口
  2. 在构建步骤中通过 `dotenv` 加载环境变量
  3. 修改 `astro.config.mjs`：
     ```js
    import { getEnv } from './src/utils/env';

    export default defineConfig({
      vite: {
        define: {
          'import.meta.env.PUBLIC_TAG_NAME': JSON.stringify(getEnv('TAG_NAME') || ''),
          'import.meta.env.PUBLIC_CDN_BASE': JSON.stringify(getEnv('CDN_BASE') || '/')
        }
      }
    });
     ```
- **验证结果**：✅ 客户端正确获取环境变量值
- **经验总结**：Astro 需要显式声明要暴露给客户端的变量

### BUG-036: 版本标签创建冲突

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-08-02
- **重现环境**：GitHub Actions 工作流
- **问题现象**：
  - `Create and push tag` 步骤失败，提示 "tag already exists"
  - 新版本部署中断
- **根本原因**：
  - 删除旧标签和创建新标签的步骤存在竞态条件
  - 当多个工作流同时运行时可能冲突
- **解决方案**：
  1. 合并删除和创建操作为一个原子操作
  2. 使用 `git push --delete` 和 `git tag -f` 强制更新
  3. 添加重试机制：
     ```yaml
     - name: Create and push tag
       run: |
         for i in {1..3}; do
           git tag -f $TAG_NAME $SHA && \
           git push origin $TAG_NAME --force && break || sleep 5
         done
     ```
- **验证结果**：✅ 标签创建成功率达到 100%

### BUG-037: Sentry source map 上传失败

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-08-02
- **重现环境**：GitHub Actions 构建流程
- **问题现象**：
  - 构建日志显示 `Sentry CLI` 403 错误
  - 生产环境错误堆栈未映射到源码
  - 错误报告显示 `Source code not found`
- **根本原因**：
  - `SENTRY_AUTH_TOKEN` 未注入 CI 环境
  - `astro.config.mjs` 中 org/project 名称拼写错误
  - 未启用 Vite source map 生成
- **解决方案**：
  1. 在 GitHub Secrets 添加 SENTRY_AUTH_TOKEN
  2. 验证 astro.config.mjs 配置：
    ```js
    import { getEnv } from './src/utils/env';
    sentry({
      sourceMapsUploadOptions: {
        authToken: getEnv('SENTRY_AUTH_TOKEN'),
        org: "correct-org-slug", // 确认组织名称
        project: "correct-project-slug", // 确认项目名称
      }
    })
    ```
  3. 确保 Vite 配置启用 sourcemap：
     ```js
     export default defineConfig({
       build: { sourcemap: true }
     })
     ```
- **验证结果**：✅ source map 成功上传，错误堆栈正确映射

### BUG-038: 开发环境错误上报污染

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-08-03
- **重现环境**：本地开发服务器
- **问题现象**：
  - 开发模式下错误上报到 Sentry 生产项目
  - 测试错误污染生产数据统计
- **根本原因**：
  - Sentry 初始化未区分环境
  - DSN 未按环境隔离
- **解决方案**：
  1. 添加环境判断逻辑：
      ```js
      // astro.config.mjs
      import { isProduction, getEnv } from './src/utils/env';
      const prod = isProduction();
      sentry({
        enabled: prod,
        dsn: prod
          ? getEnv('SENTRY_DSN_PROD')
          : getEnv('SENTRY_DSN_DEV')
      })
      ```
  2. 创建 Sentry 开发环境项目
  3. 更新 .env 文件：
     ```env
     # .env.production
     SENTRY_DSN_PROD="https://prod-key@sentry.io/1"

     # .env.development
     SENTRY_DSN_DEV="https://dev-key@sentry.io/2"
     ```
- **验证结果**：✅ 开发环境错误仅上报到开发项目

### BUG-039: 敏感数据泄露风险

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-08-03
- **重现环境**：错误报告详情页
- **问题现象**：
  - 错误报告包含存储层（如 localStorage）敏感数据
  - 用户身份信息出现在面包屑记录中
- **根本原因**：
  - 未配置数据擦除规则
  - SDK 默认捕获所有上下文数据
- **解决方案**：
  1. 添加 beforeSend 过滤钩子：
     ```ts
     // src/sentry.client.config.ts
     export default {
       beforeSend(event) {
         // 移除敏感字段
         if (event.request) {
           delete event.request.cookies;
           delete event.request.data;
         }
         return event;
       },
       denyUrls: [
         /localhost/,
         /chrome-extension:/
       ]
     }
     ```
  2. 禁用敏感数据收集：
     ```js
     sendDefaultPii: false
     ```
- **验证结果**：✅ 错误报告不再包含敏感信息

### BUG-040: Source map 版本不匹配

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-08-03
- **重现环境**：生产环境错误报告
- **问题现象**：
  - 错误堆栈行号与源码不符
  - 控制台警告 `Source map mismatch detected`
- **根本原因**：
  - 构建版本与 source map 版本不一致
  - 未注入唯一 release ID
- **解决方案**：
  1. 注入 Git commit 作为 release ID：
      ```js
      // astro.config.mjs
      import { getEnv } from './src/utils/env';
      const commitHash = getEnv('COMMIT_SHA') || 'dev';
      sentry({
        release: commitHash,
        sourceMapsUploadOptions: {
          release: commitHash
        }
      })
      ```
  2. 在 CI 中设置环境变量：
     ```yaml
     # GitHub Actions
     - name: Set env
       run: echo "COMMIT_SHA=${{ github.sha }}" >> $GITHUB_ENV
     ```
- **验证结果**：✅ 错误报告准确映射到对应版本源码

### BUG-041: Sentry CORS 403 on localhost

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-08-03
- **重现环境**：本地 `vite dev`，Chrome 115+
- **问题现象**：
  - 发送 Sentry envelope 到 `o***.ingest.us.sentry.io` 时返回 403
  - 控制台报 `CORS  Forbidden`，Network 显示 `reason: Cors`
- **根本原因**：
  - Sentry 项目 *Allowed Domains* 未包含 `localhost`
- **解决方案**：
  1. 打开 Sentry → *Settings → Security & Privacy → Allowed Domains*
  2. 添加 `localhost`, `127.0.0.1`, `www.rendazhang.com`
- **验证结果**：✅ 本地强制触发错误可正常上报
- **经验总结**：本地调试需在 Allowed Domains 加入开发域名；仅修改 CSP 无法解决 Sentry 侧 CORS 拒绝

### BUG-042: GitHub Actions 环境变量未绑定导致 tag undefined

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-08-03
- **重现环境**：GitHub Actions `deploy.yml`
- **问题现象**：
  - 步骤 `Release for tag undefined does not exist`
  - `${{ vars.PUBLIC_TAG_NAME }}` 在 step 中为 `undefined`
- **根本原因**：
  - 将变量迁移至 *Environments* 后，Job 未声明 `environment:`，导致无法读取 `vars.*`
- **解决方案**：
  - 在 `deploy` job 加入
    ```yaml
    environment: production
    env:
      PUBLIC_TAG_NAME: ${{ vars.PUBLIC_TAG_NAME }}
    ```
- **验证结果**：✅ Workflow 日志显示正确 tag，发布成功
- **经验总结**：GitHub *Environment* 的 `vars/​secrets` 只有绑定到同名 `environment:` 的 Job 才可用

### BUG-043: LocalStorage 新旧格式兼容性问题

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-08-04
- **重现环境**：所有浏览器，用户已有存储数据
- **问题现象**：
  - 新版 `storage.get()` 方法无法解析旧版直接存储的字符串值
  - 控制台报 `SyntaxError: Unexpected token` JSON 解析错误
  - 主题/语言切换功能部分用户失效
- **根本原因**：
  - 旧版存储使用 `localStorage.setItem(key, value)` 直接存储原始字符串
  - 新版要求使用 `JSON.stringify()` 存储结构化数据
  - 直接切换导致新旧数据格式不兼容
- **解决方案**：
  1. 在 `storage.get()` 方法中添加智能解析逻辑：
     ```javascript
     try {
       return JSON.parse(value);  // 尝试解析新版 JSON 格式数据
     } catch (e) {
       return value; // 返回旧版字符串格式数据
     }
     ```
  2. 写入时统一使用 `JSON.stringify()` 标准化格式
  3. 在 BaseLayout 中实现轻量级存储助手确保同步执行
- **验证结果**：✅ 新旧数据格式无缝兼容，无用户数据丢失
- **经验总结**：存储格式变更需考虑向后兼容，智能解析比数据迁移更安全

### BUG-044: 主题初始化脚本执行延迟导致闪烁

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-08-04
- **重现环境**：所有页面，特别是低性能设备
- **问题现象**：
  - 页面加载时主题/语言短暂显示默认值后切换
  - 使用 `type="module"` 的脚本执行时机过晚
  - React hydration 不匹配警告
- **根本原因**：
  - 模块脚本 (`<script type="module">`) 在 DOM 解析后执行
  - React 组件在脚本执行前已完成初始渲染
- **解决方案**：
  1. 使用非模块内联脚本确保同步执行：
     ```astro
     <script is:inline>
       // 轻量级存储助手实现
       window.__storageHelper = {
         get: (key) => {
           /* 智能解析逻辑 */
         }
       };
     </script>
     ```
  2. 在 `<head>` 中立即设置文档属性：
     ```javascript
     document.documentElement.lang = lang;
     document.documentElement.dataset.theme = theme;
     ```
  3. 暴露初始值供 React 上下文使用：
     ```javascript
     window.__INITIAL_THEME__ = theme;
     window.__INITIAL_LANG__ = lang;
     ```
- **验证结果**：✅ 完全消除主题/语言切换闪烁，hydration 无报错
- **关键指标**：页面加载到主题应用时间从 300ms+ 降至 <50ms

### BUG-045: 存储工具全局注册执行冲突

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-08-04
- **重现环境**：开发服务器，BaseLayout 页面
- **问题现象**：
  - 控制台报 `Uncaught SyntaxError: Unexpected token 'export'`
  - `storage.ts` 全局注册与内联脚本加载冲突
- **根本原因**：
  - 内联脚本尝试加载 ES 模块格式的 `storage.ts`
  - 非模块环境无法解析 `export` 语句
  - 重复注册存储助手逻辑
- **解决方案**：
  1. 完全移除 `storage.ts` 的全局注册方法
  2. 在 BaseLayout 实现自包含的轻量级存储助手
  3. 添加单例检查避免重复初始化：
     ```javascript
     if (window.__storageInitialized) return;
     window.__storageInitialized = true;
     ```
- **验证结果**：✅ 无模块加载错误，存储功能正常

### BUG-046: 输入时 Mermaid 图表频繁重渲染

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-08-07
- **重现环境**：本地 `npm run dev`，deepseek_chat 页面，Chrome 115+
- **问题现象**：
  - 在 message-input 中每输入一个字符，Mermaid 图表就重新渲染一次
  - 按住键持续输入时图表渲染消失，停止输入后才恢复
- **根本原因**：
  - 内联 `onRendered` 回调在每次输入时都会重新创建，触发 Markdown 渲染管线重复执行
  - Mermaid 渲染被频繁中断导致最终输出为空
- **解决方案**：
  1. 使用 `useCallback` 缓存 `onRendered` 并传递给 `ChatMessageList`
  2. 保持 `useMarkdownPipeline` 的依赖稳定，避免无谓重新渲染
- **验证结果**：✅ 连续输入时 Mermaid 图表保持稳定
- **经验总结**：稳定的回调引用可避免不必要的副作用

### BUG-047: 构建后 env.ts 无法读取环境变量

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-08-07
- **重现环境**：`npm run build` + `npm run preview`
- **问题现象**：
  - `src/sentry.client.config.ts` 调用 `getEnv()` 返回 undefined，Sentry 报 `No DSN provided`
  - LoginForm 等客户端模块无法获取 `src/utils/env.ts` 返回的环境变量
  - 直接使用 `import.meta.env.*` 可以读取到变量
- **根本原因**：
  - `src/utils/env.ts` 在 `buildSnapshot()` 中检查 `'env' in import.meta`
  - 构建后该检查始终返回 false，导致回退到 `process.env`
  - 客户端变量仅注入到 `import.meta.env`，`process.env` 中不存在
- **解决方案**：
  1. 在文件顶部声明 `const runtimeEnv = import.meta.env`
  2. `buildSnapshot()` 先返回 `{ ...runtimeEnv }`，若不存在再回退到 `process.env`
  3. 删除对 `'env' in import.meta` 的检查
- **验证结果**：✅ `npm run build` 与 `npm run preview` 中 Sentry 可正确读取 DSN
- **经验总结**：构建后 `import.meta` 不是普通对象，属性检查会失败，应直接捕获 `import.meta.env`

### BUG-048: 404/500 页面主题和语言初始化失败

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-08-08
- **重现环境**：构建后的 `404.html`、`500.html`
- **问题现象**：
  - Nginx CSP 阻止 BaseLayout 内联脚本执行
  - 页面首次渲染后才应用主题与语言，出现明显闪烁
- **根本原因**：
  - 内联脚本未被 `script-src 'self'` 允许，无法在 404/500 页面加载
- **解决方案**：
  1. 将初始化逻辑移至外部脚本 `/js/base-layout-init.js`
  2. `<script>` 标签通过 `data-theme-key`、`data-lang-key` 传入参数
  3. 调整 Nginx CSP 配置允许 `'self'` 加载该脚本
- **验证结果**：✅ 404/500 页面渲染前正确应用主题与语言
- **经验总结**：外部脚本更易于 CSP 控制，可避免主题/语言闪烁问题

### BUG-049: Vite 报错 `@import must precede all other statements`

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-08-09
- **重现环境**：`npm run build`
- **问题现象**：
  - 构建时控制台输出 `@import must precede all other statements` 警告
- **根本原因**：
  - `src/styles/theme.css` 中的 `@import` 语句位于 `@layer` 内容之后，违反 CSS 规范
- **解决方案**：
  - 将所有 `@import` 语句移动到文件顶部，紧接 `@layer` 声明
- **验证结果**：✅ `npm run build` 无警告
- **经验总结**：`@import` 必须在文件其他语句之前，可配合 `layer(name)` 指定层级

### BUG-050: Auth form containers use fixed top margin

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-08-09
- **重现环境**：登录或注册表单嵌入侧栏/弹窗
- **问题现象**：
  - 固定 `margin: 80px auto` 造成顶部留白过多甚至溢出
- **根本原因**：
  - `.c-login-container` 与 `.c-register-container` 使用硬编码外边距，未根据容器宽度调整
- **解决方案**：
  - 采用容器查询：默认外边距 20px，宽容器时增至 80px，确保在侧栏/弹窗中贴合父容器
- **验证结果**：✅ `npm test` 与 `npm run lint`

### BUG-051: Certification page styles bound to body element

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-08-09
- **重现环境**：证书页嵌入侧栏/弹窗
- **问题现象**：
  - `.cert-page` 的 `@container` 查询与 `padding-top` 在非 `<body>` 容器中失效
- **根本原因**：
  - 样式使用 `body.cert-page` 选择器，仅作用于 `<body>` 元素
- **解决方案**：
  - 改用通用 `.cert-page` 包裹元素并更新模板及容器查询选择器
- **验证结果**：✅ `npm test` 与 `npm run lint`

### BUG-052: Docs 页面标题 ID 重复导致 GitHub Actions 锚点失效

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-08-10
- **重现环境**：Chrome 最新版，英文模式 `http://localhost:4321/docs`
- **问题现象**：
  - 英文模式访问 `/docs#github-actions` 不会滚动到对应段落
- **根本原因**：
  - 中英文 README 中存在相同标题，生成重复 `id="github-actions"`，浏览器跳转到被隐藏的中文部分
- **解决方案**：
  - 根据页面语言为标题 ID 及 TOC 链接添加 `zh-` 或 `en-` 前缀，避免重复 ID
- **验证结果**：✅ 本地测试 `http://localhost:4321/docs#en-github-actions` 与中文对应链接均能正确定位

### BUG-053: 导航栏遮挡主体内容

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-08-10
- **重现环境**：Chrome 最新版，macOS Ventura
- **问题现象**：
  - 固定导航栏与主内容之间出现重叠
  - 主内容顶部被导航栏遮挡
- **根本原因**：
  - `body` 的 `padding-top` 未同步导航高度
- **解决方案**：
  - 使用 `--nav-height` 设置 `padding-top` 与导航高度一致
  - 调整侧栏菜单顶部间距以适配新高度
- **验证结果**：✅ `npx stylelint src/styles/layout.css src/styles/components/navigation/navigation.css`, `npm test`, `npm run lint`
- **经验总结**：布局应随组件尺寸动态调整，避免固定值导致覆盖

### BUG-054: Chat Widget 打开时 Mermaid 与代码高亮渲染闪烁

- **问题状态**：已关闭 (Closed)
- **发现日期**：2025-08-10
- **重现环境**：Chrome 最新版，嵌入式 Chat Widget
- **问题现象**：
  - 打开 Chat Widget 后骨架屏过早移除导致内容闪烁
  - Mermaid 图表与代码高亮在加载过程中短暂未渲染
- **根本原因**：
  - iframe `onLoad` 触发时 Markdown 增强尚未完成
  - 父页面未等待 `highlight.js` 与 `mermaid` 渲染结束即移除骨架屏
- **解决方案**：
  1. 子页面在动态导入 `highlight.js` 与 `mermaid` 并完成渲染后发送 `chat-page-ready`
  2. ChatWidget 监听 `chat-page-ready` 消息，收到后才隐藏骨架屏
- **验证结果**：✅ `npm test` 与 `npm run lint`
- **经验总结**：等待第三方库渲染完成再展示内容可避免 UI 闪烁
