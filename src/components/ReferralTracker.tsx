"use client";

import { useEffect } from 'react';

/**
 * ReferralTracker — 自动追踪推荐链接点击
 * 当URL包含 ?ref=xxx 时：
 * 1. 记录点击到Firebase
 * 2. 把ref存到localStorage（30天有效期）
 * 3. 后续购买时带上ref参数
 */
export default function ReferralTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');

    if (ref) {
      // 存储到 localStorage（30天）
      const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
      try {
        localStorage.setItem('lunaxstar_ref', JSON.stringify({ code: ref, expiry }));
      } catch (e) {
        // localStorage may be unavailable
      }

      // 异步记录点击（不阻塞页面）
      fetch('/api/referral/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: ref,
          page: window.location.pathname,
          referrer: document.referrer,
        }),
      }).catch(() => {
        // 静默失败，不影响用户体验
      });
    }
  }, []);

  return null;
}

/**
 * 获取当前用户的推荐码（如果有的话）
 */
export function getReferralCode(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('lunaxstar_ref');
    if (!stored) return null;
    const { code, expiry } = JSON.parse(stored);
    if (Date.now() > expiry) {
      localStorage.removeItem('lunaxstar_ref');
      return null;
    }
    return code;
  } catch {
    return null;
  }
}

/**
 * 给购买链接加上推荐码参数
 */
export function appendReferral(url: string): string {
  const code = getReferralCode();
  if (!code) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}ref=${code}`;
}
