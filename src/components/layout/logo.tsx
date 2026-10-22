export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden>
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4338ca" />
            <stop offset="0.55" stopColor="#0e7490" />
            <stop offset="1" stopColor="#c2410c" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#logo-g)" />
        {/* an atom: two electron orbits around a nucleus */}
        <ellipse cx="16" cy="16" rx="11" ry="4.6" fill="none" stroke="white" strokeWidth="1.8" transform="rotate(35 16 16)" />
        <ellipse cx="16" cy="16" rx="11" ry="4.6" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="1.8" transform="rotate(-35 16 16)" />
        <circle cx="16" cy="16" r="2.8" fill="#fbbf24" />
        <circle cx="25" cy="22.3" r="1.6" fill="white" />
      </svg>
      {!compact && (
        <span className="font-display text-lg font-bold tracking-tight">
          Physics<span className="bg-gradient-to-r from-brand to-waves bg-clip-text text-transparent">Mzansi</span>
        </span>
      )}
    </span>
  );
}
