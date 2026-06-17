"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Target, Briefcase, TrendingUp, Users, Compass, Shield, Zap, Eye } from "lucide-react";

// ──────────────────────── 翻译 ────────────────────────
const T: Record<string, Record<string, string>> = {
  hero: {
    zh: "八字不是算命，是战略工具",
    en: "BaZi Is Not Fortune-Telling — It's Strategy",
    id: "BaZi Bukan Ramalan — Ini Strategi",
    th: "ปาจื่อไม่ใช่การทำนาย — มันคือกลยุทธ์",
    vi: "Bát Tự Không Phải Bói Toán — Đó Là Chiến Lược",
    ms: "BaZi Bukan Tilikan — Ia Strategi",
    ja: "八字は占いではない — 戦略である",
    ko: "팔자는 점이 아닙니다 — 전략입니다",
  },
  heroSub: {
    zh: "将千年命理学转化为现代决策框架。用你的出生能量图谱，制定事业、投资、人际关系的战略方案。",
    en: "Transform ancient metaphysics into modern decision frameworks. Use your birth energy blueprint to strategize career, investment, and relationships.",
    id: "Ubah metafisika kuno menjadi kerangka keputusan modern. Gunakan cetak biru energi lahir Anda untuk strategi karier, investasi, dan hubungan.",
    th: "เปลี่ยนอภิปรัชญาโบราณเป็นกรอบการตัดสินใจสมัยใหม่ ใช้แผนที่พลังงานเกิดของคุณเพื่อวางกลยุทธ์อาชีพ การลงทุน และความสัมพันธ์",
    vi: "Biến siêu hình học cổ đại thành khung quyết định hiện đại. Sử dụng bản đồ năng lượng sinh để hoạch định chiến lược sự nghiệp, đầu tư và quan hệ.",
    ms: "Ubah metafizik kuno menjadi kerangka keputusan moden. Gunakan pelan tindakan tenaga lahir anda untuk strategi kerjaya, pelaburan, dan perhubungan.",
    ja: "古代の形而上学を現代の意思決定フレームワークに変換。出生エネルギー設計図を使って、キャリア・投資・人間関係の戦略を立てる。",
    ko: "고대 형이상학을 현대적 의사결정 프레임워크로 전환. 출생 에너지 청사진으로 경력, 투자, 관계 전략을 수립하세요.",
  },
  why: {
    zh: "为什么八字是战略工具？",
    en: "Why BaZi Is a Strategic Tool",
    id: "Mengapa BaZi Adalah Alat Strategis",
    th: "ทำไมปาจื่อถึงเป็นเครื่องมือเชิงกลยุทธ์",
    vi: "Tại Sao Bát Tự Là Công Cụ Chiến Lược",
    ms: "Kenapa BaZi Adalah Alat Strategik",
    ja: "なぜ八字は戦略ツールなのか",
    ko: "왜 팔자가 전략적 도구인가",
  },
  why1: {
    zh: "你的八字不是「命运」，是你的出厂设置。知道自己的硬件配置，才能选对软件和打法。",
    en: "Your BaZi isn't 'fate' — it's your factory settings. Know your hardware to pick the right software and strategy.",
    id: "BaZi Anda bukan 'takdir' — itu pengaturan pabrik Anda. Kenali perangkat keras Anda untuk memilih perangkat lunak dan strategi yang tepat.",
    th: "ปาจื่อของคุณไม่ใช่ 'โชคชะตา' — มันคือการตั้งค่าจากโรงงาน รู้จักฮาร์ดแวร์ของคุณเพื่อเลือกซอฟต์แวร์และกลยุทธ์ที่เหมาะสม",
    vi: "Bát Tự không phải 'số phận' — đó là cài đặt gốc. Biết phần cứng để chọn phần mềm và chiến lược đúng.",
    ms: "BaZi anda bukan 'takdir' — ia tetapan kilang anda. Kenali perkakasan anda untuk memilih perisian dan strategi yang tepat.",
    ja: "八字は「運命」ではなく、あなたの「工場出荷時設定」。ハードウェアを知って、正しいソフトウェアと戦略を選ぶ。",
    ko: "팔자는 '운명'이 아닌 '공장 초기 설정'입니다. 하드웨어를 알아야 올바른 소프트웨어와 전략을 선택할 수 있습니다.",
  },
  why2: {
    zh: "大运不是「运气」，是市场周期。知道什么时候扩张、什么时候防守。",
    en: "Luck Cycles aren't 'luck' — they're market cycles. Know when to expand and when to defend.",
    id: "Siklus Keberuntungan bukan 'keberuntungan' — itu siklus pasar. Tahu kapan harus berkembang dan kapan bertahan.",
    th: "วัฏจักรดวงไม่ใช่ 'โชค' — มันคือวัฏจักรตลาด รู้ว่าเมื่อไหร่ควรขยายและเมื่อไหร่ควรป้องกัน",
    vi: "Đại Vận không phải 'may mắn' — đó là chu kỳ thị trường. Biết khi nào mở rộng, khi nào phòng thủ.",
    ms: "Kitaran Nasib bukan 'nasib' — ia kitaran pasaran. Tahu bila perlu berkembang dan bila perlu bertahan.",
    ja: "大運は「運」ではなく「市場サイクル」。いつ拡大し、いつ守るべきかを知る。",
    ko: "대운은 '운'이 아닌 '시장 사이클'입니다. 언제 확장하고 언제 방어할지 아는 것입니다.",
  },
  why3: {
    zh: "十神不是「神煞」，是团队角色。你的八字显示了你在组织中天然的领导风格和协作模式。",
    en: "Ten Gods aren't 'deities' — they're team roles. Your BaZi reveals your natural leadership style and collaboration pattern.",
    id: "Sepuluh Dewa bukan 'dewa' — itu peran tim. BaZi Anda mengungkapkan gaya kepemimpinan alami dan pola kolaborasi Anda.",
    th: "เทพสิบไม่ใช่ 'เทพ' — มันคือบทบาทในทีม ปาจื่อของคุณเปิดเผยสไตล์ความเป็นผู้นำและรูปแบบการทำงานร่วมกันตามธรรมชาติ",
    vi: "Thập Thần không phải 'thần' — đó là vai trò trong nhóm. Bát Tự tiết lộ phong cách lãnh đạo tự nhiên và mô hình hợp tác.",
    ms: "Sepuluh Dewa bukan 'dewa' — ia peranan pasukan. BaZi anda mendedahkan gaya kepimpinan semula jadi dan corak kolaborasi anda.",
    ja: "十神は「神」ではなく「チーム役割」。あなたの八字は、自然なリーダーシップスタイルと協働パターンを明らかにする。",
    ko: "십신은 '신'이 아닌 '팀 역할'입니다. 팔자는 당신의 자연스러운 리더십 스타일과 협업 패턴을 드러냅니다.",
  },
  framework: {
    zh: "五行战略决策框架",
    en: "Five Elements Strategic Framework",
    id: "Kerangka Strategis Lima Elemen",
    th: "กรอบกลยุทธ์ห้าธาตุ",
    vi: "Khung Chiến Lược Ngũ Hành",
    ms: "Kerangka Strategik Lima Unsur",
    ja: "五行戦略フレームワーク",
    ko: "오행 전략 프레임워크",
  },
  wood: { zh: "木 — 增长战略", en: "Wood — Growth Strategy", id: "Kayu — Strategi Pertumbuhan", th: "ไม้ — กลยุทธ์การเติบโต", vi: "Mộc — Chiến Lược Tăng Trưởng", ms: "Kayu — Strategi Pertumbuhan", ja: "木 — 成長戦略", ko: "목 — 성장 전략" },
  woodDesc: {
    zh: "木日主的人天然适合扩张、创新、开拓新市场。像一棵树，你们的战略是向上生长、开枝散叶。适合创业、产品开发、教育行业。",
    en: "Wood Day Masters are natural expanders, innovators, market pioneers. Like a tree, your strategy is upward growth and branching out. Ideal for startups, product development, education.",
    id: "Wood Day Master adalah ekspander alami, inovator, pelopor pasar. Strategi Anda adalah pertumbuhan ke atas. Ideal untuk startup, pengembangan produk, pendidikan.",
    th: "เจ้าชะตาไม้เป็นผู้ขยายตัว นักนวัตกรรม ผู้บุกเบิกตลาด กลยุทธ์คือการเติบโตขึ้น เหมาะสำหรับสตาร์ทอัพ การพัฒนาผลิตภัณฑ์ การศึกษา",
    vi: "Nhật Chủ Mộc là người mở rộng, đổi mới, tiên phong thị trường. Chiến lược là tăng trưởng hướng lên. Phù hợp startup, phát triển sản phẩm, giáo dục.",
    ms: "Day Master Kayu adalah pengembang semula jadi, inovator, perintis pasaran. Strategi adalah pertumbuhan ke atas. Ideal untuk startup, pembangunan produk, pendidikan.",
    ja: "木の日主は自然な拡大者、革新者、市場開拓者。戦略は上方成長。スタートアップ、製品開発、教育に最適。",
    ko: "목 일주는 타고난 확장가, 혁신가, 시장 개척자. 전략은 상향 성장. 스타트업, 제품 개발, 교육에 적합.",
  },
  fire: { zh: "火 — 品牌战略", en: "Fire — Brand Strategy", id: "Api — Strategi Merek", th: "ไฟ — กลยุทธ์แบรนด์", vi: "Hỏa — Chiến Lược Thương Hiệu", ms: "Api — Strategi Jenama", ja: "火 — ブランド戦略", ko: "화 — 브랜드 전략" },
  fireDesc: {
    zh: "火日主的人是天生的传播者、影响者。你们的战略是点燃热情、建立品牌。适合市场营销、媒体、演艺、领导岗位。",
    en: "Fire Day Masters are natural communicators and influencers. Your strategy is to ignite passion and build brands. Ideal for marketing, media, entertainment, leadership.",
    id: "Fire Day Master adalah komunikator alami, influencer. Strategi Anda adalah menyalakan semangat dan membangun merek. Ideal untuk pemasaran, media, hiburan, kepemimpinan.",
    th: "เจ้าชะตาไฟเป็นนักสื่อสาร ผู้มีอิทธิพล กลยุทธ์คือจุดประกายความหลงใหลและสร้างแบรนด์ เหมาะสำหรับการตลาด สื่อ บันเทิง ความเป็นผู้นำ",
    vi: "Nhật Chủ Hỏa là người truyền thông, người ảnh hưởng. Chiến lược là thắp lửa đam mê và xây dựng thương hiệu. Phù hợp marketing, truyền thông, giải trí, lãnh đạo.",
    ms: "Day Master Api adalah komunikator semula jadi, pempengaruh. Strategi adalah menyalakan semangat dan membina jenama. Ideal untuk pemasaran, media, hiburan, kepimpinan.",
    ja: "火の日主は天性のコミュニケーター、インフルエンサー。戦略は情熱を点火しブランドを構築。マーケティング、メディア、エンタメ、リーダーシップに最適。",
    ko: "화 일주는 타고난 커뮤니케이터, 인플루언서. 전략은 열정을 점화하고 브랜드를 구축. 마케팅, 미디어, 엔터테인먼트, 리더십에 적합.",
  },
  earth: { zh: "土 — 稳健战略", en: "Earth — Stability Strategy", id: "Tanah — Strategi Stabilitas", th: "ดิน — กลยุทธ์ความมั่นคง", vi: "Thổ — Chiến Lược Ổn Định", ms: "Tanah — Strategi Kestabilan", ja: "土 — 安定戦略", ko: "토 — 안정 전략" },
  earthDesc: {
    zh: "土日主的人是天生的管理者、整合者。你们的战略是建立系统、积累资源。适合金融、房地产、运营管理、咨询。",
    en: "Earth Day Masters are natural managers and integrators. Your strategy is building systems and accumulating resources. Ideal for finance, real estate, operations, consulting.",
    id: "Earth Day Master adalah manajer alami, integrator. Strategi Anda adalah membangun sistem dan mengakumulasi sumber daya. Ideal untuk keuangan, real estat, operasi, konsultasi.",
    th: "เจ้าชะตาดินเป็นผู้จัดการ นักบูรณาการ กลยุทธ์คือการสร้างระบบและสะสมทรัพยากร เหมาะสำหรับการเงิน อสังหาริมทรัพย์ การดำเนินงาน ที่ปรึกษา",
    vi: "Nhật Chủ Thổ là người quản lý, tích hợp. Chiến lược là xây dựng hệ thống và tích lũy tài nguyên. Phù hợp tài chính, bất động sản, vận hành, tư vấn.",
    ms: "Day Master Tanah adalah pengurus semula jadi, pengintegrasi. Strategi adalah membina sistem dan mengumpul sumber. Ideal untuk kewangan, hartanah, operasi, perundingan.",
    ja: "土の日主は天性のマネージャー、統合者。戦略はシステム構築と資源蓄積。金融、不動産、運用、コンサルティングに最適。",
    ko: "토 일주는 타고난 관리자, 통합자. 전략은 시스템 구축과 자원 축적. 금융, 부동산, 운영, 컨설팅에 적합.",
  },
  metal: { zh: "金 — 精准战略", en: "Metal — Precision Strategy", id: "Logam — Strategi Presisi", th: "โลหะ — กลยุทธ์ความแม่นยำ", vi: "Kim — Chiến Lược Chính Xác", ms: "Logam — Strategi Ketepatan", ja: "金 — 精密戦略", ko: "금 — 정밀 전략" },
  metalDesc: {
    zh: "金日主的人是天生的执行者、完美主义者。你们的战略是精益求精、降本增效。适合工程、法律、审计、高端制造、投资。",
    en: "Metal Day Masters are natural executors and perfectionists. Your strategy is precision and optimization. Ideal for engineering, law, auditing, high-end manufacturing, investment.",
    id: "Metal Day Master adalah eksekutor alami, perfeksionis. Strategi Anda adalah presisi dan optimalisasi. Ideal untuk teknik, hukum, audit, manufaktur, investasi.",
    th: "เจ้าชะตาโลหะเป็นผู้ปฏิบัติการ ผู้สมบูรณ์แบบ กลยุทธ์คือความแม่นยำและการเพิ่มประสิทธิภาพ เหมาะสำหรับวิศวกรรม กฎหมาย การตรวจสอบ การผลิต การลงทุน",
    vi: "Nhật Chủ Kim là người thực thi, cầu toàn. Chiến lược là chính xác và tối ưu hóa. Phù hợp kỹ thuật, luật, kiểm toán, sản xuất cao cấp, đầu tư.",
    ms: "Day Master Logam adalah pelaksana semula jadi, perfeksionis. Strategi adalah ketepatan dan pengoptimuman. Ideal untuk kejuruteraan, undang-undang, audit, pembuatan, pelaburan.",
    ja: "金の日主は天性の実行者、完璧主義者。戦略は精密さと最適化。工学、法律、監査、高級製造、投資に最適。",
    ko: "금 일주는 타고난 실행자, 완벽주의자. 전략은 정밀함과 최적화. 공학, 법률, 감사, 고급 제조, 투자에 적합.",
  },
  water: { zh: "水 — 流动战略", en: "Water — Flow Strategy", id: "Air — Strategi Aliran", th: "น้ำ — กลยุทธ์การไหล", vi: "Thủy — Chiến Lược Dòng Chảy", ms: "Air — Strategi Aliran", ja: "水 — 流動戦略", ko: "수 — 유동 전략" },
  waterDesc: {
    zh: "水日主的人是天生的思考者、战略家。你们的战略是顺势而为、灵活应变。适合研究、写作、咨询、投资银行、科技。",
    en: "Water Day Masters are natural thinkers and strategists. Your strategy is adaptability and deep insight. Ideal for research, writing, consulting, investment banking, technology.",
    id: "Water Day Master adalah pemikir alami, strategis. Strategi Anda adalah adaptasi dan wawasan mendalam. Ideal untuk riset, penulisan, konsultasi, investment banking, teknologi.",
    th: "เจ้าชะตาน้ำเป็นนักคิด นักกลยุทธ์ กลยุทธ์คือการปรับตัวและหยั่งรู้ลึกซึ้ง เหมาะสำหรับการวิจัย การเขียน ที่ปรึกษา วาณิชธนกิจ เทคโนโลยี",
    vi: "Nhật Chủ Thủy là người suy nghĩ, chiến lược gia. Chiến lược là thích ứng và hiểu biết sâu sắc. Phù hợp nghiên cứu, viết lách, tư vấn, ngân hàng đầu tư, công nghệ.",
    ms: "Day Master Air adalah pemikir semula jadi, strategis. Strategi adalah adaptasi dan wawasan mendalam. Ideal untuk penyelidikan, penulisan, perundingan, perbankan pelaburan, teknologi.",
    ja: "水の日主は天性の思想家、戦略家。戦略は適応力と深い洞察。研究、執筆、コンサルティング、投資銀行、テクノロジーに最適。",
    ko: "수 일주는 타고난 사상가, 전략가. 전략은 적응력과 깊은 통찰. 연구, 집필, 컨설팅, 투자은행, 기술에 적합.",
  },
  timing: {
    zh: "大运：你的市场周期",
    en: "Luck Cycles: Your Market Timing",
    id: "Siklus Keberuntungan: Waktu Pasar Anda",
    th: "วัฏจักรดวง: จังหวะตลาดของคุณ",
    vi: "Đại Vận: Thời Điểm Thị Trường Của Bạn",
    ms: "Kitaran Nasib: Masa Pasaran Anda",
    ja: "大運：あなたの市場タイミング",
    ko: "대운: 당신의 시장 타이밍",
  },
  timingDesc: {
    zh: "每十年换一次大运，就像经济周期从扩张期进入收缩期。知道你的大运周期，就能预判什么时候该进攻、什么时候该防守、什么时候该转型。",
    en: "Every 10 years brings a new Luck Cycle, like economic cycles shifting from expansion to contraction. Know your cycle to predict when to attack, defend, or pivot.",
    id: "Setiap 10 tahun membawa Siklus Keberuntungan baru, seperti siklus ekonomi. Ketahui siklus Anda untuk memprediksi kapan menyerang, bertahan, atau berputar.",
    th: "ทุก 10 ปีนำวัฏจักรดวงใหม่ เหมือนวัฏจักรเศรษฐกิจ รู้วัฏจักรเพื่อทำนายว่าเมื่อไหร่ควรโจมตี ป้องกัน หรือเปลี่ยนทิศทาง",
    vi: "Mỗi 10 năm mang đến Đại Vận mới, như chu kỳ kinh tế. Biết chu kỳ để dự đoán khi nào tấn công, phòng thủ hay xoay chuyển.",
    ms: "Setiap 10 tahun membawa Kitaran Nasib baru, seperti kitaran ekonomi. Ketahui kitaran anda untuk meramal bila menyerang, bertahan, atau berputar.",
    ja: "10年ごとに新しい大運が訪れる。経済サイクルのように。あなたのサイクルを知り、攻め・守り・転換のタイミングを予測する。",
    ko: "10년마다 새로운 대운이 옵니다. 경제 사이클처럼. 당신의 사이클을 알아 공격, 방어, 전환의 타이밍을 예측하세요.",
  },
  cases: {
    zh: "实战案例",
    en: "Real-World Cases",
    id: "Kasus Nyata",
    th: "กรณีจริง",
    vi: "Trường Hợp Thực Tế",
    ms: "Kes Sebenar",
    ja: "実践事例",
    ko: "실전 사례",
  },
  case1Title: {
    zh: "木日主创业者：什么时候融资？",
    en: "Wood DM Founder: When to Raise Capital?",
    id: "Founder Wood DM: Kapan Mencari Modal?",
    th: "ผู้ก่อตั้งไม้: เมื่อไหร่ควรระดมทุน?",
    vi: "Founder Mộc: Khi Nào Gọi Vốn?",
    ms: "Pengasas Kayu: Bila Mencari Modal?",
    ja: "木の創業者：いつ資金調達すべきか？",
    ko: "목 일주 창업자: 언제 자금을 조달할까?",
  },
  case1Desc: {
    zh: "甲木日主，2026年进入壬水大运。水能生木，这是十年一遇的「印星」扩张期。建议前三年大量融资、快速扩张；后七年稳健运营，准备下一个大运的防守。",
    en: "Jia Wood DM, entering Ren Water Luck Cycle in 2026. Water feeds Wood — a once-a-decade 'Resource Star' expansion. Front-load fundraising in first 3 years; stabilize in later 7.",
    id: "Jia Wood DM, memasuki Siklus Ren Water 2026. Air memberi makan Kayu — ekspansi 'Bintang Sumber' sekali sedekade. Danai besar di 3 tahun pertama; stabilkan di 7 tahun berikutnya.",
    th: "เจียไม่ เข้าสู่วัฏจักรน้ำเหริน 2026 น้ำหล่อเลี้ยงไม้ — การขยายตัว 'ดาวทรัพยากร' ครั้งในรอบทศวรรษ ระดมทุนหนักใน 3 ปีแรก; ทรงตัวใน 7 ปีหลัง",
    vi: "Giáp Mộc, vào Đại Vận Nhâm Thủy 2026. Thủy sinh Mộc — mở rộng 'Ấn Tinh' một thập kỷ mới có. Gọi vốn mạnh 3 năm đầu; ổn định 7 năm sau.",
    ms: "Jia Kayu, memasuki Kitaran Ren Air 2026. Air menyuburkan Kayu — pengembangan 'Bintang Sumber' sekali sedekad. Kumpul dana besar 3 tahun pertama; stabilkan 7 tahun kemudian.",
    ja: "甲木、2026年に壬水大運へ。水が木を生む — 十年に一度の「印星」拡大期。最初の3年で資金調達、後半7年で安定化。",
    ko: "갑목, 2026년 임수 대운 진입. 수생목 — 10년에 한 번 오는 '인성' 확장기. 첫 3년 집중 투자 유치, 이후 7년 안정화.",
  },
  case2Title: {
    zh: "火日主管理者：该跳槽还是留守？",
    en: "Fire DM Manager: Jump Ship or Stay?",
    id: "Manajer Fire DM: Pindah atau Tetap?",
    th: "ผู้จัดการไฟ: เปลี่ยนงานหรืออยู่ต่อ?",
    vi: "Quản Lý Hỏa: Nhảy Việc Hay Ở Lại?",
    ms: "Pengurus Api: Lompat atau Kekal?",
    ja: "火のマネージャー：転職か残留か？",
    ko: "화 일주 관리자: 이직할까 남을까?",
  },
  case2Desc: {
    zh: "丙火日主，当前在庚金大运。火克金，这十年是你的「财星」期，表面好实则消耗大。建议留守积累资源和话语权，等下一个木运（印星）再跳槽，身价翻倍。",
    en: "Bing Fire DM, currently in Geng Metal Luck Cycle. Fire controls Metal — this is your 'Wealth Star' period: looks good but draining. Stay and accumulate leverage. Jump in the next Wood cycle when your value doubles.",
    id: "Bing Fire DM, saat ini di Siklus Geng Metal. Api mengontrol Logam — ini periode 'Bintang Kekayaan': terlihat bagus tapi menguras. Tetap dan kumpulkan pengaruh. Lompat di siklus Kayu berikutnya.",
    th: "ปิ่งไฟ ในวัฏจักรโลหะเกิง ไฟควบคุมโลหะ — ช่วง 'ดาวทรัพย์': ดูดีแต่สิ้นเปลือง อยู่ต่อและสะสมอำนาจ กระโดดในวัฏจักรไม้ถัดไปเมื่อมูลค่าเพิ่มเป็นสองเท่า",
    vi: "Bính Hỏa, đang ở Đại Vận Canh Kim. Hỏa khắc Kim — giai đoạn 'Tài Tinh': nhìn tốt nhưng hao tổn. Ở lại tích lũy đòn bẩy. Nhảy việc vào Đại Vận Mộc tiếp theo khi giá trị gấp đôi.",
    ms: "Bing Api, kini dalam Kitaran Geng Logam. Api mengawal Logam — tempoh 'Bintang Kekayaan': nampak baik tapi meletihkan. Kekal dan kumpul pengaruh. Lompat dalam kitaran Kayu seterusnya.",
    ja: "丙火、現在庚金大運。火が金を剋す — 「財星」期：見た目は良いが消耗する。残留して影響力を蓄え、次の木運で転職すれば価値が倍に。",
    ko: "병화, 현재 경금 대운. 화극금 — '재성' 기간: 겉보기엔 좋지만 소모적. 남아서 레버리지를 축적. 다음 목운에서 이직하면 가치가 두 배.",
  },
  case3Title: {
    zh: "金日主投资者：什么时候入场？",
    en: "Metal DM Investor: When to Enter the Market?",
    id: "Investor Metal DM: Kapan Masuk Pasar?",
    th: "นักลงทุนโลหะ: เมื่อไหร่ควรเข้าตลาด?",
    vi: "Nhà Đầu Tư Kim: Khi Nào Vào Thị Trường?",
    ms: "Pelabur Logam: Bila Masuk Pasaran?",
    ja: "金の投資家：いつ市場に入るべきか？",
    ko: "금 일주 투자자: 언제 시장에 진입할까?",
  },
  case3Desc: {
    zh: "辛金日主，2026丙午年。火克金，流年不利。但这个火恰好是你的「官星」—— 压力就是机会。策略：等待市场恐慌时逆向布局，在下半年土运（印星）到来时加仓。",
    en: "Xin Metal DM, 2026 Bing Wu year. Fire controls Metal — challenging year. But this Fire is your 'Officer Star' — pressure = opportunity. Strategy: counter-cyclical positioning during market panic, then scale up when Earth cycle arrives in H2.",
    id: "Xin Metal DM, tahun 2026 Bing Wu. Api mengontrol Logam — tahun menantang. Tapi Api ini adalah 'Bintang Perwira' — tekanan = peluang. Strategi: posisi kontra-siklus saat panik pasar, lalu tingkatkan saat siklus Tanah tiba di H2.",
    th: "ซินโลหะ ปีปิ่งอู่ 2026 ไฟควบคุมโลหะ — ปีที่ท้าทาย แต่ไฟนี้คือ 'ดาวขุนนาง' — แรงกดดัน = โอกาส กลยุทธ์: วางตำแหน่งสวนวัฏจักรเมื่อตลาดตื่นตระหนก แล้วเพิ่มเมื่อวัฏจักรดินมาถึงในครึ่งปีหลัง",
    vi: "Tân Kim, năm Bính Ngọ 2026. Hỏa khắc Kim — năm thách thức. Nhưng Hỏa này là 'Quan Tinh' — áp lực = cơ hội. Chiến lược: định vị ngược chu kỳ khi thị trường hoảng loạn, tăng quy mô khi Đại Vận Thổ đến.",
    ms: "Xin Logam, tahun Bing Wu 2026. Api mengawal Logam — tahun mencabar. Tapi Api ini adalah 'Bintang Pegawai' — tekanan = peluang. Strategi: kedudukan kontra-kitaran semasa panik pasaran, tingkatkan bila kitaran Tanah tiba.",
    ja: "辛金、2026丙午年。火が金を剋す — 試練の年。しかしこの火は「官星」— プレッシャー＝チャンス。戦略：市場パニック時に逆張りポジション、下半期の土運で増強。",
    ko: "신금, 2026 병오년. 화극금 — 도전의 해. 하지만 이 화는 '관성' — 압박 = 기회. 전략: 시장 공포 시 역주기 포지셔닝, 하반기 토운 도래 시 증량.",
  },
  cta: {
    zh: "准备好制定你的八字战略了吗？",
    en: "Ready to Build Your BaZi Strategy?",
    id: "Siap Membangun Strategi BaZi Anda?",
    th: "พร้อมสร้างกลยุทธ์ปาจื่อของคุณหรือยัง?",
    vi: "Sẵn Sàng Xây Dựng Chiến Lược Bát Tự?",
    ms: "Sedia Bina Strategi BaZi Anda?",
    ja: "八字戦略を構築する準備はできましたか？",
    ko: "팔자 전략을 구축할 준비가 되셨나요?",
  },
  ctaBtn: {
    zh: "免费生成八字 →",
    en: "Generate Free BaZi →",
    id: "Buat BaZi Gratis →",
    th: "สร้างปาจื่อฟรี →",
    vi: "Tạo Bát Tự Miễn Phí →",
    ms: "Jana BaZi Percuma →",
    ja: "無料で八字を生成 →",
    ko: "무료 팔자 생성 →",
  },
};

// ──────────────────────── 组件 ────────────────────────
export default function MethodologyPage() {
  const { language } = useLanguage();
  const lang = language || "zh";
  const t = (key: string) => T[key]?.[lang] || T[key]?.en || key;

  const frameworks = [
    { key: "wood", icon: "🌳", color: "#4CAF50", bg: "#e8f5e9" },
    { key: "fire", icon: "🔥", color: "#F44336", bg: "#ffebee" },
    { key: "earth", icon: "🏔️", color: "#795548", bg: "#efebe9" },
    { key: "metal", icon: "⚔️", color: "#FF9800", bg: "#fff3e0" },
    { key: "water", icon: "💧", color: "#2196F3", bg: "#e3f2fd" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative text-center py-16 md:py-24 px-6 max-w-[800px] mx-auto overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]" aria-hidden="true">
          <svg width="500" height="500" viewBox="0 0 500 500">
            <circle cx="250" cy="250" r="240" stroke="black" strokeWidth="0.5"/>
            <circle cx="250" cy="250" r="180" stroke="black" strokeWidth="0.5"/>
            <circle cx="250" cy="250" r="80" fill="#111" opacity="0.3"/>
            <path d="M250 170a80 80 0 0 1 0 160A80 80 0 0 1 170 250" fill="#fff"/>
            <circle cx="250" cy="210" r="14" fill="#111" opacity="0.3"/>
            <circle cx="250" cy="290" r="14" fill="#fff"/>
          </svg>
        </div>
        <span className="relative inline-block text-[11px] font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
          BaZi Strategy Framework
        </span>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-[-2px] leading-[1.1] mb-4">{t("hero")}</h1>
        <p className="text-base md:text-lg text-gray-500 leading-relaxed max-w-[560px] mx-auto mb-8">{t("heroSub")}</p>
      </section>

      {/* 为什么 */}
      <section className="max-w-[800px] mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-center mb-10">{t("why")}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold mb-4">{i}</div>
              <p className="text-sm text-gray-600 leading-relaxed">{t(`why${i}`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 五行框架 */}
      <section className="max-w-[900px] mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-center mb-4">{t("framework")}</h2>
        <p className="text-center text-gray-500 text-sm mb-10 max-w-[500px] mx-auto">
          {lang === "zh" ? "每个日主对应一种天然的战略倾向。找到你的日主，读懂你的战略基因。" : "Each Day Master corresponds to a natural strategic tendency. Find yours."}
        </p>
        <div className="grid md:grid-cols-2 gap-5">
          {frameworks.map(fw => (
            <div key={fw.key} className="rounded-2xl border border-gray-200 p-6 flex gap-4" style={{ borderLeft: `3px solid ${fw.color}` }}>
              <div className="text-3xl shrink-0">{fw.icon}</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">{t(fw.key)}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{t(`${fw.key}Desc`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 大运 */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-white rounded-full border border-gray-200 text-xs text-gray-500">
            <TrendingUp size={14} />
            <span>Market Timing</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">{t("timing")}</h2>
          <p className="text-gray-500 leading-relaxed max-w-[560px] mx-auto">{t("timingDesc")}</p>
        </div>
      </section>

      {/* 案例 */}
      <section className="max-w-[900px] mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">{t("cases")}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm mb-4">
                <Target size={18} />
              </div>
              <h3 className="font-bold text-gray-900 mb-3 text-sm">{t(`case${i}Title`)}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{t(`case${i}Desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white py-16 text-center">
        <div className="max-w-[600px] mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t("cta")}</h2>
          <Link
            href="/bazi"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all text-sm"
          >
            {t("ctaBtn")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
