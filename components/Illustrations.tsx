/**
 * Small animated illustrations (owner, 5 Nov 2026: "interactive gifs or animations, like a figure with phone in hand";
 * restyled the same day after the owner's flat-illustration reference: a person at a desk, laptop seen from behind,
 * mug, floating shapes). Inline SVG drawn for this site (no stock art, no GIFs): sharp at any size, a few KB, no
 * request, CSP-safe. Motion is CSS (`.ill-*` in app/globals.css): gentle loops, livelier on hover, still under reduced
 * motion.
 */

const SKIN = "#eeb48f";
const SKIN_SHADE = "#d99a74";
const HAIR = "#2e1a12";
const TOP = "#8fc0ff";
const SLEEVE = "#1f6feb";
const NAVY = "#1b2b77";
const INK = "#0f1633";
const LAPTOP = "#22304f";
const DESK = "#f2c79a";

/** A mitten hand: palm + thumb, drawn at the origin pointing right; place it with `transform`. */
function Hand({ transform, thumb = true }: { transform: string; thumb?: boolean }) {
  return (
    <g transform={transform}>
      <rect x="-2" y="-8" width="20" height="16" rx="8" fill={SKIN} />
      {thumb && <rect x="4" y="-13" width="9" height="8" rx="4" fill={SKIN} transform="rotate(-25 8 -9)" />}
    </g>
  );
}

/** Head in three-quarter view facing right, with long hair; `mood` changes the mouth, `phones` adds headphones. */
function Head({ mood = "smile", phones = false, back = false }: { mood?: "smile" | "puzzled"; phones?: boolean; back?: boolean }) {
  if (back) {
    // Long hair behind the head and shoulders (drawn before the body).
    return <path d="M170 100 C152 130 150 176 158 204 C178 212 200 210 212 202 C204 178 200 150 200 118 Z" fill={HAIR} />;
  }
  return (
    <g>
      {/* Face with a small nose on the right */}
      <path d="M172 116 C172 94 188 84 204 86 C222 88 232 102 231 120 C231 124 234 126 236 129 C234 131 231 132 231 134 C230 147 220 155 206 155 C188 155 172 140 172 116 Z" fill={SKIN} />
      <ellipse cx="183" cy="124" rx="7" ry="9" fill={SKIN_SHADE} />
      {/* Front hair: a cap with a fringe swept to the right */}
      <path d="M168 120 C162 92 180 78 204 80 C224 82 238 98 232 114 C224 104 210 100 198 102 C192 112 182 118 176 132 C172 128 170 124 168 120 Z" fill={HAIR} />
      <path d="M208 106 q7 -4 14 0" stroke={HAIR} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <ellipse className="ill-blink" cx="216" cy="117" rx="2.6" ry="3.3" fill={HAIR} style={{ transformOrigin: "216px 117px" }} />
      <ellipse cx="210" cy="131" rx="6" ry="3.5" fill="#f08c8c" opacity="0.35" />
      {mood === "smile"
        ? <path d="M208 139 q7 6 14 -1" stroke={HAIR} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        : <path d="M210 142 q6 -3 12 0" stroke={HAIR} strokeWidth="2.4" fill="none" strokeLinecap="round" />}
      {phones && (
        <g>
          <path d="M180 118 C176 80 228 72 230 104" stroke={INK} strokeWidth="6" fill="none" strokeLinecap="round" />
          <rect x="174" y="110" width="16" height="26" rx="7" fill={INK} />
          <rect x="178" y="114" width="8" height="18" rx="4" fill={SLEEVE} />
        </g>
      )}
    </g>
  );
}

/** Upper body from the waist up (`bottom` = where the torso ends). */
function Torso({ bottom = 270 }: { bottom?: number }) {
  return (
    <>
      <path d={`M146 ${bottom} C142 224 148 188 170 176 C184 168 220 167 236 177 C254 190 258 230 254 ${bottom} Z`} fill={TOP} />
      <path d="M190 146 L210 146 L212 176 C206 184 194 184 188 176 Z" fill={SKIN_SHADE} />
    </>
  );
}

/** A tube sleeve along `d` (an arm), drawn as a thick round-capped line. */
const Sleeve = ({ d }: { d: string }) => <path d={d} stroke={SLEEVE} strokeWidth="24" fill="none" strokeLinecap="round" strokeLinejoin="round" />;

/** Floating decoration: a turning square, a bobbing circle, twinkles. */
function Floaters() {
  return (
    <>
      <rect className="ill-turn" x="40" y="40" width="44" height="44" rx="8" fill={NAVY} opacity="0.85" style={{ transformOrigin: "62px 62px" }} />
      <circle className="ill-float" cx="58" cy="152" r="24" fill="#a9d8ff" style={{ transformOrigin: "58px 152px" }} />
      {[[150, 40], [340, 150], [28, 220], [300, 30]].map(([x, y], i) => (
        <path key={i} className={`ill-twinkle ill-d${i % 3}`} d={`M${x} ${y - 6} V${y + 6} M${x - 6} ${y} H${x + 6}`} stroke={DESK} strokeWidth="2.5" strokeLinecap="round" />
      ))}
    </>
  );
}

/** A speech bubble that pops in and out; `delay` 1 alternates it with a first bubble in the same place. */
function Bubble({ x, y, w, text, delay = 0 }: { x: number; y: number; w: number; text: string; delay?: 0 | 1 }) {
  return (
    <g className={`ill-bubble ${delay ? "ill-bubble-2" : ""}`}>
      <rect x={x} y={y} width={w} height="36" rx="10" fill="#ffffff" stroke="#d8e2f1" strokeWidth="1.5" />
      <path d={`M${x + 18} ${y + 35} L${x + 14} ${y + 48} L${x + 30} ${y + 35} Z`} fill="#ffffff" />
      <text x={x + w / 2} y={y + 23} textAnchor="middle" fontSize="13" fontWeight="600" fill={INK} style={{ fontFamily: "var(--ff-body)" }}>{text}</text>
    </g>
  );
}

/** A bubble with three bouncing "typing" dots. */
function TypingBubble({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="70" height="34" rx="10" fill="#ffb4a8" />
      <path d={`M${x + 14} ${y + 33} L${x + 12} ${y + 45} L${x + 26} ${y + 33} Z`} fill="#ffb4a8" />
      {[0, 1, 2].map((i) => (
        <circle key={i} className={`ill-dot ill-d${i}`} cx={x + 21 + i * 14} cy={y + 17} r="4" fill="#fff" style={{ transformOrigin: `${x + 21 + i * 14}px ${y + 17}px` }} />
      ))}
    </g>
  );
}

/** Desk, laptop (seen from behind) and a mug with steam. Drawn after the arms, so the far hand is behind the laptop. */
function Desk() {
  return (
    <>
      <path d="M252 186 L338 186 Q347 186 345 195 L329 262 Q327 270 319 270 L232 270 Z" fill={LAPTOP} />
      <circle cx="290" cy="228" r="8" fill="#ffffff" opacity="0.9" />
      <rect x="212" y="265" width="118" height="7" rx="3.5" fill={INK} />
      <path d="M30 272 H370" stroke={DESK} strokeWidth="2.5" strokeLinecap="round" />
      {/* Mug */}
      <g transform="translate(70 244)">
        <path className="ill-steam" d="M10 -6 q-5 -8 0 -16 q5 -8 0 -16" stroke="#c9d4ea" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path className="ill-steam ill-d2" d="M20 -6 q-5 -8 0 -16 q5 -8 0 -16" stroke="#c9d4ea" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="31" cy="14" r="7" fill="none" stroke={DESK} strokeWidth="4" />
        <path d="M0 2 H30 V20 Q30 28 22 28 H8 Q0 28 0 20 Z" fill="#f7c08a" />
        <ellipse cx="15" cy="2" rx="15" ry="3" fill={INK} />
      </g>
    </>
  );
}

/** A chair back behind the person. */
const Chair = () => (
  <>
    <path d="M110 170 Q110 160 120 160 L196 160 Q206 160 204 170 L190 272 L128 272 Z" fill="#c7dcff" />
    <path d="M110 170 L128 272 L112 272 L96 182 Q94 162 110 160 Z" fill="#a4c4f5" />
  </>
);

type DeskMode = "phone" | "type";

/** A person at a desk: typing with both hands, or with the phone at the ear and typing with the other hand. */
function DeskPerson({ mode, phones = false }: { mode: DeskMode; phones?: boolean }) {
  return (
    <>
      <Chair />
      <Head back />
      <Torso />
      {/* Far arm: elbow down, hand on the keyboard behind the laptop */}
      <Sleeve d="M238 184 C252 206 254 232 246 248 L262 252" />
      <Hand transform="translate(266 252)" thumb={false} />
      <Head phones={phones} />
      {mode === "phone" ? (
        <g className="ill-call" style={{ transformOrigin: "152px 228px" }}>
          {/* Near arm bent up, phone pressed to the ear */}
          <Sleeve d="M166 184 L150 226 L176 152" />
          <g className="ill-ring" style={{ transformOrigin: "182px 122px" }}>
            <rect x="174" y="98" width="16" height="36" rx="4" fill={INK} transform="rotate(-8 182 116)" />
            <rect x="177" y="102" width="10" height="24" rx="2" fill="#7cc4ff" transform="rotate(-8 182 116)" />
          </g>
          <Hand transform="translate(170 142) rotate(-72)" />
          <g stroke={SLEEVE} strokeWidth="3" fill="none" strokeLinecap="round">
            <path className="ill-wave" d="M164 100 q-8 10 0 22" />
            <path className="ill-wave ill-d1" d="M155 92 q-14 18 0 38" />
            <path className="ill-wave ill-d2" d="M146 84 q-20 26 0 54" />
          </g>
        </g>
      ) : (
        <g className="ill-typing" style={{ transformOrigin: "160px 240px" }}>
          {/* Near arm: forearm along the desk to the keyboard */}
          <Sleeve d="M166 186 C150 208 150 236 162 248 L226 250" />
          <Hand transform="translate(232 250)" />
        </g>
      )}
      <Desk />
    </>
  );
}

const Svg = ({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) => (
  <svg viewBox="0 0 400 300" role="img" aria-label={label} className={`ill h-auto w-full ${className}`}>{children}</svg>
);

/** Contact page: a counsellor at the desk, phone at the ear, speech bubbles. */
export function CallScene({ className, bubbles = ["Hi! How can we help?", "Free counselling ✈"] }: { className?: string; bubbles?: [string, string] }) {
  return (
    <Svg label="Illustration: a Western World counsellor at a desk, on the phone" className={className}>
      <Floaters />
      <DeskPerson mode="phone" />
      <Bubble x={236} y={60} w={156} text={bubbles[0]} />
      <Bubble x={236} y={60} w={156} text={bubbles[1]} delay={1} />
    </Svg>
  );
}

/** Thank-you page: the counsellor is about to call, with confetti. */
export function CallbackScene({ className }: { className?: string }) {
  const confetti = [[60, "#1f6feb"], [120, "#a9d8ff"], [250, "#4ade80"], [300, "#1f6feb"], [350, "#f5b301"], [30, "#f5b301"], [200, "#ffb4a8"]] as const;
  return (
    <Svg label="Illustration: a counsellor about to call you back" className={className}>
      <Floaters />
      {confetti.map(([x, color], i) => (
        <rect key={i} className={`ill-confetti ill-c${i % 4}`} x={x} y="-10" width="8" height="12" rx="2" fill={color} />
      ))}
      <DeskPerson mode="phone" />
      <Bubble x={236} y={60} w={156} text="Request received ✓" />
      <Bubble x={236} y={60} w={156} text="We'll call you soon" delay={1} />
    </Svg>
  );
}

/** Test prep: a student with headphones typing, a typing bubble and a stopwatch. */
export function StudyScene({ className }: { className?: string }) {
  return (
    <Svg label="Illustration: a student with headphones practising on a laptop" className={className}>
      <Floaters />
      <DeskPerson mode="type" phones />
      <TypingBubble x={268} y={84} />
      <g className="ill-float" style={{ transformOrigin: "352px 52px" }}>
        <circle cx="352" cy="52" r="22" fill="#fff" />
        <circle cx="352" cy="52" r="16" fill="none" stroke={SLEEVE} strokeWidth="3" />
        <path className="ill-hand" style={{ transformOrigin: "352px 52px" }} d="M352 52 L352 41" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <rect x="347" y="25" width="10" height="6" rx="2" fill={SLEEVE} />
      </g>
    </Svg>
  );
}

/** 404: a traveller holding a map with both hands, a little lost. */
export function LostScene({ className }: { className?: string }) {
  return (
    <Svg label="Illustration: a traveller looking at a map, a little lost" className={className}>
      <Floaters />
      <path d="M30 296 H370" stroke={DESK} strokeWidth="2.5" strokeLinecap="round" />
      <Head back />
      <Torso bottom={296} />
      <g className="ill-tilt" style={{ transformOrigin: "200px 160px" }}><Head mood="puzzled" /></g>
      {/* Both arms come forward to hold the map */}
      <Sleeve d="M166 186 C150 210 152 236 168 244" />
      <Sleeve d="M238 186 C252 210 250 236 236 244" />
      <g className="ill-float" style={{ transformOrigin: "202px 238px" }}>
        <path d="M156 214 L184 222 L218 212 L248 220 L248 264 L218 256 L184 266 L156 258 Z" fill="#ffffff" stroke={NAVY} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M184 222 V266 M218 212 V256" stroke={NAVY} strokeWidth="2" opacity="0.35" />
        <path d="M166 248 C178 232 196 254 210 238 S236 228 240 242" stroke={SLEEVE} strokeWidth="2.5" fill="none" strokeDasharray="4 5" />
        <path d="M234 232 l8 8 m0 -8 l-8 8" stroke="#e5484d" strokeWidth="3" strokeLinecap="round" />
        {/* Hands gripping the edges, thumbs over the paper */}
        <Hand transform="translate(152 240) rotate(-90)" />
        <Hand transform="translate(252 240) rotate(-90) scale(1 -1)" />
      </g>
      {[[110, 0], [262, 1], [290, 2]].map(([x, d]) => (
        <text key={x} x={x} y="96" className={`ill-q ill-d${d}`} fontSize="30" fontWeight="700" fill={SLEEVE} style={{ fontFamily: "var(--ff-display)" }}>?</text>
      ))}
    </Svg>
  );
}

/** Visa assistance: a rubber stamp comes down on a passport, "APPROVED" appears, a plane takes off. */
export function StampScene({ className }: { className?: string }) {
  return (
    <Svg label="Illustration: a passport being stamped approved" className={className}>
      <rect className="ill-turn" x="40" y="40" width="40" height="40" rx="8" fill={NAVY} opacity="0.85" style={{ transformOrigin: "60px 60px" }} />
      <circle className="ill-float" cx="340" cy="70" r="22" fill="#a9d8ff" style={{ transformOrigin: "340px 70px" }} />
      <g className="ill-takeoff">
        <path transform="translate(70 140)" fill={SLEEVE}
              d="M12 0 C12 -1.6 10.5 -2.2 9 -2.2 L3 -2.2 L-4 -10 L-7 -10 L-3 -2.2 L-9 -2.2 L-12 -6 L-14 -6 L-12.5 0 L-14 6 L-12 6 L-9 2.2 L-3 2.2 L-7 10 L-4 10 L3 2.2 L9 2.2 C10.5 2.2 12 1.6 12 0 Z" />
      </g>
      <path d="M30 278 H370" stroke={DESK} strokeWidth="2.5" strokeLinecap="round" />
      {/* Open passport */}
      <g transform="rotate(-6 200 220)">
        <rect x="108" y="168" width="184" height="104" rx="10" fill={NAVY} />
        <rect x="116" y="172" width="82" height="94" rx="6" fill="#fff" />
        <rect x="202" y="172" width="82" height="94" rx="6" fill="#f3f7fd" />
        <circle cx="142" cy="200" r="14" fill="#e6eaf8" />
        <rect x="126" y="224" width="60" height="5" rx="2.5" fill="#d8e2f1" />
        <rect x="126" y="236" width="44" height="5" rx="2.5" fill="#d8e2f1" />
        <rect x="126" y="248" width="52" height="5" rx="2.5" fill="#d8e2f1" />
        <g className="ill-ink" style={{ transformOrigin: "243px 219px" }}>
          <circle cx="243" cy="219" r="30" fill="none" stroke={SLEEVE} strokeWidth="3" />
          <circle cx="243" cy="219" r="23" fill="none" stroke={SLEEVE} strokeWidth="1.5" />
          <text x="243" y="223" textAnchor="middle" fontSize="10" fontWeight="700" fill={SLEEVE} letterSpacing="1" style={{ fontFamily: "var(--ff-mono)" }}>APPROVED</text>
        </g>
      </g>
      {/* The rubber stamp */}
      <g className="ill-stamp" style={{ transformOrigin: "244px 120px" }}>
        <rect x="234" y="58" width="20" height="44" rx="8" fill="#b7793f" />
        <circle cx="244" cy="56" r="15" fill="#c98a4f" />
        <rect x="216" y="100" width="56" height="16" rx="4" fill={INK} />
        <rect x="220" y="116" width="48" height="8" rx="2" fill={SLEEVE} />
      </g>
    </Svg>
  );
}
