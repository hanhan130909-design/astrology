"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { appendReferral } from "@/components/ReferralTracker";
import { Lock, Sparkles, ShieldCheck, Heart, AlertTriangle } from "lucide-react";

const GUMLINKS = {
  single: "https://hanhan55.gumroad.com/l/zgbent",
  fortune: "https://hanhan55.gumroad.com/l/zxccdv",
};

const UI = {
  zh: {
    highTitle: "你们的合盘分数很高！",
    highDesc: "免费合盘只看了五行和十神的表面匹配。AI深度合盘会告诉你：你们的核心矛盾是什么？什么时候容易吵架？怎么化解？结婚的最佳时机？",
    lowTitle: "你们的合盘有挑战",
    lowDesc: "分数不代表一切，但低分会暴露真实的矛盾点。AI深度合盘会精准定位：你们最大的冲突在哪？是性格不合还是时机不对？怎么调整才能走下去？",
    midTitle: "你们的配对有潜力也有挑战",
    midDesc: "中等分数说明你们既有吸引力也有摩擦。AI深度合盘会告诉你：哪些地方是天生互补？哪些地方需要刻意经营？怎么把磨合变成默契？",
    previewTitle: "AI深度合盘报告包含",
    previewItems: ["核心矛盾深度分析", "吵架高发期预测", "化解冲突的具体方法", "结婚/分手最佳时机", "双方大运匹配度"],
    locked: "🔒 付费解锁",
    btn: "解锁AI深度合盘 · $19.99",
    originalPrice: "$29.99",
    badge: "限时优惠",
    singleBtn: "AI单次解读 · $3.99",
    guarantee: "7天无理由退款",
    social: "1,200+ 对情侣已解锁",
  },
  en: {
    highTitle: "Your compatibility score is high!",
    highDesc: "Free synastry only shows surface element matching. AI Deep Reading reveals: What's your core conflict? When do you fight most? How to resolve it? Best timing for marriage?",
    lowTitle: "Your chart has challenges",
    lowDesc: "Score isn't everything, but low scores expose real friction points. AI Deep Reading pinpoints: What's your biggest conflict? Personality or timing? How to adjust and make it work?",
    midTitle: "Your match has potential and challenges",
    midDesc: "A medium score means attraction AND friction. AI Deep Reading tells you: Where are you naturally complementary? Where do you need deliberate effort? How to turn friction into默契?",
    previewTitle: "AI Deep Compatibility Report Includes",
    previewItems: ["Core conflict analysis", "Fight-prone periods", "Conflict resolution methods", "Best timing for marriage/breakup", "Luck cycle compatibility"],
    locked: "🔒 Paid Unlock",
    btn: "Unlock AI Deep Reading · $19.99",
    originalPrice: "$29.99",
    badge: "Limited Offer",
    singleBtn: "AI Single Reading · $3.99",
    guarantee: "7-Day Money Back",
    social: "1,200+ couples unlocked",
  },
  id: { highTitle: "Skor kompatibilitas Anda tinggi!", highDesc: "Sinastri gratis hanya menunjukkan kecocokan permukaan. AI memberitahu: Konflik inti apa? Kapan sering bertengkar? Bagaimana mengatasi?", lowTitle: "Bagan Anda memiliki tantangan", lowDesc: "Skor rendah mengekspos titik gesekan nyata. AI menemukan: Konflik terbesar apa? Bagaimana menyesuaikan?", midTitle: "Pasangan Anda punya potensi dan tantangan", midDesc: "Skor menengah berarti daya tarik DAN gesekan. AI memberitahu: Di mana Anda saling melengkapi?", previewTitle: "Laporan Kompatibilitas AI", previewItems: ["Analisis konflik inti", "Periode rawan bertengkar", "Cara mengatasi konflik", "Waktu terbaik menikah", "Kecocokan siklus keberuntungan"], locked: "🔒 Terkunci", btn: "Buka AI Reading · $19.99", originalPrice: "$29.99", badge: "Promo", singleBtn: "AI Sekali · $3.99", guarantee: "Garansi 7 Hari", social: "1,200+ pasangan" },
  th: { highTitle: "คะแนนความเข้ากันสูง!", highDesc: "ซินาสตรีฟรีแค่ผิวเผิน AI บอก: ข้อขัดแย้งหลัก? เมื่อไหร่ทะเลาะกันบ่อย? จะแก้ยังไง?", lowTitle: "ตารางมีข้อท้าทาย", lowDesc: "คะแนนต่ำเปิดเผยจุดเสียดสี AI หา: ข้อขัดแย้งใหญ่สุด? จะปรับยังไง?", midTitle: "คู่มีศักยภาพและข้อท้าทาย", midDesc: "คะแนนกลางหมายถึงดึงดูดและเสียดสี AI บอก: อะไรที่คุณเติมเต็มกัน?", previewTitle: "รายงานความเข้ากัน AI", previewItems: ["วิเคราะห์ข้อขัดแย้งหลัก", "ช่วงที่ทะเลาะง่าย", "วิธีแก้ความขัดแย้ง", "เวลาแต่งงานที่ดีที่สุด", "ความเข้ากันวัฏจักรโชค"], locked: "🔒 ล็อก", btn: "ปลดล็อก AI · $19.99", originalPrice: "$29.99", badge: "โปรโมชั่น", singleBtn: "AI ครั้งเดียว · $3.99", guarantee: "คืนเงิน 7 วัน", social: "1,200+ คู่รัก" },
  vi: { highTitle: "Điểm hợp nhau cao!", highDesc: "Hợp bản miễn phí chỉ bề mặt AI nói: Mâu thuẫn cốt lõi? Khi nào hay cãi nhau? Làm sao giải quyết?", lowTitle: "Bản có thách thức", lowDesc: "Điểm thấp lộ điểm xung đột AI tìm: Xung đột lớn nhất? Làm sao điều chỉnh?", midTitle: "Cặp có tiềm năng và thách thức", midDesc: "Điểm trung bình nghĩa là thu hút và xung đột AI nói: Đâu là nơi bổ sung?", previewTitle: "Báo cáo Hợp bản AI", previewItems: ["Phân tích mâu thuẫn cốt lõi", "Giai đoạn hay cãi nhau", "Cách giải quyết xung đột", "Thời điểm kết hợp lý tưởng", "Mức hợp vận hạn"], locked: "🔒 Khóa", btn: "Mở khóa AI · $19.99", originalPrice: "$29.99", badge: "Khuyến mãi", singleBtn: "AI một lần · $3.99", guarantee: "Hoàn tiền 7 ngày", social: "1,200+ cặp đôi" },
  ms: { highTitle: "Skor keserasian tinggi!", highDesc: "Sinastri percuma hanya permukaan AI beritahu: Konflik teras? Bila kerap bergaduh? Bagaimana atasi?", lowTitle: "Carta ada cabaran", lowDesc: "Skor rendah dedahkan titik geseran AI cari: Konflik terbesar? Bagaimana menyesuaikan?", midTitle: "Pasangan ada potensi dan cabaran", midDesc: "Skor pertengahan bermaksud tarikan dan geseran AI beritahu: Mana anda saling lengkapi?", previewTitle: "Laporan Keserasian AI", previewItems: ["Analisis konflik teras", "Tempoh rawan bergaduh", "Cara atasi konflik", "Masa terbaik berkahwin", "Keserasian kitaran tuah"], locked: "🔒 Berkunci", btn: "Buka AI · $19.99", originalPrice: "$29.99", badge: "Promosi", singleBtn: "AI sekali · $3.99", guarantee: "Jaminan 7 Hari", social: "1,200+ pasangan" },
  ja: { highTitle: "相性スコアが高い！", highDesc: "無料の相性は表面だけ AIが明かす：核心の矛盾は？喧嘩しやすい時期は？解決法は？結婚のベストタイミングは？", lowTitle: "チャートに課題あり", lowDesc: "低スコアは本当の摩擦点を露呈 AIが特定：最大の紛争は？性格かタイミングか？どう調整する？", midTitle: "相性には可能性と課題の両方", midDesc: "中間スコアは魅力と摩擦の両方 AIが告げる：どこが天然の補完？どこに努力が必要？", previewTitle: "AI深層相性レポート", previewItems: ["核心矛盾の分析", "喧嘩しやすい時期", "紛争解決法", "結婚/別れのベストタイミング", "運気周期の相性"], locked: "🔒 ロック中", btn: "AI深層リーディング解除 · $19.99", originalPrice: "$29.99", badge: "期間限定", singleBtn: "AI単回 · $3.99", guarantee: "7日間返金保証", social: "1,200組以上が解除" },
  ko: { highTitle: "궁합 점수가 높아요!", highDesc: "무료 합판은 표면만 AI가 밝힙니다: 핵심 갈등은? 언제 자주 다투나요? 어떻게 풀까요? 결혼 최적기는?", lowTitle: "차트에 도전 과제", lowDesc: "낮은 점수는 진짜 마찰점을 노출 AI가 찾습니다: 가장 큰 갈등은? 성격인가 타이밍인가?", midTitle: "커플에게 잠재력과 도전이 모두", midDesc: "중간 점수는 매력과 마찰 둘 다 AI가 말합니다: 어디가 천생 보완인가?", previewTitle: "AI 심층 궁합 리포트", previewItems: ["핵심 갈등 분석", "다투기 쉬운 시기", "갈등 해결법", "결혼/이별 최적기", "운기 주기 궁합"], locked: "🔒 잠김", btn: "AI 심층 리딩 잠금해제 · $19.99", originalPrice: "$29.99", badge: "한정 할인", singleBtn: "AI 단독 · $3.99", guarantee: "7일 환불 보장", social: "1,200커플 이상 해제" },
};

export default function CompatibilityPurchaseCTA({ score }: { score?: number }) {
  const { language } = useLanguage();
  const lang = language || "zh";
  const ui = UI[lang] || UI.en;

  const s = score ?? 60;
  const isHigh = s >= 75;
  const isLow = s < 55;

  const title = isHigh ? ui.highTitle : isLow ? ui.lowTitle : ui.midTitle;
  const desc = isHigh ? ui.highDesc : isLow ? ui.lowDesc : ui.midDesc;
  const bgColor = isHigh ? "#dcfce7" : isLow ? "#fee2e2" : "#fef3c7";
  const borderColor = isHigh ? "#22c55e" : isLow ? "#ef4444" : "#f59e0b";

  const mainLink = appendReferral(GUMLINKS.fortune);
  const singleLink = appendReferral(GUMLINKS.single);

  return (
    <div className="mt-6 mb-4" style={{ maxWidth: 600 }}>
      <div
        className="relative p-5 rounded-2xl border overflow-hidden"
        style={{ background: bgColor, borderColor }}
      >
        <div className="flex items-center gap-2 mb-3">
          {isHigh ? <Heart size={18} className="text-green-600" /> : isLow ? <AlertTriangle size={18} className="text-red-500" /> : <Sparkles size={18} className="text-amber-600" />}
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">{desc}</p>

        {/* 模糊预览 */}
        <div className="relative bg-white/70 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1">
              <Sparkles size={12} className="text-amber-500" />
              {ui.previewTitle}
            </h4>
            <span className="text-[10px] text-gray-400">{ui.locked}</span>
          </div>
          <div className="space-y-2" style={{ filter: "blur(3px)", userSelect: "none", pointerEvents: "none" }}>
            {ui.previewItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                <span className="text-xs text-gray-600">{item}</span>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent rounded-xl pointer-events-none" />
        </div>

        {/* 购买按钮 */}
        <div className="space-y-2">
          <a
            href={mainLink}
            target="_blank"
            rel="noopener"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            style={{ background: "linear-gradient(135deg, #171717 0%, #374151 100%)", boxShadow: "0 4px 14px rgba(0,0,0,0.25)" }}
          >
            <Lock size={14} />
            {ui.btn}
            <span className="flex items-center gap-1 ml-1">
              <span className="text-[10px] line-through opacity-60">{ui.originalPrice}</span>
              <span className="text-[10px] bg-red-500 px-1.5 py-0.5 rounded-full">{ui.badge}</span>
            </span>
          </a>
          <a
            href={singleLink}
            target="_blank"
            rel="noopener"
            className="flex items-center justify-center gap-1 w-full py-2 rounded-xl text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-white/50 transition-colors"
          >
            {ui.singleBtn}
          </a>
        </div>

        <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-gray-500">
          <span className="flex items-center gap-1"><ShieldCheck size={11} />{ui.guarantee}</span>
          <span className="w-px h-3 bg-gray-400" />
          <span>{ui.social}</span>
        </div>
      </div>
    </div>
  );
}
