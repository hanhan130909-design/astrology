# 🌟 星缘占星 - 部署指南

## 快速部署

### 方法 1: 一键部署（推荐）

1. **双击运行** `deploy.bat`
2. 首次运行需要：
   - 打开浏览器登录 Vercel（邮箱：`hanhan130909@gmail.com`）
   - 登录后回到终端按回车继续

### 方法 2: 手动命令

打开终端运行：

```powershell
cd C:\Users\user\.qclaw\workspace\astrology-main

# 设置 Node.js 路径
$env:Path = "C:\Program Files\nodejs;$env:Path"

# 安装依赖并部署
npm install
npx vercel --prod
```

## 已完成的功能

✅ 三语言切换（印尼语、英语、中文）
✅ 十二星座主页
✅ 专业星盘（10大行星、12宫位）
✅ 每日运势
✅ 星座配对
✅ 社区页面
✅ VIP 付费功能

## 技术栈

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Vercel 部署

## 部署后配置

1. **绑定域名**（可选）：在 Vercel 控制台设置
2. **支付接口**：配置 Midtrans（印尼）或 Stripe（欧美）
3. **环境变量**：根据需要设置

---

**运行 `deploy.bat` 开始部署！**