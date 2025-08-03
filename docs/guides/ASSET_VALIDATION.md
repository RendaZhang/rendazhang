<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [静态资源命名验证脚本](#%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90%E5%91%BD%E5%90%8D%E9%AA%8C%E8%AF%81%E8%84%9A%E6%9C%AC)
  - [简介](#%E7%AE%80%E4%BB%8B)
  - [使用方法](#%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95)
  - [命名规则](#%E5%91%BD%E5%90%8D%E8%A7%84%E5%88%99)
  - [示例输出](#%E7%A4%BA%E4%BE%8B%E8%BE%93%E5%87%BA)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 静态资源命名验证脚本

- **作者**: 张人大 (Renda Zhang)
- **最后更新**: August 04, 2025, 00:54 (UTC+8)

---

## 简介

该脚本用于检查 `src/assets` 目录下的文件是否遵循约定的命名规则。

- 避免因文件名不规范导致的引用错误或构建失败。
- 帮助维护统一的资源管理方式。

---

## 使用方法

在项目根目录执行：

```bash
npm run validate-assets
```

脚本会遍历该目录并验证文件名。如果发现问题，会列出不符合规范的文件并以非零状态码退出。

如果已在项目中启用 **pre-commit**，此脚本会在每次提交时自动运行。

---

## 命名规则

- **音乐文件**：`[用途]-[歌手]-[歌曲名]-[版本或描述].mp3`
- **图片文件**：`[用途]-[属性]-[质量]-[形状]-[尺寸].jpg|png`

更多规则请根据实际需要在脚本中扩展。

---

## 示例输出

```
Invalid file names detected:
Images: hero-high-square-400x400.jpg
Assets: bgmusic-artist-song.mp3
```

若输出如上所示，请修改文件名后重新运行脚本。
