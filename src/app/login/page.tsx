"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Star, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        // 注册逻辑
        await login(formData.email, formData.password, formData.name);
      }
      router.push('/');
    } catch (err: any) {
      setError(err.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  const texts: Record<string, Record<string, string>> = {
    zh: {
      login: '登录',
      register: '注册',
      email: '邮箱',
      password: '密码',
      name: '昵称',
      submit: '提交',
      noAccount: '还没有账号？',
      hasAccount: '已有账号？',
      welcome: '欢迎来到星缘',
      subtitle: '探索你的星座命运'
    },
    en: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      submit: 'Submit',
      noAccount: 'No account?',
      hasAccount: 'Have account?',
      welcome: 'Welcome to Starry Fate',
      subtitle: 'Explore your zodiac destiny'
    },
    id: {
      login: 'Masuk',
      register: 'Daftar',
      email: 'Email',
      password: 'Kata Sandi',
      name: 'Nama',
      submit: 'Kirim',
      noAccount: 'Belum punya akun?',
      hasAccount: 'Sudah punya akun?',
      welcome: 'Selamat datang di Xingyuan',
      subtitle: 'Jelajahi takdir zodiakmu'
    },
    th: {
      login: 'เข้าสู่ระบบ',
      register: 'ลงทะเบียน',
      email: 'อีเมล',
      password: 'รหัสผ่าน',
      name: 'ชื่อ',
      submit: 'ส่ง',
      noAccount: 'ยังไม่มีบัญชี?',
      hasAccount: 'มีบัญชีอยู่แล้ว?',
      welcome: 'ยินดีต้อนรับสู่ดูดวง',
      subtitle: 'สำรวจโชคชะตาของคุณ'
    },
    vi: {
      login: 'Đăng nhập',
      register: 'Đăng ký',
      email: 'Email',
      password: 'Mật khẩu',
      name: 'Tên',
      submit: 'Gửi',
      noAccount: 'Chưa có tài khoản?',
      hasAccount: 'Đã có tài khoản?',
      welcome: 'Chào mừng đến với Xem Tử Vi',
      subtitle: 'Khám phá vận mệnh của bạn'
    },
    ms: {
      login: 'Log Masuk',
      register: 'Daftar',
      email: 'E-mel',
      password: 'Kata Laluan',
      name: 'Nama',
      submit: 'Hantar',
      noAccount: ' belum ada akaun?',
      hasAccount: 'Sudah ada akaun?',
      welcome: 'Selamat datang di Xingyuan',
      subtitle: 'Terokai takdir zodiak anda'
    },
    ja: {
      login: 'ログイン',
      register: '登録',
      email: 'メール',
      password: 'パスワード',
      name: '名前',
      submit: '送信',
      noAccount: 'アカウントをお持ちでない方?',
      hasAccount: 'すでにアカウントはお持ちですか?',
      welcome: '星読みへようこそ',
      subtitle: 'あなたの運命を探る'
    },
    ko: {
      login: '로그인',
      register: '회원가입',
      email: '이메일',
      password: '비밀번호',
      name: '이름',
      submit: '제출',
      noAccount: '계정이 없으신가요?',
      hasAccount: '이미 계정이 있으신가요?',
      welcome: '별점보기에 오신 것을 환영합니다',
      subtitle: '당신의 운명을 탐구하세요'
    },
  };

  const text = texts[language] || texts.zh;

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* 返回按钮 */}
        <Link href="/" className="absolute -top-16 left-0 flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
          <span>{language === 'zh' ? '返回首页' : language === 'en' ? 'Back' : 'Kembali'}</span>
        </Link>

        {/* 语言切换 */}
        <div className="absolute -top-16 right-0 flex gap-2">
          {['zh', 'en', 'id'].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang as 'zh' | 'en' | 'id')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                language === lang
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {lang === 'zh' ? '中文' : lang === 'en' ? 'EN' : 'ID'}
            </button>
          ))}
        </div>

        {/* 主卡片 */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star size={32} className="text-white fill-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {text.welcome}
            </h1>
            <p className="text-slate-400 text-sm mt-2">{text.subtitle}</p>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm text-slate-400 mb-2">{text.name}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder={text.name}
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-slate-400 mb-2">{text.email}</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder={text.email}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">{text.password}</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-12 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder={text.password}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-bold text-white hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/30"
            >
              {loading ? '...' : isLogin ? text.login : text.register}
            </button>
          </form>

          {/* 切换登录/注册 */}
          <div className="mt-6 text-center">
            <span className="text-slate-400 text-sm">
              {isLogin ? text.noAccount : text.hasAccount}
            </span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors"
            >
              {isLogin ? text.register : text.login}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
