import { useEffect, useRef } from 'react';

/* Алтын тозаң: курсордың ізі және басқан жердегі ұшқындар */

type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number; c: string };

let spawn: ((x: number, y: number, n: number, c: string, power: number) => void) | null = null;

export function burst(x: number, y: number, n = 24, c = '#ffd98a', power = 1) {
  spawn?.(x, y, n, c, power);
}

export function Dust() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ps: P[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let lx = -1;
    let ly = -1;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const tick = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      ctx.clearRect(0, 0, w, h);
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.life += dt;
        if (p.life >= p.max) {
          ps.splice(i, 1);
          continue;
        }
        const k = 1 - p.life / p.max;
        p.vx *= 0.985;
        p.vy = p.vy * 0.985 + 0.012 * (dt / 16);
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        ctx.globalAlpha = k * k;
        ctx.fillStyle = p.c;
        ctx.shadowColor = p.c;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (0.4 + k), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = ps.length ? requestAnimationFrame(tick) : 0;
      if (!ps.length) ctx.clearRect(0, 0, w, h);
    };

    const kick = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const add = (x: number, y: number, n: number, c: string, power: number) => {
      if (reduce) return;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = (0.4 + Math.random() * 2.4) * power;
        ps.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.3 * power, life: 0, max: 700 + Math.random() * 900, r: 1 + Math.random() * 2.2, c });
      }
      if (ps.length > 260) ps.splice(0, ps.length - 260);
      kick();
    };

    const move = (e: PointerEvent) => {
      if (reduce || e.pointerType === 'touch') return;
      if (lx < 0) {
        lx = e.clientX;
        ly = e.clientY;
        return;
      }
      if (Math.hypot(e.clientX - lx, e.clientY - ly) > 16) {
        lx = e.clientX;
        ly = e.clientY;
        add(e.clientX, e.clientY, 1, '#f3cf85', 0.3);
      }
    };

    resize();
    spawn = add;
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', move);
    return () => {
      spawn = null;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', move);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 z-[32] h-full w-full" aria-hidden />;
}

/* Қазақ өрнекті жиек пен бұрыштар */
function Corner({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 60 60" className={`absolute h-10 w-10 text-gold/70 md:h-14 md:w-14 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M2 58 V14 Q2 2 14 2 H58" />
      <path d="M12 48 V22 Q12 12 22 12 H48" strokeOpacity="0.45" />
      <path d="M22 22 Q31 19 31 28 Q31 35 24 34" />
      <circle cx="6" cy="6" r="1.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Frame() {
  return (
    <div className="pointer-events-none absolute inset-2 z-30 md:inset-4">
      <div className="absolute inset-0 rounded-[3px] border border-gold/15" />
      <Corner className="left-0 top-0" />
      <Corner className="right-0 top-0 rotate-90" />
      <Corner className="bottom-0 right-0 rotate-180" />
      <Corner className="bottom-0 left-0 -rotate-90" />
    </div>
  );
}
