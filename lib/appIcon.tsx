import { ImageResponse } from 'next/og';

// Drawn in a 100x100 viewBox. The chart stays in the central safe zone
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
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 100 100">
          <polyline
            points="8,78 34,52 54,64 88,24"
            fill="none"
            stroke="white"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="88" cy="24" r="10" fill="#facc15" />
        </svg>
      </div>
    ),
    { width: size, height: size }
  );
}
