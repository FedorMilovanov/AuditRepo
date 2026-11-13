import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { canvasTex } from "../textures";
import { marble, wood, goldMat, wax } from "./Platform";
import { READING_GEOMETRY as R } from "./readingGeometry";

/** Backwards-compatible export, intentionally invisible in natural-light mode. */
export function Beam(_props: { height?: number; r0?: number; r1?: number; color?: string; opacity?: number; power?: number }) { return null; }

function titlePage(side: "left" | "right") {
  return canvasTex(512, 640, (c, w, h) => {
    c.fillStyle = "#efe1bc"; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 150; i++) {
      const v = Math.sin(i * 34.123 + 6.1) * 10000;
      const x = (v - Math.floor(v)) * w;
      c.fillStyle = "rgba(100,82,50,.025)";
      c.fillRect(x, (i * 43) % h, 2, 3);
    }
    c.fillStyle = "#524532";
    c.textAlign = "center";
    c.font = '600 31px Georgia, serif';
    c.fillText(side === "left" ? "ГОСПОДЬ БОГ" : "— СИЛА МОЯ", w / 2, 140);
    c.strokeStyle = "#ab956e"; c.lineWidth = 2;
    c.beginPath(); c.moveTo(85, 173); c.lineTo(w - 85, 173); c.stroke();
    c.font = '24px Georgia, serif';
    const lines = side === "left"
      ? ["Господь Бог — сила моя:", "Он сделает ноги мои", "как у оленя и на", "высоты мои возведёт меня."]
      : ["Аввакум 3:19", "", "Библиотека богословия", "и истории Церкви"];
    lines.forEach((line, i) => c.fillText(line, w / 2, 248 + i * 48));
    c.font = 'italic 20px Georgia, serif';
    c.fillStyle = "#9b866b";
    c.fillText(side === "left" ? "Откройте книгу знаний" : "gospod-bog.ru", w / 2, 548);
  });
}

/** Carved solid-timber support: a continuous lathed profile, with 24 shallow
 * low-relief vertical flutes that follow the tapered shaft. No per-flute
 * separate draw calls, and no disconnected decorative objects.
 * The pedestal rests on the original stone plinth (top y=0.24) and ends
 * beneath the unchanged table elevation. All dimensions are in world metres.
 */
function lathedLecternPedestal() {
  const profile: [number, number][] = [
    [0, 0.26], [1.21, 0.26], [1.24, 0.28], [1.24, 0.32],
    [1.20, 0.37], [1.165, 0.405], [1.125, 0.48],
    [1.10, 0.62], [1.055, 0.79], [1.01, 0.95],
    [0.965, 1.12], [0.94, 1.28], [0.96, 1.35],
    [1.005, 1.42], [1.05, 1.46], [1.065, 1.49],
    [0, 1.49],
  ];
  const geom = new THREE.LatheGeometry(
    profile.map(([r, y]) => new THREE.Vector2(r, y)), 192,
  );
  const positions = geom.getAttribute('position') as THREE.BufferAttribute;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
    const r = Math.hypot(x, z);
    if (r < 0.2) continue;
    const enter = THREE.MathUtils.smoothstep(y, 0.41, 0.56);
    const leave = 1 - THREE.MathUtils.smoothstep(y, 1.24, 1.38);
    const flutes = Math.sin(Math.atan2(z, x) * 24) * 0.015 * enter * leave;
    positions.setXYZ(i, x * (1 + flutes / r), y, z * (1 + flutes / r));
  }
  positions.needsUpdate = true;
  geom.computeVertexNormals();
  geom.computeBoundingSphere();
  return geom;
}

/** Solid and beveled hardwood tabletop with moulded underside, not a flat
 * cylinder. The ring moulding stays horizontal and within its real edge. */
function bevelledReadingTabletop() {
  return new THREE.LatheGeometry([
    [0, 1.49], [1.90, 1.49], [1.99, 1.49],
    [2.045, 1.505], [2.075, 1.52], [2.105, 1.54],
    [2.135, 1.558], [2.135, 1.593], [2.11, 1.612],
    [2.06, R.tableTopY], [0, R.tableTopY],
  ].map(([r, y]) => new THREE.Vector2(r, y)), 128);
}

/** Central reading table: a physical open book, not a floating orb. */
export function Center() {
  const pedestal = useMemo(lathedLecternPedestal, []);
  const tabletop = useMemo(bevelledReadingTabletop, []);
  useEffect(() => () => {
    pedestal.dispose();
    tabletop.dispose();
  }, [pedestal, tabletop]);
  const left = useMemo(() => titlePage("left"), []);
  const right = useMemo(() => titlePage("right"), []);
  // Canvas textures are constructed outside R3F's JSX ownership and must be
  // released explicitly when the central exhibit unmounts.
  useEffect(() => {
    left.needsUpdate = true;
    right.needsUpdate = true;
    return () => { left.dispose(); right.dispose(); };
  }, [left, right]);
  return <group>
    <mesh position={[0, 0.12, 0]} material={marble} receiveShadow>
      <cylinderGeometry args={[2.55, 2.6, 0.24, 80]} />
    </mesh>
    <mesh geometry={pedestal} material={wood} castShadow receiveShadow dispose={null} />
    <mesh geometry={tabletop} material={wood} castShadow receiveShadow dispose={null} />
    {/* This is an inset tabletop-edge inlay. The old unrotated torus lay
        vertically through the room, producing a giant floating hoop. */}
    <mesh position={[0, 1.605, 0]} rotation-x={Math.PI / 2} material={goldMat}>
      <torusGeometry args={[2.104, 0.009, 8, 128]} />
    </mesh>
    {/* Two wooden back supports bear the elevated edge of the lectern.
        The front edge of the tilted volume rests just above the tabletop. */}
    {[-0.86, 0.86].map((x) => (
      <mesh key={x} position={[x, R.supportCenterY, R.supportCenterZ]} rotation-x={R.supportTiltX} material={wood} castShadow>
        <boxGeometry args={[0.14, R.supportHeight, R.supportDepth]} />
      </mesh>
    ))}
    {/* The book is angled toward the visitor's start position at +Z.
        Page planes are laid across the cover, rather than standing upright. */}
    <group position={[0, R.bookCenterY, R.bookCenterZ]} rotation-x={R.bookTiltX}>
      <mesh position={[0, R.coverLocalY, 0]} material={wood} castShadow><boxGeometry args={[2.3, R.coverThickness, R.coverDepth]} /></mesh>
      <mesh position={[0, 0.02, 0]} material={wax} castShadow><boxGeometry args={[2.19, 0.07, 1.50]} /></mesh>
      <mesh position={[-0.57, 0.078, 0]} rotation={[-Math.PI / 2, 0, 0.045]}>
        <planeGeometry args={[1.06, 1.42]} />
        <meshStandardMaterial map={left} side={THREE.DoubleSide} roughness={0.96} metalness={0} />
      </mesh>
      <mesh position={[0.57, 0.078, 0]} rotation={[-Math.PI / 2, 0, -0.045]}>
        <planeGeometry args={[1.06, 1.42]} />
        <meshStandardMaterial map={right} side={THREE.DoubleSide} roughness={0.96} metalness={0} />
      </mesh>
      <mesh position={[0, 0.065, 0]} material={goldMat}>
        <boxGeometry args={[0.017, 0.019, 1.45]} />
      </mesh>
    </group>
    <mesh position={[1.4, 1.83, -0.4]} material={wood} castShadow>
      <boxGeometry args={[0.51, 0.14, 0.72]} />
    </mesh>
    <mesh position={[1.4, 1.96, -0.4]} material={wax}>
      <boxGeometry args={[0.47, 0.13, 0.68]} />
    </mesh>
  </group>;
}
