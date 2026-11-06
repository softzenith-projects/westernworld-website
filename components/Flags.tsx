/**
 * Small flags for the destination chips (drawn here: emoji flags show as letters on Windows, and the CSP keeps images
 * on this site). Simplified for 16–24 px; not for use as official artwork.
 */
type Props = { className?: string };

const Frame = ({ label, viewBox, className, children }: Props & { label: string; viewBox: string; children: React.ReactNode }) => (
  <svg viewBox={viewBox} role="img" aria-label={label} preserveAspectRatio="xMidYMid slice"
       className={`overflow-hidden rounded-[3px] ring-1 ring-black/10 ${className ?? ""}`}>
    {children}
  </svg>
);

export const FlagUK = ({ className }: Props) => (
  <Frame label="United Kingdom flag" viewBox="0 0 60 30" className={className}>
    <rect width="60" height="30" fill="#012169" />
    <path d="M0 0 60 30M60 0 0 30" stroke="#fff" strokeWidth="6" />
    <path d="M0 0 60 30M60 0 0 30" stroke="#c8102e" strokeWidth="2" />
    <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
    <path d="M30 0v30M0 15h60" stroke="#c8102e" strokeWidth="6" />
  </Frame>
);

export const FlagIreland = ({ className }: Props) => (
  <Frame label="Ireland flag" viewBox="0 0 3 2" className={className}>
    <rect width="1" height="2" fill="#169b62" />
    <rect x="1" width="1" height="2" fill="#fff" />
    <rect x="2" width="1" height="2" fill="#ff883e" />
  </Frame>
);

export const FlagCanada = ({ className }: Props) => (
  <Frame label="Canada flag" viewBox="0 0 200 100" className={className}>
    <rect width="200" height="100" fill="#fff" />
    <rect width="50" height="100" fill="#d52b1e" />
    <rect x="150" width="50" height="100" fill="#d52b1e" />
    <path fill="#d52b1e" transform="translate(56 8) scale(.88)"
          d="M50 8 58 24 66 20 62 42 76 30 80 38 92 36 86 52 92 56 72 72 76 80 54 76 54 94 46 94 46 76 24 80 28 72 8 56 14 52 8 36 20 38 24 30 38 42 34 20 42 24Z" />
  </Frame>
);

/** Twelve gold stars in a circle on blue. */
const STAR = (cx: number, cy: number, r: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const d = i % 2 ? r * 0.4 : r;
    return `${(cx + d * Math.cos(a)).toFixed(2)},${(cy + d * Math.sin(a)).toFixed(2)}`;
  }).join(" ");

export const FlagEurope = ({ className }: Props) => (
  <Frame label="European Union flag" viewBox="0 0 30 20" className={className}>
    <rect width="30" height="20" fill="#003399" />
    {Array.from({ length: 12 }, (_, i) => {
      const a = (i * Math.PI) / 6;
      return <polygon key={i} fill="#ffcc00" points={STAR(15 + 6 * Math.cos(a), 10 + 6 * Math.sin(a), 1.1)} />;
    })}
  </Frame>
);

const CHIPS = [
  { name: "UK", Flag: FlagUK },
  { name: "Ireland", Flag: FlagIreland },
  { name: "Canada", Flag: FlagCanada },
  { name: "Europe", Flag: FlagEurope },
];

/** The white pill of destinations from the owner's promo (popup and home hero). `className` places it. */
export const DestinationChips = ({ className }: Props) => (
  <ul aria-label="Popular destinations"
      className={`flex items-center justify-between gap-1 rounded-full bg-white px-2.5 py-2 shadow-sm ring-1 ring-line sm:px-4 ${className ?? ""}`}>
    {CHIPS.map(({ name, Flag }, i) => (
      <li key={name} className={`flex items-center gap-1.5 text-xs font-semibold text-ink sm:text-sm ${i ? "border-l border-line pl-2 sm:pl-3" : ""}`}>
        <Flag className="h-3.5 w-5 sm:h-4 sm:w-6" /> {name}
      </li>
    ))}
  </ul>
);
