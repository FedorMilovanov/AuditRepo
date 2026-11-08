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
const stoneNormal = texture(new URL('../assets/pbr/limestone-normal.png', import.meta.url).href);
const oakMap = texture(new URL('../assets/pbr/oak-color.webp', import.meta.url).href, true);
const oakNormal = texture(new URL('../assets/pbr/oak-normal.png', import.meta.url).href);

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

function InstancedTrim({ entries, material }: { entries: Element[]; material: THREE.Material }) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  useEffect(() => () => geometry.dispose(), [geometry]);
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
  return <instancedMesh ref={ref} args={[geometry, material, entries.length]} castShadow receiveShadow dispose={null} />;
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

/** Adds static craftsmanship only; original interaction IDs and station positions stay intact. */
export function ArchitecturalPolish() {
  const { oak, stonework } = useMemo(details, []);
  return <group>
    <InstancedTrim entries={oak} material={wood} />
    <InstancedTrim entries={stonework} material={marble} />
    <WindowArches />
    <VaultTrim />
  </group>;
}
