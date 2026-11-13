// Pure numerical guard for the actual source-owned open entrance.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=(s)=>fs.readFileSync(path.join(root,"src",s),"utf8");
const source=read("scene/entranceGeometry.ts");
const module={exports:{}};
const js=ts.transpileModule(source,{
  compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}
}).outputText;
new Function("module","exports",js)(module,module.exports);
const E=module.exports.ENTRANCE_GEOMETRY;
assert(Object.isFrozen(E), "Entrance dimension contract is mutable");
assert.equal(E.archStones%2,1,"Odd number of dressed arch voussoirs required");
assert(E.archStones>=9 && E.archStones<=24,"Entrance has an excessive stone count");
assert(E.innerRadius===E.corridorHalfWidth,"Actual arch opening and aisle disagree");
assert(E.innerRadius>=1.45,"Gate has less than 2.9m clear aperture");
assert(E.pierX-E.pierWidth/2>=E.innerRadius+0.02,
  "Stone jamb narrows the pedestrian opening");
assert(E.springY>=4.5 && E.outerRadius>E.innerRadius+.25,
  "Arched doorway has insufficient headroom or false stone thickness");
assert(E.faceDepth>=3,"Portal has not enough real architectural depth");
assert(E.outsideFloorStart>=15.95 && E.outsideFloorEnd>23,
  "Exterior portico has no visible floor continuation");

// Numeric inspection of each real arched segment: a full-height plane or
// an inverted arch would intersect the centre aisle. A semicircular ring
// must stay above spring level and never enter its own intrados.
let minArchY=Infinity;
for(let s=0;s<E.archStones;s++){
  const lo=s*Math.PI/E.archStones;
  const hi=(s+1)*Math.PI/E.archStones;
  for(let a=lo;a<=hi+1e-9;a+=(hi-lo)/7){
    const y=E.springY+E.innerRadius*Math.sin(a);
    const x=E.innerRadius*Math.cos(a);
    assert(y>=E.springY-1e-7,"Arch is hanging below its spring");
    assert(Math.abs(x)<=E.innerRadius+1e-7,"Arch cuts into the clear opening");
    minArchY=Math.min(minArchY,y);
  }
}
assert(Math.abs(minArchY-E.springY)<1e-5,"Arch ends do not meet jambs");

const portico=read("scene/EntrancePortico.tsx");
const landscape=read("scene/ExteriorLandscape.tsx");
const architecture=read("scene/Architecture.tsx");
assert(portico.includes('<ExteriorLandscape />'),"Real exterior topography is not mounted");
for (const fragment of [
  "new THREE.PlaneGeometry(136, 90, 56, 24)",
  'g.rotateX(-Math.PI / 2)',
  'g.setAttribute("color", new THREE.BufferAttribute(colors, 3))',
  'geometry.dispose(); material.dispose()',
  'name="exterior-landscape"',
]) assert(landscape.includes(fragment),"Exterior landscape lifecycle/geometry missing: "+fragment);
assert(!landscape.includes("sprite") && !landscape.includes("new Image"),
  "Exterior scenery must remain 3D geometry, not an unlicensed flat billboard");
assert(architecture.includes("<EntrancePortico />"),
  "The actual room did not install the physical entrance");
assert(!architecture.includes("Original entrance remains open"),
  "Old bare portal is still present");
for(const need of [
  'name="entrance-portico"','useMemo(voussoir','E.archStones * 2',
  'E.radius + face * E.faceDepth',
  'E.outsideFloorStart + E.outsideFloorEnd',
  'E.pierWidth','E.innerRadius','E.outerRadius',
  'push(stonework, x, 0.32, z - 0.08, 0.68',
]) assert(portico.includes(need),"Real portico source lacks "+need);

// Clear envelope is wider than a 0.7m diameter avatar, and all portico
// near surfaces lie beyond the existing walking boundary.
const data=read("data.ts");
const walk=Number(data.match(/export const WALK_RADIUS = ([0-9.]+);/)?.[1]);
const player=Number(data.match(/export const PLAYER_COLLISION_RADIUS = ([0-9.]+);/)?.[1]);
assert(Number.isFinite(walk) && Number.isFinite(player));
assert(E.radius>=walk+player+.1,
  "Entrance would intrude into existing player collision volume");
assert((E.innerRadius-player)*2>2.1,
  "Insufficient entrance width for a walking visitor");
console.log("ENTRANCE_GEOMETRY_PASS "+JSON.stringify({
  clearOpeningMetres:E.innerRadius*2,
  pedestrianWidthMetres:2*(E.innerRadius-player),
  archIntradosTop:E.springY+E.innerRadius,
  portalDepth:E.faceDepth, stoneInstances:E.archStones*2
}));
