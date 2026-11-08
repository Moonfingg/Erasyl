import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react';
import { engine } from './audio';
import { Dust, Frame, burst } from './fx';
import { Slide1, Slide2, Slide3, Slide4, Slide5 } from './slidesA';
import { Slide6, Slide7, Slide8, Slide9 } from './slidesB';
import { Horn, Stars, vars } from './ui';

const SLIDES: ComponentType[] = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7, Slide8, Slide9];
const TITLES = ['Кіріспе', 'Ол кім', 'Жастық шағы', 'Жыраулық өнер', 'Соғыс', 'Ақтабан шұбырынды', 'Өсиет', 'Елге еңбегі', 'Мұрасы'];
const DURATION = 1200;

export default function App() {
  const [started, setStarted] = useState(false);
  const [hideIntro, setHideIntro] = useState(false);
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [origin, setOrigin] = useState<[string, string]>(['50%', '50%']);
  const [muted, setMuted] = useState(false);
  const curRef = useRef(0);
  const lockRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (n: number) => {
      if (!started || lockRef.current || n < 0 || n >= SLIDES.length || n === curRef.current) return;
      lockRef.current = true;
      const fwd = n > curRef.current;
      const o: [string, string] = fwd ? ['88%', '92%'] : ['12%', '92%'];
      setOrigin(o);
      setPrev(curRef.current);
      curRef.current = n;
      setCur(n);
      engine.play(n);
      burst(window.innerWidth * parseFloat(o[0]) / 100, window.innerHeight * parseFloat(o[1]) / 100, 36, '#ffd98a', 1.3);
      window.setTimeout(() => {
        setPrev(null);
        lockRef.current = false;
      }, DURATION);
    },
    [started],
  );

  const start = (e: React.MouseEvent) => {
    engine.init();
    engine.setMuted(false);
    setStarted(true);
    engine.play(0);
    burst(e.clientX, e.clientY, 60, '#ffd98a', 1.6);
    window.setTimeout(() => setHideIntro(true), 1300);
  };

  const toggleFull = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) {
        e.preventDefault();
        go(curRef.current + 1);
      } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        go(curRef.current - 1);
      } else if (e.key === 'Home') {
        go(0);
      } else if (e.key === 'End') {
        go(SLIDES.length - 1);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFull();
      }
    };

    // Тінтуір дөңгелегі: бір қозғалыс бір слайд
    let wheelAt = 0;
    const onWheel = (e: WheelEvent) => {
      const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(d) < 24) return;
      const now = performance.now();
      if (now - wheelAt < 1500) return;
      wheelAt = now;
      go(curRef.current + (d > 0 ? 1 : -1));
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('wheel', onWheel);
    };
  }, [go]);

  // Тереңдік пен карточкалардың еңкеюі
  useEffect(() => {
    const el = rootRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    let tiltEl: HTMLElement | null = null;

    const loop = () => {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      el.style.setProperty('--mx', x.toFixed(3));
      el.style.setProperty('--my', y.toFixed(3));
      raf = Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001 ? requestAnimationFrame(loop) : 0;
    };

    const resetTilt = (t: HTMLElement) => {
      t.style.setProperty('--rx', '0deg');
      t.style.setProperty('--ry', '0deg');
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(loop);

      const t = (e.target as Element | null)?.closest?.('.tilt') as HTMLElement | null;
      if (tiltEl && tiltEl !== t) resetTilt(tiltEl);
      tiltEl = t;
      if (t) {
        const r = t.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        t.style.setProperty('--rx', `${((0.5 - py) * 8).toFixed(2)}deg`);
        t.style.setProperty('--ry', `${((px - 0.5) * 10).toFixed(2)}deg`);
        t.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
        t.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
      }
    };

    window.addEventListener('pointermove', move);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
    };
  }, []);

  const touch = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touch.current === null) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    touch.current = null;
    if (Math.abs(dx) > 60) go(curRef.current + (dx < 0 ? 1 : -1));
  };

  const toggleMute = () => {
    const m = !muted;
    setMuted(m);
    engine.setMuted(m);
  };

  const Cur = SLIDES[cur];
  const Prev = prev !== null ? SLIDES[prev] : null;
  const btn =
    'grid h-10 w-10 place-items-center rounded-full border border-cream/25 bg-ink/60 text-cream backdrop-blur-md transition duration-300 hover:scale-110 hover:border-gold hover:text-gold active:scale-95 disabled:opacity-30 disabled:hover:scale-100 disabled:hover:border-cream/25 disabled:hover:text-cream';

  return (
    <div ref={rootRef} className="relative h-full w-full overflow-hidden bg-ink" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {started && (
        <>
          {Prev && (
            <div key={`p${prev}`} className="exit absolute inset-0 z-10">
              <Prev />
            </div>
          )}
          <div key={`c${cur}`} className={`${prev !== null ? 'enter' : ''} absolute inset-0 z-20`} style={vars({ '--ox': origin[0], '--oy': origin[1] })}>
            <Cur />
          </div>
          {prev !== null && <div key={`r${cur}`} className="reveal-ring" style={vars({ '--ox': origin[0], '--oy': origin[1] })} />}

          {/* Кинолық қабаттар */}
          <div className="vignette pointer-events-none absolute inset-0 z-[31]" />
          <div className="grain pointer-events-none absolute inset-0 z-[31]" />
          <Frame />

          {/* Прогресс */}
          <div className="absolute inset-x-0 top-0 z-40 h-[3px] bg-cream/10">
            <div
              className="h-full origin-left bg-gradient-to-r from-[#b9812a] via-[#ffe39a] to-gold shadow-[0_0_14px_rgba(227,176,75,0.8)]"
              style={{ transform: `scaleX(${(cur + 1) / SLIDES.length})`, transition: 'transform 1.2s cubic-bezier(0.65, 0, 0.2, 1)' }}
            />
          </div>

          {/* Басқару */}
          <div className="absolute inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 px-4 pb-4 md:px-8">
            <div className="flex items-center gap-2">
              <button className={btn} onClick={() => go(cur - 1)} disabled={cur === 0} aria-label="Алдыңғы">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 5 L8 12 L15 19" />
                </svg>
              </button>
              <button className={btn} onClick={() => go(cur + 1)} disabled={cur === SLIDES.length - 1} aria-label="Келесі">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5 L16 12 L9 19" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-2">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    aria-label={TITLES[i]}
                    title={TITLES[i]}
                    className={`h-2 rounded-full transition-all duration-700 ease-[cubic-bezier(0.65,0,0.2,1)] ${
                      i === cur ? 'w-8 bg-gold shadow-[0_0_12px_rgba(227,176,75,0.9)]' : i < cur ? 'w-2 bg-gold/55 hover:bg-gold' : 'w-2 bg-cream/35 hover:bg-cream/80'
                    }`}
                  />
                ))}
              </div>
              <div key={cur} className="label-in hidden text-[0.65rem] uppercase tracking-[0.3em] text-cream/65 sm:block">
                {String(cur + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}  {TITLES[cur]}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className={btn} onClick={() => engine.play(cur)} aria-label="Дыбысты қайта ойнату" title="Дыбысты қайта ойнату">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 3-6.7" />
                  <path d="M3 4v5h5" />
                </svg>
              </button>
              <button className={btn} onClick={toggleMute} aria-label="Дыбыс" title="Дыбыс">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" />
                  {muted ? <path d="M17 9 L22 15 M22 9 L17 15" /> : <path d="M16.5 8.5 Q19 12 16.5 15.5 M19 6 Q23 12 19 18" />}
                </svg>
              </button>
              <button className={`${btn} hidden sm:grid`} onClick={toggleFull} aria-label="Толық экран" title="Толық экран">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 9 V4 H9 M15 4 H20 V9 M20 15 V20 H15 M9 20 H4 V15" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Алтын тозаң */}
      <Dust />

      {/* Бастау экраны */}
      {!hideIntro && (
        <div
          className={`absolute inset-0 z-50 grid place-items-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_40%,#1a2352_0%,#090e1d_70%)] transition-all duration-[1200ms] ease-[cubic-bezier(0.65,0,0.2,1)] ${
            started ? 'pointer-events-none scale-125 opacity-0 blur-sm' : ''
          }`}
        >
          <Stars count={80} seed={5} height={100} />
          <div className="relative flex flex-col items-center px-6 text-center">
            <div className="spin-slow absolute -z-0 h-[70vmin] w-[70vmin] opacity-30">
              <svg viewBox="0 0 200 200" className="h-full w-full" fill="none" stroke="#e3b04b">
                <circle cx="100" cy="100" r="96" strokeWidth="0.6" strokeDasharray="2 6" />
                <circle cx="100" cy="100" r="70" strokeWidth="0.6" />
              </svg>
            </div>
            <div className="spin-rev absolute -z-0 h-[52vmin] w-[52vmin] opacity-25">
              <svg viewBox="0 0 200 200" className="h-full w-full" fill="none" stroke="#e3b04b">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ellipse key={i} cx="100" cy="100" rx="92" ry="30" transform={`rotate(${i * 22.5} 100 100)`} strokeWidth="0.6" />
                ))}
              </svg>
            </div>
            <div className="par-3 relative z-10 flex flex-col items-center">
              <div className="rise mb-3 text-xs uppercase tracking-[0.5em] text-gold" style={vars({ '--d': '0.1s' })}>
                Презентация
              </div>
              <h1 className="font-serif text-[clamp(2.4rem,8vw,6rem)] font-extrabold leading-none text-cream" style={{ perspective: 600 }}>
                {['Ақтамберді', 'жырау'].map((w, wi) => (
                  <span key={w} className="mx-[0.14em] inline-block whitespace-nowrap">
                    {w.split('').map((c, i) => (
                      <span key={i} className="letter" style={vars({ '--d': `${0.3 + (wi * 10 + i) * 0.06}s` })}>
                        {c}
                      </span>
                    ))}
                  </span>
                ))}
              </h1>
              <div className="my-5 w-48">
                <Horn d={1.2} />
              </div>
              <button
                onClick={start}
                className="rise hint-pulse shimmer group relative rounded-full border border-gold bg-gold/10 px-10 py-4 font-serif text-xl font-bold text-gold transition duration-300 hover:scale-105 hover:bg-gold hover:text-ink"
                style={vars({ '--d': '1.5s' })}
              >
                Бастау
              </button>
              <div className="rise mt-5 max-w-xs text-sm text-cream/55" style={vars({ '--d': '1.8s' })}>
                Әр слайдтың өз дыбысы бар, дыбысты қосып көріңіз
              </div>
              <div className="rise mt-2 text-xs text-cream/40" style={vars({ '--d': '2s' })}>
                Бағыт пернелері, тінтуір дөңгелегі немесе жанындағы түймелер арқылы ауысыңыз
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
