"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon, Monitor } from "lucide-react";

const THEMES = [
  { id: "light", icon: Sun, label: { zh: "浅色", en: "Light", id: "Terang" } },
  { id: "dark", icon: Moon, label: { zh: "深色", en: "Dark", id: "Gelap" } },
  { id: "system", icon: Monitor, label: { zh: "系统", en: "System", id: "Sistem" } },
] as const;

interface ThemeSwitcherProps {
  variant?: "dropdown" | "buttons" | "minimal";
  showLabel?: boolean;
}

export function ThemeSwitcher({ variant = "buttons", showLabel = false }: ThemeSwitcherProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  if (variant === "minimal") {
    const CurrentIcon = THEMES.find((t) => t.id === resolvedTheme)?.icon || Moon;
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    
    return (
      <button
        onClick={() => setTheme(nextTheme)}
        className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        title={`Switch to ${nextTheme} mode`}
      >
        <CurrentIcon className="w-5 h-5" />
      </button>
    );
  }

  if (variant === "dropdown") {
    return (
      <div className="relative group">
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
          {resolvedTheme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          <span className="text-sm capitalize">{theme}</span>
        </button>
        
        <div className="absolute top-full right-0 mt-2 w-40 bg-gray-900 border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors first:rounded-t-xl last:rounded-b-xl ${
                theme === t.id
                  ? "bg-purple-500/20 text-purple-300"
                  : "text-gray-300 hover:bg-white/5"
              }`}
            >
              <t.icon className="w-4 h-4" />
              <span className="capitalize">{t.id}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Buttons variant (default)
  return (
    <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg border border-white/10">
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
            theme === t.id
              ? "bg-purple-500/20 text-purple-300"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <t.icon className="w-4 h-4" />
          {showLabel && <span className="capitalize">{t.id}</span>}
        </button>
      ))}
    </div>
  );
}
