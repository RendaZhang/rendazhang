<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Renda Zhang · Personal Website | 张人大 · 个人网站](#renda-zhang-%C2%B7-personal-website--%E5%BC%A0%E4%BA%BA%E5%A4%A7-%C2%B7-%E4%B8%AA%E4%BA%BA%E7%BD%91%E7%AB%99)
  - [🌐 简介 | Introduction](#-%E7%AE%80%E4%BB%8B--introduction)
  - [📌 功能 Features](#-%E5%8A%9F%E8%83%BD-features)
  - [🧠 技术栈 Technology Stack](#-%E6%8A%80%E6%9C%AF%E6%A0%88-technology-stack)
  - [🛠️ 使用说明 | Usage](#-%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E--usage)
  - [🤝 贡献指南 | Contributing Guide](#-%E8%B4%A1%E7%8C%AE%E6%8C%87%E5%8D%97--contributing-guide)
  - [🚀 部署 | Deployment](#-%E9%83%A8%E7%BD%B2--deployment)
    - [后端](#%E5%90%8E%E7%AB%AF)
    - [Nginx](#nginx)
  - [📬 联系方式 | Contact](#-%E8%81%94%E7%B3%BB%E6%96%B9%E5%BC%8F--contact)
  - [🔒 License](#-license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Renda Zhang · Personal Website | 张人大 · 个人网站

**Author / 作者**: Renda Zhang（张人大）
**Last Updated / 最后更新**: 2025-06-22
**Website / 网址**: [www.rendazhang.com](https://www.rendazhang.com)

______________________________________________________________________

## 🌐 简介 | Introduction

这是我个人维护的中英文双语技术展示网站，旨在作为我的简历、作品集和技术能力的在线展示平台。
This is my personal bilingual (English & Chinese) website, designed to present my resume, projects, and technical capabilities.

______________________________________________________________________

## 📌 功能 Features

- 📝 简历展示 Resume presentation (English & 中文)
- 📥 简历下载 Download latest PDF resume
- 💬 与 ChatGPT 在线对话 Chat with AI
- 🎖️ 证书展示 Certifications showcase
- 📂 项目展示 Project summaries
- 📱 自适应布局 Responsive for PC & mobile

______________________________________________________________________

## 🧠 技术栈 Technology Stack

| 分类 | 技术 |
|------|------|
| 前端 Frontend | HTML5, CSS3, Bootstrap, JavaScript |
| 后端 Backend | Flask (Python), OpenAI API |
| 服务器 Server | CentOS 7, NGINX, Gunicorn + Gevent |
| 工具 Tools | Git, Gitee, Markdown, Docker (optional) |

______________________________________________________________________

## 🛠️ 使用说明 | Usage

你可以直接访问各模块页面：

- [About Me / 关于我](https://www.rendazhang.com/index_english.html)
- [中文介绍页](https://www.rendazhang.com/index_chinese.html)
- [Chat with AI / 与 AI 聊天](https://www.rendazhang.com/chat.html)
- [Certifications / 证书](https://www.rendazhang.com/certifications.html)

如果你想查看此 `README.md` 本页，请直接访问：
[www.rendazhang.com/README.md](https://www.rendazhang.com/README.md)

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

______________________________________________________________________

## 🚀 部署 | Deployment

### 后端

- 安装依赖：

```bash
sudo /opt/cloudchat/venv/bin/pip install gunicorn gevent
```

- 示例 systemd 服务片段：

```ini
[Service]
ExecStart=/opt/cloudchat/venv/bin/gunicorn --worker-class gevent --workers 2 \
  --worker-connections 50 --max-requests 1000 --max-requests-jitter 50 \
  --timeout 300 --bind 0.0.0.0:5000 app:app
Restart=always
```

> 参考后端项目：[Python Cloud Chat](https://github.com/RendaZhang/python-cloud-chat)

### Nginx

- Nginx 中为 `/cloudchat/` 路径添加：

```nginx
proxy_read_timeout 300s;
proxy_send_timeout 300s;
proxy_buffering off;
proxy_redirect off;
```

此配置利用 **Gunicorn + Gevent** 提升流式接口的并发处理能力，
对 1GB 内存小服务器尤为适用。

> 参考 Nginx 项目：[Nginx Conf](https://github.com/RendaZhang/nginx-conf)

______________________________________________________________________

## 📬 联系方式 | Contact

- 📧 Email: [952402967@qq.com](mailto:952402967@qq.com)
- 🌏 Location: Shenzhen, China
- 📄 English Resume: [Resume_RendaZhang.pdf](https://www.rendazhang.com/images/Resume_RendaZhang.pdf)
- 📄 中文简历: [个人简历_张人大](https://www.rendazhang.com/images/%E4%B8%AA%E4%BA%BA%E7%AE%80%E5%8E%86_%E5%BC%A0%E4%BA%BA%E5%A4%A7.pdf)

______________________________________________________________________

## 🔒 License

本网站为个人作品展示用途，非开源。请勿未经许可复制或用于商业用途。
This website is personal and not open-source. Please do not reuse content without permission.
