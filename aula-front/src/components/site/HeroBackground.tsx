// Fundo gráfico abstrato (ondas + bolhas) inspirado na capa do deck de
// solução do projeto — ecoa a linha d'água/carro do logo em vez de usar
// uma foto genérica ou um azul liso.
export function HeroBackground() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hero-base" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#123a86" />
          <stop offset="100%" stopColor="#0b1e38" />
        </linearGradient>
        <linearGradient id="hero-wave-1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1d5fd1" />
          <stop offset="100%" stopColor="#123a86" />
        </linearGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#hero-base)" />

      <path
        d="M0,620 C420,520 900,720 1600,560 L1600,900 L0,900 Z"
        fill="url(#hero-wave-1)"
        opacity="0.55"
      />
      <path
        d="M0,700 C500,780 1050,600 1600,700 L1600,900 L0,900 Z"
        fill="#38c6e8"
        opacity="0.12"
      />
      <path
        d="M0,520 C380,460 760,600 1200,480 C1350,440 1500,460 1600,500 L1600,560 C1500,520 1350,500 1200,540 C760,660 380,520 0,580 Z"
        fill="#38c6e8"
        opacity="0.18"
      />

      {[
        [1180, 140, 10],
        [1280, 220, 16],
        [1380, 160, 7],
        [1460, 260, 22],
        [1080, 260, 6],
        [1240, 340, 9],
        [200, 120, 8],
        [120, 220, 5],
      ].map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#38c6e8" opacity="0.35" />
      ))}
    </svg>
  )
}
