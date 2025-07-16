<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [旧版前端到 Astro+React 新前端的渐进迁移计划](#%E6%97%A7%E7%89%88%E5%89%8D%E7%AB%AF%E5%88%B0-astroreact-%E6%96%B0%E5%89%8D%E7%AB%AF%E7%9A%84%E6%B8%90%E8%BF%9B%E8%BF%81%E7%A7%BB%E8%AE%A1%E5%88%92)
  - [背景：](#%E8%83%8C%E6%99%AF)
    - [新的前端：](#%E6%96%B0%E7%9A%84%E5%89%8D%E7%AB%AF)
    - [旧的前端：](#%E6%97%A7%E7%9A%84%E5%89%8D%E7%AB%AF)
  - [**目标：**](#%E7%9B%AE%E6%A0%87)
  - [阶段1：环境准备与 Astro 项目初始化](#%E9%98%B6%E6%AE%B51%E7%8E%AF%E5%A2%83%E5%87%86%E5%A4%87%E4%B8%8E-astro-%E9%A1%B9%E7%9B%AE%E5%88%9D%E5%A7%8B%E5%8C%96)
  - [阶段2：集成 React 并配置项目结构](#%E9%98%B6%E6%AE%B52%E9%9B%86%E6%88%90-react-%E5%B9%B6%E9%85%8D%E7%BD%AE%E9%A1%B9%E7%9B%AE%E7%BB%93%E6%9E%84)
  - [阶段3：迁移静态资源和全局样式](#%E9%98%B6%E6%AE%B53%E8%BF%81%E7%A7%BB%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90%E5%92%8C%E5%85%A8%E5%B1%80%E6%A0%B7%E5%BC%8F)
  - [阶段4：迁移首页（导航页）到 Astro](#%E9%98%B6%E6%AE%B54%E8%BF%81%E7%A7%BB%E9%A6%96%E9%A1%B5%E5%AF%BC%E8%88%AA%E9%A1%B5%E5%88%B0-astro)
  - [阶段5：迁移其他静态内容页面](#%E9%98%B6%E6%AE%B55%E8%BF%81%E7%A7%BB%E5%85%B6%E4%BB%96%E9%9D%99%E6%80%81%E5%86%85%E5%AE%B9%E9%A1%B5%E9%9D%A2)
  - [阶段6：迁移 AI 聊天页面（DeepSeek Chat）到 React 组件](#%E9%98%B6%E6%AE%B56%E8%BF%81%E7%A7%BB-ai-%E8%81%8A%E5%A4%A9%E9%A1%B5%E9%9D%A2deepseek-chat%E5%88%B0-react-%E7%BB%84%E4%BB%B6)
  - [阶段7：引入全局状态管理机制（按需）](#%E9%98%B6%E6%AE%B57%E5%BC%95%E5%85%A5%E5%85%A8%E5%B1%80%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86%E6%9C%BA%E5%88%B6%E6%8C%89%E9%9C%80)
  - [阶段8：全面测试与部署上线](#%E9%98%B6%E6%AE%B58%E5%85%A8%E9%9D%A2%E6%B5%8B%E8%AF%95%E4%B8%8E%E9%83%A8%E7%BD%B2%E4%B8%8A%E7%BA%BF)
  - [阶段9：后续扩展计划（展望）](#%E9%98%B6%E6%AE%B59%E5%90%8E%E7%BB%AD%E6%89%A9%E5%B1%95%E8%AE%A1%E5%88%92%E5%B1%95%E6%9C%9B)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 旧版前端到 Astro+React 新前端的渐进迁移计划

- **作者**: 张人大 (Renda Zhang)
- **最后更新**: July 16, 2025, 18:00 (UTC+8)

---

## 背景：

### 新的前端：

核心框架：Astro

交互增强：React

状态管理：React 的 useState 和 useContext；项目扩展后再考虑 Zustand 或 Jotai。

构建工具：Astro 内置构建工具（Vite）

前端架构：使用分层架构，为未来扩展奠定基础；创建可复用服务层、组件层、和状态管理层。

部署方案：本地/构建服务器打包静态资源，GitHub Actions 自动将静态资源从代码仓库直接推送到小内存（1GB RAM）生产服务器的 Nginx 的 /var/www/html 目录下。

### 旧的前端：

原生 HTML+CSS+JS+Boostrap。

手动管理资源和手动部署到 Nginx 的 /var/www/rendazhang 目录下。

核心页面目前一共 6 个。

核心目录结构：
```
rendazhang
├─css
│  └─colors
├─fonts
├─images
│  ├─blog
│  └─social
├─js
├─webfonts
├─index.html (导航页)
├─index_chinese.html （中文介绍页）
├─index_english.html（英文介绍页）
├─deepseek_chat.html （AI 聊天页面）
├─certifications.html（证书展示页面）
└─docs.html（技术文档页面）
```

---

## **目标：**

在保证每一步都有可测试结果的前提下，将当前基于原生 HTML/CSS/JS+Bootstrap 的旧前端逐步迁移到以 **Astro** 为核心框架、结合 **React** 进行交互增强的新前端架构。

新架构采用 Astro 静态站点生成（利用内置 **Vite** 构建），并使用 React Hooks（`useState`、`useContext` 等）进行状态管理（未来需要时可引入 Zustand 或 Jotai）。

最终通过 **GitHub Actions** 实现自动构建部署，将静态资源推送到生产服务器 Nginx 的 `/var/www/html` 目录下。

迁移将分阶段进行，在每个阶段完成后进行测试验证，再继续下一步。

---

## 阶段1：环境准备与 Astro 项目初始化

**目的：** 搭建新的 Astro 项目基础结构，并确保开发环境正常运行。

* **安装开发环境：** 确保本地安装了最新的 Node.js LTS 版本（建议使用 Node 18+）和 npm/yarn 等包管理器。

* **初始化 Astro 项目：** 在本地运行 Astro 官方脚手架命令创建新项目目录。例如，在终端执行：

  ```bash
  npm create astro@latest
  ```

  按照交互向导选择项目名称和模板（可选择最简模板）。Astro 会生成基础项目结构（包含 `src/pages` 等目录）。创建完成后，进入项目目录并启动开发服务器：

  ```bash
  cd 新项目目录
  npm install  # 安装依赖
  npm run dev  # 启动 Astro 开发服务器
  ```

  打开浏览器访问本地主机端口（默认 `http://localhost:3000` 或命令行输出的端口），验证 Astro 项目跑通，看到默认的 “Welcome to Astro” 页面。此阶段确认环境搭建成功，新框架可以正常运行。

* **测试点：**确认 Astro 开发服务器正常运行，默认页面正常显示。由于 Astro 默认以静态站点方式预渲染内容，后续部署不需要服务器端运行环境，仅需静态文件供 Nginx 服务。这一点确保了新架构适配当前仅能提供静态文件服务的生产环境。

---

## 阶段2：集成 React 并配置项目结构

**目的：**在 Astro 项目中添加 React 支持，搭建基础的项目架构（组件层、服务层等），为后续迁移打好基础。

* **添加 React 支持：**Astro 提供官方集成命令来添加 React。在项目目录下运行：

  ```bash
  npx astro add react
  ```

  该命令将安装所需依赖并配置 Astro 项目以支持 React 组件渲染和客户端交互。完成后，Astro 将允许在 `.astro` 文件中使用 React 组件。

* **验证 React 集成：**创建一个简单的 React 组件以测试集成是否成功。例如，新建 `src/components/Test.jsx`：

  ```jsx
  import { useState } from 'react';
  export default function Test() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(c => c+1)}>Clicked {count} times</button>;
  }
  ```

  然后在首页 `src/pages/index.astro` 中引入该组件：

  ```astro
  ---
  import Test from '../components/Test.jsx';
  ---
  <Test client:load />
  ```

  运行开发服务器，确认页面上出现按钮并且点击时计数增加，证明 React 组件正常工作，`useState` 等 React 特性可用。这样验证了 Astro 的**部分水合**功能，可以在静态页面中嵌入交互组件。

* **规划项目结构：**按照分层架构思想创建目录和文件，以备后续使用：

  * 创建 `src/components` 目录用于存放可复用的 UI 组件（例如导航栏、页脚组件等）。
  * 创建 `src/layouts` 目录用于页面布局组件（如通用模板，包含头部引入等）。
  * 创建 `src/services` 目录用于封装业务逻辑或数据获取函数（例如后续聊天接口调用封装为服务）。
  * （可选）创建 `src/context` 目录，用于放置 React 上下文定义和提供器组件，以便日后扩展全局状态管理。

* **测试点：**React 集成成功后，新项目既能保持 Astro 对静态内容的预渲染优势，又能支持 React 进行动态交互。此时项目结构清晰，方便后续逐步迁移页面内容。

---

## 阶段3：迁移静态资源和全局样式

**目的：**将旧前端的静态资源（CSS、图像、字体等）迁移到 Astro 项目中，并建立全局样式，以保证新页面在样式和资源上与旧版一致。

* **复制静态资源：**将旧项目中的 `css/`, `fonts/`, `images/`, `webfonts/` 等目录复制到 Astro 项目中。按照 Astro 的约定，放入项目的 `public/` 目录下，以便构建时原样拷贝。比如：

  ```
  public/css/...
  public/fonts/...
  public/images/... 等
  ```

  这样在 Astro 页面中引用这些资源时，可以直接使用绝对路径 `/images/…` 等，对应到 `public` 下文件。

* **集成 Bootstrap：**如果旧版使用了 Bootstrap 样式库，确保在新项目中继续加载。可以将 Bootstrap 的 CSS 引入到全局。例如，将旧项目HTML `<head>`中的 Bootstrap `<link>`标签加入 Astro 的主布局组件中，或者直接把 Bootstrap 的 CSS 文件放入 `public/css` 并在页面中通过 `<link rel="stylesheet">` 引入。

* **迁移自定义 CSS：**将旧 `css` 目录下自定义的样式表文件复制到 `public/css`（或根据需要置于 `src/styles` 后通过`@import`引入）。优先快速起效，可直接在主布局的 `<head>` 中以 `<link href="/css/your-styles.css" rel="stylesheet">` 方式引入旧有样式。Astro 支持直接使用现有的 CSS 文件或库，无需完全重写样式。这样做能确保页面迁移初期视觉效果一致。

* **建立通用布局：**创建一个 Astro 布局组件（例如 `src/layouts/BaseLayout.astro`），其中包含页面的通用框架：`<head>` 内引入全局 CSS/脚本，和 `<header>/<footer>` 等公共部分。示例：

  ```astro
  ---
  // BaseLayout.astro
  import NavBar from '../components/NavBar.astro'; /* 假设稍后会创建导航栏组件 */
  ---
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="/css/bootstrap.min.css" />
      <link rel="stylesheet" href="/css/custom.css" />
    </head>
    <body>
      <NavBar />
      <slot />  <!-- 页面主体内容插槽 -->
    </body>
  </html>
  ```

  随后在各 Astro 页面文件的前置Frontmatter中指定 `layout: "../layouts/BaseLayout.astro"` 即可套用此布局。这样可以确保所有页面共享相同的CSS和基本结构。

* **验证静态资源：**在 Astro 开发环境下新建一个简单页面引用以上布局，放入一些旧有的 HTML 结构和元素，检查样式是否正确应用。例如放一段旧页面的HTML，看看字体、颜色是否与旧站一致。若有图片链接，确保能正常加载。此阶段完成后，说明旧版的静态资源已经成功集成，新框架可以访问 CSS/图像等。

---

## 阶段4：迁移首页（导航页）到 Astro

**目的：**将旧版的主导航页（`index.html`）迁移为 Astro 页面，以验证静态内容迁移的方法，并打通新架构下首页的访问。

* **创建首页页面文件：**在 `src/pages/` 下创建 `index.astro`（Astro 默认构建该文件为站点根 `/index.html`）。如果旧 `index.html` 主要是导航功能，可能包含语言选择或站点总览内容，那么将其 HTML 内容复制进新的 `index.astro` 文件的模板部分。

* **搬移内容：**打开旧的 `index.html`，将其中 `<body>` 内的内容粘贴到 `index.astro` 中 `<Layout></Layout>` 插槽或直接放入 `<body>` 中（取决于是否使用了布局组件）。**注意：**Astro 模板基本兼容 HTML，大部分静态标记可以直接使用。需要做的调整可能包括：

  * 移除旧HTML顶部的 `<!DOCTYPE html>` 等，因为 Astro 会自动生成。
  * 确保相对路径资源引用正确。例如旧代码 `<img src="images/logo.png">` 应改为 `<img src="/images/logo.png">` （因为已放入 `public`）。
  * 如果有内联脚本或引用 JS 文件（如 `script src="js/xx.js"`），暂时先在页面底部以相同方式引入，保持功能一致。

* **保持结构一致：**如果旧版导航页包含 Bootstrap 的栅格或组件代码，Astro 页面中可以直接保留这部分 HTML，因为先前已经全局引入了 Bootstrap CSS/JS（如需Bootstrap JS可能还需引入 `bootstrap.bundle.js`脚本）。Astro 对现有UI框架代码的兼容性很高，很多现成的 HTML 片段直接改扩展名即可运行。

* **测试首页：**启动 `npm run dev` 查看 Astro 下的新首页是否正确渲染出旧版的内容和样式。测试页面上的导航链接是否指向正确（因为后续其他页面也会迁移到对应路径）。如果有交互（例如点击某链接切换语言页面），由于此时其他页面可能尚未迁移，要暂时调整链接指向旧站地址进行测试，或等对应页面迁移后再测试。

* **调整优化：**确认导航页在新框架下表现良好后，可以根据需要优化代码结构。例如将导航菜单提取为独立组件 `NavBar.astro`，包含站点名称和链接列表，然后在首页和其他页面中复用它（通过布局或直接引用）。这一步优化可以提升可维护性，但要确保功能不变。

**测试点：**新首页应在 Astro 环境下看起来与旧版几乎一致。通过这一步，验证了纯静态页面迁移的可行性——事实上只需将 `.html` 扩展改为 `.astro` 并做少量修改，大部分内容即可正常工作。首页就绪后，为后续页面迁移提供了模板。

---

## 阶段5：迁移其他静态内容页面

**目的：**逐一迁移旧前端的其余静态页面（中文介绍页、英文介绍页、证书展示页、技术文档页），在新框架下重现其内容和功能。每完成一个页面都进行测试，确保与旧版一致，然后再迁移下一个。

要迁移的页面列表（旧版文件名 -> 新 Astro 页面路径）：

* **中文介绍页** (`index_chinese.html`): 在 `src/pages` 下创建 `index_chinese.astro`（或者根据需要重命名为更语义化的 `about.zh.astro` 等）。将旧页面内容贴入。同样套用全局布局，检查其中文本、图片、样式是否正常。测试站内链接（比如返回导航页或跳转英文页）是否正确。
* **英文介绍页** (`index_english.html`): 创建 `index_english.astro`，迁移内容。确保和中文页对应的结构，可能共享相似的组件。比如，如果中英文介绍页设计/layout 相同，可以提取公共组件（如个人简介卡片组件）供两者使用，只是传入不同文本。这样体现组件层复用。
* **证书展示页** (`certifications.html`): 创建 `certifications.astro` 并迁移内容。该页可能包含证书图片列表或画廊。确保图像文件已在 `public/images` 下，链接正确。可以考虑将证书数据（如图片URL及描述）提取为一个 JSON/数组，让 Astro 页面动态生成列表，从而演示**服务层**和组件复用：例如创建一个 `certList.js` 服务模块导出证书数据数组，页面通过导入数据生成多个证书项组件。这样将数据与呈现分离，便于后续扩展。
* **技术文档页** (`docs.html`): 创建 `docs.astro` 迁移内容。如果该页只是静态文章或链接集合，可直接搬内容。如果有很多重复的样式结构，考虑提取为组件（例如文档条目组件）。

对于每个页面：

* **应用布局和组件：**确保每个 Astro 页面文件使用了统一的 `BaseLayout`（或包含导航栏组件），这样这些页面的头部导航、样式加载都与首页一致。
* **迁移脚本：**如果某些页面有自己的 `<script>`（比如简单的表单验证或页面交互），可以将这些脚本复制到 Astro 页面底部，使用 `<script>` 标签包裹（Astro 会保留原始脚本运行在浏览器）。由于 Astro 使用 Vite 构建，脚本会被打包优化。**注意：**纯静态 JS 无依赖情况下直接迁移即可；如依赖 jQuery 或特定全局对象，需确保通过 `<script src="...">` 正确引入相关库（可以在布局的底部统一引入 jQuery 和 Bootstrap JS，以供所有页面使用）。
* **测试验证：**逐页在开发环境中查看效果，对比旧站：文本内容、排版样式、图像显示都应一致。所有链接点击应导航到对应的新 Astro 页面（如果目标页面尚未迁移，可暂时仍指向旧页面URL以避免死链，待迁移完成后统一更新链接）。确保控制台无报错。

**测试点：**这一阶段完成后，六个核心页面中除聊天页面外的五个静态页面都已有了 Astro 版，并且彼此通过导航链接串联。新前端已基本再现旧站的静态内容。通过逐步迁移和测试，我们确认 Astro 对原有内容的兼容良好——现有的 HTML/CSS 资产几乎可直接沿用。

---

## 阶段6：迁移 AI 聊天页面（DeepSeek Chat）到 React 组件

**目的：**将旧版的 AI 聊天页面（`deepseek_chat.html`）迁移到新架构下，实现为 React 组件以增强交互，并确保在 Astro 项目中正常运行。此步骤将引入**状态管理**和**服务层**的概念，提升代码可维护性。

* **分析旧版功能：**查看 `deepseek_chat.html` 中的实现方式。可能包含一个输入框和聊天记录区域，通过静态 JS 调用某个后端 API（例如调用 OpenAI 接口）获取回复。理解其工作流程（如点击发送按钮→调用 API→将返回结果追加到对话）。

* **创建 React 聊天组件：**在 `src/components/` 新建 React 组件文件，例如 `Chat.jsx`。用 React 重写聊天界面和逻辑：

  ```jsx
  import { useState } from 'react';
  import sendMessageToAI from '../services/chatService'; // 服务层封装的API调用
  export default function Chat() {
    const [messages, setMessages] = useState([]);      // 聊天消息列表状态
    const [input, setInput] = useState('');            // 当前输入框内容状态

    const handleSend = async () => {
      if (!input) return;
      const userMsg = { role: 'user', text: input };
      setMessages(msgs => [...msgs, userMsg]);        // 先把用户消息加入列表
      setInput('');
      try {
        const replyText = await sendMessageToAI(input);  // 调用服务层函数请求 AI 回复
        const botMsg = { role: 'bot', text: replyText };
        setMessages(msgs => [...msgs, botMsg]);       // 将AI回复加入消息列表
      } catch(err) {
        console.error(err);
        // 可以在界面上显示错误提示
      }
    };

    return (
      <div className="chat-container">
        <div className="messages">
          {messages.map((m, idx) => (
            <p key={idx} className={m.role}>{m.text}</p>
          ))}
        </div>
        <input
          value={input}
          onInput={(e) => setInput(e.target.value)}
          placeholder="Type your message..." />
        <button onClick={handleSend}>发送</button>
      </div>
    );
  }
  ```

  上述组件使用了 React 的 `useState` 来管理聊天消息列表和当前输入内容。当用户点击发送按钮时，将调用我们封装的服务函数 `sendMessageToAI` 与后端通信，然后更新状态渲染回复。

* **封装服务层：**在 `src/services/` 新建文件 `chatService.js`，将调用 AI 接口的细节封装其中，例如：

  ```js
  export default async function sendMessageToAI(userInput) {
    // 调用后端 API，例如 fetch 一个 URL 或调用 SDK
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: userInput })
    });
    const data = await response.json();
    return data.reply; // 假设返回JSON里有 reply 字段
  }
  ```

  *（注：*实际实现需根据后端接口细节调整。当前假定存在 `/api/chat` 端点。如无真实后端，可模拟返回固定回复以测试前端交互。）*
  将 API 调用逻辑与 UI 分离，有利于将来维护（例如切换到不同的后台服务，只需修改这个模块）。这体现了**服务层**的作用。

* **集成到页面：**在 Astro 项目中为聊天页面创建对应路由，例如 `src/pages/deepseek_chat.astro`。在其中引入 Chat 组件并启用客户端交互：

  ```astro
  ---
  import Chat from '../components/Chat.jsx';
  import BaseLayout from '../layouts/BaseLayout.astro';
  ---
  <BaseLayout>
    <h1>AI 聊天</h1>
    <Chat client:load />   <!-- 使用 Astro 部分水合，在浏览器加载 Chat 组件 -->
  </BaseLayout>
  ```

  这里采用 `client:load` 指令使 Chat 组件在页面加载时执行，可以响应用户输入。由于 Chat 内部使用了 `useState` 管理状态，并通过封装的服务请求数据，React 组件的交互应当顺利运行。

* **测试聊天功能：**在开发环境下打开 `/deepseek_chat` 页面。尝试输入消息并发送，观察：

  * 消息是否出现在对话框中（用户消息和模拟/真实的 AI 回复都会追加）。
  * 按钮、多次交互是否正常，组件状态是否正确更新。
  * 检查控制台是否有报错。如果后端尚未实现，可暂时让 `chatService` 返回假数据以测试前端界面更新逻辑。

**测试点：**确认 React 组件的交互在 Astro 下正常工作，聊天流程顺畅。此时已经运用了 React 的 Hooks 来管理组件内部状态。同时，我们在这一过程中建立了**组件层**（Chat.jsx 等 UI组件）和**服务层**（chatService.js 调用封装）的清晰分离，为未来扩展打下基础。这也验证了在 Astro 中使用 React 进行复杂交互的能力。

---

## 阶段7：引入全局状态管理机制（按需）

**目的：**根据项目需要，评估并实现全局状态管理方案，确保当出现跨组件/跨页面共享状态需求时，新前端架构能够支持。初始阶段使用 React 内置的 Context 实现简单的全局状态，在项目扩展后再考虑引入更复杂的状态库（如 Zustand 或 Jotai）。

* **评估需求：**首先判断当前站点是否需要全局状态共享。例如：主题配色切换、用户登录信息、多语言切换偏好等。如果暂时没有明显的全局状态，可以跳过实际实现，仅搭建结构以备未来使用。

* **使用 Context 实现示例：**如果需要共享状态（例如一个全局主题开关），可以用 React Context 提供器在 Astro 应用顶层包裹整个页面组件树。实现步骤：

  1. 定义 Context：在 `src/context/ThemeContext.jsx` 中创建：

     ```jsx
     import { createContext, useContext, useState } from 'react';
     const ThemeContext = createContext();
     export const useTheme = () => useContext(ThemeContext);
     export function ThemeProvider({ children }) {
       const [darkMode, setDarkMode] = useState(false);
       return (
         <ThemeContext.Provider value={{ darkMode, toggle: () => setDarkMode(m => !m) }}>
           {children}
         </ThemeContext.Provider>
       );
     }
     ```
  2. 在 Astro 的主布局中引入并包裹内容：修改 `BaseLayout.astro`：

     ```astro
     ---
     import { ThemeProvider } from '../context/ThemeContext.jsx';
     import NavBar from '../components/NavBar.astro';
     ---
     <ThemeProvider>
       <html><!-- ... --><body>
         <NavBar />
         <slot />
       </body></html>
     </ThemeProvider>
     ```

     这样 `<NavBar>` 以及 `<slot>` 中的所有React岛屿组件都能访问 ThemeContext。
  3. 在需要的组件中使用 Context：例如在 NavBar 的 React 子组件里放一个切换按钮：

     ```jsx
     import { useTheme } from '../context/ThemeContext';
     const { darkMode, toggle } = useTheme();
     // 点击按钮调用 toggle() 切换 darkMode 状态
     ```

     并根据 `darkMode` 切换样式类或 `<body>` 的 class 实现主题切换。

* **注意 Astro 限制：**Astro 的岛屿架构下，**同一个** React 岛屿内可以使用 Context 在子组件间传递状态，但无法直接在**多个**不同岛屿间共享（除非将它们都包裹在同一个 Context 提供器内）。对于跨页面的状态持久，可以使用更底层的方法（例如将状态保存在 `localStorage`，或使用更适合多组件共享的状态库）。Astro 官方建议如需跨组件/页面共享客户端状态，可考虑使用 Nano Stores 等轻量状态库。但对于当前站点规模，React 的 Context 已足够使用。未来如果站点扩展、组件增多再评估引入 Zustand/Jotai 等，它们也可以通过在 Astro 中导入使用，全局的 store 单例能够被各岛屿访问，从而实现状态共享。

* **测试点：**如果实现了示例的 ThemeContext，在页面上测试全局功能（如主题切换按钮）是否有效，各组件读取的状态是否同步更新。若当前不需要全局状态，则确保有清晰的方案说明，代码结构上已留出扩展空间（比如保留了 context 目录和相应示例），以便以后快速加入。经过这一阶段，新前端已经具备基本的**状态管理层**雏形。

---

## 阶段8：全面测试与部署上线

**目的：**对迁移后的新前端进行完整的功能和性能测试，确保与旧版一致或有所改进；然后建立自动化部署流程，将新站点发布到生产服务器的 `/var/www/html` 下并切换服务。

* **本地全面测试：**在完成上述所有页面迁移和功能实现后，使用 Astro 提供的静态构建进行一次完整测试：

  ```bash
  npm run build   # 生产环境构建静态文件
  npm run preview # 本地预览构建结果
  ```

  逐页检查构建后的站点：所有页面内容是否正确、链接是否通畅、样式是否完整加载、交互功能是否正常（特别是聊天页面的动态行为）。对比旧版网站，确保无遗漏功能。**注意：**由于我们切换了部署目录，过去可能存在的路径差异需要验证：例如旧版部署在 `/var/www/rendazhang` 下，新版直接在根 `/var/www/html`。检查站内链接是否有依赖旧目录的情况，如有应改为相对链接或根路径。

* **性能与兼容性：**验证页面在主流浏览器中的显示。Astro+Vite 已自动优化打包体积和性能，观察网页加载速度是否有提升。由于Astro默认进行了代码分割和部分水合，最终网站的前端资源加载更少的JS，提高性能。这些都是新的改进点。

* **部署前备份：**在正式替换站点前，备份旧版前端文件（如将 `/var/www/rendazhang` 内容打包保存），以便必要时快速回滚。更新 Nginx 配置，使站点根目录指向 `/var/www/html`（如果之前未改动，则 Nginx 默认就是此目录）。确认 Nginx 权限和配置允许服务新的静态文件（MIME 类型等一般默认OK）。

* **配置 GitHub Actions：**编写 CI/CD 工作流文件，实现代码变更自动部署：

  1. 在项目仓库中添加服务器部署所需的机密信息（Secrets），例如：`SERVER_IP`（服务器 IP或域名）、`SSH_USER`（SSH 用户名，如 root）、以及 `SSH_KEY`（用于登录服务器的私钥，建议用 Base64 或直接粘贴PEM内容）等。
  2. 在仓库中新建 `.github/workflows/deploy.yml`，填写自动化流程，例如：

     ```yaml
     name: Build and Deploy to Server
     on: [push]  # 推送代码时触发（可限定分支）
     jobs:
       deploy:
         runs-on: ubuntu-latest
         steps:
           - uses: actions/checkout@v3
           - uses: actions/setup-node@v3
             with: { node-version: 18 }
           - run: npm ci && npm run build    # 安装依赖并构建
           - name: Deploy to Nginx server
             run: |
               sudo apt-get update && sudo apt-get install -y sshpass
               sshpass -p "$SERVER_PASS" rsync -avz --delete dist/ ${SSH_USER}@${SERVER_IP}:/var/www/html
             env:
               SERVER_IP: ${{ secrets.SERVER_IP }}
               SERVER_PASS: ${{ secrets.SERVER_PASS }}
               SSH_USER: ${{ secrets.SSH_USER }}
     ```

     上述例子使用 `rsync` 部署构建产物（需在服务器上预先安装 rsync）。也可以使用现成的 GitHub Action，如 `appleboy/scp-action` 来通过 SCP 上传文件。关键是将 `dist/` 内的静态文件同步到 `/var/www/html` 目录。部署步骤要包含添加 SSH 密钥到 agent、将主机加入 known\_hosts 等操作。
  3. 将 workflow 推送到仓库后，在 GitHub Actions 面板观察执行过程，确保构建和上传步骤成功完成。第一次运行可以先在非业务时间触发，避免影响用户。

* **切换上线：**如果之前 Nginx 一直指向 `/var/www/rendazhang`，此时可以修改 Nginx 配置的站点根为 `/var/www/html` 并重载配置（或如果已经这么做且 old 文件未删除，则直接用新文件覆盖旧目录）。由于我们部署文件直接到 `/var/www/html`，一旦操作完成，新版本站点即开始对外服务。

  * 访问生产环境域名，逐页检查新站点是否正常运行。特别关注静态资源加载（检查 Nginx 日志或浏览器网络面板，看是否有 404）、页面跳转是否正确。
  * 检查 AI 聊天功能在生产环境能否调用后端成功（可能需要后端同样配置CORS或接口地址正确）。
  * 监控服务器资源占用：Astro 站点完全静态，1GB 内存的小型服务器应能够轻松应对，只需保证 Nginx 进程正常。由于不再需要 Node.js 在服务器上运行，内存占用将较低，“只有静态 JS 文件”的部署模式可以充分利用服务器资源。

* **回归和优化：**让一些试用用户或团队成员访问新站点，收集反馈。如果发现任何问题，及时修复后通过 GitHub Actions 部署更新。如果问题严重，可迅速回滚（将备份的旧版文件恢复到 `/var/www/html` 或切回旧目录并改Nginx配置）。但理想情况下，通过前面的分步测试，新版应平稳替代旧版。

**测试点：**最终在生产环境验证新前端一切正常。至此，渐进式迁移完成——旧的手工部署流程被 CI/CD 自动化取代，新架构在性能和可维护性上都有提升，站点仍以纯静态文件形式提供服务，符合最初预期。

---

## 阶段9：后续扩展计划（展望）

**目的：**在完成基础迁移后，展望未来可能的扩展，并确保架构可以支撑新的需求。

* **组件和页面扩充：**由于采用了 Astro 的多页静态架构和 React 组件，可以方便地新增页面或板块。例如如果以后要加入博客系统，可通过 Astro 的 Markdown 支持或内容集合功能实现。当前的分层结构有助于快速拓展新功能。
* **状态管理升级：**当站点功能复杂到一定程度（例如出现大量互动组件，需要不同页面间共享状态），可评估引入 Zustand、Jotai 等状态管理库。这些库与 React 配合良好，可作为全局单例存储，在 Astro 的各个岛组件中导入使用，从而突破 Astro 岛屿之间 Context 难以共享的限制。引入时需注意打包大小，但 Zustand/Jotai 都相对精简，对性能影响不大。
* **性能优化和SSR：**如果将来需要部分页面的动态渲染（例如根据用户请求生成内容），Astro 也支持开启服务端渲染(SSR)。不过在当前1GB内存服务器上运行Node服务需谨慎，因此更推荐继续采用静态生成+客户端Fetch组合的策略满足动态需求（例如聊天功能已经这样实现）。
* **部署和监控：**持续维护部署流水线，及时更新依赖版本。可考虑在 CI 中加入自动测试（例如利用 Astro 的测试工具或简单的脚本检查构建结果）。同时在服务器配置监控，确保部署后站点可用率。GitHub Actions 部署方案非常轻量，不需要额外的CI服务成本，每次改动 push 即可自动上线，提高了效率。

通过以上步骤的实施，我们实现了一个**渐进式、可验证**的迁移。从原生静态页面演进到 Astro+React 分层架构，新前端在保持内容和功能不变的前提下，获得了更好的可维护性和扩展性。在每个阶段的小步迭代测试下，风险降到了最低。现在的新前端架构为未来的开发奠定了基础，后续无论是增加新功能模块，还是引入更先进的状态管理，都可以在此稳固架构上平滑进行。
