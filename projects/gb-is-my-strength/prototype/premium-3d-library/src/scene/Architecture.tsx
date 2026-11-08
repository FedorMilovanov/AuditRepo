import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { marble, stone, wood } from "./Platform";

/**
 * Premium library envelope. Original interactive stations keep their canonical
 * positions; these bays are OUTSIDE the 14.5 m colonnade and do not take part
 * in navigation/raycasting. No emissive fantasy effects are used.
 *
 * Repeated book volumes use one draw call and deterministic per-instance colour.
 */
const BAYS = 20;
const RADIUS = 15.85;
const WINDOW_BAYS = new Set([7, 8, 9, 10, 11, 12]);
const SHELVED_BAYS = Array.from({ length: BAYS }, (_, i) => i).filter((i) => !WINDOW_BAYS.has(i) && i !== 0);
const SHELVES = 6;
const BOOKS = 22;
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
          const shift = ((b + 0.5) / BOOKS - 0.5) * 4.03;
          const depth = -0.32 + (seeded(seed + 7) - 0.5) * 0.07;
          const h = 0.60 + seeded(seed + 3) * 0.30;
          const w = 0.15 + seeded(seed + 11) * 0.05;
          const y = 0.66 + level * 1.06 + h * 0.5;
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

function ShelfBay({ bay }: { bay: number }) {
  const a = (bay / BAYS) * Math.PI * 2;
  return (
    <group position={[Math.sin(a) * RADIUS, 0, Math.cos(a) * RADIUS]} rotation-y={a}>
      <mesh position={[0, 4.1, 0.12]} material={stone} receiveShadow>
        <boxGeometry args={[4.50, 8.2, 0.25]} />
      </mesh>
      <mesh position={[0, 3.85, -0.04]} material={wood} receiveShadow>
        <boxGeometry args={[4.27, 7.45, 0.22]} />
      </mesh>
      {Array.from({ length: SHELVES + 1 }, (_, i) => (
        <mesh key={i} position={[0, 0.56 + i * 1.06, -0.51]} material={wood} receiveShadow>
          <boxGeometry args={[4.27, 0.11, 0.71]} />
        </mesh>
      ))}
      {[-2.13, 2.13].map((x) => (
        <mesh key={x} position={[x, 3.88, -0.44]} material={wood} receiveShadow>
          <boxGeometry args={[0.11, 7.55, 0.68]} />
        </mesh>
      ))}
      <mesh position={[0, 7.7, -0.39]} material={wood}>
        <boxGeometry args={[4.52, 0.22, 0.66]} />
      </mesh>
    </group>
  );
}

function WindowBay({ bay }: { bay: number }) {
  const a = (bay / BAYS) * Math.PI * 2;
  return (
    <group position={[Math.sin(a) * RADIUS, 0, Math.cos(a) * RADIUS]} rotation-y={a}>
      <mesh position={[0, 0.9, 0]} material={marble} receiveShadow>
        <boxGeometry args={[4.50, 1.8, 0.45]} />
      </mesh>
      <mesh position={[0, 7.5, 0]} material={marble} receiveShadow>
        <boxGeometry args={[4.5, 2.7, 0.46]} />
      </mesh>
      {[-2.17, 2.17].map((x) => (
        <mesh key={x} position={[x, 4.0, -0.08]} material={marble} receiveShadow>
          <boxGeometry args={[0.21, 4.5, 0.42]} />
        </mesh>
      ))}
      <mesh position={[0, 4.00, -0.04]}>
        <planeGeometry args={[4.12, 4.35]} />
        <meshPhysicalMaterial color="#b9d5d6" transparent opacity={0.09} roughness={0.06} metalness={0.0} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 4.0, -0.22]}>
        <boxGeometry args={[0.075, 4.5, 0.15]} />
        <meshStandardMaterial color="#4b5550" roughness={0.58} metalness={0.45} />
      </mesh>
      {[2.75, 4.15, 5.6].map((y) => (
        <mesh key={y} position={[0, y, -0.22]}>
          <boxGeometry args={[4.3, 0.066, 0.15]} />
          <meshStandardMaterial color="#4b5550" roughness={0.58} metalness={0.45} />
        </mesh>
      ))}
      <mesh position={[0, 1.78, -0.27]} material={marble}>
        <boxGeometry args={[4.50, 0.15, 0.68]} />
      </mesh>
    </group>
  );
}

export function Architecture() {
  return (
    <group>
      {SHELVED_BAYS.map((bay) => <ShelfBay key={bay} bay={bay} />)}
      {Array.from(WINDOW_BAYS).map((bay) => <WindowBay key={bay} bay={bay} />)}
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
