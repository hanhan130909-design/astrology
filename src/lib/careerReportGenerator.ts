// Career Timing PDF Report Generator
// Uses jsPDF to generate a 10-page personalized report from BaZi data

import { jsPDF } from "jspdf";
import { buildBaziViewData } from "./baziViewData";

const COLORS = {
  gold: [180, 140, 60] as [number, number, number],
  dark: [23, 23, 23] as [number, number, number],
  gray: [100, 100, 100] as [number, number, number],
  lightGray: [200, 200, 200] as [number, number, number],
  bg: [250, 248, 245] as [number, number, number],
  wood: [76, 175, 80] as [number, number, number],
  fire: [244, 67, 54] as [number, number, number],
  earth: [121, 85, 72] as [number, number, number],
  metal: [255, 152, 0] as [number, number, number],
  water: [33, 150, 243] as [number, number, number],
};

const DAY_MASTER_CAREER: Record<string, { style: string; industries: string[]; strength: string }> = {
  "甲木": { style: "Pioneer & Visionary", industries: ["Tech startups", "Publishing", "Education", "Health & Wellness"], strength: "You thrive when building something new from scratch. Your natural authority makes you a born leader, but you must avoid micromanaging." },
  "乙木": { style: "Diplomat & Networker", industries: ["PR & Communications", "Human Resources", "Counseling", "Fashion"], strength: "Your superpower is reading people and building alliances. You succeed through influence, not force. Avoid high-conflict environments." },
  "丙火": { style: "Performer & Innovator", industries: ["Entertainment", "Marketing", "Design", "Hospitality"], strength: "You bring energy and inspiration to any team. Your creativity is your currency. Routine kills your performance — seek dynamic roles." },
  "丁火": { style: "Artist & Strategist", industries: ["Fine Arts", "Research", "Writing", "Interior Design"], strength: "You see patterns others miss. Your work has lasting quality. You do best with deep focus time, not constant meetings." },
  "戊土": { style: "Builder & Manager", industries: ["Real Estate", "Construction", "Operations", "Agriculture"], strength: "You are the foundation of any organization. Reliable, steady, and trustworthy. Your career grows slowly but permanently — avoid get-rich-quick schemes." },
  "己土": { style: "Nurturer & Educator", industries: ["Healthcare", "Teaching", "Social Work", "Culinary Arts"], strength: "You make everyone around you better. Your empathy is your competitive advantage. You thrive in service-oriented roles." },
  "庚金": { style: "Warrior & Decision-Maker", industries: ["Law", "Military", "Finance", "Engineering"], strength: "You make tough decisions others avoid. Your directness is an asset in crisis. You need clear goals — ambiguity drains you." },
  "辛金": { style: "Craftsman & Perfectionist", industries: ["Jewelry", "Surgery", "Quality Control", "Luxury Goods"], strength: "Your attention to detail is legendary. You produce work of exceptional quality. Avoid messy, unstructured environments." },
  "壬水": { style: "Adventurer & Communicator", industries: ["Sales", "Travel", "Media", "Trading"], strength: "You flow like water — adaptable, persuasive, and everywhere. Your network is your net worth. You must avoid stagnation at all costs." },
  "癸水": { style: "Strategist & Intuitive", industries: ["Consulting", "Psychology", "Research", "Investment"], strength: "You understand systems at a deep level. Your intuition is data-driven. You work best behind the scenes, not on stage." },
};

const ELEMENT_CAREER: Record<string, string> = {
  wood: "Growth industries: education, publishing, healthcare, textiles. You thrive when you can plant seeds and watch them grow.",
  fire: "Visibility industries: entertainment, marketing, energy, food. You need an audience — your work should be seen.",
  earth: "Stability industries: real estate, agriculture, construction, hospitality. You build things that last.",
  metal: "Precision industries: finance, law, engineering, machinery. You excel when accuracy matters.",
  water: "Flow industries: trading, logistics, media, consulting. You move information and resources.",
};

export function generateCareerTimingPDF(birthData: {
  year: number; month: number; day: number; hour: number; minute: number; gender: number; name?: string;
}): Buffer {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 50;

  // Calculate BaZi data
  let bazi: any = null;
  try {
    bazi = buildBaziViewData({ ...birthData, name: birthData.name || "" });
  } catch (e) {
    bazi = null;
  }

  const dayMaster = bazi?.dayMaster?.stem || "辛金";
  const careerInfo = DAY_MASTER_CAREER[dayMaster] || DAY_MASTER_CAREER["辛金"];
  const name = birthData.name || "Seeker";

  // Helper functions
  const addPage = (bg = true) => {
    doc.addPage();
    if (bg) {
      doc.setFillColor(...COLORS.bg);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
    }
  };

  const drawGoldLine = (y: number) => {
    doc.setDrawColor(...COLORS.gold);
    doc.setLineWidth(1);
    doc.line(margin, y, pageWidth - margin, y);
  };

  const addHeading = (text: string, y: number, size = 20) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.setTextColor(...COLORS.dark);
    doc.text(text, margin, y);
    drawGoldLine(y + 8);
  };

  const addBody = (text: string, y: number, size = 11, maxWidth = pageWidth - margin * 2) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(...COLORS.gray);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, margin, y);
    return y + lines.length * (size * 1.5);
  };

  // ── PAGE 1: Cover ──
  doc.setFillColor(...COLORS.dark);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Gold decorative circle
  doc.setDrawColor(...COLORS.gold);
  doc.setLineWidth(2);
  doc.circle(pageWidth / 2, pageHeight / 2 - 50, 120, "S");
  doc.setLineWidth(0.5);
  doc.circle(pageWidth / 2, pageHeight / 2 - 50, 100, "S");

  // Zodiac symbols around circle
  const symbols = "♈♉♊♋♌♍♎♏♐♑♒♓";
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.gold);
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 - 90) * Math.PI / 180;
    const x = pageWidth / 2 + 110 * Math.cos(angle);
    const y = pageHeight / 2 - 50 + 110 * Math.sin(angle);
    doc.text(symbols[i], x, y, { align: "center", baseline: "middle" });
  }

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text("Career Timing Report", pageWidth / 2, 120, { align: "center" });

  doc.setFontSize(14);
  doc.setTextColor(...COLORS.gold);
  doc.text("BaZi + Western Astrology Fusion", pageWidth / 2, 150, { align: "center" });

  // Name
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(name, pageWidth / 2, pageHeight / 2 - 50, { align: "center" });

  // Date
  doc.setFontSize(11);
  doc.setTextColor(180, 180, 180);
  const birthStr = `${birthData.year}-${String(birthData.month).padStart(2, "0")}-${String(birthData.day).padStart(2, "0")}`;
  doc.text(`Born: ${birthStr} | ${birthData.hour}:${String(birthData.minute).padStart(2, "0")}`, pageWidth / 2, pageHeight - 100, { align: "center" });

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text("LunaXStar Bazi | lunaxstar.com", pageWidth / 2, pageHeight - 60, { align: "center" });

  // ── PAGE 2: Your Day Master ──
  addPage();
  let y = 80;
  addHeading("Your Day Master: " + dayMaster, y);
  y += 40;

  addBody(`Your Day Master is ${dayMaster}. In Chinese BaZi astrology, the Day Master represents your core essence — how you show up in the world, what you need to thrive, and where your natural talents lie.`, y);
  y += 50;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.gold);
  doc.text("Your Natural Earning Style", margin, y);
  y += 25;

  y = addBody(careerInfo.style, y, 12);
  y += 15;
  y = addBody(careerInfo.strength, y, 11);

  // ── PAGE 3: Five Element Balance ──
  addPage();
  y = 80;
  addHeading("Your Five Element Balance", y);
  y += 40;

  y = addBody("Your BaZi chart contains a unique balance of the Five Elements. This balance determines which industries nourish you and which drain you.", y);
  y += 40;

  const elements = [
    { name: "Wood", color: COLORS.wood, pct: bazi?.elements?.wood || 20 },
    { name: "Fire", color: COLORS.fire, pct: bazi?.elements?.fire || 25 },
    { name: "Earth", color: COLORS.earth, pct: bazi?.elements?.earth || 15 },
    { name: "Metal", color: COLORS.metal, pct: bazi?.elements?.metal || 25 },
    { name: "Water", color: COLORS.water, pct: bazi?.elements?.water || 15 },
  ];

  const maxPct = Math.max(...elements.map(e => e.pct));
  elements.forEach((el, i) => {
    const barY = y + i * 45;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.dark);
    doc.text(el.name, margin, barY);

    // Bar background
    doc.setFillColor(...COLORS.lightGray);
    doc.rect(margin + 60, barY - 10, 300, 16, "F");

    // Bar fill
    const barWidth = (el.pct / maxPct) * 300;
    doc.setFillColor(...el.color);
    doc.rect(margin + 60, barY - 10, barWidth, 16, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.gray);
    doc.text(`${el.pct}%`, margin + 370, barY);
  });

  y += elements.length * 45 + 20;
  const dominantElement = elements.reduce((a, b) => a.pct > b.pct ? a : b).name.toLowerCase();
  y = addBody(`Your dominant element is ${dominantElement}. ${ELEMENT_CAREER[dominantElement] || ""}`, y, 11);

  // ── PAGE 4-6: Career Strength & Best Industries ──
  addPage();
  y = 80;
  addHeading("Career Strengths & Best Industries", y);
  y += 40;

  y = addBody("Based on your Day Master and Five Element balance, the following industries align with your natural energy. Working in these fields feels less like work and more like expression.", y);
  y += 30;

  careerInfo.industries.forEach((industry, i) => {
    doc.setFillColor(...COLORS.gold);
    doc.circle(margin + 5, y - 4, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.dark);
    doc.text(industry, margin + 18, y);
    y += 30;
  });

  y += 10;
  addHeading("What to Avoid", y + 10, 16);
  y += 40;
  y = addBody("Avoid industries that clash with your dominant element. For you, this means high-stress environments with no creative outlet, or roles that require constant emotional labor without recovery time.", y, 11);

  // Page 5: Wealth Style
  addPage();
  y = 80;
  addHeading("Your Wealth Style: How You Earn", y);
  y += 40;

  const wealthStyles: Record<string, string> = {
    "甲木": "You earn through leadership and building. Your wealth comes from owning something — a business, a portfolio, intellectual property. Salary alone will never satisfy you. You need equity.",
    "乙木": "You earn through collaboration and network. Your wealth comes from partnerships and referrals. You are the connector who makes deals happen. Never work alone.",
    "丙火": "You earn through visibility and personal brand. Your wealth comes from being known. The more people who know your name, the more you earn. Invest in marketing yourself.",
    "丁火": "You earn through specialized expertise. Your wealth comes from being the best at one thing. Niche down aggressively. Generalists don't make money — specialists do.",
    "戊土": "You earn through assets and stability. Your wealth comes from real estate, long-term investments, and building things that appreciate. Avoid speculative trading.",
    "己土": "You earn through service and care. Your wealth comes from repeat customers and word of mouth. You build a business like a garden — slowly, patiently, and it feeds you for decades.",
    "庚金": "You earn through decision-making and risk. Your wealth comes from high-stakes roles where your judgment is the product. You should be paid for your decisions, not your time.",
    "辛金": "You earn through quality and craftsmanship. Your wealth comes from premium pricing. Never compete on price — compete on excellence. People will pay more for your work.",
    "壬水": "You earn through movement and information. Your wealth comes from trading, brokering, and connecting buyers with sellers. You need volume — one big deal is not enough.",
    "癸水": "You earn through insight and strategy. Your wealth comes from consulting and advising. You sell your thinking. Package your intuition as a service and charge premium rates.",
  };

  y = addBody(wealthStyles[dayMaster] || wealthStyles["辛金"], y, 12);
  y += 30;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.gold);
  doc.text("Your Money Block", margin, y);
  y += 25;
  y = addBody("Your chart shows a tendency to undervalue your work. You give away too much for free, then resent it. The fix: set your price 30% higher than feels comfortable. You will not lose clients — you will attract better ones.", y, 11);

  // Page 6: Current Luck Pillar
  addPage();
  y = 80;
  addHeading("Current Luck Pillar: 2026-2027", y);
  y += 40;

  const currentPillar = bazi?.currentLuckPillar || { stem: "庚金", branch: "子" };
  y = addBody(`You are currently in the ${currentPillar.stem} ${currentPillar.branch} luck period. This 10-year cycle determines the overall energy of your career.`, y, 12);
  y += 30;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...COLORS.dark);
  doc.text("What This Means for Your Career", margin, y);
  y += 25;

  y = addBody("2026 is a year of setup. You are laying the foundation for a major career shift in 2027. Do not make impulsive moves now — instead, learn, network, and build skills. The opportunity you are waiting for arrives in late 2027.", y, 11);
  y += 25;
  y = addBody("Key dates to watch: March 2027 (new opportunity appears), July 2027 (decision point), October 2027 (launch or transition).", y, 11);

  // Page 7: Relationship at Work
  addPage();
  y = 80;
  addHeading("Relationship at Work", y);
  y += 40;

  y = addBody("Your BaZi chart reveals how you interact with colleagues, bosses, and clients. Understanding this pattern prevents the #1 career killer: toxic work relationships.", y, 12);
  y += 30;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...COLORS.dark);
  doc.text("Your Work Style", margin, y);
  y += 25;
  y = addBody("You are independent and self-motivated. You do your best work when given autonomy. Micromanagement kills your productivity. If your boss is controlling, you will underperform — it is not you, it is the environment.", y, 11);
  y += 25;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...COLORS.dark);
  doc.text("Who to Work With", margin, y);
  y += 25;
  y = addBody("You thrive with colleagues who are older or more experienced. Their wisdom grounds your energy. Avoid peers who compete with you — collaboration, not competition, is your path up.", y, 11);

  // Page 8: Action Plan
  addPage();
  y = 80;
  addHeading("90-Day Action Plan", y);
  y += 40;

  const actions = [
    { week: "Weeks 1-2", task: "Update your resume and LinkedIn to reflect your Day Master strengths. Use the language from this report." },
    { week: "Weeks 3-4", task: "Reach out to 5 people in your target industry. Not to ask for a job — to ask for advice. Your network is your net worth." },
    { week: "Weeks 5-6", task: "Learn one new skill that complements your natural talent. For you, this should be something in the " + careerInfo.industries[0] + " field." },
    { week: "Weeks 7-8", task: "Apply for 3 roles or pitch 3 clients. Even if you are not ready — momentum matters more than perfection." },
    { week: "Weeks 9-10", task: "Review what worked. Double down on the channel that brought the most response." },
    { week: "Weeks 11-12", task: "Make your move. By now you have momentum, skills, and connections. The opportunity will present itself — be ready to say yes." },
  ];

  actions.forEach((action, i) => {
    doc.setFillColor(...COLORS.gold);
    doc.rect(margin, y - 12, 4, 20, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.dark);
    doc.text(action.week, margin + 14, y);
    y += 18;
    y = addBody(action.task, y, 10, pageWidth - margin * 2 - 14);
    y += 15;
  });

  // Page 9: Closing
  addPage();
  doc.setFillColor(...COLORS.dark);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text("Your Time Is Coming", pageWidth / 2, pageHeight / 2 - 40, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(...COLORS.gold);
  doc.text("The chart does not predict your future — it reveals your pattern.", pageWidth / 2, pageHeight / 2, { align: "center" });
  doc.text("Break the pattern, and you change everything.", pageWidth / 2, pageHeight / 2 + 25, { align: "center" });

  doc.setFontSize(11);
  doc.setTextColor(180, 180, 180);
  doc.text("For a deeper reading including your exact wealth dates and soulmate timing,", pageWidth / 2, pageHeight / 2 + 80, { align: "center" });
  doc.text("visit lunaxstar.com", pageWidth / 2, pageHeight / 2 + 100, { align: "center" });

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text("© 2026 LunaXStar Bazi | This report is for entertainment and self-reflection.", pageWidth / 2, pageHeight - 50, { align: "center" });

  return Buffer.from(doc.output("arraybuffer"));
}
