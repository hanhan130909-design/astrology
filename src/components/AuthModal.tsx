"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

type AuthMode = "login" | "register";

export function AuthModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { signIn, signUp, isConfigured } = useAuth();
  const { language } = useLanguage();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
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
    firebaseNotConfigured: { zh: "用户系统未配置", id: "Sistem pengguna tidak dikonfigurasi", en: "User system not configured" }
  };

  const g = (obj: Record<string, string>) => obj[language] || obj.zh;

  if (!isOpen) return null;

  if (!isConfigured) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-100 rounded-2xl p-6 max-w-sm w-full">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            ⚠️ {g(t.firebaseNotConfigured)}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm text-center mb-4">
            Firebase 配置缺失，用户系统暂不可用。请联系管理员。
          </p>
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-200 dark:bg-gray-100 rounded-lg text-gray-700 dark:text-gray-700"
          >
            {g(t.continueAsGuest)}
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === "login") {
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
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-center">
          <div className="text-4xl mb-2">✨</div>
          <h2 className="text-xl font-bold text-white">{g(t.title)}</h2>
          <p className="text-indigo-200 text-sm mt-1">{g(t.subtitle)}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-700 mb-1">
                {g(t.displayName)}
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-100 dark:text-white text-gray-900 bg-white"
                placeholder={language === "zh" ? "您的昵称" : "Your name"}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-700 mb-1">
              {g(t.email)}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-100 dark:text-white text-gray-900 bg-white"
              placeholder="email@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-700 mb-1">
              {g(t.password)}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-100 dark:text-white text-gray-900 bg-white"
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
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50"
          >
            {isLoading ? "..." : mode === "login" ? g(t.login) : g(t.register)}
          </button>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {mode === "login" ? g(t.noAccount) : g(t.hasAccount)}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError(null);
              }}
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              {mode === "login" ? g(t.toRegister) : g(t.toLogin)}
            </button>
          </p>

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

  const g = (obj: Record<string, string>) => obj[language] || obj.zh;

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
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
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
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
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
