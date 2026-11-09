import * as THREE from 'three';
import type { Exhibit } from '../data/exhibits';
import { CATEGORY_RU } from '../data/exhibits';

// ── Детерминированный шум (собственная реализация, без внешних ассетов)
function hash(x: number, y: number, z: number) {
  let h = x * 374761393 + y * 668265263 + z * 1274126177;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
const fade = (t: number) => t * t * (3 - 2 * t);
export function vnoise(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = fade(x - xi), yf = fade(y - yi), zf = fade(z - zi);
  let r = 0;
  for (let dz = 0; dz < 2; dz++) for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) {
    const w = (dx ? xf : 1 - xf) * (dy ? yf : 1 - yf) * (dz ? zf : 1 - zf);
    r += w * hash(xi + dx, yi + dy, zi + dz);
  }
  return r;
}
export function fbm(x: number, y: number, z: number, oct = 4) {
  let a = 0.5, f = 1, s = 0;
  for (let i = 0; i < oct; i++) { s += a * vnoise(x * f, y * f, z * f); f *= 2.03; a *= 0.5; }
  return s / (1 - Math.pow(0.5, oct));
}
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

// ── Процедурная текстура камня (canvas) — цвет + рельеф
/** Stable, 3D world-space lithology modulation. No horizontal UV-striping
 * dependency; adjacent slices share the same material field at their seams.
 * Calculated once when meshes are built, not per animation frame.
 */
export function caveSurfaceVariation(x: number, y: number, z: number): number {
  const broad = fbm(x * 0.065 + 12, y * 0.09 - 7, z * 0.052 + 3, 3);
  const grain = fbm(x * 0.38 - 5, y * 0.27, z * 0.31 + 8, 2);
  return Math.max(0.64, Math.min(1.2, 0.76 + broad * 0.35 + (grain - 0.5) * 0.2));
}

export function rockTextures(size = 512) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const img = g.createImageData(size, size);
  const S = size / 64;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    // тайлящийся шум: усредняем по торической выборке
    const u = x / S, v = y / S;
    const n = fbm(u, v, 0.5, 5);
    // Multiscale mineral deposits, not evenly spaced horizontal sine bands.
    // Existing mirrored-repeat wrapping keeps adjacent texture tiles continuous.
    const strata = fbm(u * 0.18 + 13, v * 0.31 - 5, 1.6, 3);
    const grain = fbm(u * 1.7 - 21, v * 1.2 + 9, 3.4, 2);
    const crack = Math.abs(fbm(u * 0.6 + 9, v * 0.6, 3, 3) - 0.5) < 0.018 ? 0.55 : 1;
    const val = (0.47 + 0.31 * n + 0.16 * strata + 0.06 * grain) * crack;
    const i = (y * size + x) * 4;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = Math.min(255, val * 255);
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.MirroredRepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const bump = new THREE.CanvasTexture(c);
  bump.wrapS = bump.wrapT = THREE.MirroredRepeatWrapping;
  return { tex, bump };
}

export function glowTexture(inner = 'rgba(255,220,160,1)', outer = 'rgba(255,120,30,0)'): THREE.Texture | null {
  try {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d')!;
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, inner); gr.addColorStop(1, outer);
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  } catch {
    // Node / no-DOM (headless construction test): no canvas → plain material.
    return null;
  }
}

// ── Надпись экспоната — визуализация, а не реконструкция древней надписи
export function labelTexture(e: Exhibit, late: boolean, low = false) {
  // Logical layout stays at 640x900. In low mode we rasterize at 60% to
  // reduce 42 texture uploads from ~97 MB to ~35 MB of raw RGBA pixels.
  const W = 640, H = 900;
  const scale = low ? 0.6 : 1;
  const c = document.createElement('canvas');
  c.width = Math.round(W * scale); c.height = Math.round(H * scale);
  const g = c.getContext('2d')!;
  g.scale(scale, scale);
  // фон — тёмный известняк с лёгким тиснением
  const bg = g.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#2a241e'); bg.addColorStop(1, '#1a1612');
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(214,190,150,0.35)'; g.lineWidth = 2; g.strokeRect(22, 22, W - 44, H - 44);
  g.textAlign = 'center';
  g.fillStyle = 'rgba(214,190,150,0.7)';
  g.font = '500 24px "Cormorant Garamond", Georgia, serif';
  g.fillText((late ? 'ПОЗДНЕЙШЕЕ СВИДЕТЕЛЬСТВО · ' : '') + CATEGORY_RU[e.category].toUpperCase(), W / 2, 80);
  // оригинальный текст: настоящий Unicode, направление задаёт canvas
  const rtl = e.sourceLanguage !== 'grc';
  g.direction = rtl ? 'rtl' : 'ltr';
  let size = 118;
  const fam = rtl ? '"Noto Serif Hebrew", "SBL Hebrew", "Times New Roman", serif' : '"Noto Serif", "GFS Didot", Georgia, serif';
  do { g.font = `400 ${size}px ${fam}`; size -= 4; } while (g.measureText(e.originalUnicode).width > W - 90 && size > 30);
  g.fillStyle = '#efe2c6';
  g.shadowColor = 'rgba(0,0,0,0.8)'; g.shadowBlur = 6;
  g.fillText(e.originalUnicode, W / 2, 330);
  g.shadowBlur = 0;
  g.direction = 'ltr';
  g.fillStyle = 'rgba(239,226,198,0.75)';
  g.font = 'italic 34px "Cormorant Garamond", Georgia, serif';
  g.fillText(e.transliteration, W / 2, 420);
  g.fillStyle = '#efe2c6';
  g.font = '500 42px "Cormorant Garamond", Georgia, serif';
  wrap(g, e.displayLabelRu, W / 2, 520, W - 100, 50);
  g.fillStyle = 'rgba(214,190,150,0.9)';
  g.font = '600 36px "Cormorant Garamond", Georgia, serif';
  g.fillText(e.verseReference, W / 2, 700);
  g.fillStyle = 'rgba(214,190,150,0.5)';
  g.font = '22px "Cormorant Garamond", Georgia, serif';
  g.fillText('E — контекст и источники', W / 2, 800);
  g.fillText('лабораторный статус: HOLD', W / 2, 835);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
function wrap(g: CanvasRenderingContext2D, s: string, x: number, y: number, mw: number, lh: number) {
  const words = s.split(' ');
  let line = '';
  for (const w of words) {
    const t = line ? line + ' ' + w : w;
    if (g.measureText(t).width > mw && line) { g.fillText(line, x, y); y += lh; line = w; } else line = t;
  }
  g.fillText(line, x, y);
}

// Объёмный луч света (аддитивный градиент)
export function shaftMaterial(color: THREE.ColorRepresentation, strength = 0.18) {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    uniforms: { uColor: { value: new THREE.Color(color) }, uS: { value: strength }, uT: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
    fragmentShader: `uniform vec3 uColor; uniform float uS; uniform float uT; varying vec2 vUv;
      void main(){ float edge = smoothstep(0.0,0.5,vUv.x)*smoothstep(1.0,0.5,vUv.x);
      float len = smoothstep(0.0,0.25,vUv.y)*smoothstep(1.0,0.6,vUv.y);
      float flick = 0.85 + 0.15*sin(uT*0.4 + vUv.x*7.0);
      gl_FragColor = vec4(uColor * edge*edge*len*uS*flick, 1.0);} `,
  });
}
