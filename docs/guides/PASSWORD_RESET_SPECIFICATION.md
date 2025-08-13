<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [重置密码业务规范](#%E9%87%8D%E7%BD%AE%E5%AF%86%E7%A0%81%E4%B8%9A%E5%8A%A1%E8%A7%84%E8%8C%83)
  - [路由与端点](#%E8%B7%AF%E7%94%B1%E4%B8%8E%E7%AB%AF%E7%82%B9)
  - [业务流](#%E4%B8%9A%E5%8A%A1%E6%B5%81)
    - [忘记密码（入口在登录页/独立页面）](#%E5%BF%98%E8%AE%B0%E5%AF%86%E7%A0%81%E5%85%A5%E5%8F%A3%E5%9C%A8%E7%99%BB%E5%BD%95%E9%A1%B5%E7%8B%AC%E7%AB%8B%E9%A1%B5%E9%9D%A2)
    - [重置密码页 `/reset_password?token=...`](#%E9%87%8D%E7%BD%AE%E5%AF%86%E7%A0%81%E9%A1%B5-reset_passwordtoken)
  - [密码策略](#%E5%AF%86%E7%A0%81%E7%AD%96%E7%95%A5)
  - [API 契约（请求/响应与错误）](#api-%E5%A5%91%E7%BA%A6%E8%AF%B7%E6%B1%82%E5%93%8D%E5%BA%94%E4%B8%8E%E9%94%99%E8%AF%AF)
    - [发起重置（忘记密码）](#%E5%8F%91%E8%B5%B7%E9%87%8D%E7%BD%AE%E5%BF%98%E8%AE%B0%E5%AF%86%E7%A0%81)
    - [完成重置](#%E5%AE%8C%E6%88%90%E9%87%8D%E7%BD%AE)
  - [安全与边界条件](#%E5%AE%89%E5%85%A8%E4%B8%8E%E8%BE%B9%E7%95%8C%E6%9D%A1%E4%BB%B6)
    - [Token 行为](#token-%E8%A1%8C%E4%B8%BA)
    - [防枚举/提示文案](#%E9%98%B2%E6%9E%9A%E4%B8%BE%E6%8F%90%E7%A4%BA%E6%96%87%E6%A1%88)
    - [会话处理（重置后的强制下线）](#%E4%BC%9A%E8%AF%9D%E5%A4%84%E7%90%86%E9%87%8D%E7%BD%AE%E5%90%8E%E7%9A%84%E5%BC%BA%E5%88%B6%E4%B8%8B%E7%BA%BF)
    - [传输与缓存](#%E4%BC%A0%E8%BE%93%E4%B8%8E%E7%BC%93%E5%AD%98)
  - [前端页面规范](#%E5%89%8D%E7%AB%AF%E9%A1%B5%E9%9D%A2%E8%A7%84%E8%8C%83)
    - [页面结构（建议）](#%E9%A1%B5%E9%9D%A2%E7%BB%93%E6%9E%84%E5%BB%BA%E8%AE%AE)
    - [交互逻辑](#%E4%BA%A4%E4%BA%92%E9%80%BB%E8%BE%91)
    - [前端校验函数（与后端一致）](#%E5%89%8D%E7%AB%AF%E6%A0%A1%E9%AA%8C%E5%87%BD%E6%95%B0%E4%B8%8E%E5%90%8E%E7%AB%AF%E4%B8%80%E8%87%B4)
    - [可视化反馈建议](#%E5%8F%AF%E8%A7%86%E5%8C%96%E5%8F%8D%E9%A6%88%E5%BB%BA%E8%AE%AE)
  - [文案与多语言（示例）](#%E6%96%87%E6%A1%88%E4%B8%8E%E5%A4%9A%E8%AF%AD%E8%A8%80%E7%A4%BA%E4%BE%8B)
  - [监控与埋点（可选）](#%E7%9B%91%E6%8E%A7%E4%B8%8E%E5%9F%8B%E7%82%B9%E5%8F%AF%E9%80%89)
  - [开发/测试清单（前端）](#%E5%BC%80%E5%8F%91%E6%B5%8B%E8%AF%95%E6%B8%85%E5%8D%95%E5%89%8D%E7%AB%AF)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 重置密码业务规范

- **作者**: 张人大 (Renda Zhang)
- **最后更新**: August 13, 2025, 22:14 (UTC+08:00)

---

## 路由与端点

- **前端页面路由**：`/reset_password?token=<URL_SAFE_TOKEN>`
- **后端 API**（对外均带前缀 `/cloudchat`）：
  - 发起：`POST /cloudchat/auth/password/forgot`
  - 完成：`POST /cloudchat/auth/password/reset`
- **会话与 Cookie**：此流程**无需已登录**；提交 `reset` 时可以附带 `credentials: 'include'`（同源），但不是必须。

---

## 业务流

用户视角的业务流。

### 忘记密码（入口在登录页/独立页面）

1. 用户在“忘记密码”页输入邮箱 `email` → 调用
   `POST /cloudchat/auth/password/forgot`，Body: `{"identifier":"<email>"}`
2. 后端**始终返回 200**（即便邮箱不存在也不暴露），文案统一：
   “如果该邮箱存在，我们已发送一封重置邮件，请在 15 分钟内完成重置。”
3. 用户去邮箱点击链接：
   `https://www.rendazhang.com/reset_password?token=<TOKEN>`

### 重置密码页 `/reset_password?token=...`

1. 解析 `token`；若缺失 → 展示“链接无效或已过期”，并提供“重新发送邮件”按钮（跳转忘记密码页）。
2. 用户输入**新密码**与**确认密码**（前端本地校验，规则见 §2）。
3. 点击“重置密码” → 调用
   `POST /cloudchat/auth/password/reset`，Body: `{"token":"...","password":"..."}`
4. 成功（200）：展示“重置成功”并提示“请使用新密码登录”，提供回登录页按钮；**所有旧会话将强制下线**（见 §4.3）。
5. 失败（400）：
   - `Token invalid or expired` → 展示“链接无效或已过期”，提供“重新发送邮件”入口；
   - `Invalid token or weak password` → 提示“密码不符合要求”，并在前端强校验阻止再次提交。

---

## 密码策略

前后端保持一致。

- **长度**：8–128 字符
- **复杂度**：至少命中**两类**字符中的 **2 类**
  - 字母 `[A-Za-z]`
  - 数字 `\d`
  - 特殊字符 `[^A-Za-z0-9]`
- **前端强校验**：未达标**禁用提交**；实时显示校验项（长度、种类碰撞数）。
- **后端强校验**：同策略，任何绕过前端的请求仍会被拒绝（400）。

> 可选校验提示：`abcd1234`（2类）合规但偏弱；建议给出强度建议（混合大小写/符号）。

---

## API 契约（请求/响应与错误）

### 发起重置（忘记密码）

`POST /cloudchat/auth/password/forgot`
**Request**:

```json
{ "identifier": "alice@example.com" }
```

**Response（始终 200）**:

```json
{ "ok": true }
```

**节流**：

- IP：20/小时
- identifier（邮箱）：5/小时
  触发节流仍返回 200（防枚举）。

> 邮件内容：包含 15 分钟有效的重置链接
> `https://www.rendazhang.com/reset_password?token=<TOKEN>`

### 完成重置

`POST /cloudchat/auth/password/reset`

**Request**:

```json
{ "token": "<TOKEN>", "password": "NewP@ssw0rd42!" }
```

**Success (200)**:

```json
{ "ok": true, "revoked_sessions": 7 }
```

**Failure (400)**:

```json
{ "ok": false, "error": "Token invalid or expired" }
```

或

```json
{ "ok": false, "error": "Invalid token or weak password" }
```

---

## 安全与边界条件

### Token 行为

- Token 由后端生成，储存在 Redis：`pwreset:<token> -> <user_id>`，**TTL=900s**。
- **一次性**：后端在使用时 `GET` 后立即 `DELETE`（原子流水线）；**重复使用同一 token** 必然 400。
- 多次“忘记密码”请求 → 会生成多个 token；在有效期内**任一 token**被使用都可重置。
- **不要把 token 记录到日志/分析**；避免第三方脚本读取 `location.search` 泄露。
  - 建议前端页面 `<meta name="referrer" content="same-origin">`，表单提交时不要把 token 放在 Referer。

### 防枚举/提示文案

- `forgot` 始终 200，前端统一提示“如果该邮箱存在，我们已发送邮件”。
- `login` 失败统一 401 “账号或密码错误”。
- `reset` 失败：
  - token 失效/非法：统一“链接无效或已过期”；
  - 密码不合规：统一“密码不符合要求”。

### 会话处理（重置后的强制下线）

- 后端在重置成功后**删除该用户的所有会话**（当前实现为扫描 `sess:*`，小规模可接受）。
- 前端影响：若用户当前浏览器仍有旧登录态（`cc_auth`），重置后**下一次请求**可能 401，应在关键页面（例如个人中心）对 401 做**重定向登录**处理。

### 传输与缓存

- 全程 HTTPS；
- 重置页添加 `Cache-Control: no-store`（可由后端蓝图默认 + Nginx 层补强）；
- 所有 `fetch` 需使用 `credentials: 'include'`（同源）、`Content-Type: application/json`。

---

## 前端页面规范

Astro + React + TS

### 页面结构（建议）

- 路由：`/reset_password`
- 组成：
  - **Token 检查区**：若无 token → 显示“链接无效或已过期”，按钮“重新发送邮件”（跳转忘记密码页）。
  - **密码表单**（启用时 token 存在）：
    - 输入框：新密码、确认密码（TS 强类型）
    - 校验提示：长度、字符类别命中数（实时）
    - 提交按钮（未通过校验则禁用）
  - **结果区**：成功/失败反馈

### 交互逻辑

伪代码：

```ts
const token = new URLSearchParams(location.search).get('token');
if (!token) { showInvalidLink(); return; }

const [pwd, setPwd] = useState('');
const [confirm, setConfirm] = useState('');
const [submitting, setSubmitting] = useState(false);

const valid = passwordOk(pwd) && pwd === confirm;

async function onSubmit(e) {
  e.preventDefault();
  if (!valid || submitting) return;
  setSubmitting(true);
  try {
    const r = await fetch('/cloudchat/auth/password/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ token, password: pwd }),
    });
    const data = await r.json();
    if (r.ok && data.ok) {
      showSuccess(`已重置密码，请使用新密码登录。`);
      // 可选：n 秒后跳转 /login
    } else {
      if (data.error?.includes('Token')) showInvalidLink();
      else if (data.error?.includes('weak password')) showWeakPassword();
      else showGenericError();
    }
  } catch {
    showNetworkError();
  } finally {
    setSubmitting(false);
  }
}
```

### 前端校验函数（与后端一致）

伪代码：

```ts
function passwordOk(p: string): boolean {
  if (!p || p.length < 8 || p.length > 128) return false;
  let classes = 0;
  if (/[A-Za-z]/.test(p)) classes++;
  if (/\d/.test(p)) classes++;
  if (/[^A-Za-z0-9]/.test(p)) classes++;
  return classes >= 2;
}
```

### 可视化反馈建议

- **实时校验条**（✅/❌）：长度 ≥8、至少 2 类字符、两次一致
- **提交状态**：按钮 loading、禁用重复提交；网络失败显示“网络异常，请稍后重试”
- **成功状态**：大勾 + “重置成功”，按钮“前往登录”

---

## 文案与多语言（示例）

- 忘记密码提交后（统一）：
  “如果该邮箱存在，我们已发送重置邮件，请在 15 分钟内完成重置。”
- 重置页无 token：
  “链接无效或已过期，请重新发送邮件获取新的重置链接。”
- 密码不合规：
  “密码需 8–128 位，并包含字母/数字/特殊字符中的至少两类。”
- 重置成功：
  “密码已重置，请使用新密码登录。”

> 多语言建议：中文（简体）/ 英文；错误文案从后端只作分类提示，**前端可映射为用户友好的提示**。

---

## 监控与埋点（可选）

- 事件：`pw_forgot_submit`、`pw_reset_submit`、`pw_reset_success`、`pw_reset_token_invalid`、`pw_reset_weak_password`
- 字段：`user_agent`, `ip_hash`（不要存明文 IP）, `latency_ms`, `network_error`
- 日志注意：**绝不记录 token 与密码**。

---

## 开发/测试清单（前端）

- [ ] `/reset_password?token=...` 无 token → 提示正确
- [ ] 弱密码 → 按前端规则禁用提交，伪造请求也能被后端 400 拒绝
- [ ] 有效 token + 合规密码 → 200，显示“重置成功”
- [ ] 二次使用同 token → 400 “链接无效或已过期”
- [ ] 所有请求 `fetch` 均设置 `credentials: 'include'`（保持同源）
- [ ] 页面不引入第三方脚本读取 URL，避免 token 泄露；设置 `<meta name="referrer" content="same-origin">`
