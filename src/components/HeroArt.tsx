import { LANGUAGES } from '../sim/engine.ts';
import { LANG_COLORS } from '../langColors.ts';
import { useReducedMotion } from '../hooks.ts';

const CX = 260;
const CY = 215;
const R = 172;

/** Seven language files arranged like petals, each flowing into one bundle file. */
export function HeroArt({ label }: { label: string }) {
  const reduced = useReducedMotion();
  const tiles = LANGUAGES.map((lang, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / LANGUAGES.length;
    const x = CX + R * Math.cos(angle);
    const y = CY + R * 0.82 * Math.sin(angle);
    // Curve that bends sideways, like a petal stem.
    const mx = (x + CX) / 2 + Math.cos(angle + Math.PI / 2) * 38;
    const my = (y + CY) / 2 + Math.sin(angle + Math.PI / 2) * 38;
    return { ...lang, x, y, path: `M ${x.toFixed(1)} ${y.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${CX} ${CY}`, color: LANG_COLORS[lang.id], i };
  });

  return (
    <svg className={`hero-art${reduced ? '' : ' is-animated'}`} viewBox="0 0 520 440" style={{ direction: "ltr" }} role="img" aria-label={label}>
      <defs>
        <radialGradient id="ha-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8b6cff" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#3b2f9e" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0e1440" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ha-doc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1d1f5c" />
          <stop offset="100%" stopColor="#121443" />
        </linearGradient>
        <linearGradient id="ha-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f6d58f" />
          <stop offset="100%" stopColor="#c9933a" />
        </linearGradient>
      </defs>

      <circle cx={CX} cy={CY} r="190" fill="url(#ha-core)" />

      {tiles.map((t) => (
        <path
          key={`p-${t.id}`}
          id={`ha-path-${t.i}`}
          d={t.path}
          className="hero-art__stream"
          stroke={t.color}
          style={{ animationDelay: `${0.15 + t.i * 0.08}s` }}
        />
      ))}

      {!reduced &&
        tiles.map((t) => (
          <circle key={`d-${t.id}`} r="2.6" fill="#f6d58f" className="hero-art__spark">
            <animateMotion dur={`${3.2 + (t.i % 3) * 0.6}s`} begin={`${1.4 + t.i * 0.35}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.5 0 0.3 1">
              <mpath href={`#ha-path-${t.i}`} />
            </animateMotion>
          </circle>
        ))}

      {tiles.map((t) => (
        <g key={`t-${t.id}`} className="hero-art__tile" style={{ animationDelay: `${t.i * 0.07}s` }} transform={`translate(${(t.x - 39).toFixed(1)} ${(t.y - 21).toFixed(1)})`}>
          <rect width="78" height="42" rx="10" fill="#141748" stroke={t.color} strokeOpacity="0.55" />
          <circle cx="16" cy="21" r="5" fill={t.color} />
          <text x="28" y="26" className="hero-art__ext" fill="#e8e9ff">
            {t.ext}
          </text>
        </g>
      ))}

      <g className="hero-art__doc" transform={`translate(${CX - 58} ${CY - 72})`}>
        <rect width="116" height="144" rx="14" fill="url(#ha-doc)" stroke="url(#ha-gold)" strokeWidth="1.6" />
        <path d="M 84 0 L 116 32" stroke="url(#ha-gold)" strokeWidth="1.2" opacity="0.6" />
        {tiles.map((t) => (
          <rect key={`l-${t.id}`} x="16" y={22 + t.i * 14} width={84 - ((t.i * 23) % 40)} height="6" rx="3" fill={t.color} opacity="0.85" />
        ))}
        <text x="58" y="136" textAnchor="middle" className="hero-art__docname" fill="#f6d58f">
          bundle.txt
        </text>
      </g>
    </svg>
  );
}
