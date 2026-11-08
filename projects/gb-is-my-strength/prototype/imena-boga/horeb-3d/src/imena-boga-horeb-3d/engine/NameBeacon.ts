// Large, legible original-script inscriptions at seven hero moments + El Elyon.
// This is *museum label typography*, not a supernatural manifestation of God.
// All content comes from the checked typed registry; publication remains HOLD.
import * as THREE from 'three';
import { CATEGORY_RU, type Exhibit } from '../data/exhibits';

export const BEACON_IDS = [
  'elohim', 'el-elyon', 'el-shaddai', 'el-olam', 'el-roi', 'yireh', 'ehyeh', 'yhwh',
] as const;

// One draw call / pilot; no additional lights, particles or textures per frame.
export function beaconOpacity(distance: number, horeb = false): number {
  if (!Number.isFinite(distance) || distance >= 35) return 0;
  const envelope = distance <= 21 ? 1 : Math.max(0, (35 - distance) / 14);
  return Math.min(horeb ? 0.54 : 0.92, envelope * (horeb ? 0.54 : 0.92));
}

// Readable from afar, but does not overwhelm the camera when inspected at 2m.
export function beaconVisualScale(distance: number): number {
  if (!Number.isFinite(distance)) return 0.78;
  const t = Math.min(1, Math.max(0, (distance - 7) / 16));
  return 0.78 + t * 0.36;
}

export function createNameBeacon(e: Exhibit, low: boolean) {
  const canvas = document.createElement('canvas');
  const W = low ? 640 : 1024, H = low ? 256 : 410;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas required for verified-script inscription');
  const k = W / 1024;
  ctx.scale(k, k);
  const w = 1024, h = 410;
  // The centre is dark for legible glyphs, but the edges dissolve into
  // the stone. No rectangular translucent billboard behind divine writing.
  const bg = ctx.createRadialGradient(w / 2, h / 2, 55, w / 2, h / 2, w * 0.57);
  bg.addColorStop(0, 'rgba(11,13,17,0.78)');
  bg.addColorStop(0.5, 'rgba(11,13,17,0.61)');
  bg.addColorStop(0.82, 'rgba(11,13,17,0.2)');
  bg.addColorStop(1, 'rgba(11,13,17,0)');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const rtl = e.sourceLanguage !== 'grc';
  ctx.direction = rtl ? 'rtl' : 'ltr';
  const family = rtl
    ? '"Noto Serif Hebrew", "SBL Hebrew", "Times New Roman", serif'
    : '"Noto Serif", Georgia, serif';
  let size = 214;
  do {
    ctx.font = `600 ${size}px ${family}`;
    if (ctx.measureText(e.originalUnicode).width <= w - 140) break;
    size -= 4;
  } while (size > 60);
  ctx.shadowColor = 'rgba(245,169,81,0.62)';
  ctx.shadowBlur = 27;
  ctx.fillStyle = '#fbe3b5';
  ctx.fillText(e.originalUnicode, w / 2, 168);
  ctx.shadowBlur = 0;
  ctx.direction = 'ltr';
  ctx.fillStyle = 'rgba(238,223,197,0.92)';
  ctx.font = '600 43px "Cormorant Garamond", Georgia, serif';
  const category = CATEGORY_RU[e.category];
  ctx.fillText(category.toUpperCase(), w / 2, 313, w - 100);
  ctx.font = '29px "Cormorant Garamond", Georgia, serif';
  ctx.fillStyle = 'rgba(238,223,197,0.68)';
  ctx.fillText(e.verseReference + '   ·   RESEARCH HOLD', w / 2, 365, w - 100);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  const material = new THREE.MeshBasicMaterial({
    map: texture, transparent: true, opacity: 0,
    depthWrite: false, depthTest: true, side: THREE.DoubleSide, toneMapped: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(3.65, 1.46), material);
  mesh.name = 'original-script-beacon';
  mesh.userData.exhibitId = e.id;
  // Affixed just above the stone witness; no floating divine script in the sky.
  mesh.position.set(0, 2.94, 0.255);
  mesh.visible = false;
  return {
    mesh,
    update(distance: number, inspected = false) {
      const opacity = beaconOpacity(distance, e.zone === 7);
      mesh.visible = opacity > 0.01;
      material.opacity = opacity;
      // A deliberate inspection brings the lettering forward without new GPU
      // lights or turning Horeb into a bright fantasy stage.
      const scale = beaconVisualScale(distance) * (inspected ? 1.08 : 1);
      mesh.scale.set(scale, scale, 1);
    },
  };
}
