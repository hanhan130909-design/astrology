"use client";

import { useState } from "react";
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { app } from "@/lib/firebase";
import { sendWelcomeEmail } from "@/lib/newsletter";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("请输入有效的邮箱地址");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const db = getFirestore(app);
      // Check duplicate
      const q = query(collection(db, "newsletter_subscribers"), where("email", "==", email.toLowerCase().trim()));
      const existing = await getDocs(q);
      if (!existing.empty) {
        setStatus("success");
        setMessage("你已经订阅过了！📬");
        return;
      }

      await addDoc(collection(db, "newsletter_subscribers"), {
        email: email.toLowerCase().trim(),
        source: "homepage",
        language: navigator.language || "en",
        subscribedAt: serverTimestamp(),
      });

      // Send welcome email via Resend
      sendWelcomeEmail(email.toLowerCase().trim()).catch((err) =>
        console.error("Welcome email send error:", err)
      );

      setStatus("success");
      setMessage("订阅成功！每周一查收运势 🎉");
      setEmail("");
    } catch (err) {
      console.error("Subscribe error:", err);
      setStatus("error");
      setMessage("订阅失败，请稍后再试");
    }
  };

  return (
    <div className="max-w-[400px] mx-auto mt-10 p-6 bg-gray-50 rounded-2xl border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">📬 订阅周运势</h3>
      <p className="text-xs text-gray-500 mb-4">每周一发送12星座运势和占星知识</p>
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="your@email.com"
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
          {status === "loading" ? "..." : "订阅"}
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
