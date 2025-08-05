<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [环境变量工具函数](#%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F%E5%B7%A5%E5%85%B7%E5%87%BD%E6%95%B0)
  - [简介](#%E7%AE%80%E4%BB%8B)
  - [API](#api)
    - [`getEnv(key)`](#getenvkey)
    - [`isProduction()`](#isproduction)
    - [`getCdnUrl(path)`](#getcdnurlpath)
  - [使用示例](#%E4%BD%BF%E7%94%A8%E7%A4%BA%E4%BE%8B)
  - [注意事项](#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)
  - [性能优化与设计原理](#%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E4%B8%8E%E8%AE%BE%E8%AE%A1%E5%8E%9F%E7%90%86)
    - [Node.js 运行时](#nodejs-%E8%BF%90%E8%A1%8C%E6%97%B6)
    - [浏览器运行时](#%E6%B5%8F%E8%A7%88%E5%99%A8%E8%BF%90%E8%A1%8C%E6%97%B6)
    - [场景化建议](#%E5%9C%BA%E6%99%AF%E5%8C%96%E5%BB%BA%E8%AE%AE)
    - [小结](#%E5%B0%8F%E7%BB%93)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 环境变量工具函数

- **作者**: 张人大 (Renda Zhang)
- **最后更新**: August 05, 2025, 17:57 (UTC+08:00)

---

## 简介

`src/utils/env.js` 提供统一的环境变量访问层，可在 Node、浏览器与 SSR 环境中使用。

所有环境变量请通过该模块读取，避免在代码中直接访问 `process.env` 或 `import.meta.env`。

---

## API

### `getEnv(key)`

根据提供的 `key` 返回对应环境变量值，支持自动判断运行环境并处理 `PUBLIC_` 前缀。

### `isProduction()`

当 `NODE_ENV` 为 `'production'` 时返回 `true`。

### `getCdnUrl(path)`

基于 `CDN_BASE` 构建资源的完整 CDN 地址。

---

## 使用示例

```js
import { getEnv, isProduction, getCdnUrl } from '@/utils/env.js';

const baseUrl = getEnv('API_BASE_URL');
if (!isProduction()) {
  console.log('Current API:', baseUrl);
}

const logo = getCdnUrl('/images/logo.png');
```

---

## 注意事项

- 所有新代码应通过 `getEnv` 访问环境变量。
- 如需新增变量，在 `env.js` 的 `envKeyMap` 中添加映射。

---

## 性能优化与设计原理

### Node.js 运行时

- `process.env` 并非普通 JS 对象，而是通过 Node 的 C++ 层 `getenv` 暴露的代理。
- **每次访问** 都会触发一次同步的原生调用，再把结果传回 JS 层。
- 单次读取仅需微秒级，但在高频路径（如 HTTP 请求处理、渲染循环）中会累积到可观的 **P95/P99 延迟**。
- **最佳实践**：在应用启动阶段一次性读取并缓存所有需要的环境变量，业务代码只访问缓存；热路径绝不要直接读 `process.env`。

### 浏览器运行时

- Vite 等打包工具会在 **构建阶段** 将 `import.meta.env.FOO` 替换为字面量并参与 tree-shaking，生产环境几乎 **零运行时成本**。
- 开发模式下 `import.meta.env` 只是普通对象，访问成本≈读取 `window.foo`。
- 仅在使用 **动态键**（如 `import.meta.env[key]`）时，整个对象才会被打包进 bundle，稍微增加体积，但 CPU 开销仍可忽略。
- 建议把常用配置（如 `IS_PROD`、`API_BASE_URL`）导出为常量，让 bundler 在构建期完成死代码消除。

### 场景化建议

| 场景 | 是否需要优化 | 推荐做法  |
|------|------------|-----------|
| CLI / Build 脚本 | 不需要 | IO/网络调用占主导，环境变量成本可忽略 |
| SSR 首屏渲染 | 视情况而定 | 若仅入口读取数次，可忽略；否则入口处缓存 |
| 高并发 API 服务 | 必须优化 | 启动期缓存，热路径只用常量 |
| 浏览器业务逻辑 | 基本不需优化 | 依赖编译期常量或普通对象属性即可 |

### 小结

- **服务器端**：`process.env` 跨语言边界调用，需缓存后使用。
- **客户端**：大多数情况下已在编译期被替换；动态读取影响极小。
- **通用原则**：在应用启动阶段统一读取并校验环境变量，再把结果挂到配置对象或导出的常量中，后续代码仅依赖纯 JS 常量，既安全又高效。
