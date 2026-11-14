// Pure WebGL resolution policy. Geometry quality is chosen when a World starts;
// auto-resolution is allowed to remain lower after FPS degradation until the
// user explicitly changes graphics quality. Sound/exposure settings must not
// silently restore an expensive device pixel ratio.
export function choosePixelRatio(
  quality: 'low' | 'high', devicePixelRatio: number, autoLowered: boolean,
): number {
  const safe = Number.isFinite(devicePixelRatio) && devicePixelRatio > 0 ? devicePixelRatio : 1;
  return Math.min(safe, quality === 'low' || autoLowered ? 1 : 2);
}

export function resetsAutoLowered(
  previous: { quality: 'low' | 'high'; autoQuality: boolean },
  next: { quality: 'low' | 'high'; autoQuality: boolean },
): boolean {
  return previous.quality !== next.quality || previous.autoQuality !== next.autoQuality;
}
