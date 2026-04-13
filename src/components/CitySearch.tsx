"use client";

import { useState, useEffect, useRef } from "react";

interface City {
  name: string;
  displayName: string;
  lat: number;
  lon: number;
  country: string;
  timezone?: string;
}

interface CitySearchProps {
  value: string;
  onChange: (city: City) => void;
  language?: "zh" | "id" | "en";
  placeholder?: string;
}

// 常用城市预设（快速选择）
const POPULAR_CITIES: City[] = [
  { name: "北京", displayName: "北京, 中国", lat: 39.9042, lon: 116.4074, country: "CN" },
  { name: "上海", displayName: "上海, 中国", lat: 31.2304, lon: 121.4737, country: "CN" },
  { name: "广州", displayName: "广州, 中国", lat: 23.1291, lon: 113.2644, country: "CN" },
  { name: "深圳", displayName: "深圳, 中国", lat: 22.5431, lon: 114.0579, country: "CN" },
  { name: "杭州", displayName: "杭州, 中国", lat: 30.2741, lon: 120.1551, country: "CN" },
  { name: "成都", displayName: "成都, 中国", lat: 30.5728, lon: 104.0668, country: "CN" },
  { name: "武汉", displayName: "武汉, 中国", lat: 30.5928, lon: 114.3055, country: "CN" },
  { name: "西安", displayName: "西安, 中国", lat: 34.3416, lon: 108.9398, country: "CN" },
  { name: "南京", displayName: "南京, 中国", lat: 32.0603, lon: 118.7969, country: "CN" },
  { name: "重庆", displayName: "重庆, 中国", lat: 29.4316, lon: 106.9123, country: "CN" },
  { name: "天津", displayName: "天津, 中国", lat: 39.0842, lon: 117.2009, country: "CN" },
  { name: "苏州", displayName: "苏州, 中国", lat: 31.2989, lon: 120.5853, country: "CN" },
  { name: "台北", displayName: "台北, 台湾", lat: 25.0330, lon: 121.5654, country: "TW" },
  { name: "香港", displayName: "香港", lat: 22.3193, lon: 114.1694, country: "HK" },
  { name: "雅加达", displayName: "Jakarta, Indonesia", lat: -6.2088, lon: 106.8456, country: "ID" },
  { name: "泗水", displayName: "Surabaya, Indonesia", lat: -7.2575, lon: 112.7521, country: "ID" },
  { name: "万隆", displayName: "Bandung, Indonesia", lat: -6.9175, lon: 107.6191, country: "ID" },
  { name: "棉兰", displayName: "Medan, Indonesia", lat: 3.5952, lon: 98.6722, country: "ID" },
  { name: "新加坡", displayName: "Singapore", lat: 1.3521, lon: 103.8198, country: "SG" },
  { name: "吉隆坡", displayName: "Kuala Lumpur, Malaysia", lat: 3.1390, lon: 101.6869, country: "MY" },
  { name: "东京", displayName: "Tokyo, Japan", lat: 35.6762, lon: 139.6503, country: "JP" },
  { name: "首尔", displayName: "Seoul, South Korea", lat: 37.5665, lon: 126.9780, country: "KR" },
  { name: "纽约", displayName: "New York, USA", lat: 40.7128, lon: -74.0060, country: "US" },
  { name: "洛杉矶", displayName: "Los Angeles, USA", lat: 34.0522, lon: -118.2437, country: "US" },
  { name: "伦敦", displayName: "London, UK", lat: 51.5074, lon: -0.1278, country: "GB" },
  { name: "巴黎", displayName: "Paris, France", lat: 48.8566, lon: 2.3522, country: "FR" },
  { name: "悉尼", displayName: "Sydney, Australia", lat: -33.8688, lon: 151.2093, country: "AU" },
];

// 国家代码到时区的映射
const COUNTRY_TIMEZONES: Record<string, string> = {
  CN: "Asia/Shanghai",
  TW: "Asia/Taipei",
  HK: "Asia/Hong_Kong",
  ID: "Asia/Jakarta",
  SG: "Asia/Singapore",
  MY: "Asia/Kuala_Lumpur",
  JP: "Asia/Tokyo",
  KR: "Asia/Seoul",
  US: "America/New_York",
  GB: "Europe/London",
  FR: "Europe/Paris",
  AU: "Australia/Sydney",
};

export default function CitySearch({ value, onChange, language = "zh", placeholder }: CitySearchProps) {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 点击外部关闭下拉
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 搜索城市
  const searchCities = async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      // 显示热门城市
      setResults(POPULAR_CITIES.slice(0, 10));
      return;
    }

    setIsLoading(true);
    try {
      // 使用 OpenStreetMap Nominatim API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=10&accept-language=${language === "zh" ? "zh" : "en"}`
      );
      const data = await response.json();

      const cities: City[] = data.map((item: any) => ({
        name: item.name || item.display_name.split(",")[0],
        displayName: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        country: item.address?.country_code?.toUpperCase() || "",
        timezone: COUNTRY_TIMEZONES[item.address?.country_code?.toUpperCase() || ""],
      }));

      setResults(cities.length > 0 ? cities : POPULAR_CITIES.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 10));
    } catch (error) {
      console.error("City search error:", error);
      // 回退到本地搜索
      setResults(POPULAR_CITIES.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 10));
    } finally {
      setIsLoading(false);
    }
  };

  // 输入变化时搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOpen) {
        searchCities(query);
      }
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, isOpen]);

  // 初始化显示热门城市
  useEffect(() => {
    if (isOpen && results.length === 0) {
      setResults(POPULAR_CITIES.slice(0, 10));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSelect = (city: City) => {
    setQuery(city.name);
    setIsOpen(false);
    onChange(city);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || (language === "zh" ? "搜索城市..." : "Search city...")}
          className="w-full px-4 py-2.5 pl-10 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="animate-spin w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
      </div>

      {/* 下拉列表 */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-4 py-3 text-gray-500 text-center">
              {language === "zh" ? "未找到城市" : "No cities found"}
            </div>
          ) : (
            results.map((city, index) => (
              <div
                key={`${city.name}-${city.lat}-${city.lon}`}
                onClick={() => handleSelect(city)}
                className={`px-4 py-2.5 cursor-pointer flex items-center justify-between ${
                  index === selectedIndex ? "bg-indigo-50" : "hover:bg-gray-50"
                }`}
              >
                <div>
                  <div className="font-medium text-gray-900">{city.name}</div>
                  <div className="text-xs text-gray-500">{city.displayName}</div>
                </div>
                <div className="text-xs text-gray-400">
                  {city.lat.toFixed(2)}°, {city.lon.toFixed(2)}°
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export { POPULAR_CITIES };
export type { City };
