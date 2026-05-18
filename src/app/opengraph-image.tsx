import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#030014',
          background: 'linear-gradient(135deg, #030014 0%, #1a0533 50%, #0a1628 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Background decoration */}
        <div style={{ display: 'flex', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1 }}>
          <div style={{ display: 'flex', position: 'absolute', top: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
          <div style={{ display: 'flex', position: 'absolute', bottom: '15%', right: '10%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, #ec4899, transparent)' }} />
        </div>

        {/* Logo/Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <div style={{ display: 'flex', width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg, #7c3aed, #ec4899, #f59e0b)', alignItems: 'center', justifyContent: 'center', fontSize: 48, color: 'white' }}>
            <span>⭐</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 64, fontWeight: 900, color: 'white' }}>星缘</span>
            <span style={{ fontSize: 24, color: '#a78bfa', letterSpacing: '0.2em' }}>LOVE ASTROLOGY</span>
          </div>
        </div>

        {/* Main text */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 36, color: '#e2e8f0', maxWidth: 800, textAlign: 'center', lineHeight: 1.4 }}>免费AI占星解读 · 专业在线排盘</span>
          <span style={{ fontSize: 28, color: '#94a3b8', maxWidth: 700, textAlign: 'center', lineHeight: 1.4 }}>本命盘 · 推运盘 · 合盘 · 塔罗 · 运势</span>
        </div>

        {/* Zodiac symbols */}
        <div style={{ display: 'flex', gap: 24, marginTop: 40, opacity: 0.6 }}>
          <span style={{ fontSize: 28, color: 'white' }}>♈</span>
          <span style={{ fontSize: 28, color: 'white' }}>♉</span>
          <span style={{ fontSize: 28, color: 'white' }}>♊</span>
          <span style={{ fontSize: 28, color: 'white' }}>♋</span>
          <span style={{ fontSize: 28, color: 'white' }}>♌</span>
          <span style={{ fontSize: 28, color: 'white' }}>♍</span>
          <span style={{ fontSize: 28, color: 'white' }}>♎</span>
          <span style={{ fontSize: 28, color: 'white' }}>♏</span>
          <span style={{ fontSize: 28, color: 'white' }}>♐</span>
          <span style={{ fontSize: 28, color: 'white' }}>♑</span>
          <span style={{ fontSize: 28, color: 'white' }}>♒</span>
          <span style={{ fontSize: 28, color: 'white' }}>♓</span>
        </div>

        {/* URL */}
        <span style={{ display: 'flex', position: 'absolute', bottom: 30, fontSize: 20, color: '#64748b' }}>astrology-clean.vercel.app</span>
      </div>
    ),
    { ...size }
  );
}
