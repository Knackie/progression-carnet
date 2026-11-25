// Chess pawn whose head is a shuttlecock: cork = pawn head, feathers = crown.
// No hooks/'use client' so it also renders inside next/og ImageResponse (app icons).
export function LogoMark({ size = 40, cork = '#facc15' }: { size?: number; cork?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path d="M41 41 L29 12 H71 L59 41 Z" fill="white" fillOpacity="0.55" />
      <path d="M44 40 L38 12 M50 39 V12 M56 40 L62 12" stroke="white" strokeWidth="2.5" />
      <path d="M33 22 H67" stroke="white" strokeWidth="2.5" />
      <circle cx="50" cy="45" r="10" fill={cork} />
      <rect x="37" y="54" width="26" height="6" rx="3" fill="white" />
      <path d="M41 60 H59 Q61 72 67 80 H33 Q39 72 41 60 Z" fill="white" />
      <rect x="27" y="80" width="46" height="9" rx="4" fill="white" />
    </svg>
  );
}

export default function Logo({
  size = 40,
  showText = true,
  className = '',
}: {
  size?: number;
  showText?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-md shrink-0"
        style={{ width: size, height: size }}
      >
        <LogoMark size={size * 0.8} />
      </span>
      {showText && (
        <span className="font-black bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent truncate">
          Carnet de Progression
        </span>
      )}
    </span>
  );
}
