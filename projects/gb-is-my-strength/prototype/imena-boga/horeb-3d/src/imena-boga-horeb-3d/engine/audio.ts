// Процедурный звук (собственный синтез Web Audio, без внешних записей и музыки).
import { NarratorBus, type AcousticSpace } from './NarratorBus';
import type { NarrationPlan } from '../data/narrationPlan';
export class AmbientAudio {
  ctx: AudioContext | null = null;
  private master!: GainNode;
  private ambienceBus!: GainNode;
  private narrator: NarratorBus | null = null;
  private windGain!: GainNode;
  private windFilter!: BiquadFilterNode;
  private fireGain!: GainNode;
  private noise!: AudioBuffer;
  private nextDrip = 3;
  private quietUntil = 0;
  enabled = true;

  start() {
    if (this.ctx) {
      // Initialisation follows an async WebGL import; browser autoplay policy
      // may keep this context suspended until a trusted visitor gesture.
      // A rejected resume is a normal muted-browser state, not an exception.
      if (this.enabled && this.ctx.state === 'suspended' && !document.hidden)
        void this.ctx.resume().catch(() => { /* needs visitor gesture */ });
      return;
    }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    // Audio is optional. If the OS/browser rejects a Web Audio device,
    // the visual route must remain available instead of failing World.create.
    let ctx: AudioContext;
    try { ctx = new AC(); } catch { return; }
    this.ctx = ctx;
    this.master = ctx.createGain(); this.master.gain.value = this.enabled ? 0.9 : 0; this.master.connect(ctx.destination);
    this.ambienceBus = ctx.createGain(); this.ambienceBus.gain.value = 1; this.ambienceBus.connect(this.master);
    this.narrator = new NarratorBus(ctx, this.master, this.ambienceBus);
    const len = ctx.sampleRate * 3;
    this.noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
    const src = ctx.createBufferSource(); src.buffer = this.noise; src.loop = true;
    this.windFilter = ctx.createBiquadFilter(); this.windFilter.type = 'lowpass'; this.windFilter.frequency.value = 300;
    this.windGain = ctx.createGain(); this.windGain.gain.value = 0.05;
    src.connect(this.windFilter).connect(this.windGain).connect(this.ambienceBus); src.start();
    const fsrc = ctx.createBufferSource(); fsrc.buffer = this.noise; fsrc.loop = true; fsrc.playbackRate.value = 4;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.7;
    this.fireGain = ctx.createGain(); this.fireGain.gain.value = 0;
    fsrc.connect(bp).connect(this.fireGain).connect(this.ambienceBus); fsrc.start();
  }
  /** Called synchronously from a real pointer/key/touch gesture, not RAF.
   * No new sound is fetched or synthesized; it only unlocks the procedural bus.
   * Reopening a dialog or foregrounding a tab must never force a new voice clip.
   */
  unlockFromGesture() {
    if (!this.enabled || document.hidden) return;
    // start() uses the current trusted input task to resume a suspended
    // context exactly once; repeated click/keydown gestures are idempotent.
    this.start();
  }
  setEnabled(on: boolean) {
    this.enabled = on;
    if (!on) this.narrator?.stop();
    if (this.ctx) this.master.gain.setTargetAtTime(on ? 0.9 : 0, this.ctx.currentTime, 0.2);
  }
  // Only explicitly approved human-owned voice assets are passed here.
  // All current scripts remain text-only until a real licensed recording exists.
  async playNarration(approvedAsset: string, space: AcousticSpace) {
    if (!this.enabled) return false;
    this.start();
    return this.narrator?.play(approvedAsset, space) ?? false;
  }
  // The cue is playable only after phonetic, transcript and rights sign-off.
  async playNarrationPlan(plan: NarrationPlan, space: AcousticSpace) {
    if (!this.enabled || !plan.ready || plan.playback.length < 1) return false;
    this.unlockFromGesture();
    return this.narrator?.playSequence(plan.playback, space) ?? false;
  }
  stopNarration() { this.narrator?.stop(); }
  suspend() { this.narrator?.stop(); this.ctx?.suspend(); }
  resume() { if (this.ctx && this.enabled) this.ctx.resume(); }

  inspectCue(id: string, t: number) {
    if (!this.ctx || !this.enabled) return;
    // Physical reactions, never a divine voice, spell or arcade reward.
    if (id === 'el-olam' || id === 'el-roi') this.drip(0.08);
    if (id === 'ehyeh' || id === 'yhwh') this.quietUntil = Math.max(this.quietUntil, t + 4.5);
  }
  update(t: number, zone: number, distBush: number, nearPool: number) {
    const c = this.ctx; if (!c || !this.enabled) return;
    const outside = zone >= 7;
    const gust = 0.6 + 0.4 * Math.sin(t * 0.21) * Math.sin(t * 0.077 + 1);
    const hush = t < this.quietUntil ? 0.35 : 1;
    this.windGain.gain.setTargetAtTime((outside ? 0.11 : zone === 6 ? 0.08 : 0.045) * gust * hush, c.currentTime, 0.4);
    this.windFilter.frequency.setTargetAtTime(outside ? 650 : zone === 4 ? 180 : 280, c.currentTime, 0.6);
    const fire = distBush < 60 ? Math.min(0.22, 3 / (distBush * distBush * 0.25 + 10)) : 0;
    this.fireGain.gain.setTargetAtTime(fire * (0.5 + Math.random()), c.currentTime, 0.03);
    if (nearPool < 30 && t > this.nextDrip) { this.drip(Math.max(0.02, 0.25 - nearPool * 0.008)); this.nextDrip = t + 4 + Math.random() * 4; }
  }
  private drip(vol: number) {
    const c = this.ctx!; const o = c.createOscillator(); const g = c.createGain();
    o.frequency.setValueAtTime(1500, c.currentTime); o.frequency.exponentialRampToValueAtTime(500, c.currentTime + 0.12);
    g.gain.setValueAtTime(vol, c.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.35);
    o.connect(g).connect(this.ambienceBus); o.start(); o.stop(c.currentTime + 0.4);
  }
  step(soft: boolean) {
    const c = this.ctx; if (!c || !this.enabled) return;
    const s = c.createBufferSource(); s.buffer = this.noise; s.playbackRate.value = soft ? 0.6 : 1.4;
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = soft ? 260 : 1100;
    const g = c.createGain(); const v = soft ? 0.05 : 0.16;
    g.gain.setValueAtTime(v, c.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + (soft ? 0.18 : 0.12));
    s.connect(f).connect(g).connect(this.ambienceBus); s.start(0, Math.random() * 2, 0.25);
  }
  dispose() { this.narrator?.dispose(); this.narrator = null; this.ctx?.close(); this.ctx = null; }
}
