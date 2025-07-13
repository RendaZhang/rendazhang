<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [张人大 (Renda Zhang) · 轻量级网站](#张人大-renda-zhang--轻量级网站)
  - [🌐 简介](#-简介)
  - [📌 网站功能](#-网站功能)
  - [🧠 技术栈](#-技术栈)
    - [参考架构：](#参考架构)
  - [🚀 部署 Deployment](#-部署-deployment)
    - [**后端**](#后端)
    - [**Nginx**](#nginx)
  - [🛠️ 使用说明 | Usage](#️-使用说明--usage)
  - [🤝 贡献指南 | Contributing Guide](#-贡献指南--contributing-guide)
  - [🔒 License](#-license)
  - [📬 联系方式](#-联系方式)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 张人大 (Renda Zhang) · 轻量级网站

* **作者**: 张人大 (Renda Zhang)
* **最后更新**: July 8, 2025, 21:00 (UTC+8)
* **网站链接**: [www.rendazhang.com](https://www.rendazhang.com)

---

## 🌐 简介

这是我个人维护的中英文双语技术展示的 **轻量级** 网站，旨在作为我的简历、作品集和技术能力的在线展示平台。

---

## 📌 网站功能

- 💬 与 AI 在线对话
- 🖼️ 文本到图像生成功能（出于成本原因，暂时关闭）
- 📱 自适应布局 (移动端和桌面端)
- 💤 图片懒加载
- 🎖️ 证书展示
- 📝 简历展示和下载 (English & 中文，PDF 格式)
- 📂 项目展示
- ✉️ 联系表单 (通过 Formspree)
- 🎵 背景音乐播放开关
- 🌏 多语言支持 (英文 + 中文)
- 💰 捐赠支持
---

## 🧠 技术栈

| 分类 | 技术 |
|------|------|
| 前端 Frontend | HTML, CSS, Bootstrap, JavaScript |
| 后端 Backend | Flask (Python), OpenAI API |
| 服务器 Server | Ubuntu, NGINX, Gunicorn + Gevent |
| 工具 Tools | Git, Gitee, Markdown, Docker (optional) |

### 参考架构：

ASCII 图示：

```text
Web Application Architecture
============================

Frontend (
   HTML + CSS + Bootstrap + JavaScript
   - 负责用户界面和交互
) → Server (
   Ubuntu (操作系统)
   ↓
   NGINX (反向代理和负载均衡)
   ↓
   systemd 服务 (进程管理)
   ↓
   Gunicorn + Gevent (WSGI 服务器)
   ↓
   Backend: Flask App (处理业务逻辑和 API 请求)
)
```

Mermaid Flow 图示：

```mermaid
flowchart TD
    A[Web] --> B[Frontend: HTML, CSS, Bootstrap, JavaScript]
    A --> C[Server]
    B -->|负责用户界面和交互| C

    subgraph Server
        direction TB
        D[Ubuntu: 操作系统] --> E[NGINX: 反向代理和负载均衡]
        E --> F[systemd 服务: 进程管理]
        F --> G[Gunicorn + Gevent: WSGI 服务器]
        G --> H[Backend: Flask App: 处理业务逻辑和 API 请求]
    end
```
---

## 🚀 部署 Deployment

### **后端**

> 具体操作请参考后端项目：[Python Cloud Chat](https://github.com/RendaZhang/python-cloud-chat)

### **Nginx**

> 具体操作请参考 Nginx 项目：[Nginx Conf](https://github.com/RendaZhang/nginx-conf)

---

## 🛠️ 使用说明 | Usage

你可以直接访问各模块页面：

- [About Me / 关于我](https://www.rendazhang.com/index_english.html)
- [中文介绍页](https://www.rendazhang.com/index_chinese.html)
- [Chat with AI / 与 AI 聊天](https://www.rendazhang.com/deepseek_chat.html)
- [Certifications / 证书](https://www.rendazhang.com/certifications.html)

如果你想查看此 `README.md` 本页，请直接访问：
[www.rendazhang.com/README.md](https://www.rendazhang.com/README.md)

---

## 🤝 贡献指南 | Contributing Guide

- Fork & clone this repo.
- 安装依赖并启用 **pre-commit**:

```bash
npm install
pip install -r requirements-dev.txt
pre-commit install
```

- 在每次提交前，钩子会自动运行。你也可以手动触发：

```bash
pre-commit run --all-files
```

> ✅ 所有提交必须通过 pre-commit 检查；CI 会阻止不符合规范的 PR。

---

## 🔒 License

本项目采用 **MIT 协议** 开源发布。这意味着你可以自由地使用、修改并重新发布本仓库的内容，只需在分发时附上原始许可证声明。

---

## 📬 联系方式

- 联系人：张人大（Renda Zhang）
- 📧 Email: [952402967@qq.com](mailto:952402967@qq.com)
- 📄 English Resume: [Resume_RendaZhang.pdf](https://www.rendazhang.com/images/Resume_RendaZhang.pdf)
- 📄 中文简历: [个人简历_张人大](https://www.rendazhang.com/images/%E4%B8%AA%E4%BA%BA%E7%AE%80%E5%8E%86_%E5%BC%A0%E4%BA%BA%E5%A4%A7.pdf)


> ⏰ **Maintainer**：@Renda — 如果本项目对你有帮助，请不要忘了点亮 ⭐️ Star 支持我们！
