"use client";

import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Download, FileText, Loader2, Share2 } from "lucide-react";

interface PDFExportProps {
  chartData: {
    planets: Record<string, any>;
    houses: any[];
    ascendant: number;
    midheaven: number;
    aspects: any[];
  };
  birthInfo: {
    date: string;
    time: string;
    location: string;
  };
  element?: HTMLElement | null;
}

const TRANSLATIONS: Record<string, Record<string, string>> = {
  zh: {
    exportPDF: "导出PDF",
    generating: "生成中...",
    download: "下载星盘报告",
    share: "分享报告",
    natalChart: "本命星盘报告",
    birthInfo: "出生信息",
    date: "出生日期",
    time: "出生时间",
    location: "出生地点",
    planets: "行星位置",
    houses: "宫位信息",
    aspects: "相位分析",
    generatedAt: "生成时间",
    page: "第",
    of: "页，共",
  },
  en: {
    exportPDF: "Export PDF",
    generating: "Generating...",
    download: "Download Chart Report",
    share: "Share Report",
    natalChart: "Natal Chart Report",
    birthInfo: "Birth Information",
    date: "Birth Date",
    time: "Birth Time",
    location: "Birth Location",
    planets: "Planet Positions",
    houses: "House Information",
    aspects: "Aspect Analysis",
    generatedAt: "Generated at",
    page: "Page",
    of: "of",
  },
  id: {
    exportPDF: "Ekspor PDF",
    generating: "Sedang membuat...",
    download: "Unduh Laporan Chart",
    share: "Bagikan Laporan",
    natalChart: "Laporan Chart Natal",
    birthInfo: "Informasi Kelahiran",
    date: "Tanggal Lahir",
    time: "Waktu Lahir",
    location: "Lokasi Lahir",
    planets: "Posisi Planet",
    houses: "Informasi Rumah",
    aspects: "Analisis Aspek",
    generatedAt: "Dibuat pada",
    page: "Halaman",
    of: "dari",
  },
};

const PLANET_NAMES: Record<string, Record<string, string>> = {
  zh: {
    Sun: "太阳", Moon: "月亮", Mercury: "水星", Venus: "金星", Mars: "火星",
    Jupiter: "木星", Saturn: "土星", Uranus: "天王星", Neptune: "海王星", Pluto: "冥王星",
    North_Node: "北交点", South_Node: "南交点",
  },
  en: {
    Sun: "Sun", Moon: "Moon", Mercury: "Mercury", Venus: "Venus", Mars: "Mars",
    Jupiter: "Jupiter", Saturn: "Saturn", Uranus: "Uranus", Neptune: "Neptune", Pluto: "Pluto",
    North_Node: "North Node", South_Node: "South Node",
  },
  id: {
    Sun: "Matahari", Moon: "Bulan", Mercury: "Merkurius", Venus: "Venus", Mars: "Mars",
    Jupiter: "Yupiter", Saturn: "Saturnus", Uranus: "Uranus", Neptune: "Neptunus", Pluto: "Pluto",
    North_Node: "Node Utara", South_Node: "Node Selatan",
  },
};

const SIGN_NAMES: Record<string, string[]> = {
  zh: ["白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座", "天秤座", "天蝎座", "射手座", "摩羯座", "水瓶座", "双鱼座"],
  en: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"],
  id: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"],
};

export function PDFExport({ chartData, birthInfo, element }: PDFExportProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const [isGenerating, setIsGenerating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const formatDegree = (deg: number) => {
    const d = Math.floor(deg);
    const m = Math.floor((deg - d) * 60);
    return `${d}°${m.toString().padStart(2, "0")}'`;
  };

  const getSignFromLongitude = (lon: number) => {
    const signIndex = Math.floor(lon / 30) % 12;
    return SIGN_NAMES[language][signIndex];
  };

  const getDegreeInSign = (lon: number) => {
    return lon % 30;
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      
      // Header
      pdf.setFillColor(124, 58, 237);
      pdf.rect(0, 0, pageWidth, 40, "F");
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.text(t.natalChart, pageWidth / 2, 25, { align: "center" });
      
      let y = 50;
      
      // Birth Info Section
      pdf.setTextColor(124, 58, 237);
      pdf.setFontSize(16);
      pdf.text(t.birthInfo, margin, y);
      y += 10;
      
      pdf.setTextColor(60, 60, 60);
      pdf.setFontSize(12);
      pdf.text(`${t.date}: ${birthInfo.date}`, margin, y);
      y += 7;
      pdf.text(`${t.time}: ${birthInfo.time}`, margin, y);
      y += 7;
      pdf.text(`${t.location}: ${birthInfo.location}`, margin, y);
      y += 15;
      
      // Planet Positions
      pdf.setTextColor(124, 58, 237);
      pdf.setFontSize(16);
      pdf.text(t.planets, margin, y);
      y += 10;
      
      pdf.setFontSize(10);
      const planetEntries = Object.entries(chartData.planets).filter(
        ([, data]) => !data.error
      );
      
      for (const [name, data] of planetEntries.slice(0, 12)) {
        if (y > pageHeight - 30) {
          pdf.addPage();
          y = 20;
        }
        
        const planetName = PLANET_NAMES[language][name] || name;
        const sign = getSignFromLongitude(data.longitude);
        const degree = formatDegree(getDegreeInSign(data.longitude));
        
        pdf.setTextColor(60, 60, 60);
        pdf.text(`${planetName}: ${sign} ${degree}`, margin, y);
        y += 6;
      }
      
      y += 10;
      
      // Houses
      if (y > pageHeight - 100) {
        pdf.addPage();
        y = 20;
      }
      
      pdf.setTextColor(124, 58, 237);
      pdf.setFontSize(16);
      pdf.text(t.houses, margin, y);
      y += 10;
      
      pdf.setFontSize(10);
      for (const house of chartData.houses.slice(0, 6)) {
        if (y > pageHeight - 30) {
          pdf.addPage();
          y = 20;
        }
        
        const sign = getSignFromLongitude(house.longitude);
        const degree = formatDegree(getDegreeInSign(house.longitude));
        
        pdf.setTextColor(60, 60, 60);
        pdf.text(`${t.page} ${house.house}: ${sign} ${degree}`, margin, y);
        y += 6;
      }
      
      // Footer
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setTextColor(150, 150, 150);
        pdf.setFontSize(8);
        pdf.text(
          `${t.generatedAt}: ${new Date().toLocaleString()}`,
          margin,
          pageHeight - 10
        );
        pdf.text(
          `${t.page} ${i} ${t.of} ${totalPages}`,
          pageWidth - margin,
          pageHeight - 10,
          { align: "right" }
        );
      }
      
      pdf.save(`natal-chart-${birthInfo.date}.pdf`);
    } catch (error) {
      console.error("PDF generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const captureAndExport = async () => {
    if (!element) {
      await generatePDF();
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#030014",
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pageWidth - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.setFillColor(3, 0, 20);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");
      
      pdf.addImage(imgData, "PNG", 20, 20, imgWidth, Math.min(imgHeight, pageHeight - 40));
      
      pdf.setTextColor(150, 150, 150);
      pdf.setFontSize(8);
      pdf.text(
        `${t.generatedAt}: ${new Date().toLocaleString()}`,
        20,
        pageHeight - 10
      );
      
      pdf.save(`natal-chart-${birthInfo.date}.pdf`);
    } catch (error) {
      console.error("Chart capture error:", error);
      await generatePDF();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={captureAndExport}
        disabled={isGenerating}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {t.generating}
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            {t.exportPDF}
          </>
        )}
      </button>
    </div>
  );
}
