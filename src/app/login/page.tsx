"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Star, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, loginWithGoogle, sendEmailCode, verifyEmailCode } = useAuth();
  const { language } = useLanguage();

  const [authMethod, setAuthMethod] = useState<"emailCode" | "password">("emailCode");
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) router.push('/'); }, [user, router]);

  const t = (zh: string, en: string) => language === 'zh' ? zh : en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (authMethod === "emailCode") {
        if (!codeSent) {
          const result = await sendEmailCode(email);
          if (result.success) setCodeSent(true);
          else setError(result.error || t("发送验证码失败", "Failed to send code"));
        } else {
          const result = await verifyEmailCode(email, verificationCode);
          if (result.success) router.push('/');
          else setError(result.error || t("验证码错误", "Invalid code"));
        }
      } else if (isLogin) {
        await login(email, password);
        router.push('/');
      } else {
        await login(email, password, name);
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || t('登录失败', 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Star size={32} className="text-white fill-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t('欢迎来到星缘', 'Welcome to LunaX')}</h1>
          <p className="text-gray-500 text-sm mt-2">{t('探索你的星座命运', 'Discover your cosmic blueprint')}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-2">{t('邮箱', 'Email')}</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email" value={email}
                onChange={(e) => { setEmail(e.target.value); setCodeSent(false); }}
                className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
                placeholder="email@example.com" required
              />
            </div>
          </div>

          {authMethod === "emailCode" ? (
            <>
              {/* Email code mode — no password, no firewall issues */}
              {codeSent && (
                <div>
                  <label className="block text-sm text-gray-500 mb-2">{t('验证码', 'Verification Code')}</label>
                  <input
                    type="text" value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-center text-lg tracking-[8px] placeholder-gray-400 focus:outline-none focus:border-gray-500"
                    placeholder="000000" maxLength={6} required
                  />
                </div>
              )}
              <button type="submit" disabled={loading}
                className="w-full bg-gray-900 text-white rounded-xl py-3 font-medium hover:bg-gray-800 disabled:opacity-50">
                {loading ? "..." : codeSent ? t('验证并登录', 'Verify & Login') : t('发送验证码', 'Send Code')}
              </button>
              {codeSent && (
                <button type="button"
                  onClick={async () => {
                    setCodeSent(false); setVerificationCode(""); setError('');
                    const result = await sendEmailCode(email);
                    if (result.success) setCodeSent(true);
                    else setError(result.error || "Failed");
                  }}
                  className="w-full text-xs text-gray-400 hover:text-gray-600 underline">
                  {t('重新发送', 'Resend')}
                </button>
              )}
            </>
          ) : (
            <>
              {/* Password mode — needs Firebase, blocked in China */}
              {!isLogin && (
                <div>
                  <label className="block text-sm text-gray-500 mb-2">{t('昵称', 'Name')}</label>
                  <input type="text" value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500"
                    placeholder={t('您的昵称', 'Your name')} required />
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-500 mb-2">{t('密码', 'Password')}</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500"
                    placeholder="••••••••" minLength={6} required />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-gray-900 text-white rounded-xl py-3 font-medium hover:bg-gray-800 disabled:opacity-50">
                {loading ? "..." : isLogin ? t('登录', 'Login') : t('注册', 'Register')}
              </button>
            </>
          )}
        </form>

        {/* Mode switchers */}
        <div className="mt-4 text-center text-sm space-y-2">
          {authMethod === "emailCode" ? (
            <button onClick={() => setAuthMethod("password")} className="text-gray-400 hover:text-gray-600 underline">
              {t('使用密码登录', 'Login with password')}
            </button>
          ) : (
            <>
              <p>
                {isLogin ? t('还没有账号？', "Don't have an account?") : t('已有账号？', 'Already have an account?')}{' '}
                <button onClick={() => setIsLogin(!isLogin)} className="text-gray-600 font-medium hover:underline">
                  {isLogin ? t('去注册', 'Register') : t('去登录', 'Login')}
                </button>
              </p>
              <button onClick={() => setAuthMethod("emailCode")} className="text-gray-400 hover:text-gray-600 underline">
                {t('使用邮箱验证码', 'Use email code')}
              </button>
            </>
          )}
        </div>

        {/* Google login — for users outside China */}
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <button
            onClick={async () => {
              try {
                const result = await loginWithGoogle(language);
                if (result.success) router.push('/');
                else setError(result.error || 'Google login failed');
              } catch (err: any) {
                setError(err.message || 'Google login failed');
              }
            }}
            className="px-6 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors">
            {t('Google 登录', 'Sign in with Google')}
          </button>
          <p className="mt-2 text-[10px] text-gray-300">
            {t('国内用户请使用上方邮箱验证码登录', 'Users in China: use email code above')}
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
            ← {t('返回首页', 'Back to Home')}
          </Link>
        </div>
      </div>
    </div>
  );
}
