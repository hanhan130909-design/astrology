"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

type AuthMode = "login" | "register" | "emailCode";

export function AuthModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { signIn, signUp, sendEmailCode, verifyEmailCode, isConfigured } = useAuth();
  const { language } = useLanguage();
  const [mode, setMode] = useState<AuthMode>("emailCode");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = {
    login: { zh: "登录", id: "Masuk", en: "Login" },
    register: { zh: "注册", id: "Daftar", en: "Register" },
    email: { zh: "邮箱", id: "Email", en: "Email" },
    password: { zh: "密码", id: "Kata Sandi", en: "Password" },
    displayName: { zh: "昵称", id: "Nama Tampilan", en: "Display Name" },
    noAccount: { zh: "没有账号？", id: "Belum punya akun?", en: "No account?" },
    hasAccount: { zh: "已有账号？", id: "Sudah punya akun?", en: "Have an account?" },
    toRegister: { zh: "去注册", id: "Daftar", en: "Register" },
    toLogin: { zh: "去登录", id: "Masuk", en: "Login" },
    or: { zh: "或", id: "atau", en: "or" },
    continueAsGuest: { zh: "游客模式继续", id: "Lanjut sebagai Tamu", en: "Continue as Guest" },
    title: { zh: "欢迎来到星缘占星", id: "Selamat Datang di Bintang Jodoh", en: "Welcome to Aztrology" },
    subtitle: { zh: "登录以保存您的星盘和设置", id: "Masuk untuk menyimpan bagan Anda", en: "Login to save your charts and settings" },
    passwordHint: { zh: "至少6位密码", id: "Minimal 6 karakter", en: "At least 6 characters" },
    firebaseNotConfigured: { zh: "用户系统未配置", id: "Sistem pengguna tidak dikonfigurasi", en: "User system not configured" },
    emailCode: { zh: "邮箱验证码登录", en: "Email Code Login", id: "Login Kode Email" },
    sendCode: { zh: "发送验证码", en: "Send Code", id: "Kirim Kode" },
    verifyCode: { zh: "验证并登录", en: "Verify & Login", id: "Verifikasi & Masuk" },
    enterCode: { zh: "输入6位验证码", en: "Enter 6-digit code", id: "Masukkan 6 digit kode" },
    codeSent: { zh: "验证码已发送", en: "Code sent!", id: "Kode terkirim!" },
    resendCode: { zh: "重新发送", en: "Resend", id: "Kirim ulang" },
    emailCodeSubtitle: { zh: "无需密码，输入邮箱即可", en: "No password needed — just your email", id: "Tanpa kata sandi — cukup email Anda" },
    needPassword: { zh: "使用密码登录", en: "Login with password", id: "Login dengan kata sandi" },
    needEmailCode: { zh: "使用邮箱验证码", en: "Use email code", id: "Gunakan kode email" },
  };

  const g = (obj: Record<string, string>) => obj[language] || obj.en;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === "emailCode") {
        // Email verification code flow
        if (!codeSent) {
          const result = await sendEmailCode(email);
          if (result.success) {
            setCodeSent(true);
          } else {
            setError(result.error || "Failed to send code");
          }
        } else {
          const result = await verifyEmailCode(email, code);
          if (result.success) {
            onSuccess?.();
            onClose();
          } else {
            setError(result.error || "Invalid code");
          }
        }
      } else if (mode === "login") {
        const result = await signIn(email, password);
        if (result.success) {
          onSuccess?.();
          onClose();
        } else {
          setError(result.error || "Unknown error");
        }
      } else {
        if (!displayName.trim()) {
          setError(language === "zh" ? "请输入昵称" : "Please enter display name");
          setIsLoading(false);
          return;
        }
        const result = await signUp(email, password, displayName);
        if (result.success) {
          onSuccess?.();
          onClose();
        } else {
          setError(result.error || "Unknown error");
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-100 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-600 to-gray-600 px-6 py-8 text-center">
          <div className="text-4xl mb-2">{mode === "emailCode" ? "📧" : "✨"}</div>
          <h2 className="text-xl font-bold text-white">
            {mode === "emailCode" ? g(t.emailCode) : g(t.title)}
          </h2>
          <p className="text-gray-200 text-sm mt-1">
            {mode === "emailCode" ? g(t.emailCodeSubtitle) : g(t.subtitle)}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-gray-50 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-700 mb-1">
              {g(t.email)}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setCodeSent(false); }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-gray-100 dark:text-white text-gray-900 bg-white"
              placeholder="email@example.com"
              required
            />
          </div>

          {mode === "emailCode" ? (
            <>
              {codeSent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-700 mb-1">
                    {g(t.enterCode)}
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-gray-100 dark:text-white text-gray-900 bg-white tracking-[8px] text-center text-lg"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-gray-600 to-gray-600 text-white font-medium rounded-lg hover:from-gray-700 hover:to-gray-700 transition disabled:opacity-50"
              >
                {isLoading ? "..." : codeSent ? g(t.verifyCode) : g(t.sendCode)}
              </button>
              {codeSent && (
                <button
                  type="button"
                  onClick={async () => {
                    setCodeSent(false);
                    setCode("");
                    setError(null);
                    const result = await sendEmailCode(email);
                    if (result.success) setCodeSent(true);
                    else setError(result.error || "Failed");
                  }}
                  className="w-full text-xs text-gray-400 hover:text-gray-600 underline"
                >
                  {g(t.resendCode)}
                </button>
              )}
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-700 mb-1">
                  {g(t.password)}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-gray-100 dark:text-white text-gray-900 bg-white"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
                {mode === "register" && (
                  <p className="text-xs text-gray-500 mt-1">{g(t.passwordHint)}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-gray-600 to-gray-600 text-white font-medium rounded-lg hover:from-gray-700 hover:to-gray-700 transition disabled:opacity-50"
              >
                {isLoading ? "..." : mode === "login" ? g(t.login) : g(t.register)}
              </button>
            </>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          {mode === "emailCode" ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <button
                type="button"
                onClick={() => { setMode("login"); setCodeSent(false); setCode(""); setError(null); }}
                className="text-gray-600 dark:text-gray-400 font-medium hover:underline"
              >
                {g(t.needPassword)}
              </button>
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {mode === "login" ? g(t.noAccount) : g(t.hasAccount)}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "login" ? "register" : "login");
                    setError(null);
                  }}
                  className="text-gray-600 dark:text-gray-400 font-medium hover:underline"
                >
                  {mode === "login" ? g(t.toRegister) : g(t.toLogin)}
                </button>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                <button
                  type="button"
                  onClick={() => { setMode("emailCode"); setError(null); }}
                  className="text-gray-400 hover:text-gray-600 underline"
                >
                  {g(t.needEmailCode)}
                </button>
              </p>
            </>
          )}

          <div className="mt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-700"
            >
              {g(t.continueAsGuest)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 用户菜单组件
export function UserMenu() {
  const { user, profile, signOut, isConfigured } = useAuth();
  const { language } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);

  const t = {
    login: { zh: "登录", id: "Masuk", en: "Login" },
    myCharts: { zh: "我的星盘", id: "Bagan Saya", en: "My Charts" },
    settings: { zh: "设置", id: "Pengaturan", en: "Settings" },
    logout: { zh: "退出", id: "Keluar", en: "Logout" }
  };

  const g = (obj: Record<string, string>) => obj[language] || obj.en;

  if (!isConfigured) {
    return null;
  }

  if (!user) {
    return null; // 由父组件处理登录按钮显示
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-900/30 hover:bg-gray-200 dark:hover:bg-gray-900/50 transition"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-500 to-gray-500 flex items-center justify-center text-white font-bold">
          {(profile?.displayName || user.email || "U").charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-700 hidden sm:block">
          {profile?.displayName || user.email?.split("@")[0]}
        </span>
      </button>

      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-100 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <p className="font-medium text-gray-900 dark:text-white truncate">
                {profile?.displayName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <div className="p-2">
              <a
                href="/my-charts"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-100 rounded"
              >
                📊 {g(t.myCharts)}
              </a>
              <a
                href="/settings"
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-100 rounded"
              >
                ⚙️ {g(t.settings)}
              </a>
              <button
                onClick={() => {
                  signOut();
                  setShowDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900/20 rounded"
              >
                🚪 {g(t.logout)}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
