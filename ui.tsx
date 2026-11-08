import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';

export const vars = (v: Record<string, string | number>) => v as CSSProperties;

export function rng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function Stars({ count = 60, seed = 1, height = 70 }: { count?: number; seed?: number; height?: number }) {
  const items = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: count }, () => ({
      x: r() * 100,
      y: r() * height,
      s: r() * 2.2 + 0.8,
      d: r() * 4,
      t: 2 + r() * 3,
    }));
  }, [count, seed, height]);
  return (
    <div className="par-1 absolute inset-0 pointer-events-none">
      {items.map((s, i) => (
        <span
          key={i}
          className="twinkle absolute rounded-full bg-cream"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.s,
            height: s.s,
            animationDelay: `${s.d}s`,
            animationDuration: `${s.t}s`,
          }}
        />
      ))}
    </div>
  );
}

export function ShootingStars({ count = 3 }: { count?: number }) {
  const items = useMemo(() => {
    const r = rng(count * 13 + 5);
    return Array.from({ length: count }, (_, i) => ({
      top: 4 + r() * 28,
      left: r() * 55,
      del: 2 + i * 3.2 + r() * 2,
      dur: 7 + r() * 5,
    }));
  }, [count]);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((s, i) => (
        <span key={i} className="shoot" style={{ top: `${s.top}%`, left: `${s.left}%`, animationDelay: `${s.del}s`, animationDuration: `${s.dur}s` }} />
      ))}
    </div>
  );
}

export function R({
  d = 0,
  className = '',
  children,
  kind = 'rise',
}: {
  d?: number;
  className?: string;
  children: ReactNode;
  kind?: 'rise' | 'pop' | 'slide-in-left' | 'slide-in-right';
}) {
  return (
    <div className={`${kind} ${className}`} style={vars({ '--d': `${d}s` })}>
      {children}
    </div>
  );
}

export function Head({ n, kicker, title, d = 0 }: { n: string; kicker: string; title: string; d?: number }) {
  return (
    <div className="mb-5 md:mb-7">
      <R d={d} className="mb-2 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gold md:text-sm">
        <span className="font-serif text-2xl tracking-normal md:text-3xl">{n}</span>
        <span className="h-px w-10 bg-gold/70" />
        <span>{kicker}</span>
      </R>
      <R d={d + 0.15}>
        <h2 className="font-serif text-[clamp(2rem,5vw,4.1rem)] font-bold leading-[1.05] text-cream">{title}</h2>
      </R>
    </div>
  );
}

// Қошқар мүйіз өрнегі
export function Horn({ className = '', d = 0 }: { className?: string; d?: number }) {
  const p = 'M60 20 C52 4 30 2 22 14 C14 26 28 36 36 28 C43 21 34 12 29 17';
  return (
    <svg viewBox="0 0 120 40" className={className} fill="none" stroke="#e3b04b" strokeWidth="2.5" strokeLinecap="round">
      <path d={p} pathLength={1} className="draw" style={vars({ '--d': `${d}s` })} />
      <g transform="translate(120 0) scale(-1 1)">
        <path d={p} pathLength={1} className="draw" style={vars({ '--d': `${d}s` })} />
      </g>
      <path d="M60 14 L66 20 L60 26 L54 20 Z" fill="#e3b04b" stroke="none" />
    </svg>
  );
}

export function useCount(to: number, from: number, ms: number, delay = 0) {
  const [v, setV] = useState(from);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now() + delay * 1000;
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - t0) / ms));
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(from + (to - from) * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, from, ms, delay]);
  return v;
}

export function Mountains({ colors = ['#1b2447', '#101733'], className = '' }: { colors?: [string, string] | string[]; className?: string }) {
  return (
    <div className={`par-2 pointer-events-none absolute inset-x-0 bottom-0 ${className}`}>
      <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="mount-drift-1 absolute bottom-0 h-full w-[106%] -left-[3%]">
        <path
          d="M0 220 L120 150 L210 190 L330 90 L450 180 L560 120 L700 210 L820 100 L940 170 L1060 80 L1180 170 L1300 120 L1440 190 L1440 320 L0 320Z"
          fill={colors[0]}
        />
      </svg>
      <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="mount-drift-2 absolute bottom-0 h-[72%] w-[106%] -left-[3%]">
        <path
          d="M0 250 L90 200 L200 240 L340 160 L470 235 L610 175 L760 245 L900 170 L1040 240 L1190 180 L1320 235 L1440 200 L1440 320 L0 320Z"
          fill={colors[1]}
        />
      </svg>
    </div>
  );
}
