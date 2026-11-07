// Geometric placement check: every stele must sit on solid ground —
// inside the tunnel half-width (with margin) and, in the zone-4 chasm,
// on the right-side ledge (not over the abyss). Bundled with esbuild.
import { PLACEMENTS } from '../src/imena-boga-horeb-3d/engine/SceneZones';
import { halfWidth, inChasmZone, LEDGE_X, TUNNEL_END } from '../src/imena-boga-horeb-3d/engine/nav';
import { EXHIBITS } from '../src/imena-boga-horeb-3d/data/exhibits';

let pass = 0, fail = 0;
const t = (name: string, ok: boolean, detail = '') => {
  ok ? pass++ : fail++;
  console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail ? ' — ' + detail : ''));
};

const WALL_MARGIN = 0.4;   // stele must clear the vault/wall surface
const LEDGE_MARGIN = 0.4;  // right-side zone-4 steles must clear the chasm ledge edge
// Zone 7 (z < TUNNEL_END) is the outdoor Horeb plateau: tunnel profile does not apply;
// boulders are scattered to x≈±60, so the ground is wide there.
const PLATEAU_HALF_WIDTH = 60;

// effective walkable half-width at a z (tunnel profile, or outdoor plateau for zone 7)
const effHw = (z: number) => (z < TUNNEL_END ? PLATEAU_HALF_WIDTH : halfWidth(z));

const ids = Object.keys(PLACEMENTS);
t('every exhibit has a placement', ids.length === EXHIBITS.length, `${ids.length} placements vs ${EXHIBITS.length} exhibits`);
t('every exhibit ID has a placement', EXHIBITS.every((e) => PLACEMENTS[e.id]));

let bad = 0;
for (const [id, [x, z]] of Object.entries(PLACEMENTS)) {
  const hw = effHw(z);
  const wallOk = Math.abs(x) < hw - WALL_MARGIN;
  let ledgeOk = true;
  if (inChasmZone(z) && x > 0) {
    const ledgeEdge = LEDGE_X + 0.75;
    ledgeOk = x < ledgeEdge - LEDGE_MARGIN;
  }
  if (!wallOk || !ledgeOk) {
    bad++;
    const why = !wallOk ? `|x|=${Math.abs(x).toFixed(2)} >= hw-${WALL_MARGIN}=${(hw - WALL_MARGIN).toFixed(2)}` : `over chasm ledge (edge=${(LEDGE_X + 0.75).toFixed(2)})`;
    t(`placement ${id} [${x}, ${z}] on solid ground`, false, why);
  }
}
if (!bad) t('all 42 placements on solid ground (wall + chasm ledge clearance)', true);

// props anchor is placed 1.2m in front (toward centre); widest builders spread ±1.8,
// so the wall-side extreme is |x| - 1.2 + 1.8 = |x| + 0.6. Confirm that clears the wall/ledge.
let propBad = 0;
for (const [id, [x, z]] of Object.entries(PLACEMENTS)) {
  const hw = effHw(z);
  const frontShift = 1.2;
  const wideSpread = 1.8;
  const extreme = Math.abs(x) - frontShift + wideSpread; // toward-wall extreme
  const ok = extreme < hw - WALL_MARGIN;
  if (inChasmZone(z) && x > 0) {
    const okLedge = extreme < LEDGE_X + 0.75 - LEDGE_MARGIN;
    if (!okLedge) { propBad++; t(`props ${id} fit on ledge`, false, `extreme=${extreme.toFixed(2)}`); }
  } else if (!ok) {
    propBad++;
    t(`props ${id} clear wall`, false, `extreme=${extreme.toFixed(2)} >= hw-${WALL_MARGIN}=${(hw - WALL_MARGIN).toFixed(2)}`);
  }
}
if (!propBad) t('all 42 prop groups clear wall/ledge even with widest builders (±1.8)', true);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
