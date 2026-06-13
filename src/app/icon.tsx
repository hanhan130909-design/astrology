import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #7c3aed, #ec4899, #f59e0b)',
          borderRadius: 80,
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 280,
          height: 280,
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: 60,
        }}>
          <span style={{ fontSize: 128, fontWeight: 900, color: '#7c3aed', fontFamily: 'Arial, sans-serif' }}>LX</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
