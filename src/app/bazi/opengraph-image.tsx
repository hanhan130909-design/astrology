import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'BaZi Career Reading — Find Your Natural Earning Style';
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
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
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
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: '#1a1a2e',
              fontWeight: 'bold',
            }}
          >
            ☰
          </div>
          <span style={{ fontSize: '24px', color: '#94a3b8', letterSpacing: '4px' }}>
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
          Your Day Master Reveals
          <br />
          <span style={{ color: '#fbbf24' }}>Your Natural Career</span>
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
          Free BaZi Chart in 2 Minutes — Find What You're Born to Do
        </p>

        <div
          style={{
            display: 'flex',
            gap: '24px',
            alignItems: 'center',
          }}
        >
          {['Wood', 'Fire', 'Earth', 'Metal', 'Water'].map((el, i) => (
            <div
              key={el}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: [
                  'linear-gradient(135deg, #22c55e, #16a34a)',
                  'linear-gradient(135deg, #ef4444, #dc2626)',
                  'linear-gradient(135deg, #eab308, #ca8a04)',
                  'linear-gradient(135deg, #94a3b8, #64748b)',
                  'linear-gradient(135deg, #3b82f6, #2563eb)',
                ][i],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: '#fff',
                fontWeight: 'bold',
              }}
            >
              {el.charAt(0)}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
