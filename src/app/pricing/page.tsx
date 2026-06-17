"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check, Sparkles, Star, Zap } from "lucide-react";

const T: Record<string, any> = {
  zh: {
    badge: "PRO", hero: "解锁你的完整命盘", heroSub: "基础排盘永久免费。一次性付费，终身访问，无需订阅。",
    free: "基础版", freePrice: "免费", freeDesc: "永久免费，无需注册",
    freeFeats: ["本命星盘分析", "八字四柱排盘", "每日运势", "塔罗占卜", "行运追踪", "基础社区"],
    freeCta: "免费开始",
    compatibility: "合盘分析", compPrice: "$19.99", compDesc: "一次性付费，永久访问",
    compFeats: ["✅ 全部基础功能", "双人八字合盘", "十神配对分析", "五行互补解读", "关系发展趋势", "PDF报告下载"],
    compCta: "购买合盘 ($19.99)",
    fortune: "年运报告", fortunePrice: "$29.99", fortuneDesc: "一次性付费，永久访问", fortuneBadge: "最受欢迎",
    fortuneFeats: ["✅ 全部基础功能", "✅ 合盘分析", "2026丙午年完整年运", "12个月逐月运势", "大运流年深度解读", "AI解读（每月30次）", "财运/事业/感情专项"],
    fortuneCta: "购买年运 ($29.99)",
    fate: "终身命书", fatePrice: "$39.99", fateDesc: "一次性付费，永久访问",
    fateFeats: ["✅ 全部基础功能", "✅ 合盘分析", "✅ 年运报告", "终身八字命盘深度解读", "AI无限次对话", "十年大运详细分析", "五行能量平衡方案", "优先新功能体验"],
    fateCta: "购买命书 ($39.99)",
    faqTitle: "常见问题",
    faqs: [
      { q: "一次性付费和订阅有什么区别？", a: "一次性付费意味着你只需支付一次，就可以永久访问对应功能。不需要每月续费，也不会被自动扣款。" },
      { q: "可以升级吗？", a: "可以。如果你购买了合盘分析（$19.99），之后想升级到年运报告，只需补差价 $10 即可。" },
      { q: "支持哪些支付方式？", a: "目前支持信用卡和 Google Pay。更多支付方式即将上线。" },
      { q: "AI解读用的是什么模型？", a: "我们使用 Groq 的 Llama 3.3 70B 和 DeepSeek 作为后备，结合专业八字知识库进行深度解读。" },
      { q: "购买后不满意可以退款吗？", a: "购买后7天内，如果你对解读不满意，可以申请全额退款。" },
    ],
  },
  en: {
    badge: "PRO", hero: "Unlock Your Complete Chart", heroSub: "Basic charts are free forever. One-time payment, lifetime access, no subscription.",
    free: "Basic", freePrice: "Free", freeDesc: "Free forever, no sign-up",
    freeFeats: ["Natal Chart Analysis", "BaZi Four Pillars", "Daily Horoscope", "Tarot Reading", "Transit Tracking", "Basic Community"],
    freeCta: "Start Free",
    compatibility: "Compatibility", compPrice: "$19.99", compDesc: "One-time payment, lifetime access",
    compFeats: ["✅ All Basic Features", "Dual BaZi Synastry", "Ten Gods Pairing", "Five Elements Balance", "Relationship Forecast", "PDF Report Download"],
    compCta: "Buy Compatibility ($19.99)",
    fortune: "Fortune Book", fortunePrice: "$29.99", fortuneDesc: "One-time payment, lifetime access", fortuneBadge: "Most Popular",
    fortuneFeats: ["✅ All Basic Features", "✅ Compatibility", "2026 Year of Horse Full Forecast", "12 Monthly Breakdowns", "Luck Cycle Deep Dive", "AI Reading (30/month)", "Career/Wealth/Love Focus"],
    fortuneCta: "Buy Fortune Book ($29.99)",
    fate: "Book of Fate", fatePrice: "$39.99", fateDesc: "One-time payment, lifetime access",
    fateFeats: ["✅ All Basic Features", "✅ Compatibility", "✅ Fortune Book", "Lifetime BaZi Deep Reading", "Unlimited AI Chat", "10-Year Luck Cycle Detail", "Five Elements Balance Plan", "Early Access to New Features"],
    fateCta: "Buy Book of Fate ($39.99)",
    faqTitle: "FAQ",
    faqs: [
      { q: "What's the difference between one-time and subscription?", a: "One-time payment means you pay once and get lifetime access. No monthly bills, no auto-renewals." },
      { q: "Can I upgrade later?", a: "Yes. If you bought Compatibility ($19.99) and want to upgrade to Fortune Book, you only pay the $10 difference." },
      { q: "What payment methods are supported?", a: "Currently credit card and Google Pay. More options coming soon." },
      { q: "Which AI model is used?", a: "We use Groq's Llama 3.3 70B with DeepSeek as fallback, combined with our professional BaZi knowledge base." },
      { q: "What if I'm not satisfied?", a: "7-day money-back guarantee. If you're not happy with your reading, request a full refund." },
    ],
  },
  id: {
    badge: "PRO", hero: "Buka Bagan Lengkap Anda", heroSub: "Bagan dasar gratis selamanya. Pembayaran sekali, akses seumur hidup, tanpa langganan.",
    free: "Basic", freePrice: "Gratis", freeDesc: "Gratis selamanya, tanpa daftar",
    freeFeats: ["Analisis Bagan Lahir", "BaZi Empat Pilar", "Horoskop Harian", "Bacaan Tarot", "Pelacakan Transit", "Komunitas Dasar"],
    freeCta: "Mulai Gratis",
    compatibility: "Kompatibilitas", compPrice: "$19.99", compDesc: "Bayar sekali, akses seumur hidup",
    compFeats: ["✅ Semua Fitur Basic", "Synastry BaZi Ganda", "Analisis Sepuluh Dewa", "Keseimbangan Lima Elemen", "Ramalan Hubungan", "Unduh Laporan PDF"],
    compCta: "Beli Kompatibilitas ($19.99)",
    fortune: "Buku Ramalan", fortunePrice: "$29.99", fortuneDesc: "Bayar sekali, akses seumur hidup", fortuneBadge: "Paling Populer",
    fortuneFeats: ["✅ Semua Fitur Basic", "✅ Kompatibilitas", "Ramalan Lengkap 2026 Kuda Api", "12 Rincian Bulanan", "Siklus Keberuntungan Mendalam", "AI Reading (30/bulan)", "Fokus Karir/Keuangan/Cinta"],
    fortuneCta: "Beli Buku Ramalan ($29.99)",
    fate: "Buku Takdir", fatePrice: "$39.99", fateDesc: "Bayar sekali, akses seumur hidup",
    fateFeats: ["✅ Semua Fitur Basic", "✅ Kompatibilitas", "✅ Buku Ramalan", "Bacaan BaZi Seumur Hidup", "AI Chat Tak Terbatas", "Detail Siklus 10 Tahun", "Rencana Lima Elemen", "Akses Awal Fitur Baru"],
    fateCta: "Beli Buku Takdir ($39.99)",
    faqTitle: "FAQ",
    faqs: [
      { q: "Apa bedanya pembayaran sekali dan langganan?", a: "Pembayaran sekali berarti Anda bayar sekali dan dapat akses seumur hidup. Tanpa tagihan bulanan, tanpa perpanjangan otomatis." },
      { q: "Bisa upgrade nanti?", a: "Ya. Jika Anda membeli Kompatibilitas ($19.99) dan ingin upgrade ke Buku Ramalan, cukup bayar selisih $10." },
      { q: "Metode pembayaran apa yang didukung?", a: "Saat ini kartu kredit dan Google Pay. Opsi lainnya segera hadir." },
      { q: "Model AI apa yang digunakan?", a: "Kami menggunakan Llama 3.3 70B dari Groq dengan DeepSeek sebagai cadangan, dikombinasikan dengan basis pengetahuan BaZi profesional." },
      { q: "Bagaimana jika tidak puas?", a: "Garansi uang kembali 7 hari. Jika tidak puas dengan bacaan, minta pengembalian dana penuh." },
    ],
  },
  th: {
    badge: "PRO", hero: "ปลดล็อกดวงชะตาฉบับสมบูรณ์", heroSub: "แผนภูมิพื้นฐานฟรีตลอดไป จ่ายครั้งเดียว เข้าถึงตลอดชีพ ไม่มีค่าสมาชิก",
    free: "พื้นฐาน", freePrice: "ฟรี", freeDesc: "ฟรีตลอดไป ไม่ต้องลงทะเบียน",
    freeFeats: ["วิเคราะห์แผนภูมิเกิด", "ปาจื่อสี่เสา", "ดูดวงรายวัน", "ไพ่ทาโรต์", "ติดตามดาว", "ชุมชนพื้นฐาน"],
    freeCta: "เริ่มฟรี",
    compatibility: "ความเข้ากัน", compPrice: "$19.99", compDesc: "จ่ายครั้งเดียว เข้าถึงตลอดชีพ",
    compFeats: ["✅ ทุกฟีเจอร์พื้นฐาน", "ซินแอสทรีปาจื่อคู่", "วิเคราะห์เทพสิบ", "สมดุลห้าธาตุ", "พยากรณ์ความสัมพันธ์", "ดาวน์โหลดรายงาน PDF"],
    compCta: "ซื้อความเข้ากัน ($19.99)",
    fortune: "หนังสือดวง", fortunePrice: "$29.99", fortuneDesc: "จ่ายครั้งเดียว เข้าถึงตลอดชีพ", fortuneBadge: "นิยมที่สุด",
    fortuneFeats: ["✅ ทุกฟีเจอร์พื้นฐาน", "✅ ความเข้ากัน", "พยากรณ์เต็มปี 2026 ปีม้าไฟ", "วิเคราะห์ 12 เดือน", "วัฏจักรดวงเชิงลึก", "AI อ่านดวง (30/เดือน)", "โฟกัสการงาน/เงิน/รัก"],
    fortuneCta: "ซื้อหนังสือดวง ($29.99)",
    fate: "หนังสือโชคชะตา", fatePrice: "$39.99", fateDesc: "จ่ายครั้งเดียว เข้าถึงตลอดชีพ",
    fateFeats: ["✅ ทุกฟีเจอร์พื้นฐาน", "✅ ความเข้ากัน", "✅ หนังสือดวง", "อ่านปาจื่อเชิงลึกตลอดชีพ", "AI แชทไม่จำกัด", "รายละเอียดวัฏจักร 10 ปี", "แผนสมดุลห้าธาตุ", "เข้าถึงฟีเจอร์ใหม่ก่อนใคร"],
    fateCta: "ซื้อหนังสือโชคชะตา ($39.99)",
    faqTitle: "คำถามที่พบบ่อย",
    faqs: [
      { q: "จ่ายครั้งเดียวต่างจากสมาชิกอย่างไร?", a: "จ่ายครั้งเดียวหมายความว่าคุณจ่ายเพียงครั้งเดียวและเข้าถึงได้ตลอดชีพ ไม่มีบิลรายเดือน ไม่มีการต่ออายุอัตโนมัติ" },
      { q: "อัปเกรดทีหลังได้ไหม?", a: "ได้ หากคุณซื้อความเข้ากัน ($19.99) และต้องการอัปเกรดเป็นหนังสือดวง จ่ายเพิ่มเพียง $10" },
      { q: "รับชำระเงินด้วยวิธีใดบ้าง?", a: "ปัจจุบันรับบัตรเครดิตและ Google Pay ตัวเลือกเพิ่มเติมกำลังจะมา" },
      { q: "ใช้โมเดล AI อะไร?", a: "เราใช้ Llama 3.3 70B ของ Groq พร้อม DeepSeek เป็นตัวสำรอง รวมกับฐานความรู้ปาจื่อมืออาชีพ" },
      { q: "หากไม่พอใจ?", a: "รับประกันคืนเงิน 7 วัน หากไม่พอใจกับการอ่าน สามารถขอคืนเงินเต็มจำนวน" },
    ],
  },
  vi: {
    badge: "PRO", hero: "Mở Khóa Lá Số Hoàn Chỉnh", heroSub: "Biểu đồ cơ bản miễn phí mãi mãi. Thanh toán một lần, truy cập trọn đời, không đăng ký.",
    free: "Cơ bản", freePrice: "Miễn phí", freeDesc: "Miễn phí mãi mãi, không cần đăng ký",
    freeFeats: ["Phân tích bản đồ sao", "Bát Tự Tứ Trụ", "Tử vi hàng ngày", "Tarot", "Theo dõi quá cảnh", "Cộng đồng cơ bản"],
    freeCta: "Bắt đầu miễn phí",
    compatibility: "Tương hợp", compPrice: "$19.99", compDesc: "Thanh toán một lần, truy cập trọn đời",
    compFeats: ["✅ Tất cả tính năng cơ bản", "Bát Tự đôi Synastry", "Phân tích Thập Thần", "Cân bằng Ngũ Hành", "Dự báo quan hệ", "Tải báo cáo PDF"],
    compCta: "Mua Tương hợp ($19.99)",
    fortune: "Sách Vận", fortunePrice: "$29.99", fortuneDesc: "Thanh toán một lần, truy cập trọn đời", fortuneBadge: "Phổ biến nhất",
    fortuneFeats: ["✅ Tất cả tính năng cơ bản", "✅ Tương hợp", "Dự báo đầy đủ 2026 Ngọ Hỏa", "12 tháng chi tiết", "Đại vận chuyên sâu", "AI giải mã (30/tháng)", "Tập trung Sự nghiệp/Tài/Lộc"],
    fortuneCta: "Mua Sách Vận ($29.99)",
    fate: "Sách Mệnh", fatePrice: "$39.99", fateDesc: "Thanh toán một lần, truy cập trọn đời",
    fateFeats: ["✅ Tất cả tính năng cơ bản", "✅ Tương hợp", "✅ Sách Vận", "Giải mã Bát Tự trọn đời", "AI Chat không giới hạn", "Chi tiết Đại vận 10 năm", "Kế hoạch Ngũ Hành", "Truy cập sớm tính năng mới"],
    fateCta: "Mua Sách Mệnh ($39.99)",
    faqTitle: "Câu hỏi thường gặp",
    faqs: [
      { q: "Thanh toán một lần khác gì đăng ký?", a: "Thanh toán một lần nghĩa là bạn trả một lần và truy cập trọn đời. Không hóa đơn hàng tháng, không gia hạn tự động." },
      { q: "Có thể nâng cấp sau không?", a: "Có. Nếu bạn đã mua Tương hợp ($19.99) và muốn nâng cấp lên Sách Vận, chỉ cần trả thêm $10." },
      { q: "Hỗ trợ phương thức thanh toán nào?", a: "Hiện tại thẻ tín dụng và Google Pay. Thêm tùy chọn sắp ra mắt." },
      { q: "Dùng mô hình AI nào?", a: "Chúng tôi dùng Llama 3.3 70B của Groq với DeepSeek dự phòng, kết hợp cơ sở tri thức Bát Tự chuyên nghiệp." },
      { q: "Không hài lòng thì sao?", a: "Bảo đảm hoàn tiền 7 ngày. Nếu không hài lòng, yêu cầu hoàn tiền đầy đủ." },
    ],
  },
  ms: {
    badge: "PRO", hero: "Buka Carta Lengkap Anda", heroSub: "Carta asas percuma selamanya. Bayaran sekali, akses seumur hidup, tiada langganan.",
    free: "Asas", freePrice: "Percuma", freeDesc: "Percuma selamanya, tiada daftar",
    freeFeats: ["Analisis Carta Lahir", "BaZi Empat Tiang", "Horoskop Harian", "Bacaan Tarot", "Pengesanan Transit", "Komuniti Asas"],
    freeCta: "Mula Percuma",
    compatibility: "Keserasian", compPrice: "$19.99", compDesc: "Bayar sekali, akses seumur hidup",
    compFeats: ["✅ Semua Ciri Asas", "Synastry BaZi Berganda", "Analisis Sepuluh Dewa", "Keseimbangan Lima Unsur", "Ramalan Hubungan", "Muat Turun Laporan PDF"],
    compCta: "Beli Keserasian ($19.99)",
    fortune: "Buku Nasib", fortunePrice: "$29.99", fortuneDesc: "Bayar sekali, akses seumur hidup", fortuneBadge: "Paling Popular",
    fortuneFeats: ["✅ Semua Ciri Asas", "✅ Keserasian", "Ramalan Penuh 2026 Kuda Api", "12 Perincian Bulanan", "Kitaran Nasib Mendalam", "AI Bacaan (30/bulan)", "Fokus Kerjaya/Kewangan/Cinta"],
    fortuneCta: "Beli Buku Nasib ($29.99)",
    fate: "Buku Takdir", fatePrice: "$39.99", fateDesc: "Bayar sekali, akses seumur hidup",
    fateFeats: ["✅ Semua Ciri Asas", "✅ Keserasian", "✅ Buku Nasib", "Bacaan BaZi Sepanjang Hayat", "AI Chat Tanpa Had", "Perincian Kitaran 10 Tahun", "Pelan Lima Unsur", "Akses Awal Ciri Baru"],
    fateCta: "Beli Buku Takdir ($39.99)",
    faqTitle: "Soalan Lazim",
    faqs: [
      { q: "Apa beza bayaran sekali dan langganan?", a: "Bayaran sekali bermakna anda bayar sekali dan dapat akses seumur hidup. Tiada bil bulanan, tiada pembaharuan automatik." },
      { q: "Boleh naik taraf kemudian?", a: "Ya. Jika anda beli Keserasian ($19.99) dan mahu naik taraf ke Buku Nasib, hanya bayar beza $10." },
      { q: "Kaedah pembayaran apa yang disokong?", a: "Kini kad kredit dan Google Pay. Lagi pilihan akan datang." },
      { q: "Model AI apa yang digunakan?", a: "Kami guna Llama 3.3 70B Groq dengan DeepSeek sebagai sandaran, digabung dengan pangkalan pengetahuan BaZi profesional." },
      { q: "Bagaimana jika tak puas hati?", a: "Jaminan wang dikembalikan 7 hari. Jika tak puas hati, minta bayaran balik penuh." },
    ],
  },
  ja: {
    badge: "PRO", hero: "完全な命盤をアンロック", heroSub: "基本チャートは永久無料。一回払い、生涯アクセス、サブスク不要。",
    free: "基本", freePrice: "無料", freeDesc: "永久無料、登録不要",
    freeFeats: ["出生図分析", "八字四柱", "デイリー運勢", "タロット", "トランジット追跡", "基本コミュニティ"],
    freeCta: "無料で始める",
    compatibility: "相性診断", compPrice: "$19.99", compDesc: "一回払い、生涯アクセス",
    compFeats: ["✅ 全基本機能", "デュアル八字シナストリー", "十神ペアリング", "五行バランス", "関係予測", "PDFレポート"],
    compCta: "相性診断を購入 ($19.99)",
    fortune: "運勢ブック", fortunePrice: "$29.99", fortuneDesc: "一回払い、生涯アクセス", fortuneBadge: "人気No.1",
    fortuneFeats: ["✅ 全基本機能", "✅ 相性診断", "2026丙午年完全予測", "12ヶ月詳細", "大運サイクル深掘り", "AIリーディング (30回/月)", "キャリア/財運/恋愛特化"],
    fortuneCta: "運勢ブックを購入 ($29.99)",
    fate: "天命ブック", fatePrice: "$39.99", fateDesc: "一回払い、生涯アクセス",
    fateFeats: ["✅ 全基本機能", "✅ 相性診断", "✅ 運勢ブック", "生涯八字深層解読", "無制限AIチャット", "10年大運詳細", "五行バランス計画", "新機能アーリーアクセス"],
    fateCta: "天命ブックを購入 ($39.99)",
    faqTitle: "よくある質問",
    faqs: [
      { q: "一回払いとサブスクの違いは？", a: "一回払いは一度の支払いで生涯アクセス。毎月の請求や自動更新はありません。" },
      { q: "後でアップグレードできますか？", a: "はい。相性診断（$19.99）を購入後、運勢ブックにアップグレードする場合は差額$10のみ。" },
      { q: "対応する支払い方法は？", a: "現在クレジットカードとGoogle Pay。その他のオプションも近日対応。" },
      { q: "どのAIモデルを使用していますか？", a: "GroqのLlama 3.3 70Bをメインに、DeepSeekをバックアップとして使用。専門の八字知識ベースと組み合わせています。" },
      { q: "満足できない場合は？", a: "7日間返金保証。ご満足いただけない場合は全額返金をリクエストできます。" },
    ],
  },
  ko: {
    badge: "PRO", hero: "완전한 사주를 해제하세요", heroSub: "기본 차트는 영원히 무료. 일회성 결제, 평생 이용, 구독 없음.",
    free: "기본", freePrice: "무료", freeDesc: "영원히 무료, 가입 불필요",
    freeFeats: ["출생 차트 분석", "사주 팔자", "일일 운세", "타로", "행성 이동 추적", "기본 커뮤니티"],
    freeCta: "무료 시작",
    compatibility: "궁합 분석", compPrice: "$19.99", compDesc: "한 번 결제, 평생 이용",
    compFeats: ["✅ 모든 기본 기능", "듀얼 사주 시내스트리", "십신 페어링", "오행 밸런스", "관계 예측", "PDF 리포트 다운로드"],
    compCta: "궁합 구매 ($19.99)",
    fortune: "운세 북", fortunePrice: "$29.99", fortuneDesc: "한 번 결제, 평생 이용", fortuneBadge: "가장 인기",
    fortuneFeats: ["✅ 모든 기본 기능", "✅ 궁합 분석", "2026 병오년 완전 예측", "12개월 상세", "대운 사이클 심층", "AI 해석 (30회/월)", "직업/재물/연애 집중"],
    fortuneCta: "운세 북 구매 ($29.99)",
    fate: "명서", fatePrice: "$39.99", fateDesc: "한 번 결제, 평생 이용",
    fateFeats: ["✅ 모든 기본 기능", "✅ 궁합 분석", "✅ 운세 북", "평생 사주 심층 해석", "무제한 AI 채팅", "10년 대운 상세", "오행 밸런스 계획", "신기능 얼리 액세스"],
    fateCta: "명서 구매 ($39.99)",
    faqTitle: "자주 묻는 질문",
    faqs: [
      { q: "일회성 결제와 구독의 차이는?", a: "일회성 결제는 한 번 지불하고 평생 이용. 월간 청구서나 자동 갱신이 없습니다." },
      { q: "나중에 업그레이드할 수 있나요?", a: "네. 궁합($19.99)을 구매한 후 운세 북으로 업그레이드하려면 차액 $10만 지불하면 됩니다." },
      { q: "어떤 결제 수단을 지원하나요?", a: "현재 신용카드와 Google Pay. 더 많은 옵션이 곧 제공됩니다." },
      { q: "어떤 AI 모델을 사용하나요?", a: "Groq의 Llama 3.3 70B를 주로 사용하고 DeepSeek를 백업으로 사용합니다. 전문 사주 지식 베이스와 결합되어 있습니다." },
      { q: "만족하지 못하면?", a: "7일 환불 보장. 해석에 만족하지 못하면 전액 환불을 요청하세요." },
    ],
  },
};

const tiers = ["free", "compatibility", "fortune", "fate"] as const;

export default function PricingPage() {
  const { language } = useLanguage();
  const t = T[language] || T.en;

  const keyMap: Record<string, string> = { free: "free", compatibility: "comp", fortune: "fortune", fate: "fate" };
  const cards = tiers.map((key) => {
    const k = keyMap[key] || key;
    return {
    key,
    name: t[k],
    price: t[`${k}Price`],
    desc: t[`${k}Desc`] || "",
    feats: t[`${k}Feats`],
    cta: t[`${k}Cta`],
    badge: t[`${k}Badge`] || "",
    highlighted: key === "fortune",
    isFree: key === "free",
  };});

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      <main className="max-w-[1100px] mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-[11px] font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
            {t.badge}
          </span>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-[-1.5px] mb-3">{t.hero}</h1>
          <p className="text-gray-500 max-w-lg mx-auto text-sm">{t.heroSub}</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-4 gap-4 max-w-[1050px] mx-auto mb-20">
          {cards.map((card) => (
            <div
              key={card.key}
              className={`relative rounded-2xl p-6 flex flex-col ${
                card.highlighted
                  ? "bg-[#171717] text-white ring-2 ring-[#171717]"
                  : "bg-white border border-gray-200"
              }`}
            >
              {card.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-semibold px-3 py-1 rounded-full bg-[#171717] text-white shadow-sm">
                  {card.badge}
                </span>
              )}

              <div className="mb-5">
                <h3 className={`text-base font-semibold mb-1 ${card.highlighted ? "text-white" : "text-[#171717]"}`}>
                  {card.name}
                </h3>
                <p className={`text-xs ${card.highlighted ? "text-gray-400" : "text-gray-500"}`}>{card.desc}</p>
              </div>

              <div className={`text-3xl font-bold tracking-[-1px] mb-6 ${card.highlighted ? "text-white" : "text-[#171717]"}`}>
                {card.price}
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {card.feats.map((f: string, j: number) => (
                  <li key={j} className={`text-xs flex items-start gap-2 ${card.highlighted ? "text-gray-300" : "text-gray-600"}`}>
                    <Check size={14} className={`shrink-0 mt-0.5 ${card.highlighted ? "text-green-400" : "text-gray-400"}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={card.isFree ? "/bazi" : "/login"}
                className={`block text-center text-sm font-medium py-2.5 rounded-lg transition-colors ${
                  card.highlighted
                    ? "bg-white text-[#171717] hover:bg-gray-100"
                    : card.isFree
                    ? "bg-gray-100 text-[#171717] hover:bg-gray-200"
                    : "bg-[#171717] text-white hover:bg-black"
                }`}
              >
                {card.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-[640px] mx-auto">
          <h2 className="text-xl font-semibold tracking-[-0.5px] text-center mb-8">{t.faqTitle}</h2>
          <div className="space-y-3">
            {(t.faqs as any[]).map((faq: any, i: number) => (
              <details key={i} className="group border border-gray-200 rounded-lg">
                <summary className="p-4 text-sm font-medium cursor-pointer list-none flex items-center justify-between text-gray-900 hover:bg-gray-50 transition-colors">
                  {faq.q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
