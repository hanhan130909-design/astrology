"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";

// Lazy-load AuthContext only when needed (after hydration or user interaction)
function AuthButton() {
  const [AuthModule, setAuthModule] = useState<typeof import("@/contexts/AuthContext") | null>(null);

  useEffect(() => {
    // Load auth module after hydration to avoid blocking first paint
    const timer = setTimeout(() => {
      import("@/contexts/AuthContext").then(setAuthModule);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!AuthModule) {
    // Show login link before auth loads
    return (
      <Link href="/login" className="text-xs font-medium text-gray-400 hover:text-[#171717] no-underline shrink-0">
        Login
      </Link>
    );
  }

  return <AuthContent useAuth={AuthModule.useAuth} />;
}

function AuthContent({ useAuth }: { useAuth: () => any }) {
  const { user, logout } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-2 shrink-0">
        <Link href="/profile" className="text-xs font-medium text-gray-600 hover:text-[#171717] no-underline">
          {user.displayName || user.email}
        </Link>
        <button onClick={logout} className="text-xs text-gray-400 hover:text-[#171717]">
          Logout
        </button>
      </div>
    );
  }

  return (
    <Link href="/login" className="text-xs font-medium text-gray-400 hover:text-[#171717] no-underline shrink-0">
      Login
    </Link>
  );
}

export default function LazyAuthButton() {
  return (
    <Suspense fallback={<Link href="/login" className="text-xs font-medium text-gray-400 hover:text-[#171717] no-underline shrink-0">Login</Link>}>
      <AuthButton />
    </Suspense>
  );
}
