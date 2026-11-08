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

export class NarratorBus {
  private current: AudioBufferSourceNode | null = null;
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

  async play(file: string, space: AcousticSpace): Promise<boolean> {
    if (this.disposed || !isApprovedAudioPath(file)) return false;
    this.stop();
    const gen = ++this.generation;
    const abort = new AbortController();
    this.activeFetch = abort;
    try {
      const response = await fetch(file, { signal: abort.signal, cache: 'force-cache' });
      if (!response.ok || !/^(audio\/|application\/octet-stream)/.test(response.headers.get('content-type') || '')) return false;
      const bytes = await response.arrayBuffer();
      if (this.disposed || gen !== this.generation) return false;
      const buffer = await this.ctx.decodeAudioData(bytes);
      if (this.disposed || gen !== this.generation) return false;
      await this.ctx.resume();
      if (this.disposed || gen !== this.generation) return false;
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      const dry = this.ctx.createGain(), wet = this.ctx.createGain();
      const reverb = this.ctx.createConvolver();
      const cfg = ACOUSTIC[space];
      dry.gain.value = cfg.dry;
      wet.gain.value = cfg.wet;
      reverb.buffer = this.impulse(space);
      source.connect(dry).connect(this.voiceOutput);
      source.connect(reverb).connect(wet).connect(this.voiceOutput);
      this.current = source;
      this.activeNodes = { dry, wet, reverb };
      this.ambience.gain.setTargetAtTime(0.45, this.ctx.currentTime, 0.25);
      source.onended = () => {
        if (this.current !== source) return;
        this.current = null;
        this.ambience.gain.setTargetAtTime(1, this.ctx.currentTime, 0.65);
        source.disconnect(); dry.disconnect(); wet.disconnect(); reverb.disconnect();
        this.activeNodes = null;
      };
      source.start();
      return true;
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        // Missing or invalid recording must NOT cause a fallback divine TTS.
        console.warn('Human narrator recording unavailable:', error);
      }
      return false;
    } finally {
      if (this.activeFetch === abort) this.activeFetch = null;
    }
  }
  stop() {
    this.generation++;
    this.activeFetch?.abort();
    this.activeFetch = null;
    if (this.current) {
      const source = this.current;
      this.current = null;
      source.onended = null;
      try { source.stop(); } catch { /* already ended */ }
      source.disconnect();
    }
    if (this.activeNodes) {
      this.activeNodes.dry.disconnect();
      this.activeNodes.wet.disconnect();
      this.activeNodes.reverb.disconnect();
      this.activeNodes = null;
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
