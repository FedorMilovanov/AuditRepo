import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { marble, stone } from "./Platform";
import { CASEWORK } from "./caseworkScale";
import { useCaseworkWood, verticalGrainBoxGeometry } from "./CaseworkWood";

/**
 * Premium library envelope. Original interactive stations keep their canonical
 * positions; these bays are OUTSIDE the 14.5 m colonnade and do not take part
 * in navigation/raycasting. No emissive fantasy effects are used.
 *
 * Repeated book volumes use one draw call and deterministic per-instance colour.
 */
const BAYS = CASEWORK.bays;
const RADIUS = CASEWORK.radius;
const WINDOW_BAYS = new Set([7, 8, 9, 10, 11, 12]);
const SHELVED_BAYS = Array.from({ length: BAYS }, (_, i) => i).filter((i) => !WINDOW_BAYS.has(i) && i !== 0);
const SHELVES = CASEWORK.shelfRows;
const BOOKS = CASEWORK.booksPerShelf;
const COLOURS = ["#574537", "#62433b", "#465a51", "#695f4d", "#48484b", "#765e45", "#344c57", "#796a56"];

function seeded(n: number) {
  const x = Math.sin(n * 127.1 + 23.6) * 43758.5453123;
  return x - Math.floor(x);
}

function BookInstances() {
  const count = SHELVED_BAYS.length * SHELVES * BOOKS;
  const ref = useRef<THREE.InstancedMesh>(null!);
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.83, metalness: 0 }), []);
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  useLayoutEffect(() => {
    const mesh = ref.current;
    const object = new THREE.Object3D();
    let index = 0;
    for (const bay of SHELVED_BAYS) {
      const angle = (bay / BAYS) * Math.PI * 2;
      const sin = Math.sin(angle), cos = Math.cos(angle);
      for (let level = 0; level < SHELVES; level++) {
        for (let b = 0; b < BOOKS; b++) {
          const seed = bay * 10000 + level * 100 + b;
          const shift = ((b + 0.5) / BOOKS - 0.5) * CASEWORK.shelfWidth;
          const depth = -0.32 + (seeded(seed + 7) - 0.5) * 0.07;
          const h = CASEWORK.minVolumeHeight + seeded(seed + 3) * CASEWORK.volumeHeightVariation;
          const w = CASEWORK.minVolumeWidth + seeded(seed + 11) * CASEWORK.volumeWidthVariation;
          const y = CASEWORK.firstShelfY + CASEWORK.spineBaseAboveShelf + level * CASEWORK.shelfPitch + h * 0.5;
          object.position.set(sin * (RADIUS + depth) + cos * shift, y, cos * (RADIUS + depth) - sin * shift);
          object.rotation.set(0, angle, (seeded(seed + 41) - 0.5) * 0.055);
          object.scale.set(w, h, 0.37 + seeded(seed + 31) * 0.08);
          object.updateMatrix();
          mesh.setMatrixAt(index, object.matrix);
          mesh.setColorAt(index, new THREE.Color(COLOURS[Math.floor(seeded(seed + 17) * COLOURS.length)]));
          index++;
        }
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, []);
  return <instancedMesh ref={ref} args={[geometry, material, count]} castShadow={false} receiveShadow={false} />;
}

/**
 * Each shelving bay uses two instanced GPU draws instead of separate planks.
 * Individual bays remain frustum-cullable. These are the original ShelfBay transforms: no scene redesign,
 * route changes, hidden culling tricks or altered editorial items.
 */
type ShelfPart = {
  bay: number; x: number; y: number; z: number; w: number; h: number; d: number;
};
function shelfPart(bay: number, x: number, y: number, z: number, w: number, h: number, d: number): ShelfPart {
  return { bay, x, y, z, w, h, d };
}
function shelfParts(bay: number) {
  const stoneParts = [shelfPart(bay, 0, 4.1, 0.12, 4.50, 8.2, 0.25)];
  const woodHorizontal: ShelfPart[] = [];
  const woodVertical: ShelfPart[] = [
    shelfPart(bay, 0, 3.85, -0.04, 4.27, 7.45, 0.22),
  ];
  for (let level = 0; level <= SHELVES; level++) {
    woodHorizontal.push(shelfPart(bay, 0, CASEWORK.firstShelfY + level * CASEWORK.shelfPitch, -0.51, 4.27, 0.11, 0.71));
  }
  for (const x of [-2.13, 2.13]) {
    woodVertical.push(shelfPart(bay, x, 3.88, -0.44, 0.11, 7.55, 0.68));
  }
  woodHorizontal.push(shelfPart(bay, 0, 7.7, -0.39, 4.52, 0.22, 0.66));
  return { stoneParts, woodHorizontal, woodVertical };
}

/** Per-bay instancing retains frustum culling for rooms outside the camera. */
function InstancedShelfBay({ bay, geometry, verticalGeometry, casework }: {
  bay: number; geometry: THREE.BoxGeometry; verticalGeometry: THREE.BoxGeometry;
  casework: THREE.MeshStandardMaterial;
}) {
  const { stoneParts, woodHorizontal, woodVertical } = useMemo(() => shelfParts(bay), [bay]);
  const stoneRef = useRef<THREE.InstancedMesh>(null!);
  const woodHorizontalRef = useRef<THREE.InstancedMesh>(null!);
  const woodVerticalRef = useRef<THREE.InstancedMesh>(null!);
  const angle = (bay / BAYS) * Math.PI * 2;
  useLayoutEffect(() => {
    const pivot = new THREE.Object3D();
    const place = (mesh: THREE.InstancedMesh, parts: ShelfPart[]) => {
      parts.forEach(({ x, y, z, w, h, d }, i) => {
        pivot.position.set(x, y, z);
        pivot.rotation.set(0, 0, 0);
        pivot.scale.set(w, h, d);
        pivot.updateMatrix();
        mesh.setMatrixAt(i, pivot.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
    };
    place(stoneRef.current, stoneParts);
    place(woodHorizontalRef.current, woodHorizontal);
    place(woodVerticalRef.current, woodVertical);
  }, [stoneParts, woodHorizontal, woodVertical]);
  return (
    <group position={[Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS]} rotation-y={angle}>
      <instancedMesh ref={stoneRef} args={[geometry, stone, stoneParts.length]} receiveShadow dispose={null} />
      <instancedMesh ref={woodHorizontalRef} args={[geometry, casework, woodHorizontal.length]} receiveShadow dispose={null} />
      <instancedMesh ref={woodVerticalRef} args={[verticalGeometry, casework, woodVertical.length]} receiveShadow dispose={null} />
    </group>
  );
}
function InstancedShelfBays({ geometry, verticalGeometry, casework }: {
  geometry: THREE.BoxGeometry; verticalGeometry: THREE.BoxGeometry;
  casework: THREE.MeshStandardMaterial;
}) {
  return (
    <group>
      {SHELVED_BAYS.map((bay) => <InstancedShelfBay key={bay} bay={bay}
        geometry={geometry} verticalGeometry={verticalGeometry} casework={casework} />)}
    </group>
  );
}

const windowGlass = new THREE.MeshPhysicalMaterial({
  color: "#b9d5d6", transparent: true, opacity: 0.09,
  roughness: 0.06, metalness: 0.0, depthWrite: false, side: THREE.DoubleSide,
});
const windowMetal = new THREE.MeshStandardMaterial({
  color: "#4b5550", roughness: 0.58, metalness: 0.45,
});

/** Stone/window mullions are instanced within each cullable architectural bay. */
function WindowBay({ bay, geometry }: { bay: number; geometry: THREE.BoxGeometry }) {
  const a = (bay / BAYS) * Math.PI * 2;
  const stoneParts = useMemo(() => [
    [0, 0.9, 0, 4.50, 1.8, 0.45],
    [0, 7.5, 0, 4.5, 2.7, 0.46],
    [-2.17, 4.0, -0.08, 0.21, 4.5, 0.42],
    [2.17, 4.0, -0.08, 0.21, 4.5, 0.42],
    [0, 1.78, -0.27, 4.50, 0.15, 0.68],
  ], []);
  const metalParts = useMemo(() => [
    [0, 4.0, -0.22, 0.075, 4.5, 0.15],
    ...[2.75, 4.15, 5.6].map((y) => [0, y, -0.22, 4.3, 0.066, 0.15]),
  ], []);
  const stoneRef = useRef<THREE.InstancedMesh>(null!);
  const metalRef = useRef<THREE.InstancedMesh>(null!);
  useLayoutEffect(() => {
    const pivot = new THREE.Object3D();
    const place = (mesh: THREE.InstancedMesh, parts: number[][]) => {
      parts.forEach(([x, y, z, w, h, d], i) => {
        pivot.position.set(x, y, z);
        pivot.rotation.set(0, 0, 0);
        pivot.scale.set(w, h, d);
        pivot.updateMatrix();
        mesh.setMatrixAt(i, pivot.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
    };
    place(stoneRef.current, stoneParts);
    place(metalRef.current, metalParts);
  }, [stoneParts, metalParts]);
  return (
    <group position={[Math.sin(a) * RADIUS, 0, Math.cos(a) * RADIUS]} rotation-y={a}>
      <instancedMesh ref={stoneRef} args={[geometry, marble, stoneParts.length]} receiveShadow dispose={null} />
      <mesh position={[0, 4.0, -0.04]} material={windowGlass} dispose={null}>
        <planeGeometry args={[4.12, 4.35]} />
      </mesh>
      <instancedMesh ref={metalRef} args={[geometry, windowMetal, metalParts.length]} dispose={null} />
    </group>
  );
}

export function Architecture() {
  const casework = useCaseworkWood();
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const verticalGeometry = useMemo(verticalGrainBoxGeometry, []);
  useEffect(() => () => {
    geometry.dispose();
    verticalGeometry.dispose();
  }, [geometry, verticalGeometry]);
  return (
    <group>
      <InstancedShelfBays geometry={geometry} verticalGeometry={verticalGeometry} casework={casework} />
      {Array.from(WINDOW_BAYS).map((bay) => <WindowBay key={bay} bay={bay} geometry={geometry} />)}
      {/* Original entrance remains open: this is an exploration prototype, not a sealed maze. */}
      <group position={[0, 0, RADIUS]}>
        {[-1.72, 1.72].map(x => (
          <mesh key={x} position={[x, 4.1, 0]} material={marble} receiveShadow>
            <boxGeometry args={[0.75, 8.2, 0.58]} />
          </mesh>
        ))}
        <mesh position={[0, 7.18, 0]} material={marble} receiveShadow>
          <boxGeometry args={[4.3, 2.0, 0.54]} />
        </mesh>
      </group>
      <BookInstances />
    </group>
  );
}
