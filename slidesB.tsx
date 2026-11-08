import { useMemo, useState } from 'react';
import { engine } from './audio';
import { burst } from './fx';
import { Head, Horn, Mountains, R, ShootingStars, Stars, rng, useCount, vars } from './ui';

/* 6 Ақтабан шұбырынды */
function Walker({ s = 1, load = false, delay = 0 }: { s?: number; load?: boolean; delay?: number }) {
  return (
    <svg viewBox="0 0 30 62" style={{ height: 52 * s, animationDelay: `${delay}s` }} className="walker" fill="none" stroke="#1c120d" strokeWidth="3" strokeLinecap="round">
      <circle cx="15" cy="8" r="6" fill="#1c120d" stroke="none" />
      <path d="M15 14 L15 40 M15 22 L7 34 M15 22 L23 34 M15 40 L9 58 M15 40 L21 58" />
      {load && <circle cx="9" cy="24" r="8" fill="#1c120d" stroke="none" />}
      <path d="M26 20 L26 60" strokeWidth="2" />
    </svg>
  );
}
function Beast({ s = 1, delay = 0 }: { s?: number; delay?: number }) {
  return (
    <svg viewBox="0 0 80 62" style={{ height: 50 * s, animationDelay: `${delay}s` }} className="walker" fill="#1c120d" stroke="#1c120d" strokeWidth="3" strokeLinecap="round">
      <ellipse cx="38" cy="30" rx="26" ry="11" stroke="none" />
      <path d="M58 26 L70 8 L78 12 L68 30 Z" stroke="none" />
      <path d="M18 38 L14 58 M28 40 L26 58 M46 40 L48 58 M56 38 L60 58" fill="none" />
      <path d="M14 26 Q4 30 6 46" fill="none" />
      <rect x="22" y="12" width="26" height="12" rx="4" stroke="none" />
    </svg>
  );
}

export function Slide6() {
  const year = useCount(1723, 1640, 2800, 0.8);
  const ash = useMemo(() => {
    const r = rng(33);
    return Array.from({ length: 46 }, () => ({
      left: r() * 120,
      size: 2 + r() * 4,
      dur: 5 + r() * 7,
      del: r() * 8,
    }));
  }, []);
  const points = ['Алқакөл сұлама, халық үдере көшті', 'Жұрт жерін, малын тастап кетті', 'Ақтамберді бұл зұлматты өз көзімен көрді'];
  return (
    <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(180deg,#1b1410_0%,#4a3426_45%,#8a6a4a_85%,#b99668_100%)]">
      <div className="absolute right-[12%] top-[14%] h-[24vmin] w-[24vmin] rounded-full bg-[radial-gradient(circle,#f1d9a8,#c79a62_60%,transparent_70%)] opacity-60 blur-[2px]" />
      <div className="fog left-[5%] top-[20%] h-72 w-[40vw]" />
      <div className="fog right-0 top-[45%] h-80 w-[50vw]" style={{ animationDuration: '24s' }} />
      {ash.map((a, i) => (
        <span key={i} className="ash" style={{ left: `${a.left}%`, width: a.size, height: a.size, animationDuration: `${a.dur}s`, animationDelay: `${a.del}s` }} />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-[12%] bg-[#1c120d]" />
      <div className="caravan absolute bottom-[8%] left-0 flex items-end gap-5">
        {Array.from({ length: 16 }).map((_, i) =>
          i % 4 === 2 ? (
            <Beast key={i} s={0.9 + (i % 3) * 0.1} delay={i * 0.13} />
          ) : (
            <Walker key={i} s={0.8 + (i % 3) * 0.2} load={i % 2 === 0} delay={i * 0.17} />
          ),
        )}
      </div>
      <div className="relative z-10 mx-auto grid h-full max-w-7xl items-center gap-6 px-6 pb-[24vh] pt-12 md:px-14 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <Head n="06" kicker="Ұлы апат" title="Ақтабан шұбырынды" />
          <div className="space-y-3">
            {points.map((p, i) => (
              <R key={p} d={0.8 + i * 0.5} className="max-w-xl rounded-xl bg-black/35 px-5 py-3 text-base text-cream backdrop-blur-sm md:text-xl">
                {p}
              </R>
            ))}
          </div>
        </div>
        <R d={0.5} className="text-center lg:text-right">
          <div className="flicker font-serif text-[clamp(4.5rem,15vw,12rem)] font-extrabold leading-none text-cream drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)]">{year}</div>
          <div className="font-serif text-xl italic text-gold md:text-3xl">жылдан басталған Ұлы апат жылдары</div>
        </R>
      </div>
    </div>
  );
}

/* 7 Өсиет */
function Lantern({ word, d, size, offset, freq }: { word: string; d: number; size: number; offset: number; freq: number }) {
  const [hit, setHit] = useState(0);
  return (
    <div className="lantern flex flex-col items-center" style={vars({ '--d': `${d}s`, marginTop: offset })}>
      <div
        className="lantern-sway flex cursor-pointer flex-col items-center"
        style={{ animationDelay: `${d}s` }}
        onPointerDown={(e) => {
          engine.note(freq);
          burst(e.clientX, e.clientY, 30, '#ffd27a', 1.1);
          setHit((n) => n + 1);
        }}
      >
        <div className="h-16 w-px bg-gold/50" />
        <div className="h-2 w-10 rounded-t-md bg-gold" />
        <div
          key={hit}
          className={`${hit ? 'lantern-hit ' : ''}relative grid place-items-center rounded-[45%] border-2 border-gold/80 bg-[radial-gradient(circle_at_50%_45%,#ffe9a8,#f0a93c_55%,#b9561f)] shadow-[0_0_70px_18px_rgba(255,190,90,0.45)]`}
          style={{ width: size, height: size * 1.18 }}
        >
          <span className="px-2 text-center font-serif text-[clamp(1rem,2.2vw,1.9rem)] font-extrabold leading-tight text-[#3a1608]">{word}</span>
        </div>
        <div className="h-2 w-10 rounded-b-md bg-gold" />
        <div className="h-7 w-1 rounded-full bg-gold/70" />
      </div>
    </div>
  );
}

export function Slide7() {
  const flies = useMemo(() => {
    const r = rng(55);
    return Array.from({ length: 30 }, () => ({
      left: r() * 100,
      top: r() * 100,
      s: 2 + r() * 3,
      fx: (r() - 0.5) * 100,
      fy: -20 - r() * 100,
      dur: 4 + r() * 5,
      del: r() * 4,
    }));
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_50%_80%,#3b2260_0%,#1a1038_55%,#0a0719_100%)]">
      <svg viewBox="0 0 200 200" className="spin-slow absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.12]" fill="none" stroke="#e3b04b">
        {Array.from({ length: 16 }).map((_, i) => (
          <path key={i} d="M100 100 C110 60 140 40 160 60 C175 76 160 96 148 88" strokeWidth="0.8" transform={`rotate(${i * 22.5} 100 100)`} />
        ))}
        <circle cx="100" cy="100" r="98" strokeWidth="0.6" />
        <circle cx="100" cy="100" r="40" strokeWidth="0.6" />
      </svg>
      {flies.map((f, i) => (
        <span key={i} className="firefly" style={vars({ left: `${f.left}%`, top: `${f.top}%`, width: f.s, height: f.s, '--fx': `${f.fx}px`, '--fy': `${f.fy}px`, animationDuration: `${f.dur}s`, animationDelay: `${f.del}s` })} />
      ))}
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col px-6 py-12 md:px-14">
        <Head n="07" kicker="Өсиет" title="Балаларыма өсиет" />
        <R d={0.5} className="max-w-2xl text-base leading-relaxed text-cream/85 md:text-xl">
          Бұл жыраудың соңғы толғауларының бірі, онда ол балаларын тірліктегі бірлікке, татулыққа, талап мұратқа шақырады
        </R>
        <R d={1.0} className="mt-4">
          <span className="hint-pulse inline-block rounded-full border border-gold/60 bg-gold/10 px-5 py-2 text-sm text-gold">Шамдарды басып көріңіз</span>
        </R>
        <div className="flex flex-1 items-center justify-around gap-2">
          <Lantern word="Бірлік" d={1.2} size={150} offset={0} freq={392} />
          <Lantern word="Татулық" d={2.6} size={175} offset={40} freq={493.9} />
          <Lantern word="Талап мұрат" d={4.0} size={150} offset={0} freq={587.3} />
        </div>
      </div>
    </div>
  );
}

/* 8 Елге еңбегі */
function Sprout({ x, y, s, d }: { x: number; y: number; s: number; d: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="grow" style={vars({ '--d': `${d}s` })}>
        <path d="M0 0 C0 -20 4 -35 0 -58" stroke="#2f8f4a" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M0 -34 C-24 -44 -30 -28 -22 -23 C-13 -20 -4 -26 0 -34Z" fill="#46b565" />
        <path d="M0 -44 C24 -54 30 -38 22 -33 C13 -30 4 -36 0 -44Z" fill="#5fcf7c" />
        <circle cx="0" cy="-60" r="4" fill="#ffd45a" />
      </g>
    </g>
  );
}

export function Slide8() {
  const cards = ['Елді ата қонысына орналастыруға атсалысты', 'Қазақтарға отырықшы өмірді үйретті', 'Арық қаздырды, тоған жасатты, егін егуге шақырды'];
  const sprouts = [120, 260, 410, 560, 700, 860, 1010, 1130];
  return (
    <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(180deg,#0f5a73_0%,#3fa7a0_45%,#bfe3b0_85%,#e9f0b4_100%)]">
      <svg viewBox="0 0 200 200" className="spin-slow absolute -right-10 -top-10 h-[34vmin] w-[34vmin]">
        {Array.from({ length: 14 }).map((_, i) => (
          <path key={i} d="M100 8 L106 40 L94 40 Z" fill="#fff0b0" opacity="0.8" transform={`rotate(${i * (360 / 14)} 100 100)`} />
        ))}
        <circle cx="100" cy="100" r="46" fill="#ffe27a" />
      </svg>
      {[0, 1, 2].map((i) => (
        <div key={i} className="bird-fly absolute" style={{ top: `${12 + i * 8}%`, animationDelay: `${i * 2.4}s`, animationDuration: `${12 + i * 3}s` }}>
          <svg width="32" height="16" viewBox="0 0 24 12" fill="none" stroke="#08323d" strokeWidth="1.8" strokeLinecap="round">
            <path d="M1 8 Q6 0 12 8 Q18 0 23 8" className="flap" style={{ animationDelay: `${i * 0.15}s` }} />
          </svg>
        </div>
      ))}
      <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-0 h-[38vh] w-full">
        <path d="M0 120 Q200 60 420 110 T820 100 T1200 90 L1200 300 L0 300Z" fill="#4c9a4a" />
        <path d="M0 160 Q260 120 520 160 T1200 150 L1200 300 L0 300Z" fill="#3a7d3d" />
        <path d="M-20 215 C150 190 300 245 500 215 S850 190 1000 225 S1150 215 1230 205" fill="none" stroke="#a9e6f2" strokeWidth="22" strokeLinecap="round" opacity="0.9" />
        <path d="M-20 215 C150 190 300 245 500 215 S850 190 1000 225 S1150 215 1230 205" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeDasharray="14 30" className="flow" />
        {sprouts.map((x, i) => (
          <Sprout key={x} x={x} y={188 + (i % 3) * 8} s={1.1 + (i % 2) * 0.3} d={1 + i * 0.4} />
        ))}
      </svg>
      <div className="relative z-10 mx-auto h-full max-w-6xl px-6 pb-[34vh] pt-12 md:px-14">
        <Head n="08" kicker="Елге еңбегі" title="Бейбіт өмір үшін" />
        <div className="grid gap-3 md:grid-cols-3 md:gap-5">
          {cards.map((c, i) => (
            <R key={c} d={0.6 + i * 0.35} kind="pop">
              <div className="tilt h-full rounded-2xl border border-white/30 bg-[#06323f]/70 p-4 text-base text-cream backdrop-blur-md md:p-6 md:text-xl">
                <div className="mb-2 font-serif text-3xl font-extrabold text-gold md:text-4xl">0{i + 1}</div>
                {c}
              </div>
            </R>
          ))}
        </div>
      </div>
    </div>
  );
}

/* 9 Мұрасы */
export function Slide9() {
  const n = useCount(350, 0, 2600, 0.8);
  const dip = [
    [0, 60],
    [55, 45],
    [105, 55],
    [160, 80],
    [150, 135],
    [235, 130],
    [250, 70],
  ];
  const path = 'M0 60 L55 45 L105 55 L160 80 L150 135 L235 130 L250 70 L160 80';
  return (
    <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(180deg,#04060f_0%,#0c1230_45%,#26214f_75%,#8a4a52_100%)]">
      <Stars count={110} seed={77} height={75} />
      <ShootingStars count={4} />
      {/* Жетіқарақшы */}
      <div className="absolute right-[6%] top-[8%] hidden w-[22vw] max-w-[300px] md:block">
        <svg viewBox="-20 20 300 150" className="w-full" fill="none">
          <path d={path} stroke="#e3b04b" strokeOpacity="0.7" strokeWidth="1.4" pathLength={1} className="draw" style={vars({ '--d': '0.4s' })} />
          {dip.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="5" fill="#fff0b8" className="twinkle" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </svg>
        <div className="text-center text-xs uppercase tracking-[0.4em] text-gold/70">Жетіқарақшы</div>
      </div>
      <div className="pulse-glow absolute -bottom-[30vh] left-1/2 h-[80vh] w-[80vh] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,200,120,0.55),transparent_65%)]" />
      <Mountains colors={['#1a1536', '#0a0a1c']} className="h-[26%]" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 pb-[8vh] text-center">
        <R d={0.2} className="mb-1 text-xs uppercase tracking-[0.4em] text-gold md:text-sm">
          09  Мұрасы
        </R>
        <R d={0.5} className="flex items-end justify-center gap-3">
          <span className="shine-text font-serif text-[clamp(4.5rem,16vw,12rem)] font-extrabold leading-none">{n}</span>
          <span className="pb-2 font-serif text-[clamp(1.5rem,4.5vw,3.5rem)] font-bold text-cream md:pb-6">жыл</span>
        </R>
        <R d={1.4} className="max-w-3xl text-base leading-relaxed text-cream/90 md:text-2xl">
          2025 жылы Ақтамберді жырау туғанына 350 жыл толды, оның сөзі бүгін де ұрпаққа өсиет болып тұр
        </R>
        <div className="my-4 w-44 md:w-60">
          <Horn d={2.2} />
        </div>
        <R d={2.6}>
          <div className="font-serif text-[clamp(1.8rem,5vw,3.8rem)] font-extrabold text-cream">Назарларыңызға рахмет</div>
        </R>
        <R d={3.2} className="mt-4 rounded-2xl border border-gold/30 bg-ink/50 px-6 py-3 backdrop-blur-md">
          <div className="flex flex-col items-center gap-1 font-serif text-base font-bold text-cream sm:flex-row sm:gap-5 md:text-xl">
            <span>Бауржан Ерасыл</span>
            <span className="hidden h-2 w-2 rotate-45 bg-gold sm:block" />
            <span>Байменов Мансур</span>
          </div>
        </R>
      </div>
    </div>
  );
}
