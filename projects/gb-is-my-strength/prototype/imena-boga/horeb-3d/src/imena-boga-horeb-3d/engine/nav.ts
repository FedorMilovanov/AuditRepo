// Collision/Nav + SandalsGate — чистая логика без Three.js (тестируется отдельно).

export const BUSH = { x: 0, z: -366 };
export const R_OUTER = 14; // внешний порог: в обуви ближе нельзя
export const R_INNER = 6.5; // внутренний рубеж: нельзя никогда
export const TUNNEL_END = -318;
export const START = { x: 0, z: -2 };

// Контрольные точки: [z, визуальная полуширина, высота свода]
const PROFILE: [number, number, number][] = [
  [4, 5, 7], [-4, 7, 14], [-58, 7, 18], [-66, 16, 13], [-112, 16, 13], [-120, 5, 6],
  [-168, 5, 6], [-174, 11, 40], [-226, 11, 40], [-232, 6.5, 9], [-282, 6.5, 9],
  [-298, 3.2, 5.5], [-312, 2.4, 4.2], [-320, 2.6, 4.6],
];

function interp(z: number, i: 1 | 2): number {
  if (z >= PROFILE[0][0]) return PROFILE[0][i];
  for (let k = 0; k < PROFILE.length - 1; k++) {
    const a = PROFILE[k], b = PROFILE[k + 1];
    if (z <= a[0] && z >= b[0]) {
      const t = (a[0] - z) / (a[0] - b[0]);
      const s = t * t * (3 - 2 * t);
      return a[i] + (b[i] - a[i]) * s;
    }
  }
  return PROFILE[PROFILE.length - 1][i];
}
export const halfWidth = (z: number) => interp(z, 1);
export const vaultHeight = (z: number) => interp(z, 2);

// Зона 4: справа обрыв, ходить можно только до края уступа.
export const LEDGE_X = 4.2;
export const inChasmZone = (z: number) => z < -176 && z > -224;
const smooth = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
// Совпадает с вырезом пола в SceneZones: край уступа сужается плавно.
export const chasmFactor = (z: number) => smooth(-176, -181, z) * (1 - smooth(-219, -224, z));

export function zoneAt(z: number): number {
  if (z > -4) return 0;
  if (z > -62) return 1;
  if (z > -116) return 2;
  if (z > -171) return 3;
  if (z > -229) return 4;
  if (z > -288) return 5;
  if (z > TUNNEL_END) return 6;
  return 7;
}
export const ZONE_SPAWN: Record<number, { x: number; z: number }> = {
  0: START, 1: { x: 0, z: -8 }, 2: { x: 0, z: -68 }, 3: { x: 0, z: -122 }, 4: { x: -2, z: -176 },
  5: { x: 0, z: -234 }, 6: { x: 0, z: -290 }, 7: { x: 0, z: -326 },
};

export type Block = null | 'wall' | 'outer' | 'inner';

/** Ограничить позицию. Возвращает новую позицию и причину блокировки. */
export function constrain(x: number, z: number, shod: boolean): { x: number; z: number; block: Block } {
  if (!Number.isFinite(x) || !Number.isFinite(z)) return { ...START, block: 'wall' };
  let block: Block = null;
  const M = 0.55;
  if (z > 3) { z = 3; block = 'wall'; }
  if (z > TUNNEL_END - 1) {
    let hw = halfWidth(z) - M;
    if (hw < 0.6) hw = 0.6;
    let xMax = hw;
    xMax += (Math.min(hw, LEDGE_X) - xMax) * chasmFactor(z);
    if (x > xMax) { x = xMax; block = 'wall'; }
    if (x < -hw) { x = -hw; block = 'wall'; }
  } else {
    // Открытый ландшафт у Хорива
    if (x > 26) { x = 26; block = 'wall'; }
    if (x < -26) { x = -26; block = 'wall'; }
    if (z < -396) { z = -396; block = 'wall'; }
    // Выход из тоннеля: у скалы допустим только проём
    if (z > TUNNEL_END - 3 && Math.abs(x) > 2) { z = TUNNEL_END - 3; }
  }
  // Святые рубежи — проецируем на окружность (без телепортации, только скольжение по краю)
  let dx = x - BUSH.x, dz = z - BUSH.z;
  if (Math.hypot(dx, dz) < 1e-6) { dx = 0; dz = 1; } // точно в центре — выталкиваем к тоннелю
  const d = Math.hypot(dx, dz);
  const r = shod ? R_OUTER : R_INNER;
  if (d < r) {
    x = BUSH.x + (dx / d) * r;
    z = BUSH.z + (dz / d) * r;
    block = shod ? 'outer' : 'inner';
  }
  return { x, z, block };
}

/** Любая восстановленная/внешняя позиция проходит через ту же защиту (fail-closed: обувь считается надетой). */
export function sanitizeSpawn(p: { x: number; z: number } | null | undefined): { x: number; z: number } {
  if (!p || !Number.isFinite(p.x) || !Number.isFinite(p.z)) return { ...START };
  const c = constrain(p.x, p.z, true);
  return { x: c.x, z: c.z };
}

export const distToBush = (x: number, z: number) => Math.hypot(x - BUSH.x, z - BUSH.z);
