"use client";

import { useState } from "react";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sendWelcomeEmail } from "@/lib/newsletter";
import { useLanguage } from "@/contexts/LanguageContext";

const t9n: Record<string, Record<string, string>> = {
  zh: {
    title: "📬 订阅周运势",
    desc: "每周一发送12星座运势和占星知识",
    placeholder: "your@email.com",
    button: "订阅",
    loading: "...",
    invalid: "请输入有效的邮箱地址",
    duplicate: "你已经订阅过了！📬",
    success: "订阅成功！每周一查收运势 🎉",
    error: "订阅失败，请稍后再试",
  },
  en: {
    title: "📬 Weekly Horoscope",
    desc: "Get 12 zodiac horoscopes & astrology tips every Monday",
    placeholder: "your@email.com",
    button: "Subscribe",
    loading: "...",
    invalid: "Please enter a valid email address",
    duplicate: "You're already subscribed! 📬",
    success: "Subscribed! Check your inbox every Monday 🎉",
    error: "Subscription failed, please try again",
  },
  id: {
    title: "📬 Horoskop Mingguan",
    desc: "Dapatkan 12 horoskop zodiak & tips astrologi setiap Senin",
    placeholder: "email@anda.com",
    button: "Langganan",
    loading: "...",
    invalid: "Masukkan alamat email yang valid",
    duplicate: "Kamu sudah berlangganan! 📬",
    success: "Berlangganan! Cek inbox setiap Senin 🎉",
    error: "Gagal berlangganan, silakan coba lagi",
  },
  th: {
    title: "📬 ดูดวงรายสัปดาห์",
    desc: "รับดวง 12 ราศีและความรู้โหราศาสตร์ทุกวันจันทร์",
    placeholder: "your@email.com",
    button: "สมัคร",
    loading: "...",
    invalid: "กรุณากรอกอีเมลที่ถูกต้อง",
    duplicate: "คุณสมัครแล้ว! 📬",
    success: "สมัครสำเร็จ! เช็คอินบ็อกซ์ทุกวันจันทร์ 🎉",
    error: "การสมัครล้มเหลว กรุณาลองอีกครั้ง",
  },
  vi: {
    title: "📬 Tử Vi Hàng Tuần",
    desc: "Nhận 12 cung hoàng đạo & kiến thức chiêm tinh mỗi thứ Hai",
    placeholder: "email@ban.com",
    button: "Đăng ký",
    loading: "...",
    invalid: "Vui lòng nhập địa chỉ email hợp lệ",
    duplicate: "Bạn đã đăng ký rồi! 📬",
    success: "Đăng ký thành công! Kiểm tra hộp thư mỗi thứ Hai 🎉",
    error: "Đăng ký thất bại, vui lòng thử lại",
  },
  ms: {
    title: "📬 Horoskop Mingguan",
    desc: "Dapatkan 12 horoskop zodiak & tips astrologi setiap Isnin",
    placeholder: "email@anda.com",
    button: "Langgan",
    loading: "...",
    invalid: "Sila masukkan alamat emel yang sah",
    duplicate: "Anda sudah melanggan! 📬",
    success: "Berjaya dilanggan! Semak inbox setiap Isnin 🎉",
    error: "Langganan gagal, sila cuba lagi",
  },
  ja: {
    title: "📬 週間運勢",
    desc: "毎週月曜日に12星座の運勢と占星術の知識をお届け",
    placeholder: "your@email.com",
    button: "購読",
    loading: "...",
    invalid: "有効なメールアドレスを入力してください",
    duplicate: "すでに購読済みです！📬",
    success: "購読完了！毎週月曜日に受信トレイをチェック 🎉",
    error: "購読に失敗しました。もう一度お試しください",
  },
  ko: {
    title: "📬 주간 운세",
    desc: "매주 월요일 12개 별자리 운세와 점성술 지식을 받아보세요",
    placeholder: "your@email.com",
    button: "구독",
    loading: "...",
    invalid: "유효한 이메일 주소를 입력하세요",
    duplicate: "이미 구독 중입니다! 📬",
    success: "구독 완료! 매주 월요일 받은편지함을 확인하세요 🎉",
    error: "구독에 실패했습니다. 다시 시도해 주세요",
  },
};

export default function NewsletterForm() {
  const { language } = useLanguage();
  const t = (k: string) => t9n[language]?.[k] || t9n.en[k] || k;

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage(t("invalid"));
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const q = query(collection(db, "newsletter_subscribers"), where("email", "==", email.toLowerCase().trim()));
      const existing = await getDocs(q);
      if (!existing.empty) {
        setStatus("success");
        setMessage(t("duplicate"));
        return;
      }

      await addDoc(collection(db, "newsletter_subscribers"), {
        email: email.toLowerCase().trim(),
        source: "homepage",
        language: language || navigator.language || "en",
        subscribedAt: serverTimestamp(),
      });

      sendWelcomeEmail(email.toLowerCase().trim()).catch((err) =>
        console.error("Welcome email send error:", err)
      );

      setStatus("success");
      setMessage(t("success"));
      setEmail("");
    } catch (err) {
      console.error("Subscribe error:", err);
      setStatus("error");
      setMessage(t("error"));
    }
  };

  return (
    <div className="max-w-[400px] mx-auto mt-10 p-6 bg-gray-50 rounded-2xl border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">{t("title")}</h3>
      <p className="text-xs text-gray-500 mb-4">{t("desc")}</p>
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder={t("placeholder")}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error" || status === "success") setStatus("idle");
          }}
          className="flex-1 p-2.5 bg-white border border-gray-200 rounded-lg text-xs"
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-4 py-2.5 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-black disabled:opacity-50 transition-colors"
        >
          {status === "loading" ? t("loading") : t("button")}
        </button>
      </form>
      {message && (
        <p className={`text-xs mt-3 ${status === "success" ? "text-green-600" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
