import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Free Natal Chart — Your Soulmate Pattern Is In Your Stars';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0c0a1d 0%, #1a1040 50%, #2d1b69 100%)',
          padding: '60px 80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: '#fff',
            }}
          >
            ✦
          </div>
          <span style={{ fontSize: '24px', color: '#a78bfa', letterSpacing: '4px' }}>
            LUNAXSTAR
          </span>
        </div>

        <h1
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: '#f8fafc',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: '24px',
            maxWidth: '1000px',
          }}
        >
          Who Is Your Soulmate?
          <br />
          <span style={{ color: '#c4b5fd' }}>Your Birth Chart Knows</span>
        </h1>

        <p
          style={{
            fontSize: '28px',
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.5,
            marginBottom: '40px',
          }}
        >
          Free Natal Chart in 2 Minutes — Stop Guessing If He's The One
        </p>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            fontSize: '36px',
          }}
        >
          {['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'].map((sign, i) => (
            <span
              key={i}
              style={{
                color: i % 2 === 0 ? '#c4b5fd' : '#64748b',
                opacity: i % 3 === 0 ? 1 : 0.5,
              }}
            >
              {sign}
            </span>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
