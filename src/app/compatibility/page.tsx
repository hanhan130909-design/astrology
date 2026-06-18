"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import SynastryChart from "@/components/SynastryChart";
import { HeartHandshake, ArrowRight, Star, CheckCircle } from "lucide-react";

const ZODIAC: Record<string, Record<string, string>> = {
  zh: ["♈白羊","♉金牛","♊双子","♋巨蟹","♌狮子","♍处女","♎天秤","♏天蝎","♐射手","♑摩羯","♒水瓶","♓双鱼"],
  en: ["♈Aries","♉Taurus","♊Gemini","♋Cancer","♌Leo","♍Virgo","♎Libra","♏Scorpio","♐Sagittarius","♑Capricorn","♒Aquarius","♓Pisces"],
  id: ["♈Aries","♉Taurus","♊Gemini","♋Cancer","♌Leo","♍Virgo","♎Libra","♏Scorpio","♐Sagittarius","♑Capricorn","♒Aquarius","♓Pisces"],
  th: ["♈แกะ","♉พฤกษกร","♊มิถุน","♋กรกฎ","♌สิงห์","♍กันย์","♎ตุลย์","♏พิจิก","♐ธนู","♑มังกร","♒กุมภ์","♓มีน"],
  vi: ["♈Bạch Dương","♉Kim Ngưu","♊Song Tử","♋Cự Giải","♌Sư Tử","♍Xử Nữ","♎Thiên Bình","♏Bọ Cạp","♐Nhân Mã","♑Ma Kết","♒Bảo Bình","♓Song Ngư"],
  ms: ["♈Aries","♉Taurus","♊Gemini","♋Cancer","♌Leo","♍Virgo","♎Libra","♏Scorpio","♐Sagittarius","♑Capricorn","♒Aquarius","♓Pisces"],
  ja: ["♈牡羊","♉牡牛","♊双子","♋蟹","♌獅子","♍乙女","♎天秤","♏蠍","♐射手","♑山羊","♒水瓶","♓魚"],
  ko: ["♈양","♉황소","♊쌍둥이","♋게","♌사자","♍처녀","♎천칭","♏전갈","♐사수","♑염소","♒물병","♓물고기"],
};

const T: Record<string, Record<string, string>> = {
  zh: { title:"星座配对分析",subtitle:"探索你与Ta的灵魂契合度",badge:"寻找灵魂伴侣",intro:"基于出生信息的专业合盘分析，从太阳星座到完整星盘，揭示两人关系的深层能量互动。",quickTitle:"快速星座配对",quickDesc:"选择两人的太阳星座，查看基础配对指数",fullTitle:"完整合盘分析",fullDesc:"输入双方出生时间地点，获得精确的行星相位对比、关系宫位分析和契合度评分",cta:"开始配对分析",quickHint:"点击星座查看详情，下方输入出生信息进行精确合盘",multiCompare:"多人对比分析（3人以上）" },
  en: { title:"Compatibility Analysis",subtitle:"Discover your cosmic connection",badge:"Find Your Soulmate",intro:"Professional synastry analysis based on birth data. From sun signs to full chart comparison.",quickTitle:"Quick Zodiac Match",quickDesc:"Select both sun signs for basic compatibility rating",fullTitle:"Full Synastry Analysis",fullDesc:"Enter both birth times and locations for precise planetary aspect comparison",cta:"Start Analysis",quickHint:"Click a sign for details, or enter birth info below for full synastry",multiCompare:"Multi-Person Compare (3+ people)" },
  id: { title:"Analisis Kecocokan",subtitle:"Temukan koneksi kosmik Anda",badge:"Temukan Jodoh",intro:"Analisis sinastri profesional berdasarkan data kelahiran.",quickTitle:"Cocok Zodiak Cepat",quickDesc:"Pilih kedua zodiak untuk peringkat kecocokan",fullTitle:"Analisis Sinastri Lengkap",fullDesc:"Masukkan waktu dan lokasi lahir untuk perbandingan aspek planet",cta:"Mulai Analisis",quickHint:"Klik zodiak untuk detail, atau masukkan data lahir untuk sinastri lengkap",multiCompare:"Banding Multi-Orang (3+ orang)" },
  th: { title:"วิเคราะห์ความเข้ากัน",subtitle:"ค้นพบการเชื่อมต่อจักรวาลของคุณ",badge:"ค้นหาเนื้อคู่",intro:"วิเคราะห์ซินแอสทรีมืออาชีพตามข้อมูลเกิด",quickTitle:"จับคู่ราศีด่วน",quickDesc:"เลือกราศีทั้งสองเพื่อดูคะแนนความเข้ากัน",fullTitle:"วิเคราะห์ซินแอสทรีเต็มรูปแบบ",fullDesc:"ป้อนเวลาและสถานที่เกิดเพื่อเปรียบเทียบมุมดาวที่แม่นยำ",cta:"เริ่มวิเคราะห์",quickHint:"คลิกราศีเพื่อดูรายละเอียด หรือกรอกข้อมูลเกิดด้านล่าง",multiCompare:"เปรียบเทียบหลายคน (3+ คน)" },
  vi: { title:"Phân Tích Tương Hợp",subtitle:"Khám phá kết nối vũ trụ của bạn",badge:"Tìm Tri Kỷ",intro:"Phân tích synastry chuyên nghiệp dựa trên dữ liệu sinh.",quickTitle:"Ghép Cung Nhanh",quickDesc:"Chọn hai cung hoàng đạo để xem điểm tương hợp",fullTitle:"Phân Tích Synastry Đầy Đủ",fullDesc:"Nhập thời gian và địa điểm sinh để so sánh góc chiếu chính xác",cta:"Bắt Đầu",quickHint:"Nhấp cung để xem chi tiết, hoặc nhập thông tin sinh bên dưới",multiCompare:"So Sánh Nhiều Người (3+)" },
  ms: { title:"Analisis Keserasian",subtitle:"Temui hubungan kosmik anda",badge:"Cari Jodoh",intro:"Analisis sinastri profesional berdasarkan data kelahiran.",quickTitle:"Padanan Zodiak Pantas",quickDesc:"Pilih kedua zodiak untuk penilaian keserasian",fullTitle:"Analisis Sinastri Penuh",fullDesc:"Masukkan masa dan lokasi lahir untuk perbandingan aspek planet tepat",cta:"Mula Analisis",quickHint:"Klik zodiak untuk detail, atau masukkan data lahir di bawah",multiCompare:"Banding Berbilang (3+ orang)" },
  ja: { title:"相性分析",subtitle:"宇宙のつながりを発見",badge:"運命の人を探す",intro:"出生データに基づくプロのシナストリー分析。",quickTitle:"クイック星座マッチ",quickDesc:"両方の星座を選択して相性評価",fullTitle:"完全シナストリー分析",fullDesc:"出生時間と場所を入力して正確な惑星アスペクト比較",cta:"分析開始",quickHint:"星座をクリックで詳細、または下に出生情報を入力",multiCompare:"複数人比較（3人以上）" },
  ko: { title:"궁합 분석",subtitle:"우주적 연결을 발견하세요",badge:"소울메이트 찾기",intro:"출생 데이터 기반 전문 시나스트리 분석.",quickTitle:"빠른 별자리 매칭",quickDesc:"두 별자리를 선택하여 기본 궁합 확인",fullTitle:"전체 시나스트리 분석",fullDesc:"출생 시간과 장소를 입력하여 정확한 행성 각도 비교",cta:"분석 시작",quickHint:"별자리를 클릭하여 상세 보기, 또는 아래에 출생 정보 입력",multiCompare:"다인 비교 (3인 이상)" },
};

const FEATURES: Record<string, string[]> = {
  zh: ["行星相位对比","关系宫位分析","契合度评分","互动模式解读"],
  en: ["Planetary Aspects","House Analysis","Compatibility Score","Dynamic Reading"],
  id: ["Perbandingan Aspek","Analisis Rumah","Skor Kecocokan","Bacaan Dinamis"],
  th: ["เปรียบเทียบมุมดาว","วิเคราะห์บ้าน","คะแนนความเข้ากัน","การอ่านแบบไดนามิก"],
  vi: ["So Sánh Góc Chiếu","Phân Tích Nhà","Điểm Tương Hợp","Đọc Động"],
  ms: ["Perbandingan Aspek","Analisis Rumah","Skor Keserasian","Bacaan Dinamik"],
  ja: ["惑星アスペクト比較","ハウス分析","相性スコア","動的リーディング"],
  ko: ["행성 각도 비교","하우스 분석","궁합 점수","동적 해석"],
};

export default function CompatibilityPage() {
  const { language } = useLanguage();
  const lang = language || "zh";
  const t = T[lang] || T.zh;
  const feats = FEATURES[lang] || FEATURES.zh;
  const zodiacs = ZODIAC[lang] || ZODIAC.zh;
  const slugs = ["aries","taurus","gemini","cancer","leo","virgo","libra","scorpio","sagittarius","capricorn","aquarius","pisces"];

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600 mb-4">
            <HeartHandshake size={16} />
            {t.badge}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t.title}</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">{t.subtitle}</p>
          <p className="text-gray-400 max-w-xl mx-auto mt-4 text-sm leading-relaxed">{t.intro}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-12 max-w-3xl mx-auto">
          {feats.map((f, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-gray-100" style={{boxShadow:"0px 0px 0px 1px rgba(0,0,0,0.08), 0px 2px 4px rgba(0,0,0,0.04)"}}>
              <CheckCircle size={16} className="text-gray-400 shrink-0" />
              <span className="text-sm text-gray-600">{f}</span>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mb-16 p-8 bg-gradient-to-r from-gray-50 to-gray-50 rounded-2xl border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Star size={20} className="text-gray-500 fill-gray-500" />
            {t.quickTitle}
          </h2>
          <p className="text-sm text-gray-500 mb-6">{t.quickDesc}</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
            {zodiacs.map((sign, i) => (
              <Link key={i} href={`/zodiac/${slugs[i]}`}
                className="px-3 py-2 bg-white rounded-lg border border-gray-200 text-center text-sm text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >{sign}</Link>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center">{t.quickHint}</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.fullTitle}</h2>
            <p className="text-gray-500">{t.fullDesc}</p>
          </div>
          <SynastryChart language={language as "id" | "en" | "zh"} />
        </div>

        <div className="text-center mt-16 pb-8">
          <Link href="/compare" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 transition-colors">
            {t.multiCompare}<ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}
