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

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 前端 BUG 跟踪数据库

- **作者**: 张人大 (Renda Zhang)
- **最后更新**: July 26, 2025, 17:20 (UTC+8)

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
  - 打开中文 About 页面时控制台报 `$(...).validator is not a function`
- **根本原因**：
  - 在 about.zh 页面中先加载 `contact.js`，再加载 `validator.min.js`
  - jQuery 插件未在脚本执行前初始化
- **解决方案**：
  - 调整脚本顺序，先引入 `validator.min.js` 后引入 `contact.js`
- **验证结果**：✅ 控制台不再报错，表单校验正常

### BUG-005: jQuery.easing 插件缺失

- **发现日期**：2025-07-25
- **重现环境**：Chrome 最新版，开发服务器
- **问题现象**：
  - About 英文页面报 `E.easing[this.easing] is not a function`
- **根本原因**：
  - 页面未加载 `jquery.easing.min.js`，但 `switcher.min.js` 依赖该插件
- **解决方案**：
  - 在 about.en 页面中引入 `SCRIPT_PATHS.JQUERY_EASING`，置于 jQuery 之后
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
