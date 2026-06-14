"use client";

import { useState, useRef, useCallback } from "react";
import html2canvas from "html2canvas";
import { X, Download, Copy, Share2, Sparkles } from "lucide-react";

interface BirthInfo {
  date: string;
  time: string;
  location: string;
}

interface ShareCardProps {
  chartType: string;
  title: string;
  subtitle?: string;
  planets?: Record<string, string>;
  ascendant?: string;
  midheaven?: string;
  birthInfo?: BirthInfo;
  shareText?: string;
}

const SIGN_MAP: Record<string, string> = {
  Aries: "Ari",
  Taurus: "Tau",
  Gemini: "Gem",
  Cancer: "Can",
  Leo: "Leo",
  Virgo: "Vir",
  Libra: "Lib",
  Scorpio: "Sco",
  Sagittarius: "Sag",
  Capricorn: "Cap",
  Aquarius: "Aqu",
  Pisces: "Pis",
};

const PLANET_MAP: Record<string, string> = {
  Sun: "Sun",
  Moon: "Moon",
  Mercury: "Mer",
  Venus: "Ven",
  Mars: "Mar",
  Jupiter: "Jup",
  Saturn: "Sat",
  Uranus: "Ura",
  Neptune: "Nep",
  Pluto: "Plu",
  NorthNode: "NN",
  SouthNode: "SN",
  Chiron: "Chi",
};

function getSignShort(sign: string): string {
  return SIGN_MAP[sign] || sign;
}

function getPlanetShort(planet: string): string {
  return PLANET_MAP[planet] || planet;
}

function generateShareText(
  chartType: string,
  title: string,
  ascendant?: string,
  planets?: Record<string, string>,
  birthInfo?: BirthInfo,
): string {
  const sunSign = planets?.Sun ? getSignShort(planets.Sun) : "?";
  const moonSign = planets?.Moon ? getSignShort(planets.Moon) : "?";
  const ascSign = ascendant ? getSignShort(ascendant) : "?";

  let text = `* ${chartType}: ${title}\n`;
  text += `ASC: ${ascSign} | Sun: ${sunSign} | Moon: ${moonSign}\n`;

  if (planets) {
    const entries = Object.entries(planets).slice(0, 8);
    for (const [planet, sign] of entries) {
      text += `${getPlanetShort(planet)}: ${getSignShort(sign)}  `;
    }
    text += "\n";
  }

  if (birthInfo) {
    text += `// ${birthInfo.date} ${birthInfo.time} - ${birthInfo.location}\n`;
  }

  text += "// lunaxstar.com";
  return text;
}

export default function ShareCard({
  chartType,
  title,
  subtitle,
  planets,
  ascendant,
  midheaven,
  birthInfo,
  shareText,
}: ShareCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const sunSign = planets?.Sun ? getSignShort(planets.Sun) : "--";
  const moonSign = planets?.Moon ? getSignShort(planets.Moon) : "--";
  const ascSign = ascendant ? getSignShort(ascendant) : "--";

  const handleSaveImage = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `${title.replace(/\s+/g, "-")}-chart.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Failed to save image:", err);
    }
  }, [title]);

  const handleCopy = useCallback(async () => {
    const text = shareText || generateShareText(chartType, title, ascendant, planets, birthInfo);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [shareText, chartType, title, ascendant, planets, birthInfo]);

  const handleShare = useCallback(async () => {
    const text = shareText || generateShareText(chartType, title, ascendant, planets, birthInfo);
    if (navigator.share) {
      try {
        await navigator.share({ title, text });
      } catch (err) {
        console.error("Share failed:", err);
      }
    }
  }, [shareText, chartType, title, ascendant, planets, birthInfo]);

  // Generate 50 random stars for background decoration
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.7 + 0.3,
  }));

  const planetEntries = planets
    ? Object.entries(planets).slice(0, 8)
    : [];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium transition-colors"
      >
        <Share2 size={16} />
        Share
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-2 -right-2 z-10 p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X size={18} />
            </button>

            {/* Card */}
            <div
              ref={cardRef}
              className="relative overflow-hidden rounded-2xl p-6"
              style={{
                background: "linear-gradient(135deg, #2d1b69, #4a1a8a, #1a0a3e)",
              }}
            >
              {/* Stars */}
              {stars.map((star) => (
                <div
                  key={star.id}
                  className="absolute rounded-full bg-white pointer-events-none"
                  style={{
                    left: `${star.left}%`,
                    top: `${star.top}%`,
                    width: star.size,
                    height: star.size,
                    opacity: star.opacity,
                  }}
                />
              ))}

              {/* Content */}
              <div className="relative z-10">
                {/* Title area */}
                <div className="mb-4">
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-400/30 text-gray-600 mb-2">
                    {chartType}
                  </span>
                  <h2 className="text-xl font-bold text-white">{title}</h2>
                  {subtitle && (
                    <p className="text-sm text-gray-300 mt-1">{subtitle}</p>
                  )}
                </div>

                {/* Three columns: ASC / Sun / Moon */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 rounded-xl bg-gray-100">
                    <div className="text-xs text-gray-300 mb-1">ASC</div>
                    <div className="text-lg font-bold text-white">{ascSign}</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-gray-100">
                    <div className="text-xs text-gray-300 mb-1">Sun</div>
                    <div className="text-lg font-bold text-white">{sunSign}</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-gray-100">
                    <div className="text-xs text-gray-300 mb-1">Moon</div>
                    <div className="text-lg font-bold text-white">{moonSign}</div>
                  </div>
                </div>

                {/* Planet list */}
                {planetEntries.length > 0 && (
                  <div className="mb-4 p-3 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-1 mb-2 text-gray-300 text-xs">
                      <Sparkles size={12} />
                      <span>Planets</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {planetEntries.map(([planet, sign]) => (
                        <div
                          key={planet}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-600">{getPlanetShort(planet)}</span>
                          <span className="text-white font-medium">{getSignShort(sign)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="text-center text-xs text-gray-400 pt-2 border-t border-white/10">
                  lunaxstar.com
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSaveImage}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium transition-colors"
              >
                <Download size={16} />
                Save Image
              </button>
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-100 hover:bg-white/20 text-white text-sm font-medium transition-colors"
              >
                <Copy size={16} />
                {copied ? "Copied!" : "Copy"}
              </button>
              {typeof navigator !== "undefined" && "share" in navigator && (
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-100 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                >
                  <Share2 size={16} />
                  Share
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
