# FOR_NEXT_AGENT.md — Lunaxstar 占星网站 · 接手指南

**仓库**: https://github.com/hanhan130909-design/astrology.git
**生产域名**: https://lunaxstar.com
**技术栈**: Next.js 15 + Firebase + astronomy-engine

---

## 1. 快速开始

```bash
git clone https://github.com/hanhan130909-design/astrology.git
cd astrology
npm install
```

创建 `.env.local`（找项目所有者索取 Firebase 配置值）:

```bash
cp .env.example .env.local
# 编辑 .env.local，填入真实的 Firebase API Key 等
npm run dev
```

访问 `http://localhost:3000/login` 测试 Google 登录。

---

## 2. 🐛 已知 Bug: Google 登录不工作

### 症状
- 电脑端：弹 Google 登录窗口后卡住，或不跳转
- 手机端：弹窗被浏览器拦截，无反应

### 调试方法
代码中已埋好 `console.log` 调试日志。在 `lunaxstar.com/login` 页面：

1. 按 F12 → Console
2. 点击「使用Google登录」
3. 观察以下日志链：

```
[LoginPage] Calling loginWithGoogle with language: zh
  → [AuthContext] loginWithGoogleFn called, isFirebaseConfigured: true
    → [AuthContext] Calling firebase.loginWithGoogle with language: zh
      → [firebase.ts] loginWithGoogle starting...
        → [firebase.ts] signInWithPopup result: UserCredential
      → [firebase.ts] onAuthStateChanged fired, user: uid
    → [AuthContext] Setting user: xxx@gmail.com
  → [LoginPage] Success! Pushing to /
```

**哪一步没打出来，就是哪一步卡住了。**

### 已知问题

#### 1. Firebase 配置可能不一致
项目中存在**两组不同的 Firebase 配置值**:

| 来源 | Sender ID | 推测 |
|------|-----------|------|
| `HANDOVER.md` | `1035645867773` | 可能是旧的 Firebase 项目 |
| `vercel.json`（线上） | `684890555392` | 可能是线上实际在用的 |

**当前线上跑的配置来自 `vercel.json`**（Vercel 部署时自动注入），但 `vercel.json` 里硬编码了 Firebase 密钥 → **安全隐患**。

测试时需要确认：
- 线上 `lunaxstar.com` 用的到底是哪个 Firebase 项目
- `.env.local` 本地配置是否和线上 Vercel 配置一致
- Firebase Console → Authentication → Authorized domains 是否包含 `lunaxstar.com`

#### 2. 移动端弹窗被拦截
`signInWithPopup()` 在移动端 Safari/Chrome 会被拦截。修复方案已在 `HANDOVER.md` 中（改用 `signInWithRedirect`），但未部署。

#### 3. Vercel 环境变量 BOM Bug
之前发现 Vercel Dashboard 手动粘贴环境变量会引入不可见 BOM 字符（`%EF%BB%BF`）。
已在 `src/lib/firebase.ts` 中添加 `cleanEnv()` 函数做防御性清理。

---

## 3. 🔧 关键文件清单

| 文件 | 作用 | 注意 |
|------|------|------|
| `src/app/login/page.tsx` | 登录页面 UI + Google 登录入口 | `handleGoogleLogin` 函数 |
| `src/contexts/AuthContext.tsx` | Auth 状态管理 | `loginWithGoogleFn` 调用 Firebase |
| `src/lib/firebase.ts` | Firebase 初始化 + 所有 Auth 函数 | `cleanEnv()` BOM清理 |
| `src/app/layout.tsx` | 根布局 | 包裹了 `AuthProvider` |
| `.env.example` | 环境变量模板 | 已更新为完整可用模板 |
| `.env.local` | 本地 Firebase 配置（⚠️ .gitignore 保护） | **需要向项目所有者索取** |
| `vercel.json` | Vercel 部署配置 | ⚠️ 硬编码了 Firebase 密钥 |

---

## 4. 🚀 部署命令

```bash
# 确保 .env.local 有完整的 Firebase 配置
# 然后：
npx vercel --prod --yes
```

---

## 5. ⚠️ 已知问题清单（待修复）

- [ ] Google 登录在线上不工作（最高优先级）
- [ ] `vercel.json` 硬编码 Firebase 密钥（安全隐患，应改为 Vercel Dashboard 环境变量）
- [ ] 移动端弹窗被拦截（改用 `signInWithRedirect`）
- [ ] 语言切换后部分 i18n 翻译未生效

---

## 6. 📞 需要向项目所有者索要

启动本地开发前，必须向项目所有者获取：

1. **Firebase 配置值**（7 个 key）— 填入 `.env.local`
2. **Firebase Console 访问权限** — 确认 `lunaxstar.com` 在 Authorized Domains 中
3. **Google Cloud OAuth 客户端 ID** — 确认 `https://lunaxstar.com` 在 JS Origins 中
