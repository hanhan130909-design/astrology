"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, Calendar, Clock, Video, MessageSquare,
  Phone, ChevronRight, CheckCircle, Shield, Users, 
  Filter, Search, Play, Award, Heart
} from "lucide-react";

interface Astrologer {
  id: string;
  name: string;
  avatar: string;
  title: string;
  bio: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  languages: string[];
  specializations: string[];
  availability: string;
  responseTime: string;
  isOnline: boolean;
  featured?: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const TRANSLATIONS: Record<string, Record<string, string>> = {
  zh: {
    title: "占星咨询",
    subtitle: "预约专业占星师一对一咨询",
    bookSession: "立即预约",
    viewProfile: "查看详情",
    perHour: "/小时",
    rating: "评分",
    reviews: "条评价",
    experience: "经验",
    languages: "语言",
    specializations: "专长",
    online: "在线",
    offline: "离线",
    responseTime: "响应时间",
    consultationTypes: "咨询方式",
    video: "视频咨询",
    voice: "语音咨询",
    chat: "文字咨询",
    selectTime: "选择时间",
    availableSlots: "可预约时段",
    noSlots: "暂无可用时段",
    bookingSuccess: "预约成功",
    bookingConfirm: "确认预约",
    cancel: "取消",
    confirm: "确认",
    total: "共计",
    minutes: "分钟",
    filterOnline: "只看在线",
    sortBy: "排序",
    popularity: "最受欢迎",
    priceLow: "价格最低",
    priceHigh: "价格最高",
    ratingHigh: "评分最高",
    featured: "推荐占星师",
    allAstrologers: "全部占星师"},
  en: {
    title: "Astrology Consultation",
    subtitle: "Book professional astrologer sessions",
    bookSession: "Book Now",
    viewProfile: "View Profile",
    perHour: "/hour",
    rating: "Rating",
    reviews: "reviews",
    experience: "Experience",
    languages: "Languages",
    specializations: "Specializations",
    online: "Online",
    offline: "Offline",
    responseTime: "Response",
    consultationTypes: "Consultation",
    video: "Video",
    voice: "Voice",
    chat: "Chat",
    selectTime: "Select Time",
    availableSlots: "Available Slots",
    noSlots: "No available slots",
    bookingSuccess: "Booking Confirmed",
    bookingConfirm: "Confirm Booking",
    cancel: "Cancel",
    confirm: "Confirm",
    total: "Total",
    minutes: "minutes",
    filterOnline: "Online Only",
    sortBy: "Sort",
    popularity: "Popular",
    priceLow: "Price: Low",
    priceHigh: "Price: High",
    ratingHigh: "Top Rated",
    featured: "Featured Astrologers",
    allAstrologers: "All Astrologers"},
  id: {
    title: "Konsultasi Astrologi",
    subtitle: "Pesan sesi dengan astrolog profesional",
    bookSession: "Pesan Sekarang",
    viewProfile: "Lihat Profil",
    perHour: "/jam",
    rating: "Rating",
    reviews: "ulasan",
    experience: "Pengalaman",
    languages: "Bahasa",
    specializations: "Spesialisasi",
    online: "Online",
    offline: "Offline",
    responseTime: "Respon",
    consultationTypes: "Konsultasi",
    video: "Video",
    voice: "Suara",
    chat: "Chat",
    selectTime: "Pilih Waktu",
    availableSlots: "Waktu Tersedia",
    noSlots: "Belum ada waktu",
    bookingSuccess: "Pemesanan Berhasil",
    bookingConfirm: "Konfirmasi",
    cancel: "Batal",
    confirm: "Konfirmasi",
    total: "Total",
    minutes: "menit",
    filterOnline: "Online Saja",
    sortBy: "Urutkan",
    popularity: "Populer",
    priceLow: "Harga Rendah",
    priceHigh: "Harga Tinggi",
    ratingHigh: "Rating Tertinggi",
    featured: "Astrolog Rekomendasi",
    allAstrologers: "Semua Astrolog"},
  th: {
    title: "ปรึกษาดวง",
    subtitle: "นัดหมายกับนักดูดวงมืออาชีพ",
    bookSession: "จองเลย",
    viewProfile: "ดูโปรไฟล์",
    perHour: "/ชั่วโมง",
    rating: "คะแนน",
    reviews: "รีวิว",
    experience: "ประสบการณ์",
    languages: "ภาษา",
    specializations: "ความเชี่ยวชาญ",
    online: "ออนไลน์",
    offline: "ออฟไลน์",
    responseTime: "เวลาตอบ",
    consultationTypes: "ปรึกษา",
    video: "วิดีโอ",
    voice: "เสียง",
    chat: "แชท",
    selectTime: "เลือกเวลา",
    availableSlots: "ช่วงเวลาว่าง",
    noSlots: "ไม่มีช่วงเวลาว่าง",
    bookingSuccess: "จองสำเร็จ",
    bookingConfirm: "ยืนยันการจอง",
    cancel: "ยกเลิก",
    confirm: "ยืนยัน",
    total: "รวม",
    minutes: "นาที",
    filterOnline: "เฉพาะออนไลน์",
    sortBy: "เรียง",
    popularity: "ยอดนิยม",
    priceLow: "ราคาต่ำ",
    priceHigh: "ราคาสูง",
    ratingHigh: "คะแนนสูง",
    featured: "นักดูดวงแนะนำ",
    allAstrologers: "นักดูดวงทั้งหมด"},
  vi: {
    title: "Tư Vấn Chiêm Tinh",
    subtitle: "Đặt lịch với nhà chiêm tinh chuyên nghiệp",
    bookSession: "Đặt ngay",
    viewProfile: "Xem hồ sơ",
    perHour: "/giờ",
    rating: "Đánh giá",
    reviews: "đánh giá",
    experience: "Kinh nghiệm",
    languages: "Ngôn ngữ",
    specializations: "Chuyên môn",
    online: "Trực tuyến",
    offline: "Ngoại tuyến",
    responseTime: "Phản hồi",
    consultationTypes: "Tư vấn",
    video: "Video",
    voice: "Giọng nói",
    chat: "Chat",
    selectTime: "Chọn giờ",
    availableSlots: "Khung giờ trống",
    noSlots: "Không có khung giờ",
    bookingSuccess: "Đặt thành công",
    bookingConfirm: "Xác nhận đặt",
    cancel: "Hủy",
    confirm: "Xác nhận",
    total: "Tổng",
    minutes: "phút",
    filterOnline: "Chỉ trực tuyến",
    sortBy: "Sắp xếp",
    popularity: "Phổ biến",
    priceLow: "Giá thấp",
    priceHigh: "Giá cao",
    ratingHigh: "Đánh giá cao",
    featured: "Nhà chiêm tinh đề xuất",
    allAstrologers: "Tất cả nhà chiêm tinh"},
  ms: {
    title: "Konsultasi Astrologi",
    subtitle: "Tempah sesi dengan ahli astrologi profesional",
    bookSession: "Tempah Sekarang",
    viewProfile: "Lihat Profil",
    perHour: "/jam",
    rating: "Penilaian",
    reviews: "ulasan",
    experience: "Pengalaman",
    languages: "Bahasa",
    specializations: "Kepakaran",
    online: "Online",
    offline: "Offline",
    responseTime: "Respons",
    consultationTypes: "Konsultasi",
    video: "Video",
    voice: "Suara",
    chat: "Chat",
    selectTime: "Pilih Masa",
    availableSlots: "Slot Available",
    noSlots: "Tiada slot",
    bookingSuccess: "Tempahan Berjaya",
    bookingConfirm: "Sahkan Tempahan",
    cancel: "Batal",
    confirm: "Sahkan",
    total: "Jumlah",
    minutes: "minit",
    filterOnline: "Online Sahaja",
    sortBy: "Isih",
    popularity: "Popular",
    priceLow: "Harga Rendah",
    priceHigh: "Harga Tinggi",
    ratingHigh: "Penilaian Tinggi",
    featured: "Ahli Astrologi Disarankan",
    allAstrologers: "Semua Ahli Astrologi"},
  ja: {
    title: "占星相談",
    subtitle: "専門占星師とセッションを予約",
    bookSession: "今すぐ予約",
    viewProfile: "プロフィールを見る",
    perHour: "/時間",
    rating: "評価",
    reviews: "レビュー",
    experience: "経験",
    languages: "言語",
    specializations: "専門分野",
    online: "オンライン",
    offline: "オフライン",
    responseTime: "応答時間",
    consultationTypes: "相談",
    video: "ビデオ",
    voice: "音声",
    chat: "チャット",
    selectTime: "時間を選択",
    availableSlots: "予約可能時間",
    noSlots: "予約可能な時間はありません",
    bookingSuccess: "予約完了",
    bookingConfirm: "予約確認",
    cancel: "キャンセル",
    confirm: "確認",
    total: "合計",
    minutes: "分",
    filterOnline: "オンラインのみ",
    sortBy: "並べ替え",
    popularity: "人気",
    priceLow: "価格：低",
    priceHigh: "価格：高",
    ratingHigh: "高評価",
    featured: "注目の占星師",
    allAstrologers: "すべての占星師"},
  ko: {
    title: "점성 상담",
    subtitle: "전문 점성사와 상담 예약",
    bookSession: "지금 예약",
    viewProfile: "프로필 보기",
    perHour: "/시간",
    rating: "평점",
    reviews: "후기",
    experience: "경력",
    languages: "언어",
    specializations: "전문 분야",
    online: "온라인",
    offline: "오프라인",
    responseTime: "응답 시간",
    consultationTypes: "상담",
    video: "비디오",
    voice: "음성",
    chat: "채팅",
    selectTime: "시간 선택",
    availableSlots: "예약 가능 시간",
    noSlots: "예약 가능한 시간이 없습니다",
    bookingSuccess: "예약 완료",
    bookingConfirm: "예약 확인",
    cancel: "취소",
    confirm: "확인",
    total: "총계",
    minutes: "분",
    filterOnline: "온라인만",
    sortBy: "정렬",
    popularity: "인기",
    priceLow: "가격: 낮음",
    priceHigh: "가격: 높음",
    ratingHigh: "높은 평점",
    featured: "추천 점성사",
    allAstrologers: "모든 점성사"}};

const ASTROLOGERS: Astrologer[] = [
  {
    id: "1",
    name: "星辰导师 Luna",
    avatar: "🌙",
    title: "资深占星师",
    bio: "从事占星15年，专注于本命盘解读和关系分析，帮助数千人找到人生方向。",
    rating: 4.9,
    reviews: 1523,
    hourlyRate: 150,
    languages: ["中文", "English"],
    specializations: ["本命盘", "合盘分析", "职业规划", "情感咨询"],
    availability: "周一至周五 10:00-20:00",
    responseTime: "< 1小时",
    isOnline: true,
    featured: true},
  {
    id: "2",
    name: "星象学者 Marcus",
    avatar: "⭐",
    title: "古典占星传承者",
    bio: "英国占星学院毕业，精通古典占星术和现代心理占星，融合传统与现代。",
    rating: 4.8,
    reviews: 892,
    hourlyRate: 180,
    languages: ["English", "Bahasa Indonesia", "中文"],
    specializations: ["古典占星", "预测推运", "太阳弧", "行运分析"],
    availability: "全天候",
    responseTime: "< 30分钟",
    isOnline: true,
    featured: true},
  {
    id: "3",
    name: "灵性导师 Sofia",
    avatar: "🔮",
    title: "灵性占星师",
    bio: "结合塔罗、灵气疗愈与占星，为您提供全面的灵性成长指导。",
    rating: 4.9,
    reviews: 678,
    hourlyRate: 200,
    languages: ["English", "Bahasa Indonesia"],
    specializations: ["灵性成长", "塔罗占卜", "能量疗愈", "前世今生"],
    availability: "周二至周日 14:00-22:00",
    responseTime: "< 2小时",
    isOnline: false},
  {
    id: "4",
    name: "易经大师 Chen",
    avatar: "☯️",
    title: "东方占星专家",
    bio: "精通中国传统文化，将易经、八字与西方占星完美融合。",
    rating: 4.7,
    reviews: 456,
    hourlyRate: 160,
    languages: ["中文", "English"],
    specializations: ["易经", "八字", "中西方占星融合", "事业财运"],
    availability: "周一至周六 09:00-18:00",
    responseTime: "< 3小时",
    isOnline: true},
  {
    id: "5",
    name: "关系专家 Anita",
    avatar: "💕",
    title: "情感占星师",
    bio: "专注于两性关系和配对分析，帮助您找到灵魂伴侣。",
    rating: 4.8,
    reviews: 1089,
    hourlyRate: 140,
    languages: ["English", "Bahasa Indonesia", "中文"],
    specializations: ["合盘分析", "婚姻预测", "单身指导", "分手挽回"],
    availability: "全周 10:00-23:00",
    responseTime: "< 1小时",
    isOnline: false},
  {
    id: "6",
    name: "职业顾问 David",
    avatar: "📈",
    title: "职业规划师",
    bio: "通过星盘分析帮助您找到最适合的职业方向和人生使命。",
    rating: 4.6,
    reviews: 345,
    hourlyRate: 130,
    languages: ["English", "中文"],
    specializations: ["职业规划", "学业指导", "创业分析", "事业转型"],
    availability: "周一至周五 08:00-17:00",
    responseTime: "< 4小时",
    isOnline: true},
];

const TIME_SLOTS: TimeSlot[] = [
  { time: "09:00", available: true },
  { time: "10:00", available: true },
  { time: "11:00", available: false },
  { time: "14:00", available: true },
  { time: "15:00", available: true },
  { time: "16:00", available: true },
  { time: "19:00", available: false },
  { time: "20:00", available: true },
];

export default function ConsultationPage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  
  const [selectedAstrologer, setSelectedAstrologer] = useState<Astrologer | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<"video" | "voice" | "chat">("video");
  const [filterOnline, setFilterOnline] = useState(false);
  const [sortBy, setSortBy] = useState<"popularity" | "priceLow" | "priceHigh" | "rating">("popularity");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const filteredAstrologers = ASTROLOGERS
    .filter(a => !filterOnline || a.isOnline)
    .sort((a, b) => {
      switch (sortBy) {
        case "priceLow": return a.hourlyRate - b.hourlyRate;
        case "priceHigh": return b.hourlyRate - a.hourlyRate;
        case "rating": return b.rating - a.rating;
        default: return b.reviews - a.reviews;
      }
    });

  const handleBook = () => {
    if (!selectedSlot) return;
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setShowBooking(false);
      setSelectedAstrologer(null);
      setSelectedSlot(null);
    }, 3000);
  };

  if (selectedAstrologer) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        

        {/* Success Modal */}
        {bookingSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#0f0f1a] rounded-2xl border border-gray-200 p-8 text-center max-w-sm">
              <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t.bookingSuccess}</h3>
              <p className="text-gray-400 mb-4">
                {language === "zh" ? `已预约 ${selectedSlot}` : language === "id" ? `Dipesan ${selectedSlot}` : `Booked for ${selectedSlot}`}
              </p>
              <div className="text-4xl">{selectedAstrologer.avatar}</div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Profile Card */}
          <div className="bg-gradient-to-br from-gray-50/30 to-gray-900/30 rounded-2xl p-6 border border-gray-200 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-500 to-gray-500 rounded-full flex items-center justify-center text-4xl">
                  {selectedAstrologer.avatar}
                </div>
                {selectedAstrologer.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-500 rounded-full border-2 border-[#ffffff]" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedAstrologer.name}</h2>
                <p className="text-gray-400 text-sm mb-2">{selectedAstrologer.title}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-gray-600">
                    <Star className="w-4 h-4 fill-current" />
                    {selectedAstrologer.rating} ({selectedAstrologer.reviews} {t.reviews})
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedAstrologer.isOnline ? "bg-gray-500/20 text-gray-400" : "bg-gray-500/20 text-gray-400"
                  }`}>
                    {selectedAstrologer.isOnline ? t.online : t.offline}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">${selectedAstrologer.hourlyRate}</div>
                <div className="text-sm text-gray-400">{t.perHour}</div>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{selectedAstrologer.bio}</p>
            <div className="flex flex-wrap gap-2">
              {selectedAstrologer.specializations.map((spec) => (
                <span key={spec} className="px-3 py-1 bg-gray-50 rounded-full text-sm text-gray-400">
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
              <Clock className="w-5 h-5 text-gray-400 mx-auto mb-2" />
              <div className="text-gray-900 font-medium">{t.responseTime}</div>
              <div className="text-gray-400 text-sm">{selectedAstrologer.responseTime}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
              <Calendar className="w-5 h-5 text-gray-400 mx-auto mb-2" />
              <div className="text-gray-900 font-medium">
                {language === "zh" ? "可预约" : language === "id" ? "Tersedia" : "Available"}
              </div>
              <div className="text-gray-400 text-sm">{selectedAstrologer.availability}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
              <MessageSquare className="w-5 h-5 text-gray-400 mx-auto mb-2" />
              <div className="text-gray-900 font-medium">{t.languages}</div>
              <div className="text-gray-400 text-sm">{selectedAstrologer.languages.join(", ")}</div>
            </div>
          </div>

          {/* Consultation Types */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.consultationTypes}</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: "video", icon: Video, label: t.video, price: 0 },
                { id: "voice", icon: Phone, label: t.voice, price: -10 },
                { id: "chat", icon: MessageSquare, label: t.chat, price: -20 },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id as "video" | "voice" | "chat")}
                  className={`p-4 rounded-xl border transition-all ${
                    selectedType === type.id
                      ? "bg-gray-500/20 border-gray-500/50 text-gray-700"
                      : "bg-gray-50 border-gray-200 text-gray-400 hover:border-white/20"
                  }`}
                >
                  <type.icon className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">{type.label}</div>
                  {type.price !== 0 && (
                    <div className="text-xs text-gray-500">
                      {type.price > 0 ? "+" : ""}${type.price}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.selectTime}</h3>
            <div className="grid grid-cols-4 gap-3">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && setSelectedSlot(slot.time)}
                  disabled={!slot.available}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    selectedSlot === slot.time
                      ? "bg-gray-500/20 border-gray-500/50 text-gray-700"
                      : slot.available
                      ? "bg-gray-50 border-gray-200 text-gray-700 hover:border-white/20"
                      : "bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
            {selectedSlot && (
              <div className="mt-4 p-4 bg-white0/10 rounded-lg border border-gray-200" style={{boxShadow:"0px 0px 0px 1px rgba(0,0,0,0.08), 0px 2px 4px rgba(0,0,0,0.04)"}}>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">
                    {language === "zh" ? "选择时间" : language === "id" ? "Waktu dipilih" : "Selected Time"}: 
                    <span className="text-gray-900 font-medium ml-2">{selectedSlot}</span>
                  </span>
                  <span className="text-gray-900 font-bold">
                    ${selectedAstrologer.hourlyRate + (selectedType === "voice" ? -10 : selectedType === "chat" ? -20 : 0)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Book Button */}
          <button
            onClick={handleBook}
            disabled={!selectedSlot}
            className="w-full py-4 bg-gradient-to-r from-gray-600 to-gray-600 rounded-xl text-gray-900 font-semibold hover:from-gray-500 hover:to-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.bookSession}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h2>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterOnline}
                onChange={(e) => setFilterOnline(e.target.checked)}
                className="w-4 h-4 rounded bg-gray-50 border-white/20 text-gray-500 focus:ring-gray-500"
              />
              <span className="text-gray-700 text-sm">{t.filterOnline}</span>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">{t.sortBy}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:border-gray-500/50 outline-none"
            >
              <option value="popularity">{t.popularity}</option>
              <option value="priceLow">{t.priceLow}</option>
              <option value="priceHigh">{t.priceHigh}</option>
              <option value="rating">{t.ratingHigh}</option>
            </select>
          </div>
        </div>

        {/* Featured */}
        {!filterOnline && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-gray-600" />
              {t.featured}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {ASTROLOGERS.filter(a => a.featured).map((astrologer) => (
                <div
                  key={astrologer.id}
                  className="bg-gradient-to-br from-gray-900/20 to-gray-900/20 rounded-2xl p-6 border border-gray-500/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-500 rounded-full flex items-center justify-center text-3xl">
                        {astrologer.avatar}
                      </div>
                      {astrologer.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-500 rounded-full border-2 border-[#ffffff]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900">{astrologer.name}</h4>
                        <span className="px-2 py-0.5 bg-gray-500/20 text-gray-600 rounded text-xs">
                          {t.featured}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{astrologer.title}</p>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="flex items-center gap-1 text-gray-600">
                          <Star className="w-4 h-4 fill-current" />
                          {astrologer.rating}
                        </span>
                        <span className="text-gray-400">{astrologer.reviews} {t.reviews}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">${astrologer.hourlyRate}</div>
                      <div className="text-xs text-gray-400">{t.perHour}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAstrologer(astrologer)}
                    className="w-full mt-4 py-2 bg-gradient-to-r from-gray-600 to-gray-600 rounded-lg text-gray-900 font-medium hover:from-gray-500 hover:to-gray-500 transition-all"
                  >
                    {t.bookSession}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Astrologers */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.allAstrologers}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAstrologers.map((astrologer) => (
              <div
                key={astrologer.id}
                className="bg-gray-50 rounded-2xl p-5 border border-gray-200 hover:border-gray-200 transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-500 rounded-full flex items-center justify-center text-2xl">
                      {astrologer.avatar}
                    </div>
                    {astrologer.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gray-500 rounded-full border-2 border-[#ffffff]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{astrologer.name}</h4>
                    <p className="text-gray-400 text-xs truncate">{astrologer.title}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">${astrologer.hourlyRate}</div>
                    <div className="text-xs text-gray-400">{t.perHour}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm mb-3">
                  <span className="flex items-center gap-1 text-gray-600">
                    <Star className="w-3 h-3 fill-current" />
                    {astrologer.rating}
                  </span>
                  <span className="text-gray-500">({astrologer.reviews})</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {astrologer.specializations.slice(0, 3).map((spec) => (
                    <span key={spec} className="px-2 py-0.5 bg-gray-50 rounded text-xs text-gray-400">
                      {spec}
                    </span>
                  ))}
                  {astrologer.specializations.length > 3 && (
                    <span className="px-2 py-0.5 text-xs text-gray-500">
                      +{astrologer.specializations.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedAstrologer(astrologer)}
                    className="flex-1 py-2 bg-white0/20 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-500/30 transition-colors" style={{boxShadow:"0px 0px 0px 1px rgba(0,0,0,0.08), 0px 2px 4px rgba(0,0,0,0.04)"}}
                  >
                    {t.bookSession}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
