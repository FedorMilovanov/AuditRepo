/**
 * V5.2 architectural craftsmanship pass, independent of content/navigation.
 * Original, generated local PBR textures; instanced casework for fixed GPU cost.
 * No emissive material or animation. See scripts/generate-architecture-materials.py.
 */
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { marble, stone, wood } from './Platform';

const BAYS = 20;
const RADIUS = 15.85;
const WINDOWS = new Set([7, 8, 9, 10, 11, 12]);
const UP = new THREE.Vector3(0, 1, 0);
const loader = new THREE.TextureLoader();

function texture(path: string, color = false): THREE.Texture {
  const result = loader.load(path);
  result.wrapS = result.wrapT = THREE.RepeatWrapping;
  result.anisotropy = 4;
  if (color) result.colorSpace = THREE.SRGBColorSpace;
  return result;
}

const stoneMap = texture(new URL('../assets/pbr/limestone-color.webp', import.meta.url).href, true);
const stoneNormal = texture(new URL('../assets/pbr/limestone-normal.webp', import.meta.url).href);
const oakMap = texture(new URL('../assets/pbr/oak-color.webp', import.meta.url).href, true);
const oakNormal = texture(new URL('../assets/pbr/oak-normal.webp', import.meta.url).href);

// Platform/Architecture/Vault share these base materials. One material
// upgrade improves the entire envelope without making per-mesh clones.
stone.color.set('#ffffff');
stone.map = stoneMap;
stone.normalMap = stoneNormal;
stone.normalScale.set(0.16, 0.16);
stone.roughness = 0.88;
stone.needsUpdate = true;

marble.color.set('#ffffff');
marble.map = stoneMap;
marble.normalMap = stoneNormal;
marble.normalScale.set(0.16, 0.16);
marble.roughness = 0.86;
marble.needsUpdate = true;

wood.color.set('#ffffff');
wood.map = oakMap;
wood.normalMap = oakNormal;
wood.normalScale.set(0.16, 0.16);
wood.roughness = 0.76;
wood.needsUpdate = true;

export const roofLimestone = marble.clone();
roofLimestone.side = THREE.DoubleSide;
roofLimestone.roughness = 0.90;

interface Element {
  x: number; y: number; z: number;
  w: number; h: number; d: number; bay: number;
}
const elem = (bay: number, x: number, y: number, z: number, w: number, h: number, d: number): Element =>
  ({ bay, x, y, z, w, h, d });

function details() {
  const oak: Element[] = [];
  const stonework: Element[] = [];
  for (let bay = 0; bay < BAYS; bay++) {
    if (WINDOWS.has(bay)) {
      // A recessed stone reveal, deep enough to shade the glazing realistically.
      for (const x of [-2.05, 2.05]) {
        stonework.push(elem(bay, x, 4.05, -0.51, .17, 4.45, .24));
        stonework.push(elem(bay, x, 2.30, -0.54, .26, .18, .30));
      }
      stonework.push(elem(bay, 0, 1.77, -0.61, 4.30, .19, .63));
      stonework.push(elem(bay, 0, 6.23, -0.44, 4.30, .18, .32));
      stonework.push(elem(bay, 0, 6.45, -0.30, 4.22, .13, .39));
      continue;
    }
    if (bay === 0) continue; // Preserve original entrance, no obstruction.
    // Front-face pilasters, a layered cornice, and gently recessed casework.
    for (const x of [-2.06, 2.06]) {
      oak.push(elem(bay, x, 3.9, -.79, .17, 7.25, .24));
      oak.push(elem(bay, x, 7.37, -.87, .25, .19, .35));
      oak.push(elem(bay, x, .33, -.83, .27, .52, .35));
    }
    oak.push(elem(bay, 0, 7.51, -.79, 4.32, .20, .34));
    oak.push(elem(bay, 0, 7.33, -.82, 4.14, .095, .30));
    for (let shelf = 0; shelf < 6; shelf++) {
      const y = .58 + shelf * 1.06;
      oak.push(elem(bay, 0, y, -.88, 4.16, .075, .10));
    }
    // Subtle, raised lower-cabinet panels keep shelves visually grounded.
    for (const x of [-1, 1]) {
      oak.push(elem(bay, x, .31, -.82, 1.72, .39, .12));
    }
  }
  return { oak, stonework };
}

function InstancedTrim({ entries, material, geometry, castShadow = true }: {
  entries: Element[];
  material: THREE.Material;
  geometry: THREE.BoxGeometry;
  castShadow?: boolean;
}) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  useLayoutEffect(() => {
    const mesh = ref.current;
    const pivot = new THREE.Object3D();
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      const a = e.bay * Math.PI * 2 / BAYS;
      const center = new THREE.Vector3(Math.sin(a) * RADIUS, 0, Math.cos(a) * RADIUS);
      const local = new THREE.Vector3(e.x, e.y, e.z).applyAxisAngle(UP, a);
      pivot.position.copy(center).add(local);
      pivot.rotation.set(0, a, 0);
      pivot.scale.set(e.w, e.h, e.d);
      pivot.updateMatrix();
      mesh.setMatrixAt(i, pivot.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [entries]);
  return <instancedMesh ref={ref} args={[geometry, material, entries.length]} castShadow={castShadow} receiveShadow dispose={null} />;
}

function WindowArches() {
  const geometry = useMemo(() => {
    // Low-radius arch with genuine geometry, not a fantasy glowing outline.
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.96, 5.70, 0),
      new THREE.Vector3(-1.40, 6.05, 0),
      new THREE.Vector3(0, 6.29, 0),
      new THREE.Vector3(1.40, 6.05, 0),
      new THREE.Vector3(1.96, 5.70, 0),
    ]);
    return new THREE.TubeGeometry(curve, 32, 0.11, 7, false);
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <group>
    {Array.from(WINDOWS).map((bay) => {
      const a = bay * Math.PI * 2 / BAYS;
      return <group key={bay} rotation-y={a} position={[Math.sin(a) * RADIUS, 0, Math.cos(a) * RADIUS]}>
        <mesh position={[0, 0, -.63]} geometry={geometry} material={marble} receiveShadow />
      </group>;
    })}
  </group>;
}

function VaultTrim() {
  const rings = [
    [12.15, 10.04],
    [9.62, 11.25],
    [7.43, 12.18],
    [5.40, 12.90],
  ];
  return <group>
    {rings.map(([radius, y], i) =>
      <mesh key={i} position={[0, y, 0]} rotation-x={Math.PI / 2} material={marble} receiveShadow>
        <torusGeometry args={[radius, 0.065, 6, 120]} />
      </mesh>
    )}
  </group>;
}


/**
 * A single reference-quality joinery bay at the east end of the window arcade.
 *
 * This is deliberately a reusable architectural grammar rather than dozens
 * of custom meshes scattered across the hall.  The visible forward surface
 * stays at radius >= 14.60 m, outside the 14.5 m column circulation boundary.
 * Former shelf, book and exhibit transforms are left completely unchanged.
 */
const ARCH_FRONT = -1.08;
const brass = new THREE.MeshStandardMaterial({
  color: '#be9d6a', metalness: 0.64, roughness: 0.44,
});
function referenceParts(bay: number) {
  const oak: Element[] = [];
  const stoneTrim: Element[] = [];
  const metal: Element[] = [];
  const part = (into: Element[], x: number, y: number, z: number,
                w: number, h: number, d: number) =>
    into.push(elem(bay, x, y, z, w, h, d));

  // Load-bearing pilasters; three-dimensional plinths and impost blocks.
  for (const x of [-2.22, 2.22]) {
    part(stoneTrim, x, 4.08, -0.89, 0.28, 7.58, 0.38);
    part(stoneTrim, x, 0.36, -0.98, 0.43, 0.55, 0.53);
    part(stoneTrim, x, 7.12, -0.99, 0.47, 0.36, 0.45);
    part(oak, x * 0.88, 3.83, -1.00, 0.11, 7.07, 0.16);
    part(oak, x * 0.88, 7.38, -1.07, 0.29, 0.13, 0.23);
  }

  // Recessed, solid timber shelves, stile and stepped cornice.
  part(oak, 0, 4.02, -0.94, 0.11, 7.10, 0.18);
  for (let level = 0; level <= 6; level++) {
    const y = 0.56 + level * 1.06;
    part(oak, 0, y, -1.00, 3.84, 0.11, 0.19);
    part(metal, 0, y + 0.064, -1.099, 3.72, 0.014, 0.016);
  }
  for (const [y, width, depth] of [[7.55, 4.05, 0.36], [7.72, 4.23, 0.32], [7.88, 4.38, 0.28]]) {
    part(oak, 0, y, -0.98, width, 0.13, depth);
  }
  // Recessed panel moulding and individually positioned dark-metal knobs.
  for (const x of [-1.0, 1.0]) {
    part(oak, x, 0.31, -1.02, 1.69, 0.38, 0.12);
    part(metal, x + (x > 0 ? -0.65 : 0.65), 0.32, -1.10, 0.045, 0.065, 0.032);
  }
  return { oak, stoneTrim, metal };
}

function ReferenceBay({ bay, geometry }: { bay: number; geometry: THREE.BoxGeometry }) {
  const { oak, stoneTrim, metal } = useMemo(() => referenceParts(bay), [bay]);
  const arch = useMemo(() => {
    // Dressed stone arch over the oak alcove. A real profiled solid in 3D,
    // not an emissive decal or a transparent painted outline.
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.02, 7.10, 0),
      new THREE.Vector3(-1.83, 7.60, 0),
      new THREE.Vector3(-1.18, 8.14, 0),
      new THREE.Vector3(0, 8.40, 0),
      new THREE.Vector3(1.18, 8.14, 0),
      new THREE.Vector3(1.83, 7.60, 0),
      new THREE.Vector3(2.02, 7.10, 0),
    ]);
    return new THREE.TubeGeometry(curve, 48, 0.17, 9, false);
  }, []);
  useEffect(() => () => arch.dispose(), [arch]);
  const a = bay * Math.PI * 2 / BAYS;
  return (
    <group>
      <InstancedTrim entries={oak} material={wood} geometry={geometry} />
      <InstancedTrim entries={stoneTrim} material={marble} geometry={geometry} />
      <InstancedTrim entries={metal} material={brass} geometry={geometry} castShadow={false} />
      <group
        position={[Math.sin(a) * RADIUS, 0, Math.cos(a) * RADIUS]}
        rotation-y={a}
      >
        <mesh geometry={arch} position={[0, 0, ARCH_FRONT]} material={marble} castShadow receiveShadow />
      </group>
    </group>
  );
}

/** Adds static craftsmanship only; original interaction IDs and station positions stay intact. */
export function ArchitecturalPolish() {
  const { oak, stonework } = useMemo(details, []);
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <group>
    <InstancedTrim entries={oak} material={wood} geometry={geometry} />
    <InstancedTrim entries={stonework} material={marble} geometry={geometry} />
    <WindowArches />
    <ReferenceBay bay={5} geometry={geometry} />
    <VaultTrim />
  </group>;
}
