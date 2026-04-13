"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { 
  ArrowLeft, User, Settings, Heart, History, FileText, 
  Bell, Shield, ChevronRight, LogOut, Edit3, Camera,
  Star, Calendar, Sparkles
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  zodiac: string;
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  memberSince: string;
  readingsCount: number;
  savedCharts: number;
  subscription: "free" | "premium";
}

const TRANSLATIONS: Record<string, Record<string, string>> = {
  zh: {
    title: "个人中心",
    editProfile: "编辑资料",
    settings: "设置",
    myCharts: "我的星盘",
    savedReadings: "保存的解读",
    favorites: "收藏",
    notifications: "通知",
    privacy: "隐私安全",
    logout: "退出登录",
    memberSince: "加入时间",
    readings: "次解读",
    charts: "个星盘",
    freePlan: "免费版",
    premiumPlan: "高级版",
    upgrade: "升级",
    account: "账户",
    preferences: "偏好设置",
    language: "语言",
    theme: "主题",
    data: "数据管理",
    export: "导出数据",
    delete: "删除账户",
  },
  en: {
    title: "Profile",
    editProfile: "Edit Profile",
    settings: "Settings",
    myCharts: "My Charts",
    savedReadings: "Saved Readings",
    favorites: "Favorites",
    notifications: "Notifications",
    privacy: "Privacy & Security",
    logout: "Logout",
    memberSince: "Member since",
    readings: "readings",
    charts: "charts",
    freePlan: "Free Plan",
    premiumPlan: "Premium",
    upgrade: "Upgrade",
    account: "Account",
    preferences: "Preferences",
    language: "Language",
    theme: "Theme",
    data: "Data Management",
    export: "Export Data",
    delete: "Delete Account",
  },
  id: {
    title: "Profil",
    editProfile: "Edit Profil",
    settings: "Pengaturan",
    myCharts: "Chart Saya",
    savedReadings: "Bacaan Tersimpan",
    favorites: "Favorit",
    notifications: "Notifikasi",
    privacy: "Privasi & Keamanan",
    logout: "Keluar",
    memberSince: "Anggota sejak",
    readings: "bacaan",
    charts: "chart",
    freePlan: "Gratis",
    premiumPlan: "Premium",
    upgrade: "Upgrade",
    account: "Akun",
    preferences: "Preferensi",
    language: "Bahasa",
    theme: "Tema",
    data: "Manajemen Data",
    export: "Ekspor Data",
    delete: "Hapus Akun",
  },
};

const ZODIAC_SIGNS: { id: string; symbol: string; name: Record<string, string> }[] = [
  { id: "aries", symbol: "♈", name: { zh: "白羊座", en: "Aries", id: "Aries", th: "แกะ", vi: "Bạch Dương", ms: "Aries", ja: "牡羊座", ko: "양자리" } },
  { id: "taurus", symbol: "♉", name: { zh: "金牛座", en: "Taurus", id: "Taurus", th: "พฤกษกร", vi: "Kim Ngưu", ms: "Taurus", ja: "牡牛座", ko: "황소자리" } },
  { id: "gemini", symbol: "♊", name: { zh: "双子座", en: "Gemini", id: "Gemini", th: "มิถุน", vi: "Song Tử", ms: "Gemini", ja: "双子座", ko: "쌍둥이자리" } },
  { id: "cancer", symbol: "♋", name: { zh: "巨蟹座", en: "Cancer", id: "Cancer", th: "กรกฎ", vi: "Cự Giải", ms: "Cancer", ja: "蟹座", ko: "게자리" } },
  { id: "leo", symbol: "♌", name: { zh: "狮子座", en: "Leo", id: "Leo", th: "สิงห์", vi: "Sư Tử", ms: "Leo", ja: "獅子座", ko: "사자자리" } },
  { id: "virgo", symbol: "♍", name: { zh: "处女座", en: "Virgo", id: "Virgo", th: "กันย์", vi: "Xử Nữ", ms: "Virgo", ja: "乙女座", ko: "처녀자리" } },
  { id: "libra", symbol: "♎", name: { zh: "天秤座", en: "Libra", id: "Libra", th: "ตุลย์", vi: "Thiên Bình", ms: "Libra", ja: "天秤座", ko: "천칭자리" } },
  { id: "scorpio", symbol: "♏", name: { zh: "天蝎座", en: "Scorpio", id: "Scorpio", th: "พิจิก", vi: "Bọ Cạp", ms: "Scorpio", ja: "蠍座", ko: "전갈자리" } },
  { id: "sagittarius", symbol: "♐", name: { zh: "射手座", en: "Sagittarius", id: "Sagittarius", th: "ธนู", vi: "Nhân Mã", ms: "Sagittarius", ja: "射手座", ko: "人马자리" } },
  { id: "capricorn", symbol: "♑", name: { zh: "摩羯座", en: "Capricorn", id: "Capricorn", th: "มังกร", vi: "Ma Kết", ms: "Capricorn", ja: "山羊座", ko: "염소자리" } },
  { id: "aquarius", symbol: "♒", name: { zh: "水瓶座", en: "Aquarius", id: "Aquarius", th: "กุมภ์", vi: "Bảo Bình", ms: "Aquarius", ja: "水瓶座", ko: "물병자리" } },
  { id: "pisces", symbol: "♓", name: { zh: "双鱼座", en: "Pisces", id: "Pisces", th: "มีน", vi: "Song Ngư", ms: "Pisces", ja: "魚座", ko: "물고기자리" } },
];

export default function ProfilePage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  
  const [profile, setProfile] = useState<UserProfile>({
    name: "占星爱好者",
    email: "user@example.com",
    avatar: "",
    zodiac: "leo",
    birthDate: "1995-08-15",
    birthTime: "14:30",
    birthLocation: "北京",
    memberSince: "2026-01-15",
    readingsCount: 23,
    savedCharts: 5,
    subscription: "free",
  });
  
  const [activeTab, setActiveTab] = useState<"overview" | "settings">("overview");

  const menuItems = [
    { id: "charts", icon: Star, label: t.myCharts, href: "/natal", count: profile.savedCharts },
    { id: "readings", icon: FileText, label: t.savedReadings, href: "/ai-reading", count: 12 },
    { id: "favorites", icon: Heart, label: t.favorites, href: "#", count: 8 },
    { id: "notifications", icon: Bell, label: t.notifications, href: "#" },
    { id: "privacy", icon: Shield, label: t.privacy, href: "#" },
  ];

  const getZodiacInfo = (zodiacId: string) => {
    return ZODIAC_SIGNS.find((z) => z.id === zodiacId) || ZODIAC_SIGNS[0];
  };

  const zodiacInfo = getZodiacInfo(profile.zodiac);

  return (
    <div className="min-h-screen bg-[#030014]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#030014]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold gradient-text">{t.title}</h1>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl p-6 md:p-8 border border-purple-500/20 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl md:text-5xl">
                {profile.avatar || "✨"}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            
            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-1">{profile.name}</h2>
              <p className="text-gray-400 mb-3">{profile.email}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 text-sm">
                  {zodiacInfo.symbol} {zodiacInfo.name[language]}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  profile.subscription === "premium" 
                    ? "bg-amber-500/20 text-amber-300" 
                    : "bg-gray-500/20 text-gray-300"
                }`}>
                  {profile.subscription === "premium" ? t.premiumPlan : t.freePlan}
                </span>
                {profile.subscription === "free" && (
                  <button className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-white text-sm font-medium hover:from-amber-400 hover:to-orange-400 transition-colors">
                    {t.upgrade}
                  </button>
                )}
              </div>
            </div>
            
            {/* Edit Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors">
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">{t.editProfile}</span>
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{profile.readingsCount}</div>
              <div className="text-sm text-gray-400">{t.readings}</div>
            </div>
            <div className="text-center border-x border-white/10">
              <div className="text-2xl font-bold text-white">{profile.savedCharts}</div>
              <div className="text-sm text-gray-400">{t.charts}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {new Date(profile.memberSince).getFullYear()}
              </div>
              <div className="text-sm text-gray-400">{t.memberSince}</div>
            </div>
          </div>
        </div>

        {/* Birth Info */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            {language === "zh" ? "出生信息" : language === "id" ? "Info Kelahiran" : "Birth Info"}
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">
                {language === "zh" ? "出生日期" : language === "id" ? "Tanggal Lahir" : "Birth Date"}
              </div>
              <div className="text-white">{profile.birthDate}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">
                {language === "zh" ? "出生时间" : language === "id" ? "Waktu Lahir" : "Birth Time"}
              </div>
              <div className="text-white">{profile.birthTime}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">
                {language === "zh" ? "出生地点" : language === "id" ? "Lokasi Lahir" : "Birth Location"}
              </div>
              <div className="text-white">{profile.birthLocation}</div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                  <item.icon className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-white font-medium">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.count !== undefined && (
                  <span className="px-2 py-1 bg-white/10 rounded-full text-sm text-gray-400">
                    {item.count}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </div>
            </Link>
          ))}
        </div>

        {/* Logout */}
        <button className="w-full mt-6 flex items-center justify-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-colors">
          <LogOut className="w-5 h-5" />
          <span>{t.logout}</span>
        </button>
      </div>
    </div>
  );
}
