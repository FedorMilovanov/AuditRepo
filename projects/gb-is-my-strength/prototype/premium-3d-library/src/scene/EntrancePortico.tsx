import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { marble, stone, goldMat } from "./Platform";
import { ENTRANCE_GEOMETRY as E } from "./entranceGeometry";
import { ExteriorLandscape } from "./ExteriorLandscape";

/**
 * A physically open, carved-stone entrance rather than two bare posts and
 * a rectangular sky cutout. Nothing is interactive or emissive. The colonnade
 * is beyond the existing walking boundary: no station, raycast or collision
 * ownership changes. Parts are instanced to preserve draw-call budgets.
 */
type Part = [x: number, y: number, z: number, w: number, h: number, d: number];

/** One reusable voussoir mesh, rotated about the arch's spring centre. */
function voussoir() {
  const half = Math.PI / E.archStones / 2;
  const section = new THREE.Shape();
  const outer = (angle: number) =>
    [Math.cos(angle) * E.outerRadius, Math.sin(angle) * E.outerRadius] as const;
  const inner = (angle: number) =>
    [Math.cos(angle) * E.innerRadius, Math.sin(angle) * E.innerRadius] as const;
  const o = outer(-half);
  section.moveTo(o[0], o[1]);
  for (let i = 1; i <= 6; i++) {
    const p = outer(-half + i * 2 * half / 6);
    section.lineTo(p[0], p[1]);
  }
  for (let i = 6; i >= 0; i--) {
    const p = inner(-half + i * 2 * half / 6);
    section.lineTo(p[0], p[1]);
  }
  section.closePath();
  const depth = 0.48;
  const geometry = new THREE.ExtrudeGeometry(section, {
    depth, steps: 1, bevelEnabled: true, bevelSegments: 1,
    bevelThickness: 0.012, bevelSize: 0.012, curveSegments: 6,
  });
  geometry.translate(0, 0, -depth / 2);
  geometry.computeBoundingSphere();
  return geometry;
}

function parts() {
  const stonework: Part[] = [];
  const inset: Part[] = [];
  const push = (to: Part[], ...p: Part) => to.push(p);
  // Near and far dressed-stone jambs frame the same open arch.
  for (const z of [0, E.faceDepth]) {
    for (const x of [-E.pierX, E.pierX]) {
      push(stonework, x, 3.18, z, E.pierWidth, 6.36, 0.70);
      push(stonework, x, 0.32, z - 0.08, 0.68, 0.64, 0.83);
      push(stonework, x, E.springY + 0.06, z - 0.08, 0.84, 0.27, 0.84);
      push(stonework, x, 6.62, z - 0.08, 0.80, 0.56, 0.80);
    }
    // True stone header, above the arch apex; no beam across the passage.
    push(stonework, 0, 7.40, z, 4.78, 1.64, 0.70);
    push(stonework, 0, 8.28, z - 0.08, 5.00, 0.20, 0.88);
    push(stonework, 0, 8.49, z - 0.06, 5.18, 0.12, 0.80);
    for (const x of [-E.pierX, E.pierX]) {
      push(inset, x, 0.70, z - 0.43, 0.45, 0.018, 0.04);
      push(inset, x, 5.10, z - 0.43, 0.45, 0.018, 0.04);
    }
  }
  // Real depth: continuous reveals, a coffered upper passage and pilasters.
  for (const x of [-2.12, 2.12]) {
    push(stonework, x, 3.54, E.faceDepth / 2, 0.55, 7.08, E.faceDepth);
    push(stonework, x, 0.19, E.faceDepth / 2, 0.66, 0.38, E.faceDepth);
    push(stonework, x, 7.13, E.faceDepth / 2, 0.69, 0.22, E.faceDepth);
    push(inset, x > 0 ? 1.825 : -1.825, 4.05, E.faceDepth / 2,
      0.03, 4.65, E.faceDepth - 0.36);
  }
  push(stonework, 0, 7.25, E.faceDepth / 2, 4.22, 0.28, E.faceDepth);
  for (const z of [0.64, 1.82, 3.0]) {
    push(inset, 0, 7.08, z, 3.65, 0.025, 0.036);
  }
  // A restrained open-air stone colonnade, visible through the portal.
  // It adds perspective and shadows without inventing inaccessible doors.
  for (const x of [-3.35, 3.35]) {
    for (const z of [5.65, 8.1]) {
      push(stonework, x, 3.02, z, 0.52, 6.04, 0.52);
      push(stonework, x, 0.34, z, 0.80, 0.68, 0.80);
      push(stonework, x, 6.18, z, 0.76, 0.35, 0.76);
    }
    push(stonework, x, 0.66, 6.88, 0.42, 1.32, 4.70);
  }
  for (const z of [5.65, 8.1]) {
    push(stonework, 0, 6.69, z, 7.12, 0.72, 0.61);
    push(stonework, 0, 7.13, z - 0.05, 7.30, 0.17, 0.72);
  }
  return { stonework, inset };
}

export function EntrancePortico() {
  const box = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const wedge = useMemo(voussoir, []);
  const { stonework, inset } = useMemo(parts, []);
  const stoneMesh = useRef<THREE.InstancedMesh>(null!);
  const insetMesh = useRef<THREE.InstancedMesh>(null!);
  const arches = useRef<THREE.InstancedMesh>(null!);

  useLayoutEffect(() => {
    const pivot = new THREE.Object3D();
    const apply = (mesh: THREE.InstancedMesh, entries: Part[]) => {
      entries.forEach(([x, y, z, w, h, d], i) => {
        pivot.position.set(x, y, E.radius + z);
        pivot.rotation.set(0, 0, 0);
        pivot.scale.set(w, h, d);
        pivot.updateMatrix();
        mesh.setMatrixAt(i, pivot.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
    };
    apply(stoneMesh.current, stonework);
    apply(insetMesh.current, inset);
    for (let face = 0; face < 2; face++) {
      for (let i = 0; i < E.archStones; i++) {
        const idx = face * E.archStones + i;
        pivot.position.set(0, E.springY, E.radius + face * E.faceDepth);
        pivot.rotation.set(0, 0, (i + 0.5) * Math.PI / E.archStones);
        pivot.scale.set(1, 1, 1);
        pivot.updateMatrix();
        arches.current.setMatrixAt(idx, pivot.matrix);
      }
    }
    arches.current.instanceMatrix.needsUpdate = true;
    arches.current.computeBoundingSphere();
  }, [stonework, inset]);

  useEffect(() => () => { box.dispose(); wedge.dispose(); }, [box, wedge]);

  return <group name="entrance-portico">
    <ExteriorLandscape />
    <instancedMesh ref={stoneMesh} args={[box, marble, stonework.length]}
      receiveShadow castShadow dispose={null} />
    <instancedMesh ref={insetMesh} args={[box, goldMat, inset.length]}
      receiveShadow={false} castShadow={false} dispose={null} />
    <instancedMesh ref={arches} args={[wedge, marble, E.archStones * 2]}
      receiveShadow castShadow dispose={null} />
    {/* Outside continuation starts at the existing circular floor's edge. */}
    <mesh
      rotation-x={-Math.PI / 2}
      position={[0, 0.008, (E.outsideFloorStart + E.outsideFloorEnd) / 2]}
      material={stone} receiveShadow>
      <planeGeometry args={[4.05, E.outsideFloorEnd - E.outsideFloorStart]} />
    </mesh>
  </group>;
}
