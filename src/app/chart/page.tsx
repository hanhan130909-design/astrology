"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ArrowLeft, Star, GitCompare, Sun, Moon, Rocket, TrendingUp, Calendar, Heart, Zap } from 'lucide-react';

const T: Record<string, Record<string, any>> = {
  zh: {
    title: '星盘分析中心',
    subtitle: '专业占星工具 -本命盘/推运盘/合盘分析',
    natal: { name: '本命盘', desc: '完整的出生星盘，包含行星、星座、宫位、相位分析', icon: '⭐' },
    transit: { name: '推运盘', desc: '行星过境与本命星的相位关系，预测运势变化', icon: '🌍' },
    solar_return: { name: '日返盘', desc: '太阳回归盘，每年生日时的能量解读', icon: '☀️' },
    lunar_return: { name: '月返盘', desc: '月亮回归盘，月度能量周期分析', icon: '🌙' },
    composite: { name: '组合盘', desc: '两人关系的合盘分析，揭示灵魂契合度', icon: '💑' },
    progression: { name: '法达星限', desc: '行星行运周期分析，重要人生阶段预测', icon: '📈' },
    compatibility: { name: '比较盘', desc: '双人行星相位对照，关系互动模式分析', icon: '🔮' },
    seasonal: { name: '运势日历', desc: '每月行星换座与重要天象时间表', icon: '📅' },
  },
  en: {
    title: 'Astrology Analysis Center',
    subtitle: 'Professional astrology tools - Natal/Transit/Composite Charts',
    natal: { name: 'Natal Chart', desc: 'Complete birth chart with planets, signs, houses, aspects', icon: '⭐' },
    transit: { name: 'Transit Chart', desc: 'Planet transits and aspects to natal positions', icon: '🌍' },
    solar_return: { name: 'Solar Return', desc: 'Sun return chart for yearly energy reading', icon: '☀️' },
    lunar_return: { name: 'Lunar Return', desc: 'Moon return for monthly cycle analysis', icon: '🌙' },
    composite: { name: 'Composite Chart', desc: 'Relationship composite chart analysis', icon: '💑' },
    progression: { name: 'Progression', desc: 'Secondary progression analysis', icon: '📈' },
    compatibility: { name: 'Compatibility', desc: 'Synastry - relationship interaction analysis', icon: '🔮' },
    seasonal: { name: 'Seasonal Calendar', desc: 'Monthly planetary changes and events', icon: '📅' },
  },
  id: {
    title: 'Pusat Analisis Astrologi',
    subtitle: 'Alat astrologi profesional - Bagan Natal/Transit/Komposit',
    natal: { name: 'Bagan Lahir', desc: 'Bagan kelahiran lengkap dengan planet, zodiak, rumah, aspek', icon: '⭐' },
    transit: { name: 'Bagan Transit', desc: 'Planet transit dan aspek dengan posisi lahir', icon: '🌍' },
    solar_return: { name: 'Solar Return', desc: 'Bagan kembali matahari untuk energi tahunan', icon: '☀️' },
    lunar_return: { name: 'Lunar Return', desc: 'Kembali bulan untuk analisis siklus bulanan', icon: '🌙' },
    composite: { name: 'Bagan Komposit', desc: 'Analisis bagan hubungan komposit', icon: '💑' },
    progression: { name: 'Progresi', desc: 'Analisis progresi planet sekunder', icon: '📈' },
    compatibility: { name: 'Kompatibilitas', desc: 'Sinastri - analisis interaksi hubungan', icon: '🔮' },
    seasonal: { name: 'Kalender Musiman', desc: 'Perubahan planet bulanan dan peristiwa', icon: '📅' },
  },
  th: {
    title: 'ศูนย์วิเคราะห์ดวงดาว',
    subtitle: 'เครื่องมือดูดวงมืออาชีพ',
    natal: { name: 'แผนภูมิเกิด', desc: 'แผนภูมิการเกิดที่สมบูรณ์', icon: '⭐' },
    transit: { name: 'แผนภูมิดาวโคจร', desc: 'ดาวเคราะห์ผ่านและมุมทรงพลัง', icon: '🌍' },
    solar_return: { name: 'วันเกิดประจำปี', desc: 'แผนภูมิแสงอาทิตย์', icon: '☀️' },
    lunar_return: { name: 'วันเกิดประจำเดือน', desc: 'แผนภูมิดวงจันทร์', icon: '🌙' },
    composite: { name: 'แผนภูมิคู่', desc: 'วิเคราะห์ความสัมพันธ์', icon: '💑' },
    progression: { name: 'การเคลื่อนที่', desc: 'การวิเคราะห์การเคลื่อนที่ของดาว', icon: '📈' },
    compatibility: { name: 'ความเข้ากัน', desc: 'การวิเคราะห์ความสัมพันธ์', icon: '🔮' },
    seasonal: { name: 'ปฏิทินรายเดือน', desc: 'การเปลี่ยนแปลงของดาวเคราะห์รายเดือน', icon: '📅' },
  },
  vi: {
    title: 'Trung Tâm Phân Tích Chiêm Tinh',
    subtitle: 'Công cụ chiêm tinh chuyên nghiệp',
    natal: { name: 'Bản Đồ Sao', desc: 'Bản đồ sao khai sinh hoàn chỉnh', icon: '⭐' },
    transit: { name: 'Bản Đồ Vận', desc: 'Sao đi qua và các góc độ', icon: '🌍' },
    solar_return: { name: 'Ngày Sinh Nhật', desc: 'Bản đồ mặt trời quay về', icon: '☀️' },
    lunar_return: { name: 'Ngày Trăng Tròn', desc: 'Bản đồ mặt trăng', icon: '🌙' },
    composite: { name: 'Bản Đồ Kết Hợp', desc: 'Phân tích mối quan hệ', icon: '💑' },
    progression: { name: 'Tiến Trình', desc: 'Phân tích tiến trình hành tinh', icon: '📈' },
    compatibility: { name: 'Tương Hợp', desc: 'Phân tích tương thích', icon: '🔮' },
    seasonal: { name: 'Lịch Hàng Tháng', desc: 'Thay đổi hành tinh hàng tháng', icon: '📅' },
  },
  ms: {
    title: 'Pusat Analisis Astrologi',
    subtitle: 'Alat astrologi profesional',
    natal: { name: 'Carta Lahir', desc: 'Carta kelahiran lengkap', icon: '⭐' },
    transit: { name: 'Carta Transit', desc: 'Planet transit dan aspek', icon: '🌍' },
    solar_return: { name: 'Hari Lahir Tahunan', desc: 'Carta matahari', icon: '☀️' },
    lunar_return: { name: 'Hari Lahir Bulanan', desc: 'Carta bulan', icon: '🌙' },
    composite: { name: 'Carta Komposit', desc: 'Analisis hubungan', icon: '💑' },
    progression: { name: 'Progresi', desc: 'Analisis progresi planet', icon: '📈' },
    compatibility: { name: 'Keserasian', desc: 'Analisis keserasian', icon: '🔮' },
    seasonal: { name: 'Kalendar Bulanan', desc: 'Perubahan planet bulanan', icon: '📅' },
  },
  ja: {
    title: '占星分析センター',
    subtitle: 'プロフェッショナル占星術ツール',
    natal: { name: '出生図', desc: '完全な出生図', icon: '⭐' },
    transit: { name: 'Transit図', desc: '惑星のTransitとアスペクト', icon: '🌍' },
    solar_return: { name: '誕生日チャート', desc: '太陽回帰図', icon: '☀️' },
    lunar_return: { name: '月次チャート', desc: '月亮回帰図', icon: '🌙' },
    composite: { name: '合成図', desc: '関係分析', icon: '💑' },
    progression: { name: '進行図', desc: '惑星進行分析', icon: '📈' },
    compatibility: { name: '相性診断', desc: '相性分析', icon: '🔮' },
    seasonal: { name: '月間カレンダー', desc: '惑星の月度変化', icon: '📅' },
  },
  ko: {
    title: '점성 분석 센터',
    subtitle: '전문 점성술 도구',
    natal: { name: '출생지圖', desc: '완전한 출생 차트', icon: '⭐' },
    transit: { name: '트랜짓 차트', desc: '행성의 트랜짓과 애스펙트', icon: '🌍' },
    solar_return: { name: '생일 차트', desc: '솔라 리턴 차트', icon: '☀️' },
    lunar_return: { name: '월간 차트', desc: '루나 리턴 차트', icon: '🌙' },
    composite: { name: '합성 차트', desc: '관계 분석', icon: '💑' },
    progression: { name: '진행 차트', desc: '행성 진행 분석', icon: '📈' },
    compatibility: { name: '궁합', desc: '궁합 분석', icon: '🔮' },
    seasonal: { name: '월간 캘린더', desc: '행성 월간 변화', icon: '📅' },
  },
};

const chartTypes = [
  { key: 'natal', href: '/natal', color: 'from-purple-500 to-indigo-600', glow: 'purple' },
  { key: 'transit', href: '/transits', color: 'from-cyan-500 to-blue-600', glow: 'cyan' },
  { key: 'solar_return', href: '/solar-return', color: 'from-amber-500 to-orange-600', glow: 'amber' },
  { key: 'lunar_return', href: '/lunar-return', color: 'from-slate-400 to-gray-600', glow: 'gray' },
  { key: 'composite', href: '/composite', color: 'from-pink-500 to-rose-600', glow: 'pink' },
  { key: 'progression', href: '/progression', color: 'from-emerald-500 to-teal-600', glow: 'emerald' },
  { key: 'compatibility', href: '/compatibility', color: 'from-violet-500 to-purple-600', glow: 'violet' },
  { key: 'seasonal', href: '/yearly-horoscope', color: 'from-sky-500 to-blue-600', glow: 'sky' },
];

export default function ChartHubPage() {
  const { language } = useLanguage();
  const t = T[language] || T.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-[#ffffff] text-gray-900">
      {/* Navigation */}
      

      {/* Header */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-sm text-purple-700 mb-6">
            <Star size={16} className="fill-purple-300" />
            {language === 'zh' ? '专业占星工具' : language === 'id' ? 'Alat Astrologi Profesional' : 'Professional Astrology Tools'}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t.title}
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Chart Type Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {chartTypes.map((item, idx) => {
            const card = t[item.key as keyof typeof t] || t.natal;
            return (
              <Link key={idx} href={item.href}
                className="group relative p-6 rounded-2xl bg-gray-50 border border-gray-200 hover:border-purple-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-200/50 overflow-hidden">
                {/* Background gradient */}
                <div className={"absolute inset-0 bg-gradient-to-br " + item.color + " opacity-0 group-hover:opacity-5 transition-opacity duration-300"}/>

                {/* Icon */}
                <div className={"relative w-14 h-14 rounded-xl bg-gradient-to-br " + item.color + " flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform"}>
                  {(card as any).icon}
                </div>

                {/* Title */}
                <h3 className="relative text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                  {(card as any).name}
                </h3>

                {/* Description */}
                <p className="relative text-sm text-gray-500 leading-relaxed">
                  {(card as any).desc}
                </p>

                {/* Arrow indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className={"w-8 h-8 rounded-full bg-gradient-to-br " + item.color + " flex items-center justify-center"}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Featured Section: Natal Chart */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {language === 'zh' ? '核心工具：本命盘分析' : language === 'id' ? 'Alat Inti: Analisis Bagan Lahir' : 'Core Tool: Natal Chart Analysis'}
            </h2>
            <p className="text-gray-500">
              {language === 'zh' ? '基于您精确的出生时间地点，计算完整的本命盘星象图' : language === 'id' ? 'Hitung bagan kelahiran lengkap berdasarkan waktu dan tempat lahir Anda' : 'Calculate complete natal chart based on your precise birth time and location'}
            </p>
          </div>
          
          <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 via-white to-indigo-50 border border-purple-200">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
                    <path strokeLinecap="round" d="M12 2v20M2 12h20"/>
                    <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.3"/>
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{language === 'zh' ? '行星位置' : 'Planet Positions'}</h4>
                <p className="text-sm text-gray-500">
                  {language === 'zh' ? '太阳、月亮、水星至冥王星，精确黄道经纬度' : 'Matahari hingga Pluto, dengan koordinat ekliptik yang tepat'}
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5"/>
                    <path strokeLinecap="round" d="M3 9h18M9 3v18"/>
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{language === 'zh' ? '宫位系统' : 'House System'}</h4>
                <p className="text-sm text-gray-500">
                  {language === 'zh' ? 'Placidus/等宫/整宫制，12宫位含义解读' : 'Sistem Placidus/Equal/Whole dengan 12 rumah dan artinya'}
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{language === 'zh' ? '相位分析' : 'Aspect Analysis'}</h4>
                <p className="text-sm text-gray-500">
                  {language === 'zh' ? '合/六/四/三分/对分等主要相位及容许度' : 'Konjungsi, Sextile, Square, Trine, Oposisi dan orbs'}
                </p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Link href="/natal"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl font-bold text-gray-900 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-200/30">
                <Star size={20} className="fill-white"/>
                {language === 'zh' ? '开始分析本命盘' : language === 'id' ? 'Mulai Analisis Bagan Lahir' : 'Start Natal Chart Analysis'}
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/horoscope" className="p-4 rounded-xl bg-gray-100 border border-gray-200 hover:border-purple-200 hover:bg-white transition-all text-center group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">♈</div>
            <div className="text-sm font-medium text-gray-600">{language === 'zh' ? '每日运势' : language === 'id' ? 'Horoskop Harian' : 'Daily Horoscope'}</div>
          </Link>
          <Link href="/ai-reading" className="p-4 rounded-xl bg-gray-100 border border-gray-200 hover:border-purple-200 hover:bg-white transition-all text-center group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🔮</div>
            <div className="text-sm font-medium text-gray-600">{language === 'zh' ? 'AI智能解读' : language === 'id' ? 'Pembacaan AI' : 'AI Reading'}</div>
          </Link>
          <Link href="/community" className="p-4 rounded-xl bg-gray-100 border border-gray-200 hover:border-purple-200 hover:bg-white transition-all text-center group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🌟</div>
            <div className="text-sm font-medium text-gray-600">{language === 'zh' ? '星象社区' : language === 'id' ? 'Komunitas' : 'Community'}</div>
          </Link>
          <Link href="/learn" className="p-4 rounded-xl bg-gray-100 border border-gray-200 hover:border-purple-200 hover:bg-white transition-all text-center group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📚</div>
            <div className="text-sm font-medium text-gray-600">{language === 'zh' ? '占星学习' : language === 'id' ? 'Belajar' : 'Learn Astrology'}</div>
          </Link>
        </div>
      </main>
    </div>
  );
}
