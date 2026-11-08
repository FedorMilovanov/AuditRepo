// Source for the headless construction smoke test. Bundled with esbuild
// (which resolves extensionless TS imports) and run in Node.
import { EXHIBITS } from '../src/imena-boga-horeb-3d/data/exhibits';
import { buildExhibitProps } from '../src/imena-boga-horeb-3d/engine/exhibitProps';
import { steleVariation } from '../src/imena-boga-horeb-3d/engine/nav';

let pass = 0, fail = 0;
const t = (name: string, ok: boolean) => { ok ? pass++ : fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name); };

let totalHigh = 0, totalLow = 0;
const errors: string[] = [];
for (const e of EXHIBITS) {
  try {
    const hi = buildExhibitProps(e, false, 0, 0);
    const lo = buildExhibitProps(e, true, 0, 0);
    let hc = 0, lc = 0;
    hi.traverse((o: { isMesh?: boolean }) => { if (o.isMesh) hc++; });
    lo.traverse((o: { isMesh?: boolean }) => { if (o.isMesh) lc++; });
    totalHigh += hc; totalLow += lc;
    t(`props[${e.id}] env=${e.environmentKey} high=${hc} low=${lc}`, hc > 0 && lc > 0);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`${e.id}: ${msg}`);
    t(`props[${e.id}] build threw: ${msg}`, false);
  }
}
console.log(`\ntotal prop meshes: high=${totalHigh} low=${totalLow}`);

// No repetitive stone: 42 steles must not be identical — varied scale/tilt/zone-tint.
const scales = new Set(EXHIBITS.map((e) => steleVariation(e.id, e.zone).scale.toFixed(3)));
const tilts = new Set(EXHIBITS.map((e) => steleVariation(e.id, e.zone).tilt.toFixed(3)));
const labels = new Set(EXHIBITS.map((e) => steleVariation(e.id, e.zone).labelScale.toFixed(3)));
const tints = new Set(EXHIBITS.map((e) => steleVariation('__zone_' + e.zone, e.zone).tint));
t(`steles vary in scale (${scales.size} unique)`, scales.size >= 30);
t(`steles vary in tilt (${tilts.size} unique)`, tilts.size >= 30);
t(`labels vary in scale (${labels.size} unique)`, labels.size >= 30);
t(`zone tints vary (${tints.size} unique)`, tints.size >= 3);
// determinism: same id → same variation
const v1 = steleVariation('elohim', 1);
const v2 = steleVariation('elohim', 1);
t('steleVariation is deterministic', v1.scale === v2.scale && v1.tilt === v2.tilt && v1.tint === v2.tint);

if (errors.length) console.log('errors:\n' + errors.join('\n'));
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
