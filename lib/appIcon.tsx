import { ImageResponse } from 'next/og';
import { LogoMark } from '@/components/Logo';

// Full-bleed background, logo kept in the central safe zone
// so Android "maskable" crops (circle, squircle) don't cut it.
export function renderAppIcon(size: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        }}
      >
        <LogoMark size={size * 0.68} />
      </div>
    ),
    { width: size, height: size }
  );
}
