"use client";

import { useLanguage } from "@/contexts/LanguageContext";

type ChartType = "natal" | "transit" | "solar_return" | "lunar_return" | "synastry" | "composite" | "davison";
type HouseSystem = "placidus" | "whole_sign";

interface ChartOptionsProps {
  chartType: ChartType;
  houseSystem: HouseSystem;
  onChartTypeChange: (type: ChartType) => void;
  onHouseSystemChange: (system: HouseSystem) => void;
  showSynastryOptions?: boolean;
  person1Name?: string;
  person2Name?: string;
  onPerson1NameChange?: (name: string) => void;
  onPerson2NameChange?: (name: string) => void;
}

const CHART_TYPES: { value: ChartType; icon: string; label: Record<string, string>; desc: Record<string, string> }[] = [
  {
    value: "natal",
    icon: "🔮",
    label: { zh: "本命盘", id: "Natal", en: "Natal" },
    desc: { zh: "出生时刻的天象图，揭示性格与命运", id: "Birth chart", en: "Your birth chart" },
  },
  {
    value: "transit",
    icon: "🌟",
    label: { zh: "推运盘", id: "Transit", en: "Transit" },
    desc: { zh: "当前天象与本命盘的对比", id: "Current planetary positions", en: "Current planetary positions" },
  },
  {
    value: "solar_return",
    icon: "☀️",
    label: { zh: "太阳返照", id: "Solar Return", en: "Solar Return" },
    desc: { zh: "每年生日时的星盘，预测来年运势", id: "Yearly forecast", en: "Yearly forecast" },
  },
  {
    value: "lunar_return",
    icon: "🌙",
    label: { zh: "月亮返照", id: "Lunar Return", en: "Lunar Return" },
    desc: { zh: "月亮回到出生位置的星盘", id: "Monthly forecast", en: "Monthly forecast" },
  },
  {
    value: "synastry",
    icon: "💕",
    label: { zh: "合盘", id: "Synastry", en: "Synastry" },
    desc: { zh: "两人星盘叠加，看关系互动", id: "Relationship compatibility", en: "Relationship compatibility" },
  },
  {
    value: "composite",
    icon: "💑",
    label: { zh: "组合盘", id: "Composite", en: "Composite" },
    desc: { zh: "两人星盘的中点，看关系本质", id: "Relationship essence", en: "Relationship essence" },
  },
  {
    value: "davison",
    icon: "💞",
    label: { zh: "马克思盘", id: "Davison", en: "Davison" },
    desc: { zh: "基于时间中点的关系盘", id: "Time midpoint chart", en: "Time midpoint chart" },
  },
];

const HOUSE_SYSTEMS: { value: HouseSystem; label: Record<string, string>; desc: Record<string, string> }[] = [
  {
    value: "placidus",
    label: { zh: "Porphyry分宫", id: "Porphyry", en: "Porphyry" },
    desc: { zh: "Porphyry分宫制，基于四轴划分", id: "Porphyry house system", en: "Porphyry house system" },
  },
  {
    value: "whole_sign",
    label: { zh: "整宫制", id: "Whole Sign", en: "Whole Sign" },
    desc: { zh: "每个星座对应一个宫位", id: "One sign per house", en: "One sign per house" },
  },
];

export default function ChartOptions({
  chartType,
  houseSystem,
  onChartTypeChange,
  onHouseSystemChange,
  showSynastryOptions = false,
  person1Name = "",
  person2Name = "",
  onPerson1NameChange,
  onPerson2NameChange,
}: ChartOptionsProps) {
  const { language } = useLanguage();
  const lang = language || "zh";

  const g = (obj: Record<string, string>) => obj[lang] || obj.zh || obj.en;

  return (
    <div className="space-y-4">
      {/* 星盘类型选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-700 mb-2">
          {lang === "zh" ? "星盘类型" : "Chart Type"}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CHART_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => onChartTypeChange(type.value)}
              className={`p-3 rounded-lg border text-left transition-all ${
                chartType === type.value
                  ? "border-gray-500 bg-gray-50 dark:bg-gray-900/30"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{type.icon}</span>
                <span className="font-medium text-sm text-gray-900 dark:text-white">
                  {g(type.label)}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                {g(type.desc)}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 分宫制选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-700 mb-2">
          {lang === "zh" ? "分宫制" : "House System"}
        </label>
        <div className="flex gap-2">
          {HOUSE_SYSTEMS.map((sys) => (
            <button
              key={sys.value}
              onClick={() => onHouseSystemChange(sys.value)}
              className={`flex-1 p-3 rounded-lg border transition-all ${
                houseSystem === sys.value
                  ? "border-gray-500 bg-gray-50 dark:bg-gray-900/30"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="font-medium text-sm text-gray-900 dark:text-white">
                {g(sys.label)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {g(sys.desc)}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 合盘选项（当选择合盘类型时显示） */}
      {showSynastryOptions && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-700 mb-1">
              {lang === "zh" ? "第一人" : "Person 1"}
            </label>
            <input
              type="text"
              value={person1Name}
              onChange={(e) => onPerson1NameChange?.(e.target.value)}
              placeholder={lang === "zh" ? "姓名" : "Name"}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-700 mb-1">
              {lang === "zh" ? "第二人" : "Person 2"}
            </label>
            <input
              type="text"
              value={person2Name}
              onChange={(e) => onPerson2NameChange?.(e.target.value)}
              placeholder={lang === "zh" ? "姓名" : "Name"}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-100"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export type { ChartType, HouseSystem };
