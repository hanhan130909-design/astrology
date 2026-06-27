"use client";

import { useMemo, useState } from "react";
import * as Astronomy from "astronomy-engine";
import { CalendarDays, ChevronLeft, ChevronRight, CircleDot, Filter, Moon, Sparkles, Sun } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Lang = "zh" | "en" | "id" | string;
type EventKind = "ingress" | "moon" | "retrograde" | "direct" | "aspect";

type AstroEvent = {
  id: string;
  date: string;
  kind: EventKind;
  title: Record<string, string>;
  detail: Record<string, string>;
  icon: string;
  tone: "gold" | "blue" | "red" | "green" | "gray";
};

const PLANETS = [
  { id: "Mercury", body: Astronomy.Body.Mercury, icon: "☿", zh: "水星", en: "Mercury", idn: "Merkurius" },
  { id: "Venus", body: Astronomy.Body.Venus, icon: "♀", zh: "金星", en: "Venus", idn: "Venus" },
  { id: "Mars", body: Astronomy.Body.Mars, icon: "♂", zh: "火星", en: "Mars", idn: "Mars" },
  { id: "Jupiter", body: Astronomy.Body.Jupiter, icon: "♃", zh: "木星", en: "Jupiter", idn: "Jupiter" },
  { id: "Saturn", body: Astronomy.Body.Saturn, icon: "♄", zh: "土星", en: "Saturn", idn: "Saturnus" },
];

const SIGNS = [
  { icon: "♈", zh: "白羊座", en: "Aries", id: "Aries" },
  { icon: "♉", zh: "金牛座", en: "Taurus", id: "Taurus" },
  { icon: "♊", zh: "双子座", en: "Gemini", id: "Gemini" },
  { icon: "♋", zh: "巨蟹座", en: "Cancer", id: "Cancer" },
  { icon: "♌", zh: "狮子座", en: "Leo", id: "Leo" },
  { icon: "♍", zh: "处女座", en: "Virgo", id: "Virgo" },
  { icon: "♎", zh: "天秤座", en: "Libra", id: "Libra" },
  { icon: "♏", zh: "天蝎座", en: "Scorpio", id: "Scorpio" },
  { icon: "♐", zh: "射手座", en: "Sagittarius", id: "Sagittarius" },
  { icon: "♑", zh: "摩羯座", en: "Capricorn", id: "Capricorn" },
  { icon: "♒", zh: "水瓶座", en: "Aquarius", id: "Aquarius" },
  { icon: "♓", zh: "双鱼座", en: "Pisces", id: "Pisces" },
];

const ASPECTS = [
  { angle: 0, zh: "合相", en: "conjunction", id: "konjungsi", icon: "☌" },
  { angle: 60, zh: "六合", en: "sextile", id: "sextile", icon: "⚹" },
  { angle: 90, zh: "四分相", en: "square", id: "square", icon: "□" },
  { angle: 120, zh: "三分相", en: "trine", id: "trine", icon: "△" },
  { angle: 180, zh: "对分相", en: "opposition", id: "oposisi", icon: "☍" },
];

const COPY = {
  zh: {
    title: "星象日历",
    subtitle: "查看每月太阳换座、月相、行星换座、逆行顺行和主要相位。",
    month: "本月星象",
    today: "今天",
    all: "全部",
    ingress: "换座",
    moon: "月相",
    retrograde: "逆行",
    direct: "顺行",
    aspect: "相位",
    noEvents: "这一天没有重点星象",
    selected: "选中日期",
    overview: "月度重点",
    calendar: "日历",
    list: "事件列表",
  },
  en: {
    title: "Astrology Calendar",
    subtitle: "Monthly planetary ingresses, moon phases, retrogrades, direct stations, and major aspects.",
    month: "This Month",
    today: "Today",
    all: "All",
    ingress: "Ingress",
    moon: "Moon",
    retrograde: "Retrograde",
    direct: "Direct",
    aspect: "Aspect",
    noEvents: "No major astrological event on this date",
    selected: "Selected Date",
    overview: "Monthly Highlights",
    calendar: "Calendar",
    list: "Event List",
  },
  id: {
    title: "Kalender Astrologi",
    subtitle: "Ingress planet, fase bulan, retrograde, direct, dan aspek utama setiap bulan.",
    month: "Bulan Ini",
    today: "Hari Ini",
    all: "Semua",
    ingress: "Ingress",
    moon: "Bulan",
    retrograde: "Retrograde",
    direct: "Direct",
    aspect: "Aspek",
    noEvents: "Tidak ada peristiwa astrologi utama hari ini",
    selected: "Tanggal Dipilih",
    overview: "Sorotan Bulanan",
    calendar: "Kalender",
    list: "Daftar Peristiwa",
  },
};

function t(language: Lang) {
  return COPY[language as keyof typeof COPY] || COPY.zh;
}

function localName(item: any, language: Lang) {
  return language === "en" ? item.en : language === "id" ? item.id || item.idn : item.zh;
}

function iso(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function norm(value: number) {
  return ((value % 360) + 360) % 360;
}

function angleDistance(a: number, b: number) {
  const diff = Math.abs(norm(a - b));
  return diff > 180 ? 360 - diff : diff;
}

function planetLongitude(body: Astronomy.Body, date: Date) {
  const time = Astronomy.MakeTime(date);
  if (body === Astronomy.Body.Moon) return norm(Astronomy.EclipticGeoMoon(time).lon);
  const vector = Astronomy.GeoVector(body, time, true);
  return norm(Astronomy.Ecliptic(vector).elon);
}

function signIndex(lon: number) {
  return Math.floor(norm(lon) / 30);
}

function findSolarIngresses(year: number, month: number): AstroEvent[] {
  const events: AstroEvent[] = [];
  const start = new Date(year, month - 1, 1, 12);
  const end = new Date(year, month, 1, 12);
  for (let sign = 0; sign < 12; sign += 1) {
    const found = Astronomy.SearchSunLongitude(sign * 30, start, 35);
    if (!found) continue;
    const date = found.date;
    if (date >= start && date < end) {
      const target = SIGNS[sign];
      events.push({
        id: `sun-${iso(date)}`,
        date: iso(date),
        kind: "ingress",
        icon: `☉ ${target.icon}`,
        tone: "gold",
        title: {
          zh: `太阳进入${target.zh}`,
          en: `Sun enters ${target.en}`,
          id: `Matahari masuk ${target.id}`,
        },
        detail: {
          zh: "太阳换座标记一个新的月度主题，适合调整本月关注重点。",
          en: "Solar ingress marks a new monthly theme and helps set the focus for the weeks ahead.",
          id: "Ingress Matahari menandai tema bulanan baru dan fokus beberapa minggu ke depan.",
        },
      });
    }
  }
  return events;
}

function findMoonQuarters(year: number, month: number): AstroEvent[] {
  const labels = [
    { zh: "新月", en: "New Moon", id: "Bulan Baru", icon: "●" },
    { zh: "上弦月", en: "First Quarter", id: "Kuartal Pertama", icon: "◐" },
    { zh: "满月", en: "Full Moon", id: "Bulan Purnama", icon: "○" },
    { zh: "下弦月", en: "Last Quarter", id: "Kuartal Akhir", icon: "◑" },
  ];
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);
  const events: AstroEvent[] = [];
  let quarter = Astronomy.SearchMoonQuarter(start);
  let guard = 0;
  while (quarter && quarter.time.date < end && guard < 8) {
    if (quarter.time.date >= start) {
      const label = labels[quarter.quarter];
      events.push({
        id: `moon-${quarter.quarter}-${iso(quarter.time.date)}`,
        date: iso(quarter.time.date),
        kind: "moon",
        icon: label.icon,
        tone: "blue",
        title: { zh: label.zh, en: label.en, id: label.id },
        detail: {
          zh: quarter.quarter === 0 ? "适合设定意图、开始新的月相周期。" : quarter.quarter === 2 ? "情绪与事件容易到达峰值，适合看清结果。" : "月相转换日，适合调整节奏与复盘。",
          en: quarter.quarter === 0 ? "Good for setting intentions and beginning a new lunar cycle." : quarter.quarter === 2 ? "Emotions and events can peak, making results easier to see." : "A lunar turning point for adjusting pace and reviewing progress.",
          id: quarter.quarter === 0 ? "Baik untuk menetapkan niat dan memulai siklus bulan baru." : quarter.quarter === 2 ? "Emosi dan peristiwa bisa memuncak, hasil lebih mudah terlihat." : "Titik balik bulan untuk menyesuaikan ritme dan evaluasi.",
        },
      });
    }
    quarter = Astronomy.NextMoonQuarter(quarter);
    guard += 1;
  }
  return events;
}

function findPlanetEvents(year: number, month: number, language: Lang): AstroEvent[] {
  const events: AstroEvent[] = [];
  const start = new Date(year, month - 1, 1, 12);
  const end = new Date(year, month, 1, 12);
  for (const planet of PLANETS) {
    let prevDate = addDays(start, -1);
    let prevLon = planetLongitude(planet.body, prevDate);
    let prevSign = signIndex(prevLon);
    let prevSpeed = norm(planetLongitude(planet.body, start) - prevLon);
    if (prevSpeed > 180) prevSpeed -= 360;
    for (let date = new Date(start); date < end; date = addDays(date, 1)) {
      const lon = planetLongitude(planet.body, date);
      const currentSign = signIndex(lon);
      let speed = norm(lon - prevLon);
      if (speed > 180) speed -= 360;
      if (currentSign !== prevSign) {
        const target = SIGNS[currentSign];
        events.push({
          id: `${planet.id}-ingress-${iso(date)}`,
          date: iso(date),
          kind: "ingress",
          icon: `${planet.icon} ${target.icon}`,
          tone: "green",
          title: {
            zh: `${planet.zh}进入${target.zh}`,
            en: `${planet.en} enters ${target.en}`,
            id: `${planet.idn} masuk ${target.id}`,
          },
          detail: {
            zh: `${planet.zh}换座，相关议题会换一种表达方式。`,
            en: `${planet.en} changes signs, shifting how its themes are expressed.`,
            id: `${planet.idn} berpindah tanda, mengubah cara tema planet ini diekspresikan.`,
          },
        });
      }
      if (planet.id === "Mercury" || planet.id === "Venus" || planet.id === "Mars") {
        if (prevSpeed > 0 && speed < 0) {
          events.push({
            id: `${planet.id}-retro-${iso(date)}`,
            date: iso(date),
            kind: "retrograde",
            icon: `${planet.icon} ℞`,
            tone: "red",
            title: { zh: `${planet.zh}开始逆行`, en: `${planet.en} stations retrograde`, id: `${planet.idn} mulai retrograde` },
            detail: { zh: "适合放慢速度，复盘、修正、重新确认计划。", en: "Slow down, review, revise, and reconfirm plans.", id: "Perlambat ritme, evaluasi, revisi, dan konfirmasi ulang rencana." },
          });
        }
        if (prevSpeed < 0 && speed > 0) {
          events.push({
            id: `${planet.id}-direct-${iso(date)}`,
            date: iso(date),
            kind: "direct",
            icon: `${planet.icon} D`,
            tone: "green",
            title: { zh: `${planet.zh}恢复顺行`, en: `${planet.en} stations direct`, id: `${planet.idn} kembali direct` },
            detail: { zh: "停滞议题开始恢复推进，适合重新启动安排。", en: "Stalled matters begin moving again; good for restarting plans.", id: "Hal yang tertunda mulai bergerak lagi; baik untuk memulai ulang rencana." },
          });
        }
      }
      prevDate = date;
      prevLon = lon;
      prevSign = currentSign;
      prevSpeed = speed;
    }
  }

  const aspectPairs = [
    [Astronomy.Body.Sun, Astronomy.Body.Mercury, "太阳", "Sun", "Matahari", "水星", "Mercury", "Merkurius", "☉☿"],
    [Astronomy.Body.Sun, Astronomy.Body.Venus, "太阳", "Sun", "Matahari", "金星", "Venus", "Venus", "☉♀"],
    [Astronomy.Body.Mars, Astronomy.Body.Jupiter, "火星", "Mars", "Mars", "木星", "Jupiter", "Jupiter", "♂♃"],
    [Astronomy.Body.Jupiter, Astronomy.Body.Saturn, "木星", "Jupiter", "Jupiter", "土星", "Saturn", "Saturnus", "♃♄"],
  ] as const;

  for (const pair of aspectPairs) {
    for (let date = start; date < end; date = addDays(date, 1)) {
      const a = planetLongitude(pair[0], date);
      const b = planetLongitude(pair[1], date);
      const sep = angleDistance(a, b);
      const aspect = ASPECTS.find(item => Math.abs(sep - item.angle) <= 1.2);
      if (!aspect) continue;
      events.push({
        id: `${pair[1]}-${aspect.angle}-${iso(date)}`,
        date: iso(date),
        kind: "aspect",
        icon: `${pair[8]} ${aspect.icon}`,
        tone: "gray",
        title: {
          zh: `${pair[2]}与${pair[5]}${aspect.zh}`,
          en: `${pair[3]} ${aspect.en} ${pair[6]}`,
          id: `${pair[4]} ${aspect.id} ${pair[7]}`,
        },
        detail: {
          zh: "主要相位日，适合观察相关主题如何互动与显化。",
          en: "A major aspect day. Watch how the two planetary themes interact and show up.",
          id: "Hari aspek utama. Amati bagaimana dua tema planet berinteraksi dan muncul.",
        },
      });
    }
  }

  return events.filter((event, index, list) => list.findIndex(item => item.id === event.id) === index);
}

function buildEvents(year: number, month: number, language: Lang) {
  return [...findSolarIngresses(year, month), ...findMoonQuarters(year, month), ...findPlanetEvents(year, month, language)]
    .sort((a, b) => a.date.localeCompare(b.date) || a.title.zh.localeCompare(b.title.zh));
}

function monthDays(year: number, month: number) {
  const first = new Date(year, month - 1, 1);
  const days = new Date(year, month, 0).getDate();
  const leading = first.getDay();
  return [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: days }, (_, index) => new Date(year, month - 1, index + 1)),
  ];
}

function eventTone(tone: AstroEvent["tone"]) {
  return {
    gold: "border-amber-200 bg-amber-50 text-amber-900",
    blue: "border-sky-200 bg-sky-50 text-sky-900",
    red: "border-rose-200 bg-rose-50 text-rose-900",
    green: "border-emerald-200 bg-emerald-50 text-emerald-900",
    gray: "border-slate-200 bg-slate-50 text-slate-900",
  }[tone];
}

export default function TransitsPage() {
  const { language } = useLanguage();
  const copy = t(language);
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(iso(today));
  const [filter, setFilter] = useState<EventKind | "all">("all");

  const year = cursor.getFullYear();
  const month = cursor.getMonth() + 1;
  const events = useMemo(() => buildEvents(year, month, language), [year, month, language]);
  const filteredEvents = filter === "all" ? events : events.filter(event => event.kind === filter);
  const selectedEvents = filteredEvents.filter(event => event.date === selectedDate);
  const days = monthDays(year, month);
  const monthLabel = cursor.toLocaleDateString(language === "zh" ? "zh-CN" : language === "id" ? "id-ID" : "en-US", { year: "numeric", month: "long" });
  const filters: Array<EventKind | "all"> = ["all", "ingress", "moon", "retrograde", "direct", "aspect"];

  const moveMonth = (offset: number) => {
    const next = new Date(year, month - 1 + offset, 1);
    setCursor(next);
    setSelectedDate(iso(next));
  };

  return (
    <main className="min-h-screen bg-[#f7f4ed] text-[#171717]">
      <section className="border-b border-[#ded6c7] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-7 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-[#8a7244]"><Sparkles size={16} /> {copy.month}</p>
              <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">{copy.title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#666] sm:text-base">{copy.subtitle}</p>
            </div>
            <button
              onClick={() => { setCursor(new Date(today.getFullYear(), today.getMonth(), 1)); setSelectedDate(iso(today)); }}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-[#c9bea8] bg-white px-4 text-sm font-medium text-[#4a4337] shadow-sm"
            >
              <CircleDot size={16} /> {copy.today}
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={16} className="text-[#9b8558]" />
            {filters.map(item => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`h-9 rounded-md px-3 text-sm font-medium ${filter === item ? "bg-[#171717] text-white" : "bg-[#eee8dc] text-[#5a5144]"}`}
              >
                {copy[item]}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[1.35fr_.9fr] lg:px-8">
        <div className="rounded-lg border border-[#d7cebf] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#ece5d8] px-4 py-3">
            <button onClick={() => moveMonth(-1)} className="rounded-md p-2 hover:bg-[#f4efe6]" aria-label="Previous month"><ChevronLeft size={20} /></button>
            <div className="flex items-center gap-2 text-lg font-semibold"><CalendarDays size={20} /> {monthLabel}</div>
            <button onClick={() => moveMonth(1)} className="rounded-md p-2 hover:bg-[#f4efe6]" aria-label="Next month"><ChevronRight size={20} /></button>
          </div>
          <div className="grid grid-cols-7 border-b border-[#ece5d8] bg-[#fbf8f1] text-center text-xs font-medium text-[#8c806b]">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => <div key={day} className="py-2">{day}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {days.map((day, index) => {
              const dateKey = day ? iso(day) : "";
              const dayEvents = filteredEvents.filter(event => event.date === dateKey);
              const active = dateKey === selectedDate;
              return (
                <button
                  key={`${dateKey}-${index}`}
                  disabled={!day}
                  onClick={() => day && setSelectedDate(dateKey)}
                  className={`min-h-[88px] border-b border-r border-[#eee7dc] p-2 text-left align-top transition ${active ? "bg-[#fff3cf]" : "bg-white hover:bg-[#fbf8f1]"} disabled:bg-[#faf8f3]`}
                >
                  {day && (
                    <>
                      <div className="mb-2 text-sm font-semibold text-[#2f2a22]">{day.getDate()}</div>
                      <div className="flex flex-wrap gap-1">
                        {dayEvents.slice(0, 3).map(event => <span key={event.id} className="text-base leading-none" title={localName(event.title, language)}>{event.icon.split(" ")[0]}</span>)}
                        {dayEvents.length > 3 && <span className="text-[11px] text-[#8a7244]">+{dayEvents.length - 3}</span>}
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <aside className="space-y-5">
          <section className="rounded-lg border border-[#d7cebf] bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">{copy.selected}</h2>
            <div className="mb-4 text-sm text-[#7b6f5d]">{selectedDate}</div>
            <div className="space-y-3">
              {selectedEvents.length ? selectedEvents.map(event => (
                <article key={event.id} className={`rounded-md border p-3 ${eventTone(event.tone)}`}>
                  <div className="mb-1 flex items-center gap-2 font-semibold"><span className="text-xl">{event.icon}</span>{localName(event.title, language)}</div>
                  <p className="text-sm leading-6 opacity-90">{localName(event.detail, language)}</p>
                </article>
              )) : (
                <div className="rounded-md border border-dashed border-[#d8cebd] bg-[#fbf8f1] p-4 text-sm text-[#756b5b]">{copy.noEvents}</div>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-[#d7cebf] bg-white p-4 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><Sun size={18} /> {copy.overview}</h2>
            <div className="space-y-2">
              {events.slice(0, 8).map(event => (
                <button key={event.id} onClick={() => setSelectedDate(event.date)} className="flex w-full items-center gap-3 rounded-md border border-[#eee7dc] px-3 py-2 text-left hover:bg-[#fbf8f1]">
                  <span className="w-10 text-center text-xl">{event.icon}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{localName(event.title, language)}</span>
                    <span className="block text-xs text-[#8c806b]">{event.date}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </aside>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-[#d7cebf] bg-white p-4 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><Moon size={18} /> {copy.list}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {filteredEvents.map(event => (
              <article key={event.id} className={`rounded-md border p-3 ${eventTone(event.tone)}`}>
                <div className="mb-1 flex items-center justify-between gap-3">
                  <strong className="flex items-center gap-2"><span className="text-xl">{event.icon}</span>{localName(event.title, language)}</strong>
                  <span className="text-xs opacity-75">{event.date}</span>
                </div>
                <p className="text-sm leading-6 opacity-90">{localName(event.detail, language)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
