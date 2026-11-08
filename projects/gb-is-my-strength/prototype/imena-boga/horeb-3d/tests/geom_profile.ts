// Geometry profiling: count unique geometry objects vs total meshes.
// Bundled with esbuild and run in Node.
import { EXHIBITS } from '../src/imena-boga-horeb-3d/data/exhibits';
import { buildExhibitProps } from '../src/imena-boga-horeb-3d/engine/exhibitProps';
import * as THREE from 'three';

const geomSet = new Set<THREE.BufferGeometry>();
const typeCount = new Map<string, number>();
const paramCount = new Map<string, number>();
let totalHigh = 0, totalLow = 0;

for (const e of EXHIBITS) {
  for (const low of [false, true]) {
    const g = buildExhibitProps(e, low, 0, 0);
    g.traverse((obj: any) => {
      if (obj.isMesh && obj.geometry) {
        const geo = obj.geometry;
        geomSet.add(geo);
        const gt = geo.type || 'unknown';
        typeCount.set(gt, (typeCount.get(gt) || 0) + 1);
        // Count params: same geometry type + same dimensions = same params
        const params = JSON.stringify(geo.parameters || geo.type);
        paramCount.set(params, (paramCount.get(params) || 0) + 1);
        if (low) totalLow++; else totalHigh++;
      }
    });
  }
}

console.log('=== GEOMETRY PROFILING ===');
console.log('Total mesh instances:', totalHigh + totalLow, `(high=${totalHigh}, low=${totalLow})`);
console.log('Unique geometry objects:', geomSet.size);
console.log('Unique geometry params:', paramCount.size);
console.log('');
console.log('Geometry type distribution:');
for (const [type, count] of [...typeCount].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${type}: ${count}`);
}
console.log('');
const waste = Math.round((1 - geomSet.size / (totalHigh + totalLow)) * 100);
console.log(`Duplicate geometry objects: ${totalHigh + totalLow - geomSet.size} (${waste}% of total)`);
const paramWaste = Math.round((1 - paramCount.size / (totalHigh + totalLow)) * 100);
console.log(`Duplicate geometry params: ${totalHigh + totalLow - paramCount.size} (${paramWaste}% of total)`);
console.log('');
console.log('Top 10 most-duplicated params:');
for (const [params, count] of [...paramCount].sort((a, b) => b[1] - a[1]).slice(0, 10)) {
  console.log(`  ${count}x: ${params}`);
}
