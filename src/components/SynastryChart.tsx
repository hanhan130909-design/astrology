"use client";

import { useState, useEffect } from "react";
import NatalChart from "./NatalChart";
import { Sparkles, Lock, Share2, CheckCircle, MessageCircle } from "lucide-react";

interface SynastryProps {
  language?: "id" | "en" | "zh";
}

// 行星符号
const PSYM: Record<string, string> = {
  Sun:"☉", Moon:"☽", Mercury:"☿", Venus:"♀", Mars:"♂",
  Jupiter:"♃", Saturn:"♄", Uranus:"♅", Neptune:"♆", Pluto:"♇",
};

const SNAME: Record<string, Record<string, string>> = {
  Sun:     {id:"Matahari",  zh:"太阳",   en:"Sun"},
  Moon:    {id:"Bulan",     zh:"月亮",   en:"Moon"},
  Mercury: {id:"Merkurius", zh:"水星",   en:"Mercury"},
  Venus:   {id:"Venus",     zh:"金星",   en:"Venus"},
  Mars:    {id:"Mars",      zh:"火星",   en:"Mars"},
  Jupiter: {id:"Jupiter",   zh:"木星",   en:"Jupiter"},
  Saturn:  {id:"Saturnus",  zh:"土星",   en:"Saturn"},
  Uranus:  {id:"Uranus",    zh:"天王星", en:"Uranus"},
  Neptune: {id:"Neptunus",  zh:"海王星", en:"Neptune"},
  Pluto:   {id:"Pluto",     zh:"冥王星", en:"Pluto"},
};

const ASPECT_COLORS: Record<string, string> = {
  Conjunction:"#FFD700", Sextile:"#4CAF50", Square:"#F44336",
  Trine:"#2196F3", Opposition:"#9C27B0",
};

const ASPECT_SYM: Record<string, string> = {
  Conjunction:"☌", Sextile:"⚹", Square:"□", Trine:"△", Opposition:"☍",
};

const ASPECTS_DEF = [
  {name:"Conjunction",  orb:10, color:"#FFD700", weight:5},
  {name:"Sextile",     orb:6,  color:"#4CAF50", weight:2},
  {name:"Square",       orb:8,  color:"#F44336", weight:4},
  {name:"Trine",        orb:8,  color:"#2196F3", weight:4},
  {name:"Opposition",   orb:10, color:"#9C27B0", weight:3},
];

const cities = [
  {value:"beijing",    label:{id:"北京",zh:"北京",en:"Beijing"}},
  {value:"shanghai",   label:{id:"上海",zh:"上海",en:"Shanghai"}},
  {value:"guangzhou",  label:{id:"广州",zh:"广州",en:"Guangzhou"}},
  {value:"shenzhen",   label:{id:"深圳",zh:"深圳",en:"Shenzhen"}},
  {value:"jakarta",    label:{id:"雅加达",zh:"雅加达",en:"Jakarta"}},
  {value:"surabaya",   label:{id:"泗水",zh:"泗水",en:"Surabaya"}},
  {value:"bandung",    label:{id:"万隆",zh:"万隆",en:"Bandung"}},
  {value:"newyork",    label:{id:"纽约",zh:"纽约",en:"New York"}},
  {value:"losangeles", label:{id:"洛杉矶",zh:"洛杉矶",en:"Los Angeles"}},
  {value:"london",      label:{id:"伦敦",zh:"伦敦",en:"London"}},
  {value:"tokyo",       label:{id:"东京",zh:"东京",en:"Tokyo"}},
  {value:"singapore",   label:{id:"新加坡",zh:"新加坡",en:"Singapore"}},
];

const translations = {
  id: {
    title:"星盘合盘分析", subtitle:"深入解读两人的行星相位",
    person1:"第一人", person2:"第二人",
    name:"姓名", year:"年", month:"月", day:"日", hour:"时", minute:"分", city:"城市",
    analyze:"分析合盘", analyzing:"分析中...",
    synastry:"合盘相位", score:"契合度",
    strong:"强连接", challenges:"挑战", opportunities:"机会",
    noAspect:"暂无相位数据", loading:"加载星盘...", error:"分析失败",
    planets:"行星", aspects:"相位",
    love:"爱情", career:"事业", communication:"沟通",
    aiReading:"AI解读", simpleReading:"简要解读", deepReading:"深度解读",
    free:"免费", unlockDeep:"解锁深度解读", shareToUnlock:"分享给3位好友解锁",
    shareProgress:"分享进度", shareComplete:"分享完成！已解锁",
    friend:"好友", relationshipAdvice:"关系建议",
  },
  zh: {
    title:"星盘合盘分析", subtitle:"深入解读两人的行星相位",
    person1:"第一人", person2:"第二人",
    name:"姓名", year:"年", month:"月", day:"日", hour:"时", minute:"分", city:"城市",
    analyze:"分析合盘", analyzing:"分析中...",
    synastry:"合盘相位", score:"契合度",
    strong:"强连接", challenges:"挑战", opportunities:"机会",
    noAspect:"暂无相位数据", loading:"加载星盘...", error:"分析失败",
    planets:"行星", aspects:"相位",
    love:"爱情", career:"事业", communication:"沟通",
    aiReading:"AI解读", simpleReading:"简要解读", deepReading:"深度解读",
    free:"免费", unlockDeep:"解锁深度解读", shareToUnlock:"分享给3位好友解锁",
    shareProgress:"分享进度", shareComplete:"分享完成！已解锁",
    friend:"好友", relationshipAdvice:"关系建议",
  },
  en: {
    title:"Synastry Analysis", subtitle:"Deep planetary aspect reading",
    person1:"Person 1", person2:"Person 2",
    name:"Name", year:"Year", month:"Month", day:"Day", hour:"Hour", minute:"Min", city:"City",
    analyze:"Analyze", analyzing:"Analyzing...",
    synastry:"Synastry Aspects", score:"Compatibility",
    strong:"Strong Links", challenges:"Challenges", opportunities:"Opportunities",
    noAspect:"No aspects", loading:"Loading...", error:"Analysis failed",
    planets:"Planets", aspects:"Aspects",
    love:"Love", career:"Career", communication:"Communication",
    aiReading:"AI Reading", simpleReading:"Summary", deepReading:"Deep Reading",
    free:"Free", unlockDeep:"Unlock Deep Reading", shareToUnlock:"Share with 3 friends to unlock",
    shareProgress:"Share Progress", shareComplete:"Sharing complete! Unlocked",
    friend:"Friend", relationshipAdvice:"Relationship Advice",
  },
};

// AI Reading Data for Synastry
const SYNASTRY_AI_READINGS: Record<string, Record<string, { summary: string; advice: string }>> = {
  zh: {
    high: { summary: "你们之间有着强烈的吸引力和默契，彼此能很好地理解和支持对方。", advice: "珍惜这份缘分，共同成长。" },
    medium: { summary: "你们的关系有潜力，但需要双方共同努力和磨合。", advice: "多沟通，学会包容和理解。" },
    low: { summary: "你们之间可能存在一些挑战和差异，需要更多的耐心和努力。", advice: "尊重彼此的差异，寻找共同点。" },
  },
  en: {
    high: { summary: "You have strong attraction and understanding, supporting each other well.", advice: "Cherish this bond and grow together." },
    medium: { summary: "Your relationship has potential but requires mutual effort.", advice: "Communicate more, learn to be tolerant." },
    low: { summary: "There may be challenges and differences requiring more patience.", advice: "Respect differences and find common ground." },
  },
  id: {
    high: { summary: "Anda memiliki daya tarik dan pemahaman yang kuat, saling mendukung.", advice: "Hargai ikatan ini dan tumbuh bersama." },
    medium: { summary: "Hubungan Anda memiliki potensi tetapi memerlukan usaha bersama.", advice: "Berkomunikasi lebih banyak, belajar toleran." },
    low: { summary: "Mungkin ada tantangan dan perbedaan yang memerlukan lebih banyak kesabaran.", advice: "Hormati perbedaan dan temukan kesamaan." },
  },
};

function normalizeAngle(a: number): number {
  return ((a % 360) + 360) % 360;
}

const ASPECT_ANGLES: Record<string, number> = {
  Conjunction: 0, Sextile: 60, Square: 90, Trine: 120, Opposition: 180,
};

function calcAspects(p1: Record<string, any>, p2: Record<string, any>) {
  const results: Array<{
    p1: string; p2: string; type: string; orb: number;
    angle: number; color: string; symbol: string; strength: number;
  }> = [];

  for (const [k1, d1] of Object.entries(p1)) {
    if (!d1 || d1.error || k1 === "North_Node" || k1 === "South_Node") continue;
    for (const [k2, d2] of Object.entries(p2)) {
      if (!d2 || d2.error || k2 === "North_Node" || k2 === "South_Node") continue;
      if (k1 >= k2) continue;

      const diff = normalizeAngle((d2.longitude || 0) - (d1.longitude || 0));
      const angle = Math.min(diff, 360 - diff);

      for (const asp of ASPECTS_DEF) {
        const targetAngle = ASPECT_ANGLES[asp.name] ?? 0;
        const diffAngle = Math.abs(angle - targetAngle);
        if (diffAngle <= asp.orb) {
          results.push({
            p1: k1, p2: k2,
            type: asp.name,
            orb: Math.round(diffAngle * 10) / 10,
            angle: Math.round(angle * 10) / 10,
            color: ASPECT_COLORS[asp.name] || "#888",
            symbol: ASPECT_SYM[asp.name] || asp.name,
            strength: asp.weight - diffAngle / asp.orb,
          });
          break;
        }
      }
    }
  }

  return results.sort((a, b) => b.strength - a.strength);
}

function calcScore(aspects: ReturnType<typeof calcAspects>) {
  if (aspects.length === 0) return 50;
  let score = 50;
  const weights: Record<string, number> = {
    Conjunction:8, Trine:5, Sextile:3, Opposition:4, Square:-3,
  };
  for (const a of aspects) {
    score += (weights[a.type] || 0) * (1 - a.orb / 10) * 3;
  }
  return Math.max(10, Math.min(98, Math.round(score)));
}

function getAspectMeaning(type: string): { love: string; career: string; comm: string } {
  const meanings: Record<string, { love: string; career: string; comm: string }> = {
    Conjunction:  { love:"两人个性强烈融合，吸引力强", career:"事业上能同心协力", comm:"想法一致，默契十足" },
    Sextile:      { love:"轻松愉快的互动，相处融洽", career:"合作关系顺利", comm:"沟通顺畅，能互补" },
    Square:       { love:"关系中有摩擦和挑战", career:"竞争中成长", comm:"沟通有障碍，需耐心" },
    Trine:        { love:"感情自然流动，和谐美好", career:"互相支持成就", comm:"心有灵犀一点通" },
    Opposition:   { love:"互相吸引也互相拉扯", career:"需学会平衡", comm:"容易误解，需多沟通" },
  };
  return meanings[type] || { love:"相位影响", career:"事业相关", comm:"沟通相关" };
}

export default function SynastryChart({ language = "zh" }: SynastryProps) {
  const t = translations[language as keyof typeof translations] || translations.zh;
  const g = (obj: Record<string, string>) => obj[language] || obj.zh || obj.id || obj.en;

  const [p1, setP1] = useState({name:"", year:"1990",month:"6",day:"15",hour:"12",minute:"0",city:"beijing"});
  const [p2, setP2] = useState({name:"", year:"1992",month:"3",day:"20",hour:"10",minute:"0",city:"jakarta"});
  const [data1, setData1] = useState<any>(null);
  const [data2, setData2] = useState<any>(null);
  const [aspects, setAspects] = useState<ReturnType<typeof calcAspects>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // AI Reading unlock state
  const [shareCount, setShareCount] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  // Load unlock state
  useEffect(() => {
    try {
      const saved = localStorage.getItem('synastry_ai_unlock');
      if (saved) {
        const s = JSON.parse(saved);
        if (s.shareCount) setShareCount(s.shareCount);
        if (s.isUnlocked) setIsUnlocked(true);
      }
    } catch {}
  }, []);
  
  const saveUnlockState = (updates: any) => {
    try {
      const current = JSON.parse(localStorage.getItem('synastry_ai_unlock') || '{}');
      localStorage.setItem('synastry_ai_unlock', JSON.stringify({ ...current, ...updates }));
    } catch {}
  };
  
  // WhatsApp share handler
  const handleShare = () => {
    const shareText = language === 'zh' 
      ? `我刚刚用星缘测试了和${p2.name || 'TA'}的配对指数，太准了！快来试试 https://lunaxstar.com/compatibility`
      : language === 'id' 
      ? `Saya baru saja menguji kecocokan dengan ${p2.name || 'mantan'} di Xingyuan, sangat akurat! Coba juga https://lunaxstar.com/compatibility`
      : `I just tested my compatibility with ${p2.name || 'my partner'} on Starry Fate, so accurate! Try it https://lunaxstar.com/compatibility`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
    
    const newCount = Math.min(shareCount + 1, 3);
    setShareCount(newCount);
    saveUnlockState({ shareCount: newCount });
    
    if (newCount >= 3) {
      setTimeout(() => {
        setIsUnlocked(true);
        saveUnlockState({ isUnlocked: true });
      }, 1500);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>, setter: (prev: any) => any) => {
    setter((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fetchChart = async (personData: any): Promise<any> => {
    const res = await fetch("/api/chart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        birthData: {
          year: parseInt(personData.year),
          month: parseInt(personData.month),
          day: parseInt(personData.day),
          hour: parseInt(personData.hour),
          minute: parseInt(personData.minute),
        },
        city: personData.city,
      }),
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [d1, d2] = await Promise.all([fetchChart(p1), fetchChart(p2)]);
      setData1(d1);
      setData2(d2);
      const asp = calcAspects(d1.planets, d2.planets);
      setAspects(asp);
    } catch (err: any) {
      setError(err.message || "Analysis failed");
    } finally {
      setIsLoading(false);
    }
  };

  const score = calcScore(aspects);
  const strongAspects = aspects.filter(a => a.type === "Trine" || a.type === "Conjunction" || a.type === "Sextile");
  const challengeAspects = aspects.filter(a => a.type === "Square" || a.type === "Opposition");

  const scoreColor = score >= 70 ? "#4CAF50" : score >= 50 ? "#FFA726" : "#F44336";

  return (
    <div className="space-y-6">
      {/* 两人信息表单 */}
      <div className="grid md:grid-cols-2 gap-6">
        {[p1, p2].map((person, idx) => {
          const setter = idx === 0 ? setP1 : setP2;
          const label = idx === 0 ? t.person1 : t.person2;
          return (
            <div key={idx} className="bg-gray-950/50 border border-gray-800/30 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-gray-600 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gray-600 text-white text-xs flex items-center justify-center font-bold">{idx+1}</span>
                {label}
              </h3>
              <input name="name" value={person.name} onChange={e => handleInput(e, setter)}
                placeholder={t.name} className="w-full bg-gray-50 border border-gray-700/40 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500/60 transition text-sm" />
              <div className="grid grid-cols-3 gap-2">
                {[["year","年",1990,2030],["month","月",1,12],["day","日",1,31]].map(([n,l,min,max])=>(
                  <div key={n as string}>
                    <label className="block text-xs text-gray-400 mb-1">{l}</label>
                    <input name={n as string} value={(person as any)[n as string]} onChange={e=>handleInput(e,setter)}
                      type="number" min={min} max={max}
                      className="w-full bg-gray-50 border border-gray-700/40 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-500/60" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[["hour","时",0,23],["minute","分",0,59]].map(([n,l,min,max])=>(
                  <div key={n as string}>
                    <label className="block text-xs text-gray-400 mb-1">{l}</label>
                    <input name={n as string} value={(person as any)[n as string]} onChange={e=>handleInput(e,setter)}
                      type="number" min={min} max={max}
                      className="w-full bg-gray-50 border border-gray-700/40 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-500/60" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">{t.city}</label>
                <select name="city" value={person.city} onChange={e=>handleInput(e,setter)}
                  className="w-full bg-gray-50 border border-gray-700/40 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-gray-500/60">
                  {cities.map(c=><option key={c.value} value={c.value}>{g(c.label)}</option>)}
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {/* 分析按钮 */}
      <button onClick={handleAnalyze} disabled={isLoading}
        className="w-full bg-gradient-to-r from-gray-600 to-gray-600 hover:from-gray-500 hover:to-gray-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-gray-900/30 text-lg">
        {isLoading ? t.analyzing : t.analyze}
      </button>

      {error && <p className="text-gray-400 text-sm text-center bg-gray-950/30 rounded-xl px-4 py-3">{error}</p>}

      {/* 合盘结果 */}
      {aspects.length > 0 && (
        <>
          {/* 契合度分数 */}
          <div className="bg-gray-950/50 border border-gray-800/30 rounded-2xl p-6 text-center">
            <div className="text-sm text-gray-400 mb-2">{t.score}</div>
            <div className="text-6xl font-bold mb-2" style={{color:scoreColor}}>{score}</div>
            <div className="w-full bg-white rounded-full h-3 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{width:`${score}%`, backgroundColor:scoreColor}} />
            </div>
            <div className="mt-3 text-sm text-gray-300">
              {score >= 70 ? "🌟 高度契合" : score >= 50 ? "⚡ 中等契合" : "🌊 需要努力"}
            </div>
          </div>

          {/* 双人星盘并排 */}
          {data1 && data2 && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-950/40 border border-gray-800/30 rounded-2xl p-4">
                <div className="text-center mb-3">
                  <div className="text-gray-600 font-bold">{p1.name || "第一人"}</div>
                  <div className="text-xs text-gray-400">{data1.ascendant} 上升 · {data1.midheaven} 天顶</div>
                </div>
                <div className="flex justify-center">
                  <NatalChart planets={data1.planets} houses={data1.houses} aspects={[]} size={240} />
                </div>
              </div>
              <div className="bg-gray-950/40 border border-gray-800/30 rounded-2xl p-4">
                <div className="text-center mb-3">
                  <div className="text-gray-200 font-bold">{p2.name || "第二人"}</div>
                  <div className="text-xs text-gray-400">{data2.ascendant} 上升 · {data2.midheaven} 天顶</div>
                </div>
                <div className="flex justify-center">
                  <NatalChart planets={data2.planets} houses={data2.houses} aspects={[]} size={240} />
                </div>
              </div>
            </div>
          )}

          {/* 行星相位分析 */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-gray-600">{t.synastry} ({aspects.length})</h3>

            {/* 强连接 */}
            {strongAspects.length > 0 && (
              <div className="bg-gray-950/30 border border-gray-800/30 rounded-xl p-4">
                <div className="text-sm font-bold text-gray-300 mb-2">🌟 {t.strong}</div>
                <div className="space-y-2">
                  {strongAspects.map((a, i) => {
                    const m = getAspectMeaning(a.type);
                    return (
                      <div key={i} className="flex items-start gap-3 bg-gray-950/30 rounded-lg px-3 py-2">
                        <span className="text-xl" style={{color:a.color}}>{a.symbol}</span>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-white">
                            <span style={{color:a.color}}>{g(SNAME[a.p1]||{id:a.p1,zh:a.p1,en:a.p1})}</span>
                            <span className="text-gray-400 mx-1">-</span>
                            <span style={{color:a.color}}>{g(SNAME[a.p2]||{id:a.p2,zh:a.p2,en:a.p2})}</span>
                            <span className="ml-2 text-xs text-gray-400">orb {a.orb}°</span>
                          </div>
                          <div className="text-xs text-gray-300 mt-0.5">{m.love}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 挑战 */}
            {challengeAspects.length > 0 && (
              <div className="bg-gray-950/30 border border-gray-800/30 rounded-xl p-4">
                <div className="text-sm font-bold text-gray-600 mb-2">⚡ {t.challenges}</div>
                <div className="space-y-2">
                  {challengeAspects.map((a, i) => {
                    const m = getAspectMeaning(a.type);
                    return (
                      <div key={i} className="flex items-start gap-3 bg-gray-950/30 rounded-lg px-3 py-2">
                        <span className="text-xl" style={{color:a.color}}>{a.symbol}</span>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-white">
                            <span style={{color:a.color}}>{g(SNAME[a.p1]||{id:a.p1,zh:a.p1,en:a.p1})}</span>
                            <span className="text-gray-400 mx-1">-</span>
                            <span style={{color:a.color}}>{g(SNAME[a.p2]||{id:a.p2,zh:a.p2,en:a.p2})}</span>
                            <span className="ml-2 text-xs text-gray-400">orb {a.orb}°</span>
                          </div>
                          <div className="text-xs text-gray-300 mt-0.5">{m.love}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 完整相位列表 */}
            <details className="bg-gray-50 border border-gray-800/30 rounded-xl">
              <summary className="text-sm text-gray-300 cursor-pointer px-4 py-3 hover:text-white transition">
                📋 {t.aspects} ({aspects.length})
              </summary>
              <div className="px-4 pb-3 space-y-1.5 max-h-72 overflow-y-auto">
                {aspects.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs py-1 border-b border-gray-900/20 last:border-0">
                    <span className="font-bold" style={{color:a.color}}>{a.symbol}</span>
                    <span className="text-gray-300">{g(SNAME[a.p1]||{id:a.p1,zh:a.p1,en:a.p1})}</span>
                    <span className="text-gray-500">vs</span>
                    <span className="text-gray-300">{g(SNAME[a.p2]||{id:a.p2,zh:a.p2,en:a.p2})}</span>
                    <span className="ml-auto text-gray-500">{a.type} · orb {a.orb}°</span>
                  </div>
                ))}
              </div>
            </details>
          </div>
          
          {/* AI 解读 */}
          <div className="space-y-4 mt-6">
            {/* 简要解读 - 免费 */}
            <div className="bg-gray-950/50 border border-gray-800/30 rounded-2xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-gray-600" />
                {t.aiReading} - {t.simpleReading}
                <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400 text-xs">{t.free}</span>
              </h3>
              {(() => {
                const readingLevel = score >= 70 ? 'high' : score >= 50 ? 'medium' : 'low';
                const reading = SYNASTRY_AI_READINGS[language]?.[readingLevel] || SYNASTRY_AI_READINGS.zh[readingLevel];
                return (
                  <div className="p-4 rounded-xl bg-gray-500/10 border border-gray-200">
                    <p className="text-gray-600 text-sm mb-2">{reading.summary}</p>
                    <p className="text-xs text-gray-500 italic">💡 {reading.advice}</p>
                  </div>
                );
              })()}
            </div>
            
            {/* 深度解读 - 需解锁 */}
            <div className="rounded-2xl overflow-hidden border border-gray-800/30">
              {/* Header */}
              <div className="p-5 bg-gradient-to-r from-gray-50/40 to-gray-900/40 flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                  {isUnlocked ? <Sparkles size={18} className="text-gray-400" /> : <Lock size={18} className="text-gray-500" />}
                  {t.aiReading} - {t.deepReading}
                </h3>
                {isUnlocked && <span className="text-xs text-gray-400 flex items-center gap-1"><CheckCircle size={14} />{t.shareComplete}</span>}
              </div>
              
              {/* Content */}
              {isUnlocked ? (
                <div className="p-5 space-y-4 bg-gray-950/30">
                  {/* 爱情建议 */}
                  <div className="p-4 rounded-xl bg-gray-500/10 border border-gray-500/20">
                    <h4 className="font-bold mb-2 text-gray-400">❤️ {t.love}</h4>
                    <p className="text-gray-600 text-sm">
                      {score >= 70 
                        ? (language === 'zh' ? '你们的爱情充满激情和浪漫，彼此深深吸引。' : language === 'id' ? 'Cinta Anda penuh gairah dan romantis.' : 'Your love is full of passion and romance.')
                        : score >= 50 
                        ? (language === 'zh' ? '你们的感情需要更多经营和呵护。' : language === 'id' ? 'Perasaan Anda membutuhkan lebih banyak perhatian.' : 'Your relationship needs more care.')
                        : (language === 'zh' ? '你们需要更多耐心来理解彼此。' : language === 'id' ? 'Anda perlu lebih banyak kesabaran.' : 'You need more patience to understand each other.')}
                    </p>
                  </div>
                  {/* 沟通建议 */}
                  <div className="p-4 rounded-xl bg-gray-500/10 border border-gray-500/20">
                    <h4 className="font-bold mb-2 text-gray-400">💬 {t.communication}</h4>
                    <p className="text-gray-600 text-sm">
                      {strongAspects.length > challengeAspects.length
                        ? (language === 'zh' ? '你们的沟通顺畅，能够很好地理解对方。' : 'Your communication is smooth.')
                        : (language === 'zh' ? '建议多倾听，避免误解和冲突。' : 'Listen more to avoid misunderstandings.')}
                    </p>
                  </div>
                  {/* 事业建议 */}
                  <div className="p-4 rounded-xl bg-gray-500/10 border border-gray-500/20">
                    <h4 className="font-bold mb-2 text-gray-600">💼 {t.career}</h4>
                    <p className="text-gray-600 text-sm">
                      {language === 'zh' ? '在事业上，你们可以互相支持和鼓励，共同成长。' : 'In career, you can support and encourage each other.'}
                    </p>
                  </div>
                </div>
              ) : (
                /* Locked */
                <div className="p-6 space-y-5 bg-gray-950/30">
                  {/* Blurred Preview */}
                  <div className="relative">
                    <div className="space-y-3 blur-sm pointer-events-none select-none opacity-60">
                      <div className="p-4 rounded-xl bg-white"><div className="h-4 bg-gray-100 rounded w-3/4 mb-2" /><div className="h-3 bg-gray-100 rounded w-full" /></div>
                      <div className="p-4 rounded-xl bg-white"><div className="h-4 bg-gray-100 rounded w-2/3 mb-2" /><div className="h-3 bg-gray-100 rounded w-full" /></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Lock size={32} className="text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-600 font-medium">{t.unlockDeep}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* WhatsApp Share */}
                  <div className="p-4 rounded-xl bg-gray-500/10 border border-gray-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <MessageCircle size={20} className="text-gray-400" />
                      <div className="font-medium text-white text-sm">{t.shareToUnlock}</div>
                    </div>
                    {/* Progress */}
                    <div className="flex gap-2 mb-3">
                      {[1, 2, 3].map(n => (
                        <div key={n} className={`flex-1 h-2 rounded-full transition-all ${shareCount >= n ? "bg-gray-500" : "bg-gray-100"}`} />
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mb-3">{t.shareProgress}: {shareCount}/3</div>
                    
                    {shareCount < 3 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3].map(n => (
                          <button key={n} onClick={handleShare} disabled={shareCount >= n}
                            className={`py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${shareCount >= n ? "bg-gray-500/20 text-gray-400 border border-gray-500/30" : "bg-white hover:bg-gray-500/20 text-gray-600 hover:text-gray-300 border border-gray-300"}`}>
                            {shareCount >= n ? <CheckCircle size={12} /> : <Share2 size={12} />}
                            {t.friend} {n}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 font-medium text-sm flex items-center justify-center gap-2">
                        <CheckCircle size={16} />{t.shareComplete}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
