/**
 * PDF Report Generator API
 * 生成精美的占星报告PDF
 */

import { NextRequest, NextResponse } from 'next/server';

// ════════════════════════════════════════════════════════════════════════════
// PDF生成函数（使用简单的HTML to PDF方案）
// ════════════════════════════════════════════════════════════════════════════

function generateHTMLReport(data: any, language: 'zh' | 'en' | 'id'): string {
  const { planets, houses, ascendant, midheaven, reading, birthInfo } = data;
  const lang = language;
  
  const t = {
    title: { zh: '✨ 星缘占星 - 出生星盘报告', en: '✨ Star Destiny - Birth Chart Report', id: '✨ Bintang Jodoh - Laporan Bagan Lahir' }[lang],
    date: { zh: '报告生成时间', en: 'Report Generated', id: 'Laporan Dibuat' }[lang],
    birthInfo: { zh: '出生信息', en: 'Birth Information', id: 'Informasi Kelahiran' }[lang],
    ascendant: { zh: '上升星座', en: 'Ascendant', id: 'Ascendant' }[lang],
    midheaven: { zh: '中天', en: 'Midheaven', id: 'Midheaven' }[lang],
    planets: { zh: '行星位置', en: 'Planet Positions', id: 'Posisi Planet' }[lang],
    houses: { zh: '宫位分析', en: 'House Analysis', id: 'Analisis Rumah' }[lang],
    analysis: { zh: '深度解读', en: 'Deep Analysis', id: 'Analisis Mendalam' }[lang],
    monthlyForecast: { zh: '2026年月度运势', en: '2026 Monthly Forecast', id: 'Ramalan Bulanan 2026' }[lang],
    wealth: { zh: '财富方位', en: 'Wealth Direction', id: 'Arah Kekayaan' }[lang],
    blindSpots: { zh: '性格盲点', en: 'Personality Blind Spots', id: 'Titik Buta Kepribadian' }[lang],
    footer: { zh: '© 2026 星缘占星 | 天文算法驱动 | 仅供参考娱乐', en: '© 2026 Star Destiny | Powered by Astronomy Algorithms | For Entertainment Only', id: '© 2026 Bintang Jodoh | Algoritma Astronomi | Hanya Untuk Hiburan' }[lang],
  };
  
  // 星座符号
  const SIGN_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
  const PLANET_SYMBOLS: Record<string, string> = {
    Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
    Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
    North_Node: '☊', South_Node: '☋',
  };
  
  // HTML模板
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${t.title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Noto+Serif:wght@400;600;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Noto Serif SC', 'Noto Serif', Georgia, serif;
      background: linear-gradient(180deg, #0a0e1a 0%, #1a1f2e 50%, #0a0e1a 100%);
      color: #f9fafb;
      padding: 40px;
      line-height: 1.6;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: rgba(17, 24, 39, 0.8);
      border-radius: 20px;
      padding: 40px;
      border: 2px solid #d4a574;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 2px solid #d4a574;
    }
    
    .header h1 {
      font-size: 32px;
      color: #e8c89e;
      margin-bottom: 10px;
      letter-spacing: 2px;
    }
    
    .header .subtitle {
      color: #9ca3af;
      font-size: 14px;
    }
    
    .section {
      margin-bottom: 40px;
    }
    
    .section-title {
      font-size: 20px;
      color: #d4a574;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(212, 165, 116, 0.3);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .section-title::before {
      content: '✦';
      color: #d4a574;
    }
    
    .birth-info {
      background: rgba(31, 41, 55, 0.5);
      padding: 20px;
      border-radius: 12px;
      border-left: 4px solid #d4a574;
    }
    
    .birth-info .row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid rgba(55, 65, 81, 0.5);
    }
    
    .birth-info .row:last-child { border-bottom: none; }
    .birth-info .label { color: #9ca3af; }
    .birth-info .value { color: #e8c89e; font-weight: 600; }
    
    .planet-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    
    .planet-card {
      background: rgba(10, 14, 26, 0.8);
      padding: 15px;
      border-radius: 10px;
      border: 1px solid rgba(212, 165, 116, 0.2);
      text-align: center;
    }
    
    .planet-card .symbol {
      font-size: 28px;
      margin-bottom: 8px;
    }
    
    .planet-card .name {
      font-size: 12px;
      color: #9ca3af;
      margin-bottom: 4px;
    }
    
    .planet-card .position {
      font-size: 14px;
      color: #e8c89e;
      font-weight: 600;
    }
    
    .planet-card .degree {
      font-size: 12px;
      color: #d4a574;
      margin-top: 4px;
    }
    
    .key-points {
      background: linear-gradient(135deg, rgba(212, 165, 116, 0.1) 0%, rgba(168, 124, 82, 0.05) 100%);
      padding: 25px;
      border-radius: 15px;
      margin-top: 20px;
    }
    
    .key-points h3 {
      color: #e8c89e;
      margin-bottom: 15px;
      font-size: 18px;
    }
    
    .key-points ul {
      list-style: none;
    }
    
    .key-points li {
      padding: 12px 0;
      border-bottom: 1px solid rgba(212, 165, 116, 0.15);
      padding-left: 25px;
      position: relative;
    }
    
    .key-points li::before {
      content: '⋆';
      position: absolute;
      left: 0;
      color: #d4a574;
      font-size: 18px;
    }
    
    .house-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .house-table th, .house-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid rgba(55, 65, 81, 0.5);
    }
    
    .house-table th {
      color: #d4a574;
      font-weight: 600;
    }
    
    .house-table td {
      color: #e8c89e;
    }
    
    .forecast-item {
      display: flex;
      align-items: center;
      padding: 15px;
      background: rgba(31, 41, 55, 0.5);
      border-radius: 10px;
      margin-bottom: 12px;
    }
    
    .forecast-item .month {
      width: 60px;
      font-size: 24px;
      color: #d4a574;
      font-weight: 700;
    }
    
    .forecast-item .content {
      flex: 1;
    }
    
    .forecast-item .theme {
      color: #e8c89e;
      font-weight: 600;
      margin-bottom: 5px;
    }
    
    .forecast-item .advice {
      color: #9ca3af;
      font-size: 13px;
    }
    
    .footer {
      text-align: center;
      margin-top: 50px;
      padding-top: 30px;
      border-top: 1px solid rgba(212, 165, 116, 0.2);
      color: #9ca3af;
      font-size: 12px;
    }
    
    .footer .logo {
      font-size: 24px;
      margin-bottom: 10px;
    }
    
    @media print {
      body { background: #0a0e1a; }
      .container { border: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${t.title}</h1>
      <div class="subtitle">${t.date}: ${new Date().toLocaleDateString(lang === 'zh' ? 'zh-CN' : lang === 'id' ? 'id-ID' : 'en-US')}</div>
    </div>
    
    <!-- 出生信息 -->
    <div class="section">
      <div class="section-title">${t.birthInfo}</div>
      <div class="birth-info">
        <div class="row">
          <span class="label">${lang === 'zh' ? '出生时间' : lang === 'id' ? 'Waktu Lahir' : 'Birth Time'}</span>
          <span class="value">${birthInfo?.localTime || '-'}</span>
        </div>
        <div class="row">
          <span class="label">${lang === 'zh' ? '出生地点' : lang === 'id' ? 'Tempat Lahir' : 'Birth Place'}</span>
          <span class="value">${birthInfo?.location || '-'}</span>
        </div>
        <div class="row">
          <span class="label">${t.ascendant}</span>
          <span class="value">${ascendant?.symbol || ''} ${ascendant?.sign || ''} ${ascendant?.formatted || ''}</span>
        </div>
        <div class="row">
          <span class="label">${t.midheaven}</span>
          <span class="value">${midheaven?.symbol || ''} ${midheaven?.sign || ''} ${midheaven?.formatted || ''}</span>
        </div>
      </div>
    </div>
    
    <!-- 行星位置 -->
    <div class="section">
      <div class="section-title">${t.planets}</div>
      <div class="planet-grid">
        ${Object.entries(planets || {}).filter(([_, p]: [string, any]) => !p.error).map(([id, planet]: [string, any]) => `
          <div class="planet-card">
            <div class="symbol" style="color: ${getPlanetColor(id)}">${PLANET_SYMBOLS[id] || '☆'}</div>
            <div class="name">${planet.name_cn || id}</div>
            <div class="position">${planet.symbol} ${planet.sign}</div>
            <div class="degree">${planet.formatted || ''}${planet.retrograde ? ' R' : ''}</div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <!-- 三大核心解读（如果付费） -->
    ${reading?.paid ? `
    <div class="section">
      <div class="section-title">${t.analysis}</div>
      
      ${reading.paid.monthlyForecast ? `
      <div class="key-points">
        <h3>${t.monthlyForecast}</h3>
        ${reading.paid.monthlyForecast.map((f: any) => `
          <div class="forecast-item">
            <div class="month">${f.month}</div>
            <div class="content">
              <div class="theme">${f.theme}</div>
              <div class="advice">${f.advice}</div>
            </div>
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${reading.paid.wealthDirection ? `
      <div class="key-points">
        <h3>${t.wealth}</h3>
        <ul>
          <li><strong>${lang === 'zh' ? '方位' : lang === 'id' ? 'Arah' : 'Direction'}:</strong> ${reading.paid.wealthDirection.direction}</li>
          <li>${reading.paid.wealthDirection.advice}</li>
        </ul>
      </div>
      ` : ''}
      
      ${reading.paid.blindSpots ? `
      <div class="key-points">
        <h3>${t.blindSpots}</h3>
        <ul>
          ${reading.paid.blindSpots.map((spot: string) => `<li>${spot}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
    </div>
    ` : ''}
    
    <!-- 宫位表 -->
    <div class="section">
      <div class="section-title">${t.houses}</div>
      <table class="house-table">
        <thead>
          <tr>
            <th>${lang === 'zh' ? '宫位' : lang === 'id' ? 'Rumah' : 'House'}</th>
            <th>${lang === 'zh' ? '星座' : lang === 'id' ? 'Zodiak' : 'Sign'}</th>
            <th>${lang === 'zh' ? '度数' : lang === 'id' ? 'Derajat' : 'Degree'}</th>
          </tr>
        </thead>
        <tbody>
          ${(houses || []).map((h: any) => `
            <tr>
              <td>${lang === 'zh' ? h.house_cn || h.house + '宫' : lang === 'id' ? 'Rumah ' + h.house : 'House ' + h.house}</td>
              <td>${h.symbol} ${h.sign}</td>
              <td>${h.formatted || h.degree?.toFixed(2) + '°'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <div class="footer">
      <div class="logo">✨</div>
      <div>${t.footer}</div>
    </div>
  </div>
</body>
</html>
`;
}

function getPlanetColor(id: string): string {
  const colors: Record<string, string> = {
    Sun: '#FFD700', Moon: '#E8E8E8', Mercury: '#B8B8FF',
    Venus: '#FFB6C1', Mars: '#FF6347', Jupiter: '#FFA500',
    Saturn: '#87CEEB', Uranus: '#40E0D0', Neptune: '#4169E1',
    Pluto: '#8B0000', North_Node: '#9ACD32', South_Node: '#8B4513',
  };
  return colors[id] || '#d4a574';
}

// ════════════════════════════════════════════════════════════════════════════
// API Handler
// ════════════════════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chartData, readingData, language = 'id' } = body;
    
    // 生成HTML
    const html = generateHTMLReport({
      ...chartData,
      reading: readingData,
    }, language);
    
    // 返回HTML（让前端使用打印功能）
    return NextResponse.json({
      success: true,
      html,
      filename: `astrology-report-${Date.now()}.html`,
    });
    
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
