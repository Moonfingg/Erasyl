// Әр слайдқа арналған жеке дыбыстар, барлығы Web Audio арқылы қолдан жасалады
// Фондық музыка жоқ, дыбыс тек слайд ашылғанда ойнайды

type NoiseOpts = {
  type?: BiquadFilterType;
  f?: number;
  to?: number;
  q?: number;
  vol?: number;
  a?: number;
  r?: number;
};

type ToneOpts = {
  f: number;
  to?: number;
  type?: OscillatorType;
  vol?: number;
  a?: number;
  r?: number;
  vib?: number;
  vr?: number;
  lp?: number;
};

type Sfx = (e: Engine, out: GainNode, t: number) => void;

class Engine {
  ctx: AudioContext | null = null;
  master: GainNode | null = null;
  live: GainNode | null = null;
  noiseBuf: AudioBuffer | null = null;
  bus: GainNode | null = null;
  muted = false;
  cache = new Map<number, AudioBuffer>();

  init() {
    if (this.ctx) {
      void this.ctx.resume();
      return;
    }
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    const master = ctx.createGain();
    master.gain.value = this.muted ? 0 : 0.8;
    master.connect(comp);
    comp.connect(ctx.destination);
    const len = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const live = ctx.createGain();
    live.connect(master);
    this.ctx = ctx;
    this.master = master;
    this.noiseBuf = buf;
    this.live = live;
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.ctx && this.master) {
      this.master.gain.setTargetAtTime(m ? 0 : 0.8, this.ctx.currentTime, 0.05);
    }
  }

  stop() {
    const ctx = this.ctx;
    const b = this.bus;
    if (!ctx || !b) return;
    b.gain.cancelScheduledValues(ctx.currentTime);
    b.gain.setTargetAtTime(0, ctx.currentTime, 0.12);
    window.setTimeout(() => {
      try {
        b.disconnect();
      } catch {
        /* ештеңе */
      }
    }, 1200);
    this.bus = null;
  }

  play(i: number) {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    void ctx.resume();
    this.stop();
    const bus = ctx.createGain();
    bus.gain.value = 1;
    bus.connect(this.master);
    this.bus = bus;
    SFX[i]?.(this, bus, ctx.currentTime + 0.05);
  }

  // Қолмен басқанда ойнайтын дыбыстар
  note(f: number) {
    if (!this.ctx || !this.live) return;
    void this.ctx.resume();
    this.pluck(this.live, this.ctx.currentTime, f, 0.55);
  }

  hit() {
    if (!this.ctx || !this.live) return;
    void this.ctx.resume();
    this.clash(this.live, this.ctx.currentTime, 0.6);
  }

  // Негізгі дыбыс бөліктері

  noise(out: AudioNode, t: number, dur: number, o: NoiseOpts = {}) {
    const ctx = this.ctx!;
    const s = ctx.createBufferSource();
    s.buffer = this.noiseBuf;
    s.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = o.type ?? 'bandpass';
    f.frequency.setValueAtTime(o.f ?? 1000, t);
    if (o.to) f.frequency.exponentialRampToValueAtTime(o.to, t + dur);
    f.Q.value = o.q ?? 1;
    const g = ctx.createGain();
    const v = o.vol ?? 0.3;
    const a = Math.min(o.a ?? 0.01, dur * 0.5);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(v, t + a);
    if (o.r) {
      g.gain.setValueAtTime(v, t + Math.max(a, dur - o.r));
      g.gain.linearRampToValueAtTime(0.0001, t + dur);
    } else {
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    }
    s.connect(f);
    f.connect(g);
    g.connect(out);
    s.start(t, Math.random() * 2);
    s.stop(t + dur + 0.05);
  }

  tone(out: AudioNode, t: number, dur: number, o: ToneOpts) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.type = o.type ?? 'sine';
    osc.frequency.setValueAtTime(o.f, t);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + dur);
    const g = ctx.createGain();
    const v = o.vol ?? 0.2;
    const a = Math.min(o.a ?? 0.01, dur * 0.5);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(v, t + a);
    if (o.r) {
      g.gain.setValueAtTime(v, t + Math.max(a, dur - o.r));
      g.gain.linearRampToValueAtTime(0.0001, t + dur);
    } else {
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    }
    let last: AudioNode = osc;
    if (o.lp) {
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = o.lp;
      lp.Q.value = 1.2;
      osc.connect(lp);
      last = lp;
    }
    last.connect(g);
    g.connect(out);
    if (o.vib) {
      const lfo = ctx.createOscillator();
      lfo.frequency.value = o.vr ?? 5.5;
      const lg = ctx.createGain();
      lg.gain.value = o.f * o.vib;
      lfo.connect(lg);
      lg.connect(osc.frequency);
      lfo.start(t);
      lfo.stop(t + dur + 0.05);
    }
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  // Домбыра ішегі, Карплус Стронг әдісімен
  ks(freq: number) {
    const key = Math.round(freq);
    const hit = this.cache.get(key);
    if (hit) return hit;
    const ctx = this.ctx!;
    const sr = ctx.sampleRate;
    const n = Math.floor(sr * 2.4);
    const buf = ctx.createBuffer(1, n, sr);
    const d = buf.getChannelData(0);
    const p = Math.max(2, Math.round(sr / key));
    let prev = 0;
    for (let i = 0; i < p; i++) {
      const x = Math.random() * 2 - 1;
      prev = prev * 0.82 + x * 0.18;
      d[i] = prev;
    }
    for (let i = p; i < n; i++) {
      d[i] = 0.5 * (d[i - p] + d[i - p + 1]) * 0.9991;
    }
    const fade = 3000;
    for (let i = 0; i < fade; i++) d[n - 1 - i] *= i / fade;
    this.cache.set(key, buf);
    return buf;
  }

  pluck(out: AudioNode, t: number, f: number, vol = 0.5) {
    const ctx = this.ctx!;
    const s = ctx.createBufferSource();
    s.buffer = this.ks(f);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1700;
    lp.Q.value = 0.5;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol * 0.75, t + 0.015);
    s.connect(lp);
    lp.connect(g);
    g.connect(out);
    s.start(t);
  }

  // Жұмсақ төмен соққы, жүрек соғуына ұқсас
  kick(out: AudioNode, t: number, vol = 0.3, f0 = 90, f1 = 55, dur = 0.7) {
    this.tone(out, t, dur, { f: f0, to: f1, vol, a: 0.04, lp: 400 });
  }

  drum(out: AudioNode, t: number, vol = 0.3, f0 = 90, f1 = 55, dur = 0.8) {
    this.kick(out, t, vol, f0, f1, dur);
  }

  // Жұмсақ тұяқ дүбірі
  hoof(out: AudioNode, t: number, vol = 0.4) {
    this.noise(out, t, 0.12, { type: 'lowpass', f: 520, q: 0.5, vol: vol * 0.25, a: 0.02 });
    this.tone(out, t, 0.14, { f: 150, to: 95, vol: vol * 0.22, a: 0.012, lp: 380 });
  }

  // Жұмсақ шыны қоңыраудай үн
  clash(out: AudioNode, t: number, vol = 0.5) {
    this.tone(out, t, 1.8, { f: 1318.5, vol: vol * 0.1, a: 0.02, lp: 3000 });
    this.tone(out, t + 0.12, 1.8, { f: 1760, vol: vol * 0.07, a: 0.02, lp: 3000 });
    this.tone(out, t + 0.24, 2.2, { f: 2637, vol: vol * 0.035, a: 0.03, lp: 3500 });
  }

  chime(out: AudioNode, t: number, f: number, vol = 0.2) {
    const parts = [1, 2, 3];
    const amps = [1, 0.22, 0.07];
    const durs = [3.4, 2.4, 1.6];
    parts.forEach((p, i) => {
      this.tone(out, t, durs[i], { f: f * p, vol: vol * 0.6 * amps[i], a: 0.03, lp: 3500 });
    });
  }

  // Жұмсақ ұзақ үн
  pad(out: AudioNode, t: number, dur: number, f: number, vol = 0.05) {
    const a = Math.min(2, dur * 0.4);
    this.tone(out, t, dur, { f, type: 'sine', vol, a, r: a, vib: 0.002, vr: 4.2 });
    this.tone(out, t, dur, { f: f * 1.004, type: 'triangle', vol: vol * 0.5, a, r: a, lp: 700 });
  }

  // Ай сыбызғы тәрізді нәзік дауыс
  flute(out: AudioNode, t: number, dur: number, f: number, vol = 0.07, to?: number) {
    this.tone(out, t, dur, { f, to, type: 'sine', vol, a: 0.35, r: Math.min(1.2, dur * 0.5), vib: 0.004, vr: 5 });
    this.tone(out, t, dur, { f: f * 2, to: to ? to * 2 : undefined, type: 'sine', vol: vol * 0.12, a: 0.4, r: Math.min(1.2, dur * 0.5) });
  }

  // Желдің сыбдыры
  breeze(out: AudioNode, t: number, dur: number, vol = 0.08, f = 500) {
    this.noise(out, t, dur, { type: 'lowpass', f, to: f * 1.6, q: 0.4, vol, a: dur * 0.4, r: dur * 0.4 });
  }

  bird(out: AudioNode, t: number, vol = 0.02) {
    for (let i = 0; i < 3; i++) {
      this.tone(out, t + i * 0.2, 0.18, { f: 1900 + i * 120, to: 2500, vol, a: 0.04, lp: 3000 });
    }
  }
}

const NOTE = {
  D3: 146.8,
  G3: 196,
  A3: 220,
  B3: 246.9,
  D4: 293.7,
  E4: 329.6,
  G4: 392,
  A4: 440,
  B4: 493.9,
  D5: 587.3,
};

const SFX: Sfx[] = [
  // 1 Кіріспе: жұмсақ үн, домбыра
  (e, o, t) => {
    e.pad(o, t, 5, NOTE.D3, 0.06);
    e.pad(o, t + 0.3, 4.6, NOTE.A3, 0.035);
    e.drum(o, t, 0.3);
    [NOTE.D3, NOTE.G3, NOTE.D4].forEach((f, i) => e.pluck(o, t + 0.5 + i * 0.09, f, 0.3));
    const mel: [number, number][] = [
      [NOTE.A4, 1.5],
      [NOTE.G4, 2.0],
      [NOTE.E4, 2.5],
      [NOTE.D4, 3.0],
      [NOTE.A4, 3.6],
      [NOTE.D5, 4.1],
    ];
    mel.forEach(([f, d]) => e.pluck(o, t + d, f, 0.26));
    e.chime(o, t + 4.1, 1174, 0.08);
  },
  // 2 Ол кім: ақырын жел, алыстан сыбызғы
  (e, o, t) => {
    e.breeze(o, t, 7, 0.12, 380);
    e.pad(o, t, 6.5, 98, 0.05);
    e.flute(o, t + 1.4, 2.2, NOTE.D5, 0.05, NOTE.A4 * 1.02);
    e.flute(o, t + 3.9, 2.4, NOTE.A4, 0.045, NOTE.E4);
    e.pluck(o, t + 5.2, NOTE.D4, 0.22);
    e.pluck(o, t + 5.8, NOTE.G3, 0.22);
  },
  // 3 Жастық шағы: алыстағы тұяқ дүбірі
  (e, o, t) => {
    const cycle = 0.5;
    const total = 13;
    for (let c = 0; c < total; c++) {
      const grow = Math.min(1, 0.25 + c * 0.08);
      const away = c > 10 ? (total - c) / 3 : 1;
      [0, 0.12, 0.25].forEach((d, k) => e.hoof(o, t + c * cycle + d, grow * away * (k === 2 ? 0.9 : 0.65)));
    }
    e.breeze(o, t, 7, 0.08, 450);
    e.pad(o, t, 6.5, NOTE.G3, 0.04);
    e.flute(o, t + 2.4, 2.4, NOTE.G4, 0.04, NOTE.D4 * 1.5);
  },
  // 4 Жыраулық өнер: баяу домбыра күйі
  (e, o, t) => {
    const k = 1.3;
    for (let n = 0; n < 16; n++) e.pluck(o, t + n * 0.65, n % 2 ? NOTE.G3 : NOTE.D3, 0.3);
    const m: [number, number][] = [
      [NOTE.D4, 0],
      [NOTE.E4, 0.25],
      [NOTE.G4, 0.5],
      [NOTE.A4, 0.75],
      [NOTE.G4, 1.0],
      [NOTE.E4, 1.25],
      [NOTE.D4, 1.5],
      [NOTE.E4, 1.75],
      [NOTE.G4, 2.0],
      [NOTE.G4, 2.25],
      [NOTE.A4, 2.5],
      [NOTE.D5, 2.75],
      [NOTE.A4, 3.0],
      [NOTE.G4, 3.25],
      [NOTE.E4, 3.5],
      [NOTE.D4, 3.75],
    ];
    m.forEach(([f, d]) => e.pluck(o, t + d * k, f, 0.26));
    m.forEach(([f, d]) => e.pluck(o, t + (4 + d) * k, f, 0.26));
    [NOTE.D3, NOTE.A3, NOTE.D4, NOTE.G4].forEach((f, i) => e.pluck(o, t + 8 * k + i * 0.1, f, 0.3));
  },
  // 5 Соғыс: баяу тынық соққылар және қоңыраулар
  (e, o, t) => {
    for (let n = 0; n < 8; n++) e.drum(o, t + n * 0.9, n % 2 ? 0.2 : 0.3);
    e.pad(o, t, 4, 110, 0.05);
    e.pad(o, t + 3, 4.2, 98, 0.05);
    [0.9, 2.7, 4.5].forEach((d) => e.clash(o, t + d, 0.5));
    e.flute(o, t + 1.2, 2.6, NOTE.A4, 0.04, NOTE.G4);
    e.flute(o, t + 4, 2.4, NOTE.D5, 0.04, NOTE.A4);
  },
  // 6 Ақтабан шұбырынды: мұңды, баяу үн
  (e, o, t) => {
    e.pad(o, t, 8, 55, 0.07);
    e.pad(o, t + 0.4, 7.4, NOTE.A3, 0.04);
    e.pad(o, t + 0.8, 7, 261.6, 0.025);
    e.breeze(o, t, 8, 0.1, 260);
    e.flute(o, t + 1.5, 3, 466, 0.045, 349);
    e.flute(o, t + 4.6, 3.2, 392, 0.04, 294);
    [0.4, 3.2, 6].forEach((d) => e.kick(o, t + d, 0.15, 70, 45, 0.9));
  },
  // 7 Өсиет: тыныш үн және үш қоңырау
  (e, o, t) => {
    e.pad(o, t, 7.5, 98, 0.06);
    e.pad(o, t + 0.5, 7, 147, 0.035);
    e.flute(o, t + 0.3, 2.2, NOTE.G3 * 2, 0.04);
    e.flute(o, t + 2.5, 2, NOTE.A3 * 2, 0.04, NOTE.G3 * 2);
    e.flute(o, t + 4.4, 3, NOTE.D4 * 1.5, 0.04, NOTE.A3 * 2);
    [1.4, 2.8, 4.2].forEach((d, i) => e.chime(o, t + d + 0.6, 660 + i * 110, 0.17));
  },
  // 8 Елге еңбегі: бұлақ, құс, домбыра
  (e, o, t) => {
    e.noise(o, t, 8, { type: 'bandpass', f: 1800, q: 0.6, vol: 0.035, a: 1.5, r: 3 });
    e.noise(o, t, 8, { type: 'lowpass', f: 600, q: 0.5, vol: 0.07, a: 1.5, r: 3 });
    for (let i = 0; i < 20; i++) {
      const d = Math.random() * 6.5;
      const f = 500 + Math.random() * 600;
      e.tone(o, t + d, 0.16, { f, to: f * 1.5, vol: 0.016, a: 0.03, lp: 2500 });
    }
    [0.9, 3.6, 5.9].forEach((d) => e.bird(o, t + d, 0.02));
    [NOTE.D4, NOTE.E4, NOTE.G4, NOTE.A4, NOTE.D5, NOTE.A4].forEach((f, i) => e.pluck(o, t + 1.2 + i * 0.55, f, 0.26));
  },
  // 9 Мұра: нәзік қоңыраулар және таң шапағы
  (e, o, t) => {
    const scale = [NOTE.D4, NOTE.E4, NOTE.G4, NOTE.A4, NOTE.D5, NOTE.E4 * 2, NOTE.G4 * 2];
    scale.forEach((f, i) => e.chime(o, t + i * 0.5, f, 0.15));
    e.pad(o, t + 1, 6.5, NOTE.D3, 0.06);
    e.pad(o, t + 1.4, 6, NOTE.A3, 0.035);
    [NOTE.D3, NOTE.A3, NOTE.D4, NOTE.G4, NOTE.A4].forEach((f, i) => e.pluck(o, t + 3.8 + i * 0.1, f, 0.3));
    e.chime(o, t + 5, 1174, 0.09);
    e.chime(o, t + 6, 880, 0.07);
  },
];

export const engine = new Engine();
