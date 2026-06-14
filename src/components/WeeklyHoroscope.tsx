"use client";

import { useState } from "react";
import Link from "next/link";

const signs = [
  { id: "aries", symbol: "♈", name: "Aries", dates: "Mar 21 - Apr 19" },
  { id: "taurus", symbol: "♉", name: "Taurus", dates: "Apr 20 - May 20" },
  { id: "gemini", symbol: "♊", name: "Gemini", dates: "May 21 - Jun 20" },
  { id: "cancer", symbol: "♋", name: "Cancer", dates: "Jun 21 - Jul 22" },
  { id: "leo", symbol: "♌", name: "Leo", dates: "Jul 23 - Aug 22" },
  { id: "virgo", symbol: "♍", name: "Virgo", dates: "Aug 23 - Sep 22" },
  { id: "libra", symbol: "♎", name: "Libra", dates: "Sep 23 - Oct 22" },
  { id: "scorpio", symbol: "♏", name: "Scorpio", dates: "Oct 23 - Nov 21" },
  { id: "sagittarius", symbol: "♐", name: "Sagittarius", dates: "Nov 22 - Dec 21" },
  { id: "capricorn", symbol: "♑", name: "Capricorn", dates: "Dec 22 - Jan 19" },
  { id: "aquarius", symbol: "♒", name: "Aquarius", dates: "Jan 20 - Feb 18" },
  { id: "pisces", symbol: "♓", name: "Pisces", dates: "Feb 19 - Mar 20" },
];

// 详细每周运势
const weeklyHoroscope: Record<string, { overall: number; focus: string; love: string; career: string; advice: string; lucky: { day: string; color: string; number: number } }> = {
  aries: { overall: 85, focus: "Career breakthrough", love: "Passionate encounters", career: "Leadership opportunities", advice: "Trust your instincts", lucky: { day: "Tuesday", color: "Red", number: 9 } },
  taurus: { overall: 78, focus: "Financial growth", love: "Stable and sensual", career: "Steady progress", advice: "Be patient", lucky: { day: "Friday", color: "Green", number: 6 } },
  gemini: { overall: 88, focus: "Communication wins", love: "Intellectual connections", career: "Creative projects", advice: "Focus on one thing", lucky: { day: "Wednesday", color: "Yellow", number: 5 } },
  cancer: { overall: 75, focus: "Home and family", love: "Deep emotional bonds", career: "Behind the scenes work", advice: "Set boundaries", lucky: { day: "Monday", color: "Silver", number: 2 } },
  leo: { overall: 92, focus: "Spotlight moments", love: "Romantic drama", career: "Public recognition", advice: "Stay humble", lucky: { day: "Sunday", color: "Gold", number: 1 } },
  virgo: { overall: 80, focus: "Health and details", love: "Practical romance", career: "Organization pays off", advice: "Don't overthink", lucky: { day: "Wednesday", color: "Navy", number: 3 } },
  libra: { overall: 82, focus: "Relationships harmony", love: "Partnership focus", career: "Collaborations", advice: "Make decisions faster", lucky: { day: "Friday", color: "Pink", number: 6 } },
  scorpio: { overall: 85, focus: "Transformation", love: "Intense connections", career: "Research and depth", advice: "Let go of control", lucky: { day: "Tuesday", color: "Burgundy", number: 8 } },
  sagittarius: { overall: 90, focus: "Adventure calls", love: "Freedom in love", career: "Expansion opportunities", advice: "Follow through", lucky: { day: "Thursday", color: "Purple", number: 9 } },
  capricorn: { overall: 78, focus: "Ambition achieved", love: "Serious commitments", career: "Authority recognized", advice: "Take a break", lucky: { day: "Saturday", color: "Black", number: 4 } },
  aquarius: { overall: 85, focus: "Innovation time", love: "Unconventional romance", career: "Tech and ideas", advice: "Connect emotionally", lucky: { day: "Saturday", color: "Electric Blue", number: 11 } },
  pisces: { overall: 80, focus: "Spiritual growth", love: "Soul connections", career: "Creative flow", advice: "Stay grounded", lucky: { day: "Thursday", color: "Sea Green", number: 7 } },
};

export default function WeeklyHoroscope() {
  const [selectedSign, setSelectedSign] = useState("aries");

  const currentData = weeklyHoroscope[selectedSign];
  const currentSign = signs.find(s => s.id === selectedSign);

  return (
    <div className="w-full space-y-6">
      {/* 星座选择 */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {signs.map((sign) => (
          <button
            key={sign.id}
            onClick={() => setSelectedSign(sign.id)}
            className={`p-3 rounded-xl text-center transition-all ${
              selectedSign === sign.id
                ? "bg-gradient-to-br from-gray-500/30 to-gray-600/30 border-2 border-gray-400"
                : "bg-gray-900/30 border border-gray-200 hover:border-gray-400/50"
            }`}
          >
            <div className="text-2xl">{sign.symbol}</div>
            <div className="text-xs text-gray-600">{sign.name}</div>
          </button>
        ))}
      </div>

      {/* 运势展示 */}
      {currentData && (
        <div className="space-y-4">
          {/* 综合评分 */}
          <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-gray-900/30 to-gray-900/30 border border-gray-500/30">
            <div className="text-6xl font-bold text-gray-100 mb-2">{currentData.overall}%</div>
            <div className="text-gray-600">Weekly Score for {currentSign?.symbol} {currentSign?.name}</div>
          </div>

          {/* 详细内容 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gray-900/30 border border-gray-200">
              <h4 className="text-gray-100 font-semibold mb-2">🎯 Focus</h4>
              <p className="text-gray-600">{currentData.focus}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-900/30 border border-gray-500/20">
              <h4 className="text-gray-100 font-semibold mb-2">💕 Love</h4>
              <p className="text-gray-600">{currentData.love}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-900/30 border border-gray-500/20">
              <h4 className="text-gray-100 font-semibold mb-2">💼 Career</h4>
              <p className="text-gray-600">{currentData.career}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-900/30 border border-gray-500/20">
              <h4 className="text-gray-100 font-semibold mb-2">💡 Advice</h4>
              <p className="text-gray-600">{currentData.advice}</p>
            </div>
          </div>

          {/* 幸运指南 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-4 rounded-xl bg-gray-900/20 border border-gray-500/30">
              <div className="text-xs text-gray-600 mb-1">Lucky Day</div>
              <div className="text-lg font-bold text-gray-100">{currentData.lucky.day}</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gray-900/20 border border-gray-500/30">
              <div className="text-xs text-gray-300 mb-1">Lucky Color</div>
              <div className="text-lg font-bold text-gray-100">{currentData.lucky.color}</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gray-900/20 border border-gray-500/30">
              <div className="text-xs text-gray-300 mb-1">Lucky Number</div>
              <div className="text-lg font-bold text-gray-100">{currentData.lucky.number}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}