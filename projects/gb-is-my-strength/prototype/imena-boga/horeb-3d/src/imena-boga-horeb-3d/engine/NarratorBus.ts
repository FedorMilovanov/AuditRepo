// Human narrator playback chain; deliberately contains NO generated divine
// speech and NO unlicensed voice files. Spoken clips must be reviewed/owned.
// Uses the World AmbientAudio AudioContext, with an original synthetic IR
// approximation until a licensed measured impulse response is approved.
export type AcousticSpace = 'CAVE_STONE' | 'PASSAGE' | 'OPEN_HOREB';
export const ACOUSTIC: Record<AcousticSpace, { dry: number; wet: number; tail: number; delay: number }> = {
  CAVE_STONE: { dry: 0.8, wet: 0.2, tail: 2.2, delay: 0.065 },
  PASSAGE: { dry: 0.85, wet: 0.15, tail: 1.2, delay: 0.04 },
  OPEN_HOREB: { dry: 0.95, wet: 0.05, tail: 0.45, delay: 0.03 },
};

// Explicit empty allow-list until a real human recording, licence and
// editorial transcript are reviewed. Never play an arbitrary similarly
// named file just because it happens to exist on a server.
export const APPROVED_NARRATION_ASSETS: Readonly<Record<string, string>> = Object.freeze({});

export function isApprovedAudioPath(path: string): boolean {
  return /^\/audio\/narration\/[a-z0-9-]+\.(mp3|ogg|wav)$/.test(path) &&
    Object.values(APPROVED_NARRATION_ASSETS).includes(path);
}

/** Offsets for source-language and Russian masters, never simultaneous. */
export function narrationOffsets(durations: readonly number[], gap = 0.55): number[] | null {
  if (durations.length < 1 || durations.length > 2 || !Number.isFinite(gap) ||
      gap < 0.25 || gap > 1.5 || durations.some((d) => !Number.isFinite(d) || d <= 0 || d > 180)) return null;
  const starts: number[] = [];
  let next = 0;
  for (const duration of durations) { starts.push(next); next += duration + gap; }
  return starts;
}

export class NarratorBus {
  private sources: AudioBufferSourceNode[] = [];
  private activeNodes: { dry: GainNode; wet: GainNode; reverb: ConvolverNode } | null = null;
  private activeFetch: AbortController | null = null;
  private impulses = new Map<AcousticSpace, AudioBuffer>();
  private disposed = false;
  private generation = 0;

  constructor(
    private ctx: AudioContext,
    private voiceOutput: AudioNode,
    private ambience: GainNode,
  ) {}

  private impulse(space: AcousticSpace): AudioBuffer {
    const existing = this.impulses.get(space);
    if (existing) return existing;
    const p = ACOUSTIC[space];
    const sampleRate = this.ctx.sampleRate;
    const length = Math.max(1, Math.ceil((p.tail + p.delay) * sampleRate));
    const ir = this.ctx.createBuffer(2, length, sampleRate);
    let seed = space === 'CAVE_STONE' ? 21477 : space === 'PASSAGE' ? 5903 : 11243;
    const random = () => {
      seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
      return ((seed >>> 0) / 4294967296) * 2 - 1;
    };
    for (let channel = 0; channel < 2; channel++) {
      const out = ir.getChannelData(channel);
      for (let i = Math.floor(p.delay * sampleRate); i < length; i++) {
        const t = (i / sampleRate - p.delay) / p.tail;
        // Dense but decaying stone reflections; preview IR, not a measured cave.
        const envelope = Math.pow(Math.max(0, 1 - t), 2.7);
        out[i] = random() * envelope * 0.19;
      }
    }
    this.impulses.set(space, ir);
    return ir;
  }

  // One shared playback bus: original-language recording, a real pause,
  // then Russian narration. Never uses browser text-to-speech or autoplay.
  async play(file: string, space: AcousticSpace): Promise<boolean> {
    return this.playSequence([file], space);
  }
  async playSequence(files: readonly string[], space: AcousticSpace): Promise<boolean> {
    if (this.disposed || files.length < 1 || files.length > 2 ||
        new Set(files).size !== files.length || !files.every(isApprovedAudioPath)) return false;
    this.stop();
    const gen = ++this.generation;
    const abort = new AbortController();
    this.activeFetch = abort;
    try {
      // Resume in the original trusted click handler, before network awaits.
      await this.ctx.resume();
      if (this.disposed || gen !== this.generation) return false;
      const buffers: AudioBuffer[] = [];
      for (const file of files) {
        const response = await fetch(file, { signal: abort.signal, cache: 'force-cache' });
        if (!response.ok ||
            !/^(audio\/|application\/octet-stream)/.test(response.headers.get('content-type') || '')) return false;
        const bytes = await response.arrayBuffer();
        if (bytes.byteLength === 0 || bytes.byteLength > 16 * 1024 * 1024 ||
            this.disposed || gen !== this.generation) return false;
        const buffer = await this.ctx.decodeAudioData(bytes);
        if (this.disposed || gen !== this.generation) return false;
        buffers.push(buffer);
      }
      const offsets = narrationOffsets(buffers.map((buffer) => buffer.duration));
      if (!offsets || this.disposed || gen !== this.generation) return false;
      const dry = this.ctx.createGain(), wet = this.ctx.createGain();
      const reverb = this.ctx.createConvolver(), cfg = ACOUSTIC[space];
      dry.gain.value = cfg.dry; wet.gain.value = cfg.wet;
      reverb.buffer = this.impulse(space);
      dry.connect(this.voiceOutput);
      reverb.connect(wet).connect(this.voiceOutput);
      this.activeNodes = { dry, wet, reverb };
      const startAt = this.ctx.currentTime + 0.04;
      for (let i = 0; i < buffers.length; i++) {
        const source = this.ctx.createBufferSource();
        source.buffer = buffers[i];
        source.connect(dry); source.connect(reverb);
        this.sources.push(source);
        source.onended = () => {
          source.disconnect();
          if (this.disposed || gen !== this.generation || i !== buffers.length - 1) return;
          // Preserve ambient ducking between the two clips; release at end.
          this.sources = [];
          this.ambience.gain.setTargetAtTime(1, this.ctx.currentTime, 0.65);
          dry.disconnect(); wet.disconnect(); reverb.disconnect();
          this.activeNodes = null;
        };
      }
      this.ambience.gain.setTargetAtTime(0.45, this.ctx.currentTime, 0.25);
      this.sources.forEach((source, i) => source.start(startAt + offsets[i]));
      return true;
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError'))
        console.warn('Approved narrator recording unavailable:', error);
      if (gen === this.generation) this.stop();
      return false;
    } finally {
      if (this.activeFetch === abort) this.activeFetch = null;
    }
  }
  stop() {
    this.generation++;
    this.activeFetch?.abort(); this.activeFetch = null;
    for (const source of this.sources) {
      source.onended = null;
      try { source.stop(); } catch { /* already ended */ }
      source.disconnect();
    }
    this.sources = [];
    if (this.activeNodes) {
      this.activeNodes.dry.disconnect(); this.activeNodes.wet.disconnect();
      this.activeNodes.reverb.disconnect(); this.activeNodes = null;
    }
    if (this.ctx.state !== 'closed') this.ambience.gain.setTargetAtTime(1, this.ctx.currentTime, 0.3);
  }
  dispose() {
    if (this.disposed) return;
    this.stop();
    this.disposed = true;
    this.impulses.clear();
  }
}
