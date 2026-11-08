// Процедурный амбиент: тёплый дрон-пад, ветер и мягкие «колокольчики» — без единого аудиофайла.
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let bus: GainNode | null = null;
let want = true;

export function startAudio(on = true) {
  want = on;
  if (ctx) {
    ctx.resume();
    setSound(on);
    return;
  }
  const AC = window.AudioContext || (window as any).webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  bus = ctx.createGain();
  bus.gain.value = 1;
  bus.connect(master);

  // «пещерное» эхо
  const delay = ctx.createDelay(2);
  delay.delayTime.value = 0.52;
  const fb = ctx.createGain();
  fb.gain.value = 0.48;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 1600;
  bus.connect(delay);
  delay.connect(lp);
  lp.connect(fb);
  fb.connect(delay);
  lp.connect(master);

  // пад: D-мажор add9
  const freqs = [73.42, 110, 146.83, 185, 220, 293.66, 329.63, 440];
  freqs.forEach((f, i) => {
    const o = ctx!.createOscillator();
    o.type = i % 3 === 0 ? "triangle" : "sine";
    o.frequency.value = f;
    o.detune.value = (Math.random() - 0.5) * 14;
    const g = ctx!.createGain();
    g.gain.value = 0.045 / (1 + i * 0.25);
    const filt = ctx!.createBiquadFilter();
    filt.type = "lowpass";
    filt.frequency.value = 900;
    const lfo = ctx!.createOscillator();
    lfo.frequency.value = 0.03 + Math.random() * 0.07;
    const lg = ctx!.createGain();
    lg.gain.value = g.gain.value * 0.8;
    lfo.connect(lg);
    lg.connect(g.gain);
    o.connect(filt);
    filt.connect(g);
    g.connect(bus!);
    o.start();
    lfo.start();
  });

  // ветер
  const len = ctx.sampleRate * 3;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    d[i] = last * 3.5;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  noise.loop = true;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 420;
  bp.Q.value = 0.7;
  const wl = ctx.createOscillator();
  wl.frequency.value = 0.07;
  const wlg = ctx.createGain();
  wlg.gain.value = 260;
  wl.connect(wlg);
  wlg.connect(bp.frequency);
  const wg = ctx.createGain();
  wg.gain.value = 0.35;
  noise.connect(bp);
  bp.connect(wg);
  wg.connect(master);
  noise.start();
  wl.start();

  setSound(on);
}

export function setSound(on: boolean) {
  want = on;
  if (!ctx || !master) return;
  master.gain.setTargetAtTime(on ? 0.5 : 0, ctx.currentTime, 0.5);
}

export function ping(freq = 880, vol = 0.05) {
  if (!ctx || !bus || !want) return;
  const o = ctx.createOscillator();
  const o2 = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "sine";
  o2.type = "sine";
  o.frequency.value = freq;
  o2.frequency.value = freq * 2.01;
  const t = ctx.currentTime;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
  o.connect(g);
  o2.connect(g);
  g.connect(bus);
  o.start(t);
  o2.start(t);
  o.stop(t + 1.5);
  o2.stop(t + 1.5);
}

function noiseBurst(freq: number, q: number, dur: number, vol: number, type: BiquadFilterType = "bandpass") {
  if (!ctx || !master || !want) return;
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  const g = ctx.createGain();
  const t = ctx.currentTime;
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f);
  f.connect(g);
  g.connect(master);
  src.start(t);
  src.stop(t + dur + 0.02);
}

export function footstep() {
  noiseBurst(180 + Math.random() * 90, 0.7, 0.09, 0.045, "lowpass");
}

export function pageTurn() {
  if (!ctx || !master || !want) return;
  noiseBurst(1400 + Math.random() * 600, 0.6, 0.16, 0.03, "highpass");
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "triangle";
  o.frequency.value = 196;
  const t = ctx.currentTime;
  g.gain.setValueAtTime(0.02, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
  o.connect(g);
  g.connect(master);
  o.start(t);
  o.stop(t + 0.36);
}
