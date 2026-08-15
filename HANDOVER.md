# 星缘占星网站 - 项目交接文档

> ⚠️ **当前状态（2026-08-15 更新）**：本文档是 2026-05 的历史交接。以下内容已过时：
> - Google 登录已修复（移动端改用 `signInWithRedirect`）
> - 登录默认改为**邮箱验证码**（无需 Firebase，走 Resend + HMAC 无状态验证）
> - Firebase 密钥已从 `vercel.json` 迁出到 Vercel Dashboard 加密环境变量（不再明文）
> - 全站 i18n 回退已统一为 **en 优先于 zh**
> 详见下方历史记录。

**日期**: 2026-05-22 16:45 ICT  
**状态**: Google 登录功能调试中  
**交接人**: QClaw  
**项目路径**: `C:\Users\user\.qclaw\astrology-clean\`

---

## 📋 项目概况

| 项目 | 信息 |
|------|------|
| **生产URL** | https://lunaxstar.com |
| **技术栈** | Next.js 15.5.14 + Firebase + astronomy-engine 2.1.19 |
| **部署平台** | Vercel (自动部署 from main branch) |
| **Firebase项目** | astrology-f32f2 |
| **域名注册商** | 阿里云 (lunaxstar.com, 到期 2027-05-19) |

---

## 🐛 当前问题：Google 登录功能不正常

### 问题描述
用户点击"使用Google登录"后：
- ❌ 电脑端：可能卡在登录页不跳转
- ❌ 手机端：可能弹窗被拦截，无反应

### 已添加的调试日志
**目的**: 让测试者在 Console 里看到具体哪一步失败

#### 1. `src/app/login/page.tsx` - `handleGoogleLogin`
```typescript
const handleGoogleLogin = async () => {
  setError('');
  setGoogleLoading(true);
  try {
    console.log('[LoginPage] Calling loginWithGoogle with language:', validLang);
    const result = await loginWithGoogle(validLang);
    console.log('[LoginPage] loginWithGoogle returned:', result);
    if (result.success) {
      console.log('[LoginPage] Success! Pushing to /');
      router.push('/');
    } else {
      console.error('[LoginPage] Failed:', result.error);
      setError(result.error || 'Google登录失败');
    }
  } catch (err: any) {
    console.error('[LoginPage] Exception during Google login:', err);
    setError(err.message || 'Google登录失败');
  } finally {
    setGoogleLoading(false);
  }
};
```

#### 2. `src/contexts/AuthContext.tsx` - `loginWithGoogleFn`
```typescript
const loginWithGoogleFn = async (language: string = "zh") => {
  console.log('[AuthContext] loginWithGoogleFn called, isFirebaseConfigured:', isFirebaseConfigured);
  if (isFirebaseConfigured) {
    try {
      console.log('[AuthContext] Calling firebase.loginWithGoogle with language:', language);
      const fp = await loginWithGoogle(language as "id" | "en" | "zh");
      console.log('[AuthContext] firebase.loginWithGoogle returned:', fp ? 'UserProfile' : 'null');
      const local = toLocalProfile(fp as FirebaseUserProfile);
      console.log('[AuthContext] Setting user:', local.email);
      setUser(local);
      setProfile(local);
      return { success: true };
    } catch (err: any) {
      console.error('[AuthContext] loginWithGoogleFn error:', err);
      return { success: false, error: err.message || "Google login failed" };
    }
  }
  // ... fallback
};
```

#### 3. `src/lib/firebase.ts` - `onAuthChange`
```typescript
export function onAuthChange(callback: (user: any) => void): () => void {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, (user) => {
    console.log('[firebase.ts] onAuthStateChanged fired, user:', user ? user.uid : null);
    callback(user);
  });
}
```

---

## ✅ 已修复的问题

### 1. Vercel 环境变量 BOM Bug (2026-05-22 11:22)
**问题**: Firebase Auth iframe URL 包含隐藏的 UTF-8 BOM 字符 (`%EF%BB%BF`)  
**根因**: Vercel Dashboard 手动输入环境变量时引入 BOM  
**修复**: 在 `src/lib/firebase.ts` 添加 `cleanEnv()` 函数清理所有环境变量  
**状态**: ✅ 已修复并部署

### 2. `loginWithGoogle` 返回值处理错误 (2026-05-22 15:10)
**问题**: `login/page.tsx` 错误检查 `result.success`，但 `loginWithGoogle` 返回的是 `UserProfile`  
**修复**: 改为正确检查返回值，成功则 `router.push('/')`  
**状态**: ✅ 已修复并部署

### 3. 首页翻译缺失5语言 (2026-05-21 17:42)
**问题**: `src/app/page.tsx` 只有 zh/en/id，缺少 th/vi/ms/ja/ko  
**修复**: 子代理补全所有翻译对象  
**状态**: ✅ 已修复并部署

---

## 🔍 待排查的可能原因

### 假设1: 手机端弹窗被拦截
**现象**: 手机浏览器拦截 `signInWithPopup()`  
**修复方案**: 检测移动端，改用 `signInWithRedirect()`  
**状态**: ⏳ 代码中已添加 `isMobile` 检测，但未部署（见下方"待部署修复"）

### 假设2: `onAuthStateChanged` 未触发
**现象**: 用户登录成功，但 `AuthContext` 未更新 `user` 状态  
**排查方法**: 检查 Console 里是否有 `[firebase.ts] onAuthStateChanged fired` 日志  
**状态**: ⏳ 待测试者验证

### 假设3: Firebase 配置问题
**检查清单**:
- ✅ Firebase Console → Authentication → Authorized domains 包含 `lunaxstar.com`
- ✅ Google Cloud Console → OAuth 客户端 → JavaScript 来源包含 `https://lunaxstar.com`
- ⏳ 检查 Firebase 项目是否正确关联 Google Cloud OAuth 客户端

---

## 📝 待部署修复 (如果存在)

### 修复1: 移动端改用 redirect 模式
**文件**: `src/lib/firebase.ts`  
**修改内容**:
```typescript
export async function loginWithGoogle(language: "zh" | "en" | "id" = "zh") {
  if (!auth || !provider) throw new Error("Firebase not configured");
  
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  if (isMobile) {
    // 移动端：使用 redirect（弹窗会被拦截）
    await setPersistence(auth, browserLocalPersistence);
    await signInWithRedirect(auth, provider);
    return null; // redirect 会刷新页面，不会返回 user
  } else {
    // 电脑端：使用 popup（体验更好）
    const result = await signInWithPopup(auth, provider);
    // ... 处理 user profile
    return fp;
  }
}
```
**状态**: ⚠️ 已修改但未部署（需要测试者确认是否需要）

---

## 🧪 测试步骤

### 电脑端测试
1. 打开 `https://lunaxstar.com/login`
2. 按 `F12` 打开 DevTools，切换到 **Console** 标签
3. 点击"使用Google登录"
4. 选择 Google 账号
5. **观察 Console 日志**，截图发给我
   - 应该看到 `[LoginPage] Calling loginWithGoogle...`
   - 然后 `[AuthContext] loginWithGoogleFn called...`
   - 然后 `[firebase.ts] onAuthStateChanged fired...`
   - 最后 `[LoginPage] Success! Pushing to /`

### 手机端测试
1. 手机浏览器打开 `https://lunaxstar.com/login`
2. 点击"使用Google登录"
3. 观察是否跳转到 Google 登录页
4. 选择账号后，是否跳回网站并登录成功

---

## 📂 关键文件清单

| 文件 | 用途 | 状态 |
|------|------|------|
| `src/app/login/page.tsx` | 登录页面 UI + `handleGoogleLogin` | ✅ 已添加调试日志 |
| `src/contexts/AuthContext.tsx` | Firebase Auth 状态管理 | ✅ 已添加调试日志 |
| `src/lib/firebase.ts` | Firebase 初始化 + `loginWithGoogle` | ✅ BOM 清理已添加 |
| `src/app/layout.tsx` | 根布局，`AuthProvider` 包裹 | ✅ 正常 |
| `src/app/page.tsx` | 首页，显示登录状态 | ✅ 翻译已补全 |
| `.env.local` | 本地环境变量（Firebase 配置） | ⚠️ 检查是否缺少变量 |
| Vercel Dashboard | 线上环境变量 | ⚠️ 检查是否有 BOM |

---

## 🔑 环境变量清单

**必须配置的变量** (Vercel Dashboard + `.env.local`):
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD7Dd5YkTUSsP6Kxexxw8SA5J1r7P8Q_w
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=astrology-f32f2.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=astrology-f32f2
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=astrology-f32f2.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1035645867773
NEXT_PUBLIC_FIREBASE_APP_ID=1:1035645867773:web:8e6c44e0c2e5a8c7f3b2d
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-7WXQJQ7XQF
```

**检查方法**:
```powershell
# 本地检查
cd C:\Users\user\.qclaw\astrology-clean
Get-Content .env.local

# Vercel 检查（需要 Vercel CLI）
vercel env ls
```

---

## 🚀 部署命令

```powershell
cd C:\Users\user\.qclaw\astrology-clean
npx vercel --prod --yes
```

**注意**: PowerShell 会报 `exit code 1`，但实际部署成功，忽略即可。

---

## 📌 下一步行动

### 对于测试者（另一个 Agent）
1. **电脑端测试**: 按照"测试步骤"操作，截图 Console 日志
2. **分析日志**: 看哪一步缺少日志，定位问题
3. **修复问题**: 根据日志提示修改代码
4. **部署验证**: 部署后再次测试，确认修复

### 对于原开发者（你）
1. 等待测试者反馈 Console 日志
2. 根据日志定位问题
3. 继续修复或提供指导

---

## 📚 相关文档

| 文档 | 位置 |
|------|------|
| 项目记忆节点 | `memory/condensed-2026-05-21.md` |
| 工作日志 | `memory/2026-05-22.md` |
| Firebase 调试日志 | `src/lib/firebase.ts` (搜索 `console.log`) |
| AuthContext 调试日志 | `src/contexts/AuthContext.tsx` (搜索 `console.log`) |

---

## 💡 经验总结

1. **Vercel 环境变量 BOM 问题**: 手动输入时可能引入隐藏字符，代码层面做防御性清理
2. **移动端 popup 被拦截**: 需要用 `signInWithRedirect()` 替代 `signInWithPopup()`
3. **Next.js 15 metadata**: 必须在 Server Component 定义，与 `"use client"` 不兼容
4. **PowerShell 中文编码**: 必须用 Python 脚本写入文件，不能直接用 `write` 工具

---

**交接完成！** 测试者可以按"测试步骤"开始排查。如有问题，参考"关键文件清单"和"环境变量清单"。
