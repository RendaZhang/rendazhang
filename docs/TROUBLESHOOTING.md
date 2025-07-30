<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [前端 BUG 跟踪数据库](#%E5%89%8D%E7%AB%AF-bug-%E8%B7%9F%E8%B8%AA%E6%95%B0%E6%8D%AE%E5%BA%93)
  - [文档说明](#%E6%96%87%E6%A1%A3%E8%AF%B4%E6%98%8E)
    - [BUG 记录格式要求](#bug-%E8%AE%B0%E5%BD%95%E6%A0%BC%E5%BC%8F%E8%A6%81%E6%B1%82)
    - [问题状态](#%E9%97%AE%E9%A2%98%E7%8A%B6%E6%80%81)
  - [BUG 详情](#bug-%E8%AF%A6%E6%83%85)
    - [BUG-001: Mermaid 图表渲染异常](#bug-001-mermaid-%E5%9B%BE%E8%A1%A8%E6%B8%B2%E6%9F%93%E5%BC%82%E5%B8%B8)
    - [BUG-002: highlight.js 与 Mermaid 冲突](#bug-002-highlightjs-%E4%B8%8E-mermaid-%E5%86%B2%E7%AA%81)
    - [BUG-003: CONTACT_FORM_ENDPOINT 未定义](#bug-003-contact_form_endpoint-%E6%9C%AA%E5%AE%9A%E4%B9%89)
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
    - [BUG-020: THEME_STORAGE_KEY 读取为 null](#bug-020-theme_storage_key-%E8%AF%BB%E5%8F%96%E4%B8%BA-null)
    - [BUG-021: Chat input placeholder flickers when switching languages](#bug-021-chat-input-placeholder-flickers-when-switching-languages)
    - [BUG-022: Docs page Mermaid errors when hidden diagrams render](#bug-022-docs-page-mermaid-errors-when-hidden-diagrams-render)
    - [BUG-023: Invalid image src value in SocialIcon](#bug-023-invalid-image-src-value-in-socialicon)
    - [BUG-024: Homepage QR code fails to load](#bug-024-homepage-qr-code-fails-to-load)
    - [BUG-025: Scripts run before React hydration](#bug-025-scripts-run-before-react-hydration)
    - [BUG-026: Docs page fails to render README](#bug-026-docs-page-fails-to-render-readme)
    - [BUG-027: Page title does not switch languages](#bug-027-page-title-does-not-switch-languages)
    - [BUG-028: Markdown styles inconsistent between pages](#bug-028-markdown-styles-inconsistent-between-pages)
    - [BUG-029: DOMPurify source map warning during dev](#bug-029-dompurify-source-map-warning-during-dev)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 前端 BUG 跟踪数据库

- **作者**: 张人大 (Renda Zhang)
- **最后更新**: July 30, 2025, 23:13 (UTC+8)

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

### BUG 记录格式要求

统一的记录格式便于后续检索和统计，推荐模版如下：

```markdown
### BUG-<编号>: <标题>

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

状态跟踪通过在「问题状态」小节中的勾选框体现：`[ ]` 表示未解决，`[x]` 表示已修复。

### 问题状态

- [x] BUG-001: Mermaid 图表渲染异常
- [x] BUG-002: highlight.js 与 Mermaid 冲突
- [x] BUG-003: CONTACT_FORM_ENDPOINT 未定义
- [x] BUG-004: jQuery.validator 加载顺序错误
- [x] BUG-005: jQuery.easing 插件缺失
- [x] BUG-006: BaseLayout 中文乱码
- [x] BUG-007: ThemeToggle context undefined
- [x] BUG-008: Dark mode hydration error
- [x] BUG-009: Certifications card overflow on small screens
- [x] BUG-010: Certifications page overlaps nav on short screens
- [x] BUG-011: Verify buttons not responsive on small screens
- [x] BUG-012: Dark mode flashes before applying
- [x] BUG-013: Hydration mismatch when dark mode is enabled
- [x] BUG-014: Chat widget panel flashes in dark mode
- [x] BUG-015: Enhancement progress stuck when scripts load from memory cache
- [x] BUG-016: document is not defined during build
- [x] BUG-017: NavBar hydration mismatch when language differs
- [x] BUG-018: About page hydration mismatch and flicker
- [x] BUG-019: Contact form placeholders flicker on first render
- [x] BUG-020: THEME_STORAGE_KEY 读取为 null
- [x] BUG-021: Chat input placeholder flickers when switching languages
- [x] BUG-022: Docs page Mermaid errors when hidden diagrams render
- [x] BUG-023: Invalid image src value in SocialIcon
- [x] BUG-024: Homepage QR code fails to load
- [x] BUG-025: Scripts run before React hydration
- [x] BUG-026: Docs page fails to render README
- [x] BUG-027: Page title does not switch languages
- [x] BUG-028: Markdown styles inconsistent between pages
- [x] BUG-029: DOMPurify source map warning during dev

---

## BUG 详情

### BUG-001: Mermaid 图表渲染异常

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
  ```jsx
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
  ```jsx
  document.querySelectorAll('pre code:not(.language-mermaid)').forEach(block => {
    hljs.highlightElement(block);
  });
  ```

### BUG-003: CONTACT_FORM_ENDPOINT 未定义

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
  ```jsx
  // 修改前
  const defaultContext = undefined;

  // 修改后
  const defaultContext = {
    darkMode: false,
    toggle: () => {}
  };
  ```

### BUG-008: Dark mode hydration error

- **发现日期**：2025-07-27
- **重现环境**：Chrome 最新版，登录/注册页面
- **问题现象**：
  - 暗色模式刷新后报 `Minified React error #418`
  - 控制台显示 hydration 不匹配警告
- **根本原因**：
  - 服务端始终渲染亮色主题，客户端按 localStorage 初始化
  - SSR 与客户端初始状态不一致
- **解决方案**：
  - 初始状态固定为 false
  - useEffect 中读取 localStorage 并更新状态
- **验证结果**：✅ 刷新不再报错，主题切换正常
- **经验总结**：SSR 应用必须保证初始渲染一致性

### BUG-009: Certifications card overflow on small screens

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

- **发现日期**：2025-07-27
- **重现环境**：Chrome 115+, 浏览器高度 600px
- **问题现象**：
  - 证书页顶部内容被固定导航遮挡
- **根本原因**：
  - `index.css` 全局设置 `body` 为 `display:flex; height:100vh;`
    且取消了顶部间距，导致非首页也沿用该布局
- **解决方案**：
  - 为证书页设置 `bodyClass="cert-page"` 并在 `certifications.css`
    中恢复 `padding-top` 和常规布局
- **验证结果**：✅ 调整后在 600px 高度下页面不再与导航重叠

### BUG-011: Verify buttons not responsive on small screens

- **发现日期**：2025-07-27
- **重现环境**：Chrome 开发工具，380px 宽度
- **问题现象**：
  - 两个验证按钮在窄屏下无法并排显示
- **根本原因**：
  - `.verify-btn` 仅使用 margin-right，缺乏弹性布局导致按钮宽度固定
- **解决方案**：
  - 将按钮容器设为 flex 布局并给予按钮 `flex:1`，同时统一 margin
- **验证结果**：✅ 在 380px 宽度下按钮可均匀收缩，无溢出

### BUG-012: Dark mode flashes before applying

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
  <script is:inline>
    try {
      const stored = localStorage.getItem('${THEME_STORAGE_KEY}');
      if (stored === 'dark') document.documentElement.classList.add('dark-mode');
    } catch {}
  </script>
  ```

### BUG-013: Hydration mismatch when dark mode is enabled

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
  ```jsx
  const [darkMode, setDarkMode] = useState(false); // SSR统一值
  const mounted = useRef(false);

  useLayoutEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      const isDark = document.documentElement.classList.contains('dark-mode');
      setDarkMode(isDark);
    }
  }, []);
  ```

### BUG-014: Chat widget panel flashes in dark mode

- **发现日期**：2025-07-27
- **重现环境**：深色主题下的首页
- **问题现象**：
  - 点击右下角聊天按钮时，弹出面板先显示白色再变黑色
- **根本原因**：
  - `chat_widget.css`（现位于 `src/styles/`）默认背景为白色，未针对 `.dark-mode` 提供样式
- **解决方案**：
  - 在样式表中添加 `.dark-mode .chat-widget-panel { background:#1e1e1e; }`
- **验证结果**：✅ 弹窗不再闪烁

### BUG-015: Enhancement progress stuck when scripts load from memory cache

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

- **发现日期**：2025-07-28
- **重现环境**：Astro `astro build`
- **问题现象**：
  - 构建日志报 `document is not defined`
  - 终止于 `/about/index.html`
- **根本原因**：
  - `ContactSection.jsx` 在服务端渲染阶段调用 `document` 和 `window`
- **解决方案**：
  - 检查 `document` 和 `window` 是否存在后再访问
  - 服务器端返回空内容，客户端加载后再根据语言注入数据
- **验证结果**：✅ 构建成功，无报错

### BUG-017: NavBar hydration mismatch when language differs

- **发现日期**：2025-07-28
- **重现环境**：Chrome 最新版，切换语言后刷新页面
- **问题现象**：
  - 控制台报 "Hydration failed" 警告
  - 页面初始显示中文导航文字后迅速切换为英文，产生闪烁
- **根本原因**：
  - `NavBar` 组件在服务端调用 `getCurrentLang()`，默认返回中文
  - 客户端根据 `<html lang>` 或 localStorage 得到英文，导致首屏内容不一致
- **解决方案**：
  1. 将页面 `lang` 属性通过 props 传递给 `NavBar` 和 `ThemeToggle`
  2. 初始化语言脚本优先读取页面 lang 属性
  3. 导航栏和主题切换同时渲染中英文文本，通过 CSS 根据 `html[lang]` 隐藏未选语言
- **验证结果**：✅ 中英文模式下刷新页面均无闪烁，也无 Hydration 报错
- **经验总结**：SSR 组件需共享同一语言来源并同时渲染多语言文本，以避免渲染不一致

### BUG-018: About page hydration mismatch and flicker

- **发现日期**：2025-07-28
- **重现环境**：Chrome 最新版，切换语言后刷新 About 页面
- **问题现象**：
  - 首次加载时先显示中文内容后切换为英文，页面发生闪烁
  - 控制台报 `Hydration failed` 错误
- **根本原因**：
  - 服务端无法访问浏览器 localStorage，默认返回中文
  - AboutContent 仅渲染当前语言文本，服务端与客户端标记不一致
- **解决方案**：
  1. About 页面同时渲染中英文内容，CSS 根据 `html[lang]` 隐藏未选语言
  2. `data-initial-lang` 保持与服务器输出一致，避免 React 水合差异
- **验证结果**：✅ 切换和刷新 About 页面均无闪烁，也无 Hydration 报错
- **经验总结**：多语言页面在 SSR 场景下应让服务端获得初始语言，并同时输出所有语言版本以保持 DOM 一致

### BUG-019: Contact form placeholders flicker on first render

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

### BUG-020: THEME_STORAGE_KEY 读取为 null

- **发现日期**：2025-07-29
- **重现环境**：Chrome 最新版
- **问题现象**：
  - 在 BaseLayout 主题初始化脚本中使用 `localStorage.getItem('${THEME_STORAGE_KEY}')` 时返回 null
- **根本原因**：
  - 该字符串在构建阶段被 Astro 当作模板字符串处理，无法在脚本运行时得到常量值
- **解决方案**：
  - 通过 `define:vars={{ themeKey: THEME_STORAGE_KEY }}` 将常量值注入行内脚本
  - 使用 `localStorage.getItem(themeKey)` 读取存储值
- **验证结果**：✅ 控制台能够正确获取主题值

### BUG-021: Chat input placeholder flickers when switching languages

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

- **发现日期**：2025-07-30
- **重现环境**：Docs 页面，生产环境
- **问题现象**：
  - 页面只显示 "Loading..."，控制台无明显报错
- **根本原因**：
  - jQuery 异步加载导致请求被阻塞，README 内容未能返回
- **解决方案**：
  - 移除对 jQuery 的依赖，改用 `fetch` 加载文档
- **验证结果**：✅ 页面渲染正常，文档内容显示完整

### BUG-027: Page title does not switch languages

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

- **发现日期**：2025-07-30
- **重现环境**：Docs 页面与 DeepSeek Chat 页面
- **问题现象**：
  - Chat 页面代码块无语法着色
  - Docs 页面排版不具备 GitHub 风格
- **根本原因**：
  - Chat 页面仅引入 `github-markdown-light.min.css`
  - Docs 页面仅引入 `github.min.css`
- **解决方案**：
  - 两个页面同时加载 `github.min.css` 与 `github-markdown-light.min.css`
- **验证结果**：✅ 两页面的代码高亮与排版均保持一致

### BUG-029: DOMPurify source map warning during dev

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
