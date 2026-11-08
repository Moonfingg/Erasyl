import { useMemo, useRef, useState } from 'react';
import { engine } from './audio';
import { burst } from './fx';
import { Head, Horn, Mountains, R, ShootingStars, Stars, rng, useCount, vars } from './ui';

/* 1 Кіріспе */
export function Slide1() {
  const title = 'Ақтамберді';
  return (
    <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(180deg,#050816_0%,#0d1636_45%,#2a2150_75%,#6b3a4a_100%)]">
      <Stars count={90} seed={3} />
      <ShootingStars count={3} />
      {/* Ай */}
      <div className="par-2 pointer-events-none absolute inset-0">
      <div className="rise-sun absolute left-1/2 top-[7%] h-[38vmin] w-[38vmin] -translate-x-1/2">
        <div className="pulse-glow absolute -inset-[30%] rounded-full bg-[radial-gradient(circle,rgba(255,214,140,0.35),transparent_65%)]" />
        <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 h-full w-full">
          <circle cx="100" cy="100" r="96" fill="none" stroke="#e3b04b" strokeOpacity="0.55" strokeWidth="1" strokeDasharray="2 7" />
          <circle cx="100" cy="100" r="88" fill="none" stroke="#e3b04b" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="14 10" />
        </svg>
        <div className="absolute inset-[16%] rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff4d2,#f0c46a_60%,#c9892f)] shadow-[0_0_80px_20px_rgba(240,196,106,0.35)]" />
      </div>
      </div>
      <Mountains colors={['#1a1a3f', '#0b0f26']} className="h-[34%]" />

      <div className="par-3 relative z-10 flex h-full flex-col items-center justify-center px-4 pb-[10vh] pt-[8vh] text-center">
        <R d={0.5} className="mb-3 text-[0.7rem] uppercase tracking-[0.45em] text-gold md:text-sm">
          Жорық жырауы, батыр, би
        </R>
        <h1
          className="font-serif text-[clamp(2.8rem,10.5vw,8.5rem)] font-extrabold leading-none text-cream drop-shadow-[0_6px_30px_rgba(0,0,0,0.6)]"
          style={{ perspective: 600 }}
        >
          {title.split('').map((c, i) => (
            <span key={i} className="letter" style={vars({ '--d': `${0.7 + i * 0.09}s` })}>
              {c}
            </span>
          ))}
        </h1>
        <R d={1.9} className="font-serif text-[clamp(1.4rem,4vw,3rem)] italic text-gold">
          <span className="shine-text">жырау</span>
        </R>
        <div className="my-4 w-48 md:w-64">
          <Horn d={2.2} />
        </div>
        <R d={2.8} className="rounded-2xl border border-gold/30 bg-ink/50 px-5 py-3 backdrop-blur-md md:px-9 md:py-4">
          <div className="mb-2 text-[0.65rem] uppercase tracking-[0.35em] text-cream/60 md:text-xs">Презентацияны дайындағандар</div>
          <div className="flex flex-col items-center gap-1 font-serif text-lg font-bold text-cream sm:flex-row sm:gap-5 md:text-2xl">
            <span>Бауржан Ерасыл</span>
            <span className="hidden h-2 w-2 rotate-45 bg-gold sm:block" />
            <span>Байменов Мансур</span>
          </div>
        </R>
      </div>
    </div>
  );
}

/* 2 Ол кім */
export function Slide2() {
  const a = useCount(1675, 1500, 2200, 1.0);
  const b = useCount(1768, 1500, 2600, 1.4);
  const age = useCount(93, 0, 2600, 1.6);
  const lines = useMemo(() => {
    const r = rng(7);
    return Array.from({ length: 16 }, () => ({
      top: r() * 100,
      w: 120 + r() * 260,
      dur: 3 + r() * 5,
      del: r() * 4,
    }));
  }, []);
  const chips = ['Жырау', 'Батыр', 'Әскербасы', 'Шешен би'];
  return (
    <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,#0b1a2e_0%,#12324a_55%,#1c5560_100%)]">
      {lines.map((l, i) => (
        <span key={i} className="wind-line" style={{ top: `${l.top}%`, width: l.w, animationDuration: `${l.dur}s`, animationDelay: `${l.del}s` }} />
      ))}
      <svg className="spin-rev absolute -right-40 -top-40 h-[520px] w-[520px] opacity-20" viewBox="0 0 200 200" fill="none" stroke="#e3b04b">
        {Array.from({ length: 12 }).map((_, i) => (
          <ellipse key={i} cx="100" cy="100" rx="90" ry="30" transform={`rotate(${i * 15} 100 100)`} strokeWidth="0.8" />
        ))}
      </svg>
      <div className="relative z-10 mx-auto grid h-full max-w-7xl items-center gap-8 px-6 py-16 md:px-14 lg:grid-cols-2">
        <div>
          <Head n="02" kicker="Ол кім" title="Ақтамберді кім болған" />
          <R d={0.5} className="max-w-xl text-base leading-relaxed text-cream/85 md:text-xl">
            Ақтамберді Сарыұлы қазақтың ұлы жырауы, батыры және әскербасы. Ол Орта жүз Найманның сыбан руынан шыққан, ұзақ ғұмыры ат үстінде өтті
          </R>
          <div className="mt-6 flex flex-wrap gap-3">
            {chips.map((c, i) => (
              <R key={c} d={0.9 + i * 0.2} kind="pop">
                <span className="inline-block rounded-full border border-gold/50 bg-gold/10 px-5 py-2 font-serif text-base font-bold text-gold md:text-lg">{c}</span>
              </R>
            ))}
          </div>
          <R d={1.9} className="mt-7 space-y-3 text-sm md:text-base">
            <div className="flex gap-3">
              <span className="w-40 shrink-0 text-cream/50">Туған жері</span>
              <span className="font-semibold">Қаратау маңы</span>
            </div>
            <div className="flex gap-3">
              <span className="w-40 shrink-0 text-cream/50">Қайтыс болған жері</span>
              <span className="font-semibold">Шыңғыстау бөктері, Жүрекжота</span>
            </div>
          </R>
        </div>

        <R d={0.8} kind="slide-in-right" className="relative">
          <div className="tilt rounded-3xl border border-cream/15 bg-ink/45 p-6 text-center backdrop-blur-md md:p-10">
            <div className="text-xs uppercase tracking-[0.35em] text-cream/55">Өмір жолы</div>
            <div className="mt-5 flex items-center justify-between gap-2">
              <div className="font-serif text-[clamp(2.4rem,6vw,4.8rem)] font-extrabold leading-none text-cream">{a}</div>
              <svg viewBox="0 0 100 10" className="h-3 min-w-0 flex-1" fill="none">
                <path d="M2 5 H98" stroke="#e3b04b" strokeWidth="1.6" strokeDasharray="3 4" pathLength={1} className="draw" style={vars({ '--d': '1.2s' })} />
                <circle cx="50" cy="5" r="3" fill="#e3b04b" />
              </svg>
              <div className="font-serif text-[clamp(2.4rem,6vw,4.8rem)] font-extrabold leading-none text-cream">{b}</div>
            </div>
            <div className="mt-2 flex justify-between px-1 text-xs uppercase tracking-widest text-gold/80">
              <span>туған жылы</span>
              <span>қайтыс болған жылы</span>
            </div>
            <div className="mt-8 border-t border-cream/15 pt-6">
              <div className="shine-text font-serif text-[clamp(3.5rem,9vw,7rem)] font-extrabold leading-none">{age}</div>
              <div className="mt-1 font-serif text-xl text-cream/85 md:text-2xl">жыл өмір сүрді</div>
              <div className="mt-2 text-sm text-cream/60">Жетпіс жыл бойы ат үстінен түспеді</div>
            </div>
          </div>
        </R>
      </div>
    </div>
  );
}

/* 3 Жастық шағы */
function Horse() {
  return (
    <svg viewBox="0 -40 270 210" className="h-full w-auto" style={{ overflow: 'visible' }}>
      <g className="horse-bob" fill="#1a0f1c" stroke="#1a0f1c">
        {/* артқы аяқтар */}
        <g className="leg-b" style={{ transformOrigin: '85px 88px' }}>
          <path d="M85 88 L70 120 L78 150" fill="none" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g className="leg-a" style={{ transformOrigin: '98px 88px' }}>
          <path d="M98 88 L84 120 L92 150" fill="none" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* дене */}
        <path d="M58 72 Q58 50 100 50 L150 52 Q178 55 178 75 Q178 94 150 94 L90 94 Q58 94 58 72Z" strokeWidth="0" />
        <path d="M150 56 L186 24 L204 32 L172 76 Z" strokeWidth="0" />
        <path d="M186 24 L218 37 L214 48 L196 45 L182 37 Z" strokeWidth="0" />
        <path d="M190 26 L192 12 L198 28 Z" strokeWidth="0" />
        <path d="M60 62 Q30 58 20 96 Q38 76 60 78 Z" strokeWidth="0" />
        <path d="M158 52 Q172 30 186 20" fill="none" stroke="#2b1a2d" strokeWidth="5" strokeLinecap="round" />
        {/* алдыңғы аяқтар */}
        <g className="leg-a" style={{ transformOrigin: '150px 88px' }}>
          <path d="M150 88 L168 118 L162 150" fill="none" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g className="leg-b" style={{ transformOrigin: '140px 88px' }}>
          <path d="M140 88 L158 118 L152 150" fill="none" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* салт атты */}
        <path d="M108 54 L120 14 L136 16 L132 54 Z" strokeWidth="0" />
        <circle cx="130" cy="4" r="9" strokeWidth="0" />
        <path d="M119 -2 Q130 -18 142 -2 Z" strokeWidth="0" />
        <path d="M136 28 L250 -30" fill="none" stroke="#1a0f1c" strokeWidth="3" strokeLinecap="round" />
        <path d="M250 -30 L238 -36 L242 -24 Z" strokeWidth="0" />
      </g>
    </svg>
  );
}

export function Slide3() {
  const cards = [
    { big: '10 жас', text: 'Өлең шығара бастады' },
    { big: '13 жас', text: 'Қару асынып, соғысқа қатысты' },
    { big: '70 жыл', text: 'Ат үстінен түспей, елін қорғады' },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(180deg,#2a1b4a_0%,#8a3f5d_38%,#e5834a_68%,#f6c066_100%)]">
      {/* күн */}
      <div className="rise-sun absolute bottom-[26%] left-[62%] h-[26vmin] w-[26vmin]">
        <div className="pulse-glow absolute -inset-[40%] rounded-full bg-[radial-gradient(circle,rgba(255,226,150,0.6),transparent_65%)]" />
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_40%_40%,#fffbe0,#ffd27a)]" />
      </div>
      <Stars count={30} seed={11} height={30} />
      <Mountains colors={['#5a2c58', '#2d1738']} className="h-[34%]" />
      {/* жер */}
      <div className="absolute inset-x-0 bottom-0 h-[10%] bg-[#150b19]" />
      {/* салт атты */}
      <div className="absolute bottom-[3%] left-0 z-[5] h-[26vh] min-h-[130px]">
        <div className="ride relative h-full">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="dust absolute bottom-[4%] left-[8%] h-10 w-10 rounded-full bg-[#e9b88a]/70 blur-md"
              style={{ animationDelay: `${i * 0.28}s` }}
            />
          ))}
          <Horse />
        </div>
      </div>

      <div className="relative z-10 mx-auto h-full max-w-6xl px-6 pb-[34vh] pt-12 md:px-14">
        <Head n="03" kicker="Жастық шағы" title="Қылыш ұстаған жырау" />
        <R d={0.6} className="mb-6 max-w-2xl border-l-4 border-gold pl-4 font-serif text-lg italic text-cream md:text-2xl">
          «Он екіде аттанып, қылыш ілдім білекке»
        </R>
        <div className="grid gap-3 md:grid-cols-3 md:gap-5">
          {cards.map((c, i) => (
            <R key={c.big} d={1 + i * 0.3} kind="pop">
              <div className="tilt rounded-2xl border border-cream/20 bg-[#1a0f1c]/60 p-4 backdrop-blur-md md:p-6">
                <div className="font-serif text-3xl font-extrabold text-gold md:text-5xl">{c.big}</div>
                <div className="mt-1 text-sm text-cream/85 md:text-base">{c.text}</div>
              </div>
            </R>
          ))}
        </div>
      </div>
    </div>
  );
}

/* 4 Жыраулық өнер */
const STR_Y = [142, 158];
const SCALES = [
  [293.7, 329.6, 392, 440, 493.9, 587.3, 659.3, 784],
  [196, 220, 246.9, 293.7, 329.6, 392, 440, 493.9],
];

export function Slide4() {
  const [vib, setVib] = useState([0, 0]);
  const [rings, setRings] = useState<{ id: number; x: number; y: number }[]>([]);
  const idRef = useRef(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const pluck = (s: number, clientX: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 800;
    const idx = Math.min(7, Math.max(0, Math.floor((x - 60) / 60)));
    engine.note(SCALES[s][idx]);
    burst(clientX, rect.top + (STR_Y[s] / 300) * rect.height, 8, '#ffd98a', 0.6);
    setVib((v) => v.map((n, i) => (i === s ? n + 1 : n)));
    const id = ++idRef.current;
    setRings((r) => [...r, { id, x: Math.min(Math.max(x, 60), 540), y: STR_Y[s] }]);
    window.setTimeout(() => setRings((r) => r.filter((q) => q.id !== id)), 1500);
  };

  const points = [
    'Халықтың үні болды',
    'Хандарға ақыл айтты',
    'Жауынгерлерді жырымен рухтандырды',
    'Жырын домбыраның үнімен айтты',
  ];
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_70%_50%,#5b3a1e_0%,#2b1a0f_55%,#120a06_100%)]">
      {/* ұшқан шаң */}
      {Array.from({ length: 24 }).map((_, i) => {
        const r = rng(i + 40);
        return (
          <span
            key={i}
            className="firefly"
            style={vars({
              left: `${r() * 100}%`,
              top: `${r() * 100}%`,
              width: 3,
              height: 3,
              '--fx': `${(r() - 0.5) * 80}px`,
              '--fy': `${(r() - 0.5) * 120}px`,
              animationDuration: `${4 + r() * 5}s`,
              animationDelay: `${r() * 3}s`,
            })}
          />
        );
      })}
      <div className="relative z-10 mx-auto grid h-full max-w-7xl items-center gap-6 px-6 py-14 md:px-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Head n="04" kicker="Жыраулық өнер" title="Жырау деген кім" />
          <ul className="space-y-3">
            {points.map((p, i) => (
              <li key={p}>
                <R d={0.6 + i * 0.25} kind="slide-in-left" className="flex items-center gap-4 text-base text-cream/90 md:text-xl">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/60 font-serif text-gold">{i + 1}</span>
                  {p}
                </R>
              </li>
            ))}
          </ul>
          <R d={1.8} className="mt-7">
            <span className="hint-pulse inline-block rounded-full border border-gold/60 bg-gold/10 px-5 py-2 text-sm text-gold">Домбыра ішегін басып көріңіз</span>
          </R>
        </div>

        <R d={0.7} kind="slide-in-right">
          <svg ref={svgRef} viewBox="0 0 800 300" className="w-full select-none touch-none" style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.55))' }}>
            <defs>
              <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#c98a45" />
                <stop offset="0.5" stopColor="#9a5a28" />
                <stop offset="1" stopColor="#5c3014" />
              </linearGradient>
              <linearGradient id="neck" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#4a2a14" />
                <stop offset="1" stopColor="#24120a" />
              </linearGradient>
            </defs>
            {/* бас */}
            <rect x="6" y="122" width="52" height="56" rx="14" fill="url(#wood)" />
            <circle cx="22" cy="114" r="7" fill="#e3b04b" />
            <circle cx="40" cy="186" r="7" fill="#e3b04b" />
            {/* мойын */}
            <rect x="52" y="128" width="520" height="44" rx="6" fill="url(#neck)" />
            {Array.from({ length: 9 }).map((_, k) => (
              <line key={k} x1={60 + k * 60} y1="128" x2={60 + k * 60} y2="172" stroke="#e3b04b" strokeOpacity="0.55" strokeWidth="2" />
            ))}
            {/* корпус */}
            <ellipse cx="660" cy="150" rx="140" ry="114" fill="url(#wood)" />
            <ellipse cx="660" cy="150" rx="122" ry="98" fill="none" stroke="#e3b04b" strokeWidth="2" strokeDasharray="3 8" strokeLinecap="round" />
            <circle cx="636" cy="150" r="26" fill="#1a0d06" stroke="#e3b04b" strokeWidth="3" />
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <path
                key={a}
                d="M660 82 L666 92 L660 102 L654 92 Z"
                fill="#e3b04b"
                transform={`rotate(${a} 660 150)`}
                opacity="0.85"
              />
            ))}
            <rect x="718" y="116" width="8" height="68" rx="3" fill="#f3e2b8" />
            {/* ішектер */}
            {STR_Y.map((y, s) => (
              <g key={s}>
                <line
                  key={vib[s]}
                  x1="30"
                  y1={y}
                  x2="722"
                  y2={y}
                  stroke="#fff3cf"
                  strokeWidth={s ? 2.4 : 1.8}
                  className={vib[s] ? 'string-vib' : ''}
                />
                <rect
                  x="30"
                  y={y - 8}
                  width="692"
                  height="16"
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onPointerDown={(e) => pluck(s, e.clientX)}
                  onPointerEnter={(e) => e.buttons === 1 && pluck(s, e.clientX)}
                />
              </g>
            ))}
            {rings.map((r) => (
              <circle key={r.id} cx={r.x} cy={r.y} r="6" fill="none" stroke="#ffd98a" strokeWidth="1.4" className="ring" />
            ))}
          </svg>
        </R>
      </div>
    </div>
  );
}

/* 5 Жоңғармен соғыс */
function Sword({ mirror = false }: { mirror?: boolean }) {
  return (
    <g transform={mirror ? 'translate(290 330)' : 'translate(110 330)'}>
      <g>
        <path d="M-9 -30 L-8 -140 Q-5 -176 7 -192 Q11 -150 9 -30 Z" fill="url(#steel)" />
        <path d="M0 -30 L1 -170" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.4" />
        <rect x="-27" y="-34" width="54" height="9" rx="4.5" fill="#e3b04b" />
        <rect x="-5" y="-26" width="10" height="46" rx="3" fill="#4a1d14" />
        <circle cx="0" cy="26" r="8" fill="#e3b04b" />
      </g>
    </g>
  );
}

export function Slide5() {
  const sparks = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const d = 50 + (i % 4) * 22;
        return { dx: Math.cos(a) * d, dy: Math.sin(a) * d };
      }),
    [],
  );
  const embers = useMemo(() => {
    const r = rng(21);
    return Array.from({ length: 26 }, () => ({
      left: r() * 100,
      size: 3 + r() * 6,
      dur: 4 + r() * 6,
      del: r() * 6,
      sx: (r() - 0.5) * 120,
    }));
  }, []);
  const cards = [
    '17 жасынан қалмақтармен шайқасқа қатысты',
    'Батылдығымен көзге түсіп, кейін әскербасы болды',
    'Жоңғар жауынан шығыс жер азат болды, жыраудың арманы орындалды',
  ];
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_70%_60%,#7a1d17_0%,#3b0d10_50%,#12050a_100%)]">
      <div className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-serif text-[clamp(6rem,24vw,22rem)] font-extrabold text-white/[0.04]">ШАЙҚАС</div>
      {embers.map((e, i) => (
        <span key={i} className="ember" style={vars({ left: `${e.left}%`, width: e.size, height: e.size, animationDuration: `${e.dur}s`, animationDelay: `${e.del}s`, '--sx': `${e.sx}px` })} />
      ))}
      <div className="relative z-10 mx-auto grid h-full max-w-7xl items-center gap-4 px-6 py-14 md:px-14 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <Head n="05" kicker="Жоңғармен соғыс" title="Ел үшін шайқас" />
          <div className="space-y-3">
            {cards.map((c, i) => (
              <R key={c} d={0.6 + i * 0.3} kind="slide-in-left">
                <div className="border-l-4 border-gold bg-black/30 px-5 py-3 text-base text-cream md:text-xl">{c}</div>
              </R>
            ))}
          </div>
          <R d={1.8} className="mt-6">
            <span className="hint-pulse inline-block rounded-full border border-gold/60 bg-gold/10 px-5 py-2 text-sm text-gold">Қылыштарды басып көріңіз</span>
          </R>
        </div>
        <R d={0.5} kind="pop" className="mx-auto w-full max-w-[520px]">
          <div className="clash-shake cursor-pointer" onPointerDown={(e) => {
              engine.hit();
              burst(e.clientX, e.clientY, 34, '#ffb85c', 1.4);
            }}>
            <svg viewBox="0 0 400 400" className="w-full" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#8f9bb0" />
                  <stop offset="0.5" stopColor="#f2f5fa" />
                  <stop offset="1" stopColor="#7b869b" />
                </linearGradient>
                <radialGradient id="flashG">
                  <stop offset="0" stopColor="#fff" />
                  <stop offset="0.4" stopColor="#ffd27a" />
                  <stop offset="1" stopColor="#ff7a2c" stopOpacity="0" />
                </radialGradient>
              </defs>
              <g className="sword-l">
                <Sword />
              </g>
              <g className="sword-r">
                <Sword mirror />
              </g>
              <circle cx="200" cy="215" r="46" fill="url(#flashG)" className="flash" />
              {sparks.map((s, i) => (
                <circle key={i} cx="200" cy="215" r={2.4 + (i % 3)} fill="#ffd98a" className="spark" style={vars({ '--dx': `${s.dx}px`, '--dy': `${s.dy}px` })} />
              ))}
            </svg>
          </div>
        </R>
      </div>
    </div>
  );
}
