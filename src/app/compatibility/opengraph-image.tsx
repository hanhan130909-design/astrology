import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Zodiac Compatibility — Are You Truly Compatible?';
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
          background: 'linear-gradient(135deg, #1a0a1d 0%, #2d1040 50%, #4a1b69 100%)',
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
              background: 'linear-gradient(135deg, #f472b6, #db2777)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: '#fff',
            }}
          >
            ♥
          </div>
          <span style={{ fontSize: '24px', color: '#f9a8d4', letterSpacing: '4px' }}>
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
          Are You Truly
          <br />
          <span style={{ color: '#f9a8d4' }}>Compatible?</span>
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
          Western + Chinese Compatibility in 2 Minutes — Free & Accurate
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            fontSize: '72px',
          }}
        >
          <span style={{ color: '#f9a8d4' }}>♈</span>
          <span style={{ color: '#64748b', fontSize: '48px' }}>+</span>
          <span style={{ color: '#c4b5fd' }}>♏</span>
          <span style={{ color: '#64748b', fontSize: '48px' }}>=</span>
          <span style={{ color: '#fbbf24' }}>?</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
