"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = string;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Complete zodiac names
export const zodiacNames: Record<string, Record<string, string>> = {
  aries: { zh: '白羊座', en: 'Aries', id: 'Aries', th: 'แกะ', vi: 'Bạch Dương', ms: 'Aries', ja: '牡羊座', ko: '양자리' },
  taurus: { zh: '金牛座', en: 'Taurus', id: 'Taurus', th: 'พฤกษกร', vi: 'Kim Ngưu', ms: 'Taurus', ja: '牡牛座', ko: '황소자리' },
  gemini: { zh: '双子座', en: 'Gemini', id: 'Gemini', th: 'มิถุน', vi: 'Song Tử', ms: 'Gemini', ja: '双子座', ko: '쌍둥이자리' },
  cancer: { zh: '巨蟹座', en: 'Cancer', id: 'Cancer', th: 'กรกฎ', vi: 'Cự Giải', ms: 'Cancer', ja: '蟹座', ko: '게자리' },
  leo: { zh: '狮子座', en: 'Leo', id: 'Leo', th: 'สิงห์', vi: 'Sư Tử', ms: 'Leo', ja: '獅子座', ko: '사자자리' },
  virgo: { zh: '处女座', en: 'Virgo', id: 'Virgo', th: 'กันย์', vi: 'Xử Nữ', ms: 'Virgo', ja: '乙女座', ko: '처녀자리' },
  libra: { zh: '天秤座', en: 'Libra', id: 'Libra', th: 'ตุลย์', vi: 'Thiên Bình', ms: 'Libra', ja: '天秤座', ko: '천칭자리' },
  scorpio: { zh: '天蝎座', en: 'Scorpio', id: 'Scorpio', th: 'พิจิก', vi: 'Bọ Cạp', ms: 'Scorpio', ja: '蠍座', ko: '전갈자리' },
  sagittarius: { zh: '射手座', en: 'Sagittarius', id: 'Sagittarius', th: 'ธนู', vi: 'Nhân Mã', ms: 'Sagittarius', ja: '射手座', ko: '人马자리' },
  capricorn: { zh: '摩羯座', en: 'Capricorn', id: 'Capricorn', th: 'มังกร', vi: 'Ma Kết', ms: 'Capricorn', ja: '山羊座', ko: '염소자리' },
  aquarius: { zh: '水瓶座', en: 'Aquarius', id: 'Aquarius', th: 'กุมภ์', vi: 'Bảo Bình', ms: 'Aquarius', ja: '水瓶座', ko: '물병자리' },
  pisces: { zh: '双鱼座', en: 'Pisces', id: 'Pisces', th: 'มีน', vi: 'Song Ngư', ms: 'Pisces', ja: '魚座', ko: '물고기자리' },
};

// Complete translations dictionary - use flexible typing for extensibility
export const translations: Record<string, any> = {
  zh: {
    siteName: '星缘',
    auth: { login: '登录', register: '注册', logout: '退出', email: '邮箱', password: '密码', forgot: '忘记密码?' },
    nav: { home: '首页', features: '功能', about: '关于', profile: '个人中心', settings: '设置' },
    common: { loading: '加载中...', error: '出错了', retry: '重试', save: '保存', cancel: '取消', confirm: '确认', delete: '删除', edit: '编辑', search: '搜索', noData: '暂无数据' },
    chart: { natal: '本命盘', transit: '推运盘', solarReturn: '日返盘', composite: '组合盘', houses: '宫位', aspects: '相位', planets: '行星' },
    features: { aiReading: 'AI解读', compatibility: '配对分析', dailyHoroscope: '每日运势', transitCalendar: '行运日历', yearlyReport: '年度运势' },
    fortune: { love: '爱情', career: '事业', money: '财运', health: '健康', overall: '综合运势', lucky: '幸运指数' },
    elements: { fire: '火象', earth: '土象', air: '风象', water: '水象' },
    modal: { enterQuestion: '请输入您想咨询的问题', enterBirth: '请输入您的出生信息', selectQuestion: '选择问题类型', generateReading: '生成解读' },
    about: { 
      title: '关于星缘',
      subtitle: '基于真实天文计算的专业占星平台',
      intro: '星缘是一款基于真实天文计算与先进AI技术的专业占星平台。我们致力于为用户提供精准、深入的占星解读，帮助每个人更好地了解自己、规划人生。',
      what: '这是什么',
      whatDesc: '星缘是一款专业占星工具，基于真实的天文数据和先进的AI技术，帮助用户探索自我、了解命运。',
      not: '这不是什么',
      notDesc: '占星仅供参考娱乐，不构成任何形式的命运预测或决策依据。我们相信命运掌握在自己手中。',
      how: '如何使用',
      howDesc: '输入您的出生信息，即可获得专属的星盘解读。您还可以探索每日运势、星座配对等更多功能。',
      features: {
        title: '核心功能',
        natal: '本命星盘 - 基于真实天文计算，呈现完整的行星落位、星座分布与宫位信息',
        ai: 'AI智能解读 - 运用GPT-4技术，提供个性化的深度分析与建议',
        compat: '星座配对 - 深入分析两人之间的契合度与互动模式',
        daily: '每日运势 - 提供爱情、事业、财运等多维度的运势指引'
      },
      featureCards: [
        { emoji: '🪐', title: '本命盘分析', desc: '完整行星落位、宫位、相位深度解读' },
        { emoji: '🔮', title: '推运盘', desc: '行运追踪、日返盘、月返盘' },
        { emoji: '💫', title: '合盘分析', desc: '组合盘、比较盘、关系相位' },
        { emoji: '🤖', title: 'AI解读', desc: '基于大模型的智能星盘解读' },
        { emoji: '📅', title: '运势日历', desc: '每日运势、每月运势、年度报告' },
        { emoji: '🃏', title: '塔罗占卜', desc: '78张经典塔罗牌阵' },
      ],
      mission: '我们的使命是用科技让古老的占星智慧焕发新生，让每个人都能便捷地获得专业的占星服务。'
    }
  },
  en: {
    siteName: 'Starry Fate',
    auth: { login: 'Login', register: 'Register', logout: 'Logout', email: 'Email', password: 'Password', forgot: 'Forgot password?' },
    nav: { home: 'Home', features: 'Features', about: 'About', profile: 'Profile', settings: 'Settings' },
    common: { loading: 'Loading...', error: 'Error occurred', retry: 'Retry', save: 'Save', cancel: 'Cancel', confirm: 'Confirm', delete: 'Delete', edit: 'Edit', search: 'Search', noData: 'No data' },
    chart: { natal: 'Natal Chart', transit: 'Transit', solarReturn: 'Solar Return', composite: 'Composite', houses: 'Houses', aspects: 'Aspects', planets: 'Planets' },
    features: { aiReading: 'AI Reading', compatibility: 'Compatibility', dailyHoroscope: 'Daily Horoscope', transitCalendar: 'Transit Calendar', yearlyReport: 'Yearly Report' },
    fortune: { love: 'Love', career: 'Career', money: 'Finance', health: 'Health', overall: 'Overall', lucky: 'Luck' },
    elements: { fire: 'Fire', earth: 'Earth', air: 'Air', water: 'Water' },
    modal: { enterQuestion: 'Enter your question', enterBirth: 'Enter your birth info', selectQuestion: 'Select question type', generateReading: 'Generate Reading' },
    about: { 
      title: 'About Starry Fate',
      subtitle: 'A professional astrology platform based on real astronomical calculations',
      intro: 'Starry Fate is a professional astrology platform powered by real astronomical calculations and advanced AI technology. We are committed to providing accurate, in-depth astrology readings to help everyone better understand themselves and plan their lives.',
      what: 'What Is This',
      whatDesc: 'Starry Fate is a professional astrology tool based on real astronomical data and advanced AI technology, helping users explore themselves and understand their destiny.',
      not: 'What This Is NOT',
      notDesc: 'Astrology is for reference and entertainment only, and does not constitute any form of destiny prediction or decision-making basis. We believe destiny is in our own hands.',
      how: 'How To Use',
      howDesc: 'Enter your birth information to get your personalized astrology reading. You can also explore daily horoscopes, zodiac compatibility, and more features.',
      features: {
        title: 'Core Features',
        natal: 'Natal Chart - Based on real astronomical calculations, presenting complete planetary positions, sign distributions and house information',
        ai: 'AI Smart Reading - Using GPT-4 technology to provide personalized in-depth analysis and suggestions',
        compat: 'Zodiac Matching - In-depth analysis of compatibility and interaction patterns between two people',
        daily: 'Daily Horoscope - Provide guidance on love, career, finance and other dimensions'
      },
      featureCards: [
        { emoji: '🪐', title: 'Natal Chart', desc: 'Complete planetary positions, houses, and aspects in-depth analysis' },
        { emoji: '🔮', title: 'Transit Chart', desc: 'Transit tracking, solar return, lunar return' },
        { emoji: '💫', title: 'Compatibility', desc: 'Composite chart, synastry, relationship aspects' },
        { emoji: '🤖', title: 'AI Reading', desc: 'LLM-powered intelligent chart interpretation' },
        { emoji: '📅', title: 'Fortune Calendar', desc: 'Daily, monthly, and yearly horoscope reports' },
        { emoji: '🃏', title: 'Tarot Reading', desc: '78 classic tarot card spreads' },
      ],
      mission: 'Our mission is to revitalize ancient astrological wisdom with technology, making professional astrology services accessible to everyone.'
    }
  },
  id: {
    siteName: 'Starry Fate',
    auth: { login: 'Masuk', register: 'Daftar', logout: 'Keluar', email: 'Email', password: 'Kata Sandi', forgot: 'Lupa kata sandi?' },
    nav: { home: 'Beranda', features: 'Fitur', about: 'Tentang', profile: 'Profil', settings: 'Pengaturan' },
    common: { loading: 'Memuat...', error: 'Terjadi kesalahan', retry: 'Coba lagi', save: 'Simpan', cancel: 'Batal', confirm: 'Konfirmasi', delete: 'Hapus', edit: 'Edit', search: 'Cari', noData: 'Tidak ada data' },
    chart: { natal: 'Bagan Lahir', transit: 'Transit', solarReturn: 'Solar Return', composite: 'Komposit', houses: 'Rumah', aspects: 'Aspek', planets: 'Planet' },
    features: { aiReading: 'Bacaan AI', compatibility: 'Kecocokan', dailyHoroscope: 'Horoskop Harian', transitCalendar: 'Kalender Transit', yearlyReport: 'Ramalan Tahunan' },
    fortune: { love: 'Cinta', career: 'Karir', money: 'Keuangan', health: 'Kesehatan', overall: 'Keseluruhan', lucky: 'Keberuntungan' },
    elements: { fire: 'Api', earth: 'Tanah', air: 'Udara', water: 'Air' },
    modal: { enterQuestion: 'Masukkan pertanyaan Anda', enterBirth: 'Masukkan data lahir', selectQuestion: 'Pilih jenis pertanyaan', generateReading: 'Buat Bacaan' },
    about: { 
      title: 'Tentang Starry Fate',
      subtitle: 'Platform astrologi profesional berdasarkan perhitungan astronomi nyata',
      intro: 'Starry Fate adalah platform astrologi profesional yang didukung oleh perhitungan astronomi nyata dan teknologi AI canggih. Kami berkomitmen untuk menyediakan pembacaan astrologi yang akurat dan mendalam untuk membantu semua orang memahami diri mereka dengan lebih baik.',
      what: 'Apa Ini',
      whatDesc: 'Starry Fate adalah alat astrologi profesional berdasarkan data astronomi nyata dan teknologi AI canggih, membantu pengguna menjelajahi diri dan memahami takdir mereka.',
      not: 'Ini Bukan',
      notDesc: 'Astrologi hanya untuk referensi dan hiburan, dan bukan merupakan bentuk prediksi takdir atau dasar pengambilan keputusan. Kami percaya takdir ada di tangan kita sendiri.',
      how: 'Cara Menggunakan',
      howDesc: 'Masukkan informasi lahir Anda untuk mendapatkan pembacaan astrologi personal. Anda juga dapat menjelajahi horoskop harian, kecocokan zodiak, dan fitur lainnya.',
      features: {
        title: 'Fitur Inti',
        natal: 'Bagan Lahir - Berdasarkan perhitungan astronomi nyata, menyajikan posisi planet lengkap, distribusi zodiak dan informasi rumah',
        ai: 'Bacaan AI Cerdas - Menggunakan teknologi AI untuk memberikan analisis dan saran mendalam yang dipersonalisasi',
        compat: 'Kecocokan Zodiak - Analisis mendalam tentang kecocokan dan pola interaksi antara dua orang',
        daily: 'Horoskop Harian - Menyediakan panduan cinta, karir, keuangan dan dimensi lainnya'
      },
      featureCards: [
        { emoji: '🪐', title: 'Bagan Lahir', desc: 'Analisis mendalam posisi planet, rumah, dan aspek lengkap' },
        { emoji: '🔮', title: 'Transit', desc: 'Pelacakan transit, solar return, lunar return' },
        { emoji: '💫', title: 'Kecocokan', desc: 'Bagan komposit, sinastri, aspek hubungan' },
        { emoji: '🤖', title: 'Bacaan AI', desc: 'Interpretasi bagan cerdas berbasis AI' },
        { emoji: '📅', title: 'Kalender Nasib', desc: 'Laporan horoskop harian, bulanan, dan tahunan' },
        { emoji: '🃏', title: 'Tarot', desc: '78 kartu tarot klasik' },
      ],
      mission: 'Misi kami adalah menghidupkan kembali kebijaksanaan astrologi kuno dengan teknologi, membuat layanan astrologi profesional dapat diakses oleh semua orang.'
    }
  },
  // Thai
  th: {
    siteName: 'ดูดวง',
    auth: { login: 'เข้าสู่ระบบ', register: 'ลงทะเบียน', logout: 'ออกจากระบบ', email: 'อีเมล', password: 'รหัสผ่าน', forgot: 'ลืมรหัสผ่าน?' },
    nav: { home: 'หน้าแรก', features: 'ฟีเจอร์', about: 'เกี่ยวกับ', profile: 'โปรไฟล์', settings: 'ตั้งค่า' },
    common: { loading: 'กำลังโหลด...', error: 'เกิดข้อผิดพลาด', retry: 'ลองอีกครั้ง', save: 'บันทึก', cancel: 'ยกเลิก', confirm: 'ยืนยัน', delete: 'ลบ', edit: 'แก้ไข', search: 'ค้นหา', noData: 'ไม่มีข้อมูล' },
    chart: { natal: 'แผนภูมิเกิด', transit: 'ดาวโคจร', solarReturn: 'วันเกิดประจำปี', composite: 'คอมโพสิต', houses: 'เรือน', aspects: 'มุมทรงพลัง', planets: 'ดาวเคราะห์' },
    features: { aiReading: 'อ่านดวง AI', compatibility: 'ดูความเข้ากัน', dailyHoroscope: 'ดวงประจำวัน', transitCalendar: 'ปฏิทินดาว', yearlyReport: 'คำทำนายประจำปี' },
    fortune: { love: 'ความรัก', career: 'การงาน', money: 'การเงิน', health: 'สุขภาพ', overall: 'โดยรวม', lucky: 'โชคลาภ' },
    elements: { fire: 'ไฟ', earth: 'ดิน', air: 'ลม', water: 'น้ำ' },
    modal: { enterQuestion: 'กรุณาใส่คำถามของคุณ', enterBirth: 'กรุณาใส่ข้อมูลวันเกิด', selectQuestion: 'เลือกประเภทคำถาม', generateReading: 'สร้างคำทำนาย' },
    about: { 
      title: 'เกี่ยวกับดูดวง',
      subtitle: 'A professional astrology platform based on real astronomical calculations',
      intro: 'ดูดวงเป็นแพลตฟอร์มดูดวงออนไลน์ที่ใช้การคำนวณทางดาราศาสตร์จริงและ AI ขั้นสูง เรามุ่งมั่นที่จะให้คำทำนายที่แม่นยำและลึกซึ้งเพื่อช่วยให้ทุกคนเข้าใจตัวเองได้ดีขึ้น',
      what: 'นี่คืออะไร',
      whatDesc: 'ดูดวงเป็นเครื่องมือดูดวงมืออาชีพที่ใช้ข้อมูลดาราศาสตร์จริงและ AI ช่วยให้ผู้ใช้สำรวจตัวเองและเข้าใจโชคชะตา',
      not: 'นี่ไม่ใช่อะไร',
      notDesc: 'ดูดวงเป็นเพียงข้อมูลอ้างอิงและความบันเทิง ไม่ใช่การทำนายโชคชะตาหรือการตัดสินใจ เราเชื่อว่าโชคชะตาอยู่ในมือของเราเอง',
      how: 'วิธีใช้งาน',
      howDesc: 'ป้อนข้อมูลวันเกิดของคุณเพื่อรับการอ่านดวงส่วนบุคคล คุณยังสามารถสำรวจดวงประจำวัน ความเข้ากันของราศี และฟีเจอร์อื่นๆ',
      features: {
        title: 'ฟีเจอร์หลัก',
        natal: 'แผนภูมิเกิด - คำนวณจากข้อมูลดาราศาสตร์จริง แสดงตำแหน่งดาวเคราะห์ ราศี และเรือน',
        ai: 'อ่านดวง AI - ใช้เทคโนโลยี AI ล้ำสมัยเพื่อวิเคราะห์และให้คำแนะนำ',
        compat: 'ดูความเข้ากัน - วิเคราะห์ความเข้ากันได้ระหว่าง 2 คน',
        daily: 'ดวงประจำวัน - คำทำนายด้านความรัก การงาน การเงิน'
      },
      featureCards: [
        { emoji: '🪐', title: 'Natal Chart', desc: 'Complete planetary positions, houses, and aspects in-depth analysis' },
        { emoji: '🔮', title: 'Transit Chart', desc: 'Transit tracking, solar return, lunar return' },
        { emoji: '💫', title: 'Compatibility', desc: 'Composite chart, synastry, relationship aspects' },
        { emoji: '🤖', title: 'AI Reading', desc: 'LLM-powered intelligent chart interpretation' },
        { emoji: '📅', title: 'Fortune Calendar', desc: 'Daily, monthly, and yearly horoscope reports' },
        { emoji: '🃏', title: 'Tarot Reading', desc: '78 classic tarot card spreads' },
      ],
      mission: 'พันธกิจของเราคือการนำภูมิปัญญาดวงดาวโบราณมาสู่ยุคดิจิทัล'
    }
  },
  // Vietnamese
  vi: {
    siteName: 'Xem Tử Vi',
    auth: { login: 'Đăng nhập', register: 'Đăng ký', logout: 'Đăng xuất', email: 'Email', password: 'Mật khẩu', forgot: 'Quên mật khẩu?' },
    nav: { home: 'Trang chủ', features: 'Tính năng', about: 'Giới thiệu', profile: 'Hồ sơ', settings: 'Cài đặt' },
    common: { loading: 'Đang tải...', error: 'Đã xảy ra lỗi', retry: 'Thử lại', save: 'Lưu', cancel: 'Hủy', confirm: 'Xác nhận', delete: 'Xóa', edit: 'Sửa', search: 'Tìm kiếm', noData: 'Không có dữ liệu' },
    chart: { natal: 'Bản đồ sao', transit: 'Luân chuyển', solarReturn: 'Mặt trời quay về', composite: 'Hỗn hợp', houses: 'Cung', aspects: 'Góc độ', planets: 'Hành tinh' },
    features: { aiReading: 'Đọc bói AI', compatibility: 'Tương hợp', dailyHoroscope: 'Tử vi hàng ngày', transitCalendar: 'Lịch vận', yearlyReport: 'Tử vi năm' },
    fortune: { love: 'Tình yêu', career: 'Sự nghiệp', money: 'Tài chính', health: 'Sức khỏe', overall: 'Tổng thể', lucky: 'May mắn' },
    elements: { fire: 'Hỏa', earth: 'Thổ', air: 'Khí', water: 'Thủy' },
    modal: { enterQuestion: 'Nhập câu hỏi của bạn', enterBirth: 'Nhập thông tin sinh', selectQuestion: 'Chọn loại câu hỏi', generateReading: 'Tạo bói' },
    about: { 
      title: 'Về Xem Tử Vi',
      subtitle: 'A professional astrology platform based on real astronomical calculations',
      intro: 'Xem Tử Vi là nền tảng chiêm tinh học chuyên nghiệp sử dụng tính toán thiên văn thực và AI tiên tiến. Chúng tôi cam kết cung cấp các bói toán chính xác, sâu sắc giúp mọi người hiểu rõ bản thân hơn.',
      what: 'Đây là gì',
      whatDesc: 'Xem Tử Vi là công cụ chiêm tinh chuyên nghiệp dựa trên dữ liệu thiên văn thực và AI tiên tiến, giúp người dùng khám phá bản thân và hiểu vận mệnh.',
      not: 'Đây không phải là gì',
      notDesc: 'Chiêm tinh chỉ để tham khảo và giải trí, không phải dự đoán vận mệnh hay cơ sở quyết định. Chúng tôi tin vận mệnh nằm trong tay chúng ta.',
      how: 'Cách Sử Dụng',
      howDesc: 'Nhập thông tin sinh của bạn để nhận bói toán cá nhân. Bạn cũng có thể khám phá tử vi hàng ngày, tương hợp cung hoàng đạo và các tính năng khác.',
      features: {
        title: 'Tính năng chính',
        natal: 'Bản đồ sao - Tính toán từ dữ liệu thiên văn thực, hiển thị vị trí hành tinh, cung hoàng đạo và cung',
        ai: 'Đọc bói AI - Sử dụng công nghệ AI tiên tiến để phân tích và tư vấn',
        compat: 'Tương hợp - Phân tích sự tương hợp giữa 2 người',
        daily: 'Tử vi hàng ngày - Bói về tình yêu, sự nghiệp, tài chính'
      },
      featureCards: [
        { emoji: '🪐', title: 'Natal Chart', desc: 'Complete planetary positions, houses, and aspects in-depth analysis' },
        { emoji: '🔮', title: 'Transit Chart', desc: 'Transit tracking, solar return, lunar return' },
        { emoji: '💫', title: 'Compatibility', desc: 'Composite chart, synastry, relationship aspects' },
        { emoji: '🤖', title: 'AI Reading', desc: 'LLM-powered intelligent chart interpretation' },
        { emoji: '📅', title: 'Fortune Calendar', desc: 'Daily, monthly, and yearly horoscope reports' },
        { emoji: '🃏', title: 'Tarot Reading', desc: '78 classic tarot card spreads' },
      ],
      mission: 'Sứ mệnh của chúng tôi là đưa trí tuệ chiêm tinh cổ xưa vào thời đại số'
    }
  },
  // Malay
  ms: {
    siteName: 'Xingyuan',
    auth: { login: 'Log Masuk', register: 'Daftar', logout: 'Log Keluar', email: 'E-mel', password: 'Kata Laluan', forgot: 'Lupa kata laluan?' },
    nav: { home: 'Laman Utama', features: 'Ciri-ciri', about: 'Mengenai', profile: 'Profil', settings: 'Tetapan' },
    common: { loading: 'Memuatkan...', error: 'Ralat berlaku', retry: 'Cuba lagi', save: 'Simpan', cancel: 'Batal', confirm: 'Sahkan', delete: 'Padam', edit: 'Edit', search: 'Cari', noData: 'Tiada data' },
    chart: { natal: 'Carta Lahir', transit: 'Transit', solarReturn: 'Solar Return', composite: 'Komposit', houses: 'Rumah', aspects: 'Aspek', planets: 'Planet' },
    features: { aiReading: 'Bacaan AI', compatibility: 'Keserasian', dailyHoroscope: 'Horoskop Harian', transitCalendar: 'Kalendar Transit', yearlyReport: 'Ramalan Tahunan' },
    fortune: { love: 'Cinta', career: 'Kerjaya', money: 'Kewangan', health: 'Kesihatan', overall: 'Keseluruhan', lucky: 'Keberuntungan' },
    elements: { fire: 'Api', earth: 'Tanah', air: 'Udara', water: 'Air' },
    modal: { enterQuestion: 'Masukkan soalan anda', enterBirth: 'Masukkan maklumat lahir', selectQuestion: 'Pilih jenis soalan', generateReading: 'Buat Bacaan' },
    about: { 
      title: 'Mengenai Xingyuan',
      subtitle: 'A professional astrology platform based on real astronomical calculations',
      intro: 'Xingyuan ialah platform astrologi profesional yang dikuasakan oleh pengiraan astronomi sebenar dan teknologi AI canggih. Kami komited untuk menyediakan bacaan astrologi yang tepat dan mendalam.',
      what: 'Apa Ini',
      whatDesc: 'Xingyuan adalah alat astrologi profesional berdasarkan data astronomi sebenar dan AI canggih, membantu pengguna menjelajahi diri dan memahami takdir.',
      not: 'Ini Bukan',
      notDesc: 'Astrologi hanya untuk rujukan dan hiburan, bukan ramalan takdir atau asas keputusan. Kami percaya takdir ada di tangan kita sendiri.',
      how: 'Cara Menggunakan',
      howDesc: 'Masukkan maklumat lahir anda untuk mendapatkan bacaan astrologi peribadi. Anda juga boleh menjelajahi horoskop harian, keserasian zodiak, dan ciri-ciri lain.',
      features: {
        title: 'Ciri-ciri Utama',
        natal: 'Carta Lahir - Berdasarkan pengiraan astronomi sebenar, menunjukkan kedudukan planet, taburan zodiak dan maklumat rumah',
        ai: 'Bacaan AI Pintar - Menggunakan teknologi AI untuk memberikan analisis dan cadangan peribadi',
        compat: 'Ketepatan Zodiak - Analisis mendalam tentang keserasian antara dua orang',
        daily: 'Horoskop Harian - Panduan cinta, kerjaya, kewangan dan dimensi lain'
      },
      featureCards: [
        { emoji: '🪐', title: 'Natal Chart', desc: 'Complete planetary positions, houses, and aspects in-depth analysis' },
        { emoji: '🔮', title: 'Transit Chart', desc: 'Transit tracking, solar return, lunar return' },
        { emoji: '💫', title: 'Compatibility', desc: 'Composite chart, synastry, relationship aspects' },
        { emoji: '🤖', title: 'AI Reading', desc: 'LLM-powered intelligent chart interpretation' },
        { emoji: '📅', title: 'Fortune Calendar', desc: 'Daily, monthly, and yearly horoscope reports' },
        { emoji: '🃏', title: 'Tarot Reading', desc: '78 classic tarot card spreads' },
      ],
      mission: 'Misi kami adalah menghidupkan semula kebijaksanaan astrologi kuno dengan teknologi'
    }
  },
  // Japanese
  ja: {
    siteName: '星読み',
    auth: { login: 'ログイン', register: '登録', logout: 'ログアウト', email: 'メール', password: 'パスワード', forgot: 'パスワードをお忘れ?' },
    nav: { home: 'ホーム', features: '機能', about: 'について', profile: 'プロフィール', settings: '設定' },
    common: { loading: '読み込み中...', error: 'エラーが発生しました', retry: '再試行', save: '保存', cancel: 'キャンセル', confirm: '確認', delete: '削除', edit: '編集', search: '検索', noData: 'データがありません' },
    chart: { natal: '出生図', transit: 'トランシット', solarReturn: 'ソーラーリターン', composite: 'コンポジット', houses: 'ハウス', aspects: 'アスペクト', planets: '惑星' },
    features: { aiReading: 'AI占星', compatibility: '相性診断', dailyHoroscope: '今日の運勢', transitCalendar: 'Transitカレンダー', yearlyReport: '年間運勢' },
    fortune: { love: '恋愛', career: '仕事', money: '金運', health: '健康', overall: '総合運', lucky: 'ラッキー' },
    elements: { fire: '火', earth: '地', air: '風', water: '水' },
    modal: { enterQuestion: '質問を入力してください', enterBirth: '生年月日を入力してください', selectQuestion: '質問タイプを選択', generateReading: '占う' },
    about: { 
      title: '星読みについて',
      subtitle: 'A professional astrology platform based on real astronomical calculations',
      intro: '星読みは、実際の天文計算と高度なAI技術に基づいた本格的な占星術プラットフォームです。すべての人々が自分自身を理解し、人生を规划设计するための精密で深い占星術の提供に取り組んでいます。',
      what: 'これは何ですか',
      whatDesc: '星読みは実際の天文データと高度なAI技術に基づいたプロの占星術ツールで、ユーザーが自分自身を探求し、運命を理解するのに役立ちます。',
      not: 'これは何ではありませんか',
      notDesc: '占星術は参考・娯楽用であり、運命予測や意思決定の根拠とはなりません。私たちは運命は自分たちの手の中にあると信じています。',
      how: '使い方',
      howDesc: '出生情報を入力して、パーソナライズされた占星術の読み取りを取得しましょう。每日の運勢、星座の相性診断、その他の機能もご利用ください。',
      features: {
        title: '主な機能',
        natal: '出生図 - 実際の天文計算に基づき、惑星位置、星座分布、ハウス情報を完全に表示',
        ai: 'AI占星診断 - 最先端のAI技術を活用したパーソナライズされた分析と提案',
        compat: '相性診断 - 2人の相性と相互作用パターンの詳細な分析',
        daily: '今日の運勢 - 恋愛、仕事、金運などの多方面の運勢ガイド'
      },
      featureCards: [
        { emoji: '🪐', title: 'Natal Chart', desc: 'Complete planetary positions, houses, and aspects in-depth analysis' },
        { emoji: '🔮', title: 'Transit Chart', desc: 'Transit tracking, solar return, lunar return' },
        { emoji: '💫', title: 'Compatibility', desc: 'Composite chart, synastry, relationship aspects' },
        { emoji: '🤖', title: 'AI Reading', desc: 'LLM-powered intelligent chart interpretation' },
        { emoji: '📅', title: 'Fortune Calendar', desc: 'Daily, monthly, and yearly horoscope reports' },
        { emoji: '🃏', title: 'Tarot Reading', desc: '78 classic tarot card spreads' },
      ],
      mission: '私たちの使命は、テクノロジーで古代の占星術の知恵を蘇らせること'
    }
  },
  // Korean
  ko: {
    siteName: '별점보기',
    auth: { login: '로그인', register: '회원가입', logout: '로그아웃', email: '이메일', password: '비밀번호', forgot: '비밀번호를 잊으셨나요?' },
    nav: { home: '홈', features: '기능', about: '소개', profile: '프로필', settings: '설정' },
    common: { loading: '로딩 중...', error: '오류가 발생했습니다', retry: '다시 시도', save: '저장', cancel: '취소', confirm: '확인', delete: '삭제', edit: '편집', search: '검색', noData: '데이터가 없습니다' },
    chart: { natal: '출생지圖', transit: '트랜짓', solarReturn: '솔러리턴', composite: '컴포짓', houses: '하우스', aspects: '애스펙트', planets: '행성' },
    features: { aiReading: 'AI 점괘', compatibility: '궁합', dailyHoroscope: '오늘의 운세', transitCalendar: '트랜짓 캘린더', yearlyReport: '연간 운세' },
    fortune: { love: '사랑', career: '직장', money: '재물', health: '건강', overall: '전반적', lucky: '행운' },
    elements: { fire: '불', earth: '땅', air: '바람', water: '물' },
    modal: { enterQuestion: '질문을 입력하세요', enterBirth: '생년월일을 입력하세요', selectQuestion: '질문 유형 선택', generateReading: '점괘 보기' },
    about: { 
      title: '별점보기에 대하여',
      subtitle: 'A professional astrology platform based on real astronomical calculations',
      intro: '별점보기는 실제 천문학적 계산과 첨단 AI 기술에 기반한 전문 점성술 플랫폼입니다. 정확하고 깊은 점성술 해석을 제공하여 모든 사람이 자신을 더 잘 이해하고 인생을 설계할 수 있도록 노력합니다.',
      what: '이것은 무엇인가',
      whatDesc: '별점보기는 실제 천문학 데이터와 첨단 AI 기술을 기반으로 한 전문 점성술 도구로, 사용자가 자신을 탐색하고 운세를 이해하는 데 도움을 줍니다.',
      not: '이것은 무엇이 아닌가',
      notDesc: '점성술은 참고 및 엔터테인먼트용이며, 운세 예측이나 의사 결정의 근거가 되지 않습니다. 우리는 운세가 우리 손에 있다고 믿습니다.',
      how: '사용 방법',
      howDesc: '생년월일을 입력하여 개인화된 점성술 해석을 받으세요. 또한 매일의 운세, 별자리 궁합, 기타 기능을 탐색할 수 있습니다.',
      features: {
        title: '주요 기능',
        natal: '출생지圖 - 실제 천문학적 계산에 기반하여 행성 위치, 별자리 분포, 하우스 정보를 완전히 표시',
        ai: 'AI 점괘 - 최첨단 AI 기술을 활용한 개인화된 분석과 제안',
        compat: '궁합 분석 - 두 사람 사이의 궁합과 상호작용 패턴 상세 분석',
        daily: '오늘의 운세 - 사랑, 직장, 재물 등 다방면의 운세 안내'
      },
      featureCards: [
        { emoji: '🪐', title: 'Natal Chart', desc: 'Complete planetary positions, houses, and aspects in-depth analysis' },
        { emoji: '🔮', title: 'Transit Chart', desc: 'Transit tracking, solar return, lunar return' },
        { emoji: '💫', title: 'Compatibility', desc: 'Composite chart, synastry, relationship aspects' },
        { emoji: '🤖', title: 'AI Reading', desc: 'LLM-powered intelligent chart interpretation' },
        { emoji: '📅', title: 'Fortune Calendar', desc: 'Daily, monthly, and yearly horoscope reports' },
        { emoji: '🃏', title: 'Tarot Reading', desc: '78 classic tarot card spreads' },
      ],
      mission: '우리의 사명은 기술로 고대 점성술 지혜를 되살리는 것입니다'
    }
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'zh',
  setLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh');

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved && ['zh', 'en', 'id', 'th', 'vi', 'ms', 'ja', 'ko'].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English
        value = translations.en;
        for (const k2 of keys) {
          if (value && typeof value === 'object' && k2 in value) {
            value = value[k2];
          } else {
            return key;
          }
        }
        break;
      }
    }
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
