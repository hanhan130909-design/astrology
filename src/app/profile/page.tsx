"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, LogOut, Trash2, Upload, Calendar, MapPin,
  Loader2, User, Star, AlertCircle, ExternalLink
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { loadChartsFromCloud, deleteChartFromCloud, SavedChart } from "@/lib/chartSync";
import { getSavedCompositeCharts, deleteCompositeChartFromCloud, CompositeChart } from "@/lib/firebase";

// Translations for all 8 languages
const T: Record<string, Record<string, string>> = {
  zh: {
    back: "返回首页", title: "个人中心",
    welcome: "欢迎", myCharts: "我的星盘",
    loadChart: "加载星盘", deleteChart: "删除星盘",
    noCharts: "暂无保存的星盘",
    signOut: "退出登录",
    loginPrompt: "登录后查看和管理你的星盘",
    goLogin: "前往登录",
    loading: "加载中...",
    confirmDelete: "确定要删除这个星盘吗？",
    cancel: "取消", deleted: "已删除",
    saved: "保存于", chartName: "星盘名称",
    birthData: "出生信息", city: "城市",
    error: "加载失败", retry: "重试",
    compositeCharts: "我的合盘", noCompositeCharts: "暂无保存的合盘",
    loadComposite: "加载合盘", deleteComposite: "删除合盘",
    person1: "第一人", person2: "第二人", composite: "合盘",
    person1Short: "人1", person2Short: "人2",
  },
  en: {
    back: "Back to Home", title: "Profile",
    welcome: "Welcome", myCharts: "My Charts",
    loadChart: "Load Chart", deleteChart: "Delete Chart",
    noCharts: "No saved charts yet",
    signOut: "Sign Out",
    loginPrompt: "Sign in to view and manage your charts",
    goLogin: "Go to Login",
    loading: "Loading...",
    confirmDelete: "Are you sure you want to delete this chart?",
    cancel: "Cancel", deleted: "Deleted",
    saved: "Saved", chartName: "Chart Name",
    birthData: "Birth Info", city: "City",
    error: "Failed to load", retry: "Retry",
    compositeCharts: "My Composite Charts", noCompositeCharts: "No saved composite charts",
    loadComposite: "Load Chart", deleteComposite: "Delete Chart",
    person1: "Person 1", person2: "Person 2", composite: "Composite",
    person1Short: "P1", person2Short: "P2",
  },
  id: {
    back: "Kembali", title: "Profil",
    welcome: "Selamat datang", myCharts: "Bagan Saya",
    loadChart: "Muat Bagan", deleteChart: "Hapus Bagan",
    noCharts: "Belum ada bagan tersimpan",
    signOut: "Keluar",
    loginPrompt: "Masuk untuk melihat dan mengelola bagan Anda",
    goLogin: "Ke Login",
    loading: "Memuat...",
    confirmDelete: "Apakah Anda yakin ingin menghapus bagan ini?",
    cancel: "Batal", deleted: "Dihapus",
    saved: "Disimpan", chartName: "Nama Bagan",
    birthData: "Info Lahir", city: "Kota",
    error: "Gagal memuat", retry: "Coba Lagi",
    compositeCharts: "Bagan Komposit Saya", noCompositeCharts: "Belum ada bagan komposit",
    loadComposite: "Muat Bagan", deleteComposite: "Hapus Bagan",
    person1: "Orang 1", person2: "Orang 2", composite: "Komposit",
    person1Short: "O1", person2Short: "O2",
  },
  th: {
    back: "กลับหน้าแรก", title: "โปรไฟล์",
    welcome: "ยินดีต้อนรับ", myCharts: "แผนภูมิของฉัน",
    loadChart: "โหลดแผนภูมิ", deleteChart: "ลบแผนภูมิ",
    noCharts: "ยังไม่มีแผนภูมิที่บันทึก",
    signOut: "ออกจากระบบ",
    loginPrompt: "เข้าสู่ระบบเพื่อดูและจัดการแผนภูมิของคุณ",
    goLogin: "ไปหน้าเข้าสู่ระบบ",
    loading: "กำลังโหลด...",
    confirmDelete: "คุณแน่ใจหรือไม่ที่จะลบแผนภูมินี้?",
    cancel: "ยกเลิก", deleted: "ลบแล้ว",
    saved: "บันทึก", chartName: "ชื่อแผนภูมิ",
    birthData: "ข้อมูลเกิด", city: "เมือง",
    error: "โหลดไม่สำเร็จ", retry: "ลองอีกครั้ง",
    compositeCharts: "แผนภูมิคอมโพสิตของฉัน", noCompositeCharts: "ยังไม่มีแผนภูมิคอมโพสิต",
    loadComposite: "โหลดแผนภูมิ", deleteComposite: "ลบแผนภูมิ",
    person1: "คนที่ 1", person2: "คนที่ 2", composite: "คอมโพสิต",
    person1Short: "ค1", person2Short: "ค2",
  },
  vi: {
    back: "Về Trang Chủ", title: "Hồ Sơ",
    welcome: "Chào mừng", myCharts: "Biểu Đồ Của Tôi",
    loadChart: "Tải Biểu Đồ", deleteChart: "Xóa Biểu Đồ",
    noCharts: "Chưa có biểu đồ nào được lưu",
    signOut: "Đăng Xuất",
    loginPrompt: "Đăng nhập để xem và quản lý biểu đồ của bạn",
    goLogin: "Đến Đăng Nhập",
    loading: "Đang tải...",
    confirmDelete: "Bạn có chắc muốn xóa biểu đồ này?",
    cancel: "Hủy", deleted: "Đã xóa",
    saved: "Đã lưu", chartName: "Tên Biểu Đồ",
    birthData: "Thông tin sinh", city: "Thành phố",
    error: "Tải thất bại", retry: "Thử lại",
    compositeCharts: "Biểu Đồ Kết Hợp Của Tôi", noCompositeCharts: "Chưa có biểu đồ kết hợp",
    loadComposite: "Tải Biểu Đồ", deleteComposite: "Xóa Biểu Đồ",
    person1: "Người 1", person2: "Người 2", composite: "Kết Hợp",
    person1Short: "N1", person2Short: "N2",
  },
  ms: {
    back: "Kembali", title: "Profil",
    welcome: "Selamat datang", myCharts: "Bagan Saya",
    loadChart: "Muat Bagan", deleteChart: "Padam Bagan",
    noCharts: "Belum ada bagan disimpan",
    signOut: "Log Keluar",
    loginPrompt: "Log masuk untuk melihat dan menguruskan bagan anda",
    goLogin: "Ke Log Masuk",
    loading: "Memuatkan...",
    confirmDelete: "Adakah anda pasti mahu memadamkan bagan ini?",
    cancel: "Batal", deleted: "Dipadam",
    saved: "Disimpan", chartName: "Nama Bagan",
    birthData: "Maklumat Lahir", city: "Bandar",
    error: "Gagal memuat", retry: "Cuba lagi",
    compositeCharts: "Bagan Komposit Saya", noCompositeCharts: "Belum ada bagan komposit",
    loadComposite: "Muat Bagan", deleteComposite: "Padam Bagan",
    person1: "Orang 1", person2: "Orang 2", composite: "Komposit",
    person1Short: "O1", person2Short: "O2",
  },
  ja: {
    back: "ホームに戻る", title: "プロフィール",
    welcome: "ようこそ", myCharts: "マイチャート",
    loadChart: "チャートを読み込む", deleteChart: "チャートを削除",
    noCharts: "保存されたチャートはありません",
    signOut: "ログアウト",
    loginPrompt: "ログインしてチャートを表示・管理",
    goLogin: "ログインへ",
    loading: "読み込み中...",
    confirmDelete: "このチャートを削除してもよろしいですか？",
    cancel: "キャンセル", deleted: "削除しました",
    saved: "保存日", chartName: "チャート名",
    birthData: "出生情報", city: "都市",
    error: "読み込み失敗", retry: "再試行",
    compositeCharts: "マイ複合チャート", noCompositeCharts: "保存された複合チャートはありません",
    loadComposite: "チャートを読む", deleteComposite: "チャートを削除",
    person1: "一人目", person2: "二人目", composite: "複合",
    person1Short: "人1", person2Short: "人2",
  },
  ko: {
    back: "홈으로", title: "프로필",
    welcome: "환영합니다", myCharts: "내 차트",
    loadChart: "차트 불러오기", deleteChart: "차트 삭제",
    noCharts: "저장된 차트가 없습니다",
    signOut: "로그아웃",
    loginPrompt: "로그인하여 차트 확인 및 관리",
    goLogin: "로그인하기",
    loading: "로딩 중...",
    confirmDelete: "이 차트를 삭제하시겠습니까?",
    cancel: "취소", deleted: "삭제됨",
    saved: "저장일", chartName: "차트 이름",
    birthData: "출생 정보", city: "도시",
    error: "로딩 실패", retry: "다시 시도",
    compositeCharts: "내 합성 차트", noCompositeCharts: "저장된 합성 차트가 없습니다",
    loadComposite: "차트 불러오기", deleteComposite: "차트 삭제",
    person1: "첫 번째 사람", person2: "두 번째 사람", composite: "합성",
    person1Short: "1P", person2Short: "2P",
  },
};

function tx(key: string, lang: string): string {
  return (T[lang]?.[key]) || (T.zh?.[key]) || key;
}

function formatDate(ts: number, lang: string): string {
  const d = new Date(ts);
  const opts: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
  const locale = lang === "zh" ? "zh-CN" : lang === "id" ? "id-ID" : lang === "th" ? "th-TH" : lang === "vi" ? "vi-VN" : lang === "ms" ? "ms-MY" : lang === "ja" ? "ja-JP" : lang === "ko" ? "ko-KR" : "en-US";
  return d.toLocaleDateString(locale, opts);
}

function formatBirthDate(chart: SavedChart, lang: string): string {
  const { year, month, day, hour = 12, minute = 0 } = chart.birthData;
  const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")} ${timeStr}`;
}

export default function ProfilePage() {
  const { user, isLoading: authLoading, isFirebaseReady, logout } = useAuth();
  const router = useRouter();
  const [lang, setLang] = useState<string>("zh");
  const [charts, setCharts] = useState<SavedChart[]>([]);
  const [loadingCharts, setLoadingCharts] = useState(false);
  const [chartsError, setChartsError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteMsg, setDeleteMsg] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  // Composite chart state
  const [compositeCharts, setCompositeCharts] = useState<CompositeChart[]>([]);
  const [loadingComposite, setLoadingComposite] = useState(false);
  const [compositeError, setCompositeError] = useState<string | null>(null);
  const [deletingCompositeId, setDeletingCompositeId] = useState<string | null>(null);
  const [showCompositeConfirm, setShowCompositeConfirm] = useState<string | null>(null);

  // Sync language from LanguageContext
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language");
      if (saved && T[saved]) setLang(saved);
    }
  }, []);

  // Load charts when user is available
  useEffect(() => {
    if (!user || !isFirebaseReady) {
      setCharts([]);
      return;
    }
    setLoadingCharts(true);
    setChartsError(null);
    loadChartsFromCloud(user.uid)
      .then((data) => {
        setCharts(data);
        setLoadingCharts(false);
      })
      .catch((err) => {
        console.error("Failed to load charts:", err);
        setChartsError((T[lang]?.error) || "Failed to load");
        setLoadingCharts(false);
      });
  }, [user, isFirebaseReady, lang]);

  // Load composite charts when user is available
  useEffect(() => {
    if (!user || !isFirebaseReady) {
      setCompositeCharts([]);
      return;
    }
    setLoadingComposite(true);
    setCompositeError(null);
    getSavedCompositeCharts(20)
      .then((data) => {
        setCompositeCharts(data);
        setLoadingComposite(false);
      })
      .catch((err) => {
        console.error("Failed to load composite charts:", err);
        setCompositeError((T[lang]?.error) || "Failed to load");
        setLoadingComposite(false);
      });
  }, [user, isFirebaseReady, lang]);

  const handleLoadChart = (chart: SavedChart) => {
    // Use sessionStorage to pass chart data to natal page
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pending_chart", JSON.stringify(chart));
      router.push("/natal");
    }
  };

  const handleLoadCompositeChart = (composite: CompositeChart) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pending_composite", JSON.stringify(composite));
      router.push("/composite");
    }
  };

  const handleDeleteCompositeChart = async (chartId: string) => {
    if (!user) return;
    setDeletingCompositeId(chartId);
    setShowCompositeConfirm(null);
    try {
      await deleteCompositeChartFromCloud(chartId, user.uid);
      setCompositeCharts((prev) => prev.filter((c) => c.id !== chartId));
      setDeleteMsg(tx("deleted", lang));
      setTimeout(() => setDeleteMsg(null), 2000);
    } catch (err) {
      console.error("Failed to delete composite chart:", err);
      setCompositeError(tx("error", lang));
    } finally {
      setDeletingCompositeId(null);
    }
  };

  const handleDeleteChart = async (chartId: string) => {
    if (!user) return;
    setDeletingId(chartId);
    setShowConfirm(null);
    try {
      await deleteChartFromCloud(chartId, user.uid);
      setCharts((prev) => prev.filter((c) => c.id !== chartId));
      setDeleteMsg(tx("deleted", lang));
      setTimeout(() => setDeleteMsg(null), 2000);
    } catch (err) {
      console.error("Failed to delete chart:", err);
      setChartsError(tx("error", lang));
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (authLoading || !isFirebaseReady) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#030014] via-[#0f0f23] to-[#030014] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-purple-400 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">{tx("loading", lang)}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#030014] via-[#0f0f23] to-[#030014] flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-6">
          <div className="w-20 h-20 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-6">
            <User size={36} className="text-purple-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{tx("title", lang)}</h2>
          <p className="text-gray-500 text-sm mb-6">{tx("loginPrompt", lang)}</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-gray-900 font-medium text-sm transition-all"
          >
            <ExternalLink size={16} />
            {tx("goLogin", lang)}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030014] via-[#0f0f23] to-[#030014] text-gray-900">
      {/* Navigation Bar */}
      

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* User Info Card */}
        <div className="p-6 rounded-2xl bg-white/5 border border-gray-200">
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-16 h-16 rounded-full border-2 border-purple-500/50"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-2xl font-bold text-gray-900">
                {user.displayName?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-purple-400 mb-0.5">{tx("welcome", lang)}</p>
              <h2 className="text-lg font-bold text-gray-900 truncate">{user.displayName || user.email}</h2>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-red-500/10 border border-gray-200 hover:border-red-500/30 text-gray-600 hover:text-red-400 text-sm transition-all flex-shrink-0"
            >
              <LogOut size={16} />
              {tx("signOut", lang)}
            </button>
          </div>
        </div>

        {/* Charts Section */}
        <div className="p-6 rounded-2xl bg-white/5 border border-gray-200">
          <div className="flex items-center gap-2 mb-5">
            <Star size={18} className="text-purple-400" />
            <h3 className="font-bold text-gray-900">{tx("myCharts", lang)}</h3>
            {charts.length > 0 && (
              <span className="ml-auto px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-400 text-xs font-medium">
                {charts.length}
              </span>
            )}
          </div>

          {deleteMsg && (
            <div className="mb-4 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center">
              {deleteMsg}
            </div>
          )}

          {loadingCharts && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={28} className="animate-spin text-purple-400" />
            </div>
          )}

          {chartsError && !loadingCharts && (
            <div className="flex items-center justify-center py-8 gap-3">
              <AlertCircle size={18} className="text-red-400" />
              <p className="text-red-400 text-sm">{chartsError}</p>
              <button
                onClick={() => user && loadChartsFromCloud(user.uid).then(setCharts).catch(() => setChartsError(tx("error", lang)))}
                className="px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs hover:bg-red-500/20 transition-colors"
              >
                {tx("retry", lang)}
              </button>
            </div>
          )}

          {!loadingCharts && !chartsError && charts.length === 0 && (
            <div className="text-center py-10">
              <Star size={40} className="text-slate-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">{tx("noCharts", lang)}</p>
              <Link
                href="/natal"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-gray-900 text-sm font-medium transition-all"
              >
                <Star size={14} />
                {tx("loadChart", lang)}
              </Link>
            </div>
          )}

          {!loadingCharts && !chartsError && charts.length > 0 && (
            <div className="space-y-3">
              {charts.map((chart) => (
                <div
                  key={chart.id}
                  className="p-4 rounded-xl bg-white/5 border border-gray-200 hover:border-purple-500/30 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    {/* Chart icon */}
                    <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Star size={18} className="text-purple-400" />
                    </div>

                    {/* Chart info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 truncate">{chart.name || chart.birthData?.name || tx("chartName", lang)}</h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatBirthDate(chart, lang)}
                        </span>
                        {chart.birthData?.houseSystem && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-700/50 text-gray-500 text-[10px]">
                            {chart.birthData.houseSystem === "P" ? "Porphyry" : chart.birthData.houseSystem === "E" ? "Equal" : chart.birthData.houseSystem}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {tx("saved", lang)}: {formatDate(chart.ts, lang)}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleLoadChart(chart)}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-gray-900 text-xs font-medium transition-all flex items-center gap-1"
                        title={tx("loadChart", lang)}
                      >
                        <Upload size={12} />
                        {tx("loadChart", lang)}
                      </button>
                      {showConfirm === chart.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDeleteChart(chart.id!)}
                            disabled={deletingId === chart.id}
                            className="px-2 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-gray-900 text-xs font-medium transition-all"
                          >
                            {deletingId === chart.id ? <Loader2 size={10} className="animate-spin" /> : tx("deleteChart", lang)}
                          </button>
                          <button
                            onClick={() => setShowConfirm(null)}
                            className="px-2 py-1.5 rounded-lg bg-white/5 border border-gray-200 text-gray-500 text-xs hover:text-purple-700 transition-all"
                          >
                            {tx("cancel", lang)}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowConfirm(chart.id!)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 border border-gray-200 hover:border-red-500/30 text-gray-500 hover:text-red-400 transition-all"
                          title={tx("deleteChart", lang)}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Composite Charts Section */}
        <div className="p-6 rounded-2xl bg-white/5 border border-gray-200">
          <div className="flex items-center gap-2 mb-5">
            <Star size={18} className="text-pink-400" />
            <h3 className="font-bold text-gray-900">{tx("compositeCharts", lang)}</h3>
            {compositeCharts.length > 0 && (
              <span className="ml-auto px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 text-xs font-medium">
                {compositeCharts.length}
              </span>
            )}
          </div>

          {loadingComposite && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={28} className="animate-spin text-pink-400" />
            </div>
          )}

          {compositeError && !loadingComposite && (
            <div className="flex items-center justify-center py-8 gap-3">
              <AlertCircle size={18} className="text-red-400" />
              <p className="text-red-400 text-sm">{compositeError}</p>
              <button
                onClick={() => getSavedCompositeCharts(20).then(setCompositeCharts).catch(() => setCompositeError(tx("error", lang)))}
                className="px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs hover:bg-red-500/20 transition-colors"
              >
                {tx("retry", lang)}
              </button>
            </div>
          )}

          {!loadingComposite && !compositeError && compositeCharts.length === 0 && (
            <div className="text-center py-10">
              <Star size={40} className="text-slate-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">{tx("noCompositeCharts", lang)}</p>
              <Link
                href="/composite"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl text-gray-900 text-sm font-medium transition-all"
              >
                <Star size={14} />
                {tx("loadComposite", lang)}
              </Link>
            </div>
          )}

          {!loadingComposite && !compositeError && compositeCharts.length > 0 && (
            <div className="space-y-3">
              {compositeCharts.map((composite) => (
                <div
                  key={composite.id}
                  className="p-4 rounded-xl bg-white/5 border border-gray-200 hover:border-pink-500/30 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    {/* Composite icon */}
                    <div className="w-10 h-10 rounded-lg bg-pink-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Star size={18} className="text-pink-400" />
                    </div>

                    {/* Composite info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-pink-300">{composite.person1Name || tx("person1Short", lang)}</span>
                        <span className="text-gray-400">+</span>
                        <span className="font-semibold text-purple-700">{composite.person2Name || tx("person2Short", lang)}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(composite.createdAt?.seconds ? composite.createdAt.seconds * 1000 : Date.now(), lang)}
                        </span>
                        {composite.houseSystem && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-700/50 text-gray-500 text-[10px]">
                            {composite.houseSystem === "P" ? "Porphyry" : composite.houseSystem === "E" ? "Equal" : composite.houseSystem}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleLoadCompositeChart(composite)}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-gray-900 text-xs font-medium transition-all flex items-center gap-1"
                        title={tx("loadComposite", lang)}
                      >
                        <Upload size={12} />
                        {tx("loadComposite", lang)}
                      </button>
                      {showCompositeConfirm === composite.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDeleteCompositeChart(composite.id!)}
                            disabled={deletingCompositeId === composite.id}
                            className="px-2 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-gray-900 text-xs font-medium transition-all"
                          >
                            {deletingCompositeId === composite.id ? <Loader2 size={10} className="animate-spin" /> : tx("deleteComposite", lang)}
                          </button>
                          <button
                            onClick={() => setShowCompositeConfirm(null)}
                            className="px-2 py-1.5 rounded-lg bg-white/5 border border-gray-200 text-gray-500 text-xs hover:text-purple-700 transition-all"
                          >
                            {tx("cancel", lang)}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowCompositeConfirm(composite.id!)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 border border-gray-200 hover:border-red-500/30 text-gray-500 hover:text-red-400 transition-all"
                          title={tx("deleteComposite", lang)}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom spacer */}
        <div className="h-4" />
      </main>
    </div>
  );
}
