export function LogoMark({ size = 28 }: { size?: number }) {
  const petals = Array.from({ length: 7 }, (_, i) => i);
  return (
    <svg width={size} height={size} viewBox="-32 -32 64 64" aria-hidden="true" focusable="false" className="logo-mark">
      <g>
        {petals.map((i) => (
          <ellipse
            key={i}
            rx="6"
            ry="13"
            transform={`rotate(${(360 / 7) * i}) translate(0 -13)`}
            fill={i % 2 === 0 ? 'var(--violet)' : 'var(--cyan)'}
            opacity={0.92}
          />
        ))}
      </g>
      <circle r="7.5" fill="var(--gold)" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="logo">
      <LogoMark />
      <span className="logo__word">BundleBloom</span>
    </span>
  );
}
